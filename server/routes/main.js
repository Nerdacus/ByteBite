const express = require('express');
const router = express.Router();


//Routes
router.get('', (req, res) => {
    const locals = {
        title: "415 Term Project",
        description: "CMPS 415 Term Project"
    }

    res.render('index', { locals} );
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});


module.exports = router;