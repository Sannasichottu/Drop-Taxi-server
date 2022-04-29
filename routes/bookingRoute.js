const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carsModel");
const cors = require("cors");
router.use(cors());
const shortid = require("shortid");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: "rzp_test_wt6S48PF3wQ702",
  key_secret: "JO8zCupfZZMyhnTdo8ErPF9Z",
});

router.post("/bookcar", async (req, res) => {
  // console.log(req.body);
  var options = {
    amount: req.body.totalAmount * 100,
    currency: "INR",
    receipt: shortid.generate(),
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);

    if (response) {
      // req.body.transactionId = response.razorpay_payment_id;
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      // console.log(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
