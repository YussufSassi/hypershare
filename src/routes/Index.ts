import express, { Request, Response } from "express"
import config from "../config/config"
const router = express.Router()
router.get("/", (req: Request, res: Response) => {
  res.json({
    info: "You are accessing the HyperShare API. Please visit our API docs so you can see how it works!",
    version: config.version,
  })
})
export default router
