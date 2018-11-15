import threading
from subprocess import call
import os
dir_path = os.path.dirname(os.path.realpath(__file__))


class NG(threading.Thread):
    def run(self):
        wd = os.getcwd()
        os.chdir(os.path.join(dir_path, "..", "frontend"))
        call(["/usr/bin/ng", "build", "--watch", "--aot"])
        os.chdir(wd)


