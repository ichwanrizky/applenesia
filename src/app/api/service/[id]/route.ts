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
    const session = await checkSession(authorization, "MENU_SERVICE", "GET");
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

    const data = await prisma.service.findFirst({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            telp: true,
            email: true,
          },
        },
        device: {
          select: {
            id: true,
            name: true,
            device_type: true,
          },
        },
        service_status: true,
        user_created: {
          select: {
            name: true,
          },
        },
        user_technician: {
          select: {
            name: true,
          },
        },
        service_product: true,
        service_form_checking: true,
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        is_deleted: false,
        service_number: params.id,
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

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_SERVICE", "DELETE");
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

    const deleteData = await prisma.service.update({
      data: {
        is_deleted: true,
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
        service_status_id: {
          notIn: [3, 4],
        },
      },
    });

    if (!deleteData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete service",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`delete service id: ${deleteData.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to delete service",
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
