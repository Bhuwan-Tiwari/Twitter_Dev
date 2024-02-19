import { commentRepository, TweetRepository } from "../repository/index.js"

class CommentService {
    constructor() {
        this.CommenRepository = new commentRepository();
        this.TweetRepository = new TweetRepository();
    }
    async createComment(modelId,modelType,userId,content) {
        if (modelType == 'Tweet') {
            var commentable = await this.TweetRepository.get(modelId) //tweet
        } else if (modelType == 'Comment') {
            var commentable = await this.CommenRepository.get(modelId) //comment
            console.log("commentable",commentable)
        } else {
            throw new Error('unknown model type');
        }

        const comment = await this.CommenRepository.create(
            {
                content: content,
                userId: userId,
                onModel: modelType,
                commentable: modelId,
                comments: []

            })
        commentable.comments.push(comment);  //in commentable we get may be tweet or comment
        await commentable.save()
        return comment
    }

}

export default CommentService
