import { Designation, Employee } from "../Model/Model"
import { validateEmployeeData, validateReportingHierarchy} from "../Validation/Validation"

export class OrganizationViewModel {
      private employees: Map<string, Employee> = new Map();

      public addEmployee(employee: Employee): Employee {
        validateEmployeeData(employee)

        if (this.employees.has(employee.id)) {
            throw new Error(`Employee with ID '${employee.id}' already exists.`)
        }

        if (employee.designation === Designation.CEO) {
            for (const emp of this.employees.values()) {
                if (emp.designation === Designation.CEO) {
                    throw new Error("An organization can only have one CEO.");
                }
            }
        }    
        
        validateReportingHierarchy(employee.designation, this.employees, employee.reportsTo)

        this.employees.set(employee.id, employee)
        
        if (employee.reportsTo) {
            let currentManagerId: string | undefined = employee.reportsTo; 

            while (currentManagerId) {
                const manager = this.employees.get(currentManagerId);
        
                if (!manager) break;

                if (!manager.reportees.includes(employee.id)) {
                    manager.reportees.push(employee.id);
                }

                currentManagerId = manager.reportsTo;
            }
        }

        return employee;
    }

    public getAllEmployees(): Employee[] {
        return Array.from(this.employees.values())
    }

    public getEmployeeById(id: string): Employee {
        const employee = this.employees.get(id);
        if (!employee) {
            throw new Error(`Employee with ID '${id}' not found.`);
        }
        return employee;
    }

    public updateEmployee(id: string, updates: Employee): Employee {
        const employee = this.employees.get(id);
        if (!employee) {
            throw new Error(`Employee with ID '${id}' does not exist.`);
        }

        validateEmployeeData({ ...employee, ...updates });

        if (updates.name) {
            employee.name = updates.name;
        }

        if (updates.dateOfBirth) {
            employee.dateOfBirth = updates.dateOfBirth;
        }

        if (updates.reportsTo !== undefined && updates.reportsTo !== employee.reportsTo) {
            if (employee.designation === Designation.CEO) {
                throw new Error("CEO cannot report to anyone.");
            }

            validateReportingHierarchy(employee.designation, this.employees, updates.reportsTo);

            if (employee.reportsTo) {
                const oldManager = this.employees.get(employee.reportsTo);
                if (oldManager) {
                    oldManager.reportees = oldManager.reportees.filter((rId) => rId !== id);
                }
            }

            employee.reportsTo = updates.reportsTo;
            const newManager = this.employees.get(updates.reportsTo);
            
            if (newManager && !newManager.reportees.includes(id)) {
                newManager.reportees.push(id);
            }
        }
        return employee;
    }
    
    public deleteEmployee(id: string): void {
        const employee = this.employees.get(id);
    
        if (!employee) {
            throw new Error(`Employee with ID '${id}' not found.`);
        }

        if (employee.reportees.length > 0) {
            throw new Error(`Cannot delete employee '${id}' because they have active reportees: [${employee.reportees.join(", ")}]. Reassign or remove reportees first.`) 
        }

        if (employee.reportsTo) {
            const manager = this.employees.get(employee.reportsTo);
            
            if (manager) {
                manager.reportees = manager.reportees.filter((rId) => rId !== id);
            }
        }

        this.employees.delete(id);
    }
}