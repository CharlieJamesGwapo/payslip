export interface Employee {
  _id?: string;
  name: string;
  sssNumber: string;
  pagibigNumber: string;
  philhealthNumber: string;
  dailyRate: number;
  monthlyRate: number;
  bultohanRate: number;
  workType: 'taklob' | 'lawas' | 'both';
  createdAt?: Date;
}

export interface WorkData {
  category: 'taklob' | 'lawas';
  subcategory?: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Payslip {
  _id?: string;
  employeeId: string | Employee;
  period: string;
  workData: WorkData[];
  sssDeduction: number;
  pagibigDeduction: number;
  philhealthDeduction: number;
  cashAdvanceDeduction: number;
  totalSalary: number;
  remainingAdvance: number;
  createdAt?: Date;
}

export interface PricingData {
  taklob: {
    molde: Record<string, number>;
    turno: Record<string, number>;
  };
  lawas: {
    finish: Record<string, number>;
  };
  additional: Record<string, number>;
}
