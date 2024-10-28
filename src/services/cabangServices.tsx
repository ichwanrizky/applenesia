const getCabangById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/cabang/${id}`, {
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

const createCabang = async (accessToken: string, data: string) => {
  try {
    const response = await fetch("/api/cabang", {
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

const deleteCabang = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/cabang/${id}`, {
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

const editCabang = async (accessToken: string, id: number, data: string) => {
  try {
    const response = await fetch(`/api/cabang/${id}`, {
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

export default { createCabang, deleteCabang, getCabangById, editCabang };
