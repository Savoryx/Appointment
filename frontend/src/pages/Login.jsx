import React, { useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {

  const { backendUrl, token, setToken } = React.useContext(AppContext);

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate();


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    // handle login/signup logic here
    try {
      if (state === 'Sign Up') {
        // Sign Up logic
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        // Login logic
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/10 via-white to-primary/10"
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-black/5 shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
            login
          </p>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Please {state === 'Sign Up' ? 'log in' : 'sign up'} to book an
            appointment
          </p>
        </div>

        {/* Name (only for sign up) */}
        {state === 'Sign Up' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="full_name" className="text-gray-700 text-sm font-medium">Full Name</label>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="full_name"
              autoComplete="name"
              aria-label="Full name"
              className="h-11 w-full border border-gray-300 rounded-xl px-3 text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/50"
              placeholder="Enter your full name"
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            autoComplete="email"
            inputMode="email"
            aria-label="Email address"
            className="h-11 w-full border border-gray-300 rounded-xl px-3 text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/50"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</label>
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            autoComplete="current-password"
            aria-label="Password"
            className="h-11 w-full border border-gray-300 rounded-xl px-3 text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/50"
            placeholder="Enter your password"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="h-11 w-full inline-flex items-center justify-center bg-primary text-white rounded-xl font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Log in'}
        </button>

        {/* Toggle between login & sign up */}
        <p className="text-sm text-gray-600 text-center">
          {state === 'Sign Up'
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <span
            onClick={() =>
              setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
            }
            className="text-primary font-semibold cursor-pointer hover:underline underline-offset-4"
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </form>
  )
}

export default Login
