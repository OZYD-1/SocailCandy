import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userPicturePath: { type: String, default: "" },
  comment: { type: String, required: true },
  createdAt: { type: String },
});

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: { type: Map, of: Boolean },
        comments: { type: [commentSchema], default: [] }
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;