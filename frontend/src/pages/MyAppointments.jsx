import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const { backendUrl, token } = useContext(AppContext);
  const [Appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"
  ];

  const slotDateFormatter = (slotDate) => {
    if (!slotDate) return "-";
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      console.log("Fetched appointments data:", data);

      if (data.success) {
        const reversed = [...data.appointments].reverse();
        setAppointments(reversed);
        console.log("Appointments data:", reversed);
      }
    } catch (error) {
      console.log("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  const cancellAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        getUserAppointments();

        useEffect(() => { getDoctorsData() }, []);

      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.log("Error cancelling appointment:", error);
    }
  };


  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Booking",
      description: "Test Transaction",
      order_id: order.id,
      receipt: order.receipt,
      handler: async function (response) {
        try {

          console.log("Payment response:", response);
          const { data } = await axios.post(`${backendUrl}/api/user/verifyrazorpay`, response, { headers: { token } });

          console.log("Backend verification response:", data);

          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          }



          // You can send response to backend for signature verification here
        } catch (error) {
          console.log("Error in payment handler:", error);
          toast.error("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const appointmentRazorpay = async (appointmentId) => {

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        console.log("Razorpay payment data:", data);

        initPay(data.order);
      }
    } catch (error) {
      console.log("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div>
        {Appointments.filter((item) => !item.cancelled).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            {/* Doctor Image */}
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData?.image}
                alt={item.docData?.name}
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData?.name}
              </p>
              <p>{item.docData?.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address :</p>
              <p className="text-xs">{item.docData?.address?.line1 || "-"}</p>
              <p className="text-xs">{item.docData?.address?.line2 || "-"}</p>
              <p className="text-xs mt-1">
                <span className="text-sm font-medium text-neutral-700">
                  Date & Time :
                </span>{" "}
                {slotDateFormatter(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 justify-center">

              {item.payment ? (
                <button className="sm:min-w-48 py-2 rounded text-white bg-green-500 cursor-default">
                  Paid
                </button>
              ) : (
                <>
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                  <button
                    onClick={() => cancellAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
