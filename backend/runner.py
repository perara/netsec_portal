import sys

import motor

from backend.analysis_engine.queue_manager import QueueManager
from backend.ng import NG
from backend.server import Webserver
from backend.docker_env import Docker

if __name__ == "__main__":

    if sys.argv[1] == "dev":
        ng = NG()
        ng.daemon = True
        ng.start()

    x = Docker()
    x.start("mongo", "ntt_mongodb", ["/data/db"], expose=[27017])
    x.start("perara/docker-suricata", "ntt_suricata", ["/var/log/suricata", "/pcaps", "/reports"], args=["-i eth0"])


    # docker run -it --net=host -v $(pwd)/logs:/var/log/suricata \
    # 	jasonish/suricata -i <interface>

    db = motor.MotorClient().ntt

    queue_manager = QueueManager(db)
    queue_manager.daemon = True
    queue_manager.start()

    s = Webserver(db, port=9999)
    s.run()
