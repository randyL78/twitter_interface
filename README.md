# twitter_interface
Retrieves profile and tweets via Twitter's API and displays it to browser

## Format for creating configjs file:

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