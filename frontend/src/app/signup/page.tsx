"use client";
import { useState } from "react";
import { registerUser } from "@/lib/auth-backend";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [refCode, setRefCode] = useState("");
  const [userType, setUserType] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      username,
      email,
      password: pass,
      type: userType,
      refCode,
    };
    console.log("User Data:", userData);
    const res = await registerUser(userData);
    if (res.message === "Register Success") {
      alert(res.message);
      router.push("/signin");
    } else {
      alert(res.message);
    }
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
              Sign Up Terminal
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 w-[90%] font-orbitron"
        >
          {/* Username + Email */}
          <div className="flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1">
              <div>Username</div>
              <input
                type="text"
                placeholder="Input Username Here"
                className="border-b border-white w-full pl-1 outline-0 focus:border-purple-400 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
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

          {/* Password + Confirm Password */}
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
            <div className="w-full md:w-[80%] flex flex-col gap-1 relative">
              <div className={pass === confirmPass ? "" : "text-red-600"}>
                Confirm Password
              </div>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm Password Here"
                  className={`border-b w-full pl-1 pr-10 outline-0 transition-colors ${
                    pass === confirmPass
                      ? "border-white focus:border-purple-400"
                      : "border-red-600 focus:border-red-600"
                  }`}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                  className="absolute right-2 top-0 text-sm text-gray-400 hover:text-white"
                >
                  {showConfirmPass ? "Hide" : "Show"}
                </button>
              </div>
              {pass !== confirmPass && (
                <div className="text-red-600 text-[13px] mt-1">
                  Password does not match
                </div>
              )}
            </div>
          </div>

          {/* Referral */}
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1">
              <div
                className={
                  refCode.length === 0 || refCode.length === 36
                    ? ""
                    : "text-red-600"
                }
              >
                Referral Code
              </div>
              <input
                type="text"
                placeholder="Input Code Here"
                className={`border-b w-full pl-1 outline-0 transition-colors ${
                  refCode.length === 0 || refCode.length === 36
                    ? "border-white focus:border-purple-400"
                    : "border-red-600 focus:border-red-600"
                }`}
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
              />
              {refCode.length === 0 || refCode.length === 36 ? (
                ""
              ) : (
                <div className="text-red-600">Referral Code Invalid</div>
              )}
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="flex justify-evenly">
            <div>
              <input
                type="radio"
                id="customer"
                value="Customer"
                name="Category"
                checked={userType === "Customer"}
                onChange={(e) => setUserType(e.target.value)}
              />
              <label htmlFor="customer" className="ml-1 hover:cursor-pointer">
                Customer
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="event"
                value="EventOrganizer"
                name="Category"
                checked={userType === "EventOrganizer"}
                onChange={(e) => setUserType(e.target.value)}
              />
              <label htmlFor="event" className="ml-1 hover:cursor-pointer">
                Event Organizer
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={pass !== confirmPass}
              className={`${
                pass !== confirmPass
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
              } rounded-2xl px-4 py-2 text-white transition-all`}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
