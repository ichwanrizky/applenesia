import prisma from "./ConnPrisma";
import { formattedDateNow } from "./DateFormat";

export const accessLog = async (description: string, userId: number) => {
  await prisma.access_log.create({
    data: {
      description,
      created_at: formattedDateNow(),
      user_id: userId,
    },
  });
};
