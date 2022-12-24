import mongoose, { InferSchemaType, Schema } from 'mongoose';

var PostSchema = new mongoose.Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    postTitle: { type: String, text: true, required: true },
    postAuthor: { type: String, text: true },
    postDesc: { type: String, text: true },
    postLang: { type: String, enum: ['el', 'en'], required: true },
    postContent: { type: String, required: true },
    postReference: String,
    postImgUrl: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

export type IPost = InferSchemaType<typeof PostSchema>;
export default mongoose.model('Post', PostSchema);
