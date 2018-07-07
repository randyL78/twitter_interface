const twitData = (req, res, next) => {
  const Twit = require('twit');
  const config = require('./config');

  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  })


  const getTweets = new Promise( resolve => {
    T.get('statuses/user_timeline', {count: 5})
      .catch( err => {
        console.log('caught error', err.stack)
      })
      .then( result => {
        const data = {
          avatar    : result.data[0].user.profile_image_url,
          name      : result.data[0].user.name,
          timeline  : []
        };
        result.data.forEach(tweet => {
          data.timeline.unshift({
            avatar  : tweet.user.profile_image_url,
            name    : tweet.user.name,
            username: tweet.user.screen_name,
            message : tweet.text,
            time    : "4h",
            retweets: tweet.retweet_count,
            likes   : tweet.favorite_count
          }) 
        });
        return(data)
      })
      .then( data => {
        resolve(data);
      }); 
    });

  const getFollowing = new Promise( resolve => {
    T.get('friends/list', {count: 5})
      .then( result => {
        const following = [];
        result.data.users.forEach(user => {
          following.push(
            {
              name    : user.name,
              username: user.screen_name,
              avatar  : user.profile_image_url,
              followed: true
            }
          )
        })
        resolve(following);
      })
  })

  /* method entry point for twitData */
  Promise.all([getTweets, getFollowing])
    .then( data => {
      pugData = data[0];
      pugData.following = data[1];
      res.render('index', {data: pugData})
    })
    

}

module.exports = twitData;