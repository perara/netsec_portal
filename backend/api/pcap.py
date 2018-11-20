import tornado.web
from motor import MotorGridFSBucket
from backend import util


class PCAPUploadHandler(tornado.web.RequestHandler):

    async def post(self):
        db = self.settings["db"]
        fsdb = MotorGridFSBucket(db)
        success=False

        """Gather file data."""
        file_info = self.request.files['file'][0]
        file_name = file_info['filename']
        file_content = file_info['body']
        file_checksum = util.checksum(file_content)

        """Check if file exists already."""
        file_count = await db["fs.files"].count_documents({"metadata.checksum": file_checksum})
        if file_count == 0:
            """File does not exist, proceed with upload."""
            async with fsdb.open_upload_stream(file_name, metadata=dict(
                checksum=file_checksum,
                processed=False
            )) as grid_in:
                await grid_in.write(file_content)

            """Send success=true due to upload success. also refer to sha256."""
            success = True

        """Send success=false due to the upload failure, however, send the sha256 in return."""
        self.write(dict(
            success=success,
            message=file_checksum
        ))

        return