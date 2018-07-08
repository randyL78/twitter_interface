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

  /* Promise for getting twits on the main timeline and the user's info */
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
    getMainInfo
      .then( result => {
        return Promise.resolve(
        T.get('direct_messages/events/list')
          .then( dms => {
            const directMessage = {
              user : {}
            }

            /* Get details of most recent DM */
            const recepient = dms.data.events[0].message_create.target.recipient_id;
            const sender = dms.data.events[0].message_create.target.sender_id;

            /* find out the id of the person opposite the user */
            directMessage.user.id =  (result.id === recepient)
              ? sender
              : recepient
             
            /* text of most recent DM */
            // console.log(dms.data.events[0].message_create.message_data.text);
            
            return {directMessage, dms}
          })
          .catch( err => {
            console.log('caught error', err.stack)
          })
        )
      })
      .then(result => {
        /* Get the user id of the first direct message
           So that we can use it to filter the other direct messages by */
        return Promise.resolve( 
          getUserById(result.directMessage.user.id)
            .then(dmUser => {
              result.directMessage.user = dmUser.user
              return result;
            })
        )
      })
      .then(result => {
        result.directMessage.messages = [
          {
            message : "Hey There!",
            time : 3,
            them : true
          },
          {
            message : "How are you?",
            time : 4,
            them : false
          }          
        ]
        resolve(result.directMessage);
      })

    // getUserById('1015703179013566465')
    // .then(result => {
    //   directMessage.user = result;
    //   return result;
    // })
    // .then( data => {
    //   directMessage.messages = [
    //     {
    //       message : "Hey There!",
    //       time : 3,
    //       them : true
    //     },
    //     {
    //       message : "How are you?",
    //       time : 4,
    //       them : false
    //     }
    //   ]
    // })
    // .then(resolve(directMessage));
   
  }) 

  /* method entry point for twitData */
  Promise.all([getTweets, getFollowing, getMessages])
    .then( data => {
      console.log(data[2])
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