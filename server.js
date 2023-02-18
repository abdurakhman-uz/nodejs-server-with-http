const http = require('http');
const { PassHash, PassCheck, hashUser } = require('./utils/pass.js');
const {read, write} = require('./utils/read.js');
const { uuid } = require('./utils/uuid.js')

const server = http.createServer();
const PORT = process.env.PORT || 3001;
const headers = {
    'Content-Type': "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  };

server.on('request', (req, res) => {
    const url = req.url
    const method = req.method
    id = url.split('/')[2];
    console.log({
        "url": url,
        "method": method
    });

    if (method === 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
        return;
    }

    if (url === '/products') {
        if (method === 'GET')
        {
            let products = read("products")

            res.writeHead(200, headers)
            res.end(JSON.stringify({msg: products}))
        }

        if (method === 'POST')
        {
            req.on("data", chunk => {
                let data = JSON.parse(chunk);
                
                let products = read("products")
    
                products.push({
                    id: uuid(),
                    ...data
                })
                write("products", products)
                res.writeHead(201, headers)
                res.end(JSON.stringify({msg: "Product Successfully added"}))
    
            })
        }
    }

    if (url === `/products/${id}`) {

        if (method === 'PUT')
        {
            req.on("data", chunk => {
                let newProduct = JSON.parse(chunk)
                let { name, desc, price } = newProduct
    
               let products =  read("products")
    
               let foundedProduct = products.find((p) => p.id === id)
    
               if(!foundedProduct){
                res.writeHead(404, headers)
                return res.end(JSON.stringify({
                    msg: 'Product not found!'
                }))
               }
    
    
               products.forEach((product, idx) => {
                if(product.id === id){
                    product.name = name ? name : product.title
                    product.desc = desc ? desc : product.desc
                    product.price = price ? price : product.price
                }
               })
    
               write("products", products)
    
               res.writeHead(200, headers)
               res.end(JSON.stringify({
                msg: "Product Updated!"
               }))
    
            })
        }

        if (method === 'DELETE')
        {
            console.log(id = url.split('/')[2]);
            let products =  read("products")

           let foundedProduct = products.find((p) => p.id === id)

           if(!foundedProduct){
            res.writeHead(404, headers)
            return res.end(JSON.stringify({
                msg: 'Product not found!'
            }))
           }

           products.forEach((product, idx) => {
            if(product.id === id){
                products.splice(idx, 1)
            }
           })

           write("products", products)

           res.writeHead(200, headers)
           res.end(JSON.stringify({
            msg: "Product Deleted!"
           }))

        }
    }

    if(url === '/auth/register'){
        req.on("data", chunk => {
            let { email, username, password, gender } = JSON.parse(chunk)

           let psw =  PassHash(password);

           let users = read("users")

           let foundedUser = users.find(user => user.email == email)

           if(foundedUser){
            res.writeHead(200, headers)
            return  res.end(JSON.stringify({
                msg: 'Email already exists!!!'
            }))
           }
           users.push({
            id: uuid(),
            email,
            username,
            gender,
            password: psw,
            })

            write("users", users)

            res.writeHead(201, headers)
            res.end(JSON.stringify({
                msg: 'User registrated!'
            }))
        })
    }

    if(url === '/auth/login'){
        req.on("data", chunk => {
            let { email, password } = JSON.parse(chunk)

            let foundedUser = read("users").find(user => user.email === email)
            if(foundedUser){
                let psw = PassCheck(password, foundedUser.password)
                if(psw){
                    // let userToken = hashUser(`${foundedUser}`)
                    let userToken = foundedUser.password
                    res.writeHead(200, headers)
                    return res.end(JSON.stringify({
                        msg: 'Success!',
                        token: userToken
                    }))
                }
                
                res.writeHead(200, headers)
                return res.end(JSON.stringify({
                    msg: 'Password error!'
                }))
            }

            res.writeHead(404, options)
            res.end(JSON.stringify({
                msg: 'User not found!'
            }))

        })

    }

    if(url === '/auth/check'){
        req.on("data", chunk => {
            let { token } = JSON.parse(chunk)

            let foundedUser = read("users").find(user => user.password === token)
            if(foundedUser){
                // // let userToken = hashUser(`${foundedUser}`)
                let userToken = foundedUser.password
                res.writeHead(200, headers)
                return res.end(JSON.stringify({
                    msg: true,
                    token: userToken
                }))
            }
          
            res.writeHead(200, headers)
            res.end(JSON.stringify({
                msg: false
            }))
        })
    }
})

server.listen(PORT, () => {
    console.log(`Server started with port ${PORT}.`);
});
