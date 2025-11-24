import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 text-gray-700 
                      sm:grid-cols-2 md:grid-cols-3">
        
        {/* Logo + Description */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img 
              src={assets.logo} 
              alt="Prescripto Logo" 
              className="w-40 h-auto sm:w-44" 
            />
          </div>
          <p className="text-sm md:text-[13px] leading-relaxed text-gray-600 max-w-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Links */}
        <div className="pl-10 md:pl-10"> 
          <h3 className="text-sm font-semibold text-gray-900 mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><a href="/about" className="hover:text-blue-600">About us</a></li>
            <li><a href="/contact" className="hover:text-blue-600">Contact us</a></li>
            <li><a href="#" className="hover:text-blue-600">Privacy policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">GET IN TOUCH</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              📞 +91-9874-567890
            </li>
            <li className="flex items-center gap-2">
              📧 sachin.dev@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <p className="text-center text-xs text-gray-500 py-4">
          Copyright © 2025 SachinQ - All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
