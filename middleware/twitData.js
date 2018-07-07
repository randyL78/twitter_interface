const express = require('express');

const twitData = (req, res, next) => {
  const Twit = require('twit');
  const config = require('./config');

  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  })

  T.get('account/verify_credentials', { skip_status: true })
    .catch( err => {
      console.log('caught error', err.stack)
    })
    .then( result => {
      req.data.avatar = result.data.profile_image_url;
      req.data.name = result.data.name;

      console.log(result.data);

    })
    .then( () => 
      res.render('index', {data: req.data})
    )
}

module.exports = twitData;