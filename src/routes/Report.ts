import express, { Request, Response } from "express"
import db from "../utils/prisma"
import config from "../config/config"
import S3Utils from "../utils/s3"
const router = express.Router()
router.use(express.json())
router.post("/api/file/:id/report", async (req: Request, res: Response) => {
  const { email, reason } = req.body

  if (!email || !reason)
    return res
      .status(400)
      .json({ error: "You need to enter an e-mail and a reason!" })

  const file = await db.file.findUnique({
    where: {
      id: req.params.id,
    },
  })

  if (!file)
    return res.status(404).json({
      error:
        "The file you are trying to report doesn't exist! It might've been deleted.",
    })

  const newReport = await db.reportedFile
    .create({
      data: {
        banned: false,
        hash: file.hash,
        reason: reason,
        reportedBy: email,
        reportId: file.id,
      },
    })
    .catch((e) => {
      console.log(e)
      return res
        .status(500)
        .json({ error: "There was an error while processing your request!" })
    })

  res.json(newReport)
})

/* 
    Admin route for accepting or denying takedown requests.
    Make sure you set an admin password in your .env file!
*/

router.post(
  "/api/file/:id/report/process",
  async (req: Request, res: Response) => {
    const { apikey, action } = req.body
    const S3 = new S3Utils()

    /* Handle input errors */
    if (!apikey)
      return res.status(401).json({ error: "Your API key is missing!" })
    if (apikey != config.adminKey)
      return res.status(403).json({ error: "You API key is invalid!" })

    if (!action) return res.status(400).json({ error: "Action is missing!" })
    const file = await db.file.findUnique({
      where: {
        id: req.params.id,
      },
    })
    if (!file)
      return res.status(404).json({
        error:
          "The file you are trying to process doesn't exist! It might've been deleted.",
      })

    if (action == "accept") {
      const acceptReport = await db.reportedFile.update({
        where: {
          reportId: file.id,
        },
        data: {
          banned: true,
        },
      })
      res.json(acceptReport)
      await S3.delete({
        key: file.hash,
      })
    }

    if (action == "reject") {
      const rejectReport = await db.reportedFile.update({
        where: {
          reportId: file.id,
        },
        data: {
          banned: false,
        },
      })
      res.json(rejectReport)
    }
  }
)

export default router
