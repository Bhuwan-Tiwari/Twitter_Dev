import TweetService from "../services/tweet-service.js";
import upload from "../config/file-upload-s3-config.js"

const singleUploader = upload.single('image')
const tweetservice = new  TweetService();                                                   //singluploader which has upload object act as an middleware
export const createTweet= async (req,res)=>
{
try {
      singleUploader(req,res,async function(err,data){
        if(err)
        {
            return res.status(500).json({error:err})
        }
        console.log('Image url is',req.file)   //req.file from aws s3
         const payload= {...req.body}        
         payload.image=req.file.location       // req.file.loaction is having url of uploaded image in aws s3
        const response = await tweetservice.create(payload)
        return res.status(201).json({
            success: true,
            data:response,
            err:{},
            message:"successfully created a new tweet"
        })
      })


} catch (error) {
   return res.status(500).json({
        success:false,
        data:{},
        err:error,
        message:"something went wrong"
    })
}

}