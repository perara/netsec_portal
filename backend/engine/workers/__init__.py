from backend.engine.workers.alarm_stream import AlarmStreamWorker
from backend.engine.workers.suricata import SuricataWorker

workers = [AlarmStreamWorker, SuricataWorker]