import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_USER", "GET");
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
      include: {
        user_branch: {
          include: {
            branch: true,
          },
        },
        role: true,
      },
      where: {
        id: Number(params.id),
        is_deleted: false,
        username: {
          not: "ichwan",
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

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_USER", "PUT");
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

    const body = await request.json();

    const name = body.name;
    const username = body.username;
    const telp = body.telp;
    const roleUser = body.role;
    const manageBranch = body.manageBranch;

    const missingFields = [
      {
        name: "name",
        value: name,
      },
      {
        name: "username",
        value: username,
      },
      {
        name: "telp",
        value: telp,
      },
      {
        name: "role",
        value: roleUser,
      },
      {
        name: "manage branch",
        value: manageBranch,
      },
    ]
      .filter((item) => !item.value)
      .map((item) => item.name);

    if (missingFields.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Missing fields: " + missingFields.join(", "),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user_branch = session[1].user_branch;
    const checkUserBranch = manageBranch?.every((item: any) => {
      return user_branch
        .map((userBranchItem: any) => userBranchItem.branch.id)
        .includes(Number(item.value));
    });

    const role = session[1].role.name;
    if (!checkUserBranch && role !== "ADMINISTRATOR") {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Unauthorized access" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userExist = await prisma.user.findFirst({
      where: {
        username: username,
        id: {
          not: Number(params.id),
        },
      },
    });

    if (userExist) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Username already exist" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updateData = await prisma.$transaction(async (prisma) => {
      const updateUser = await prisma.user.update({
        data: {
          name,
          username,
          telp,
          role: {
            connect: {
              id: Number(roleUser),
            },
          },
          user_branch: {
            deleteMany: {},
            create: manageBranch?.map((item: any) => ({
              branch_id: Number(item.value),
            })),
          },
        },
        where: {
          id: Number(params.id),
          is_deleted: false,
        },
      });

      await prisma.token.deleteMany({
        where: {
          user_id: Number(params.id),
        },
      });

      return { updateUser };
    });

    if (!updateData.updateUser) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to update user" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`update user id: ${updateData.updateUser.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update user",
        data: updateData.updateUser,
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

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_USER", "DELETE");
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

    const deleteData = await prisma.user.update({
      data: {
        is_deleted: true,
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

    if (!deleteData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete user",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`delete user id: ${deleteData.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to delete user",
        data: deleteData,
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
