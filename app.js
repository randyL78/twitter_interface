// Dependent libriaries
const express = require('express');

/* Custom middleware imports */
const routes = require("./middleware/routes.js")


// Global variables
const app = express();
const port = process.env.PORT || 3030;

/* Set Express to render pug/jade */
app.set('view engine', 'pug');

/* have route file handle all routing */
app.use('/', routes);



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});