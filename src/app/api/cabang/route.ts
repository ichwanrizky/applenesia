import { handleError } from "@/libs/ErrorHandlrer";
import { NextResponse } from "next/server";
import prisma from "@/libs/ConnPrisma";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const name = body.name;
    const telp = body.telp;
    const address = body.address;

    if (!name || !telp || !address) {
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

    const alias = name
      .split(" ")
      .map((char: string) => char[0])
      .join("")
      .toUpperCase();

    const create = await prisma.branch.create({
      data: {
        name,
        telp,
        address,
        alias,
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "Failed to create cabang" }),
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
        message: "Success to create cabang",
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
    handleError(error);
  }
};
