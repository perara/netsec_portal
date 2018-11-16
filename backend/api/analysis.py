import time
from bson.json_util import dumps
from backend.analysis_engine import engine
import tornado.web
import json

import hashlib



class UploadAnalysisHandler(tornado.web.RequestHandler):

    async def post(self):
        # Retrieve DB
        db = self.settings['db']

        # Retrieve post data
        data = json.loads(self.request.body)

        # Generate sha256 for analysis
        id_hash = hashlib.sha256(self.request.body).hexdigest()
        last_update = time.time()

        # Create new document for insertion
        new_document = dict(sha256=id_hash, last_update=last_update)
        new_document.update(data)

        # Check if document already exists
        n_documents = await db.analysis.count_documents(dict(sha256=id_hash))

        if n_documents == 0:
            inserted_document = await db.analysis.insert_one(new_document)
        else:
            self.set_status(500)  # TODO proper error code
            self.write(dict(
                success=True,
                data="Attempted insertion of analysis failed. Already exists!"
            ))
            return;

        self.set_status(200)
        self.write(dumps(dict(
            success=True,
            data=new_document
        )))
        self.set_header("Content-Type", "application/json")
        return

    get = post


class GetAnalysisHandler(tornado.web.RequestHandler):

    async def get(self):
        db = self.settings['db']

        results = [document async for document in db["analysis"].find({})]
        self.write(dumps(results))
        self.set_header("Content-Type", "application/json")


class AnalysisToolsHandler(tornado.web.RequestHandler):

    async def get(self):

        self.write({

        })
        return


class RunAnalysisHandler(tornado.web.RequestHandler):

    async def get(self):
        pass
        # Get running analysis

    async def post(self):
        db = self.settings['db']
        data = json.loads(self.request.body)

        if "analysis" not in data or "sha256" not in data["analysis"] or "services" not in data:
            self.set_status(500)  # TODO type
            self.write(dict(
                success=False,
                data="Input data is not valid."
            ))
            return

        sha256 = data["analysis"]["sha256"]
        services = data["services"]

        analysis = await db.analysis.find_one(dict(sha256=sha256))

        db.analysis_queue.insert_one(dict(
            sha256=analysis.sha256,
            done=False,
            started=False,
            last_update=int(time.time())
        ))

        self.set_status(200)
        self.write(dict(
            success=True,
            data=dict(
                queue_id=engine_analysis.sha256,
                message="Analysis queued in the analysis engine."
            )
        ))