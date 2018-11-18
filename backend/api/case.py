import time
from bson.json_util import dumps
from backend.analysis_engine import engine
import tornado.web
import json

import hashlib



class UploadCaseHandler(tornado.web.RequestHandler):

    async def post(self):
        # Retrieve DB
        db = self.settings['db']

        # Retrieve post data
        data = json.loads(self.request.body)

        # Generate sha256 for case
        id_hash = hashlib.sha256(self.request.body).hexdigest()
        last_update = time.time()

        # Create new document for insertion
        new_document = dict(sha256=id_hash, last_update=last_update)
        new_document.update(data)

        # Check if document already exists
        n_documents = await db.case.count_documents(dict(sha256=id_hash))

        if n_documents == 0:
            inserted_document = await db.case.insert_one(new_document)
        else:
            self.set_status(400)
            self.write(dict(
                success=True,
                data="Attempted insertion of analysis failed. Already exists!"
            ))
            return

        self.set_status(200)
        self.write(dumps(dict(
            success=True,
            data=new_document
        )))
        self.set_header("Content-Type", "application/json")
        return

    get = post


class GetOneCaseHandler(tornado.web.RequestHandler):

    async def get(self, sha256):
        db = self.settings['db']

        case = await db.case.find_one(dict(sha256=sha256))

        if not case:
            self.set_status(400)
            self.write(dict(
                success=False,
                data="Attempted insertion of analysis failed. Already exists!"
            ))
            return

        self.write(dumps(case))
        self.set_header("Content-Type", "application/json")


class GetAllCasesHandler(tornado.web.RequestHandler):

    async def get(self):
        db = self.settings['db']

        results = [document async for document in db.case.find({})]
        self.write(dumps(results))
        self.set_header("Content-Type", "application/json")


class CaseToolsHandler(tornado.web.RequestHandler):

    async def get(self):

        self.write({

        })
        return


class RunCaseHandler(tornado.web.RequestHandler):

    async def get(self):
        pass
        # Get running case

    async def post(self):
        db = self.settings['db']
        data = json.loads(self.request.body)

        if "case" not in data or "sha256" not in data["case"] or "services" not in data:
            self.set_status(500)  # TODO type
            self.write(dict(
                success=False,
                data="Input data is not valid."
            ))
            return

        sha256 = data["case"]["sha256"]
        services = data["services"]

        case = await db.case.find_one(dict(sha256=sha256))

        db.analysis_queue.insert_one(dict(
            sha256=case.sha256,
            done=False,
            started=False,
            last_update=int(time.time())
        ))

        self.set_status(200)
        self.write(dict(
            success=True,
            data=dict(
                queue_id=case.sha256,
                message="Analysis queued in the analysis engine."
            )
        ))