import { formattedDateNow } from "../src/libs/DateFormat";
import { PrismaClient, product_type } from "@prisma/client";

const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const data = [
    {
      name: "IC CHARGE",
      product_type: "MACHINE",
      category: {
        id: 17,
      },
      device_type: "IPHONE",
      device: [{ id: 32 }],
      sell_price: 4000000,
      warranty: 90,
      is_pos: true,
      is_inventory: false,
      qty_initial: 0,
      is_show_portal: true,
    },
  ];

  for (let i = 0; i < data.length; i++) {
    await prisma.product.create({
      data: {
        name: data[i].name,
        sell_price: data[i].sell_price,
        warranty: data[i].warranty,
        is_pos: data[i].is_pos,
        is_inventory: data[i].is_inventory,
        is_show_portal: data[i].is_show_portal,
        product_type: data[i].product_type as product_type,
        product_category: {
          create: [
            {
              category_id: data[i].category.id,
            },
          ],
        },
        product_device: {
          create: data[i].device?.map((item: any) => ({
            device_id: item.id,
          })),
        },
        created_at: formattedDateNow(),
        branch_id: 1,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
