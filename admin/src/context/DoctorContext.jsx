import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    // ✅ use the same .env variable for backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ✅ doctor login token
    const [dToken, setDToken] = useState(localStorage.getItem("dToken") || null);

    // ✅ doctor appointments
    const [appointments, setAppointments] = useState([]);

    const [dashData, setDashData] = useState(false);

    const [profileData, setProfileData] = useState(false);   

    // 🔹 Fetch doctor appointments from backend
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: { token: dToken },
            });

            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log("Appointments fetched:", data.appointments);
                toast.success("Appointments fetched successfully");
            } else {
                console.log(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Error fetching appointments");
        }
    };


    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                headers: { token: dToken },
            });

            if (data.success) {
                setDashData(data.dashData);
                console.log("Dashboard data fetched:", data.dashData);
                toast.success("Dashboard data fetched successfully");
            }else{
                console.log(data.message);
                toast.error(data.message);
            }
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Error fetching dashboard data");
        }
    };


    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: { token: dToken },
            }); 
            if (data.success) {
                setProfileData(data.doctor);
                console.log("Profile data fetched:", data.doctor);
                toast.success("Profile data fetched successfully");
            }
            else {
                console.log(data.message);
                toast.error(data.message);
            }
        }
        catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Error fetching profile data");
        }
    };

    const updateDoctorProfile = async (updatedData) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updatedData, {
                headers: { token: dToken },
            }); 
            if (data.success) {
                setProfileData(data.doctor);
                toast.success("Profile updated successfully");
            }
            else {
                console.log(data.message);
                toast.error(data.message);
            }
        
        }
        catch (error) {
            console.error("Error updating profile data:", error);
            toast.error("Error updating profile data");
        }
    };


    // Context value
    const value = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        getAppointments,
        setAppointments,
        dashData,
        setDashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        updateDoctorProfile,

    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
