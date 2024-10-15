import { product_log_type } from "@prisma/client";
import prisma from "./ConnPrisma";
import { formattedDateNow } from "./DateFormat";

export const productLog = async (
  product_id: number,
  qty: number,
  created_by: number,
  type: product_log_type,
  desc: string
) => {
  await prisma.product_log.create({
    data: {
      product_id,
      qty,
      type,
      created_at: formattedDateNow(),
      created_by,
      desc,
    },
  });
};
