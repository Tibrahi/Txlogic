import { Link } from 'react-router-dom';
// Optional: If you want to use a logo or a dedicated component for social links, you can import them here.

const Footer = () => {
  return (
    // Increased top margin for better separation and a nice visual break
    <footer className="mt-24">
      
      {/* Changed to a deeper, richer dark color (bg-gray-800) */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Main content grid - added mb-10 for better separation from the copyright */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
            
            {/* 1. Company/Logo Section (Enhanced) */}
            <div>
              {/* Optional: Add a simple brand logo/text for a premium feel */}
              <Link to="/" className="text-2xl font-bold text-teal-400 mb-6 block tracking-wider">
                TxLogic
              </Link>
              <p className="text-gray-400 text-sm mb-6">
                Simplifying global logistics, one shipment at a time. Trusted by thousands of businesses worldwide.
              </p>
              
              {/* Added a subtle divider for visual grouping (optional) */}
              <div className="border-t border-gray-700 mt-6 pt-6">
                <p className="text-gray-500 text-xs">
                    Proudly securing your supply chain.
                </p>
              </div>
            </div>

            {/* 2. Services Link List (Adjusted spacing) */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white tracking-wider">Services</h3>
              <ul className="space-y-4"> {/* Increased vertical space */}
                <li><Link to="/cargo" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Cargo Tracking</Link></li>
                <li><Link to="/container" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Container Management</Link></li>
                <li><Link to="/package" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Package Details</Link></li>
                <li><Link to="/car" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Vehicle Tracking</Link></li>
              </ul>
            </div>
            
            {/* 3. Company & Support Links (Combined for better balance) */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white tracking-wider">Company & Support</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">FAQ & Help</Link></li>
              </ul>
            </div>

            {/* 4. Legal & Connect (Combined and styled) */}
            <div>
                <h3 className="text-lg font-bold mb-5 text-white tracking-wider">Legal & Connect</h3>
                <ul className="space-y-4 mb-8">
                    <li><Link to="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">Terms of Service</Link></li>
                </ul>
                
                {/* Social Icons */}
                <h4 className="text-md font-semibold mb-3 text-gray-300">Follow Us</h4>
                <div className="flex space-x-4">
                    {/* Teal hover color for social icons too! */}
                    <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300" aria-label="Follow us on Facebook">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300" aria-label="Follow us on Twitter">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                </div>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="mt-10 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} TxLogic. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;