import jwt from "jsonwebtoken";

export const signJWT = function (id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
};
