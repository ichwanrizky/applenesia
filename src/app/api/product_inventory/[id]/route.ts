import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";
import { formattedDateNow } from "@/libs/DateFormat";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "product_inventory",
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

    const data = await prisma.product.findFirst({
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
      where: {
        id: Number(params.id),
        is_deleted: false,
        is_inventory: true,
        ...(role === "ADMINISTRATOR"
          ? {}
          : {
              branch_id: {
                in: user_branch.map((item: any) => item.branch.id),
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

    let inStock = 0;
    let outStock = 0;

    data.product_log.forEach((log) => {
      if (log.type === "IN") {
        inStock += log.qty;
      } else {
        outStock += log.qty;
      }
    });

    const stockProduct = {
      id: data.id,
      name: data.name,
      sub_name: data.sub_name,
      stock: inStock - outStock,
    };

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to get data",
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

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "product_inventory",
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

    const body = await request.json();

    const qty = body.qty;
    const desc = body.desc;
    const type = body.type;

    if (!qty || !desc) {
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

    const update = await prisma.product_log.create({
      data: {
        product_id: Number(params.id),
        qty,
        type,
        created_at: formattedDateNow(),
        created_by: session[1].id,
        desc,
      },
    });

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update product inventory",
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
      `update inventory product ${type} product id: ${params.id}`,
      session[1].id
    );

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update product inventory",
        data: update,
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
