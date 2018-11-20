import time
from multiprocessing import Process
import asyncio
from backend import logger
from backend.analysis_engine import engine

ANALYSIS_QUEUE_WAIT = 1


class QueueManager(Process):

    def __init__(self, db):
        Process.__init__(self)
        self.db = db

    def run(self):
        logger.queue_manager.info("Starting Queue-Manager.")
        loop = asyncio.get_event_loop()
        task = loop.create_task(self.tasks())
        loop.run_until_complete(task)

    async def tasks(self):
        while True:
            await self.analysis_queue_processor()
            await self.feed_queue()

    async def feed_queue(self):
        time.sleep(ANALYSIS_QUEUE_WAIT)

    async def analysis_queue_processor(self):

        started_count = await self.db.analysis_queue.count_documents(dict(started=True))

        # Sleep if there is ongoing analysis
        if started_count != 0:
            time.sleep(ANALYSIS_QUEUE_WAIT)
            return

        queued_item = await self.db.analysis_queue.find_one(dict(started=False))

        if not queued_item:
            time.sleep(ANALYSIS_QUEUE_WAIT)
            return

        analysis = queued_item.analysis
        services = queued_item.services

        engine_analysis = engine.Analysis(analysis, services, self.db)
        engine_analysis.start()





