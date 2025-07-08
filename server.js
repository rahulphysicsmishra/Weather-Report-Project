const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());



const CSV_PATH = path.join(__dirname, "city_coordinates.csv");

app.post("/api/add-city", (req, res) => {
  console.log("POST /api/add-city hit");
  console.log("Received body:", req.body);


  const {latitude, longitude,  city, country } = req.body;

  if (!city || !country || !latitude || !longitude ) {
    console.log("❌ Missing fields");
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }
  const CSV_PATH = path.join(__dirname, "city_coordinates.csv");
  const newCity = `\n${latitude},${longitude},${city},${country}`;

  fs.readFile(CSV_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Failed to read CSV:", err);
      return res.status(500).json({ status: "error", message: "failed to read csv" });
    }

    const exists = data
      .split("\n")
      .some(line =>
        line.toLowerCase().startsWith(`${latitude},${longitude},${city.toLowerCase()},${country.toLowerCase()}`)
      );

    if (exists) {
      console.log("⚠️ City already exists");
      return res.status(400).json({ status: "error", message: "City already exists" });
    }

    fs.appendFile(CSV_PATH, newCity, err => {
      if (err) {
        console.error("❌ Failed to append to CSV:", err);
        return res.status(500).json({ status: "error", message: "failed to append to csv" });
      }
      console.log("✅ City added");
      return res.json({ status: "ok" });
    });
  });
});

app.use(express.static(__dirname));

app.listen(PORT, ()=> {
    console.log(`server running at http://localhost:${PORT}`);
})