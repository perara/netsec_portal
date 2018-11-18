import docker as d
import docker.errors
from backend.logger import docker as logger
import os
dir_path = os.path.dirname(os.path.realpath(__file__))


class Docker:

    def __init__(self):

        if not self.is_available():
            raise BrokenPipeError("Docker is not available...")

        self.client = d.from_env()

    def is_available(self):
        return True

    def start(self, image_name, container_name, container_data_paths, expose=[], args=[]):
        data_dir = os.path.join(dir_path, "docker", container_name)
        os.makedirs(data_dir, exist_ok=True)

        path_links = ["%s:%s" % ((data_dir + x), x) for x in container_data_paths]

        image_full_name = image_name + ":latest"
        logger.info("Starting container %s", container_name)

        try:
            # logger.info("Downloading image %s. This may take a while...", image_full_name)
            # self.client.images.pull(image_full_name)

            logger.info("Starting container %s with the image %s", image_full_name, container_name)

            try:
                container = self.client.containers.get(container_name)
            except docker.errors.NotFound:
                container = self.client.containers.run(image_full_name, ' '.join(args),
                                                       name=container_name,
                                                       volumes=path_links,
                                                       ports={"%s/tcp" % x: "%s/tcp" % x for x in expose},
                                                       detach=True)

            if container.status != "running":
                container.start()

        except PermissionError as e:
            logger.warning("The user running this application does not have access to running docker commands. "
                           "Run the following and relog\n------\nsudo groupadd docker\nsudo usermod -aG docker $USER")

            raise PermissionError(e)


if __name__ == "__main__":

    x = Docker()
    x.start("mongo", "ntt_mongodb", "/data/db")