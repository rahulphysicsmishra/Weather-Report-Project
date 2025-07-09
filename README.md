# 🌦️ Weather Report Project

A full-stack weather forecast app that allows users to:

- Select a city from a dropdown (loaded from a CSV)
- View a 7-day weather forecast (from the 7timer API)
- Add a custom city with latitude & longitude if it's not listed
- Persist custom cities into the CSV file using a Node.js backend

---

## 🚀 Features

- 🔽 Dropdown menu of cities with country
- 📆 7-day forecast pulled from **[7timer](http://7timer.info/doc.php)** API
- ➕ Add your own custom city via a form
- 📝 Saves new cities to `city_coordinates.csv` on the backend
- ⚡ Fully interactive UI with dynamic card rendering

---

## 📁 Project Structure
Weather Report Project/
├── css/
│   └── master.css
├── images/
│   └── [image files]
├── js/
│   └── main.js
├── city_coordinates.csv
├── index.html
└── server.js

---

## 🛠️ Technologies Used

### 👨‍💻 Frontend
- HTML, CSS, JavaScript
- [PapaParse](https://www.papaparse.com/) for reading CSV files
- Vanilla DOM manipulation
- Fetch API for weather + saving cities

### 🌐 Backend
- Node.js
- Express.js
- Built-in `fs` module for reading/writing CSV

---
