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
    // CABANG
    case "MENU_CABANG":
      if (role_name === "ADMINISTRATOR") {
        return [true, decoded.data, null];
      }

      return [false, null, "unauthorized"];

    // USER
    case "MENU_USER":
      if (
        (method === "GET" ||
          method === "POST" ||
          method === "DELETE" ||
          method === "PUT") &&
        (role_name === "ADMINISTRATOR" || role_name === "SUPERVISOR")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
    case "MENU_USER_RESET_PASSWORD":
      if (
        method === "GET" &&
        (role_name === "ADMINISTRATOR" || role_name === "SUPERVISOR")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    // DEVICE
    case "MENU_DEVICE":
      if (
        method === "GET" ||
        method === "POST" ||
        method === "DELETE" ||
        method === "PUT"
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    // CATEGORY
    case "MENU_CATEGORY":
      if (
        method === "GET" ||
        method === "POST" ||
        method === "DELETE" ||
        method === "PUT"
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "form_checking":
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
        (method === "GET" ||
          method === "POST" ||
          method === "DELETE" ||
          method === "PUT") &&
        (role_name === "ADMINISTRATOR" || role_name === "ADMINCABANG")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "product_log":
      if (
        method === "GET" &&
        (role_name === "ADMINISTRATOR" || role_name === "ADMINCABANG")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "product_inventory":
      if (
        (method === "GET" || method === "PUT") &&
        (role_name === "ADMINISTRATOR" || role_name === "ADMINCABANG")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "product_purchase":
      if (
        (method === "GET" ||
          method === "POST" ||
          method === "PUT" ||
          method === "DELETE") &&
        (role_name === "ADMINISTRATOR" || role_name === "ADMINCABANG")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "service":
      if (
        (method === "GET" ||
          method === "POST" ||
          method === "DELETE" ||
          method === "PUT") &&
        (role_name === "ADMINISTRATOR" || role_name === "ADMINCABANG")
      ) {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "customer":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_category":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_devicetype":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_device":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_payment_method":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_cabang":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_technician":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];

    case "libs_productlist":
      if (method === "GET") {
        return [true, decoded.data, null];
      }
      return [false, null, "unauthorized"];
  }

  return [false, null, "unauthorized"];
};
