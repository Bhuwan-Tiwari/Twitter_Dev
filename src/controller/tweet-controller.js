import TweetService from "../services/tweet-service.js";

const tweetservice = new  TweetService();
 
export const createTweet= async (req,res)=>
{
try {
    const response = await tweetservice.create(req.body)
    return res.status(201).json({
        success: true,
        data:response,
        err:{},
        message:"successfully created a new tweet"
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