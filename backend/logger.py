import logging


formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)


# create logger with 'spam_application'
docker = logging.getLogger('ntt.docker')
docker.setLevel(logging.DEBUG)
docker.addHandler(ch)

angular = logging.getLogger('ntt.angular')
angular.setLevel(logging.DEBUG)
angular.addHandler(ch)

web = logging.getLogger('ntt.web')
web.setLevel(logging.DEBUG)
web.addHandler(ch)

queue_manager = logging.getLogger('ntt.queue_manager')
queue_manager.setLevel(logging.DEBUG)
queue_manager.addHandler(ch)