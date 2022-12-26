import * as dotenv from "dotenv"

dotenv.config()

export interface IConfig {
  port: number
  version: string
  adminKey: string
  DBUrl: string
  S3Endpoint: string
  S3AccessKeyId: string
  S3SecretAccessKey: string
  S3Bucket: string
}
const config: IConfig = {
  port: (process.env.PORT as unknown as number) || 3000,
  version: process.env.VERSION || "0.0.0",
  DBUrl: process.env.DB_URL || "_",
  S3Bucket: process.env.S3_BUCKET || "hypershare",
  S3Endpoint: process.env.S3_ENDPOINT || "_",
  S3AccessKeyId: process.env.S3_ACCESS_KEY_ID || "_",
  S3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "_",
  adminKey: process.env.ADMIN_KEY || "123-changeme-now!",
}

export default config
