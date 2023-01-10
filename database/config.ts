import mongoose from "mongoose";

export async function mongooseInit() {
  try {
    await mongoose
      .connect("mongodb://localhost/freebirth-blog-cms", {})
      .then(() => console.info("MongoDB connected."))
      .catch((err: any) => console.error(err));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
