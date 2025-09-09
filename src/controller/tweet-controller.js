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
         const payload= {...req.body, userId: req.user.id}  // Add userId to payload
         if (req.file && req.file.location) {
            payload.image = req.file.location       // req.file.location is url of uploaded image in aws s3
         }
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
export const getFeed = async (req, res) => {
  try {
    const tweetsLimit = Number(req.query.tweetsLimit || 20)
    const tagsLimit = Number(req.query.tagsLimit || 10)
    const response = await tweetservice.getFeed({ tweetsLimit, tagsLimit })
    return res.status(200).json({
      success: true,
      data: response,
      err: {},
      message: 'successfully fetched feed'
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

export const getTweet = async (req, res) => {
  try {
    const tweet = await tweetservice.getTweetWithComments(req.params.id)
    return res.status(200).json({
      success: true,
      data: tweet,
      err: {},
      message: 'successfully fetched tweet'
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

export const deleteTweet = async (req, res) => {
  try {
    await tweetservice.deleteTweet(req.params.id, req.user.id)
    return res.status(200).json({
      success: true,
      data: {},
      err: {},
      message: 'successfully deleted tweet'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      err: error,
      message: error.message || "something went wrong"
    })
  }
}

export const updateTweet = async (req, res) => {
  try {
    const response = await tweetservice.updateTweet(req.params.id, req.user.id, req.body)
    return res.status(200).json({
      success: true,
      data: response,
      err: {},
      message: 'successfully updated tweet'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      err: error,
      message: error.message || "something went wrong"
    })
  }
}
