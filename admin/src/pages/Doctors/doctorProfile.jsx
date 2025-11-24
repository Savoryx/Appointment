import React, { useEffect, useState, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";

function DoctorProfile() {
  const { dToken, profileData, getProfileData, setProfileData , updateDoctorProfile } =
    useContext(DoctorContext);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setForm(profileData);
    }
  }, [profileData]);

  if (!form) return <p className="p-10">Loading Profile...</p>;

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="p-10 pl-56 max-w-[1500px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl pl-8 font-bold">Doctor Profile</h1>

        {!isEditing ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
              onClick={() => {
                // 🔥 You will attach update API here
                updateDoctorProfile(form);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="bg-gray-300 px-6 py-2 rounded-xl hover:bg-gray-400"
              onClick={() => {
                setForm(profileData);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="bg-white shadow-xl rounded-3xl p-8 flex flex-col items-center">
          <img
            src={form.image}
            className="w-40 h-40 rounded-full object-cover shadow-md"
            alt="Doctor"
          />
          <h2 className="text-2xl font-semibold mt-4">{form.name}</h2>
          <p className="text-gray-600">{form.speciality}</p>

          <div className="mt-6 w-full">
            <p className="font-semibold mb-1">Email</p>
            {!isEditing ? (
              <p className="text-gray-700">{form.email}</p>
            ) : (
              <input
                type="text"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            )}
          </div>

          <div className="mt-4 w-full">
            <p className="font-semibold mb-1">Fees</p>
            {!isEditing ? (
              <p className="text-gray-700">₹ {form.fees}</p>
            ) : (
              <input
                type="number"
                value={form.fees}
                onChange={(e) => handleChange("fees", e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-3xl p-10">
          <h2 className="text-2xl font-semibold mb-6">Professional Details</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* DEGREE */}
            <div>
              <p className="font-medium text-gray-600 mb-1">Degree</p>
              {!isEditing ? (
                <p className="text-gray-800">{form.degree}</p>
              ) : (
                <input
                  type="text"
                  value={form.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              )}
            </div>

            {/* EXPERIENCE */}
            <div>
              <p className="font-medium text-gray-600 mb-1">Experience</p>
              {!isEditing ? (
                <p className="text-gray-800">{form.experience}</p>
              ) : (
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              )}
            </div>

            {/* ADDRESS LINE 1 */}
            <div className="col-span-2">
              <p className="font-medium text-gray-600 mb-1">Address Line 1</p>
              {!isEditing ? (
                <p className="text-gray-800">{form.address.line1}</p>
              ) : (
                <input
                  type="text"
                  value={form.address.line1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, line1: e.target.value },
                    })
                  }
                  className="w-full border rounded-lg p-2"
                />
              )}
            </div>

            {/* ADDRESS LINE 2 */}
            <div className="col-span-2">
              <p className="font-medium text-gray-600 mb-1">Address Line 2</p>
              {!isEditing ? (
                <p className="text-gray-800">{form.address.line2}</p>
              ) : (
                <input
                  type="text"
                  value={form.address.line2}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, line2: e.target.value },
                    })
                  }
                  className="w-full border rounded-lg p-2"
                />
              )}
            </div>

            {/* ABOUT */}
            <div className="col-span-2">
              <p className="font-medium text-gray-600 mb-1">About</p>
              {!isEditing ? (
                <p className="text-gray-700 leading-relaxed">{form.about}</p>
              ) : (
                <textarea
                  rows={5}
                  value={form.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
