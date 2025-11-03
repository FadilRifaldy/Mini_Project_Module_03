import axios from "axios";

interface IUserRegister {
  username: string;
  email: string;
  password: string;
  type: string;
  refCode: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

export async function registerUser(user: IUserRegister) {
  try {
    const res = await axios.post("http://localhost:8500/auth/register", user);
    return res.data;
  } catch (error) {
    console.error(error);
    return { message: "Register Failed" };
  }
}

export async function loginUser(user: IUserLogin) {
  try {
    const res = await axios.post("http://localhost:8500/auth/login", user, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { message: "Login Failed" };
  }
}

export async function verifyToken() {
  try {
    const res = await axios.get("http://localhost:8500/auth/verify-token", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { message: "Token Invalid" };
  }
}
