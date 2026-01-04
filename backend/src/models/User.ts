import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, trim: true, maxlength: 60, default: "" },
    roles: { type: [String], default: ["user"] },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export default model("User", userSchema);
