const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const Document = require("./models/Document");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let currentContent = "";

io.on("connection", (socket) => {

  console.log("User Connected");

  socket.emit("load-document", currentContent);

  socket.on("send-changes", async (data) => {

    currentContent = data;

    io.emit("receive-changes", data);

    try {

      let doc = await Document.findOne();

      if (!doc) {
        doc = new Document({ content: data });
      } else {
        doc.content = data;
      }

      await doc.save();

    } catch (error) {
      console.log(error);
    }

  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
