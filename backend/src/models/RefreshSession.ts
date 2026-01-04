import { Schema, model, type InferSchemaType, Types } from "mongoose";

const refreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type RefreshSessionDoc = InferSchemaType<typeof refreshSessionSchema> & {
  userId: Types.ObjectId;
};

export default model("RefreshSession", refreshSessionSchema);
