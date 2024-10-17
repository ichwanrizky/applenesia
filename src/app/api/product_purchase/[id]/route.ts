import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";
import { formattedDateNow } from "@/libs/DateFormat";
import { productLog } from "@/libs/ProductLog";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
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

    const role = session[1].role.name;
    const user_branch = session[1].user_branch;

    const data = await prisma.product_purchase.findFirst({
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
      where: {
        id: Number(params.id),
        is_deleted: false,
        product: {
          is_deleted: false,
          ...(role === "ADMINISTRATOR"
            ? {}
            : {
                branch_id: {
                  in: user_branch.map((item: any) => item.branch.id),
                },
              }),
        },
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
    const session = await checkSession(
      authorization,
      "product_purchase",
      "PUT"
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

    const qty = body.qty;
    const price = body.price;
    const payment_id = body.payment_id;
    const branch = body.branch;

    if (!qty || !price || !payment_id || !branch) {
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

    // get qty product purchase
    const data = await prisma.product_purchase.findFirst({
      select: { qty: true },
      where: {
        id: Number(params.id),
        is_deleted: false,
      },
    });

    if (!data || data.qty === null || data.qty === undefined) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Product not found or invalid quantity",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const difference = data.qty - qty;

    const update = await prisma.$transaction(async (prisma) => {
      const updateProductPurchase = await prisma.product_purchase.update({
        include: {
          product: {
            select: {
              id: true,
            },
          },
        },
        data: {
          qty,
          price,
          created_at: formattedDateNow(),
          created_by: session[1].id,
          payment_id,
        },
        where: {
          id: Number(params.id),
          is_deleted: false,
        },
      });

      const updateCashFlow = await prisma.cash_flow.updateMany({
        data: {
          amount: price,
          type: "DEBIT",
          payment_id,
        },
        where: {
          product_purchase_id: Number(params.id),
        },
      });

      return { updateProductPurchase, updateCashFlow };
    });

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update product purchase",
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
      `update product purchase id: ${update.updateProductPurchase.id}`,
      session[1].id
    );
    productLog(
      update.updateProductPurchase.product.id,
      Math.abs(difference),
      session[1].id,
      difference > 0 ? "OUT" : "IN",
      `update purchase product`
    );

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update product purchase",
        data: update.updateProductPurchase,
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
    const session = await checkSession(
      authorization,
      "product_purchase",
      "DELETE"
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

    const deleteData = await prisma.$transaction(async (prisma) => {
      const ProductPurchase = await prisma.product_purchase.update({
        include: {
          product: {
            select: {
              id: true,
            },
          },
        },
        data: {
          is_deleted: true,
        },
        where: {
          id: Number(params.id),
          is_deleted: false,
          ...(role === "ADMINISTRATOR"
            ? {}
            : {
                product: {
                  branch_id: {
                    in: user_branch.map((item: any) => item.branch.id),
                  },
                },
              }),
        },
      });

      const CashFlow = await prisma.cash_flow.updateMany({
        data: {
          is_deleted: true,
        },
        where: {
          product_purchase_id: Number(params.id),
        },
      });

      return { ProductPurchase, CashFlow };
    });

    if (!deleteData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete product purchase",
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
      `delete product purchase id: ${deleteData.ProductPurchase.id}`,
      session[1].id
    );
    productLog(
      deleteData.ProductPurchase.product.id,
      deleteData.ProductPurchase.qty,
      session[1].id,
      "OUT",
      `delete purchase product`
    );

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to delete product purchase",
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
