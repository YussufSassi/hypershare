import express, { Request, Response } from "express"
import db from "../utils/prisma"

const router = express.Router()

router.get("/api/file/:id", async (req: Request, res: Response) => {
  const file = await db.file.findUnique({
    where: {
      id: req.params.id,
    },
  })

  const isBanned = await db.reportedFile.findFirst({
    where: {
      hash: file?.hash,
    },
  })

  if (isBanned?.banned)
    return res.status(403).json({
      error: `This file is banned, because it was previously reported. (${file?.hash})`,
    })

  if (!file)
    return res.status(404).json({
      error:
        "The file you are looking for couldn't be found. It might've been deleted!",
    })

  res.json(file)
})

export default router
