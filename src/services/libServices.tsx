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

const getCategory = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/libs/category`,
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

const getProductInventory = async (accessToken: string, branch: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_inventory?branchaccess=${branch}`,
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

const getPaymentMethod = async (accessToken: string, type?: string) => {
  try {
    const response = await fetch(
      type === "all"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/libs/payment_method?type=all`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/libs/payment_method`,
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
  getCategory,
  getProductInventory,
  getPaymentMethod,
};
