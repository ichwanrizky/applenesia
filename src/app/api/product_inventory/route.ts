import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "MENU_PRODUCT_INVENTORY",
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
        is_deleted: false,
        is_inventory: true,
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
        ...(search && {
          OR: [
            {
              name: {
                contains: search ? search : undefined,
              },
            },
            {
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
            {
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
          ],
        }),
      },
    };

    const totalData = await prisma.product.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sub_name: true,
        product_log: {
          select: {
            qty: true,
            type: true,
          },
        },
      },
      ...condition,
      orderBy: {
        name: "asc",
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

    const stockProduct = newData.map((item) => {
      let inStock = 0;
      let outStock = 0;

      item.product_log.forEach((log) => {
        if (log.type === "IN") {
          inStock += log.qty;
        } else {
          outStock += log.qty;
        }
      });

      return {
        number: item.number,
        id: item.id,
        name: item.name,
        sub_name: item.sub_name,
        stock: inStock - outStock,
      };
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success get data",
        itemsPerPage: itemPerPage,
        total: totalData,
        data: stockProduct,
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
