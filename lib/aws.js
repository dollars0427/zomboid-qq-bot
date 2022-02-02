const querystring = require('querystring');

const Aws = {
  checkStatus(request, config){
    const url = config['checkStatusAPI'];
    return new Promise((resolve, reject) => {
      request.get(url,
      function (err, response, body) {
        if(err){
          reject(err);
          return;
        }
        switch(response.statusCode){
          case 200:
          const datas = JSON.parse(body);
          const status = datas['Name'];
          resolve(status);
          break;

          default:
          const error = {
            'status': response.statusCode,
          };
          reject(error);
        }
      });
    });
  },
  startServer(request, config){
    const url = config['startEC2API'];
    return new Promise((resolve, reject) => {
      request.get(url,
      function (err, response, body) {
        if(err){
          reject(err);
          return;
        }
        switch(response.statusCode){
          case 200:
          const result = 'OK';
          resolve(result);
          break;

          default:
          const error = {
            'status': response.statusCode,
          };
          reject(error);
        }
      });
    });
  },
  stopServer(request, config){
    const url = config['stopEC2API'];
    return new Promise((resolve, reject) => {
      request.get(url,
      function (err, response, body) {
        if(err){
          reject(err);
          return;
        }
        switch(response.statusCode){
          case 200:
          const result = 'OK';
          resolve(result);
          break;

          default:
          const error = {
            'status': response.statusCode,
          };
          reject(error);
        }
      });
    });
  },
}
module.exports = Aws;
