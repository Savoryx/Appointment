// import React from 'react'
// import {assets} from '../assets/assets'
// import { NavLink } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import { useState } from 'react'


// function Navbar() {

//     const navigate = useNavigate();
//     const[showMenu ,setShowMenu]=useState(false);
//     const [token , setToken] = useState(true);

//     return (
//         <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
//             <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
//             <ul className='hidden md:flex items-start gap-5 font-medium'>
//                 <NavLink to='/'>
//                     <li className='py-1'>HOME</li>
//                     <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//                 </NavLink>
//                 <NavLink to='/doctors'>
//                      <li className='py-1'>ALL DOCTORS</li>
//                     <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//                 </NavLink>
//                 <NavLink to='/about'>
//                     <li className='py-1'>ABOUT</li>
//                     <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//                 </NavLink>
//                 <NavLink to='/contact'>
//                     <li className='py-1'>CONTACTS</li>
//                     <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
//                 </NavLink>
//             </ul>
//             <div className='flex items-center gap-4'>
//                 {
//                     token ? <div className='flex items-center gap-2 cursor-pointer group relative '>
//                         <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
//                         <img className='w-2.5' src={assets.dropdown_icon} alt="" />

//                         <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block'>
//                             <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
//                                 <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>

//                                 <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>

//                                 <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>

//                             </div>
//                         </div>
//                     </div> :<button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block' >Create Account</button>
//                 }

//             </div>
//         </div>
//     )
// }

// export default Navbar



import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { token, setToken , userData} = useContext(AppContext);


  const logout =()=>{
    setToken(false);
    localStorage.removeItem("token");
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-36 sm:w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* Nav Links (desktop only) */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACTS</li>
        </NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer relative">
            {/* Profile + dropdown icon */}
            <div
              className="flex items-center gap-2"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img
                className="w-8 rounded-full"
                src={userData.image ? userData.image : assets.profile_pic}
                alt="profile"
              />
              <img
                className="w-2.5"
                src={assets.dropdown_icon}
                alt="dropdown"
              />
            </div>

            {/* Dropdown (desktop & mobile click) */}
            {showDropdown && (
              <div className="absolute top-12 right-0 text-base font-medium text-gray-600 bg-stone-100 rounded shadow-md flex flex-col gap-4 p-4 min-w-40 z-50">
                <p
                  onClick={() => {
                    navigate("/my-profile");
                    setShowDropdown(false);
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/my-appointments");
                    setShowDropdown(false);
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Button */}
        <img
          onClick={() => setShowMobileMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="menu"
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMobileMenu ? "fixed w-full h-full" : "hidden"
          } md:hidden right-0 top-0 bottom-0 z-20 bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6 border-b">
            {/* mobile menu header */}
            <img className="w-36" src={assets.logo} alt="logo" />
            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMobileMenu(false)}
              src={assets.cross_icon}
              alt="close"
            />
          </div>

          {/* Mobile nav links */}
          <ul className="flex flex-col items-center gap-6 mt-6 text-lg font-medium">
            <NavLink  to="/" onClick={() => setShowMobileMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>Home</p>
            </NavLink>
            <NavLink  to="/doctors" onClick={() => setShowMobileMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>All Doctors</p>
            </NavLink>
            <NavLink  to="/about" onClick={() => setShowMobileMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>About</p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMobileMenu(false)}>
              <p className='px-4 py-2 rounded inline-block'>Contacts</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
