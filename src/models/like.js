import mongoose  from 'mongoose';

const likeSchema = mongoose.Schema({
    onModel:{
       type:String,
       require:true,
       enum:['Tweet','comment']   //if we have to reffer more than on model we use enum other than ref
    },
likeable:{
    type:mongoose.Schema.Types.ObjectId,
    require:true,
    refPath:'onModel'      //it ref model id to which model it belongs              //refers the value
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required : true
}
})

const Like = mongoose.model('Like',likeSchema)
export default  Like;