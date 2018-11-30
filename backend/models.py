from abc import ABC


class BaseModel(ABC):

    def __init__(self, db):
        pass

    async def delete_where(self, where):
        pass


class Task(BaseModel):
    __table__ = "task"

    async def get_all_tasks(self):
        pass

    async def _get_tasks_where(self):
        pass

    async def set_task_done(self, id):
        pass


class TaskLog(BaseModel):
    __table__ = "task_log"

