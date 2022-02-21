const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = 5000;
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wzbra.mongodb.net/${process.env.DB_NAME}:${process.env.DB_PASS}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const ProductCollection = client.db("emajohn").collection("emaProducts");
  const OrderCollection = client.db("emajohn").collection("emaOrder");

  app.post("/addProducts", (req, res) => {
    const pro = req.body;
    ProductCollection.insertOne(pro).then((result) => {
      console.log(result.acknowledged);
      res.send(result.acknowledged);
    });
  });

  app.get("/readProduct", (req, res) => {
    ProductCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/singleProduct/:key", (req, res) => {
    ProductCollection.find({ key: req.params.key }).toArray(
      (err, documents) => {
        res.send(documents[0]);
      }
    );
  });

  app.post("/singlePost", (req, res) => {
    const product = req.body;
    ProductCollection.find({ key: { $in: product } }).toArray(
      (err, documents) => {
        res.send(documents);
      }
    );
  });

  app.post("/orderProducts", (req, res) => {
    const order = req.body;
    OrderCollection.insertOne(order).then((result) => {
      console.log(result.acknowledged);
      res.send(result.acknowledged);
    });
  });

  console.log("Database Connected!!!");
});

app.get("/", (req, res) => {
  res.send("Welcome To Our Server!!!");
});

app.listen(process.env.PORT || port);
