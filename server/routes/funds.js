const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

// Cache fund detail responses for 1 hour (bonus point: be kind to free API)
const fundCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Cache for all funds - 24 hours (86400 seconds)
const allFundsCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

const MFAPI_BASE = 'https://api.mfapi.in/mf';

/**
 * GET /api/funds/all
 * Fetch list of all funds from MFapi.in
 */
router.get('/all', async (req, res) => {
  try {
    const cacheKey = 'all_funds';
    const cached = allFundsCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(MFAPI_BASE, {
      timeout: 30000,
    });

    // Cache the response
    allFundsCache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    console.error('All funds fetch error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: 'Upstream API error' });
    }
    res.status(500).json({ error: 'Failed to fetch all funds' });
  }
});

/**
 * GET /api/funds/search?q=<query>
 * Proxy search to MFapi.in
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(`${MFAPI_BASE}/search`, {
      params: { q: q.trim() },
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Fund search error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: 'Upstream API error' });
    }
    res.status(500).json({ error: 'Failed to search funds' });
  }
});

/**
 * GET /api/funds/:schemeCode
 * Proxy fund detail/NAV data from MFapi.in with 1-hour cache
 */
router.get('/:schemeCode', async (req, res) => {
  try {
    const { schemeCode } = req.params;

    // Validate schemeCode is a number
    if (!/^\d+$/.test(schemeCode)) {
      return res.status(400).json({ error: 'Invalid scheme code' });
    }

    // Check cache first
    const cacheKey = `fund_${schemeCode}`;
    const cached = fundCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(`${MFAPI_BASE}/${schemeCode}`, {
      timeout: 15000,
    });

    // Cache the response
    fundCache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Fund detail error:', error.message);
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'Scheme not found' });
      }
      return res.status(error.response.status).json({ error: 'Upstream API error' });
    }
    res.status(500).json({ error: 'Failed to fetch fund details' });
  }
});

module.exports = router;
