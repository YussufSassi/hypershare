import express, { Request, Response } from "express"
import type { UploadedFile } from "express-fileupload"
import db from "../utils/prisma"
import S3Utils from "../utils/s3"
const router = express.Router()

router.post("/upload", async (req: Request, res: Response) => {
  const file = req.files?.file as UploadedFile
  const S3 = new S3Utils()
  if (!file) return res.status(400).json({ error: "No File" })
  const { name, md5, size, mimetype } = file

  /* 
  Disallow re-uploading of previously-reported files.
  */
  const isBanned = await db.reportedFile.findFirst({
    where: {
      hash: md5,
    },
  })

  if (isBanned?.banned)
    return res.status(403).json({
      error: `This file is banned, because it was previously reported. (${md5})`,
    })

  /* 
    Prevent dupes from being uploaded - Saves precious S3 storage!
  */
  const isAlreadyUploaded = await db.file.findFirst({
    where: {
      hash: md5,
    },
  })

  if (isAlreadyUploaded) {
    return res.json(isAlreadyUploaded)
  }

  await S3.upload({ data: file.data, id: md5 })

  //delete 30 days from now
  const deleteAt = new Date()
  deleteAt.setDate(deleteAt.getDate() + 30)

  const newFile = await db.file.create({
    data: {
      filename: name,
      hash: md5,
      downloads: 0,
      size: size,
      mimeType: mimetype,
      deleteAt: deleteAt,
    },
  })

  res.json(newFile)
})

export default router
