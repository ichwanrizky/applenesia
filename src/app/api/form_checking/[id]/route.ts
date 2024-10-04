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
    const session = await checkSession(authorization);
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

    const data = await prisma.form_checking.findFirst({
      where: {
        id: Number(params.id),
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
    const session = await checkSession(authorization);
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

    const name = body.name?.toUpperCase();
    const device_type_id = body.type;

    if (!name || !device_type_id) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Missing fields" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const update = await prisma.form_checking.update({
      data: {
        name,
        device_type_id,
      },
      where: {
        id: Number(params.id),
      },
    });

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update form checking",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`update form checking id: ${update.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update form checking",
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

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization);
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

    const deleteData = await prisma.form_checking.delete({
      where: {
        id: Number(params.id),
      },
    });

    if (!deleteData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete form checking",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`delete form checking id: ${deleteData.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to delete form checking",
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
