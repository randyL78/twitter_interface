const createData = (req, res, next) => {
  const data = {
    name : "Joe Schmoe",
    timeline : [
      {
        name      : "Joane Spore",
        username  : "@jillspore",
        message   : "It's time I come clean about a few things: The pretzel is my favorite chip.",
        time      : "4h",
        retweets  : 34,
        likes     : 87
      },
      {
        name      : "Mark Spore",
        username  : "@mkspore",
        message   : "My wife is crazy if she thinks a pretzel is a chip.",
        time      : "3h",
        retweets  : 4,
        likes     : 132
      },
    ],
    following : [
      {
        name    : "Mark Spore",
        username: "@mkspore",
        followed: true
      },
      {
        name    : "Jill Spore",
        username: "@jillspore",
        followed: true
      },
      {
        name    : "Narwell Seaford",
        username: "@oceanswimming",
        followed: false
      },
      {
        name    : "Sandy Fisher",
        username: "@sandyfisher",
        followed: true
      },
      {
        name    : "Lexi Layne",
        username: "@lexiloulayne",
        followed: true
      },
    ],
    directMessage : { 
      name : "Sandy Fisher",
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
        },
        {
          message : "Glad to hear it",
          time    : 2,
          them    : true
        },
        {
          message : "Thanks",
          time    : 2,
          them    : false
        },
        {
          message : "You're welcome!",
          time    : 1,
          them    : true
        },        
      ]
    }
  };
  req.data = data
  next();
}

module.exports = createData;