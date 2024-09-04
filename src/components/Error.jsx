import React from 'react';
import '../style/output.css';

import {Link} from 'react-router-dom';
const NotFound = () => {
  return (
    <div className="flex user-select-none flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-7xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl  text-gray-600 mt-2">Oops! Page not found.</p>
      <Link to="/" className="mt-6 scale-130 px-4 py-2 bg-gray-700 text-white rounded ">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
