// ================================================
// LAB3
// ================================================

// ================================================
// Q1: Create "employees" collection with validation:
//     - name: required, string
//     - age: required, int, minimum 18
//     - department: required, only ["HR","Engineering","Finance"]
// ================================================

// employess aleardy exist in ITI_Mongo will use runCommand and assign employees in collMod
use ITI_Mongo

db.employees.find()
// add validation
db.runCommand({
    collMod: "employees",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Employee Schema Validation",
            required: ["name", "age", "department"],

            properties: {
                name: {
                    bsonType: "string",
                    description: "name must be string"
                },

                age: {
                    bsonType: "int",
                    minimum: 18,
                    description: "age must be integer >= 18"
                },

                department: {
                    bsonType: "string",
                    enum: ["HR", "Engineering", "Finance"],
                    description: "department must be HR, Engineering, or Finance"
                }
            }
        }
    },
    validationAction: "error",
    validationLevel: "strict"
})
//
//validationAction: "error"  → يرفض الـ document خالص (Production)
//validationAction: "warn"   → يقبله بس يطبع warning (Development)

//validationLevel: "strict"  → يطبق على insert و update
//validationLevel: "moderate"→ يطبق على insert بس
//
//test will fail cause age is 16 less than minimum :18
db.employees.insertOne({
    name: "Ali",
    age: NumberInt(16),
    department: "HR"
})

// ================================================
// Q2: Create Database "Demo"
//     Collections: trainningCenter1, trainningCenter2
// using variable on insert
// ================================================

use Demo

db.createCollection("trainningCenter1")
db.createCollection("trainningCenter2")

show collections


// ================================================
// Q2-a: Define Variable "data" as Array
//       Fields: _id, name(firstName+lastName), age, address, status(array)
// ================================================
var data = [
    {
        _id: 1,
        name: { firstName: "Ahmed", lastName: "Mohamed" },
        age: 28,
        address: {
            street: "15 Tahrir St",
            city: "Cairo",
            country: "Egypt"
        },
        status: ["active", "verified"]
    },
    {
        _id: 2,
        name: { firstName: "Sara", lastName: "Khaled" },
        age: 24,
        address: {
            street: "7 Corniche Rd",
            city: "Alexandria",
            country: "Egypt"
        },
        status: ["active", "pending"]
    },
    {
        _id: 3,
        name: { firstName: "Omar", lastName: "Hassan" },
        age: 31,
        address: {
            street: "22 Nile Ave",
            city: "Giza",
            country: "Egypt"
        },
        status: ["inactive"]
    },
    {
        _id: 4,
        name: { firstName: "Nour", lastName: "Ibrahim" },
        age: 22,
        address: {
            street: "5 Hassan St",
            city: "Mansoura",
            country: "Egypt"
        },
        status: ["active", "verified", "premium"]
    }
]

// ================================================
// Q2-b: insertONE from data variable (first element)
// ================================================

// insertion on doc
db.trainningCenter1.insertOne(data) // has inserted one doc with array of elements with indexing of each element
db.trainningCenter1.insertOne(data[0]) // has inserted first element in array becuae i used 0 in data[0]
db.trainningCenter1.find()
//db.trainningCenter1.deleteMany({})
// ================================================
// Q2-c: insertMANY from SAME variable into trainningCenter2
// ================================================

db.trainningCenter2.insertMany(data)
db.trainningCenter2.find()


// ================================================
// Q3: find().explain() on age field BEFORE creating index
//     Identify scan type
// ================================================
db.trainningCenter2.find({ age: 28 }).explain("executionStats") // under winningPlan there is stage to know sreach by COLLSCAN OR IXSCAN

// OR shorter version:
db.trainningCenter2.explain().find({ age: 28 })

// ================================================
// Q4: Create index named "IX_age" on age field
// ================================================


db.trainningCenter2.createIndex(
    { age: 1 },              // 1 = ascending, -1 = descending
    { name: "IX_age" }       // name of index
)

db.trainningCenter2.getIndexes()  // will show indexes in collection


// ================================================
// Q5: find().explain() AFTER creating IX_age
//     Scan type should now be IXSCAN
// ================================================

db.trainningCenter2.find({ age: 28 }).explain("executionStats") // under winningPlan there is stage: to know sreach by COLLSCAN OR IXSCAN in this case IXSCAN on age
db.trainningCenter2.find({ _id: 4 }).explain("executionStats") // under winningPlan there is stage: to know sreach by COLLSCAN OR IXSCAN in this case EXPRESS_IXSCAN on _id



// ================================================
// Q6: Create COMPOUND index on firstName + lastName
// ================================================


// before creating the compund index:
db.trainningCenter2.find({
  "name.firstName": "Ahmed",
  "name.lastName": "Mohamed"
}).explain("executionStats")  // COLLSCAN 

// compound index : index in more than one field

db.trainningCenter2.createIndex(
  {
    "name.firstName": 1,     // First field in compound
    "name.lastName":  1      // Second field in compound
  },
  { name: "compound" }       // index name
)
db.trainningCenter2.getIndexes()

// ================================================
// Q6-b: find().explain() AFTER compound index
// ================================================
// Test 1: Both fields == IXSCAN keypattern 
db.trainningCenter2.find({
  "name.firstName": "Ahmed",
  "name.lastName": "Mohamed"
}).explain("executionStats")

// Test 2: firstName only → IXSCAN (prefix rule!)
db.trainningCenter2.find({
  "name.firstName": "Sara"
}).explain("executionStats")

// Test 3: lastName only → COLLSCAN (not prefix!)
db.trainningCenter2.find({
  "name.lastName": "Hassan"
}).explain("executionStats")


// ================================================
// Q7: Drop the entire "Demo" database
// ================================================

use Demo

db.dropDatabase()



//////////////////////BONUS

// this first command
// mongodump --db Demo --out E:\ITI\NOSQL_MongoDB\NOSQL_MongoDB_Day3 

// then will drop database
// on mongshel by monfosh 
//use Demo
//db.dropDatabase()
//exit

// then this command to restore
// mongorestore --nsFrom="Demo.*" --nsTo="ITI_DemodbBonus.*" E:\ITI\NOSQL_MongoDB\NOSQL_MongoDB_Day3