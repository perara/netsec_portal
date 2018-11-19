#!/usr/bin/python
import threading
import multiprocessing
import socketio
import tornado.web
from tornado.ioloop import IOLoop
from tornado.queues import Queue
import os
from backend import logger

# https://github.com/mongodb/motor/blob/master/doc/tutorial-tornado.rst#tutorial-using-motor-with-tornado
from backend.api.case import UploadCaseHandler, GetOneCaseHandler, GetAllCasesHandler, RunCaseHandler
from backend.api.pcap import PCAPUploadHandler
from backend.api.settings import SettingsAnalysisToolsHandler
from backend.websockets.case import CaseNamespace
from backend.websockets.pcap import PCAPNamespace

dir_path = os.path.dirname(os.path.realpath(__file__))


class Webserver(threading.Thread):

    @staticmethod
    def connect(sid, environ=None):
        print('connect ', sid)

    @staticmethod
    def disconnect(sid):
        print('disconnect ', sid)

    def __init__(self, db, port=9999):
        threading.Thread.__init__(self)

        self.sio = socketio.AsyncServer(async_mode='tornado')
        self.sio.register_namespace(CaseNamespace('/case'))
        self.sio.register_namespace(PCAPNamespace('/pcap'))


        self.sio.on("connect", Webserver.connect, "/")
        self.sio.on("disconnect", Webserver.connect, "/")

        self.db = db
        self._port = port
        self._app  = tornado.web.Application([
            (r"/socket.io/", socketio.get_tornado_handler(self.sio)),
            (r'/api/pcap/upload', PCAPUploadHandler),
            (r'/api/case/upload', UploadCaseHandler),
            (r'/api/case/get', GetAllCasesHandler),
            (r'/api/case/get/(.*)', GetOneCaseHandler),
            (r'/api/case/run', RunCaseHandler),
            (r'/api/settings/analysis_tools', SettingsAnalysisToolsHandler),

            (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': os.path.join(dir_path, "..", "dist", "favicon.ico")}),
            (r'/(.*)', tornado.web.StaticFileHandler, {"default_filename": "index.html", 'path': os.path.join(dir_path, "..", "dist")}),

        ], debug=True, autoreload=True)

    def run(self):
        server = tornado.httpserver.HTTPServer(self._app)
        server.bind(9999)

        # Forks one process per CPU.
        # server.start(0)
        server.start(1)

        logger.web.info("Webserver started.")

        # Now, in each child process, create a MotorClient.
        self._app.settings['db'] = self.db

        IOLoop.current().start()






