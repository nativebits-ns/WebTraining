import { Designation, Employee } from "../Model/Model"

export function validateEmployeeData(employee: Employee): void {
    if(!employee.id) {
       throw new Error("Can't create/update employee without id")
    }

    if(!employee.name) {
       throw new Error("Can't create/update employee without name")
    }

    if(isNaN(new Date(employee.dateOfBirth).getTime())) {
      throw new Error("Can't create/update employee with invalid DOB")
    }

    if (employee.designation === Designation.ENGINEER && employee.reportees.length > 0) {      
      throw new Error("Can't create/update Engineer employee as reportees not allowed for Engineer")
    }
}

export function validateReportingHierarchy(
    designation: Designation,
    employees: Map<string, Employee>,
    reportsToId?: string,
  ): void {
    if (designation === Designation.CEO) {
      if (reportsToId) {
        throw new Error("CEO cannot report to anyone.");
      }
      return;
    }

    if (!reportsToId) {
      throw new Error(
        `Designation '${designation}' requires a valid 'reportsTo' manager ID.`
      );
    }

    const manager = employees.get(reportsToId);
    if (!manager) {
      throw new Error(
        `Manager with ID '${reportsToId}' does not exist.`
      );
    }

    const expectedManagerRole: Record<Designation, Designation> = {
      [Designation.ENGINEER]: Designation.LEAD,
      [Designation.LEAD]: Designation.MANAGER,
      [Designation.MANAGER]: Designation.DIRECTOR,
      [Designation.DIRECTOR]: Designation.CEO,
      [Designation.CEO]: Designation.CEO,
    };

    if (manager.designation !== expectedManagerRole[designation]) {
      throw new Error(
        `A ${designation} must report to a ${expectedManagerRole[designation]}. Provided manager '${reportsToId}' is a ${manager.designation}.`
      );
    }
  }