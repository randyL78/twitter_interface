const twitData = (req, res, next) => {
  const Twit = require('twit');
  const config = require('./config');

  /* Interface for comminicating with twitter API */
  var T = new Twit({
    consumer_key        : config.consumer_key,
    consumer_secret     : config.consumer_secret,
    access_token        : config.access_token,
    access_token_secret : config.access_token_secret
  })

  /* Promise for getting tweets on the main timeline and the user's info */
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

  /* Promise for getting main user's information */
  const getMainInfo = new Promise( resolve => {
    T.get('account/verify_credentials', { skip_status: true })
      .catch( err => console.log('caught error', err.stack))
      .then( result => {
        const user = {
          name    : result.data.name,
          username: result.data.screen_name,
          banner  : result.data.profile_banner_url,
          id      : result.data.id,
          avatar  : result.data.profile_image_url
        }
        resolve(user);
      })
  })

  /* Promise for getting people user is following */
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

  /* Promise for getting user information from an id */
  const getUserById = user_id => new Promise( resolve => {
    T.get('users/lookup', {user_id})
      .then( result => {
        const data = {};
        data.user = {
          name  : result.data[0].name,
          avatar: result.data[0].profile_image_url,
          id    : user_id
        }
        resolve(data);
      })
  })

  /* Promise for getting and filtering direct messages */
  const getMessages = new Promise( resolve => {
    /* Get main user info to compare by when filtering messages */
    getMainInfo
      .then( result => {
        /* Pulls the last 30 days worth of DMs from twitter 
           Defaults to 20 most recent */
        return Promise.resolve(
        T.get('direct_messages/events/list')
          .then( dms => {
            const directMessage = {
              user : {}
            }

            /* Get details of most recent DM */
            const recepient = dms.data.events[0].message_create.target.recipient_id;
            const sender = dms.data.events[0].message_create.target.sender_id;

            /* find out the id of the person opposite the user
               this will be person user is conversing with, and the person 
               whose DMs we will want to filter by */
            directMessage.user.id =  (result.id === recepient)
              ? sender
              : recepient
             
            /* return the beginning of our directMessage object
               as well as dms object */  
            return {directMessage, dms}
          })
          .catch( err => {
            console.log('caught error', err.stack)
          })
        )
      })
      .then(result => {
        const id = result.directMessage.user.id
        let messages = result.dms.data.events;
        messages = messages
          .filter(message => {
            if (message.message_create.target.recipient_id === id ||
                message.message_create.sender_id    === id)
              {
                return message;
              }
          })
          .map(message => {
            return {
              message : message.message_create.message_data.text,
              time : message.created_timestamp,
              them : id === message.message_create.sender_id
            }
          })
          .reverse()


          if (messages.length > 5) {
            messages = messages.slice(-4);
          }

          result.directMessage.messages = messages;
        return result;
      })
      .then(result => {
        /* Get the information of person user is conversing with */
        return Promise.resolve( 
          getUserById(result.directMessage.user.id)
            .then(dmUser => {
              result.directMessage.user = dmUser.user
              return result;
            })
        )
      })
      .then(result => {
        resolve(result.directMessage);
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
    .catch( err => {
      console.log("Promise.all Caught error", err.stack);
      res.render('notFound', {username: "@user"});
    })
}

module.exports = twitData;