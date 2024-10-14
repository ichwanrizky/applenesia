type DataCategory = {
  name: string;
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

// const createCategory = async (accessToken: string, data: DataCategory) => {
//   try {
//     const name = data.name;

//     const response = await fetch("/api/category", {
//       method: "POST",
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
  //   getCategoryById,
  //   createCategory,
  //   deleteCategory,
  //   editCategory,
};
