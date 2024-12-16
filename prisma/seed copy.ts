import { formattedDateNow } from "../src/libs/DateFormat";
import { PrismaClient } from "@prisma/client";

const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
    // roles
    await prisma.role.deleteMany({}),
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

    // device type
    await prisma.device_type.deleteMany({}),
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
          {
            id: 4,
            name: "iwatch",
          },
        ],
      });

    // cabang
    await prisma.branch.deleteMany({}),
      await prisma.branch.createMany({
        data: [
          {
            id: 1,
            name: "APPLENESIA BATAM CENTER",
            address:
              "Ruko Royal Sincom Blok E No. 9, Tlk. Tering, Kota Batam, Kepulauan Riau 29431 (Sebrang Panasonic - Deretan Tarempa)",
            alias: "BTC",
            telp: "085733333723",
          },
          {
            id: 2,
            name: "APPLENESIA BATU AJI",
            address:
              "Komplek Pertokoan Central Muka Kuning Blok A No.5, Kel. Buliang, Kec. Batu Aji, Kota Batam, Kep. Riau (Sebrang PStore SP - Deretan Dealer Yamaha)",
            alias: "BAJ",
            telp: "081371521277",
          },
          {
            id: 3,
            name: "APPLENESIA TG. PINANG",
            address:
              "Ruko ( Ex-PALUGADA ) (Antara Apotek Assyife dan Zovin Baby & Kids Shop) Jl.Raja Ali Haji 3, RT 001, RW011, Kel. Tanjung Ayun Sakti, Kec.Bukit Bestari",
            alias: "TGP",
            telp: "081371521266",
          },
        ],
      });

    // user
    await prisma.user.deleteMany({}),
      await prisma.user.createMany({
        data: [
          {
            id: 1,
            username: "ichwan",
            password: await bcrypt.hash("sarutobi11", 10),
            name: "Ichwan Rizky",
            telp: "08117779914",
            role_id: 1,
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

    // payment method
    await prisma.payment_method.deleteMany({}),
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

    // service status
    await prisma.service_status.deleteMany({}),
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
