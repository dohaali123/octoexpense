"use client";

import { useState } from "react";
import { sendEmail } from '../lib/sendEmail';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [country, setCountry] = useState('');
  const [costCentre, setCostCentre] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [reimbursementNeeded, setReimbursementNeeded] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fixed password for testing
  const fixedPassword = 'password123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === fixedPassword) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expenseType === "Other" && !comment) {
      setError('Comment is required for "Other" Expense Type.');
      return; 
    }

    try {
      const result = await sendEmail({
        email, 
        photo,
        country,
        costCentre,
        expenseType,
        reimbursementNeeded,
        comment, 
      });

      console.log("Success:", result);
      setSuccess("Form submitted successfully!");
      setFormSubmitted(true);
      setError("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("There was an error submitting the form.");
    }
  };

  const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      console.log('Selected file:', file);
      setPhoto(file);
  };
  
  const getCostCentres = () => {
    if (country === 'Canada') {
      return ['Hamilton', 'Riverside', 'Little Italy', 'Union Station'];
    } else if (country === 'Australia') {
      return ['Newtown North', 'Brunswick', 'Windsor', 'Rozelle', 'Smith Street', 'West End', 'Geelong', 'Pitt Street - Sydney'];
    } else if (country === 'Canada and Australia') {
      return ['Administration'];
    }
    return [];
  };

  if (formSubmitted) {
    return (
      <main className="flex min-h-screen bg-white flex-col items-center justify-center p-8">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md text-center">
          <h1 className="text-2xl font-bold text-black">Form Submitted Successfully!</h1>
          <p className="mt-4 text-gray-600">Thank you for your submission.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-white flex-col items-center justify-center p-8">
      {!isLoggedIn ? (
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold bg-white text-center text-black">OctoExpense</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl p-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-center text-black">Receipt Submission</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Take or Upload a Photo</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoChange}
                required
                className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCostCentre('');
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select country</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Canada and Australia">Canada and Australia</option>
              </select>
            </div>
            <div>
              <label htmlFor="costCentre" className="block text-sm font-medium text-gray-700">Cost Centre</label>
              <select
                id="costCentre"
                name="costCentre"
                value={costCentre}
                onChange={(e) => setCostCentre(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select cost centre</option>
                {getCostCentres().map((centre) => (
                  <option key={centre} value={centre}>{centre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="expenseType" className="block text-sm font-medium text-gray-700">Expense Type</label>
              <select
                id="expenseType"
                name="expenseType"
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select expense type</option>
                <option value="Advertising & Marketing">Advertising & Marketing</option>
                <option value="Accountancy Fees">Accountancy Fees</option>
                <option value="Bookkeeping Fees">Bookkeeping Fees</option>
                <option value="Permit & License Fees">Permit & License Fees</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Computer & Internet Expenses">Computer & Internet Expenses</option>
                <option value="Computer Software Subscriptions">Computer Software Subscriptions</option>
                <option value="Consulting Fees">Consulting Fees</option>
                <option value="Courier">Courier</option>
                <option value="Entertainment expense - GST non-deductible">Entertainment expense - GST non-deductible</option>
                <option value="Filing Fees">Filing Fees</option>
                <option value="Insurances">Insurances</option>
                <option value="Motor Vehicle Expenses">Motor Vehicle Expenses</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Parking & Tolls">Parking & Tolls</option>
                <option value="Postage">Postage</option>
                <option value="Recruitment – Stores">Recruitment – Stores</option>
                <option value="Repairs & Maintenance">Repairs & Maintenance</option>
                <option value="Staff Amenities">Staff Amenities</option>
                <option value="Store & Medical Supplies">Store & Medical Supplies</option>
                <option value="Store Credits Expense">Store Credits Expense</option>
                <option value="Subscriptions & Dues">Subscriptions & Dues</option>
                <option value="Staff Training & Education">Staff Training & Education</option>
                <option value="Store & Workshop Supplies">Store & Workshop Supplies</option>
                <option value="Telephone">Telephone</option>
                <option value="Travel Expenses – Domestic">Travel Expenses – Domestic</option>
                <option value="Travel Expenses – International">Travel Expenses – International</option>
                <option value="Utilities (Gas and Electricity)">Utilities (Gas and Electricity)</option>
                <option value="Waste Removal">Waste Removal</option>
                <option value="Water">Water</option>
                <option value="Website expenses">Website expenses</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="reimbursementNeeded" className="block text-sm font-medium text-gray-700">Reimbursement Needed</label>
              <select
                id="reimbursementNeeded"
                name="reimbursementNeeded"
                value={reimbursementNeeded}
                onChange={(e) => setReimbursementNeeded(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select reimbursement status</option>
                <option value="Yes, I paid with my own money/card">Yes, I paid with my own money/card</option>
                <option value="No, I paid with company money/card">No, I paid with company money/card</option>
              </select>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
              <input
                type="text"
                id="comment"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

