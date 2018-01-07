// Dependent libriaries
const express = require('express');

// Global variables
const app = express();
const port = 3011;

app.get('/', (req, res) => {
    res.send(`<h1>Initial project started</h1>`);
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});