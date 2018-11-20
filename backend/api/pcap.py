import time

import tornado.web
import os

from motor import MotorGridFSBucket

from backend import runtime_variables, util
from backend.engine.pcap.suricatasc import SuricataSocket
import json

class PCAPUploadHandler(tornado.web.RequestHandler):

    async def post(self):
        db = self.settings["db"]
        fsdb = MotorGridFSBucket(db)
        success=False

        """Gather file data."""
        file_info = self.request.files['file'][0]
        file_name = file_info['filename']
        file_content = file_info['body']
        file_checksum = util.checksum(file_content)

        """Check if file exists already."""
        file_count = await db["fs.files"].count_documents(dict(metadata={"checksum": file_checksum}))
        if file_count == 0:
            """File does not exist, proceed with upload."""
            async with fsdb.open_upload_stream(file_name, metadata=dict(
                checksum=file_checksum,
                processed=False
            )) as grid_in:
                await grid_in.write(file_content)

            """Send success=true due to upload success. also refer to sha256."""
            success = True

        """Send success=false due to the upload failure, however, send the sha256 in return."""
        self.write(dict(
            success=success,
            message=file_checksum
        ))

        return
        # Save PCAP
        fh = open(os.path.join(runtime_variables.suricata_full_pcap_path, fname), 'wb')
        fh.write(fileinfo['body'])
        fh.close()

        # TODO (threaded, worker)
        x = SuricataSocket(
            runtime_variables.suricata_full_socket_path,
            runtime_variables.suricata_full_pcap_path,
            runtime_variables.suricata_full_report_path,
            runtime_variables.suricata_virtual_socket_path,
            runtime_variables.suricata_virtual_pcap_path,
            runtime_variables.suricata_virtual_report_path,
            verbose=False)
        res = x.queue_pcap(fname)

        # Read results # TODO async?
        eve_path = os.path.join(runtime_variables.suricata_full_report_path, fname, "eve.json")
        while not os.path.exists(eve_path):
            time.sleep(.1)

        # Parse results
        items = []
        with open(eve_path, "r") as f:
            for line in f.readlines():
                items.append(json.loads(line))

        self.write(dict(success=True, message=items))
        self.set_header("Content-Type", "application/json")
        return