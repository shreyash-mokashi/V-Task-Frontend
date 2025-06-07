import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailPattern.test(email)) return "Please enter a valid email.";
    return "";
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!password) return "Password is required.";
    if (!passwordPattern.test(password))
      return "Password must be 8–12 chars, include letter, number & symbol.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Live validation per field
    if (name === "email") {
      const emailError = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: emailError }));
    }

    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return; // Prevent submit if errors
    }

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        email: "",
        password: "",
        form: "Login failed. Please check your credentials.",
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          type="email"
          className={`login-input ${errors.email ? "inputInvalid" : ""}`}
          value={form.email}
        />
        {errors.email && <div className="field-error">{errors.email}</div>}

        <div className="password-wrapper">
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            required
            maxLength={12}
            className={`login-input ${errors.password ? "inputInvalid" : ""}`}
            value={form.password}
          />
          <button
            type="button"
            className="toggle-password-button"
            onClick={toggleShowPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}

        {errors.form && <div className="form-error">{errors.form}</div>}

        <button
          type="submit"
          className="login-button"
          disabled={errors.email !== "" || errors.password !== ""}
          style={{
            cursor:
              errors.email !== "" || errors.password !== ""
                ? "not-allowed"
                : "pointer",
          }}
        >
          Login
        </button>
      </form>

      <p className="register-link">
        New user?{" "}
        <Link to="/register" className="register-link-text">
          Register here
        </Link>
      </p>
    </div>
  );
}
