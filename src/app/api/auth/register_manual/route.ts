import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";
import { formattedDateNow } from "@/libs/DateFormat";

const bcrypt = require("bcrypt");
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const username = body.username;
    const password = body.password;
    const name = body.name;
    const telp = body?.telp;

    if (!username || !password || !name) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Missing fields" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (!hashPassword) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to hash password" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const create = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
        name,
        telp,
        role: {
          connect: {
            id: 1,
          },
        },
        created_at: formattedDateNow(),
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create user" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create user",
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
