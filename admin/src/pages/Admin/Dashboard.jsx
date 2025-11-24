import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';
import { assets } from "../../assets/assets_admin/assets.js";

function Dashboard() {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext);
  const [latestAppointments, setLatestAppointments] = useState([]);

  // fetch dashboard data
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  // sync local state whenever dashData updates
  useEffect(() => {
    if (dashData?.latestAppointments) {
      setLatestAppointments(dashData.latestAppointments);
    }
  }, [dashData]);

  // handle cancel
  const handleCancel = async (id) => {
    // optimistic UI update
    setLatestAppointments((prev) =>
      prev.map((appt) =>
        appt._id === id ? { ...appt, cancelled: true } : appt
      )
    );

    // then call API
    await cancelAppointment(id);
  };

  return (
    dashData && (
      <div className="m-5 px-8 lg:px-20 xl:px-54 w-full max-w-[1400px] mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Doctors */}
          <div className="flex items-center gap-4 p-6 bg-white shadow-md rounded-2xl">
            <img src={assets.doctor_icon} alt="Doctors" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-semibold">{dashData.doctors}</p>
              <p className="text-gray-500">Doctors</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="flex items-center gap-4 p-6 bg-white shadow-md rounded-2xl">
            <img src={assets.appointments_icon} alt="Appointments" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-semibold">{dashData.appointments}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="flex items-center gap-4 p-6 bg-white shadow-md rounded-2xl">
            <img src={assets.patients_icon} alt="Patients" className="w-12 h-12" />
            <div>
              <p className="text-2xl font-semibold">{dashData.patients}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <img src={assets.list_icon} alt="" className="w-7 h-7" />
            <p className="text-xl font-semibold">Latest Bookings</p>
          </div>

          {/* ↓ Vertical list (down to down) */}
          <div className="flex flex-col gap-5">
            {latestAppointments.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between p-5 bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.docData.image}
                    alt={item.docData.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-lg">{item.docData.name}</p>
                    <p className="text-gray-500 text-sm">{item.slotDate}</p>
                  </div>
                </div>

                {item.cancelled ? (
                  <span className="text-red-500 font-medium">Cancelled</span>
                ) : (
                  <span
                    onClick={() => handleCancel(item._id)}
                    className="text-green-600 font-medium cursor-pointer hover:underline"
                  >
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default Dashboard;
