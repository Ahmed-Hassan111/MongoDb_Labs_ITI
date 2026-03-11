// lab1

// Q1: Create Database named "ITI_Mongo"
use ITI_Mongo
db
//-----------------------------------------------------------------------------------------------------------------
// Q2: Create Collection named "Staff"
db.createCollection("Staff")


///// insertion added in another shel tab
/////// if there is collection added will insert into and if not will create then insert into
show collections
//-----------------------------------------------------------------------------------------------------------------
// Q3: Insert ONE document into "Staff"
// Fields: {_id, name, age, gender, department}
db.Staff.insertOne({
    _id: 1,
    name: "Ahmed",
    age: 24,
    gender: "M",
    department: "Data"
})

db.Staff.find({})
//-----------------------------------------------------------------------------------------------------------------
// Q4: Insert MANY documents into "Staff"
// 3 objects with DIFFERENT structures (NoSQL Flexibility!)
db.Staff.insertMany([
    {
        _id: 2,
        name: "Mohamed",
        age: 23,
        gender: "M",
        department: "SW"
    },
    {
        _id: 3,
        name: "Ali",
        age: 25,
        gender: "M",
        managerName: "Mahmoud",
        department: "Data"
    },
    {
        _id: 4,
        name: "Eman",
        age: 23,
        gender: "F",
        DOB: new Date("2002-06-15")
    }
])

db.Staff.find({})
//-----------------------------------------------------------------------------------------------------------------
///////// Q5:Query to find data from the "Staff" collection:

//////1: Find ALL documents
db.Staff.find({})

//////2: Find where gender = "male"
db.Staff.find({ gender: "M" })

//////3: Find where age BETWEEN 20 AND 25
// operators in NOSQL
// gte : greater than or equal >=
// $lte: less than or equal <=
// $gt: greater than >
// $lt: less than <
// $eq: equal =
// $ne: not equal =!
db.Staff.find({
    age: { $gte: 20, $lte: 25 }
})

//4: Find where age = 25 AND gender = "female"
////// and is default not necessary if using $and
db.Staff.find(
    { age: 25, gender: "F" }
)
//db.Staff.insertOne({age:25},{gender:"F"})
//db.Staff.updateOne(
//    { _id: ObjectId('69a78726442dc3151844152e') },
//    {
//        $set: {
//            gender: "F"
//        }
//    }
//)

////// OR BY USING $and
db.Staff.find({
    $and: [
        { age: 25 },
        { gender: "F" }
    ]
})
db.Staff.find({})

//5: Find where age = 20 OR gender = "female" 
db.Staff.find({
    $or: [
        { age: 20 },
        { gender: "F" }
    ]
})

//-----------------------------------------------------------------------------------------------------------------
// Q6: Update one document in the "Staff" collection where age is 15, set the name to "your name".
db.Staff.updateOne({ age: 24 }, {
    $set: { name: "ahmed hassan" }
}
)
// if i updated more than document htat matched with condition or filter first matched will updated only
db.Staff.updateOne({ age: 23 }, {
    $set: { department: "SW" }
}
)

db.Staff.find({})
//-----------------------------------------------------------------------------------------------------------------
// Q7: Update many documents in the "Staff" collection, update the department to "AI".
db.Staff.updateMany({}, { $set: { department: "AI" } })


//-----------------------------------------------------------------------------------------------------------------
// Q8: Create a new collection called "test" and insert documents from Question 4.
db.test.insertMany([
    {
        _id: 2,
        name: "Mohamed",
        age: 23,
        gender: "M",
        department: "SW"
    },
    {
        _id: 3,
        name: "Ali",
        age: 25,
        gender: "M",
        managerName: "Mahmoud",
        department: "Data"
    },
    {
        _id: 4,
        name: "Eman",
        age: 23,
        gender: "F",
        DOB: new Date("2002-06-15")
    }
])

db.test.find()
//-----------------------------------------------------------------------------------------------------------------
// Q9: Try to delete one document from the "test" collection where age is 15.

// insertion 2 documents with age 15
db.test.insertOne({ _id: 5, name: "ahmed", age: 15 })
db.test.insertOne({ _id: 6, name: "eman", age: 15 })
db.test.insertMany([
    { _id: 5, name: "ahmed" },
    { _id: 6, name: "eman" }
])
// deletion of users whose age is 15
db.test.deleteOne({ age: 15 })

db.test.find({ age: 15 })
db.test.find()

// deleteion executed in the first document matched with the condition in delete (based on first insertion)
// so ahmed deleted becuase this inserted first
//----------------------------------------------------------------------------------------------------------------
// Q10: try to delete all male gender
db.test.deleteMany({ gender: "M" })
//----------------------------------------------------------------------------------------------------------------
// Q11:	Try to delete all documents in the "test" collection.

// if we want to remove data only and keep structure
db.test.deleteMany({})

db.test.countDocuments()

// if we want to drop the collection and thier data
// db.test.drop()
