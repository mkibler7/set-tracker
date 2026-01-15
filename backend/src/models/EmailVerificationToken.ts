import { Schema, model, Types } from "mongoose";

type EmailVerificationTokenDoc = {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
};

const EmailVerificationTokenSchema = new Schema<EmailVerificationTokenDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

export default model<EmailVerificationTokenDoc>(
  "EmailVerificationToken",
  EmailVerificationTokenSchema
);
