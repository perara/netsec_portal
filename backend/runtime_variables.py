import os

dir_path = os.path.dirname(os.path.realpath(__file__))

docker_dir = os.path.join(dir_path, "docker")
mongodb_name = "ntt_mongodb"
suricata_name = "ntt_suricata"
suricata_socket = "suricata.socket"
suricata_virtual_socket_path = "/socket"
suricata_virtual_pcap_path = "/pcaps"
suricata_virtual_report_path = "/reports"
suricata_full_socket_path = os.path.join(docker_dir, suricata_name, "socket", suricata_socket)
suricata_full_pcap_path = os.path.join(docker_dir, suricata_name, "pcaps")
suricata_full_report_path = os.path.join(docker_dir, suricata_name, "reports")

tcp_port = 9999