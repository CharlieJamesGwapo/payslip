import React, { useState, useEffect } from 'react';
import { Employee, Payslip, WorkData } from '../types';
import { employeeService, payslipService } from '../services/api';
import WorkEntryForm from '../components/WorkEntryForm';

const Payslips: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [workData, setWorkData] = useState<WorkData[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    period: '',
    sssDeduction: 0,
    pagibigDeduction: 0,
    philhealthDeduction: 0,
    cashAdvanceDeduction: 0,
    remainingAdvance: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payslipsData, employeesData] = await Promise.all([
        payslipService.getPayslips(),
        employeeService.getEmployees()
      ]);
      setPayslips(payslipsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp._id === employeeId);
    setSelectedEmployee(employee || null);
    setFormData(prev => ({ ...prev, employeeId }));
  };

  const handleAddWork = (workEntry: WorkData) => {
    setWorkData(prev => [...prev, workEntry]);
  };

  const handleRemoveWork = (index: number) => {
    setWorkData(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalSalary = () => {
    return workData.reduce((total, work) => total + (work.price * work.quantity), 0);
  };

  const calculateNetSalary = () => {
    const total = calculateTotalSalary();
    const deductions = formData.sssDeduction + formData.pagibigDeduction + 
                     formData.philhealthDeduction + formData.cashAdvanceDeduction;
    return total - deductions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !formData.period || workData.length === 0) {
      alert('Please fill in all required fields and add at least one work entry');
      return;
    }

    try {
      const payslipData = {
        employeeId: selectedEmployee._id!,
        period: formData.period,
        workData,
        sssDeduction: formData.sssDeduction,
        pagibigDeduction: formData.pagibigDeduction,
        philhealthDeduction: formData.philhealthDeduction,
        cashAdvanceDeduction: formData.cashAdvanceDeduction,
        totalSalary: calculateTotalSalary(),
        remainingAdvance: formData.remainingAdvance
      };

      await payslipService.createPayslip(payslipData);
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error creating payslip:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    setWorkData([]);
    setFormData({
      employeeId: '',
      period: '',
      sssDeduction: 0,
      pagibigDeduction: 0,
      philhealthDeduction: 0,
      cashAdvanceDeduction: 0,
      remainingAdvance: 0
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Payslips</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and manage employee payslips with detailed work information and deductions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Generate Payslip
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Generate New Payslip</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                    Employee
                  </label>
                  <select
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    Pay Period
                  </label>
                  <input
                    type="text"
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="e.g., January 2024"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="sssDeduction" className="block text-sm font-medium text-gray-700">
                    SSS Deduction
                  </label>
                  <input
                    type="number"
                    id="sssDeduction"
                    value={formData.sssDeduction}
                    onChange={(e) => setFormData(prev => ({ ...prev, sssDeduction: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="pagibigDeduction" className="block text-sm font-medium text-gray-700">
                    Pag-IBIG Deduction
                  </label>
                  <input
                    type="number"
                    id="pagibigDeduction"
                    value={formData.pagibigDeduction}
                    onChange={(e) => setFormData(prev => ({ ...prev, pagibigDeduction: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="philhealthDeduction" className="block text-sm font-medium text-gray-700">
                    PhilHealth Deduction
                  </label>
                  <input
                    type="number"
                    id="philhealthDeduction"
                    value={formData.philhealthDeduction}
                    onChange={(e) => setFormData(prev => ({ ...prev, philhealthDeduction: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="cashAdvanceDeduction" className="block text-sm font-medium text-gray-700">
                    Cash Advance Deduction
                  </label>
                  <input
                    type="number"
                    id="cashAdvanceDeduction"
                    value={formData.cashAdvanceDeduction}
                    onChange={(e) => setFormData(prev => ({ ...prev, cashAdvanceDeduction: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>

                <div>
                  <label htmlFor="remainingAdvance" className="block text-sm font-medium text-gray-700">
                    Remaining Advance
                  </label>
                  <input
                    type="number"
                    id="remainingAdvance"
                    value={formData.remainingAdvance}
                    onChange={(e) => setFormData(prev => ({ ...prev, remainingAdvance: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={workData.length === 0}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Generate Payslip
                </button>
              </div>
            </form>
          </div>

          <WorkEntryForm onAdd={handleAddWork} />

          {workData.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Work Entries</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size/Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workData.map((work, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {work.category.charAt(0).toUpperCase() + work.category.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {work.subcategory || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {work.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {work.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₱{work.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₱{(work.price * work.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveWork(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total Salary:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₱{calculateTotalSalary().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Net Salary (after deductions):
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ₱{calculateNetSalary().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payslips.map((payslip) => {
                    const totalDeductions = payslip.sssDeduction + payslip.pagibigDeduction + 
                                          payslip.philhealthDeduction + payslip.cashAdvanceDeduction;
                    const netSalary = payslip.totalSalary - totalDeductions;
                    
                    return (
                      <tr key={payslip._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(payslip.employeeId as Employee)?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payslip.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₱{payslip.totalSalary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₱{totalDeductions.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₱{netSalary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payslip.createdAt!).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {payslips.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No payslips found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payslips;
