import prisma from "./ConnPrisma";
import { formattedDateNow } from "./DateFormat";
const jwt = require("jsonwebtoken");

export const checkSession = async (
  authorization: any,
  module: string,
  method: string
) => {
  // check if need authorization
  if (!authorization) {
    return [false, null, "unauthorized"];
  }

  if (!module || !method) {
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

  const role_name = decoded.data.role.name;

  switch (module) {
    case "category":
      if (
        method === "GET" ||
        method === "POST" ||
        method === "DELETE" ||
        method === "PUT"
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
    case "product":
      if (
        (method === "GET" || method === "POST") &&
        role_name === "ADMINISTRATOR"
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
    case "product_library":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
    case "libs_device":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
  }

  return [false, null, "unauthorized"];
};
