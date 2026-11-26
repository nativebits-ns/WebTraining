// Task 1: Local Setup and Data Creation
// Step 1: Verify MongoDB
mongosh
show dbs

// Step 2: Select the Database
use company
db.dropDatabase()

// Step 3: Insert the Dataset
db.employees.insertMany([
  {
    _id: "EMP001",
    name: "John",
    department: "Engineering",
    experience: 4,
    skills: ["Java", "SpringBoot"],
    active: true,
    address: {
      city: "Pune",
      country: "India"
    }
  },
  {
    _id: "EMP002",
    name: "Alice",
    department: "HR",
    experience: 3,
    skills: ["Recruitment", "Communication"],
    active: true,
    address: {
      city: "Mumbai",
      country: "India"
    }
  },
  {
    _id: "EMP003",
    name: "David",
    department: "Engineering",
    experience: 6,
    skills: ["Java", "MongoDB"],
    active: true,
    address: {
      city: "Bengaluru",
      country: "India"
    }
  },
  {
    _id: "EMP004",
    name: "Emma",
    department: "Finance",
    experience: 2,
    skills: ["Accounting", "Excel"],
    active: false,
    address: {
      city: "Pune",
      country: "India"
    }
  },
  {
    _id: "EMP005",
    name: "Robert",
    department: "Engineering",
    experience: 5,
    skills: ["Java", "Docker"],
    active: true,
    address: {
      city: "Delhi",
      country: "India"
    }
  }
])

db.employees.find()

// Task 2: Read and Query Operations
// 2.1 Engineering Employees
db.employees.find(
    {department: "Engineering"}, 
    {_id:1, name:1, experience:1})
    .sort({name:1})

// 2.2 Employees with 5 or More Years of Experience
db.employees.find( 
    {experience: {$gte: 5}},
    {name:1, experience: 1,_id:0})
    .sort({experience: -1})

// 2.3 Nested Document Query
db.employees.find(
    {"address.city": "Pune"},
    {_id: 0,name:1, "address.city":1})
    .sort({name: 1})

// 2.4 Array Query
db.employees.find(
    {skills: { $in: ["MongoDB", "SpringBoot"] }},
    {_id: 0, name: 1}).
    sort({ name: 1 })

// 2.5 Sorting and Limiting
db.employees.find(
    {},
    {_id: 0, name:1, experience:1})
    .sort({experience: -1})
    .limit(2)

// Task 3: Update Operations
// 3.1 $inc
db.employees.find({name: "Alice"})

db.employees.updateOne(
    {name: "Alice"},
    {$inc: {experience: 1}}
)

db.employees.find({name: "Alice"})

// 3.2 $set
db.employees.find({name: "Emma"})

db.employees.updateOne(
    {name: "Emma"},
    {$set: {active: true}}
)
db.employees.find({name: "Emma"})

// 3.3 $addToSet
db.employees.find({name: "Robert"})

db.employees.updateOne(
    {name: "Robert"},
    {$addToSet: {skills: "MongoDB"}}
)

db.employees.find({name: "Robert"})

db.employees.updateOne(
    {name: "Robert"},
    {$addToSet: {skills: "MongoDB"}}
)

db.employees.find({name: "Robert"})

// Task 4: Delete Operation
db.employees.insertOne(
    {
        _id: "EMP999",
        name: "Temporary Employee",
        department: "Training",
        experience: 0
    }
)

db.employees.findOne({ _id: "EMP999" })

db.employees.deleteOne({_id: "EMP999"})

db.employees.findOne({ _id: "EMP999" })

// Task 5: Indexing
// 5.1 Check Existing Indexes
db.employees.getIndexes()

// 5.2 Create an Index
db.employees.createIndex({department: 1})

// 5.3 Verify the Index
db.employees.getIndexes()

// Task 6: Aggregation
// 6.1 Employees per Department
db.employees.aggregate([ { $group: { _id: "$department", numOfEmp: {$sum: 1} }}, {$sort: {_id: 1}} ])

// 6.2 Average Experience per Department
db.employees.aggregate([ { $group: { _id: "$department", numOfEmp: {$avg: "$experience"} }}, {$sort: {_id: 1}} ])

// 6.3 Top Engineering Employees
db.employees.aggregate([{ $match: { department: "Engineering" } }, { $project: { name: 1, experience: 1, _id: 0 } }, {$sort: {experience: -1}}, {$limit: 2}])