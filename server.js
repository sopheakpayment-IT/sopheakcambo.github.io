const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/data", (req, res) => {
  res.json({
    status: "OK",
    message: "Hello from backend",
    time: new Date()
  });
});

app.listen(3000, () => console.log("API running"));
