import mongoose, { InferSchemaType, Schema } from "mongoose";

const CommentThreadSchema = new mongoose.Schema({
  postID: { type: Schema.Types.ObjectId, ref: "Post" },
  comments: [
    {
      commentAuthor: { type: String, text: true },
      commentContent: { type: String, required: true },
      created: { type: Date },
    },
  ],
});

export type ICommentThread = InferSchemaType<typeof CommentThreadSchema>;
export default mongoose.model("CommentThread", CommentThreadSchema);
