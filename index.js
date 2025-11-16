const fs = require("fs");
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config({
   path: path.resolve(__dirname, "credentials/.env"),
});
app.use(express.static(path.join(__dirname, 'public')));
const { MongoClient, ServerApiVersion } = require("mongodb");

let limitedNum = 0;
let basicNum = 0;
let unimprovedNum = 0;
let surfaceNum = 0;
const databaseName = "technica_db";
const collectionName = "water_data";
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "pages"));

if (process.argv.length !== 3){
    process.stdout.write("Usage index.js PORT_NUMBER");
    process.exit(1);
}
const portNumber = process.argv[2];
app.listen(portNumber); 
console.log(`Web server starting and running at http://localhost:${portNumber}`);
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => { 
    let portLink = `http://localhost:${portNumber}/`;
    console.log(portLink);
    let variables = {
        portNumberLink:portLink
    };
    response.render("index", variables);
});

app.get("/visualizer", (request, response) =>{
    let portLink = `http://localhost:${portNumber}/`;
    let variables = {
        portNumberLink:portLink
    };
    response.render("visualizer", variables);
});

app.get("/countries", (request, response) => {
    (async () =>{
        try{
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);
            const countries = await collection.distinct("country");
            //console.log(countries);
            response.json(countries.sort());
        }catch (e) {
            console.error(e);
            request.json([]);
        } finally {
            client.close();
        }
    }
    )();
});

app.get("/country-data/:country", (request, response)=>{
    const countryName = request.params.country;
    console.log(`requested country: ${countryName}`);

    (async ()=>{
        try{
            await client.connect();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);
        let countryData = await collection.findOne({country: countryName});
        if (!countryData){
            console.log("ermmmmmmm theres no country like that");
            return res.status(404).json({ error: "Country not found" });
        } 
        response.json(countryData);
        }  catch (e) {
            console.error(e);
        } finally {
            client.close();
        }
        
    })();

});

console.log("Stop to shut down the server: ");
process.stdin.setEncoding("utf8");
process.stdin.on('readable', () =>{
    const dataInput = process.stdin.read();
    if (dataInput !== null){
        const command = dataInput.trim();
    }
    if (command === "stop"){
        process.stdout.write("Shutting down the server");
        process.exit(0);
    }else{
        process.stdout.write(`Invalid command: ${command}\n`);
        console.log("Stop to shut down the server: ");
    } 
    process.stdin.resume();

});