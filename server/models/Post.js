const mongoose = require("mongoose");

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Post", PostSchema);
