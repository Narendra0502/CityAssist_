const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    email: String,
    Contact: Number,
    description: String,
    image: String,
    address: String,
    city: String,
    department: String,
    latitude: Number,
    longitude: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Hold", "Completed"],
      default: "Pending",
    },
    reason: String,
    remark: String,
    CompleteDate: Date,
    completefile: String,

    // ✅ New fields for voting and priority
    upvotes: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    downvotes: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    priority: {
      type: Number,
      default: 0,
      get: function() {
        return this.upvotes - this.downvotes;
      }
    },
    votedBy: [{
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      voteType: {
        type: String,
        enum: ['upvote', 'downvote']
      }
    }]
  },
    { timestamps: true },
);



const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;
