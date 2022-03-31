const fs = require('fs');
const db = require('./db/db.json');
const express = require('express');
const editJsonFile = require('edit-json-file');
const path = require('path');
const PORT = 3001;
const app = express();

dbfile = editJsonFile(`./db/db.json`)

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req,res) => {
    return res.json(dbfile.get("notes"))
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

function determineUsableID() {
    let idArr = []
    for (item of dbfile.get("notes")) {
        idArr.push(item.id)
    }
    for (let index = 1; index < idArr.length+2;index++) {
        if (!idArr.includes(index)) {
            return index
        }
    }
}

app.post('/api/notes', (req, res) => {
    console.log('Posted');
    dbfile.append('notes', {...req.body, id: determineUsableID()})
    return res.json(dbfile.get("notes"))
})

app.delete('/api/notes/:id', (req, res) => {
    let temp = dbfile.get("notes").filter( note => note.id !== parseInt(req.params.id))
    dbfile.set("notes", temp)
    return res.json(dbfile.get("notes"))
})

app.listen(PORT, () => console.log('Listening'))