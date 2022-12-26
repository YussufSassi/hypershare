import express, { Request, Response } from "express"
import db from "../utils/prisma"
import S3Utils from "../utils/s3"
const router = express.Router()

router.get("/d/:id", async (req: Request, res: Response) => {
  const fId = req.params.id
  const S3 = new S3Utils()
  const file = await db.file.findFirst({
    where: {
      id: fId,
    },
  })

  /* 
    Check if file exists
  */
  if (!file)
    return res.status(404).json({
      error:
        "The file you are looking for couldn't be found. It might've been deleted!",
    })

  /* 
    Check if the file is banned.  
  */

  const isBanned = await db.reportedFile.findFirst({
    where: {
      hash: file?.hash,
    },
  })

  if (isBanned?.banned)
    return res.status(403).json({
      error: `This file is banned, because it was previously reported. (${file?.hash})`,
    })

  /* 
        Fetch file's content from S3 endpoint.
 */
  const fileData = await S3.download({ key: file.hash })

  /* 
    Headers for correct filename and file size, respectively.
  */
  res.set("Content-Disposition", `attachment; filename="${file.filename}"`)
  res.set("Content-Length", `${file.size}`)
  res.send(fileData)

  /* 
    Update download counter and reset expiry date after sending file
  */
  const deleteAt = new Date()
  deleteAt.setDate(deleteAt.getDate() + 30)
  await db.file.update({
    data: {
      downloads: file.downloads + 1,
      deleteAt: deleteAt,
    },
    where: {
      id: file.id,
    },
  })
})

export default router
