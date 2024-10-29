const getProductById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/product/${id}`, {
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

const createProduct = async (accessToken: string, data: string) => {
  try {
    const response = await fetch("/api/product", {
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

const deleteProduct = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/product/${id}`, {
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

const editProduct = async (accessToken: string, id: number, data: string) => {
  try {
    const response = await fetch(`/api/product/${id}`, {
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

const getProductInventoryById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/product_inventory/${id}`, {
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

const editProductInventory = async (
  accessToken: string,
  id: number,
  data: string
) => {
  try {
    const response = await fetch(`/api/product_inventory/${id}`, {
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
  createProduct,
  getProductById,
  editProduct,
  deleteProduct,
  getProductInventoryById,
  editProductInventory,
};
