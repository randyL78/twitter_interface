// Dependent libriaries
const express = require('express');
const path = require('path');

// Custom middleware imports 
const routes = require("./middleware/routes");

// Global variables
const app = express();
const port = 3000;

/* Set Express to render pug/jade */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Set location to look for non JS assets, primarily css */
app.use(express.static(path.join(__dirname, 'public')));

/* pass control to twitData to fetch twitter API data */
// app.get('/home', twitData)

/* redirect route handling to routes.js */
app.use('/', routes);

/* catch any errors, decide what to display based on err status */
// app.use((err, req, res, next) => {
//   console.log(err.status);
//   const data = req.data ||  {username: "@User"};
//   if (err.status === 404) {
//     res.render('notFound', {data})
//   } else {
//     res.render('error', {data})
//   }
// })

/* Start the application on the set prot */
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});