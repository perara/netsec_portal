import hashlib
from multiprocessing import Process
import random
import time


class Analysis(Process):

    def __init__(self, analysis, services, db):
        super().__init__()
        self.analysis = analysis
        self.services = services
        self.sha256 = random.getrandbits(256)

    def run(self):
        print(self.analysis)
        print(self.services)
        print(self.db)
        while True:
            pass