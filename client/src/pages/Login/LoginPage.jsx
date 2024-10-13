import React, { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { jwtDecode } from 'jwt-decode';  // Import named export
import axios from "axios";
import { auth, provider } from "../../components/config";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { userEmail, userPassword });

    axios
      .post("http://localhost:5000/login", { userEmail, userPassword })
      .then((response) => {
        console.log("Full login response:", response.data);
        const { token, user } = response.data;

        // Store the token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log(
          "Token and user data stored in localStorage:",
          JSON.parse(localStorage.getItem("user"))
        );

        navigateBasedOnRole(user.userRole);
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login failed. Please check your email and password.");
      });
  };
   const handleGoogleSignIn = () => {
     signInWithPopup(auth, provider)
       .then((result) => {
         const user = result.user;
         localStorage.setItem("email", user.email);
         localStorage.setItem(
           "user",
           JSON.stringify({
             userEmail: user.email,
             userName: user.displayName,
             userRole: 4, // Assuming Google sign-in users are customers by default
           })
         );
         navigate("/customer"); // Navigate to customer page after Google sign-in
       })
       .catch((error) => {
         console.error("Google login error:", error);
         alert("Google sign-in failed. Please try again.");
       });
  };
  const navigateBasedOnRole = (userRole) => {
    switch (userRole) {
      case 1:
        navigate("/admin");
        break;
      case 2:
        navigate("/manager");
        break;
      case 3:
        navigate("/staff");
        break;
      case 4:
      default:
        navigate("/customer");
        break;
    }
  };
    useEffect(() => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token); // Use named export jwtDecode
          const currentTime = Date.now() / 1000; // Convert to seconds

          if (decodedToken.exp < currentTime) {
            // Token is expired, clear the storage and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          } else {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.userRole) {
              navigateBasedOnRole(user.userRole);
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    }, [navigate]);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Office Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://baoantelecom.com/upload/images/Tin%20t%E1%BB%A9c/mau-mo-hinh-va-giai-phap-phong-hop-thong-minh-01.jpg"
          alt="Modern office space"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-4">
              <span className="text-2xl font-bold text-gray-700">WY</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                LOG IN
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                LOG IN WITH GOOGLE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
