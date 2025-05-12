"use client";

import { useState } from "react";

interface PrescriptionFormProps {
  onSubmit: (formData: {
    name: string;
    refillTime: string;
    refills: string;
    amount: string;
  }) => void;
}

const PrescriptionForm = ({ onSubmit }: PrescriptionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    refillTime: "",
    refills: "",
    amount: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg mb-6 text-center">
        <h3 className="text-lg font-medium text-purple-800">Add New Medication</h3>
        <p className="text-sm text-purple-600">Enter the details of your prescription</p>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Medication Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter medication name"
          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="refillTime" className="block text-sm font-medium text-gray-700 mb-1">
          Next Refill Date
        </label>
        <input
          type="date"
          id="refillTime"
          name="refillTime"
          required
          value={formData.refillTime}
          onChange={handleChange}
          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="refills" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Refills
        </label>
        <input
          type="number"
          id="refills"
          name="refills"
          required
          min="0"
          value={formData.refills}
          onChange={handleChange}
          placeholder="0"
          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          required
          value={formData.amount}
          onChange={handleChange}
          placeholder="amount should be in mg"
          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Continue to Camera
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;