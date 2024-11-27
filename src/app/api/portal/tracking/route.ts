import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";

export const GET = async (request: Request) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const service_number = searchParams.get("service_number");
    const service_code = searchParams.get("service_code");

    if (!service_number || !service_code) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Service number and service code required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await prisma.service.findFirst({
      select: {
        service_number: true,
        service_desc: true,
        device: {
          select: {
            name: true,
          },
        },
        service_status: {
          select: {
            id: true,
            name: true,
          },
        },
        invoice_service: {
          select: {
            invoice: {
              select: {
                invoice_number: true,
                uuid: true,
              },
            },
          },
        },
      },
      where: {
        service_number,
        unique_code: service_code?.toString(),
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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success get data",
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
