"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, verifyToken } from "@/lib/auth-backend";
import useAuthStore from "../stores/authStore";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      email,
      password: pass,
    };
    const res = await loginUser(userData);
    if (res.message === "Login Failed") {
      alert(res.message);
    } else {
      const userRes = await verifyToken();
      alert(res.message);
      setUser(userRes.user.username, userRes.user.role);
      router.replace("/");
    }
  };

  const forgotPassword = () => {
    console.log(`Email : ${email} , Lupa Password`);
  };

  return (
    <div className="bg-gray-950 flex justify-center">
      <div className="min-h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 place-items-center text-white w-full md:w-7xl p-5">
        <div>
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-center select-none">
            <div className="flex items-center gap-2 text-2xl md:text-4xl font-orbitron font-bold">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-500 to-purple-700 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)] tracking-widest">
                F&amp;F
              </span>
              <span className="text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">
                Events
              </span>
            </div>
            <div className="text-xs md:text-sm text-fuchsia-400/80 font-exo2 tracking-[0.2em] uppercase animate-pulse">
              Sign In Terminal
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 w-[90%] font-orbitron"
        >
          {/* Email */}

          <div className="flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1">
              <div>Email</div>
              <input
                type="email"
                placeholder="Input Email Here"
                className="border-b border-white w-full pl-1 outline-0 focus:border-purple-400 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1 relative">
              <div>Password</div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Input Password Here"
                  className="border-b border-white w-full pl-1 pr-10 outline-0 focus:border-purple-400 transition-colors"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-2 top-0 text-sm text-gray-400 hover:text-white"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={forgotPassword}
              disabled={email === ""}
              className={`text-xs md:text-sm ${
                email === ""
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-fuchsia-400/80 hover:cursor-pointer"
              } font-exo2 tracking-[0.2em] uppercase `}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={pass === "" || email === ""}
              className={`${
                pass === "" || email === ""
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
              } rounded-2xl px-4 py-2 text-white transition-all`}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
