import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

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
