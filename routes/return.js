const express = require('express');
const router = express.Router();

router.post('/api/returns', async (req, res) => {

    // no token // no adding auth middleware

    // Test driven development -- make it simple
    res.status(401).send('Unauthorized access');
});

module.exports = router;
