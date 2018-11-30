import threading
from subprocess import call
import os
from backend import logger

dir_path = os.path.dirname(os.path.realpath(__file__))


class NG(threading.Thread):
    def run(self):
        logger.angular.info("Starting ng build...")
        wd = os.getcwd()
        os.chdir(os.path.join(dir_path, "..", "frontend"))
        call(["/usr/bin/ng", "build", "--watch", "--aot"])
        os.chdir(wd)
        logger.angular.info("ng build started and listening.")


if __name__ == "__main__":
    x = NG()
    x.run()