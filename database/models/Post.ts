import mongoose, { InferSchemaType, Schema } from "mongoose";

var PostSchema = new mongoose.Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    postTitle: { type: String, text: true, required: true },
    postAuthor: { type: String, text: true },
    postDesc: { type: String, text: true },
    postLang: { type: String, enum: ["el", "en"], required: true },
    postContent: { type: String, required: true },
    postReference: String,
    postImgUrl: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export type IPost = InferSchemaType<typeof PostSchema>;
export default mongoose.model("Post", PostSchema);
