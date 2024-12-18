"use server";
import prisma from "@/libs/ConnPrisma";

export const getTrackingService = async (
  serviceNumber: string,
  serviceCode: string
) => {
  try {
    if (!serviceNumber || !serviceCode)
      throw new Error("Service number and service code required");

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
        service_number: serviceNumber,
        unique_code: serviceCode?.toString(),
      },
    });

    if (!data) throw new Error("Service not found");

    return data;
  } catch (error) {
    return null;
  }
};

export const getProduct = async (device_type_id: number) => {
  try {
    const res = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sell_price: true,
        product_device: true,
      },
      where: {
        product_device: {
          some: {
            device: {
              device_type_id: device_type_id,
            },
          },
        },
        is_show_portal: true,
      },
      orderBy: { name: "asc" },
    });

    if (res.length == 0) throw new Error("Product not found");

    return res;
  } catch (error) {
    return [];
  }
};
