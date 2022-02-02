const querystring = require('querystring');
const QQ = {
  /**
  * Read content and return command type
  * @param {String} Content of QQ Message.
  * @returns {String} Command Type of Message.
  *
  */
  readCommand(content){
    const helpRegax = /(^\/help$)/;
    const statusRegax = /(^\/status$)/;
    const startRegax = /(^\/start$)/;
    const stopRegax = /(^\/stop$)/;
    const rollRegax = /^(\/roll) ([0-9]+d[0-9]+)/;
    const chooseRegax = /^(\/choose) ([\s\S]*)$/;

    if(content){
      if(content.match(helpRegax)){
        return 'help';
      }
      if(content.match(rollRegax)){
        return 'roll';
      }
      if(content.match(startRegax)){
        return 'start';
      }
      if(content.match(stopRegax)){
        return 'stop';
      }
      if(content.match(statusRegax)){
        return 'status';
      }
      if(content.match(chooseRegax)){
        return 'choose';
      }
    }
  },
  sendMessage(request, senderId, type, content){
    let apiUrl = 'http://ffneverland.site:5780';
    const body = {
      message: content,
    };
    switch(type){
      case 'private':
      apiUrl += '/send_private_msg';
      body.user_id = senderId;
      break;
      default:
      apiUrl += '/send_group_msg';
      body.group_id = senderId;
      break;
    }
    return new Promise((resolve, reject) => {
      const options = {
        uri: apiUrl,
        method: 'POST',
        json: body
      };
      request(options,
        function (err, response, body) {
          if(err){
            console.log(err);
            return;
          }
          switch(response.statusCode){
            case 200:
            const result = body;
            resolve(result);
            break;
          }
        });
      });
    },
  };
  module.exports = QQ;
