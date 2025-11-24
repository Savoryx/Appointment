import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      formData.append('address', JSON.stringify(userData.address))    
      if (image) {
        formData.append('image', image)
      } 
      const {data} = await axios.post( backendUrl + '/api/user/update-profile', formData, {headers: {token}})

      if (data.success) {
        toast.success('Profile updated successfully')
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
  }

  }

  return userData && (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      {/* Top Section */}
      <div className="flex items-center gap-6">

        {
          isEdit ?
            <label htmlFor="image">

              <div className='inline-block relative cursor-pointer'>

                <img
                  className='w-36 rounded opacity-75'
                  src={image ? URL.createObjectURL(image) : userData.image || null}
                  alt="Profile Preview"
                />

                <img
                  className='w-10 absolute bottom-12 right-12'
                  src={!image ? assets.upload_icon : null}
                  alt=""
                />

              </div>

              <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />


            </label> :

            <img
              src={userData.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"

            />

        }


        <div className="flex-1">
          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="text-xl font-semibold border-b border-gray-300 focus:outline-none focus:border-primary"
            />
          ) : (
            <p className="text-xl font-semibold text-gray-900">
              {userData.name}
            </p>
          )}
        </div>
      </div>

      <hr className="my-6" />

      {/* Contact Info */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          CONTACT INFORMATION
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-2">
            <p className="font-medium text-gray-600 w-24">Email:</p>
            <p className="text-blue-600">{userData.email}</p>
          </div>
          <div className="flex gap-2">
            <p className="font-medium text-gray-600 w-24">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="border-b flex-1 border-gray-300 focus:outline-none focus:border-primary"
              />
            ) : (
              <p className="text-blue-600">{userData.phone}</p>
            )}
          </div>
          <div className="flex gap-2">
            <p className="font-medium text-gray-600 w-24">Address:</p>
            {isEdit ? (
              <div className="flex flex-col flex-1">
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: { ...userData.address, line1: e.target.value },
                    })
                  }
                  className="border-b border-gray-300 focus:outline-none focus:border-primary mb-2"
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: { ...userData.address, line2: e.target.value },
                    })
                  }
                  className="border-b border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
            ) : (
              <p className="text-gray-800">
                {userData.address.line1} <br /> {userData.address.line2}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-3">
          BASIC INFORMATION
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-2">
            <p className="font-medium text-gray-600 w-24">Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
                className="border-b border-gray-300 focus:outline-none focus:border-primary"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            ) : (
              <p className="text-gray-800">{userData.gender}</p>
            )}
          </div>

          <div className="flex gap-2">
            <p className="font-medium text-gray-600 w-24">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData({ ...userData, dob: e.target.value })
                }
                className="border-b border-gray-300 focus:outline-none focus:border-primary"
              />
            ) : (
              <p className="text-gray-800">
                {new Date(userData.dob).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile

