import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";

export const GET = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_CABANG", "GET");
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

    const condition = {
      where: {
        is_deleted: false,
        name: {
          contains: search ? search : undefined,
        },
      },
    };

    const totalData = await prisma.branch.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.branch.findMany({
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
    const session = await checkSession(authorization, "MENU_CABANG", "POST");
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

    const name = body.name;
    const telp = body.telp;
    const address = body.address;

    if (!name || !telp || !address) {
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

    const alias = name
      .split(" ")
      .map((char: string) => char[0])
      .join("")
      .toUpperCase();

    const create = await prisma.branch.create({
      data: {
        name,
        telp,
        address,
        alias,
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create cabang" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`create cabang id: ${create.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create cabang",
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
