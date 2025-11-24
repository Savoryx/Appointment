// import React, { useContext , useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'
// import { doctors } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'


// function Doctors() {
//     const navigate = useNavigate()

//     const {speciality} =useParams()
//     console.log(speciality)
//     const {doctors} = useContext(AppContext)
//     const[filterDoc , setFilterDoc] = useState([])

//     console.log("speciality param:", speciality);
//     console.log("all doctors:", doctors);


//     const applyFilter = () => {
//          if (speciality) {
//                 setFilterDoc(
//                 doctors.filter(
//                     (item) => item.speciality.toLowerCase() === speciality.toLowerCase()
//                 )
//                 )
//          } else {
//                 setFilterDoc(doctors)
//          }
//     }

//     useEffect(()=>{
//         applyFilter()
//     },[speciality , doctors])

//     return (
//         <div>
//             <p>Browse through the doctors specialist.</p>
//             <div>
//                 <div>
//                     <p>General physician</p>
//                     <p>Gynecologist</p>
//                     <p>Dermatologist</p>
//                     <p>Pediatricians</p>
//                     <p>Neurologist</p>
//                     <p>Gastroenterologist</p>
//                 </div>

//                 <div>
//                     {
//                         filterDoc.map((item, index) => (
//                         <div
//                             onClick={() => navigate(`/appointment/${item._id}`)}
//                             key={index}
//                             className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
//                         >
//                             <img className="bg-blue-50 w-full" src={item.image} alt="" />
//                             <div className="p-4">
//                             <div className="flex items-center gap-2 text-sm text-green-500">
//                                 <p className="w-2 h-2 bg-green-500 rounded-full"></p>
//                                 <p>Available</p>
//                             </div>
//                             <p className="mt-2 text-lg text-gray-900 font-medium">{item.name}</p>
//                             <p className="text-gray-600 text-sm">{item.speciality}</p>
//                             </div>
//                         </div>
//                         ))
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Doctors













import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Doctors() {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (item) => item.speciality.toLowerCase() === speciality.toLowerCase()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, doctors]);

  return (
    <div className="p-4 sm:p-6">
      <p className="text-lg sm:text-xl font-medium mb-6">
        Browse through the doctors specialist.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar toggle for mobile */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filter
        </button>

        {/* Sidebar filter */}
        <div
          className={`w-full lg:w-64 space-y-2 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <button
            onClick={() => navigate("/doctors")}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              !speciality
                ? "bg-primary text-white font-light"
                : "bg-gray-100 hover:bg-blue-100 font-light"
            }`}
          >
            All Doctors
          </button>

          {specialities.map((spec, i) => (
            <button
              key={i}
              onClick={() => navigate(`/doctors/${spec}`)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                speciality?.toLowerCase() === spec.toLowerCase()
                  ? "bg-primary text-white font-light"
                  : "bg-gray-100 hover:bg-blue-100 font-light"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-500"
            >
              <img
                className="bg-blue-50 w-full h-48 sm:h-60 object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="mt-2 text-base sm:text-lg text-gray-900 font-medium">
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}

          {filterDoc.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No doctors available for this speciality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
