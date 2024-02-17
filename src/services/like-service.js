import { LikeRepository, TweetRepository } from '../repository/index.js'

class LikeService {
    constructor() {
        this.likeRepository = new LikeRepository
        this.tweetRepository = new TweetRepository
    }

    async toggleLike(modelId, modelType, userId) { // /api/v1/likes/toggle?id=modelid&type=Tweet
      //  console.log(modelId, modelType, userId);
        if (modelType == 'Tweet') {

            var likeable = await this.tweetRepository.find(modelId) //tweet

        } else if (modelType == 'Comment') {
            // TODO
        } else {
            throw new Error('unknown model type');
        }

        const exists = await this.likeRepository.findByUserAndLikeable({ // exists me like hoga
            user: userId,
            onModel: modelType,
            likeable: modelId
        });

        console.log("exists", exists);
        if (exists) {
            likeable.likes.pull(exists.id);  //eg.tweet.like.pull(like.id)
            await likeable.save();
            await exists.deleteOne();         //we remove that like from db
            var isAdded = false;

        } else {
            const newLike = await this.likeRepository.create({  //after create it return like id
                user: userId,
                onModel: modelType,  //tweet or comment
                likeable: modelId
            });
            likeable.likes.push(newLike);
            await likeable.save();

            var isAdded = true;
        }
        return isAdded;
    }
}

export default LikeService