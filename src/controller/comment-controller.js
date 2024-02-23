import CommentService from '../services/comment-service.js'
const commentService = new  CommentService();
 
export const createComment= async (req,res)=>
{
try {
    const response = await commentService.createComment (req.query.modelId,req.query.modelType,req.user.id,req.body.content)
    return res.status(200).json({
        success: true,
        data:response,
        err:{},
        message:"successfully created a new comment"
    })

} catch (error) {
   return res.status(500).json({
        success:false,
        data:{},
        err:error,
        message:"something went wrong2"
    })
}

}