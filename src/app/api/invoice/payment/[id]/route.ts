import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { accessLog } from "@/libs/AccessLog";
import { formattedDateNow } from "@/libs/DateFormat";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(
      authorization,
      "MENU_INVOICE_PAYMENT",
      "PUT"
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

    const payment_data = body.payment_data;

    if (!payment_data) {
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

    // check user branch access
    const user_branch = session[1].user_branch;

    const currentAmount = await prisma.invoice.findFirst({
      select: {
        amount: true,
      },
      where: {
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

    if (!currentAmount) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Invoice not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updateData = await prisma.$transaction(async (prisma) => {
      const paymentLeft = await prisma.invoice_item.findMany({
        where: {
          invoice: {
            invoice_number: params.id,
          },
        },
      });

      let totalPaymentLeft = 0;
      paymentLeft.forEach((item: any) => {
        const totalPrice = item.price * item.qty;
        const totalDiscountPrice = totalPrice * (item.discount_percent / 100);
        totalPaymentLeft +=
          totalPrice - totalDiscountPrice - -item.discount_price;
      });

      const totalPayment = payment_data.reduce(
        (total: number, item: any) => total + (item.nominal || 0),
        0
      );

      const updateInvoice = await prisma.invoice.update({
        select: {
          id: true,
          invoice_number: true,
          amount: true,
          payment_status: true,
          invoice_payment: {
            include: {
              payment: true,
            },
          },
        },
        data: {
          amount: {
            increment: totalPayment,
          },
          payment_status:
            currentAmount?.amount + totalPayment >= totalPaymentLeft
              ? "PAID"
              : "PARTIAL",
          invoice_payment: {
            create: payment_data.map((item: any) => ({
              payment_id: Number(item.paymentId),
              nominal: item.nominal,
              created_at: formattedDateNow(),
              created_by: session[1].id,
            })),
          },
        },
        where: {
          invoice_number: params.id,
        },
      });

      return updateInvoice;
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

    accessLog(`update invoice payment id: ${updateData.id}`, session[1].id);

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
