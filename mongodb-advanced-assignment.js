// Task 1: Schema Validation and Data Creation
mongosh
show dbs

// Step 1: Select a Fresh Database
use company_advanced
db.dropDatabase()

// Step 2: Create the Validated Collection
db.createCollection("employees", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "departmentId", "experience", "active"],
            properties: {
                _id: { bsonType: "number" },
                name: { bsonType: "string" },
                departmentId: { bsonType: "number" },
                experience: { bsonType: "number"},
                active: { bsonType: "bool"}
            }
        }
    },
    validationAction: "error"
})

// Step 3: Insert the Starting Dataset
db.employees.insertMany([
  {
    _id: 1,
    name: "John",
    departmentId: 10,
    skills: ["Java", "MongoDB"],
    experience: 4,
    active: true,
    certifications: [
      { name: "MongoDB", status: "Expired", expiryYear: 2026 }
    ]
  },
  {
    _id: 2,
    name: "Alice",
    departmentId: 10,
    skills: ["Python", "MongoDB"],
    experience: 6,
    active: true,
    certifications: [
      { name: "MongoDB", status: "Active", expiryYear: 2028 }
    ]
  },
  {
    _id: 3,
    name: "David",
    departmentId: 20,
    skills: ["Communication"],
    experience: 3,
    active: false,
    certifications: [
      { name: "Communication", status: "Active", expiryYear: 2027 }
    ]
  }
])

// Step 4: Test the Validation Rule
db.employees.insertOne({
    _id: 99,
    name: 123,
    departmentId: "HR",
    experience: "one",
    active: "yes"
})

// Task 2: Advanced Array Queries and Updates
// 2.1 Find One Matching Array Object
db.employees.find({certifications: {$elemMatch: { name: "MongoDB", status: "Active" }}})

// 2.2 Update One Matching Array Element
db.employees.update({name: "John", "certifications.name":"MongoDB"}, {$set: {"certifications.$.status": "Active" }})

// 2.3 Update Selected Array Elements
db.employees.updateMany({},
  { $set: { "certifications.$[elem].status": "Renewal Due" } },
  { arrayFilters: [ { "elem.expiryYear": { $lt: 2027 } } ] }
)

// Task 3: Bulk Write Operations
// Use one bulkWrite() call to complete all three operations:
// 1. Increase John's experience by 1.
// 2. Set Alice's active value to false.
// 3. Insert Emma using the document below.
db.employees.bulkWrite([
  {
    updateOne: {
      filter: { name: "John" },
      update: { $inc: { experience: 1 } }
    }
  },
  {
    updateOne: {
      filter: { name: "Alice" },
      update: { $set: { active: false } }
    }
  },
  {
    insertOne: {
      document: {
        _id: 4,
        name: "Emma",
        departmentId: 20,
        skills: ["Excel"],
        experience: 2,
        active: true,
        certifications: [
          { name: "Excel", status: "Active", expiryYear: 2026 }
        ]
      }
    }
  }
])

// Task 4: Advanced Aggregation
// Step 1: Create the Departments Collection
db.departments.insertMany([
  { _id: 10, name: "Engineering" },
  { _id: 20, name: "HR" }
]);

// 4.2 Count Employees for Each Skill
db.employees.aggregate([
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 }} },
  { $sort: { count: -1, _id: 1} }
]);

// 4.3 Return Active Employees and a Count
db.employees.aggregate([
  { $match: { isActive: true } },
  { $facet: { activeEmployees: [ { $sort: { name: 1 } }, { $project: { _id: 0, name: 1 } } ], totalCount: [ { $count: "count" } ]} }
]);

// Task 5: Indexing and Query Performance
// 5.1 Create and Verify a Compound Index
db.employees.createIndex({department: 1, name: 1})

db.employees.getIndexes()

// 5.2 Read explain("executionStats")
db.employees
.find({ departmentId: 10 })
.sort({ name: 1 })
.explain("executionStats")

// ● winning plan stage: COLLSCAN
// ● nReturned: 2
// ● totalDocsExamined: 4
// ● totalKeysExamined: 0


// 5.3 Create a TTL Index
db.sessions.insertOne({
  _id: 1,
  userName: "John",
  expiresAt: new Date(Date.now() + 600000)
})

db.sessions.createIndex(
  { expiresAt: 1 },
  { 
    expireAfterSeconds: 0,
    name: "expiresAt_1"
  }
)

// Task 6: Backup and Restore
mongodump --db=company_advanced --archive=company_advanced.archive --gzip
mongorestore --gzip --archive=company_advanced.archive --nsFrom="company_advanced.*" --nsTo="company_advanced_restore.*"

use company_advanced_restore;

db.getCollectionNames().forEach(function(col) {
  print(col + ": " + db.getCollection(col).countDocuments());
});
