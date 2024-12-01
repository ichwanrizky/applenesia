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
    const session = await checkSession(authorization, "MENU_INVOICE", "GET");
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

    const data = await prisma.invoice.findFirst({
      include: {
        invoice_payment: {
          include: {
            payment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        invoice_item: true,
        invoice_service: {
          select: {
            service: {
              select: {
                id: true,
                service_number: true,
              },
            },
          },
        },
        customer: true,
        user_created: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            name: true,
            address: true,
            telp: true,
          },
        },
      },
      where: {
        is_deleted: false,
        invoice_number: params.id,
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
          status: 404,
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
    const session = await checkSession(authorization, "MENU_INVOICE", "PUT");
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

    const invoice_item = body.invoice_item;
    const branch = body.branch;

    if (!invoice_item || !branch) {
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

    const updateData = await prisma.invoice.update({
      data: {
        invoice_item: {
          deleteMany: {},
          create: invoice_item.map((e: any) => ({
            product_id: Number(e.product_id),
            name: e.name,
            sub_name: e.sub_name,
            price: Number(e.price),
            qty: Number(e.qty),
            warranty: Number(e.warranty),
          })),
        },
      },
      where: {
        invoice_number: params.id,
      },
    });

    if (!updateData) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to update invoice" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`update invoice item id: ${updateData.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update invoice",
        data: updateData,
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
    const session = await checkSession(authorization, "MENU_INVOICE", "DELETE");
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

    const deleteData = await prisma.invoice.update({
      data: {
        is_deleted: true,
        invoice_service: {
          deleteMany: {},
        },
      },
      where: {
        is_deleted: false,
        id: Number(params.id),
        ...(role === "ADMINISTRATOR"
          ? {}
          : {
              branch_id: {
                in: user_branch.map((item: any) => item.branch.id),
              },
            }),
        payment_status: {
          not: "PAID",
        },
      },
    });

    if (!deleteData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete invoice",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`delete invoice id: ${deleteData.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to delete invoice",
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
