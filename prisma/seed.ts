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
      await prisma.category.deleteMany({}),
      //
      await prisma.category.createMany({
        data: [
          {
            name: "AKSESORIS",
          },
          {
            name: "BATTTERY",
          },
          {
            name: "HOUSING",
          },
          {
            name: "LCD",
          },
        ],
      }),
      await prisma.service_status.createMany({
        data: [
          {
            id: 1,
            name: "service masuk - barang ditinggal",
            label_color: "info",
          },
          {
            id: 2,
            name: "service masuk - langsung",
            label_color: "info",
          },
          {
            id: 3,
            name: "service selesai - barang sudah diambil",
            label_color: "success",
          },
          {
            id: 4,
            name: "service selesai - barang belum diambil",
            label_color: "warning",
          },
          {
            id: 5,
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
        {
          id: 5,
          name: "SUPERVISOR",
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

    const branch = await prisma.branch.createMany({
      data: [
        {
          id: 1,
          name: "TEST 1",
          address: "TEST 1",
          alias: "T1",
          telp: "08117779914",
        },
        {
          id: 2,
          name: "TEST 2",
          address: "TEST 2",
          alias: "T2",
          telp: "08117779914",
        },
      ],
    });

    const user = await prisma.user.createMany({
      data: [
        {
          id: 1,
          username: "ichwan",
          password: await bcrypt.hash("ichwan", 10),
          name: "Ichwan Rizky",
          telp: "08117779914",
          role_id: 1,
          created_at: formattedDateNow(),
        },
        {
          username: "admincabang",
          password: await bcrypt.hash("admincabang", 10),
          name: "EX ADMIN CABANG",
          telp: "08117779914",
          role_id: 2,
          created_at: formattedDateNow(),
        },
        {
          username: "cashier",
          password: await bcrypt.hash("cashier", 10),
          name: "EX CASHIER",
          telp: "08117779914",
          role_id: 3,
          created_at: formattedDateNow(),
        },
        {
          username: "teknisi",
          password: await bcrypt.hash("teknisi", 10),
          name: "EX TEKNISI",
          telp: "08117779914",
          role_id: 4,
          created_at: formattedDateNow(),
        },
        {
          username: "supervisor",
          password: await bcrypt.hash("supervisor", 10),
          name: "EX SUPERVISOR",
          telp: "08117779914",
          role_id: 5,
          created_at: formattedDateNow(),
        },
      ],
    });

    await prisma.user_branch.create({
      data: {
        user_id: 1,
        branch_id: 1,
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
