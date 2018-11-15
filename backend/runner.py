import sys
import subprocess

from backend.ng import NG
from backend.server import Webserver

if __name__ == "__main__":

    if sys.argv[1] == "dev":
        ng = NG()
        ng.daemon = True
        ng.start()

    s = Webserver(port=9999)
    s.run()