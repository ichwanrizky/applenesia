const getProductPurchaseById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/product_purchase/${id}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

const createProductPurchase = async (accessToken: string, data: string) => {
  try {
    const response = await fetch("/api/product_purchase", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
};

const deleteProductPurchase = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/product_purchase/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

const editProductPurchase = async (
  accessToken: string,
  id: number,
  data: string
) => {
  try {
    const response = await fetch(`/api/product_purchase/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export default {
  getProductPurchaseById,
  createProductPurchase,
  deleteProductPurchase,
  editProductPurchase,
};
