import { create } from "zustand";
import { verifyToken } from "@/lib/auth-backend";

interface IAuthStore {
  username: string;
  role: string;
  setUser: (userNameParam: string, roleParam: string) => void;
  readCookie: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
  // STATE
  username: "",
  role: "",

  // ACTION
  setUser: (userNameParam: string, roleParam: string) =>
    set(() => ({
      username: userNameParam,
      role: roleParam,
    })),
  readCookie: async () => {
    const res = await verifyToken();

    if (res) {
      set(() => ({
        username: res.user.username,
        role: res.user.role,
      }));
    }
  },
}));

export default useAuthStore;
