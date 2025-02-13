import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { checkSession } from "@/libs/CheckSession";
import { formattedDateNow } from "@/libs/DateFormat";
import { accessLog } from "@/libs/AccessLog";
import sendWhatsappMessage from "@/libs/WhatsappService";

export const GET = async (request: Request) => {
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

    const searchParams = new URL(request.url).searchParams;
    // search
    const search = searchParams.get("search");
    // page
    const page = searchParams.get("page");
    // branch access
    const branchaccess = searchParams.get("branchaccess");

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
        ...(search && {
          OR: [
            {
              service_number: {
                contains: search ? search : undefined,
              },
            },
            {
              customer: {
                name: {
                  contains: search ? search : undefined,
                },
              },
            },
            {
              customer: {
                telp: {
                  contains: search ? search : undefined,
                },
              },
            },
            {
              customer: {
                email: {
                  contains: search ? search : undefined,
                },
              },
            },
          ],
        }),
      },
    };

    const totalData = await prisma.service.count({
      ...condition,
    });

    // item per page
    const itemPerPage = page ? 10 : totalData;

    const data = await prisma.service.findMany({
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

export const POST = async (request: Request) => {
  try {
    const authorization = request.headers.get("Authorization");
    const session = await checkSession(authorization, "MENU_SERVICE", "POST");
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
    const service_form_checking = body.service_form_checking;
    const branch = body.branch;
    const technician = body.technician;
    const service_status = body.service_status;
    const products = body.products;

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

    if (!customer_id) {
      var newCustomer = await prisma.customer.create({
        data: {
          name: customer_name?.toUpperCase(),
          telp: customer_telp,
          email: customer_email,
        },
      });
    }

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const countServiceExist = await prisma.service.count({
      where: {
        year,
        month,
        branch_id: branch,
      },
    });

    const branchAlias = await prisma.branch.findFirst({
      select: { alias: true },
      where: {
        id: branch,
        is_deleted: false,
      },
    });

    if (!branchAlias) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Cabang not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const padId = (countServiceExist + 1).toString().padStart(3, "0");
    const serviceNumber = `${branchAlias.alias?.toUpperCase()}-${year
      .toString()
      .slice(-2)}${month}${padId}`;

    const create = await prisma.service.create({
      include: {
        customer: true,
        device: {
          select: {
            name: true,
          },
        },
        service_status: true,
      },
      data: {
        service_number: serviceNumber,
        unique_code: randomNumber?.toString(),
        customer_id: customer_id ? Number(customer_id) : newCustomer!.id,
        device_id: Number(device),
        imei: imei?.toUpperCase(),
        service_desc: service_desc?.toUpperCase(),
        technician_id: Number(technician),
        branch_id: Number(branch),
        created_at: formattedDateNow(),
        created_by: session[1].id,
        month: month,
        year: year,
        service_status_id: Number(service_status),
        service_form_checking: {
          create: service_form_checking?.map((e: any) => ({
            name: e.name?.toUpperCase(),
            in_check: e.in_check,
            out_check: e.out_check,
            notes: e.notes?.toUpperCase(),
          })),
        },
        ...(products.length > 0 && {
          service_product: {
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
        }),
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create service" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const message =
      `*Notifikasi | Applenesia* \n\n` +
      `Halo, *${create.customer.name?.toUpperCase()}*,\n\n` +
      `Kami ingin menginformasikan bahwa layanan servis Anda telah diterbitkan dengan detail sebagai berikut:\n\n` +
      `🔧 *Service No*: *${create.service_number}*\n` +
      `🔐 *Service Code*: *${create.unique_code}*\n\n` +
      `📱 *Perangkat*: *${create.device.name}*\n` +
      `📝 *Deskripsi Kerusakan*: *${create.service_desc}*\n` +
      `📌 *Status*: *${create.service_status.name?.toUpperCase()}*\n\n` +
      `Untuk memtracking status servis Anda, silakan klik tautan di bawah ini:\n` +
      `🔗 *${process.env.TRACKING_URL}?service_number=${create.service_number}&service_code=${create.unique_code}*\n\n` +
      `Terima kasih atas kepercayaan Anda kepada kami.\n\n` +
      `Salam,\n` +
      `Applenesia Team\n\n`;

    sendWhatsappMessage(customer_telp, message);
    accessLog(`create service id: ${create.id}`, session[1].id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create service",
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
