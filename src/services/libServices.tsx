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

const getCustomer = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/customer`,
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

const getFormCheck = async (accessToken: string, deviceType: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/form_checking?device_type=${deviceType}`,
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

const getCabang = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/libs/cabang`,
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

const getTechnician = async (accessToken: string, branch: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/libs/technician?branch=${branch}`,
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

const getDevice = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/libs/device?type=all`,
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
  getCustomer,
  getFormCheck,
  getCabang,
  getTechnician,
  getDevice,
};
