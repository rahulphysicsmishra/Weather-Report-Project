const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(__dirname));

const CSV_PATH = path.join(__dirname, "city_coordinates.csv");

// app.post("/api/add-city", (req, res)=>{
//     const {city, country, latitude, longitude} = req.body;
//     if (!latitude || !longitude || !city || !country) {
//         return res.status(400).json({error: "All fields are required"});
//     }
//     const newCity = `${city},${country},${latitude},${longitude}\n`;

//     fs.readFile(CSV_PATH, 'utf8', (err, data)=>{
//         if (err) return res.status(500).json({status: "error", message: "failed to read csv"})
//         const exists = data
//         .split("\n")
//         .some(line=>
//             line.toLowerCase().startsWith(`${latitude},${longitude},${city.toLowerCase()},${country.toLowerCase()}`)
//         );

//         if(exists) {
//             return res.status(400).json({status:"error", message: "city already exists"});
//         }

//         fs.appendFile(CSV_PATH, newCity, err=>{
//             if(err) return res.status(500).json({status: "error", message: "failed to append to csv"});
//             return res.json({status: "ok"});
//         });
//     });
// });
app.post("/api/add-city", (req, res) => {
  console.log("POST /api/add-city hit");
  console.log("Received body:", req.body);


  const { city, country, latitude, longitude } = req.body;

  if (!latitude || !longitude || !city || !country) {
    console.log("❌ Missing fields");
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }
  const CSV_PATH = path.join(__dirname, "city_coordinates.csv");
  const newCity = `$${city},${country},${latitude},${longitude}\n`;

  fs.readFile(CSV_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Failed to read CSV:", err);
      return res.status(500).json({ status: "error", message: "failed to read csv" });
    }

    const exists = data
      .split("\n")
      .some(line =>
        line.toLowerCase().startsWith(`${city.toLowerCase()},${country.toLowerCase()},${latitude},${longitude}`)
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


app.listen(PORT, ()=> {
    console.log(`server running at http://localhost:${PORT}`);
})