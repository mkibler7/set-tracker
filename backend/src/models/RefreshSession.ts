import { Schema, model, type InferSchemaType, Types } from "mongoose";

export const REVOKED_REASONS = [
  "rotated", // replaced by a newer token in the same family (normal refresh)
  "logout",
  "reuse", // a rotated token was replayed outside the grace window
  "password_reset",
] as const;
export type RevokedReason = (typeof REVOKED_REASONS)[number];

const refreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // All tokens descended from one login share a familyId. Sessions created
    // before families existed have none; their own _id is used instead.
    familyId: { type: String, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, enum: REVOKED_REASONS, default: null },
  },
  { timestamps: true }
);

// TTL: MongoDB deletes sessions once they expire
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshSessionDoc = InferSchemaType<typeof refreshSessionSchema> & {
  userId: Types.ObjectId;
};

export default model("RefreshSession", refreshSessionSchema);
