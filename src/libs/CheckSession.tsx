import prisma from "./ConnPrisma";
import { formattedDateNow } from "./DateFormat";
const jwt = require("jsonwebtoken");

export const checkSession = async (authorization: any) => {
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
  const existToken = await prisma.token.findFirst({
    where: {
      access_token: token.toString(),
      AND: [
        {
          expired_at: {
            gte: formattedDateNow(),
          },
        },
        {
          is_expired: false,
        },
      ],
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!existToken) {
    return [false, null, "session expired"];
  }

  return [true, decoded.data, null];
};
