import validator from 'validator'
import bycrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'





// API for adding doctor

const addDoctor = async (req, res) => {

    try{
        const{name,email,password,speciality,degree,experience,about,fees,address} = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})

        }

        // validating email format
        if (!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid Email"})

        }
        // validating strong password
        if(password.length< 8){
            return res.json({success:false , message:"plz enter strong password"})
        }

        // hassing doctor password 5-15
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password,salt)

        // upload image to cloudnary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        // update all above data  to database
        const doctorData ={
            name,
            email,
            image : imageUrl,
            password : hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: typeof address === "string" ? JSON.parse(address) : address,
            available: true,
            date:Date.now()

        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added Successfully"})




    }catch(err){
        console.log(err)
        res.json({success:false,message:"Something Went Wrong erroe catch",message:err.message})
    }
}



// api for admin log in

const loginAdmin = async(req,res)=>{
    try{
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token =jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,message:"Login Successfull",token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }

    }catch(err){
        console.log(err)
        res.json({success:false,message:"Something Went Wrong erroe catch",message:err.message})
    
    }
}

// API to get all doctor list for admin pannel

const allDoctors = async(req,res)=>{
    try{

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    }catch(err){
        console.log("Auth header:", req.headers.authorization)
        res.json({success:false , message:"Something Went Wrong",message:err.message})
    }
}


// api to get all appointments for admin pannel

const appointmentsAdmin = async(req,res)=>{
    try {
        
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false , message:"Something Went Wrong",message:error.message})
        
    }
}



// API to cancel appointment by admin

const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
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



// api for dashboad data admin panel

const adminDashboard = async(req,res)=>{
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors : doctors.length,
            patients : users.length,
            appointments : appointments.length,
            latestAppointments : appointments.slice(0,5).reverse()
        }

        res.json({success:true,dashData})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    
    }
}



export {addDoctor , loginAdmin , allDoctors , appointmentsAdmin , appointmentCancel , adminDashboard};