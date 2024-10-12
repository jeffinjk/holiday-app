"use client"; // Mark this component as a Client Component

import { useState, useEffect } from 'react';
import { FaLightbulb } from 'react-icons/fa'; // Importing the bulb icon
import { Ripple, initTWE } from 'tw-elements'; // Import Ripple from tw-elements

// Initialize tw-elements
initTWE({ Ripple });

// Define an interface for the country object
interface Country {
  code: string;
  name: string;
}

// Define an interface for the holiday object
interface Holiday {
  name: string;
  date: string;
  type: string;
}

const HolidaysPage = () => {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]); // State for storing holidays with type
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [buttonShape, setButtonShape] = useState('rectangle'); // State for button shape
  const [countries, setCountries] = useState<Country[]>([]); // State for storing country list

  useEffect(() => {
    // Fetch the list of countries for the dropdown
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://holidayapi.com/v1/countries?pretty&key=YOUR_API_KEY');
        const data = await response.json();
    
        if (response.ok) {
          // Map countries to desired format
          const countryList = data.countries.map((country: Country) => ({
            code: country.code,
            name: country.name,
          }));
          setCountries(countryList);
        } else {
          console.error('Failed to fetch countries', data.error);
        }
      } catch (error) {  // Changed `err` to `error`
        console.error('Error fetching countries:', error);
      }
    };
    
    fetchCountries();

    // Load the theme from localStorage on initial render
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // Store the selected theme in localStorage
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const fetchHolidays = async () => {
    setButtonShape('circle'); // Change button shape to circle
    try {
      // Only send the selected country code and year to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/holidays?country=${country}&year=${year}`);
      const data = await response.json();

      if (response.ok) {
        setHolidays(data.holidays); // Assuming data.holidays is an array of Holiday objects
        setError('');
      } else {
        setError(data.error || 'Failed to fetch holidays');
        setHolidays([]);
      }
    } catch  { // Indicate unused variable
      setError('Error fetching data');
      setHolidays([]);
    } finally {
      setTimeout(() => setButtonShape('rectangle'), 300); // Change back to rectangle after 300ms
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 relative transition-all duration-500 ${isDarkMode ? 'bg-navy-blue text-white' : 'bg-white text-black'}`}>
      {/* Theme Toggle Icon */}
      <div
        className={`absolute top-4 right-4 cursor-pointer transition-transform duration-500 transform ${isDarkMode ? 'animate-jump' : ''}`}
        onClick={toggleTheme}
      >
        <FaLightbulb
          className={`text-3xl transition-transform duration-500 ${isDarkMode ? 'text-yellow-300 animate-glow' : 'text-gray-600'}`}
        />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className={`text-3xl font-bold mb-6 transition-opacity duration-500`}>Holidays Finder</h1>
        
        {/* Vertically arranged input fields */}
        <div className="mb-4 flex flex-col items-center w-full max-w-md">
          {/* Country Dropdown */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`border p-3 mb-3 w-full rounded-md shadow-md transition-shadow duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-400 bg-white'}`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {`${country.code}-${country.name}`} {/* Display in code-country format */}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year (e.g., 2023)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`border p-3 mb-3 w-full rounded-md shadow-md transition-shadow duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-400 bg-white'}`}
          />
          <button
            type="button"
            data-twe-ripple-init
            data-twe-ripple-color={isDarkMode ? 'light' : 'dark'}
            onClick={fetchHolidays}
            className={`inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:shadow-primary-2 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:shadow-primary-2 motion-reduce:transition-none $(
              isDarkMode
                ? 'bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800'
                : 'bg-[#001f3f] hover:bg-[#001f5f] focus:bg-[#001f5f] active:bg-[#001f6f]'
            ) ${buttonShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}
          >
            Get Holidays
          </button>
        </div>
        
        {error && <p className={`text-red-500 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>}
        
        {/* Conditionally render the holidays list */}
        {holidays.length > 0 && (
          <div className={`border-neon-dark-blue overflow-y-scroll h-60 p-4 rounded-lg my-4 transition-all duration-500 scrollbar-custom ${isDarkMode ? 'bg-navy-blue-light' : 'bg-white'}`}>
            <ul>
              {holidays.map((holiday, index) => (
                <li key={index} className={`p-2 rounded-md transition-colors duration-300 ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`}>
                  <strong>{holiday.name}</strong> - {holiday.date} ({holiday.type})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <footer className="text-center mt-4">
        <p className={`${isDarkMode ? 'text-white' : 'text-black'}`}>© 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HolidaysPage;
