import mongoose, { InferSchemaType, Schema } from 'mongoose';

const SubscribeSchema = new mongoose.Schema({
    id: String,
    country: String,
    email: { type: String, required: true },
    createdAt: { type: Date },
    updated: { type: Date, default: Date.now },
});

export type ISubscribe = InferSchemaType<typeof SubscribeSchema>;
export default mongoose.model('Subscribe', SubscribeSchema);
