from multiprocessing import Process


class AlarmStreamWorker(Process):

    def __init__(self, db):
        Process.__init__(self)
        self.db = db

    def start(self):
        pass