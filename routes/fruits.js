const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Import the Fruit model
const { Fruit } = require('../models/index');

router.get('/fruits', async (req, res) => {
    try {
        const fruits = await Fruit.findAll();
        res.json(fruits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/fruits/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findByPk(req.params.id);
        if (fruit) {
            res.json(fruit);
        } else {
            res.status(404).json({ message: "Fruit not found" });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid fruit ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.post('/fruits/add', [
    check('name').notEmpty().trim().withMessage('Name is required'),
    check('name').isLength({ min: 5, max: 20 }).withMessage('Name can only have 5-20 characters'),
    check('color').notEmpty().trim().withMessage('Color is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const fruit = await Fruit.create(req.body);
        res.status(201).json(fruit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/fruits/update/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findByPk(req.params.id);
        if (fruit) {
            await fruit.update(req.body);
            res.json(fruit);
        } else {
            res.status(404).json({ message: "Fruit not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/fruits/delete/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findByPk(req.params.id);
        if (fruit) {
            await fruit.destroy();
            res.json({ message: "Fruit deleted" });
        } else {
            res.status(404).json({ message: "Fruit not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;