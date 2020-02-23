const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const uuid = require("uuid/v4");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", function(req, res) {
  const newNotes = req.body;
  newNotes.id = uuid();

  fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
    // console.log(data);
    const readNotes = JSON.parse(data);
    readNotes.push(newNotes);
    const newArray = JSON.stringify(readNotes);

    fs.writeFile(__dirname + "/db/db.json", newArray, function(err) {
      if (err) res.json(err);
    });
    console.log(readNotes);
    console.log(newNotes);
    res.json(readNotes.slice(-1));
  });
});

app.delete("/api/notes/:id", function(req, res) {});

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
