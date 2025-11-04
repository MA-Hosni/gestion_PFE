import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_SIGNUP_EXPIRES_IN } from "../../../shared/config/index.js";

const ACCESS_EXPIRES_IN = JWT_ACCESS_EXPIRES_IN || "30m";
const REFRESH_EXPIRES_IN = JWT_REFRESH_EXPIRES_IN || "7d";
const SIGNUP_EXPIRES_IN = JWT_SIGNUP_EXPIRES_IN || "15m";

export const signAccessToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
export const signRefreshToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

export const signSignupToken = (payload) => jwt.sign({ ...payload, purpose: "signup_complete" }, JWT_SECRET, { expiresIn: SIGNUP_EXPIRES_IN });

export const verifySignupToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.purpose !== "signup_complete") throw new Error("Invalid signup token purpose");
    return payload;
  } catch {
    const e = new Error("Invalid or expired signup token");
    e.status = 401;
    throw e;
  }
};

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