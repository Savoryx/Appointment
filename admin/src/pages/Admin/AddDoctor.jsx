import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

function AddDoctor() {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [speciality, setSpeciality] = useState('General Physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [about, setAbout] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (!docImg) {
        return toast.error('Image is required')
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 })
      )
      formData.append('about', about)

      // console log formdata
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`)
      })

      const {data} = await axios.post(backendUrl+'/api/admin/add-doctor', formData ,{headers:{aToken}})

      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        setDegree('')
        setAddress1('')
        setAddress2('')
        setAbout('')
        

      }else{
        toast.error(data.message)
        console.log(data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      action=""
      className="bg-white p-4 ml-55 sm:p-6 md:p-8 w-full mx-auto"
    >
      <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
        Add Doctor
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left section (Upload image) */}
        <div className="flex flex-col items-center justify-start gap-2">
          <label
            htmlFor="doc-img"
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-all duration-200"
          >
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
              className="w-24 h-24 object-contain"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-sm text-gray-500 text-center">
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Right section (Form fields) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Doctor Name :
              </p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Doctor Email :
              </p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Doctor Password :
              </p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="password"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Doctor Experience :
              </p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: 14 }, (_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Fee :</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="fee"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Speciality :
              </p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Education :
              </p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="Education"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Address :</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                required
                className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address 2"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Doctor */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-600 mb-1">About Doctor :</p>
        <textarea
          onChange={(e) => setAbout(e.target.value)}
          value={about}
          rows={5}
          placeholder="write here .."
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition-all"
        >
          Add Doctor
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
