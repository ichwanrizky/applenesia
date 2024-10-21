import { formattedDateNow } from "../src/libs/DateFormat";
import { PrismaClient } from "@prisma/client";

const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
    await prisma.role.deleteMany({}),
      await prisma.device_type.deleteMany({}),
      await prisma.user.deleteMany({}),
      await prisma.branch.deleteMany({}),
      await prisma.payment_method.deleteMany({}),
      await prisma.service_status.deleteMany({}),
      await prisma.service_status.createMany({
        data: [
          {
            id: 1,
            name: "service masuk - barang ditinggal",
            label_color: "warning",
          },
          {
            id: 2,
            name: "service masuk - langsung",
            label_color: "warning",
          },
          {
            id: 3,
            name: "service selesai",
            label_color: "success",
          },
          {
            id: 4,
            name: "service batal",
            label_color: "danger",
          },
        ],
      });
    await prisma.role.createMany({
      data: [
        {
          id: 1,
          name: "ADMINISTRATOR",
        },
        {
          id: 2,
          name: "ADMINCABANG",
        },
        {
          id: 3,
          name: "CASHIER",
        },
        {
          id: 4,
          name: "TEKNISI",
        },
      ],
    });

    await prisma.device_type.createMany({
      data: [
        {
          id: 1,
          name: "iphone",
        },
        {
          id: 2,
          name: "ipad",
        },
        {
          id: 3,
          name: "macbook",
        },
      ],
    });

    await prisma.payment_method.createMany({
      data: [
        {
          id: 1,
          name: "double payment",
        },
        {
          id: 2,
          name: "CASH",
        },
        {
          id: 3,
          name: "BNI",
        },
        {
          id: 4,
          name: "BCA",
        },
        {
          id: 5,
          name: "MANDIRI",
        },
      ],
    });

    const branch = await prisma.branch.create({
      data: {
        name: "APPLENESIA BATAM",
        address: "Batam Center",
        alias: "AB",
        telp: "08117779914",
      },
    });

    const user = await prisma.user.create({
      data: {
        id: 1,
        username: "ichwan",
        password: await bcrypt.hash("ichwan", 10),
        name: "Ichwan Rizky",
        telp: "08117779914",
        role_id: 1,
        created_at: formattedDateNow(),
      },
    });

    await prisma.user_branch.create({
      data: {
        user_id: user.id,
        branch_id: branch.id,
      },
    });
  });
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
