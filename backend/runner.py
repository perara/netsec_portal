import motor
from aioprocessing import AioQueue

from backend import db_validation
from backend.docker_env import Docker
from backend.engine.workers import workers
from backend.ng import NG
from backend.server import Webserver
import asyncio
import argparse

if __name__ == "__main__":
    process_queue = AioQueue()

    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dev", help="Set the application in developer mode.", action="store_true", default=False)
    args = parser.parse_args()

    """Start angular dev mode."""
    angular = NG()
    if args.dev:
        angular.daemon = True
        angular.start()

    """Start docker services."""
    x = Docker()
    x.start("mongo", "ntt_mongodb", ["/data/db"], expose=[27017])
    x.start("perara/docker-suricata", "ntt_suricata", ["/var/log/suricata", "/pcaps", "/reports", "/socket"], args=[])
    x.start("mariadb", "ntt_mariadb", [], expose=[3306], args=[], kwargs={
        "environment": {
            "MYSQL_ROOT_PASSWORD": "root"
        }
    })

    db = motor.MotorClient().ntt
    asyncio.get_event_loop().run_until_complete(db_validation.create_validation_scheme(db))
    db = motor.MotorClient().ntt


    """Start all workers."""
    processes = []
    for worker in workers:
        w = worker(db, process_queue)
        w.daemon = True
        w.start()
        processes.append(w)

    """Start Webserver."""
    web = Webserver(db, process_queue, port=9999)
    web.start()

    """Quit Application cleanly."""
    web.join()
    angular.join()
    [p.join() for p in processes]
