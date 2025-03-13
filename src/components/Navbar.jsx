import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#111111] shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-bold text-[#e50914]">
              CineChill
            </Link>
            <nav className="max-sm:hidden">
              <ul className="flex items-center gap-8">
                <li>
                  <button className="text-[15px] font-medium nav-link active">
                    All
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-[15px] font-medium nav-link"
                  >
                    Movies
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/tv')}
                    className="text-[15px] font-medium nav-link"
                  >
                    Series
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Search movies..."
                className="bg-[#222] rounded-full px-4 py-2 w-[200px] max-sm:w-[150px] text-sm outline-none border border-[#333]"
                aria-label="Search movies"
              />
            </div>
            <Link
              to="/login"
              className="bg-[#e50914] px-4 py-2 rounded-md text-sm font-medium max-sm:hidden"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;