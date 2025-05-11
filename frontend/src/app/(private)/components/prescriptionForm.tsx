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
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Prescription Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="refillTime" className="block text-sm font-medium text-gray-700">
          Refill Time
        </label>
        <input
          type="text"
          id="refillTime"
          name="refillTime"
          required
          value={formData.refillTime}
          onChange={handleChange}
          placeholder="e.g., 30 days"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="refills" className="block text-sm font-medium text-gray-700">
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          required
          value={formData.amount}
          onChange={handleChange}
          placeholder="in mg"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;