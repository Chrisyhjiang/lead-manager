export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  linkedin?: string;
  visa: string[];
  status: string;
  message: string;
  resume: File | null;
  submitted: Date;
}
