import db from "../utils/prisma"
import S3Utils from "../utils/s3"
import cron from "node-cron"

/* 
This cron job is used to delete expired files from S3 and the DB.
*/
async function deleteExpiredFiles() {
  const currentDate = new Date()
  const S3 = new S3Utils()
  const files = await db.file.findMany({
    where: {
      deleteAt: {
        lte: currentDate,
      },
    },
  })

  files.forEach(async (f) => {
    console.log(`Deleting ${f.id}`)
    await db.file.delete({
      where: {
        id: f.id,
      },
    })
    await S3.delete({ key: f.hash })
  })
}

export default function runJob() {
  /* Run deleteExpiredFiles function every 12 hours. */
  //cron.schedule("0 */12 * * *", deleteExpiredFiles)
  cron.schedule("* * * * *", deleteExpiredFiles)
}
