const twitData = (req, res, next) => {
  const Twit = require('twit');
  const config = require('./config');

  var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  })


  const getTweets = new Promise( (resolve, reject) => {
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
            retweets  : tweet.retweet_count,
            likes     : tweet.favorite_count
          }) 
        });
        return(data)
      })
      .then( data => {
        resolve(data);
      }); 
    });

  const getFollowing = T.get('friends/list', {count: 5})
    .then( result => {

      result.data.users.forEach(user => {
        req.data.following.push(
          {
            name    : user.name,
            username: user.screen_name,
            avatar  : user.profile_image_url,
            followed: true
          }
        )
      })
      // console.log(req.data.following);
    })

  /* method entry point for twitData */
  Promise.all([getTweets])
    .then( data => {
      res.render('index', {data: data[0]})
    })
    

}

module.exports = twitData;