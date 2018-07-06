const createData = (req, res, next) => {
  const data = {
    name : "Randy Layne",
    timeline : [
      {
        name      : "Joane Spore",
        username  : "@jillspore",
        message   : "It's time I come clean about a few things: The pretzel is my favorite chip.",
        time      : "4h",
        retweets  : 34,
        likes     : 87
      }
    ]
  };
  req.data = data
  next();
}

module.exports = createData;