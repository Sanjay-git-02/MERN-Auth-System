import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(0);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 w-28 sm:w-32 sm:left-20 top-5 cursor-pointer"
        onClick={() => navigate("/")}
      />
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 w-96 p-8 shadow-lg rounded-lg text-sm"
        >
          <h1 className="text-3xl text-white text-center font-semibold mb-4">
            Reset Password
          </h1>
          <p className="text-indigo-300 text-xs text-center mb-6">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-0"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="text-white font-medium text-center py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 w-full rounded-full">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 w-96 p-8 shadow-lg rounded-lg text-sm"
        >
          <h1 className="text-3xl text-white text-center font-semibold mb-4">
            Reset Password OTP
          </h1>
          <p className="text-indigo-300 text-xs text-center mb-6">
            Enter your 6-digit code to reset your password
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md"
                />
              ))}
          </div>
          <button className="w-full bg-linear-to-r from-indigo-500 to-indigo-900 py-3 rounded-full text-white">
            Submit OTP
          </button>
        </form>
      )}

      {isEmailSent && isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 w-96 p-8 shadow-lg rounded-lg text-sm">
          <h1 className="text-3xl text-white text-center font-semibold mb-4">
            New Password
          </h1>
          <p className="text-indigo-300 text-xs text-center mb-6">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-0"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="text-white font-medium text-center py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 w-full rounded-full">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
