type DataDevice = {
  name: string;
  type: number;
};

const getDeviceById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/device/${id}`, {
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

const createDevice = async (accessToken: string, data: DataDevice) => {
  try {
    const name = data.name;
    const type = data.type;

    const response = await fetch("/api/device", {
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

const deleteDevice = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/device/${id}`, {
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

const editDevice = async (
  accessToken: string,
  id: number,
  data: DataDevice
) => {
  try {
    const name = data.name;
    const type = data.type;

    const response = await fetch(`/api/device/${id}`, {
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
  createDevice,
  deleteDevice,
  getDeviceById,
  editDevice,
};
