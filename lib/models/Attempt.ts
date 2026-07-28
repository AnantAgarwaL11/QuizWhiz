import mongoose from "mongoose"

const AttemptSchema=new mongoose.Schema({
    quizId:{type:String,required:true},
    userId:{type:String,required:true},
    userName:{type:String,required:true},
    userImage:{type:String,default:""},
    answers:{type:[Number],required:true},
    score:{type:Number,required:true},
    total:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now}
})
export default mongoose.models.Attempt || mongoose.model("Attempt",AttemptSchema);