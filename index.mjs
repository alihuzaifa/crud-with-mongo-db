import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
const mongoDbURI =
  process.env.mongoDbURI ||
  "mongodb+srv://huzaifa:huzaifa@cluster0.sveuofl.mongodb.net/?retryWrites=true&w=majority";

const port = process.env.PORT || 4000;
let TODO = [];

let productSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  createdOn: { type: String, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

app.post("/todo", (req, res) => {
  const body = req.body;
  productModel.create(
    {
      todo: body.todo,
    },
    (err, saved) => {
      if (err) {
        res.send({
          message: "Server running out",
        });
        res.status(500);
      } else {
        res.status(200).send({
          message: "Product added successfully",
        });
      }
    }
  );
});

app.get("/todos", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res
        .send({
          message: "Got all todos successsfully",
          data: data,
        })
        .status(200);
    } else {
      res
        .send({
          message: "Server running out",
        })
        .status(500);
    }
  });
});

app.delete("/todo/:id", (req, res) => {
  const id = req.params.id;

  productModel.deleteOne({ id: id }, (err, saved) => {
    if (!err) {
      res
        .send({
          message: "Todo deleted successfully",
        })
        .status(200);
    } else {
      res.send({
        message: "Server is running out",
      });
    }
  });
});

app.delete("/todos", (req, res) => {
  productModel.deleteMany({}, (err, saved) => {
    if (!err) {
      res
        .send({
          message: "All data has been deleted",
        })
        .status(200);
    } else {
      res
        .send({
          message: "Server is running out",
        })
        .status(500);
    }
  });
  // TODO = [];
  // res
  //   .send({
  //     message: "Deleted  all data successfully",
  //     data: TODO,
  //   })
  //   .status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect(mongoDbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1); //this will stop the running node js server too .
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
