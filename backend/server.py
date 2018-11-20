#!/usr/bin/python
import threading
import multiprocessing
from multiprocessing import Process

import socketio
import tornado.web
from tornado.ioloop import IOLoop
from tornado.queues import Queue
import os
from backend import logger, websockets

# https://github.com/mongodb/motor/blob/master/doc/tutorial-tornado.rst#tutorial-using-motor-with-tornado
from backend.api.case import UploadCaseHandler, GetOneCaseHandler, GetAllCasesHandler, RunCaseHandler
from backend.api.pcap import PCAPUploadHandler
from backend.api.settings import SettingsAnalysisToolsHandler
from backend.websockets.case import CaseNamespace
from backend.websockets.pcap import PCAPNamespace

dir_path = os.path.dirname(os.path.realpath(__file__))


class Webserver(Process):

    def __init__(self, db, port=9999, debug=False):
        Process.__init__(self)
        self.db = db
        self._port = port
        self._debug = debug

        """Socket.IO - Definition."""
        self.sio = socketio.AsyncServer(async_mode='tornado')
        self.sio.register_namespace(CaseNamespace('/case'))
        self.sio.register_namespace(PCAPNamespace('/pcap'))
        self.sio.on("connect", websockets.connect, "/")
        self.sio.on("disconnect", websockets.connect, "/")

        """Tornado Web Server - Definition."""
        self._app  = tornado.web.Application([
            # Socket.IO
            (r"/socket.io/", socketio.get_tornado_handler(self.sio)),

            # PCAP
            (r'/api/pcap/upload', PCAPUploadHandler),

            # Case
            (r'/api/case/upload', UploadCaseHandler),
            (r'/api/case/get', GetAllCasesHandler),
            (r'/api/case/get/(.*)', GetOneCaseHandler),
            (r'/api/case/run', RunCaseHandler),

            # Administration
            (r'/api/settings/analysis_tools', SettingsAnalysisToolsHandler),

            # Frontend
            (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': os.path.join(dir_path, "..", "dist", "favicon.ico")}),
            (r'/(.*)', tornado.web.StaticFileHandler, {"default_filename": "index.html", 'path': os.path.join(dir_path, "..", "dist")}),

        ], debug=self._debug)

    def run(self):
        server = tornado.httpserver.HTTPServer(self._app)
        server.bind(9999)

        # Forks one process per CPU.
        # server.start(0)
        server.start(1)

        logger.web.info("Started Tornado-Webserver.")

        # Now, in each child process, create a MotorClient.
        self._app.settings['db'] = self.db

        IOLoop.current().start()






