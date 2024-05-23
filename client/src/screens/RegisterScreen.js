import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    // Your useEffect logic here if needed
  }, []);

  const validatePassword = (password) => {
    return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.\s).{8,15}$/);
  };

  async function register() {
    if (password === cpassword) {
      if (validatePassword(password)) {
        const user = {
          name,
          email,
          password,
          cpassword,
        };
        setLoading(true);
        setError("");
        setSuccess("");
        try {
          const result = (await axios.post("https://hotel-manis-lodge.onrender.com/api/users/register", user)).data;
          console.log(result);
          setSuccess(result);
          setName("");
          setEmail("");
          setPassword("");
          setCpassword("");
          window.location.href = "/login";
        } catch (error) {
          console.log(error);
          setError(error);
        }
        setLoading(false);
      } else {
        setError("Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-15 characters long.");
      }
    } else {
      setError("Passwords do not match.");
    }
  }

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowCPassword(!showCPassword);
  };

  return (
    <div>
      {loading && <Loader />}
      {error.length > 0 && <Error msg={error} />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success.length > 0 && <Success msg={success} />}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <br />
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br />
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"} // Show password as text if showPassword is true
                className="form-control"
                placeholder="Password (8-15 characters, including uppercase, lowercase, digits, and special characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {/* Eye icon to toggle password visibility */}
              <span onClick={togglePasswordVisibility} className="password-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <br />
            <input
              type={showCPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            /> 
            <span onClick={togglePasswordVisibility1} className="password-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            <br />
            {loading ? (
              <div>Registering... Please Wait...</div>
            ) : (
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
