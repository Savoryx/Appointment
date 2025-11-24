import React from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext' // ✅ Missing import added
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets_admin/assets'

function Sidebar() {
  const { aToken } = React.useContext(AdminContext)
  const { dToken } = React.useContext(DoctorContext)

  // Determine which sidebar to show
  const isAdmin = Boolean(aToken)
  const isDoctor = Boolean(dToken)

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-64px)] w-56 bg-white shadow-md flex flex-col py-6 px-4">
      {isAdmin && (
        <ul className="space-y-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.home_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Dashboard</p>
          </NavLink>

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.appointment_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.add_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.people_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {isDoctor && (
        <ul className="space-y-4">
          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.home_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctor-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.appointment_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Appointments</p>
          </NavLink>

          <NavLink
            to="/doctor-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-primary/5'
              }`
            }
          >
            <img src={assets.people_icon} alt="" className="h-5 w-5" />
            <p className="text-sm">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
