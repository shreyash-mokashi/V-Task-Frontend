import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation function returns error message or empty string
  const validateField = (name, value) => {
  if (name === 'name') {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!value) return 'Name is required.';
    if (!namePattern.test(value)) {
      return 'Name must contain only letters (no numbers or symbols).';
    }
  }

  if (name === 'email') {
    if (!value) return 'Email is required.';
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return 'Please enter a valid email address.';
  }

  if (name === 'password') {
    if (!value) return 'Password is required.';
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordPattern.test(value)) {
      return 'Password must be 8-12 chars, include letter, number & symbol.';
    }
  }

  if (name === 'confirmPassword') {
    if (!value) return 'Confirm password is required.';
    if (value !== form.password) return 'Passwords do not match.';
  }

  return '';
};


  // On each input change, validate the field live and update errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Check if the whole form is valid (no errors and all fields filled)
  const isFormValid =
    Object.values(errors).every((error) => error === '') &&
    Object.values(form).every((value) => value !== '');

  // On submit, only proceed if form valid
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Please fix the errors before submitting.');
      return;
    }

    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className={`formInput ${errors.name ? 'inputInvalid' : ''}`}
          autoComplete="name"
        />
        {errors.name && <div className="errorMessage">{errors.name}</div>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className={`formInput ${errors.email ? 'inputInvalid' : ''}`}
          autoComplete="email"
        />
        {errors.email && <div className="errorMessage">{errors.email}</div>}

        <input
          name="password"
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          maxLength={12}
          className={`formInput ${errors.password ? 'inputInvalid' : ''}`}
          autoComplete="new-password"
        />
        {errors.password && <div className="errorMessage">{errors.password}</div>}

        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          maxLength={12}
          className={`formInput ${errors.confirmPassword ? 'inputInvalid' : ''}`}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <div className="errorMessage">{errors.confirmPassword}</div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword" style={{ marginLeft: '5px' }}>
            Show Password
          </label>
        </div>

        <button
          type="submit"
          className="submitButton"
          disabled={!isFormValid}
          style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
