import React, { useState } from 'react';
import loginIllustration from './../../assets/user_login.jpeg'; // Ensure path is correct
const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    //console.log('--- LOGIN START ---');
   // console.log(API_URL);
  //  console.log('Credentials:', { username, password });

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
     // console.log('Server Response:', data);

      if (response.ok) {
        // 1. Check if the token actually exists in the response
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username',username);
     //     console.log('Token successfully stored in LocalStorage');
      //    console.log('Stored Token Preview:', data.token.substring(0, 10) + "...");
        } else {
          console.warn('Login succeeded but no Token was found in response body!');
        }

        // alert('Welcome Back!');
        window.location.href = '/gateway';
      } else {
        console.error('Login Failed with status:', response.status);
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Network Error during login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f0fe] p-6">

  {/* MAIN CARD */}
  <div className="w-full max-w-2xl h-[400px] bg-white rounded-2xl shadow-xl overflow-hidden flex border border-gray-100">

    {/* LEFT PANEL */}
    <div className="w-1/2 h-full flex items-center justify-center p-10">
      <img
        src={loginIllustration}
        alt="User Login"
        className="max-w-full max-h-full object-contain"
      />
    </div>

    {/* RIGHT PANEL */}
    <div className="w-1/2 h-full flex flex-col justify-center items-center p-10">

      <h2 className="text-2xl font-serif text-[#1e4e8a] mb-2">
        Welcome Back !!!
      </h2>

      <h3 className="text-2xl font-semibold text-[#8a5d21] mb-8">
        User Login
      </h3>

      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">

        {/* Username */}
        <div>
          <label className="block text-sm text-[#1e4e8a] mb-1">
            User Name
          </label>
          <input
            type="text"
            value={username}
            placeholder='enter the username'
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-2 py-2 bg-[#e0e8f0] rounded-xl focus:ring-2 focus:ring-[#1e4e8a]/50 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-[#1e4e8a] mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder='enter the password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-2 bg-[#e0e8f0] rounded-xl focus:ring-2 focus:ring-[#1e4e8a]/50 outline-none"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-xl text-white font-semibold transition
            ${username && password
              ? "bg-[#22b978] hover:bg-[#1da36a]"
              : "bg-[#69a18a]"
            }`}
        >
          Login
        </button>

      </form>
    </div>
  </div>
</div>
  );
};

export default LoginPage;
