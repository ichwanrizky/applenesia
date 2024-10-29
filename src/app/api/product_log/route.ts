import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "MENU_PRODUCT_LOG",
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

    const searchParams = new URL(request.url).searchParams;
    // search
    const search = searchParams.get("search");
    // page
    const page = searchParams.get("page");
    // branch access
    const branchaccess = searchParams.get("branchaccess");

    const role = session[1].role.name;
    const user_branch = session[1].user_branch;
    const checkUserBranch = user_branch?.filter(
      (item: any) => item.branch.id == branchaccess
    );

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
        product: {
          is_deleted: false,
          ...(role === "ADMINISTRATOR"
            ? {
                ...(branchaccess === "all"
                  ? {}
                  : {
                      branch_id: Number(branchaccess),
                    }),
              }
            : {
                branch_id: Number(branchaccess),
              }),
        },
        ...(search && {
          OR: [
            {
              product: {
                name: {
                  contains: search ? search : undefined,
                },
              },
            },
            {
              product: {
                product_category: {
                  some: {
                    category: {
                      name: {
                        contains: search ? search : undefined,
                      },
                    },
                  },
                },
              },
            },
            {
              product: {
                product_device: {
                  some: {
                    device: {
                      name: {
                        contains: search ? search : undefined,
                      },
                    },
                  },
                },
              },
            },
          ],
        }),
      },
    };

    const totalData = await prisma.product_log.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.product_log.findMany({
      include: {
        product: {
          select: {
            name: true,
            sub_name: true,
          },
        },
        user_created: {
          select: {
            name: true,
          },
        },
      },
      ...condition,
      orderBy: {
        id: "desc",
      },
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
