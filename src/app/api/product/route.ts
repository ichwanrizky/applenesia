import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";
import { formattedDateNow } from "@/libs/DateFormat";
import { productLog } from "@/libs/ProductLog";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "product", "GET");
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
      include: {
        product_category: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        product_device: {
          select: {
            device: {
              select: {
                id: true,
                name: true,
                device_type: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      ...condition,
      orderBy: { name: "asc" },
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
    const session = await checkSession(authorization, "product", "POST");
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

    const body = await request.json();

    const name = body.name;
    const sub_name = body.sub_name;
    const sell_price = body.sell_price;
    const purchase_price = body.purchase_price;
    const warranty = body.warranty;
    const is_pos = body.is_pos;
    const is_invent = body.is_invent;
    const product_type = body.product_type;
    const category = body.category;
    const device = body.device;
    const branch = body.branch;
    const qty = body.qty;

    if (
      !name ||
      !sell_price ||
      !purchase_price ||
      !warranty ||
      !is_pos ||
      !is_invent ||
      !product_type ||
      !category ||
      !device ||
      !branch ||
      !qty
    ) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Missing fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // check user branch access
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

    const create = await prisma.product.create({
      data: {
        name,
        sub_name,
        sell_price,
        purchase_price,
        warranty,
        is_pos: is_pos === "1" ? true : false,
        is_inventory: is_invent === "1" ? true : false,
        product_type,
        product_category: {
          create: category?.map((item: any) => ({
            category_id: item.value,
          })),
        },
        product_device: {
          create: device?.map((item: any) => ({
            device_id: item.value,
          })),
        },
        created_at: formattedDateNow(),
        branch_id: Number(branch),
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create product" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`create product id: ${create.id}`, session[1].id);
    productLog(create.id, qty, session[1].id, "IN", `create product`);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create product",
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
