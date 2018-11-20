import time

import tornado.web
import os
from backend import runtime_variables
from backend.pcap.suricatasc import SuricataSocket
import json

class PCAPUploadHandler(tornado.web.RequestHandler):

    async def post(self):


        fileinfo = self.request.files['file'][0]
        fname = fileinfo['filename']

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