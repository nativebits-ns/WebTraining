import { Designation } from "./Model/Model";
import { OrganizationViewModel } from "./ViewModel/VidewModel";

function main() {
  const org = new OrganizationViewModel();

  console.log("=== 1. ORGANIZATION HIERARCHY ===");

  org.addEmployee({
    id: "EMP-001",
    name: "CEO",
    dateOfBirth: new Date("2026-03-22"),
    designation: Designation.CEO,
    reportees: []
  });

  org.addEmployee({
    id: "EMP-002",
    name: "Director",
    dateOfBirth: new Date("2026-03-22"),
    designation: Designation.DIRECTOR,
    reportsTo: "EMP-001",
    reportees: []
  });

  org.addEmployee({
    id: "EMP-003",
    name: "Manager",
    dateOfBirth: new Date("2026-03-22"),
    designation: Designation.MANAGER,
    reportsTo: "EMP-002",
    reportees: []
  });

  org.addEmployee({
    id: "EMP-004",
    name: "Lead",
    dateOfBirth: new Date("2026-03-22"),
    designation: Designation.LEAD,
    reportsTo: "EMP-003",
    reportees: []
  });

  org.addEmployee({
    id: "EMP-005",
    name: "Engineer",
    dateOfBirth: new Date("2026-03-22"),
    designation: Designation.ENGINEER,
    reportsTo: "EMP-004",
    reportees: []
  });

  console.log("Current Employees:");
  console.dir(org.getAllEmployees(), { depth: null });

  console.log("\n=== 2. TESTING ERRORS ===");

  try {
    org.addEmployee({
      id: "EMP-006",
      name: "Engineer",
      dateOfBirth: new Date("2026-03-22"),
      designation: Designation.ENGINEER,
      reportsTo: "EMP-004",
      reportees: ["EMP-999"],
    });
  } catch (err) {
    console.error("Error:", (err as Error).message);
  }

  try {
    org.addEmployee({
      id: "EMP-007",
      name: "Engineer",
      dateOfBirth: new Date("2026-03-22"),
      designation: Designation.ENGINEER,
      reportsTo: "EMP-003",
      reportees: []
    });
  } catch (err) {
    console.error("Error:", (err as Error).message);
  }
}

main();