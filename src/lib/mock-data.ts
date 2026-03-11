export type RiskLevel = "Low" | "Medium" | "High";
export type ApplicationStatus = "Submitted" | "Under Review" | "Documents Pending" | "Risk Assessed" | "Approved" | "Rejected";
export type EmploymentType = "Government" | "Private" | "Self-Employed";

export interface LoanApplication {
  id: string;
  fullName: string;
  aadhaarNumber: string;
  panNumber: string;
  employmentType: EmploymentType;
  monthlyIncome: number;
  existingEmi: number;
  creditScore: number;
  loanAmountRequested: number;
  tenure: number;
  eligibleLoanAmount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: ApplicationStatus;
  appliedDate: string;
  documents: { name: string; status: "Uploaded" | "Pending" | "Verified" }[];
}

export const mockApplications: LoanApplication[] = [
  {
    id: "LN-2024-001",
    fullName: "Rajesh Kumar Sharma",
    aadhaarNumber: "123456789012",
    panNumber: "ABCDE1234F",
    employmentType: "Government",
    monthlyIncome: 85000,
    existingEmi: 12000,
    creditScore: 780,
    loanAmountRequested: 1500000,
    tenure: 60,
    eligibleLoanAmount: 1400000,
    riskScore: 22,
    riskLevel: "Low",
    status: "Approved",
    appliedDate: "2024-12-15",
    documents: [
      { name: "Aadhaar Card", status: "Verified" },
      { name: "PAN Card", status: "Verified" },
      { name: "Salary Slips", status: "Verified" },
    ],
  },
  {
    id: "LN-2024-002",
    fullName: "Priya Mehta",
    aadhaarNumber: "987654321098",
    panNumber: "FGHIJ5678K",
    employmentType: "Private",
    monthlyIncome: 55000,
    existingEmi: 18000,
    creditScore: 650,
    loanAmountRequested: 800000,
    tenure: 36,
    eligibleLoanAmount: 500000,
    riskScore: 58,
    riskLevel: "Medium",
    status: "Under Review",
    appliedDate: "2025-01-10",
    documents: [
      { name: "Aadhaar Card", status: "Uploaded" },
      { name: "PAN Card", status: "Uploaded" },
      { name: "Salary Slips", status: "Pending" },
    ],
  },
  {
    id: "LN-2024-003",
    fullName: "Amit Patel",
    aadhaarNumber: "456789012345",
    panNumber: "KLMNO9012P",
    employmentType: "Self-Employed",
    monthlyIncome: 120000,
    existingEmi: 45000,
    creditScore: 580,
    loanAmountRequested: 2000000,
    tenure: 48,
    eligibleLoanAmount: 800000,
    riskScore: 75,
    riskLevel: "High",
    status: "Documents Pending",
    appliedDate: "2025-02-01",
    documents: [
      { name: "Aadhaar Card", status: "Verified" },
      { name: "PAN Card", status: "Pending" },
      { name: "ITR Returns", status: "Pending" },
    ],
  },
  {
    id: "LN-2024-004",
    fullName: "Sneha Reddy",
    aadhaarNumber: "321654987012",
    panNumber: "PQRST3456U",
    employmentType: "Private",
    monthlyIncome: 72000,
    existingEmi: 8000,
    creditScore: 720,
    loanAmountRequested: 1000000,
    tenure: 60,
    eligibleLoanAmount: 950000,
    riskScore: 35,
    riskLevel: "Low",
    status: "Risk Assessed",
    appliedDate: "2025-02-10",
    documents: [
      { name: "Aadhaar Card", status: "Verified" },
      { name: "PAN Card", status: "Verified" },
      { name: "Salary Slips", status: "Uploaded" },
    ],
  },
  {
    id: "LN-2024-005",
    fullName: "Vikram Singh",
    aadhaarNumber: "654321098765",
    panNumber: "UVWXY6789Z",
    employmentType: "Government",
    monthlyIncome: 95000,
    existingEmi: 25000,
    creditScore: 690,
    loanAmountRequested: 1200000,
    tenure: 48,
    eligibleLoanAmount: 1000000,
    riskScore: 45,
    riskLevel: "Medium",
    status: "Submitted",
    appliedDate: "2025-02-20",
    documents: [
      { name: "Aadhaar Card", status: "Uploaded" },
      { name: "PAN Card", status: "Uploaded" },
      { name: "Salary Slips", status: "Pending" },
    ],
  },
  {
    id: "LN-2024-006",
    fullName: "Neha Gupta",
    aadhaarNumber: "111222333444",
    panNumber: "AABBC1122D",
    employmentType: "Self-Employed",
    monthlyIncome: 40000,
    existingEmi: 20000,
    creditScore: 520,
    loanAmountRequested: 500000,
    tenure: 24,
    eligibleLoanAmount: 0,
    riskScore: 88,
    riskLevel: "High",
    status: "Rejected",
    appliedDate: "2025-01-25",
    documents: [
      { name: "Aadhaar Card", status: "Uploaded" },
      { name: "PAN Card", status: "Pending" },
      { name: "ITR Returns", status: "Pending" },
    ],
  },
];

export const statusSteps: ApplicationStatus[] = [
  "Submitted",
  "Under Review",
  "Documents Pending",
  "Risk Assessed",
  "Approved",
];
