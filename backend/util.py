from hashlib import sha256


def checksum(data):
    chk = sha256()
    chk.update(data)
    return chk.hexdigest()