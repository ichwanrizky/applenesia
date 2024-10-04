type DataFormChecking = {
  name: string;
  type: number;
};

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

const createFormChecking = async (
  accessToken: string,
  data: DataFormChecking
) => {
  try {
    const name = data.name;
    const type = data.type;

    const response = await fetch("/api/form_checking", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        type,
      }),
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
  data: DataFormChecking
) => {
  try {
    const name = data.name;
    const type = data.type;

    const response = await fetch(`/api/form_checking/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        type,
      }),
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
