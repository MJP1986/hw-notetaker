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
  let notes = fs.readFileSync("./db/db.json", "utf8");
  console.log(notes);
  res.json(JSON.parse(notes));
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

    fs.writeFile(__dirname + "/db/db.json", newArray, function(err, data) {
      if (err) res.json(err);
    });
    console.log(newNotes);
    res.json(readNotes.slice(-1));
  });
});

app.delete("/api/notes/:id", function(req, res) {
  const deleteNote = req.params.id;

  fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
    if (err) res.json(err);
    const readNote = JSON.parse(data);
    let newNote;
    newNote = readNote.filter(note => note.id != deleteNote);

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(newNote), function(
      err
    ) {
      if (err) res.json(err);
      res.json(newNote);
    });
  });
});

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
