import shutil
from datetime import datetime
from json import JSONDecodeError
from os.path import join, isfile, getsize
from multiprocessing import Process
import asyncio

import aiofiles
from motor import MotorGridFSBucket
from pymongo import ReturnDocument

from backend import logger, runtime_variables
from backend.engine.pcap.suricatasc import SuricataSocket
from backend.runtime_variables import suricata_full_pcap_path, suricata_full_report_path


class SuricataWorker(Process):

    def __init__(self, db, queue):
        Process.__init__(self)
        self.queue = queue
        self.db = db
        self.fsdb = None
        self.change_stream = None
        self.loop = None

    def run(self):
        logger.suricata.info("Starting Suricata-watch Worker.")
        loop = asyncio.get_event_loop()
        self.loop = loop
        self.fsdb = MotorGridFSBucket(self.db)

        # Prevent "Task was destroyed but it is pending!"
        task = loop.create_task(self.watch_handler())
        loop.run_until_complete(task)
        loop.run_forever()

    async def watch_handler(self):
        await self.pcap_copy()
        await asyncio.sleep(5)
        await self.pcap_parse_results()
        await asyncio.sleep(1)
        await self.pcap_object_sync()
        await asyncio.sleep(1)
        await asyncio.ensure_future(self.watch_handler(), loop=self.loop)

    async def pcap_object_sync(self):

        async for task in self.db.tasks.find(dict(
            type="object_create",
        )):

            case_object = await self.db.objects.find_one(dict(
                _id=task["data"],
                type="pcap"
            ))

            if not case_object:
                continue

            file_metadata = await self.db["fs.files"].find_one({
                "metadata.sha256": case_object["sha256"],
                "metadata.analyzed": True
            })

            results = await self.db.objects.find_one_and_update(dict(
                _id=task["data"]
            ), {
                "$set": {
                    "data.pcap": file_metadata["metadata"]["data"],
                    "analyzed": True
                }
            })

            task["done_at"] = datetime.utcnow()
            await self.db.tasks_log.insert_one(task)
            await self.db.tasks.delete_one(dict(
                _id=task["_id"]
            ))

    async def pcap_parse_results(self):

        async for task in self.db.tasks.find(dict(
                type="pcap_fetch_result",
        )):

            report_path = join(suricata_full_report_path, task["data"])
            eve_path = join(report_path, "eve.json")

            if not isfile(eve_path):
                """Eve file does not exists. Wait."""
                continue

            if not getsize(eve_path) > 0:
                """Eve file is not populated. Wait."""

            try:
                async with aiofiles.open(eve_path, mode='r') as f:
                    data = [line async for line in f]
            except JSONDecodeError as e:
                logger.suricata.warning("Could not decode json file at %s. Consider debugging!", eve_path)
                continue

            """Update file metadata with results."""
            updated = await self.db["fs.files"].find_one_and_update(
                dict(filename=task["data"]),
                {'$set': {
                    'metadata.data.pcap': data,
                    'metadata.analyzed': True
                }},
                return_document=ReturnDocument.AFTER,
            )

            """This is a special case where files may have been deleted (by another user) meanwhile scanning."""
            if not updated or "_id" not in updated:
                logger.suricata.warning("Not able to update fs.files with filename=%s ", task["data"])
                continue

            """Delete report"""
            shutil.rmtree(report_path)

            """Insert task into log and remove from task queue."""
            task["done_at"] = datetime.utcnow()
            await self.db.tasks_log.insert_one(task)
            await self.db.tasks.delete_one(dict(
                _id=task["_id"]
            ))

    async def pcap_copy(self):

        """
        Routine to copy pcaps from mongodb => docker
        :return:
        """

        async for task in self.db.tasks.find({
            "type": "pcap_inserted"
        }):
            """
            {
            type: "pcap_inserted",
            data: <md5>
            date: <date>
            }
            """

            file_metadata = await self.db["fs.files"].find_one(dict(
                _id=task["data"]
            ))

            with open(join(suricata_full_pcap_path, file_metadata["filename"]), "wb") as f:
                await self.fsdb.download_to_stream(file_metadata["_id"], f)

            x = SuricataSocket(
                runtime_variables.suricata_full_socket_path,
                runtime_variables.suricata_full_pcap_path,
                runtime_variables.suricata_full_report_path,
                runtime_variables.suricata_virtual_socket_path,
                runtime_variables.suricata_virtual_pcap_path,
                runtime_variables.suricata_virtual_report_path,
                verbose=False)

            result = x.queue_pcap(file_metadata["filename"])

            if "return" not in result or result["return"] != "OK":
                continue

            task["done_at"] = datetime.utcnow()
            await self.db.tasks_log.insert_one(task)

            await self.db.tasks.delete_one(dict(
                _id=task["_id"]
            ))

            await self.db.tasks.insert_one(dict(
                type="pcap_fetch_result",
                data=file_metadata["filename"],
                date=datetime.utcnow()
            ))






