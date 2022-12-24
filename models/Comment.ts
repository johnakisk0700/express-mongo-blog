import mongoose, { InferSchemaType, Schema } from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        postID: { type: Schema.Types.ObjectId, ref: 'Post' },
        state: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
        commentAuthor: { type: String, required: true },
        commentContent: { type: String, required: true },
    },
    { timestamps: true }
);

CommentSchema.index({ postID: 1, state: 1 });

export type IComment = InferSchemaType<typeof CommentSchema>;
export default mongoose.model('Comment', CommentSchema);
