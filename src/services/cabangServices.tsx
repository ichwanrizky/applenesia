type dataCabang = {
  name: string;
  telp: string;
  address: string;
};

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

const createCabang = async (accessToken: string, data: dataCabang) => {
  try {
    const name = data.name;
    const telp = data.telp;
    const address = data.address;

    const response = await fetch("/api/cabang", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        telp,
        address,
      }),
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

const editCabang = async (
  accessToken: string,
  id: number,
  data: dataCabang
) => {
  try {
    const name = data.name;
    const telp = data.telp;
    const address = data.address;

    const response = await fetch(`/api/cabang/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        telp,
        address,
      }),
    });

    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export default { createCabang, deleteCabang, getCabangById, editCabang };
