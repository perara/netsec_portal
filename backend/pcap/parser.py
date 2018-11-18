from dpkt import pcap, pcapng
import os
from dpkt.ethernet import Ethernet
from dpkt.tcp import TCP

def read_pcap(filepath):

    with open(filepath, "rb") as pcap_file:
        filename, file_extension = os.path.splitext(filepath)

        if file_extension == ".pcap":
            pcap_data = pcap.Reader(pcap_file)
        elif file_extension == ".pcapng":
            pcap_data = pcapng.Reader(pcap_file)
        else:
            raise ValueError("pcap and pcapng is supported!")

        for ts, buf in pcap_data:
            eth = Ethernet(buf)
            ip = eth.data
            tcp = ip.data



read_pcap("test.pcapng")