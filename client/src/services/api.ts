import axios from 'axios';
import { Employee, Payslip, PricingData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const pricingService = {
  getPricing: async (): Promise<PricingData> => {
    const response = await api.get('/pricing');
    return response.data;
  }
};

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  },
  
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  
  createEmployee: async (employee: Omit<Employee, '_id' | 'createdAt'>): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data;
  },
  
  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },
  
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  }
};

export const payslipService = {
  getPayslips: async (): Promise<Payslip[]> => {
    const response = await api.get('/payslips');
    return response.data;
  },
  
  getPayslip: async (id: string): Promise<Payslip> => {
    const response = await api.get(`/payslips/${id}`);
    return response.data;
  },
  
  createPayslip: async (payslip: Omit<Payslip, '_id' | 'createdAt'>): Promise<Payslip> => {
    const response = await api.post('/payslips', payslip);
    return response.data;
  }
};
