const createData = (req, res, next) => {
  const data = {
    following : [
      {
        name    : "Mark Spore",
        username: "mkspore",
        followed: true
      },
      {
        name    : "Jill Spore",
        username: "jillspore",
        followed: true
      },
      {
        name    : "Narwell Seaford",
        username: "oceanswimming",
        followed: false
      },
      {
        name    : "Sandy Fisher",
        username: "sandyfisher",
        followed: true
      },
      {
        name    : "Lexi Layne",
        username: "lexiloulayne",
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