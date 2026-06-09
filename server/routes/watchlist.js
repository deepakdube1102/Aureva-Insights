const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const Watchlist = require('../models/Watchlist');

// All watchlist routes require authentication
router.use(requireAuth());

/**
 * GET /api/watchlist
 * Fetch all watchlist items for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Fetch watchlist error:', error.message);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

/**
 * POST /api/watchlist
 * Add a scheme to the authenticated user's watchlist
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { schemeCode, schemeName } = req.body;

    // Validate inputs
    if (!schemeCode || !schemeName) {
      return res.status(400).json({ error: 'schemeCode and schemeName are required' });
    }

    if (typeof schemeCode !== 'number' || schemeCode <= 0) {
      return res.status(400).json({ error: 'schemeCode must be a positive number' });
    }

    if (typeof schemeName !== 'string' || schemeName.trim().length === 0) {
      return res.status(400).json({ error: 'schemeName must be a non-empty string' });
    }

    const item = await Watchlist.create({
      userId,
      schemeCode,
      schemeName: schemeName.trim(),
    });

    res.status(201).json(item);
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Scheme already in watchlist' });
    }
    console.error('Add to watchlist error:', error.message);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

/**
 * DELETE /api/watchlist/:schemeCode
 * Remove a scheme from the authenticated user's watchlist
 */
router.delete('/:schemeCode', async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { schemeCode } = req.params;

    if (!/^\d+$/.test(schemeCode)) {
      return res.status(400).json({ error: 'Invalid scheme code' });
    }

    const result = await Watchlist.findOneAndDelete({
      userId,
      schemeCode: Number(schemeCode),
    });

    if (!result) {
      return res.status(404).json({ error: 'Scheme not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist', schemeCode: Number(schemeCode) });
  } catch (error) {
    console.error('Remove from watchlist error:', error.message);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;
