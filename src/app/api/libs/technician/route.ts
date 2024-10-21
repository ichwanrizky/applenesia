import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "libs_technician", "GET");
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

    const searchParams = new URL(request.url).searchParams;
    const branch = searchParams.get("branch");

    const role = session[1].role.name;
    const user_branch = session[1]?.user_branch;

    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        user_branch: {
          some: {
            branch_id: Number(branch),
          },
        },
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
      orderBy: {
        name: "asc",
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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to get data",
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
