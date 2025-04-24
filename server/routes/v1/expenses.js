const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Group = require('../../models/Group');
const Expense = require('../../models/Expense');

const { verifyToken } = require("../../middleware/auth");

router.post('/', verifyToken, async (req, res) => {
  try {
    const { description, amount, splitMode, splits, groupId } = req.body;

    const updatedSplits = splits.map(f => ({
      ...f,
      friendId: f.friendId === 'me' ? req.user.id : f.friendId
    }));

    const newExpense = new Expense({
      createdBy: req.user.id,
      description,
      amount,
      splitMode,
      splits: updatedSplits,
      ...(groupId && { groupId })
    });

    await newExpense.save();

    // If groupId is provided, push expense to that group's expenses array
    if (groupId) {
      await Group.findByIdAndUpdate(
        groupId,
        { 
          $push: { expenses: newExpense._id },
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      );
    }

    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});
router.get('/group/:id', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId)
      .populate({
        path: 'expenses',
        populate: [
          { path: 'createdBy' },
          { path: 'splits.friendId' }
        ]
      })
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({group, id: req.user.id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch group expenses' });
  }
});


module.exports = router;
