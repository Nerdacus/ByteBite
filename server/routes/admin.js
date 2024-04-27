const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// imports our encryption for passwords, (were using bcrypt)
const bcrypt = require("bcrypt");

// token for authentication, check the .env file if you want to see the secret
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/*
 * Middleware for checking is a user is logged in
 */
const authMiddleware = (req, res, next) => {
  // get the JWT (JSON Web Token) from cookies
  const token = req.cookies.token;

  if (!token) {
    // is token is not found the user is unauthorized
    return res.status(401).json({ message: "Who are you? What are you doing here?" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, jwtSecret);
    // storing token
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // invalid token = unauthorized
    res.status(401).json({ message: "Who are you? What are you doing here?" });
  }
};

/**
 * GET /
 * Admin - Login Page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Byte-Bite Blog",
    };

    // render that thang
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Looking for username in database
    const user = await User.findOne({ username });

    if (!user) {
      // If user not found, return unauthorized
      return res.status(401).json({ message: "Who are you? What are you doing here?" });
    }

    // are the passwords the same????
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // theyre not?!?!?! oh no
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Who are you? What are you doing here?" });
    }

    // set the cookie with the JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    // rendering the page
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// all three of the routes below are the same thing pretty much,
// Just different ways to use the new Post

/**
 * GET /
 * Admin - Create New Post
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - More Create New Post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Edit Post
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT /
 * Admin - More edit post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// router.post('/admin', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if(req.body.username === 'admin' && req.body.password === 'password') {
//       res.send('You are logged in.')
//     } else {
//       res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * POST /
 * Admin - Register a new account
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // IMPORTANT, hashes the password!!
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "Account Created!!", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "You already have an account goofball" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Logout
 */
router.get("/logout", (req, res) => {
  //clear the JWT cookie
  res.clearCookie("token");
  res.json({ message: "Logout successful." });
  res.redirect("/");
});

module.exports = router;
