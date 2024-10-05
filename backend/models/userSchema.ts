import mongoose, { CallbackError, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  email: string;
  password: string;
  username: string;

  name: string;
  monthlyIncome: number;
  amount: number;
  creditcard: number;
  goal: string;
}
const userSchema: Schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: { type: String, required: true },

  name: {
    type: String,
    unique: true,
    required: true,
  },
  monthlyIncome: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  creditcard: {
    type: Number,
    unique: true,
  },
  goal: { type: String },
});
userSchema.pre<IUser>(
  "save",
  async function (next: (err?: CallbackError) => void): Promise<void> {
    try {
      if (!this.isModified("password")) {
        return next();
      }
      const salt = await bcrypt.genSalt(10);

      this.password = await bcrypt.hash(this.password, salt);

      next();
    } catch (err) {
      next(err as CallbackError);
    }
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
