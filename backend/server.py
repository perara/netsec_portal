#!/usr/bin/python
import threading

import tornado.web
from tornado.ioloop import IOLoop
from tornado import gen
import time
import os

from backend.api.analysis import UploadAnalysisHandler, GetAnalysisHandler

dir_path = os.path.dirname(os.path.realpath(__file__))


class Webserver(threading.Thread):

    def __init__(self, port=9999):
        threading.Thread.__init__(self)

        self._port = port
        self._app  = tornado.web.Application([
            (r'/api/analysis/upload', UploadAnalysisHandler),
            (r'/api/analysis/get', GetAnalysisHandler),
            #(r"/test", TestHandler),
            (r'/(favicon\.ico)', tornado.web.StaticFileHandler, {'path': os.path.join(dir_path, "..", "dist", "favicon.ico")}),
            (r'/(.*)', tornado.web.StaticFileHandler, {"default_filename": "index.html", 'path': os.path.join(dir_path, "..", "dist")}),

        ])


    def run(self):
        self._app.listen(9999)
        IOLoop.instance().start()





