const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose  = require('mongoose');
const PORT = process.env.PORT || 8001;
const http = require('http');
const fs = require('fs');
const Screenshot = require('./models/screenshots');
const Transaction = require('./models/transactions');

const app = express();

const MongoUrl = process.env.DEV === "true" ? process.env.MONGODB_URL_DEV : process.env.MONGODB_URL_PROD;

mongoose.connect(MongoUrl).then( () => console.log(`DB connected to ${MongoUrl}`));

app.use(cors('*'));
app.use(morgan("dev"));
app.use(express.json({ limit: "10Kb" }));
app.use(express.urlencoded({ extended: true }));

//Data sanitization against NOSQL query injection and xss
app.use(mongoSanitize(), xss());

//Prevents parameter pollution
app.use(
    hpp({
        whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price",
        ],
    })
);

app.get('/', (req, res) => {
    res.json({success: true});
})

app.use("/api/v1", require('./routes'));
// app.use("/*", (req, res) => {
//     console.log('next');
//     // res.json({success: true});
// } )
app.use("/images", express.static(__dirname + '/screenshots'))

const server = http.createServer(app);

const io = require('socket.io')(server, {cors: {origin: "*"}});

io.on('connection', (socket) => {
    console.log('Socket is connected');
    socket.on('disconnnect', () => console.log(`Client disconnected`))
    socket.on('balanceOfBank', (data) => {
        console.log(data);
        io.emit('balanceOfBankToSite',data);
    });

    socket.on('screenshot', (data) => {
        console.log("screenshot: ", data);
        let date = new Date();
        console.log(date);
        let filename = date + '.png';
        fs.writeFile('./screenshots/'+ filename, Buffer.alloc(data), async(err) => {
            if (err)
                console.log(err);
            else {
                await Screenshot.create({ filename })
                console.log("File written successfully\n");
            }
        });
    });

    socket.on('transaction', async(data) => {
        console.log("transaction: ", data);
        let obj = JSON.parse(data);
        let { bankname, accountname, accountnumber, amount, transactionId } = obj;

        try {
            await Transaction.create({ bankname, accountname, accountnumber, amount, transactionId });
        } catch (err) {
            console.log(err);            
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket is disconnected');
    });
})

global.io = io;

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
