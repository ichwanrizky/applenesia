const getCategoryById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/category/${id}`, {
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

const createCategory = async (accessToken: string, data: string) => {
  try {
    const response = await fetch("/api/category", {
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

const deleteCategory = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/category/${id}`, {
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

const editCategory = async (accessToken: string, id: number, data: string) => {
  try {
    const response = await fetch(`/api/category/${id}`, {
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
  getCategoryById,
  createCategory,
  deleteCategory,
  editCategory,
};
