

mongoose=require('mongoose');
const Issueschema=new mongoose.Schema({
    name:String,
    title:String,
    email:String,
    Contact:Number,
    description:String,
    image:String,
    address:String,
    city:String,
    department:String,
    latitude: Number,
    longitude: Number,
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Hold", "Completed"],
        default: "Pending",
      },
    reason: String,
  
    remark:String,
    CompleteDate:Date,
    completefile:String,
    
   


},{timestamps:true})
const Issue=mongoose.model('Issue',Issueschema)
module.exports=Issue;
