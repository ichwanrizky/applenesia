type dataUser = {
  name: string;
  username: string;
  password?: string;
  telp: string;
  role: string;
  manageBranch: string;
};

const getUserById = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/user/${id}`, {
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

const createUser = async (accessToken: string, data: dataUser) => {
  try {
    const name = data.name;
    const username = data.username;
    const password = data.password;
    const telp = data.telp;
    const role = data.role;
    const manageBranch = data.manageBranch;

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        password,
        telp,
        role,
        manageBranch,
      }),
    });

    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/user/${id}`, {
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

const editUser = async (accessToken: string, id: number, data: dataUser) => {
  try {
    const name = data.name;
    const username = data.username;
    const telp = data.telp;
    const role = data.role;
    const manageBranch = data.manageBranch;

    const response = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        telp,
        role,
        manageBranch,
      }),
    });

    const res = await response.json();
    return res;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (accessToken: string, id: number) => {
  try {
    const response = await fetch(`/api/user/${id}/resetpassword`, {
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

export default { createUser, getUserById, deleteUser, editUser, resetPassword };
