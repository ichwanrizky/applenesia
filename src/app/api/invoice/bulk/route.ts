import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { formattedDateNow } from "@/libs/DateFormat";
import { accessLog } from "@/libs/AccessLog";

export const POST = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "MENU_INVOICE_BULK",
      "POST"
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

    const body = await request.json();

    const list_service_id = body.list_service_id;
    const branch = body.branch;

    const missingFields = [
      {
        name: "service id",
        value: list_service_id,
      },
      {
        name: "branch",
        value: branch,
      },
    ]
      .filter((item) => !item.value)
      .map((item) => item.name);

    if (missingFields.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Missing fields: " + missingFields.join(", "),
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // check user branch access
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

    const service = await prisma.service.findMany({
      include: {
        service_product: true,
      },
      where: {
        service_number: {
          in: list_service_id,
        },
      },
    });

    if (!service || service.length === 0) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Service not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const countInvoiceExist = await prisma.invoice.count({
      where: {
        year,
        branch_id: Number(branch),
      },
    });

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const padId = (countInvoiceExist + 1).toString().padStart(3, "0");
    const invoiceNumber = `INV${year
      .toString()
      .slice(-2)}${randomNumber}${padId}`;

    const createBulk = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        year,
        month,
        created_at: formattedDateNow(),
        created_by: session[1].id,
        payment_status: "UNPAID",
        branch_id: Number(branch),
        customer_id: Number(service[0].customer_id),
        amount: 0,
        invoice_item: {
          create: service.flatMap((e: any) =>
            e.service_product.length > 0
              ? e.service_product?.map((item: any) => ({
                  product_id: Number(item.product_id),
                  name: item.name,
                  sub_name: item.sub_name,
                  price: Number(item.price),
                  qty: Number(item.qty),
                  warranty: Number(item.warranty),
                }))
              : []
          ),
        },
        invoice_service: {
          create: service.map((e: any) => ({
            service_id: Number(e.id),
          })),
        },
      },
    });

    if (!createBulk) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create invoice" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(`create invoice id: ${createBulk.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create invoice",
        data: createBulk,
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
