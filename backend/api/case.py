import datetime
import time
from bson.json_util import dumps
import tornado.web
import json
import humanhash
import hashlib

from pymongo import ReturnDocument


class MetadataHandler(tornado.web.RequestHandler):

    async def get(self):
        """Retrieve Metadata for cases"""
        db = self.settings['db']

        results = [doc async for doc in db.case.aggregate([
            # Include root object
            {"$lookup": {
                "localField": "root",
                "from": "objects",
                "foreignField": "_id",
                "as": "root"
            }},

            # Count files
            {"$addFields": {
                "objects": {"$size": "$objects"}
            }},

            # Reproject root from list to object
            {"$addFields": {
                "root": {"$arrayElemAt": ["$root", 0]}
            }}
        ])]

        self.write(dumps(results))
        self.set_header("Content-Type", "application/json")


async def post(self):
    pass


class MetadataUploadHandler(tornado.web.RequestHandler):

    async def get(self):
        pass

    async def post(self):
        pass


class ListHandler(tornado.web.RequestHandler):

    async def get(self, match=None, single=False):
        """Retrieve Metadata for cases"""
        db = self.settings['db']

        pipeline = []

        if match:
            pipeline.append({"$match": match})

        pipeline.extend([{"$lookup": {
            "localField": "objects",
            "from": "objects",
            "foreignField": "_id",
            "as": "objects"
        }},
            {"$lookup": {
                "localField": "root",
                "from": "objects",
                "foreignField": "_id",
                "as": "root"
            }},
            # Reproject root from list to object
            {"$addFields": {
                "root": {"$arrayElemAt": ["$root", 0]}
            }}

        ])

        results = [doc async for doc in db.case.aggregate(pipeline)]

        if single and len(results) > 0:
            results = results[0]

        self.write(dumps(results))

    async def post(self):
        pass


class SingleHandler(tornado.web.RequestHandler):

    async def get(self, sha256):
        await ListHandler.get(self, match={"sha256": sha256}, single=True)
        self.set_header("Content-Type", "application/json")
        return

    async def post(self):
        pass


class HumanHashHandler(tornado.web.RequestHandler):

    async def get(self):
        self.write({
            "success": True,
            "data": humanhash.uuid(words=3)[0]
        })

    async def post(self):
        pass


class UploadCaseHandler(tornado.web.RequestHandler):

    async def post(self):
        """Retrieve db context."""
        db = self.settings['db']

        """Retrieve data from post request."""
        data = json.loads(self.request.body)
        objects = data["objects"]
        root = data["root"]
        case_identifier = data["case_identifier"]

        # Generate sha256 for case
        id_hash = hashlib.sha256(self.request.body).hexdigest()

        """Verify if the object already exists in the database or create it."""
        db_objects = [await db.objects.find_one_and_update(dict(
            name=x["name"],
            type=x["type"]
        ), {
            "$set": {
                "name": x["name"],
                "type": x["type"],
                "parent": x["parent"],
                "children": x["children"],
                "analyzed": x["analyzed"],
                "last_update": datetime.datetime.utcnow()
            }
        }, upsert=True, return_document=ReturnDocument.AFTER) for x in objects]

        case_data = dict(
            identifier=case_identifier,
            sha256=id_hash,
            last_update=datetime.datetime.utcnow(),
            root=next(filter(lambda x: str(x["name"]) == str(root["name"]) and str(x["type"]) == str(root["type"]),
                             db_objects))["_id"],
            objects=[x["_id"] for x in db_objects],
            status="open"  # TODO
        )

        the_case = await db.case.find_one(dict(sha256=id_hash))

        if not the_case:
            await db.case.insert_one(case_data)
            the_case = await db.case.find_one(dict(sha256=id_hash))
            self.set_status(200)
            self.write(dumps(dict(
                success=True,
                data=dumps(the_case)
            )))
            self.set_header("Content-Type", "application/json")
            return

        self.set_status(400)
        self.write(dict(
            success=True,
            data="Attempted insertion of analysis failed. Already exists!"
        ))
        self.set_header("Content-Type", "application/json")

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
