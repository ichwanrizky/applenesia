const createInvoiceBulk = async (accessToken: string, data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoice/bulk`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: data,
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

const getInvoiceById = async (accessToken: string, invoice_id: string) => {
  try {
    const response = await fetch(`/api/invoice/${invoice_id}`, {
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

const updatePayment = async (
  accessToken: string,
  invoice_id: string,
  data: any
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoice/payment/${invoice_id}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        method: "PUT",
        body: data,
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

const updateInvoice = async (
  accessToken: string,
  invoice_id: string,
  data: any
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoice/${invoice_id}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        method: "PUT",
        body: data,
      }
    );
    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export default {
  createInvoiceBulk,
  getInvoiceById,
  updatePayment,
  updateInvoice,
};
