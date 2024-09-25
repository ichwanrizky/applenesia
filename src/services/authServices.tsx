import { signIn } from "next-auth/react";

const loginUser = async (username: string, password: string) => {
  try {
    const response = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// const register
export default { loginUser };
