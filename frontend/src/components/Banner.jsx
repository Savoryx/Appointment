import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


function Banner() {
    const navigate = useNavigate()
    return (
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
            {/* ----------- tect LEFT------ */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p>With 100+ Trusted Doctors</p>
                </div>
                <button onClick={() => {navigate('/login'); scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all duration-300'>Create account</button>

            </div>


            {/* ----------- tect RIGHT------ */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner









// import React from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";

// const Banner = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative mt-16"> {/* Increased margin-top for breathing space */}
//       <section className="max-w-7xl mx-auto px-6 relative"> {/* Wider container */}
//         {/* Blue Background Card */}
//         <div className="bg-[#5869f2] rounded-2xl flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-14 md:py-20 relative z-10">
          
//           {/* Left Content */}
//           <div className="text-white max-w-xl text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl font-bold leading-snug">
//               Book Appointment <br /> With 100+ Trusted Doctors
//             </h1>
//             <button
//               onClick={() => {
//                 navigate("/login");
//                 scrollTo(0, 0);
//               }}
//               className="mt-8 bg-white text-gray-800 px-7 py-4 rounded-full font-medium shadow hover:bg-gray-100 transition"
//             >
//               Create account
//             </button>
//           </div>
//         </div>

//         {/* Doctor Image (OVERFLOW) */}
//         <div className="absolute bottom-0 right-10 z-20"> {/* Changed from right-0 to right-10 */}
//                 <img
//                     src={assets.appointment_img}
//                     alt="Doctor"
//                     className="w-[380px] lg:w-[460px] object-contain"
//                 />
//          </div>
//       </section>
//     </div>
//   );
// };

// export default Banner;
