import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../../../shared/config/index.js";

const SALT_ROUNDS = Number(BCRYPT_SALT_ROUNDS || 12);

export const hashPassword = async (plain) => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};
