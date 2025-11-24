import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs"; // <-- Always use bcrypt for passwords
import jwt from "jsonwebtoken"; // <-- For login tokens (optional, if needed)
import appointmentModel from "../models/appointmentModel.js";


// 🔹 Toggle availability
const changeAvailablity = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(id);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(id, { available: !docData.available });
    res.json({ success: true, message: "Availability Changed" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// 🔹 Fetch doctor list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        available: doctor.available,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Get doctor appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Cancel appointment by doctor
const cancelAppointmentByDoctor = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Release doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    const slots_booked = { ...(docData?.slots_booked || {}) };
    if (Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (time) => time !== slotTime
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// api to get data for doctor dashboard

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((appt) => {
      if (appt.payment) {
        earnings += appt.amount;
      }

    })

    let patients = [];

    appointments.map((appt) => {
  if (!patients.includes(appt.userId.toString())) {
    patients.push(appt.userId.toString());
  }
})

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.slice(-5).reverse(),
      cancelledAppointments: appointments.filter(appt => appt.cancelled).length,
    }

    console.log("Doctor Dashboard Data:", dashData);

    res.json({
      success: true,
      dashData,
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });

  }
}


// api to get doctor profile
const doctorProfile = async (req, res) => {
  try {

    const docId = req.docId;
    const doctor = await doctorModel.findById(docId).select("-password");

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, doctor });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
    
  }
}

// api to update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const updatedData = req.body;

    //  Return updated document
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      updatedData,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor,  //  IMPORTANT
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


export {
  changeAvailablity,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  cancelAppointmentByDoctor,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
