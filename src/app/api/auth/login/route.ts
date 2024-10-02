import { handleError } from "@/libs/ErrorHandlrer";
import prisma from "@/libs/ConnPrisma";
import { NextResponse } from "next/server";
import { formattedDateNow } from "@/libs/DateFormat";
import { accessLog } from "@/libs/AccessLog";
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const username = body.username;
    const password = body.password;

    if (!username || !password) {
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

    const findUser = await prisma.user.findFirst({
      include: {
        role: true,
        user_branch: {
          select: {
            branch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        username: username,
      },
    });

    if (!findUser) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "User not found" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const hashPassword = await bcrypt.compare(password, findUser.password);
    if (!hashPassword) {
      return new NextResponse(
        JSON.stringify({ status: false, message: "User not found" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = { ...findUser, password: undefined, role_id: undefined };

    let accessToken;
    let refreshToken;

    const existToken = await prisma.token.findFirst({
      where: {
        user_id: user.id,
        AND: [
          {
            expired_at: {
              gte: formattedDateNow(),
            },
          },
          {
            is_expired: false,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!existToken) {
      accessToken = await jsonwebtoken.sign(
        {
          data: user,
        },
        process.env.JWT,
        {
          expiresIn: "8h",
        }
      );

      refreshToken = await jsonwebtoken.sign(
        {
          data: user,
        },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: "30d",
        }
      );

      const expiredDate = formattedDateNow();
      expiredDate.setHours(expiredDate.getHours() + 8);

      await prisma.token.create({
        data: {
          access_token: accessToken,
          user_id: user.id,
          created_at: formattedDateNow(),
          expired_at: expiredDate,
          is_expired: false,
        },
      });
    } else {
      accessToken = existToken?.access_token;
    }

    accessLog("login", user.id);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Login success",
        data: { ...user, accessToken, refreshToken },
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
