import mongoose, { InferSchemaType } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    greekName: String,
  },
  { timestamps: true }
);

export type ICategory = InferSchemaType<typeof CategorySchema>;
export default mongoose.model("Category", CategorySchema);
