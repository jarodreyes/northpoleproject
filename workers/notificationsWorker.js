var User = require('../models/User')

var notificationWorkerFactory =  function(){
  return {
    run: function(){
      User.makeCalls();
    }
  };
};

module.exports = notificationWorkerFactory();
