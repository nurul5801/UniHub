import React, { useState, useEffect } from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useNavigate } from 'react-router-dom';

const SlidingLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('');
  const [universityOptions, setUniversityOptions] = useState([]);
  
  // States for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');

  // useNavigate hook
  const navigate = useNavigate();

  // Fetch university options from API
  useEffect(() => {
    fetch('http://localhost:5000/api/unilist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUniversityOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching universities:', error);
        alert('Failed to load universities!');
      });
  }, []);
  

  // Toggle between login and registration
  const toggleForm = () => {
    setIsLogin(!isLogin);
    if (isLogin) {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedUniversity('');
      setUserType('');
    }
  };

  // Handle login API
  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password,
    };
    console.log(email, password);
  
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Login Response:', data);
        if (data.success) {
          // If token is present, the login is successful
          localStorage.setItem('authToken', data.token); // Save token for authentication
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          console.error('Login failed:', data.message);
          alert('Login failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  };
  

  // Handle registration API
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const registerData = {
      name,
      email,
      password,
      confirmPassword,
      userType,
      university: selectedUniversity,
    };

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Register Response:', data);
        if (data.success) {
          // If registration is successful, redirect to login page
          alert('Registration successful! Please log in.');
          toggleForm(); // Switch to login form
        } else {
          console.error('Registration failed:', data.message);
          alert('Registration failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error during registration:', error);
        alert('An error occurred during registration!');
      });
  };

  // Handle user type change
  const handleUserTypeChange = (e) => {
    setUserType(e.value);
    setSelectedUniversity(''); // Reset university selection when user type changes
  };

  // Handle Forgot Password action
  const handleForgotPassword = () => {
    alert('Forgot Password clicked! Redirect to password reset page.');
  };

  return (
    <div className="relative flex justify-center items-center mt-1 min-h-screen">
      <div className="relative w-96 bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          className={`relative flex transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}
          style={{ width: '200%' }}
        >
          {/* Login Form Container - Centered */}
          <div className="w-full p-6 flex justify-center items-center">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </button>
                <div className="text-center mt-2">
                  <span
                    onClick={handleForgotPassword}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Registration Form */}
          <div className="w-full p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              {/* User Type Dropdown */}
              <ReactDropdown
                options={['Student', 'Alumni', 'Industry']}
                onChange={handleUserTypeChange}
                value={userType}
                placeholder="Select User Type"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              
              {/* University Dropdown */}
              {(userType === 'Student' || userType === 'Alumni') && (
                <ReactDropdown
                  options={universityOptions.map((uni) => ({ value: uni.name, label: uni.name }))}
                  onChange={(selectedOption) => setSelectedUniversity(selectedOption.value)}
                  value={selectedUniversity}
                  placeholder="Select University"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Register
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center my-4 space-x-4">
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <span onClick={toggleForm} className='text-blue-300 hover:cursor-pointer'>
            {isLogin ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SlidingLoginRegister;
