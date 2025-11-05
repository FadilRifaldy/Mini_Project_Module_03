"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [refCode, setRefCode] = useState("");
  const [userType, setUserType] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [originalName, setOriginalName] = useState("");
  const role = useAuthStore((s) => s.role);
  const route = useRouter();

  if (role === "") {
    alert("Kamu Belum Login");
    route.push("/signin");
  }

  useEffect(() => {
    async function getProfile() {
      const res = await axios.get("http://localhost:8500/profile", {
        withCredentials: true,
      });
      const profile = res.data;
      setOriginalName(profile.username);
      setUsername(profile.username);
      setEmail(profile.email);
      setRefCode(profile.refCode);
      setUserType(profile.role);
      setProfilePic(profile.profilePic);
    }
    getProfile();
  }, []);

  return (
    <div className="bg-gray-950 flex justify-center">
      <div className="min-h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 place-items-center text-white w-full md:w-7xl p-5">
        <div className="flex flex-col gap-5 justify-center items-center">
          <img
            src={profilePic}
            className="rounded-full w-[70%] border-2 border-white"
          />

          <button type="button" className="hover:cursor-pointer">
            Change Profile Picture
          </button>
        </div>

        <div className="flex flex-col gap-8 w-[90%] font-orbitron">
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
              <div className="w-full pl-1 outline-0">{email}</div>
            </div>
          </div>

          {/* Password */}
          <div className="flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1 relative">
              <div>Change Password</div>
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
          {pass !== "" ? (
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
          ) : (
            ""
          )}

          {/* Referral */}
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1">
              <div>Referral Code</div>
              <div className="w-full pl-1 outline-0">{refCode}</div>
            </div>
          </div>

          {/* Role */}
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[80%] flex flex-col gap-1">
              <div>Role</div>
              <div className="w-full pl-1 outline-0">{userType}</div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="button"
              disabled={
                (pass === "" && username === originalName) ||
                pass !== confirmPass
              }
              className={`${
                (pass === "" && username === originalName) ||
                pass !== confirmPass
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
              } rounded-2xl px-4 py-2 text-white transition-all`}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
