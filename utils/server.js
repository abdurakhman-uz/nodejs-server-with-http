// const http = require('http');
// const {read, write} = require('./utils/read.js');
// const { uuid } = require('./utils/uuid.js')

// const server = http.createServer();
// const PORT = process.env.PORT || 3001;
// const options = {'content-type': "application/json", 'Access-Control-Allow-Origin': "*"};


// server.on('request', (req, res) => {
//     if (req.method === 'GET' && req.url === '/cars') {

//         let cars = read("cars")

//         res.writeHead(200, options)
//         res.end(JSON.stringify(cars))
//     }

//     if (req.method === 'POST' && req.url === '/create_car') {
//         req.on("data", chunk => {
//             let data = JSON.parse(chunk);

//             let cars = read("cars")

//             cars.push({
//                 id: uuid(),
//                 ...data
//             })
//             write("cars", cars)
//             res.writeHead(201, options)
//             res.end(JSON.stringify('Car Successfully added'))

//         })
//     }



//     if (req.method === 'GET' && req.url === '/fruits') {

//         let fruits = read("fruits")

//         res.writeHead(200, options)
//         res.end(JSON.stringify(fruits))
//     }

//     if (req.method === 'POST' && req.url === '/create_fruit') {
//         req.on("data", chunk => {
//             let data = JSON.parse(chunk);

//             let fruits = read("fruits")

//             fruits.push({
//                 id: uuid(),
//                 ...data
//             })
//             write("fruits", fruits)
//             res.writeHead(201, options)
//             res.end(JSON.stringify('Fruit Successfully added'))

//         })
//     }



//     if (req.method === 'GET' && req.url === '/animals') {

//         let animals = read("animals")

//         res.writeHead(200, options)
//         res.end(JSON.stringify(animals))
//     }

//     if (req.method === 'POST' && req.url === '/create_animal') {
//         req.on("data", chunk => {
//             let data = JSON.parse(chunk);

//             let animals = read("animals")

//             animals.push({
//                 id: uuid(),
//                 ...data
//             })
//             write("animals", animals)
//             res.writeHead(201, options)
//             res.end(JSON.stringify('Animal Successfully added'))

//         })
//     }
// })

// server.listen(PORT, () => {
//     console.log(`Server started with port ${PORT}.`);
// });


