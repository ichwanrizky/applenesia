import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { payment_status } from "@prisma/client";

export const GET = async (request: Request) => {
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

    const searchParams = new URL(request.url).searchParams;
    // search
    const search = searchParams.get("search");
    // page
    const page = searchParams.get("page");
    // branch access
    const branchaccess = searchParams.get("branchaccess");
    // payment status
    const payment_status = searchParams.get("payment_status");

    const role = session[1].role.name;
    const user_branch = session[1].user_branch;
    const checkUserBranch = user_branch?.filter(
      (item: any) => item.branch.id == branchaccess
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

    const condition = {
      where: {
        is_deleted: false,
        ...(role === "ADMINISTRATOR"
          ? {
              ...(branchaccess === "all"
                ? {}
                : {
                    branch_id: Number(branchaccess),
                  }),
            }
          : {
              branch_id: Number(branchaccess),
            }),
        ...(payment_status !== "all" && {
          payment_status: payment_status as payment_status,
        }),
        ...(search && {
          OR: [
            {
              invoice_number: {
                contains: search,
              },
            },
            {
              customer: {
                name: {
                  contains: search,
                },
              },
            },
          ],
        }),
      },
    };

    const totalData = await prisma.invoice.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.invoice.findMany({
      include: {
        customer: true,
        user_created: true,
      },
      ...condition,
      orderBy: { id: "desc" },
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
