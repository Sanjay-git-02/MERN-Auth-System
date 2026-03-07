import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, userData, isLoggedIn, getUserData } =
    useContext(AppContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const HandlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 w-28 sm:w-32 sm:left-20 top-5 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 w-96 p-8 shadow-lg rounded-lg text-sm"
      >
        <h1 className="text-3xl text-white text-center font-semibold mb-4">
          Email Verify OTP
        </h1>
        <p className="text-indigo-300 text-xs text-center mb-6">
          Enter your 6-digit code to verify your account
        </p>
        <div className="flex justify-between mb-8" onPaste={HandlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength="1"
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md"
              />
            ))}
        </div>
        <button className="w-full bg-linear-to-r from-indigo-500 to-indigo-900 py-3 rounded-full text-white">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
