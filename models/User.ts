import mongoose, { InferSchemaType, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const UserSchema: Schema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
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
interface IUserMethods {
    comparePassword: (passw: string, cb: () => any) => { cb(): any };
}
export type IUserModel = Model<IUser, {}, IUserMethods>;

UserSchema.pre('save', function (this, next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.method('comparePassword', function comparePassword(this: IUser, passw: string, cb: any) {
    const user = this;
    bcrypt.compare(passw, user.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
});

export default mongoose.model<IUser, IUserModel>('User', UserSchema);
