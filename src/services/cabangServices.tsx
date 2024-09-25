type dataCabang = {
  id?: number;
  name: string;
  telp: string;
  address: string;
};

const createCabang = async (data: dataCabang) => {
  try {
    const name = data.name;
    const telp = data.telp;
    const address = data.address;

    const response = await fetch("/api/cabang", {
      method: "POST",
      headers: {
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

export default { createCabang };
