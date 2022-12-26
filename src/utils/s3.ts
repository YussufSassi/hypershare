import config from "../config/config"
import { S3 } from "aws-sdk"
interface Args {
  key: string
}
interface UploadArgs {
  id: string
  data: Buffer
}

class S3Utils {
  private client = new S3({
    endpoint: config.S3Endpoint,
    credentials: {
      accessKeyId: config.S3AccessKeyId,
      secretAccessKey: config.S3SecretAccessKey,
    },
    region: "auto",
    apiVersion: "v4",
  })
  public async download({ key }: Args) {
    const params = {
      Bucket: config.S3Bucket,
      Key: key,
    }

    return (await this.client.getObject(params).promise()).Body
  }

  public async upload({ id, data }: UploadArgs) {
    const params = {
      Bucket: config.S3Bucket,
      Key: id,
      Body: data,
    }

    return this.client.upload(params).promise()
  }

  public async delete({ key }: Args) {
    const params = {
      Bucket: config.S3Bucket,
      Key: key,
    }
    return this.client.deleteObject(params).promise()
  }
}

export default S3Utils
