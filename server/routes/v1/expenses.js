const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Expense = require('../../models/Expense');
console.log('Expense model:', Expense);

const { verifyToken } = require("../../middleware/auth");

router.post('/', verifyToken, async (req, res) => {
  try {
    const { description, amount, splitMode, splits } = req.body;
    
    // Replace 'me' in splits with the logged-in user's id (req.user.id)
    const updatedSplits = splits.map(f => {
      if (f.friendId === 'me') {
        // Replace 'me' with the logged-in user's ID
        f.friendId = req.user.id;
      }
      return f;
    });
    
    // Create a new expense with the updated splits
    const newExpense = new Expense({
      createdBy: req.user.id,
      description,
      amount,
      splitMode,
      splits: updatedSplits
    });

    // Save the new expense
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});


module.exports = router;
