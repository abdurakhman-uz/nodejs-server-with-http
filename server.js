const http = require('http');
const Express = require('./lib/express')
const {read, write} = require('./utils/read.js');
const {uuid} = require('./utils/uuid.js')
const {PassHash, PassCheck, hashUser} = require('./utils/pass.js');

const server = http.createServer();
const PORT = process.env.PORT || 3001;
const headers = {
    'Content-Type': "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
    "Access-Control-Max-Age": 2592000,
    // 30 days
    /** add other headers as per requirement */
};

server.on('request', (req, res) => {
    const app = new Express(req, res)
    id = req.url.split('/')[2];
    // const url = req.url
    // id = url.split('/')[2];
    // const method = req.method
    // console.log({"url": url, "method": method});


    app.options('*', (req, res) => {
        res.json()
        return
    })

    app.get('/products', (req, res) => {
        let products = read('products')
        res.json({msg: products})
    })

    app.post('/products', async (req, res) => {
        let products = read("products")
        let data = await(req.body)
        products.push({
            id: uuid(),
            ... data
        })
        write("products", products)
        res.json({msg: "Product Successfully added"})
    })

    app.put(`/product/${id}`, async (req, res) => {
        let {name, desc, price} = await(req.body)
        let products = read("products")
        let foundedProduct = products.find((p) => p.id === id)

        if (! foundedProduct) {
            res.writeHead(404, headers)
            return res.end(JSON.stringify({msg: 'Product not found!'}))
        }


        products.forEach((product, idx) => {
            if (product.id === id) {
                product.name = name ? name : product.name
                product.desc = desc ? desc : product.desc
                product.price = price ? price : product.price
            }
        })
        write("products", products)
        res.json({msg: "Product Updated!"})
    })

    app.delete(`/product/${id}`, async (req, res) => {
        let products = read("products")
        let foundedProduct = products.find((p) => p.id === id)

        if (! foundedProduct) {
            return res.json({msg: 'Product not found!'})
        }

        products.forEach((product, idx) => {
            if (product.id === id) {
                products.splice(idx, 1)
            }
        })

        write("products", products)
        res.json({msg: "Product Deleted!"})
    })

    app.post('/auth/login', async (req, res) => {
        let {email, password} = await(req.body)
        let foundedUser = read("users").find(user => user.email === email)
        if (foundedUser) {
            let psw = PassCheck(password, foundedUser.password)
            if (psw) { // let userToken = hashUser(`${foundedUser}`)
                let userToken = foundedUser.password
                return res.json({msg: 'Success!', token: userToken})
            }

            return res.json({msg: 'Password error!'})
        }

        res.writeHead(404, headers)
        res.json({msg: 'User not found!'})
    })

    app.post('/auth/register', async (req, res) => {
        let {email, username, password, gender} = await(req.body)
        let psw = PassHash(password);

        let users = read("users")

        let foundedUser = users.find(user => user.email == email)

        if (foundedUser) {
            return res.json({msg: 'Email already exists!!!'})
        }
        users.push({
            id: uuid(),
            email,
            username,
            gender,
            password: psw
        })

        write("users", users)

        res.json({msg: 'User successfully registrated!'})
    })

    app.post('/auth/check', async (req, res) => {
        let {token} = await(req.body)
        let foundedUser = read("users").find(user => user.password === token)
        if (foundedUser) { // // let userToken = hashUser(`${foundedUser}`)
            let userToken = foundedUser.password
            return res.json({msg: true, token: userToken})
        }

        res.json({msg: false})
    })

})

server.listen(PORT, () => {
    console.log(`Server started with port ${PORT}.`);
});
