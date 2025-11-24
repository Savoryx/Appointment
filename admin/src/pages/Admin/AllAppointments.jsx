import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

function AllAppointment() {
  const { aToken, appointments, getAllAppointments, calculateAge,cancelAppointment } =
    useContext(AdminContext);
  const currency = "₹";

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-8xl m-5 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-56 py-56 sm:py-20 md:py-10">
      <p className="text-2xl font-semibold mb-4">All Appointments</p>

      {/* Header */}
      <div className="hidden md:grid grid-cols-7 bg-gray-100 font-semibold p-2 rounded gap-x-6">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Status</p>
      </div>

      {appointments.length === 0 ? (
        <p className="text-gray-500 mt-4">No appointments found.</p>
      ) : (
        appointments.map((item, index) => (
          <div
            key={item._id || index}
            className="grid md:grid-cols-7 grid-cols-2 md:border-b border border-gray-200 p-3 md:p-2 rounded-lg md:rounded-none md:items-center text-sm md:text-base gap-y-1 md:gap-y-0 md:gap-x-6"
          >
            {/* # */}
            <p>{index + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-2">
              {item.userData?.image && (
                <img
                  src={item.userData.image}
                  alt={item.userData?.name || "Patient"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <p>{item.userData?.name || "Unknown"}</p>
            </div>

            {/* Age */}
            <p>{calculateAge(item.userData?.dob) || "-"}</p>

            {/* Date & Time */}
            <p>
              {formatDate(item.slotDate)} — {item.slotTime}
            </p>

            {/* Doctor */}
            <div className="flex items-center gap-2">
              {item.docData?.image && (
                <img
                  src={item.docData.image}
                  alt={item.docData?.name || "Doctor"}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                />
              )}
              <p>{item.docData?.name || "Doctor"}</p>
            </div>

            {/* Fees */}
            <p>
              {currency}
              {item.amount || item.docData?.fees || "-"}
            </p>

            {/* Status */}
            <p>
              {item.cancelled ? (
                <span className="text-red-500">Cancelled</span>
              ) : (
                <span onClick={()=>cancelAppointment(item._id)} className="text-green-600 hover:cursor-pointer">Active</span>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllAppointment;
