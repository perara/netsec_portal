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
            verbose=True)
        res = x.queue_pcap("2016-12-13-domaincop247.com-malspam-traffic.pcap")

        # Read results
        items = []
        with open(os.path.join(runtime_variables.suricata_full_report_path, fname, "eve.json"), "rb") as f:
            items.append(f.readline())


        print(items)
        self.write(dict(success=True, message=items))
        return

        #self.write(dict(success=False))
        #self.set_status(200)
