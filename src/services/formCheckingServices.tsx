const getFormCheckingByID = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/form_checking/${id}`, {
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

const createFormChecking = async (accessToken: string, data: string) => {
  try {
    const response = await fetch("/api/form_checking", {
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

const deleteFormCheking = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/form_checking/${id}`, {
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

const editFormCheking = async (
  accessToken: string,
  id: number,
  data: string
) => {
  try {
    const response = await fetch(`/api/form_checking/${id}`, {
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
  getFormCheckingByID,
  createFormChecking,
  deleteFormCheking,
  editFormCheking,
};
