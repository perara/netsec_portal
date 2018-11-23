import tornado.web
from bson.json_util import loads, dumps


class UpdateObjectHandler(tornado.web.RequestHandler):

    async def post(self):
        db = self.settings["db"]

        case_object = loads(self.request.body)

        await db.objects.find_one_and_replace({
            '_id': case_object["_id"]
        }, case_object)

        self.write(dumps(case_object))
    get = post

class AnalyzeObjectHandler(tornado.web.RequestHandler):

    async def get(self):
        self.write({

        })
        return


class UploadObjectHandler(tornado.web.RequestHandler):

    async def get(self):
        self.write({

        })
        return


class DeleteObjectHandler(tornado.web.RequestHandler):

    async def get(self):
        self.write({

        })
        return

