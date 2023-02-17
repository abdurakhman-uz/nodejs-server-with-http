const http = require('http');
const { PassHash, PassCheck } = require('./utils/pass.js');
const {read, write} = require('./utils/read.js');
const { uuid } = require('./utils/uuid.js')

// console.log(PassHash("12345678"));
// console.log(PassCheck("12345678", "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f"));

const server = http.createServer();
const PORT = process.env.PORT || 3001;
const options = {'content-type': "application/json", 'Access-Control-Allow-Origin': "*", 'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE'};


server.on('request', (req, res) => {
    res.writeHead(200, options)
    const url = req.url
    const method = req.method
    id = url.split('/')[2];
    console.log({
        "url": url,
        "method": method
    });

    if (url === '/products') {
        if (method === 'GET')
        {
            let products = read("products")

            res.writeHead(200, options)
            res.end(JSON.stringify(products))
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
                res.writeHead(201, options)
                res.end(JSON.stringify('Product Successfully added'))
    
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
                res.writeHead(404, options)
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
    
               res.writeHead(200, options)
               res.end(JSON.stringify({
                msg: "Product Updated!"
               }))
    
            })
        }

        if (method === 'POST')
        {
            console.log(id = url.split('/')[2]);
            let products =  read("products")

           let foundedProduct = products.find((p) => p.id === id)

           if(!foundedProduct){
            res.writeHead(404, options)
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

           res.writeHead(200, options)
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
            res.writeHead(200, options)
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

            res.writeHead(201, options)
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
                if(!psw){
                    res.writeHead(200, options)
                    return res.end(JSON.stringify({
                        msg: 'Password error!'
                    }))

                }

                let hashUser = PassHash(foundedUser)
                res.writeHead(200, options)
                return res.end(JSON.stringify({
                    msg: 'Success!',
                    token: hashUser
                }))
            }

            res.writeHead(404, options)
            res.end(JSON.stringify({
                msg: 'User not found!'
            }))

        })

    }

    
})

server.listen(PORT, () => {
    console.log(`Server started with port ${PORT}.`);
});
