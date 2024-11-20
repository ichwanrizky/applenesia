const getServiceById = async (accessToken: string, service_id: string) => {
  try {
    const response = await fetch(`/api/service/${service_id}`, {
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

const createService = async (accessToken: string, data: any) => {
  try {
    const response = await fetch("/api/service", {
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

const deleteService = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/service/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
};

const updateService = async (
  accessToken: string,
  data: any,
  service_id: string
) => {
  try {
    const response = await fetch(`/api/service/${service_id}`, {
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

export default { createService, deleteService, getServiceById, updateService };
