import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import GymLogo from "../assets/GymLogo.jpg";

export  default function HomeFooter() {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-10 mt-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={GymLogo} alt="logo" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold">Gettz Fitness</span>
          </div>
          <p className="text-sm opacity-90">
            Stronger. Fitter. Better.  
            Join our community and transform your health journey.
          </p>
        </div>

       
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/membership" className="hover:underline">Membership Plans</Link></li>
            <li><Link to="/trainers" className="hover:underline">Meet Our Trainers</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

      
        <div>
          <h4 className="font-semibold mb-3">Connect With Us</h4>
          <div className="flex gap-4">
            <a href="#"><Facebook className="h-5 w-5 hover:text-gray-200" /></a>
            <a href="#"><Instagram className="h-5 w-5 hover:text-gray-200" /></a>
            <a href="#"><Twitter className="h-5 w-5 hover:text-gray-200" /></a>
            <a href="#"><Mail className="h-5 w-5 hover:text-gray-200" /></a>
          </div>
        </div>
      </div>

      
      <div className="text-center text-sm mt-8 border-t border-white/20 pt-4">
        © {new Date().getFullYear()} Gettz Fitness. All rights reserved.
      </div>
    </footer>
  );
}
