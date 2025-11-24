import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

function Appointment() {
    const { docId } = useParams()
    const { doctors, currencySymbol , backendUrl ,token ,getDoctorsData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const navigate = useNavigate();

    const getAvailableSlot = async () => {
        setDocSlots([])

        const now = new Date()
        const base = new Date(now)
        base.setHours(0, 0, 0, 0)

        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(base)
            dayStart.setDate(base.getDate() + i)

            const endTime = new Date(dayStart)
            endTime.setHours(21, 0, 0, 0)

            let slotCursor = new Date(dayStart)

            if (i === 0) {
                const nextHalfHour = new Date(now)
                nextHalfHour.setMinutes(now.getMinutes() >= 30 ? 60 : 30, 0, 0)
                const tenAM = new Date(dayStart)
                tenAM.setHours(10, 0, 0, 0)
                slotCursor = nextHalfHour < tenAM ? tenAM : nextHalfHour
            } else {
                slotCursor.setHours(10, 0, 0, 0)
            }

            const timeSlots = []
            while (slotCursor < endTime) {
                const formattedTime = slotCursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                const d = slotCursor.getDate()
                const m = slotCursor.getMonth() + 1
                const y = slotCursor.getFullYear()
                const slotDate = d + '_' + m + '_' + y

                const isTaken = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime)

                if (!isTaken) {
                    timeSlots.push({ datetime: new Date(slotCursor), time: formattedTime })
                }

                slotCursor.setMinutes(slotCursor.getMinutes() + 30)
            }
            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }


    const bookAppointment = async () => {
        if(!token){
            toast.warn('Please login to book appointment')
            return navigate('/login');
        }

        try{
            if (!docSlots.length || !docSlots[slotIndex] || !slotTime) {
                toast.warn('Please select a day and time slot first');
                return;
            }

            const date = docSlots[slotIndex][0].datetime;
            const time = slotTime;

            let day = date.getDate();
            let month = date.getMonth()+1;
            let year = date.getFullYear();

            const slotDate = day+'_'+month+'_'+year;

            console.log('Booking appointment on ', slotDate , ' at ', time);

            const {data} = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if(data.success){
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            }else{
                toast.error(data.message)
            }

        }catch(error){
            console.error('Error booking appointment:', error);
            toast.error('Failed to book appointment. Please try again later.');
        }
    }

    useEffect(() => {
        const foundDoc = doctors.find(doc => doc._id === docId)
        setDocInfo(foundDoc)
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) getAvailableSlot()
    }, [docInfo])

    if (!docInfo) {
        return (
            <div className="p-6">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-300 h-20 w-20"></div>
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
            </div>
        )
    }

    const isBookDisabled = !(docSlots.length && docSlots[slotIndex]?.length && slotTime);

    return docInfo && (
        <div>
            {/* doc details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="verified" />
                    </p>

                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-700'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* available slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-800'>
                <p>Booking slots :</p>
                <div className='flex gap-3 items-center w-full overflow-x-auto whitespace-nowrap mt-4'>
                    {
                        docSlots.length > 0 && docSlots.map((item, index) => (
                            <div
                                onClick={() => setSlotIndex(index)}
                                className={`text-center mb-2 py-6 min-w-16 shadow-md rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                                key={index}
                            >
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                </div>

                {/* ✅ fixed scrollable time slots */}
                <div className="flex flex-nowrap gap-3 w-full overflow-x-auto mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                        <p
                            key={index}
                            onClick={() => setSlotTime(item.time)}
                            className={`text-sm font-light flex-shrink-0 min-w-fit px-5 py-2 rounded-full pointer cursor-pointer ${item.time === slotTime
                                ? "bg-primary text-white"
                                : "text-gray-400 border border-gray-300"
                                }`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} disabled={isBookDisabled} className={`bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 ${isBookDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    Book an appointment
                </button>
            </div>
            {/* listing relared doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    )
}

export default Appointment
