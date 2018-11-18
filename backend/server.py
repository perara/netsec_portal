#!/usr/bin/python
import threading
import motor
import tornado.web
from tornado.ioloop import IOLoop
import os
from backend import logger

# https://github.com/mongodb/motor/blob/master/doc/tutorial-tornado.rst#tutorial-using-motor-with-tornado
from backend.api.case import UploadCaseHandler, GetOneCaseHandler, GetAllCasesHandler, RunCaseHandler
from backend.api.settings import SettingsAnalysisToolsHandler

dir_path = os.path.dirname(os.path.realpath(__file__))


class Webserver(threading.Thread):

    def __init__(self, db, port=9999):
        threading.Thread.__init__(self)
        self.db = db
        self._port = port
        self._app  = tornado.web.Application([
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






