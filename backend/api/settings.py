import json
import pymongo

import tornado.web
from bson.json_util import dumps
import time

class SettingsAnalysisToolsHandler(tornado.web.RequestHandler):

    async def post(self):
        # Retrieve DB
        db = self.settings['db']

        # Retrieve post data
        data = json.loads(self.request.body)

        if "toolkits" not in data:
            self.set_status(400)
            self.write({
                "success": False,
                "message": "toolkits was not found in the data payload."
            })
            return

        if "services" not in data:
            self.set_status(400)
            self.write({
                "success": False,
                "message": "services was not found in the data payload."
            })
            return

        # Update timestamp
        data["time"] = int(time.time())

        # Insert newest settings
        result = await db.settings_toolkit.insert_one(data)

        self.write(dumps(data))
        self.set_header("Content-Type", "application/json")
        return

    async def get(self):
        # Retrieve DB
        db = self.settings['db']

        settings_toolkit = await db.settings_toolkit.find_one(sort=[('_id', pymongo.DESCENDING)])

        self.write(dumps(settings_toolkit))
        self.set_header("Content-Type", "application/json")
        return
