const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const storage = [];

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(cors());
app.use(express.static('website'));

app.listen(port, () => console.log(`server running on localhost:${port}`));

app.get("/all", (req,res) => {
    res.send(storage);
});

app.get("/entry", (req,res) => {
    if (storage.length == 0) {
        res.send({});
    }
    else {
        res.send(storage[storage.length - 1])
    }
});

app.post("/entry", (req,res) => {
    storage.push(req.body);
    console.log("new entry received");
    res.sendStatus(200);
});
