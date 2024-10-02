import { handleError } from "@/libs/ErrorHandlrer";
import prisma from "@/libs/ConnPrisma";
import { NextResponse } from "next/server";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");

    const session = await checkSession(authorization);
    if (!session[0]) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const token = authorization?.split(" ")[1];

    const expiresToken = await prisma.$executeRaw<any>`
      UPDATE token
      SET is_expired = true
      WHERE LOWER(access_token) = LOWER(${token})
      AND user_id = ${session[1].id}
    `;

    if (!expiresToken) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to logout",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog("logout", session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Logout success",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return handleError(error);
  }
};
