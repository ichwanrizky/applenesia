const createService = async (accessToken: string, data: any) => {
  try {
    const response = await fetch("/api/service", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
};

export default { createService };
