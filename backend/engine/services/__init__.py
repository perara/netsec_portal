

class BaseService:

    def ipv4(self):
        raise NotImplementedError("ipv4 is not implemented!")

    def ipv6(self):
        raise NotImplementedError("ipv6 is not implemented!")

    def dns(self):
        raise NotImplementedError("dns is not implemented!")

    def http(self):
        raise NotImplementedError("http is not implemented!")

    def url(self):
        raise NotImplementedError("http is not implemented!")

    def domain(self):
        raise NotImplementedError("http is not implemented!")
