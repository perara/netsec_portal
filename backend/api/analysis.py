import time
import tornado.web
import json
from tinydb import TinyDB, Query

import hashlib

db = TinyDB('db.json')

class UploadAnalysisHandler(tornado.web.RequestHandler):


    def post(self):

        data = json.loads(self.request.body)
        data["_id"] = hashlib.sha256(self.request.body).hexdigest()
        data["last_update"] = time.time()

        if db.table("analysis").contains(Query()._id == data["_id"]):
            self.set_status(200)
            self.write({"status": "error", "message": "Analysis already exists!"})
            return

        db.table("analysis").insert(data)

        self.set_status(200)
        self.write({"status": "success"})
    get = post


class GetAnalysisHandler(tornado.web.RequestHandler):

    def get(self):
        data = db.table("analysis").all()
        self.write(json.dumps(data))
        self.set_header("Content-Type", "application/json")

class GetAnalysisToolsHandler(tornado.web.RequestHandler):
    pass


class RunAnalysis(tornado.web.RequestHandler):
    pass