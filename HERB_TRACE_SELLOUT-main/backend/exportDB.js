const mongoose = require("mongoose");
const fs = require("fs");

const uri = "mongodb://127.0.0.1:27017/herbtrace";

async function exportDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    const exportData = {};

    for (const col of collections) {
      const name = col.name;

      const data = await db.collection(name).find({}).toArray();

      exportData[name] = data;

      console.log(`Exported ${name}`);
    }

    fs.writeFileSync("herbtrace_backup.json", JSON.stringify(exportData, null, 2));

    console.log("Database exported successfully!");
    process.exit();

  } catch (err) {
    console.error(err);
  }
}

exportDatabase();