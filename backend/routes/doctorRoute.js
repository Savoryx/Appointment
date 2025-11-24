import express from 'express';
import doctorModel from '../models/doctorModel.js';
import authDoctor from '../middleware/authDoctor.js';


const router = express.Router();
import {doctorList , loginDoctor ,appointmentsDoctor ,
     cancelAppointmentByDoctor , doctorDashboard , doctorProfile
    , updateDoctorProfile} from '../controllers/doctorController.js';


const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointmentByDoctor);
doctorRouter.get('/dashboard',authDoctor,doctorDashboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);


export default doctorRouter;