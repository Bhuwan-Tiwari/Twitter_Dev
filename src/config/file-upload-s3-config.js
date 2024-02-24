import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

aws.config.update({
    accessKeyId: process.env.accessKeyId,
    region:process.env.AWS_REGION,
    secretAccessKey: process.env.secretAccessKey
})
const s3 = new aws.S3()

const upload = multer({         //when multer is getting aa file to be upload it handling thorigh multer s3
                                // which is sending all of the file though aws crdencials (aws.config.update) on this bucket with acl
    storage : multerS3({
        s3:s3,
        bucket:process.env.BUCKET_NAME,
        acl:'public-read',     //ackel (acl)  tell us about accessiblity with this meta data and this file name
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});  //cb is a call back
          },
          key: function (req, file, cb) {
            cb(null, Date.now().toString())
          }
    })
})

export default upload