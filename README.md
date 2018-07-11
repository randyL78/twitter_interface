# twitter_interface

Retrieves profile and tweets via Twitter's API and displays it to browser

## Instructions for running

1. After downloading and unzipping contents, type `npm install` in the App's root directory to get all of the project dependencies.

2. Place your own `config.js` file inside of the "middleware" folder, following the format below.

3. Type `npm start` in the command terminal.

4. Enjoy!

### Format for creating configjs file:

```
const config = {
  consumer_key : '...',
  consumer_secret : '...',
  access_token : '...',
  access_token_secret : '...'
}

module.exports = config;
``` 

Please place it inside of the `middleware` folder for proper functionality.