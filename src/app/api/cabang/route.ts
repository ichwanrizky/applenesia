import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";

export const GET = async (request: Request) => {
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

    const role = session[1].role.name;
    console.log(role);
    if (role !== "ADMINISTRATOR") {
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

    const searchParams = new URL(request.url).searchParams;

    // search
    const search = searchParams.get("search");
    // page
    const page = searchParams.get("page");

    const totalData = await prisma.branch.count({
      where: {
        is_deleted: false,
      },
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.branch.findMany({
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
    handleError(error);
  }
};
