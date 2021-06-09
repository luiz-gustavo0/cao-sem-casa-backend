import aws from 'aws-sdk'
import crypto from 'crypto'
import multerS3 from 'multer-s3'

const s3 = new aws.S3()

export default {
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        const filename = `${hash.toString('hex')}-${file.originalname}`

        cb(null, filename)
      })
    }
  })
}

// import 'dotenv/config'
// import aws from 'aws-sdk'
// import crypto from 'crypto'
// import multerS3 from 'multer-s3'

// const s3 = new aws.S3()

// export default {
//   strorage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     acl: 'public-read',
//     key: (req, file, cb) => {
//       crypto.randomBytes(16, (err, hash) => {
//         if (err) {
//           cb(err)
//         }

//         const filename = `${hash.toString('hex')}-${file.originalname}`

//         cb(null, filename)
//       })
//     }
//   })
// }
