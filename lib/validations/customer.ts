import { z } from 'zod';

export const customerStep1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.string().min(1, 'Date of birth is required'),
});

export const customerStep2Schema = z.object({
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required').regex(/^[+0-9\s-]+$/, 'Invalid phone characters'),
  alternatePhone: z.string().optional(),
});

export const customerStep3Schema = z.object({
  addressLine1: z.string().min(5, 'Address Line 1 is required (min 5 chars)'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Must be a 6-digit Indian PIN code'),
  country: z.string().default('India'),
});

export const customerStep4Schema = z.object({
  aadharNumber: z.string().regex(/^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/, 'Must be a valid 12-digit Aadhaar number'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Must be a valid 10-character PAN (e.g. ABCDE1234F)'),
  occupation: z.string().min(2, 'Occupation is required'),
  annualIncome: z.coerce.number().min(50000, 'Minimum annual income is ₹50,000'),
  nomineeName: z.string().min(2, 'Nominee name is required'),
  nomineeRelationship: z.string().min(2, 'Nominee relationship is required'),
  nomineePhone: z.string().min(10, 'Valid 10-digit nominee mobile number required'),
});

export const fullCustomerSchema = customerStep1Schema
  .merge(customerStep2Schema)
  .merge(customerStep3Schema)
  .merge(customerStep4Schema);

export type FullCustomerFormData = z.infer<typeof fullCustomerSchema>;
