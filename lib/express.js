const url = require('url');
const querystring = require('querystring');

const headers = {
    'Content-Type': "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
    "Access-Control-Max-Age": 2592000,
    // 30 days
    /** add other headers as per requirement */
};

class Express {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        if (this.req.method != 'GET') {
            this.req.body = new Promise((resolve, reject) => {
                // let str = '';
                // req.on('data', (chunk) => (str += chunk));
                // req.on('end', () => {
                //     resolve(JSON.parse(str));
                // });

                req.on("data", chunk => {
                  let data = JSON.parse(chunk);
                  resolve(data)
                });
                
            });
        }

        this.res.json = (data) => {
            this.res.writeHead(200, headers)
            return this.res.end(JSON.stringify(data))
        }
    }

    get(route, callback) {
        let {pathname, query} = url.parse(this.req.url);
        this.req.query = querystring.parse(query);
        if (pathname == route && this.req.method == 'GET') {
            callback(this.req, this.res);
        }
    }

    post(route, callback) {
        if (this.req.url == route && this.req.method == 'POST') {
            callback(this.req, this.res);
        }
    }

    delete(route, callback) {
        if (this.req.url == route && this.req.method == 'DELETE') {
            callback(this.req, this.res);
        }
    }
    put(route, callback) {
        if (this.req.url == route && this.req.method == 'PUT') {
            callback(this.req, this.res);
        }
    }
    options(route, callback) {
        if (this.req.url == route && this.req.method == 'OPTIONS') {
            callback(this.req, this.res)
        }
    }
}

module.exports = Express;
