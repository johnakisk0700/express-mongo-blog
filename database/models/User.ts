import mongoose, { InferSchemaType, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema: Schema = new mongoose.Schema<IUser, IUserModel>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export type IUser = InferSchemaType<typeof UserSchema>;
export type IUserModel = Model<IUser, {}>;

UserSchema.pre("save", async function (this, next) {
  try {
    const user = this;
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);

      user.password = hashedPassword;
      next();
    }
  } catch (error: any) {
    next(error);
  }
});

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
