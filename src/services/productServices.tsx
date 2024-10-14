type DataProduct = {
  name: string;
  sub_name: string;
  sell_price: number;
  purchase_price: number;
  warranty: number;
  is_pos: string;
  is_invent: string;
  product_type: string;
  category: any;
  device: any;
  branch: number;
};

const getProductLib = async (accessToken: string) => {
  try {
    const response = await fetch(`/api/product/lib`, {
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

// const getCategoryById = async (accessToken: string, id: number) => {
//   try {
//     const response = await fetch(`/api/category/${id}`, {
//       headers: {
//         authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const res = await response.json();
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

const createProduct = async (accessToken: string, data: DataProduct) => {
  try {
    const response = await fetch("/api/product", {
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

// const deleteCategory = async (accessToken: string, id: number) => {
//   try {
//     const response = await fetch(`/api/category/${id}`, {
//       method: "DELETE",
//       headers: {
//         authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const res = await response.json();
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

// const editCategory = async (
//   accessToken: string,
//   id: number,
//   data: DataCategory
// ) => {
//   try {
//     const name = data.name;

//     const response = await fetch(`/api/category/${id}`, {
//       method: "PUT",
//       headers: {
//         authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name,
//       }),
//     });

//     const res = await response.json();
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

export default {
  getProductLib,
  createProduct,
  //   getCategoryById,
  //   createCategory,
  //   deleteCategory,
  //   editCategory,
};
