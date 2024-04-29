const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//Routes

/**
 * GET /
 * HOME
 */

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    // only 10 blog posts per page.
    let perPage = 10;
    // gets the page query, ex: localhost:5000?page=2, or defaults to 1.
    let page = req.query.page || 1;

    // controls posts and sorts results.
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    // cool math function that rounds up and returns the smallest interger >= our count.
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    // renders the data :)
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// Code below does not use "pagination", for our project in 415 leave this commented

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
  try {
    // requesting the id, look into slugs and their use with SEO if interested.
    let slug = req.params.id;

    // getting posts by id
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Byte-Bite Blog created with NodeJs, Express & MongoDb.",
    };

    // render that joint
    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /addComment/:id
 * Add comment to post
 */
router.post("/addComment/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Add the comment to the comments array
    post.comments.push(comment);

    // Save the updated post
    await post.save();

    // Redirect back to the post page after adding the comment
    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

/**
 * POST /deleteComment/:id
 * Delete comment from post
 */
router.post("/deleteComment/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { commentIndex } = req.body;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Remove the comment from the comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    // Redirect back to the post page after deleting the comment
    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment');
  }
});

/**
 * POST /
 * Post - searchTerm
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    // gets the search term from the user input
    let searchTerm = req.body.searchTerm;
    // removes special characters from search.
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [{ title: { $regex: new RegExp(searchNoSpecialChar, "i") } }, { body: { $regex: new RegExp(searchNoSpecialChar, "i") } }],
    });

    // i said render that bizz
    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
