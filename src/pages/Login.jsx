import React from "react";

const Login = () => {
  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>

        <input 
          type="email" 
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
        />

        <input 
          type="password" 
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600 font-semibold">Sign Up</a>
        </p>
      </div>
    </section>
  );
};

export default Login;
