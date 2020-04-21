const router = require('express').Router();

let Customer = require('../models/customer.model');

router.route('/').get((req, res) => {
    Customer.find()
        .then(customers => res.json(customers))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    const new_customer = new Customer({
        username,
        email,
        password,
        phone,
    });

    new_customer.save()
        .then(() => res.redirect('/signupSuccess.html'))
        .catch(err => res.redirect('/signupFail.html'));
});

module.exports = router;