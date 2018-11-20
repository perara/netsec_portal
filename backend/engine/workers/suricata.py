import json
from json import JSONDecodeError
from os import listdir
from os.path import join, isfile, getsize
from multiprocessing import Process
import asyncio
from motor import MotorGridFSBucket

from backend import logger, runtime_variables
from backend.engine.pcap.suricatasc import SuricataSocket
from backend.runtime_variables import suricata_full_pcap_path, suricata_full_report_path


class SuricataWorker(Process):

    def __init__(self, db):
        Process.__init__(self)
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
        await self.watch_pcap()
        await asyncio.sleep(1, loop=self.loop)
        asyncio.ensure_future(self.watch_handler(), loop=self.loop)
        asyncio.ensure_future(self.watch_logs(), loop=self.loop)

    async def watch_logs(self):

        for report_dir in [x for x in listdir(suricata_full_report_path) if not isfile(join(suricata_full_report_path, x))]:
            report_path = join(suricata_full_report_path, report_dir)
            parsed = True
            if "eve.json" in listdir(report_path):
                eve_file = join(report_path, "eve.json")
                b = getsize(eve_file)
                if b > 0:
                    """File has 'some' content."""

                items = []
                try:
                    """Try to parse json"""
                    with open(eve_file, "r") as f:
                        for line in f.readlines():
                            items.append(json.loads(line))
                except JSONDecodeError as e:
                    logger.suricata.warning("Could not decode json file at %s. Consider debugging!", eve_file)
                    parsed = False

                if parsed:
                    """Insert items into fs.files.metadata.alerts"""
                    await self.db["fs.files"].update_one(dict(filename=report_dir), {'$set': {
                        'metadata.alerts': items,
                        'metadata.processed': True
                    }})

    async def watch_pcap(self):

        async for grid in self.fsdb.find({
            "metadata.processed": False
        }):
            file_name = grid.filename
            file_body = grid.read()

            with open(join(suricata_full_pcap_path, file_name), "wb") as f:
                f.write(await file_body)

                x = SuricataSocket(
                    runtime_variables.suricata_full_socket_path,
                    runtime_variables.suricata_full_pcap_path,
                    runtime_variables.suricata_full_report_path,
                    runtime_variables.suricata_virtual_socket_path,
                    runtime_variables.suricata_virtual_pcap_path,
                    runtime_variables.suricata_virtual_report_path,
                    verbose=False)
                res = x.queue_pcap(file_name)