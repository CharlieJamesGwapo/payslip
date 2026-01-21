const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/payslip-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sssNumber: { type: String, required: true },
  pagibigNumber: { type: String, required: true },
  philhealthNumber: { type: String, required: true },
  dailyRate: { type: Number, default: 0 },
  monthlyRate: { type: Number, default: 0 },
  bultohanRate: { type: Number, default: 0 },
  workType: { type: String, enum: ['taklob', 'lawas', 'both'], default: 'both' },
  createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Payslip Schema
const payslipSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  period: { type: String, required: true },
  workData: [{
    category: { type: String, enum: ['taklob', 'lawas'], required: true },
    subcategory: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  sssDeduction: { type: Number, required: true },
  pagibigDeduction: { type: Number, required: true },
  philhealthDeduction: { type: Number, required: true },
  cashAdvanceDeduction: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  remainingAdvance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Payslip = mongoose.model('Payslip', payslipSchema);

// Pricing Data
const pricingData = {
  taklob: {
    molde: {
      'S1': 15, 'S2': 15, 'S3': 15, 'S4': 15, 'S5': 15,
      'M1': 16, 'M2': 16, 'M3': 16, 'M4': 16, 'M5': 16,
      'L1': 17, 'L2': 17, 'L3': 17, 'L4': 17, 'L5': 17,
      'XL1': 18, 'XL2': 18, 'XL3': 18, 'XL4': 18, 'XL5': 18,
      '2XL1': 19, '2XL2': 19, '2XL3': 19, '2XL4': 19, '2XL5': 19,
      '3XL1': 20, '3XL2': 20, '3XL3': 20, '3XL4': 20, '3XL5': 20,
      '4XL1': 21, '4XL2': 21, '4XL3': 21, '4XL4': 21, '4XL5': 21,
      '5XL1': 22, '5XL2': 22, '5XL3': 22, '5XL4': 22, '5XL5': 22,
      '6XL1': 23, '6XL2': 23, '6XL3': 23, '6XL4': 23, '6XL5': 23,
      '10C1': 24, '10C2': 24, '10C3': 24, '10C4': 24, '10C5': 24,
      'U1': 25, 'U2': 25, 'U3': 25, 'U4': 25, 'U5': 25,
      'V1': 26, 'V2': 26, 'V3': 26, 'V4': 26, 'V5': 26,
      'W1': 27, 'W2': 27, 'W3': 27, 'W4': 27, 'W5': 27,
      'X1': 28, 'X2': 28, 'X3': 28, 'X4': 28, 'X5': 28,
      'Y1': 29, 'Y2': 29, 'Y3': 29, 'Y4': 29, 'Y5': 29,
      'Z1': 30, 'Z2': 30, 'Z3': 30, 'Z4': 30, 'Z5': 30,
      'KW1': 31, 'KW2': 31, 'KW3': 31, 'KW4': 31, 'KW5': 31
    },
    turno: {
      'S1': 15, 'S2': 15, 'S3': 15, 'S4': 15, 'S5': 15,
      'M1': 16, 'M2': 16, 'M3': 16, 'M4': 16, 'M5': 16,
      'L1': 17, 'L2': 17, 'L3': 17, 'L4': 17, 'L5': 17,
      'XL1': 18, 'XL2': 18, 'XL3': 18, 'XL4': 18, 'XL5': 18,
      '2XL1': 19, '2XL2': 19, '2XL3': 19, '2XL4': 19, '2XL5': 19,
      '3XL1': 20, '3XL2': 20, '3XL3': 20, '3XL4': 20, '3XL5': 20,
      '4XL1': 21, '4XL2': 21, '4XL3': 21, '4XL4': 21, '4XL5': 21,
      '5XL1': 22, '5XL2': 22, '5XL3': 22, '5XL4': 22, '5XL5': 22,
      '6XL1': 23, '6XL2': 23, '6XL3': 23, '6XL4': 23, '6XL5': 23,
      '10C1': 24, '10C2': 24, '10C3': 24, '10C4': 24, '10C5': 24,
      'U1': 25, 'U2': 25, 'U3': 25, 'U4': 25, 'U5': 25,
      'V1': 26, 'V2': 26, 'V3': 26, 'V4': 26, 'V5': 26,
      'W1': 27, 'W2': 27, 'W3': 27, 'W4': 27, 'W5': 27,
      'X1': 28, 'X2': 28, 'X3': 28, 'X4': 28, 'X5': 28,
      'Y1': 29, 'Y2': 29, 'Y3': 29, 'Y4': 29, 'Y5': 29,
      'Z1': 30, 'Z2': 30, 'Z3': 30, 'Z4': 30, 'Z5': 30,
      'KW1': 31, 'KW2': 31, 'KW3': 31, 'KW4': 31, 'KW5': 31
    }
  },
  lawas: {
    finish: {
      'S1': 12, 'S2': 12, 'S3': 12, 'S4': 12, 'S5': 12,
      'M1': 13, 'M2': 13, 'M3': 13, 'M4': 13, 'M5': 13,
      'L1': 14, 'L2': 14, 'L3': 14, 'L4': 14, 'L5': 14,
      'XL1': 15, 'XL2': 15, 'XL3': 15, 'XL4': 15, 'XL5': 15,
      '2XL1': 16, '2XL2': 16, '2XL3': 16, '2XL4': 16, '2XL5': 16,
      '3XL1': 17, '3XL2': 17, '3XL3': 17, '3XL4': 17, '3XL5': 17,
      '4XL1': 18, '4XL2': 18, '4XL3': 18, '4XL4': 18, '4XL5': 18,
      '5XL1': 19, '5XL2': 19, '5XL3': 19, '5XL4': 19, '5XL5': 19,
      '6XL1': 20, '6XL2': 20, '6XL3': 20, '6XL4': 20, '6XL5': 20,
      '10C1': 21, '10C2': 21, '10C3': 21, '10C4': 21, '10C5': 21,
      'U1': 22, 'U2': 22, 'U3': 22, 'U4': 22, 'U5': 22,
      'V1': 23, 'V2': 23, 'V3': 23, 'V4': 23, 'V5': 23,
      'W1': 24, 'W2': 24, 'W3': 24, 'W4': 24, 'W5': 24,
      'X1': 25, 'X2': 25, 'X3': 25, 'X4': 25, 'X5': 25,
      'Y1': 26, 'Y2': 26, 'Y3': 26, 'Y4': 26, 'Y5': 26,
      'Z1': 27, 'Z2': 27, 'Z3': 27, 'Z4': 27, 'Z5': 27,
      'KW1': 28, 'KW2': 28, 'KW3': 28, 'KW4': 28, 'KW5': 28
    }
  },
  additional: {
    'X-RAY': 35,
    'GRINDER ALL SIZE': 40,
    'CUTTER ALL SIZE': 45,
    'PUGON/PCS': 50,
    'HELPER': 200,
    'BUHOS': 25,
    'HANDLE': 30,
    'TUSMAW': 35
  }
};

// Routes
app.get('/api/pricing', (req, res) => {
  res.json(pricingData);
});

app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payslips', async (req, res) => {
  try {
    const payslip = new Payslip(req.body);
    await payslip.save();
    await payslip.populate('employeeId');
    res.status(201).json(payslip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/payslips', async (req, res) => {
  try {
    const payslips = await Payslip.find().populate('employeeId').sort({ createdAt: -1 });
    res.json(payslips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payslips/:id', async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate('employeeId');
    if (!payslip) {
      return res.status(404).json({ error: 'Payslip not found' });
    }
    res.json(payslip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
