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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "", 
  },
  monthlyIncome: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
  creditcard: {
    type: Number,
    default: 0,
  },
  goal: {
    type: String,
    default: "",
  },
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
