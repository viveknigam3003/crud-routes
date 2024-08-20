import mongoose, { ObjectId, Schema } from "mongoose";

const UsersModel = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export interface User {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
}

export const Users = mongoose.model<User>("users", UsersModel);