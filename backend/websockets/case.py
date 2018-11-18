import socketio


class CaseNamespace(socketio.AsyncNamespace):

    def on_connect(self, sid, environ):
        print("CASE!")

    def on_disconnect(self, sid):
        pass

    async def on_my_event(self, sid, data):
        await self.emit('my_response', data)
