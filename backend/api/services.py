import tornado.web


class ListHandler(tornado.web.RequestHandler):
    """
    List all available services. Typically Virustotal, etc
    """

    async def get(self):
        pass

    async def post(self):
        pass


