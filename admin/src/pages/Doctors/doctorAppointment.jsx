import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext.jsx";

function DoctorAppointment() {
  const { dToken, backendUrl, appointments, getAppointments } = React.useContext(DoctorContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  // ✅ Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { token: dToken } }
      );

      if (res.data.success) {
        toast.success("Appointment cancelled successfully");
        getAppointments(); // refresh list
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <div className="pt-3 md:p-10 lg:pl-[10rem] max-w-[1600px] mx-auto">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-base text-gray-500 mt-2">
            Manage your patient appointments and schedule here
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={getAppointments}
            className="px-4 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-gray-50 transition-all"
          >
            Refresh
          </button>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{appointments?.length ?? 0}</span> total
          </div>
        </div>
      </header>

      {/* ✅ Appointment Table */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left text-[1rem]">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-10 py-4">Patient Name</th>
              <th className="px-10 py-4">Email</th>
              <th className="px-10 py-4">Date</th>
              <th className="px-10 py-4">Time</th>
              <th className="px-10 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {appointments && appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-5 font-medium text-gray-900">
                    {appt.userData?.name || "N/A"}
                  </td>
                  <td className="px-10 py-5 text-gray-700">
                    {appt.userData?.email || "N/A"}
                  </td>
                  <td className="px-10 py-5 text-gray-700">{appt.slotDate || "N/A"}</td>
                  <td className="px-10 py-5 text-gray-700">{appt.slotTime || "N/A"}</td>
                  <td className="px-10 py-5">
                    {appt.cancelled ? (
                      <span className="text-red-600 font-semibold">Cancelled</span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(appt._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-2xs transition-all text-sm"
                      >
                        Active
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-12 text-gray-400 text-base font-medium"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorAppointment;
