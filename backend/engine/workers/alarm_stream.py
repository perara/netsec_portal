from multiprocessing import Process


class AlarmStreamWorker(Process):

    def __init__(self, db, queue):
        Process.__init__(self)
        self.db = db
        self.queue = queue

    def start(self):
        pass