// Dependent libriaries
const express = require('express');
const path = require('path');

// Custom middleware imports 
const routes = require("./middleware/routes");
const createData = require("./middleware/createData");
const twitData = require('./middleware/twitData');

// Global variables
const app = express();
const port = 3040;

/* Create static data for now to pass to Pug */
app.use(createData);

/* get working on retrieving twitter data */
// app.use(twitData);

/* Set Express to render pug/jade */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Set location to look for non JS assets, primarily css */
app.use(express.static(path.join(__dirname, 'public')));

/* have route file handle all routing */
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});