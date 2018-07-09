const Twit = require('twit');
const config = require('./config');

/* Interface for comminicating with twitter API */
const T = new Twit({
  consumer_key        : config.consumer_key,
  consumer_secret     : config.consumer_secret,
  access_token        : config.access_token,
  access_token_secret : config.access_token_secret
})

const getData = (req, res, next) => {

  /* Time formatter for the Direct Message section */
  const dmTime = time => {
    let secondsAgo = Math.floor((Date.now() - time)/1000 );
    let minutesAgo = Math.floor(secondsAgo/60);
    let hoursAgo = Math.floor(minutesAgo/60);
    let daysAgo = Math.floor(hoursAgo/24);
    if (secondsAgo < 60) 
      return secondsAgo + ` second${secondsAgo != 1 ? 's' : ""} ago`;
    else if (minutesAgo < 60)
      return minutesAgo + ` minute${minutesAgo != 1 ? 's' : ""} ago`;
    else if (hoursAgo < 24) 
      return hoursAgo + ` hour${hoursAgo != 1 ? 's' : ""} ago`;
    else 
      return daysAgo + ` day${daysAgo != 1 ? 's' : ""} ago`;
  }

  /* Time formatter for the Timeline section */
  const tlTime = time => {
    let secondsAgo = Math.floor((Date.now() - Date.parse(time))/1000 );
    let minutesAgo = Math.floor(secondsAgo/60);
    let hoursAgo = Math.floor(minutesAgo/60);
    let daysAgo = Math.floor(hoursAgo/24);
    if (secondsAgo < 60) 
      return secondsAgo + `s`;
    else if (minutesAgo < 60)
      return minutesAgo + `m`;
    else if (hoursAgo < 24) 
      return hoursAgo + `h`;
    else 
      return daysAgo + `d`;
    return dmTime(time);
  }




  /* Post a tweet to twitter,
     Use Promise to comfirm submission so page can update with new tweet */
  const postTweet = msg => {new Promise( (resolve, reject) => {
    T.post('statuses/update', {status: msg}, (err, data, response) => {
      console.log(data);
    })
  })}

  /* Promise for getting tweets on the main timeline and the user's info */
  const getTweets = new Promise( (resolve, reject) => {
    T.get('statuses/user_timeline', {count: 5})
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
            time    : tlTime(tweet.created_at),
            retweets: tweet.retweet_count,
            likes   : tweet.favorite_count
          }) 
        });
        resolve(data);
      })
      .catch( err => {
        resolve();
        console.log("Can't connect to timeline")
      })
    });

  /* Promise for getting main user's information */
  const getMainInfo = new Promise( (resolve, reject) => {
    T.get('account/verify_credentials', { skip_status: true })
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
      .catch( err => {  
        console.log("Can't connect to user api")
        resolve();
      })
  })

  /* Promise for getting people user is following */
  const getFollowing = new Promise( (resolve, reject) => {
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
      .catch(err => {
        console.log("Can't connect to friends api")
        resolve();
      })
  })

  /* Promise for getting user information from an id */
  const getUserById = user_id => new Promise( (resolve, reject) => {
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
      .catch( err => {
       console.log("Can't connect to user api")
       resolve();
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
            console.log("Can't connect to Direct Message api")
            resolve();
          })
        )
      })
      .then(result => {
        const id = result.directMessage.user.id
        let messages = result.dms.data.events;
        messages = messages
          /* Return only the elments in the array that contain
             The person user is conversing with, either as a sender or reciever */
          .filter(message => {
            if (message.message_create.target.recipient_id === id ||
                message.message_create.sender_id  === id)
              {
                return message;
              }
          })
          /* Reformat the message array to be used by Pug */
          .map(message => {
            return {
              message : message.message_create.message_data.text,
              time : dmTime(message.created_timestamp),
              them : id === message.message_create.sender_id
            }
          })
          /* Put the newest DMs last */
          .reverse()

          /* If there are more than 5DMs in specific conversation, 
             Get only the 5 most recent */
          if (messages.length > 5) {
            messages = messages.slice(-5);
          }

          result.directMessage.messages = messages;
        return result;
      })
      .then(result => {
        /* Get the information about person user is conversing with */
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
      .catch(err => {
        resolve();
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
      console.log("Promise.all Caught error", err.message);
      next();
    })
}
 /* Post a tweet to twitter,
Use Promise to comfirm submission so page can update with new tweet */
const postTweet = msg => {
  return T.post('statuses/update', {status: msg})
    .catch(err => {
      console.log("Unable to post tweet", err);
      return {fail: true}
    })
    .then(result => {
      let data = {}
      if (result.fail) {
        data = {fail: true}
      } else {
        data = {
          fail    : false,
          message : result.data.text,
          avatar  : result.data.user.profile_image_url,
          name    : result.data.user.name,
          username: result.data.user.screen_name
        }
      }
      return(data);
    })
}

module.exports = {getData, postTweet};