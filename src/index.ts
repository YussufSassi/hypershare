import express from "express"
import expressFileUpload from "express-fileupload"
import IndexRoute from "./routes/Index"
import UploadRoute from "./routes/Upload"
import DownloadRoute from "./routes/Download"
import FileRoute from "./routes/File"
import ReportRoute from "./routes/Report"
import config from "./config/config"
import deleteExpiredFiles from "./jobs/deleteExpiredFiles"
import cors from "cors"
const app = express()

/* CORS Middleware https://expressjs.com/en/resources/middleware/cors.html */
app.use(cors())

/* 
  Initialize express-fileupload with 524MB max upload size.
*/
app.use(
  expressFileUpload({
    limits: { fileSize: 50 * 1024 * 1024 * 10 },
  })
)

//Routes
app.use(IndexRoute)
app.use(UploadRoute)
app.use(DownloadRoute)
app.use(FileRoute)
app.use(ReportRoute)
app.listen(config.port, () => {
  console.log(`Running on port ${config.port}`)
  /* Running cron job */
  deleteExpiredFiles()
})
