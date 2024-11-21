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
        invoice_service: {
          select: {
            invoice: {
              select: {
                invoice_number: true,
              },
            },
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

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_SERVICE", "PUT");
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

    const customer_id = body.customer_id;
    const customer_name = body.customer_name;
    const customer_telp = body.customer_telp;
    const customer_email = body.customer_email;
    const device_type = body.device_type_id;
    const device = body.device_id;
    const imei = body.imei;
    const service_desc = body.service_desc;
    const repair_desc = body.repair_desc;
    const service_form_checking = body.service_form_checking;
    const branch = body.branch;
    const technician = body.technician;
    const service_status = body.service_status;
    const products = body.products;
    const create_invoice = body.create_invoice;
    const missingFields = [
      {
        name: "customer name",
        value: customer_name,
      },
      {
        name: "customer telp",
        value: customer_telp,
      },
      {
        name: "device type",
        value: device_type,
      },
      {
        name: "device",
        value: device,
      },
      {
        name: "imei",
        value: imei,
      },
      {
        name: "service desc",
        value: service_desc,
      },
      {
        name: "branch",
        value: branch,
      },
      {
        name: "technician",
        value: technician,
      },
      {
        name: "service status",
        value: service_status,
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

    const updateData = await prisma.$transaction(async (prisma) => {
      const updateCustomer = await prisma.customer.update({
        data: {
          name: customer_name,
          telp: customer_telp,
          email: customer_email,
        },
        where: {
          id: Number(customer_id),
        },
      });

      const updateService = await prisma.service.update({
        data: {
          device_id: Number(device),
          imei: imei?.toUpperCase(),
          repair_desc: repair_desc?.toUpperCase(),
          service_desc: service_desc?.toUpperCase(),
          technician_id: Number(technician),
          service_status_id: Number(service_status),
          service_form_checking: {
            deleteMany: {},
            create: service_form_checking?.map((e: any) => ({
              name: e.name?.toUpperCase(),
              in_check: e.in_check,
              out_check: e.out_check,
              notes: e.notes?.toUpperCase(),
            })),
          },
          service_product: {
            deleteMany: {},
            create: products?.map((e: any) => ({
              product_id: Number(e.product_id),
              name: e.name,
              sub_name: e.sub_name,
              price: Number(e.price),
              qty: Number(e.qty),
              warranty: Number(e.warranty),
              is_product: e.is_product,
            })),
          },
        },
        where: {
          service_number: params.id,
          is_deleted: false,
        },
      });

      if (create_invoice) {
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

        await prisma.invoice.create({
          data: {
            invoice_number: invoiceNumber,
            year,
            month,
            created_at: formattedDateNow(),
            created_by: session[1].id,
            payment_status: "UNPAID",
            branch_id: Number(branch),
            customer_id: Number(customer_id),
            ...(products.length > 0 && {
              amount: products?.reduce(
                (total: number, item: any) =>
                  total + Number(item.price) * Number(item.qty),
                0
              ),
              invoice_item: {
                create: products?.map((e: any) => ({
                  product_id: Number(e.product_id),
                  name: e.name,
                  sub_name: e.sub_name,
                  price: Number(e.price),
                  qty: Number(e.qty),
                  warranty: Number(e.warranty),
                })),
              },
            }),
            invoice_service: {
              create: {
                service_id: updateService.id,
              },
            },
          },
        });
      }

      return { updateCustomer, updateService };
    });

    if (!updateData) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to update service" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    accessLog(
      `update service id: ${updateData.updateService.id}`,
      session[1].id
    );

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update service",
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
