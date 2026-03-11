// ================================================
// Q1: Find documents where "tags" field EXISTS
// ================================================
db.inventory.find()

// find( {WHERE CONDITION} , {PROJECTION-Fields will appear in query - id is defual true(1)}  ----  must all fields 1 or zero except id )

db.inventory.find(
    { tags: { $exists: 1 } },
    { tags: 1 }
)
// ================================================
// Q2: Find documents where "tags" does NOT contain
//     "ssl" OR "security"
// ================================================

// $in and $nin take list of values and in object{} in condition in find but $eq and $ne for compares specific value not values in list
db.inventory.find(
    { tags: { $nin: ["ssl", "security"] } },
    { tags: 1 }
)
// ================================================
// Q3: Find documents where "qty" = 85
// ================================================

db.inventory.find(
    { qty: 85 }, // or can use {qty:{$eq:85}}
    { item: 1, qty: 1 }
)
// ================================================
// Q4: Find where "tags" contains ALL of [ssl, security]
// ================================================
// $all will get documents that have at least this two values or more  
db.inventory.find(
    { tags: { $all: ["ssl", "security"] } },  // $size 2
    { tags: 1 }
)
// ================================================
// Q5: Find documents where "tags" array has size = 3
// ================================================
db.inventory.find(
    { tags: { $size: 3 } },
    { tags: 1 }
)
// ANOTHER WAY IF WE WANT SIZE 2 OR MORE ---- ACESS AS INDEX FROM 0
db.inventory.find(
    { "tags.2": { $exists: true } }, // has at least 3 elements
    { tags: 1 }
)
// ================================================
// Q6: Update item : "paper" document
//     - change size.uom to "meter"
//     - add lastModified field with current date
// ================================================
db.inventory.find({ "item": "paper" })

db.inventory.updateOne(
    { item: "paper" },
    {
        $set: {
            "size.uom": "meter",
            "lastModified": new Date() // CurrentDate
        }
    }
)

//a.Also, use the upsert option (within updateOne)and change filter condition item:”laptopDevice”.
db.inventory.find({ "item": "laptopDevice" })

db.inventory.updateOne(
    { item: "laptopDevice" },
    {
        $set: {
            "size.uom": "meter",
            "lastModified": new Date() // CurrentDate
        }
    },
    { upsert: true }
)
//b.Use the $setOnInsert operator to add new data if an insert occurs.

//if upsert occurs - if condition not matched thats mean there is no document and will add new doc - $setOnInsert wll ocure
db.inventory.updateOne(
    { item: "Mobile" },
    {
        $set: {
            "size.uom": "meter",
            "lastModified": new Date() // CurrentDate
        },
        $setOnInsert: { // Will insert only in case of field in condition not existed and will insert in the first time and upsert put thier insert
            "firstInsert": new Date(),
            "tags": ["E", "F"]
        }
    },
    { upsert: true }
)

// c.Try using the updateMany operation
db.inventory.find({ code: "xyzz" }, {})

db.inventory.updateMany({ code: "xyz" },
    {
        $set:
            { code: "xyzz" }

    })
    
/////// updateMany with upsert
db.inventory.updateMany(
    { item: "laptopDevice" },
    {
        $set: {
            "size.uom": "meter",
            "lastModified": new Date() // CurrentDate
        }
    },
    { upsert: true }
)
///////// updateMany with upsert and $setOnInsert
db.inventory.updateMany(
    { item: "Mobile" },
    {
        $set: {
            "size.uom": "meter",
            "lastModified": new Date() // CurrentDate
        },
        $setOnInsert: { // Will insert only in case of field in condition not existed and will insert in the first time and upsert put thier insert
            "firstInsert": new Date(),
            "tags": ["E", "F"]
        }
    },
    { upsert: true }
)

//d.Try using the `replaceOne` operation.
// replaceOne replace all document by new doc but updateOne updated specific fields
db.inventory.replaceOne(
    { code: "xyzz" },
    {
        code: "xyzz",
        tags: ["school", "bag"]

    })

// ================================================
// Q7: Insert a document with incorrect field names "neme" and "ege," then rename them to "name" and "age."
// ================================================
db.inventory.insertOne({
    neme: "aaaa",
    ege: 22
})
db.inventory.findOne({ neme: "aaaa" })

db.inventory.updateOne(
    { neme: "aaaa" },
    {
        $rename: {
            "neme": "name",          // rename neme → name
            "ege": "age"             // rename ege  → age
        }
    }
)
db.inventory.findOne({ name: "aaaa" })

// ================================================
// Q8: Try to reset any document field using the `$unset` function.
// ================================================

// diff between unset and delete - unset remove field in document but delete removes all document 
db.inventory.find({ code: "ijk" }, { code: 1 })

db.inventory.updateOne(
    { code: "ijk" },
    { $unset: { qty: "" } }
)
// if there is many docs matched will unset or remove first matched if we need to remove all use updateMany

// ================================================
// Q9: updated with $inc, $min, $max, $mul
// ================================================
db.employees.find()
// $max instead of set will check if new field gte old in doc will update it if not will not do any thing
db.employees.updateOne(
    { name: "Bob Johnson" },
    { $max: { salary: 80000 } }
)
// insert overtime field
db.employees.updateMany(
    {
        $or: [
            { name: "John Doe" },
            { name: "Alice Smith" }
        ]
    },
    { $set: { overtime: 55 } }
)
// $min will update if new value lt old value
db.employees.updateOne(
    { name: "John Doe" },
    { $min: { overtime: 40 } }
)
// insertion of age field
db.employees.updateMany(
    { department: "Sales" },
    { $set: { age: 30 } }
)
// $inc will increase or decrease field value
db.employees.updateOne(
    { name: "Alice Smith" },
    { $inc: { age: 5 } }
)
// $mul will multiply field by number we specify
// if i used with null or strign will get error if not exist will create fiedl but will add value 0

db.sales.find()

db.sales.updateOne(
    { product: "Widget" },
    { $mul: { quantity: 2, price: 2 } }
)
//////////////////////////test//////////
db.sales.updateOne(
    { product: "Widget" },
    { $inc: { quantity: -30, price: -75 } }
)
// updateMany if i want ti update matched docs
db.sales.updateMany(
    { product: "Widget" },
    { $mul: { quantity: 2, price: 2 } }
)
////////////////////////////////
// ================================================
// Q10: Total Revenue per product
//      Date range: 2020-01-01 to 2023-01-01
//      Revenue = SUM(quantity * price)
//      Sort by revenue DESCENDING
// ================================================
db.sales.find()

db.sales.aggregate([

    // Stage 1 $match - Filter by date range
    {
        $match: {
            date: {
                $gte: new Date("2020-01-01"),
                $lte: new Date("2023-01-01")
            }
        }
    },

    // Stage 2 $group - GROUP BY product + SUM(quantity * price)
    {
        $group: {
            _id: "$product",
            totalRevenue: {
                $sum: { $multiply: ["$quantity", "$price"] }
            }
        }
    },

    // Stage 3 $sort - Sort by revenue DESC
    {
        $sort: { totalRevenue: -1 } // 1 ASC , -1 DESC
    }

])

// ================================================
// Q11: AVG salary per department
// SELECT department, AVG(salary) FROM employees GROUP BY department
// ================================================
db.employees.find()


db.employees.aggregate([
    // Stage 1 $match - Filter 
    //{
        // there is no filter
    //},
    // Stage 2 $group - GROUP BY department
    {
        $group:{
            _id: "$department",
            avgSalary: { $avg: "$salary" }, // we can use $round: ["$avgSalary", 2] to roun to 2 decimal
            maxSalary: { $max: "$salary" },            
            minSalary: { $min: "$salary" }             
        }

    },
    // Stage 3 $sort - Sort by $department ASC
    {
        $sort: { _id: 1 }  // 1 ASC , -1 DESC
    }
])

// ================================================
// Q12: MAX and MIN likes per title
//   SELECT title, MAX(likes), MIN(likes) FROM likes GROUP BY title
// ================================================
db.likes.find()

db.likes.aggregate([
    // Stage 1 $match - Filter 
    //{
        // there is no filter
    //},
    // Stage 2 $group - GROUP BY title
    {
        $group:{
            _id: "$title",
            maxlikes: { $max: "$likes" },            
            minlikes: { $min: "$likes" }             
        }

    },
    // Stage 3 $sort - Sort by $title ASC
    {
        $sort: { _id: 1 }  // 1 ASC , -1 DESC
    },
    // stage 4 if i need to save this result in new document will use out ---
    {
        $out:"collectionName"
    }
    
])