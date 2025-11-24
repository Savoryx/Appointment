import React from 'react'
import Login from './pages/login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './component/Navbar'
import { AdminContext } from './context/AdminContext'
import Sidebar from './component/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard.jsx'
import AllAppointments from './pages/Admin/AllAppointments.jsx'
import AddDoctor from './pages/Admin/AddDoctor.jsx'
import DoctorsList from './pages/Admin/DoctorsList.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'
import DoctorDashboard from './pages/Doctors/doctorDashboard.jsx'
import DoctorAppointment from './pages/Doctors/doctorAppointment.jsx'
import DoctorProfile from './pages/Doctors/doctorProfile.jsx'

function App() {
  const { aToken } = React.useContext(AdminContext)
  const { dToken } = React.useContext(DoctorContext)

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointment />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
