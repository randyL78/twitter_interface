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
          banner    : result.data[0].user.profile_banner_url,
          name      : result.data[0].user.name,
          username  : result.data[0].user.screen_name,
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
        resolve(data);
      })
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

  const getMessages = new Promise( resolve => {
    T.get('direct_messages/events/list', {count: 5})
      .then( result => {
        const directMessage = {
          name    : "Sandy",
          messages: []
        }
        resolve(directMessage);
      })
      .catch( err => {
        console.log('caught error', err.stack)
        resolve ({
          name: "Sandy",
          messages : [
              {
                message : "How are things",
                time    : 3,
                them    : true
              },
              {
                message : "They're good!",
                time    : 3,
                them    : false
              }
            ]
        })
      })
  }) 

  /* method entry point for twitData */
  Promise.all([getTweets, getFollowing, getMessages])
    .then( data => {
      pugData = data[0];
      pugData.following = data[1];
      pugData.directMessage = data[2];
      res.render('index', {data: pugData})
    })
}

module.exports = twitData;