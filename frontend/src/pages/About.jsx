import React from 'react'
import { assets } from '../assets/assets'

function About() {
  return (
    <div className="px-6 md:px-12 lg:px-20">
      {/* About Us Heading */}
      <div className="text-center text-3xl pt-10 text-gray-500">
        <p>
          About <span className="text-gray-700 font-semibold">Us</span>
        </p>
      </div>

      {/* About Section */}
      <div className="my-12 flex flex-col md:flex-row items-center gap-12">
        <img
          className="w-full md:max-w-[360px] rounded-xl shadow-md"
          src={assets.about_image}
          alt="About Prescripto"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/3 text-base text-gray-600">
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800 text-lg">Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-2xl my-8">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="border rounded-xl p-8 flex flex-col gap-3 text-gray-600 text-sm hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
          <b className="text-base">Efficiency :</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className="border rounded-xl p-8 flex flex-col gap-3 text-gray-600 text-sm hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
          <b className="text-base">Convenience :</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className="border rounded-xl p-8 flex flex-col gap-3 text-gray-600 text-sm hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
          <b className="text-base">Personalization :</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
