import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");

    const session = await checkSession(
      authorization,
      "libs_productlist",
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
    const branch = searchParams.get("branch");
    const device = searchParams.get("device");
    const search = searchParams.get("search");

    const role = session[1].role.name;
    const user_branch = session[1].user_branch;
    const checkUserBranch = user_branch?.filter(
      (item: any) => item.branch.id == branch
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

    const deviceData = device ? JSON.parse(device) : [];

    const data = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sub_name: true,
        sell_price: true,
        warranty: true,
        product_device: {
          select: {
            device: true,
          },
        },
        product_log: {
          select: {
            qty: true,
            type: true,
          },
          where: {
            product: {
              is_inventory: true,
            },
          },
        },
      },
      where: {
        is_deleted: false,
        is_pos: true,
        branch_id: Number(branch),
        ...(search
          ? {
              ...(deviceData.length > 0 && {
                product_device: {
                  some: {
                    device: {
                      id: {
                        in: deviceData.map(
                          (item: { value: number }) => item.value
                        ),
                      },
                    },
                  },
                },
              }),
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
            }
          : {
              product_device: {
                some: {
                  device: {
                    id: {
                      in: deviceData.map(
                        (item: { value: number }) => item.value
                      ),
                    },
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

    const stockProduct = data.map((item) => {
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
        ...item,
        stock: inStock - outStock,
      };
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success get data",
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
