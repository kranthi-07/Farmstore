require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();
app.use(express.json());

// ✅ CORS setup

app.use(
  cors({
    origin: "https://farmstore-1.onrender.com", // your deployed frontend domain
    credentials: true, // allows sending cookies
  })
);


// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Schema
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  cart: [
    {
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

// ✅ Sessions
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // ✅ required on HTTPS (your Render domain is HTTPS)
      sameSite: "none", // ✅ allow cross-site cookies
      maxAge: 1000 * 60 * 60 * 24 * 7 // (optional) 7 days
    },
  })
);

app.set("trust proxy", 1);


// 🔹 Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, mobile, password } = req.body;
    const newUser = new User({ name, mobile, password });
    await newUser.save();
    res.json({ message: "User Registered Successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error saving user ❌", error: err });
  }
});

// 🔹 Signin
app.post("/signin", async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile, password });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials ❌" });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
    };

    return res.json({ success: true, message: "Login Successful ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
});

// 🔹 Get logged in user
app.get("/getUser", (req, res) => {
  console.log("SESSION CHECK:", req.session); // ✅ debug
  if (req.session.user) {
    res.json({
      loggedIn: true,
      name: req.session.user.name,
      mobile: req.session.user.mobile,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// 🔹 Add item to cart
app.post("/cart/add", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const { name, price, quantity, image } = req.body;

    await User.updateOne(
      { _id: req.session.user.id },
      { $push: { cart: { name, price, quantity, image } } }
    );

    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error saving cart", error: err });
  }
});


// 🔹 Get user cart
app.get("/cart", async (req, res) => {
  if (!req.session.user) {
    return res.json({ success: false, message: "Not logged in" });
  }

  const user = await User.findById(req.session.user.id);
  res.json({ success: true, cart: user.cart || [] });
});

// 🔹 Update quantity in cart
app.post("/cart/update", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const { name, change } = req.body;
    const user = await User.findById(req.session.user.id);
    if (!user) return res.json({ success: false, message: "User not found" });

    let item = user.cart.find((i) => i.name === name);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        user.cart = user.cart.filter((i) => i.name !== name);
      }
    }

    await user.save();
    res.json({ success: true, message: "Quantity updated" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating cart", error: err });
  }
});

// 🔹 Remove item
app.post("/cart/remove", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const { name } = req.body;
    await User.updateOne(
      { _id: req.session.user.id },
      { $pull: { cart: { name: name } } }
    );

    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error removing item", error: err });
  }
});





// 🔹 Checkout total
app.get("/checkout-total", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, total: 0, message: "Not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user || user.cart.length === 0) {
      return res.json({ success: false, total: 0 });
    }

    const total = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({ success: true, total });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error calculating total", error: err });
  }
});

// 🔹 Confirm checkout (optional order creation)
app.post("/checkout/confirm", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ success: false, message: "Not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user || user.cart.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    // 🔹 later: save as an Order collection
    user.cart = []; // clear cart after checkout
    await user.save();

    res.json({ success: true, message: "Order placed successfully ✅" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Checkout failed", error: err });
  }
});

// 🔹 Profile
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, message: "Not logged in" });
  }
});

// 🔹 Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // replace with your actual session cookie name
    res.json({ success: true, message: "Logged out" });
  });
});



app.get("/api/check-session", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});


// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "signup.html"));
});

// ✅ Start server
app.listen(5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);
