export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  area: string;
  emirate: string;
  postcode?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}
