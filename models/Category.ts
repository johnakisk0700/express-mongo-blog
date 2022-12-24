import mongoose, { InferSchemaType } from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: String,
    greekName: String,
    createdAt: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

export type ICategory = InferSchemaType<typeof CategorySchema>;
export default mongoose.model('Category', CategorySchema);
