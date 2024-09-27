import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const evaluatePasswordStrength = (pwd: any) => {
    const result = zxcvbn(pwd);
    setStrength(result.score); // 0 to 4, where 4 is the strongest
  };

  const getPipeFillClass = (index: any) => {
    if (index <= strength) {
      // Map strength score to color
      if (strength === 0) return 'bg-red-500';      // Weak
      if (strength === 1) return 'bg-yellow-500';   // Moderate
      if (strength === 2) return 'bg-yellow-500';   // Moderate
      if (strength === 3 || strength === 4) return 'bg-green-500';  // Strong
    }
    return 'bg-gray-500'; // Default color for unfilled pipes
  };

  function handleLogin () {
    navigate('/login');
  }

  return (
    <>
      <div className="relative flex justify-center items-center h-[90vh] bg-gray-900 overflow-hidden">
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
        <div className="z-10 bg-opacity-90 rounded-lg shadow-lg max-w-md bg-baseBackgroundL2 w-[380px] px-6 pb-6 pt-6">
          <div className="flex justify-center mb-6 bg-transparent">
            <div className="text-red-500 text-4xl bg-transparent">
              <p className="bg-transparent">
                <span className="text-white bg-transparent">X</span>change
              </p>
            </div>
          </div>
          <h2 className="text-white text-center text-2xl font-semibold mb-5 bg-transparent">
            Create Account
          </h2>
          <form className="flex flex-col gap-4 bg-transparent">
            <input
              type="email"
              placeholder="Email"
              className="bg-portfolioBackground text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md p-2"
            />
            <div className="relative bg-transparent">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  evaluatePasswordStrength(e.target.value);
                }}
                className="bg-portfolioBackground text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md p-2 w-full"
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } absolute inset-y-3 right-3 flex items-center cursor-pointer text-gray-400 bg-transparent`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
            <div className="flex gap-1 mb-4 bg-transparent w-28">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`w-1/4 h-2 rounded-lg  ml-1 ${getPipeFillClass(
                    index
                  )} transition-all duration-300`}
                />
              ))}
            </div>
            <div className="relative bg-transparent mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="bg-portfolioBackground text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md p-2 w-full"
              />
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                } absolute inset-y-3 right-3 flex items-center cursor-pointer text-gray-400 bg-transparent`}
                onClick={toggleConfirmPasswordVisibility}
              ></i>
            </div>

            {/* Password Strength Indicator */}

            <div className="flex items-center mb-4 text-white bg-transparent">
              <input
                type="checkbox"
                id="agreement"
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-portfolioBackground"
              />
              <label htmlFor="agreement" className="text-sm bg-transparent">
                By signing up, I agree to the{" "}
                <a href="#" className="text-blue-400 underline bg-transparent">
                  User Agreement
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 underline bg-transparent">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white font-semibold p-2 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={handleLogin}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
