import humanhash
import tornado.web
from motor import MotorGridFSBucket
from backend import util
from scapy.all import rdpcap, tempfile, Scapy_Exception


class PCAPUploadHandler(tornado.web.RequestHandler):

    async def post(self):
        db = self.settings["db"]
        fsdb = MotorGridFSBucket(db)
        success = False

        """Gather file data."""
        file_info = self.request.files['file'][0]
        file_name = file_info['filename']
        file_content = file_info['body']
        file_checksum = util.checksum(file_content)

        """Check if file exists already."""
        document = await db["fs.files"].find_one({"metadata.checksum": file_checksum})
        if document:
            document_id = str(document["_id"])
            uploaded = False
        else:
            """Esure that the uploaded file is parsable as PCAP."""
            try:
                ftmp = tempfile.NamedTemporaryFile(delete=True)
                ftmp.write(file_content)
                ftmp.flush()
                rdpcap(ftmp.name)
                ftmp.close()
            except Scapy_Exception as e:
                self.write(dict(
                    success=False,
                    data=dict(
                        message="Submitted file does not qualify as a PCAP file.",
                        exception=str(e)
                    )
                ))
                self.set_status(500)
                return

            """File does not exist, proceed with upload."""
            async with fsdb.open_upload_stream(file_name, metadata=dict(
                    sha256=file_checksum,
                    analyzed=False,
            )) as grid_in:
                document_id = str(grid_in._id)
                uploaded = True
                await grid_in.write(file_content)

            """Send success=true due to upload success. also refer to sha256."""
            success = True

        """Send success=false due to the upload failure, however, send the sha256 in return."""
        self.write(dict(
            success=success,
            data=dict(
                filename=file_name,
                id=document_id,
                sha256=file_checksum,
                uploaded=uploaded,
            )
        ))

        return
