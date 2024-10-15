const getDeviceType = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/libs/devicetype`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export default {
  getDeviceType,
};
