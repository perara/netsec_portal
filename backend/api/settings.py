import json
import tornado.web
from bson.json_util import dumps, loads
from pymongo import ReturnDocument


class SettingsInsertHandler(tornado.web.RequestHandler):

    async def post(self):
        # Retrieve DB
        db = self.settings['db']

        # Retrieve post data
        data = loads(self.request.body)

        # Insert newest settings
        await db.settings.find_one_and_update(dict(
            _id=data["_id"]
        ), {
            "$set": data
        }, upsert=True, return_document=ReturnDocument.AFTER)

        self.write(dumps(data))
        self.set_header("Content-Type", "application/json")
        return
    get=post


class SettingsDeleteHandler(tornado.web.RequestHandler):

    async def post(self):
        # Retrieve DB
        db = self.settings['db']

        # Retrieve post data
        data = loads(self.request.body)

        # Insert newest settings
        await db.settings.delete_many(data)

        self.write(dumps(data))
        self.set_header("Content-Type", "application/json")
        return
    get=post


class SettingsGetHandler(tornado.web.RequestHandler):

    async def get(self, settings_type):

        db = self.settings['db']

        settings = [doc async for doc in db.settings.find(dict(
            settings_type=settings_type
        ))]

        if settings and len(settings) == 1:
            settings = settings[0]

        self.write(dumps(settings))
        self.set_header("Content-Type", "application/json")
        return
