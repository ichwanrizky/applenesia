import prisma from "./ConnPrisma";
import { formattedDateNow } from "./DateFormat";
const jwt = require("jsonwebtoken");

export const checkSession = async (
  authorization: any,
  module?: string,
  method?: string
) => {
  // check if need authorization
  if (!authorization) {
    return [false, null, "unauthorized"];
  }

  // check if token is bearer
  if (authorization.split(" ")[0] !== "Bearer") {
    return [false, null, "invalid token"];
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT);

  // check if token is valid
  if (!decoded) {
    return [false, null, "invalid token"];
  }

  // check to session is active
  const existToken = await prisma.$queryRaw<any>`
    SELECT * FROM token 
      WHERE LOWER(access_token) = LOWER(${token.toString()})
      AND expired_at >= ${formattedDateNow()}
      AND is_expired = false
    ORDER BY id DESC
    LIMIT 1
  `;

  if (!existToken || existToken.length === 0) {
    return [false, null, "session expired"];
  }

  return [true, decoded.data, null];
};
