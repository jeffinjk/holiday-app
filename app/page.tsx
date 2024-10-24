
"use client";
import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

interface Country {
  code: string;
  name: string;
}

interface Holiday {
  name: string;
  date: string;
  type: string;
}

const HolidaysPage = () => {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buttonShape, setButtonShape] = useState('rectangle');
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://holidayapi.com/v1/countries?pretty&key=6e4f2458-229e-4e30-b102-f3a2be229ea0');
        const data = await response.json();
        if (response.ok) {
          const countryList = data.countries.map((country: Country) => ({
            code: country.code,
            name: country.name,
          }));
          setCountries(countryList);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return !prev;
    });
  };

  const fetchHolidays = async () => {
    setButtonShape('circle');
    try {
      const response = await fetch(`http://localhost:5000/api/holidays?country=${country}&year=${year}`);
      const data = await response.json();
      if (response.ok) {
        setHolidays(data.holidays);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch holidays');
        setHolidays([]);
      }
    } catch {
      setError('Error fetching data');
      setHolidays([]);
    } finally {
      setTimeout(() => setButtonShape('rectangle'), 300);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-navy-blue text-white' : 'bg-white text-black'
    }`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-300 hover:bg-opacity-10 hover:bg-gray-600"
        >
          <Sun
            className={isDarkMode ? 'text-yellow-300' : 'text-gray-600'}
            size={24}
          />
        </button>
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-2xl mx-auto py-12 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Holidays Finder</h1>
        
        {/* Form Container */}
        <div className="space-y-4 mb-8">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Year (e.g., 2023)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />

          <button
            onClick={fetchHolidays}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              buttonShape === 'circle' ? 'rounded-full' : ''
            } ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            Get Holidays
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Holidays List */}
        {holidays.length > 0 && (
          <div
            className={`border rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="max-h-96 overflow-y-auto scrollbar-custom">
              <ul className="divide-y divide-gray-200">
                {holidays.map((holiday, index) => (
                  <li
                    key={index}
                    className={`p-4 transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-semibold">{holiday.name}</h3>
                    <p className="text-sm mt-1">
                      {holiday.date} • {holiday.type}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center">
        <p className="text-sm">© 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HolidaysPage;