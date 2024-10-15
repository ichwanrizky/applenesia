import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";
const bcrypt = require("bcrypt");

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "user_resetpassword",
      "GET"
    );
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

    const role = session[1].role.name;
    const user_branch = session[1].user_branch;

    const data = await prisma.user.findFirst({
      select: {
        username: true,
      },
      where: {
        id: Number(params.id),
        is_deleted: false,
        ...(role === "ADMINISTRATOR"
          ? {}
          : {
              user_branch: {
                some: {
                  branch_id: {
                    in: user_branch.map((item: any) => item.branch.id),
                  },
                },
              },
            }),
      },
    });

    if (!data) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to get data",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const hashPassword = await bcrypt.hash(data?.username, 10);

    const reset = await prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: {
        id: Number(params.id),
      },
    });

    if (!reset) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to reset password user",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`reset password user id: ${reset.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to reset password user",
        data: data,
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
