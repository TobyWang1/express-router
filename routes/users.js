const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import the User model
const { User } = require('../models/index');

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid user ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.post('/users/add', [
    check('name').notEmpty().trim().withMessage('Name is required'),
    check('name').isLength({ min: 5, max: 15 }).withMessage('Name can only have 5-15 characters'),
    check('age').notEmpty().isInt().withMessage('Age is required and it has to be an integer'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.put('/users/update/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid user ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.delete('/users/delete/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
