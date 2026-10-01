import RefreshSession from "../models/RefreshSession.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";

/**
 * Bring token-collection indexes in line with the schemas.
 *
 * Mongoose's autoIndex only creates missing indexes; it can't change the
 * options of an existing one. Production already has plain `expiresAt_1`
 * indexes, so turning them into TTL indexes needs syncIndexes(), which drops
 * and recreates indexes whose options differ. These collections are small,
 * so the rebuild is cheap.
 */
export async function syncTokenIndexes() {
  for (const model of [RefreshSession, PasswordResetToken, EmailVerificationToken]) {
    try {
      await model.syncIndexes();
    } catch (err) {
      // Never block startup on index maintenance; the app works without TTL
      console.error(`Index sync failed for ${model.modelName}:`, err);
    }
  }
}
