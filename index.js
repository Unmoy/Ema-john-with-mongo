const express = require("express");
const app = express();
var cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const port = 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nexck.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client.db("AmazonStore").collection("products");
  const ordersCollection = client.db("AmazonStore").collection("orders");

  app.post("/addproducts", (req, res) => {
    const product = req.body;
    productsCollection.insertMany(product).then((result) => {
      res.send(result.insertedCount);
    });
  });
  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.post("/productByKeys", (req, res) => {
    const productByKeys = req.body;
    productsCollection
      .find({ key: { $in: productByKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
