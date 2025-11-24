import React, { useEffect, useContext } from "react";
import { DoctorContext as DocContext } from "../../context/DoctorContext.jsx";

function DoctorDashboard() {
  const { dashData, setDashData, getDashData, dToken } = useContext(DocContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  // optional — handle cancel action
  const handleCancel = async (appointmentId) => {
    console.log("Cancel clicked:", appointmentId);
    // you can trigger a cancel API call here later
  };

  return (
    <div className="p-6 md:p-10 pl-52 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Hello from Doctor Dashboard 👋
      </h1>

      {dashData ? (
        <>
          {/* --- Dashboard summary cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-blue-50 p-4 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Total Appointments</p>
              <h2 className="text-3xl font-bold">{dashData.appointments}</h2>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Earnings</p>
              <h2 className="text-3xl font-bold">₹ {dashData.earnings}</h2>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Patients</p>
              <h2 className="text-3xl font-bold">{dashData.patients}</h2>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Cancelled</p>
              <h2 className="text-3xl font-bold">
                {dashData.cancelledAppointments || 0}
              </h2>
            </div>
          </div>

          {/* --- Latest Appointments Section --- */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Latest Appointments</h2>
            <div className="flex flex-col gap-5">
              {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between p-5 bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.userData?.image || "/default-user.png"}
                        alt={item.userData?.name || "User"}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-lg">
                          {item.userData?.name || "Unknown"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.slotDate} — {item.slotTime}
                        </p>
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
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No recent appointments found.
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
}

export default DoctorDashboard;
