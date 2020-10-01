import url from "url";
import MongoClient, { ObjectID } from "mongodb";

// Create cached connection variable
let cachedDb = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(url.parse(uri).pathname.substr(1));

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req, res) => {
  // Get a database connection, cached or otherwise,
  // using the connection string environment variable as the argument
  const db = await connectToDatabase(process.env.MONGODB_URI);
  // Select the "calculators" collection from the database
  const collection = await db.collection("calculators");
  if (req.method === "GET") {
    // Select the calculators collection from the database
    const calculators = await collection.find({}).sort({ num: -1 }).toArray();

    // Gets the total size of the calculators
    const total = await collection.countDocuments({});

    // Respond with a JSON string of all users in the collection
    res.status(200).json({ calculators, total });
  }
  else if (req.method === "POST") {
    let data = req.body;
    if (!data) res.status(400);
    // Gets the total count of the documents
    const total = await collection.countDocuments({});
    // Edits the date to be a mongo date
    data.date = new Date(new Date(data.date).toLocaleDateString());
    // Inserts the document count as the number in the data
    data.num = total + 1;
    // Inserts the log into the record with a default entry
    data.log = [{num: 1, type: "Log", status: "Received and Inventoried", source: "None", date: new Date(new Date().toLocaleDateString())}];
    // Inserts the document into the collection
    collection.insertOne(data, function(err, resp) {
      if (err) res.status(400).json(err);
      else {
        res.status(200).json(data);
      }
    })
  }
  else if (req.method === "PATCH") {
    let data = req.body;
    // Gets the calculator number to edit
    let calcNumber = data.num;
    // Replaces the record with the new record
    delete data._id;
    collection.updateOne({num: calcNumber}, {$set: data}, function(err, resp) {
      console.error(err)
      if (err) res.status(400).json(err);
      else {
        res.status(200).json(data);
      }
    })
  }
  else if (req.method === "DELETE") {
    // Gets the calculator number to delete
    let calcID = req.query._id;
    let mongoID = new ObjectID(calcID);
    // Deletes the record
    collection.deleteOne({_id: mongoID}, function(err, obj) {
      if (err) res.status(400).json(err);
      else {
        res.status(200).json({success: true});
      }
    })
  }
};
