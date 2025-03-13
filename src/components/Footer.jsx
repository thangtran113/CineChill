import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222] mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo và Mô tả */}
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-bold text-[#e50914] mb-2 inline-block netflix-title">
              MovieWeb
            </Link>
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md netflix-text">
              Discover the latest movies and TV shows. Stream your favorite content anytime, anywhere.
            </p>
            <div className="flex gap-4 mt-4">
              {/* Social Media Icons */}
              <span className="text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </span>
              <span className="text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </span>
              <span className="text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-200 netflix-title">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Home
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Movies
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  TV Shows
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Pricing
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-200 netflix-title">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  FAQ
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Help Center
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-white text-sm transition-colors duration-300 cursor-pointer netflix-text">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#222] mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs netflix-text">
              © {new Date().getFullYear()} MovieWeb. All rights reserved.
            </p>
            <div className="flex gap-4 mt-3 sm:mt-0">
              <span className="text-gray-500 hover:text-white text-xs transition-colors duration-300 cursor-pointer netflix-text">
                Terms
              </span>
              <span className="text-gray-500 hover:text-white text-xs transition-colors duration-300 cursor-pointer netflix-text">
                Privacy
              </span>
              <span className="text-gray-500 hover:text-white text-xs transition-colors duration-300 cursor-pointer netflix-text">
                Cookies
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 