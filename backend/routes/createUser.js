const express = require('express');

const Users = require('../mongodb/models/Users.js');

const app = express();



app.route('/')
    .post(async (req, res) => {
        try {
            const {userid, password} = req.body
            // const newUser = await Users.create({
            //     userid,
            //     password
            // })
            res.redirect('/')
        } catch (error) {
            res.status(500)
        }
    })



