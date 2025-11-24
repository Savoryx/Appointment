import validator from 'validator'
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';



//  create API to regester a new user
const registerUser = async (req, res) => {
    try {

        console.log("req.body:", req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // hassing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = await userModel.create(userData)
        const user = await newUser.save()

        // create a token by auto genetated id from user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// API for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}




// api to get user profile data
const getProfile = async (req, res) => {
    try {
        // const {userId} = req.body;
        const userId = req.userId;


        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



// update user profile data API

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const userId = req.userId;


        const imageFile = req.file;


        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "All fields are required" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
        }, { new: true });

        if (imageFile) {
            const imageUpload = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                fs.createReadStream(imageFile.path).pipe(uploadStream);
            });


            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {
                image: imageUrl,
            });
        }


        res.json({ success: true, message: "Profile updated successfully" });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// API to book appointment

const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId || req.body.userId;

        if (!docId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Doctor, slot date and time are required" });
        }

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Safe copy and ensure structure for slots_booked
        const slots_booked = { ...(docData.slots_booked || {}) };
        // checking for availability

        if (!Array.isArray(slots_booked[slotDate])) {
            slots_booked[slotDate] = [];
        }

        // Check availability
        if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: "Selected slot is already booked" });
        }

        // Reserve
        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        // Prepare plain doctor object without slots_booked
        const plainDoc = typeof docData.toObject === 'function' ? docData.toObject() : { ...docData };
        delete plainDoc.password;
        delete plainDoc.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: plainDoc,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Persist updated slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        res.json({ success: true, message: 'appointment booked' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}




// API to get user appointments

// const listAppointments = async (req, res) => {
//     try {

//         const userId = req.body.userId || req.userId;  

//         const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });

//         res.json({ success: true, appointments });

//     }catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }



const listAppointments = async (req, res) => {
    try {
        const userId = req.userId; // ✅ Always from middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing" });
        }

        const appointments = await appointmentModel
            .find({ userId })
            .sort({ date: -1 })
            .populate("docData");

        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error in listAppointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// api to cancel appointment

const cancelAppointment = async (req, res) => {
    try {

        const { appointmentId } = req.body;
        const userId = req.userId || req.body.userId;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // verify

        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: "You are not authorized to cancel this appointment" });
        }

        // Release doctor's slot first, then mark appointment as cancelled

        // releasing doc slot

        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId);

        const slots_booked = { ...(docData?.slots_booked || {}) };

        if (Array.isArray(slots_booked[slotDate])) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(
                (time) => time !== slotTime
            );
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Mark appointment as cancelled (do not delete record)
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


//  api for payment razorpay
const paymentRazorpay = async (req, res) => {

    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // options for razorpay order
        const options = {
            amount: appointmentData.amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${appointmentId}`
        };

        // create order

        // create order
        const order = await razorpayInstance.orders.create(options);

        // save order id and receipt to appointment so we can find it later during verify
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            razorpay_order_id: order.id,
            receipt: options.receipt
        });

        // return order to client
        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}



// api to verify payment signature

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment data" });
    }

    // verify signature using key secret
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    // fetch order from razorpay to ensure it's paid
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log("Order Info:", orderInfo);

    if (orderInfo.status === "paid") {
      // find appointment by stored razorpay_order_id (saved earlier) and mark paid
      const appt = await appointmentModel.findOneAndUpdate(
        { razorpay_order_id: razorpay_order_id },
        { payment: true },
        { new: true }
      );

      // fallback: if appointment wasn't found by razorpay_order_id, try reading appointmentId from receipt
      if (!appt && orderInfo.receipt) {
        // receipt format used earlier: `receipt_order_${appointmentId}`
        const parts = String(orderInfo.receipt).split("_");
        const possibleId = parts[parts.length - 1]; // last segment
        if (possibleId) {
          await appointmentModel.findByIdAndUpdate(possibleId, { payment: true });
        }
      }

      return res.json({ success: true, message: "Payment verified and appointment updated" });
    } else {
      return res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};





export { registerUser, loginUser, getProfile, updateProfile, verifyRazorpay, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay };