import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { employeeService } from '../services/api';

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Omit<Employee, '_id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Employee, '_id' | 'createdAt'>>({
    name: '',
    sssNumber: '',
    pagibigNumber: '',
    philhealthNumber: '',
    dailyRate: 0,
    monthlyRate: 0,
    bultohanRate: 0,
    workType: 'both'
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        sssNumber: employee.sssNumber,
        pagibigNumber: employee.pagibigNumber,
        philhealthNumber: employee.philhealthNumber,
        dailyRate: employee.dailyRate,
        monthlyRate: employee.monthlyRate,
        bultohanRate: employee.bultohanRate,
        workType: employee.workType
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Rate') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="sssNumber" className="block text-sm font-medium text-gray-700">
              SSS Number
            </label>
            <input
              type="text"
              id="sssNumber"
              name="sssNumber"
              value={formData.sssNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="pagibigNumber" className="block text-sm font-medium text-gray-700">
              Pag-IBIG Number
            </label>
            <input
              type="text"
              id="pagibigNumber"
              name="pagibigNumber"
              value={formData.pagibigNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="philhealthNumber" className="block text-sm font-medium text-gray-700">
              PhilHealth Number
            </label>
            <input
              type="text"
              id="philhealthNumber"
              name="philhealthNumber"
              value={formData.philhealthNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
              Daily Rate
            </label>
            <input
              type="number"
              id="dailyRate"
              name="dailyRate"
              value={formData.dailyRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="monthlyRate" className="block text-sm font-medium text-gray-700">
              Monthly Rate
            </label>
            <input
              type="number"
              id="monthlyRate"
              name="monthlyRate"
              value={formData.monthlyRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="bultohanRate" className="block text-sm font-medium text-gray-700">
              Bultohan Rate (Piece Rate)
            </label>
            <input
              type="number"
              id="bultohanRate"
              name="bultohanRate"
              value={formData.bultohanRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label htmlFor="workType" className="block text-sm font-medium text-gray-700">
              Work Type
            </label>
            <select
              id="workType"
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            >
              <option value="taklob">Taklob</option>
              <option value="lawas">Lawas</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {employee ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
