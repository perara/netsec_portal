#!/usr/bin/python
import asyncio
import threading
import multiprocessing
from multiprocessing import Process

import socketio
import tornado.web

import tornado.platform.asyncio
import os
from backend import logger, websockets

# https://github.com/mongodb/motor/blob/master/doc/tutorial-tornado.rst#tutorial-using-motor-with-tornado
from backend.api.case import UploadCaseHandler, GetOneCaseHandler, RunCaseHandler, HumanHashHandler, \
    MetadataHandler, SingleHandler
from backend.api import case
from backend.api.case_object import DeleteObjectHandler, UploadObjectHandler, AnalyzeObjectHandler, UpdateObjectHandler
from backend.api.pcap import PCAPUploadHandler
from backend.api.settings import SettingsInsertHandler, SettingsDeleteHandler, SettingsGetHandler
from backend.websockets.case import CaseNamespace
from backend.websockets.pcap import PCAPNamespace

dir_path = os.path.dirname(os.path.realpath(__file__))


class Webserver(Process):

    def __init__(self, db, queue, port=9999, debug=False):
        Process.__init__(self)
        self.queue = queue
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
            (r'/api/case/hash', HumanHashHandler),
            (r'/api/case/upload', UploadCaseHandler),
            (r'/api/case/metadata', MetadataHandler),
            (r'/api/case/object/delete', case.DeleteObjectHandler),
            #(r'/api/case/analyze', AnalyzeCaseHandler),
            (r'/api/case/run', RunCaseHandler),
            (r'/api/case/(.*)', SingleHandler),



            # CaseObjects
            (r'/api/object/update', UpdateObjectHandler),
            (r'/api/object/analyze', AnalyzeObjectHandler),
            (r'/api/object/upload', UploadObjectHandler),
            (r'/api/object/delete', DeleteObjectHandler),

            # Administration
            (r'/api/settings/insert', SettingsInsertHandler),
            (r'/api/settings/delete', SettingsDeleteHandler),
            (r'/api/settings/get/(.*)', SettingsGetHandler),



            # Frontend
            (r'/(favicon.ico)', tornado.web.StaticFileHandler, {"path": os.path.join(dir_path, "..", "dist")}),
            (r'/(.*)', tornado.web.StaticFileHandler, {"default_filename": "index.html", 'path': os.path.join(dir_path, "..", "dist")}),

        ], debug=False)

    def run(self):
        tornado.platform.asyncio.AsyncIOMainLoop().install()
        ioloop = asyncio.get_event_loop()

        server = tornado.httpserver.HTTPServer(self._app)
        server.bind(9999)

        # Forks one process per CPU.
        # server.start(0)
        server.start(1)

        logger.web.info("Started Tornado-Webserver.")

        # Now, in each child process, create a MotorClient.
        self._app.settings['db'] = self.db

        asyncio.ensure_future(self.multiprocessing_handler(), loop=ioloop)
        ioloop.run_forever()

    async def multiprocessing_handler(self):

        while True:
            result = await self.queue.coro_get()

            if result["worker"] == "suricata":

                if result["fn"] == "done":
                    await self.sio.emit("pcap_processed", data=result, namespace="/pcap")


                print(result)
            else:
                raise NotImplementedError("Unhandled worker type %s" % result["worker"])





