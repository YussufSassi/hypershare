# Hypershare Server

This API is written with expressJS and prisma in typescript. It uses S3 as the storage provider, so any service with a compatible API will work (Production site is using cloudflare R2).

## Setting it up

First, you need to edit or create `.env` with the following info:

```env
PORT=<Port used for the API>
VERSION="0.0.1"
ADMIN_KEY=<Key used for processing deletion requests>
DB_URL=<MySQL connection string, should look like this: mysql://root:pass@host:port/db>
S3_BUCKET=<S3 Bucket name>
S3_ENDPOINT=<S3 Endpoint>
S3_ACCESS_KEY_ID=<S3 Access Key ID>
S3_SECRET_ACCESS_KEY=<S3 Access Key>
```

### Run dev server

`npm run dev`

## Build for production

`npm run build`

## Start production server

`npm start`
