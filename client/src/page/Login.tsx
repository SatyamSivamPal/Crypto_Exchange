import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate();

  function handleLogin () {
    navigate('/login');
  }

  return (
    <>
      <div className="relative flex justify-center items-center h-[90vh] bg-gray-900 overflow-hidden font-roboto">
        {/* Background Section */}
        <div className="absolute inset-0 z-0 py-28">
          <div className="relative w-full filter blur-sm">
            <img
              src="candlestick-chart.svg"
              alt=""
              className="absolute inset-0 m-auto w-[1100px]"
            />
            <img
              src="grid-background.svg"
              alt=""
              className="inset-0 m-auto opacity-65 w-[1200px]"
            />
          </div>
        </div>

        {/* Signup card */}
        <div className="z-10 bg-opacity-90 rounded-lg shadow-lg max-w-md bg-baseBackgroundL2 w-[380px] px-7 pb-7 pt-7">
          <div className="flex justify-center mb-6 bg-transparent">
            <div className="text-red-500 text-4xl bg-transparent">
              <p className="bg-transparent">
                <span className="text-white bg-transparent">X</span>change
              </p>
            </div>
          </div>
          <h2 className="text-white text-center text-2xl font-semibold mb-5 bg-transparent">
            Sign in
          </h2>
          <form className="flex flex-col gap-4 bg-transparent">
            <input
              type="email"
              placeholder="Email"
              className="bg-portfolioBackground text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md p-2"
            />
            <div className="relative bg-transparent">
              <input
                type="password"
                placeholder="Password"
                className="bg-portfolioBackground text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md p-2 w-full"
              />
            </div>
            <div className="flex justify-between bg-transparent text-white font-roboto text-sm">
                <div className="bg-transparent">New here? <a href="/signup" className="text-blue-400 underline bg-transparent">
                  Signup
                </a> </div>
                <div className="bg-transparent">
                <a href="/forgotPassword" className="text-blue-400 underline bg-transparent">
                  Forgot Password
                </a>
                </div>
            </div>
            

            <button
              type="submit"
              className="bg-red-500 text-white font-semibold p-2 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
