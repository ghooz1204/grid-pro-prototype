const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
// Node.js module

const HOST = '127.0.0.1';
const METHOD = 'POST';
const FOLDER_PATH = (appName) =>
    'Windows_NT' === os.type()
        ? path.join('C:/Users/USER/AppData/Local/InvaizApp/Port/' + appName + '/cep_port.dll')
        : path.join(
              '/Users/parkcheolhyun/.local/share/Invaiz Studio/Port/' +
                  appName +
                  '/cep_port.dll',
          );
// 상수 정의

const getPortNumber = (appName) =>
    parseInt(fs.readFileSync(FOLDER_PATH(appName)).toString());

const requestPromise = (script, option, appName) =>
    new Promise((resolve, reject) => {
        function readJSONResponse(response, err) {
            let responseData = '';
            response.on('data', function (chunk) {
                responseData += chunk;
            });
            response.on('end', function () {
                resolve(responseData);
            });
        }
        const req = http.request(option, readJSONResponse);
        req.on('error', function (err) {
            reject(err);
        });
        req.write(script);
        req.end();
    });

module.exports = {
    sendCepScript: async function (
        messageType,
        actionType,
        typeKey,
        payload,
        appName,
    ) {
        const portNumber = getPortNumber(appName);
        const postData = {
            messageType,
            actionType,
            typeKey,
            payload,
        };
        const SCRIPT = JSON.stringify(postData);
        const OPTIONS = {
            host: HOST,
            port: portNumber,
            method: METHOD,
        };
        try {
            const res = await requestPromise(SCRIPT, OPTIONS, appName);
            return res;
        } catch (e) {
            console.log(e);
            return e;
        }
    },
};
