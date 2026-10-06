export enum Designation {
  ENGINEER = "Engineer",
  LEAD = "Lead",
  MANAGER = "Manager",
  DIRECTOR = "Director",
  CEO = "CEO",
}

export interface Employee {
  id: string;
  name: string;
  dateOfBirth: Date; 
  designation: Designation;
  reportsTo?: string; 
  reportees: string[]; 
}