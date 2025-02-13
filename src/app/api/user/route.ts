import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { formattedDateNow } from "@/libs/DateFormat";
import { accessLog } from "@/libs/AccessLog";
const bcrypt = require("bcrypt");

export const GET = async (request: Request) => {
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

    const searchParams = new URL(request.url).searchParams;

    // search
    const search = searchParams.get("search");
    // page
    const page = searchParams.get("page");
    // branch access
    const branchaccess = searchParams.get("branchaccess");

    const user_branch = session[1].user_branch;
    const checkUserBranch = user_branch?.filter(
      (item: any) => item.branch.id == branchaccess
    );

    const role = session[1].role.name;
    if (
      (!checkUserBranch || checkUserBranch.length === 0) &&
      role !== "ADMINISTRATOR"
    ) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized access",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const condition = {
      where: {
        is_deleted: false,
        username: {
          not: "ichwan",
        },
        ...(role === "ADMINISTRATOR"
          ? {
              ...(branchaccess === "all"
                ? {}
                : {
                    user_branch: {
                      some: {
                        branch_id: Number(branchaccess),
                      },
                    },
                  }),
            }
          : {
              user_branch: {
                some: {
                  branch_id: Number(branchaccess),
                },
              },
            }),
        ...(search && {
          OR: [
            {
              name: {
                contains: search ? search : undefined,
              },
              username: {
                contains: search ? search : undefined,
              },
            },
          ],
        }),
      },
    };

    const totalData = await prisma.user.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.user.findMany({
      include: {
        user_branch: {
          include: {
            branch: true,
          },
        },
        role: true,
      },
      ...condition,
      orderBy: [],
      skip: page ? (parseInt(page) - 1) * itemPerPage : 0,
      take: itemPerPage,
    });
    if (!data) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Data not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const newData = data.map((item, index) => {
      return {
        number: page ? (Number(page) - 1) * itemPerPage + index + 1 : index + 1,
        ...item,
      };
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success get data",
        itemsPerPage: itemPerPage,
        total: totalData,
        data: newData,
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

export const POST = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_USER", "POST");
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
    const password = body.password;
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
        name: "password",
        value: password,
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

    const hashPassword = await bcrypt.hash(password, 10);

    if (!hashPassword) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to hash password" }),
        {
          status: 500,
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

    const create = await prisma.user.create({
      data: {
        name,
        username,
        password: hashPassword,
        telp,
        role: {
          connect: {
            id: Number(roleUser),
          },
        },
        created_at: formattedDateNow(),
        user_branch: {
          create: manageBranch?.map((item: any) => ({
            branch_id: Number(item.value),
          })),
        },
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create user" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`create user id: ${create.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create user",
        data: create,
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
