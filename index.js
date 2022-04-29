const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const dbconnection = require("./db");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
dbconnection();

app.use("/api/cars/", require("./routes/carsRoute"));
app.use("/api/users/", require("./routes/usersRoute"));
app.use("/api/bookings/", require("./routes/bookingsRoute"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.post("/paymentverification", (req, res) => {
//   const SECRET = "12345678";
//   // console.log(req.body);
//   const crypto = require("crypto");
//   var shasum = crypto.createHmac("sha256", SECRET);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");
//   // console.log(digest, req.headers("x-razorpay-signature"));
//   if (digest === req.headers("x-razorpay-signature")) {
//     console.log("request is legit");
//   } else {
//   }
//   res.json({ status: "ok" });
// });
app.listen(PORT, () => console.log(`server started in ${PORT}`));
