const db = require('../db');

module.exports = {
  getHomePage: async (req, res, next) => {
      try {
        let results = await db.all();
        res.render('index.ejs', {
          title: "Welcome to Seattle Grace", 
          doctors: results
        });
      } catch(err) {
        console.log(err);
        res.sendStatus(500);
      } // query database to get all the players
  },
};