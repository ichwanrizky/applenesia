import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";

export const GET = async (
  request: Request,
  { params }: { params: { uuid: string } }
) => {
  try {
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
        uuid: params.uuid,
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
