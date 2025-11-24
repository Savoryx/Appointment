import React, { useState, useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Admin Login Successful ✅");
        } else {
          toast.error(data.message);
        }
      } 
      else if (state === "Doctor") {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
            console.log("Doctor login data:", data);
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          toast.success("Doctor Login Successful ✅");
        } else {
          toast.error(data.message);
        }
      } 
      else {
        toast.error("Invalid user type");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed! Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          <span className="text-blue-500">{state}</span> Login
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="email">
            Email:
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            id="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">
            Password:
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            id="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors duration-300"
        >
          Login
        </button>

        {/* Toggle between Admin and Doctor login */}
        {state === "Admin" ? (
          <p className="mt-4 text-center text-gray-700">
            Doctor Login?{" "}
            <span
              className="text-blue-500 cursor-pointer font-medium"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-center text-gray-700">
            Admin Login?{" "}
            <span
              className="text-blue-500 cursor-pointer font-medium"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
