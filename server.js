projectData = [];

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

app.listen(port, () => console.log(`server running on localhost:${port}`));

app.get("/all", (req,res) => {
    res.send(projectData);
});

app.post("/entry", (req,res) => {
    projectData.push(req.body);
});
