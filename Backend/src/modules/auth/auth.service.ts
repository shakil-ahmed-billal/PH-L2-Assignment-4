import { prisma } from "../../../lib/prisma";

const providerCreate = async (payload: any) => {
  /*restaurant  String
    description String?
    address     String
    phone       String */
  try {
    const userVerify = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!userVerify) {
      throw new Error("User Not Found");
    }

    if (userVerify.role !== "PROVIDER") {
      throw new Error("User is not a provider");
    }

    const result = await prisma.providerProfile.create({
      data: {
        userId: userVerify.id as string,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const authService = {
  providerCreate,
};
