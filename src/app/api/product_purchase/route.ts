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
    const session = await checkSession(
      authorization,
      "product_purchase",
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
                sub_name: {
                  contains: search ? search : undefined,
                },
              },
            },
            {
              payment: {
                name: {
                  contains: search ? search : undefined,
                },
              },
            },
          ],
        }),
      },
    };

    const totalData = await prisma.product_purchase.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.product_purchase.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sub_name: true,
          },
        },
        payment: true,
        user_created: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: { id: "desc" },
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
    const session = await checkSession(
      authorization,
      "product_purchase",
      "POST"
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

    const body = await request.json();

    const product_id = body.product_id;
    const qty = body.qty;
    const price = body.price;
    const payment_id = body.payment_id;
    const branch = body.branch;

    if (!product_id || !qty || !price || !payment_id || !branch) {
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

    // find product
    const dataProduct = await prisma.product.findFirst({
      select: {
        id: true,
        name: true,
        sub_name: true,
      },
      where: {
        id: product_id,
      },
    });

    if (dataProduct === null) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Product not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const create = await prisma.$transaction(async (prisma) => {
      const createProductPurchase = await prisma.product_purchase.create({
        data: {
          product_id: product_id,
          qty,
          price,
          created_at: formattedDateNow(),
          created_by: session[1].id,
          payment_id,
        },
      });

      const createCashFlow = await prisma.cash_flow.create({
        data: {
          desc: `product purchase: ${dataProduct.name}${
            dataProduct.sub_name && ` - ${dataProduct.sub_name}`
          } `,
          amount: price,
          type: "CREDIT",
          payment_id,
          created_at: formattedDateNow(),
          created_by: session[1].id,
          branch_id: branch,
        },
      });

      return { createProductPurchase, createCashFlow };
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create product purchase",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(
      `create product purchase id: ${create.createProductPurchase.id}`,
      session[1].id
    );
    productLog(product_id, qty, session[1].id, "IN", `purchase product`);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create product purchase",
        data: create.createProductPurchase,
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
