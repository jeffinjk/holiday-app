"use client"; // Mark this component as a Client Component

import { useState } from 'react';

const HolidaysPage = () => {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState('');

  const fetchHolidays = async () => {
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
    } catch (err) {
      setError('Error fetching data');
      setHolidays([]);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Holidays Finder</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Country Code (e.g., IN)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Year (e.g., 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchHolidays}
          className="bg-blue-500 text-white p-2"
        >
          Get Holidays
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {holidays.map((holiday, index) => (
          <li key={index}>
            <strong>{holiday.name}</strong> - {holiday.date} ({holiday.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidaysPage;
