const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/api/notes", function(req, res) {
  fs.readFile(__dirname + "/db/db.json", function(err, data) {
    if (err) {
      res.end("error not found");
    } else {
      res.json(data);
    }
  });
});
app.post("/api/notes", function(req, res) {
  const newNotes = req.body;
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
