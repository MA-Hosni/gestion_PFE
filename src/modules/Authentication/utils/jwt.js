import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from "../../../shared/config/index.js";

const ACCESS_EXPIRES_IN = JWT_ACCESS_EXPIRES_IN || "30m";
const REFRESH_EXPIRES_IN = JWT_REFRESH_EXPIRES_IN || "7d";

export const signAccessToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
export const signRefreshToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

export const signPasswordResetToken = (payload) => {
  return jwt.sign({ ...payload, purpose: "password_reset" }, JWT_SECRET, { expiresIn: "30m" });
};

export const verifyPasswordResetToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== "password_reset") {
      throw new Error("Invalid password reset token purpose");
    }
    return payload;
  } catch (error) {
    const err = new Error("Invalid or expired password reset token");
    err.status = 400;
    throw err;
  }
};