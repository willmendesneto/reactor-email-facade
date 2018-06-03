const { Router } = require('express');
const sendController = require('./controllers/send');

const router = new Router({
  strict: true,
  caseSensitive: true,
});

// core routes
router.get('/ping', (req, res) => res.send({ alive: true }));

router.get('/', (req, res) => {
  const API_URL = `${req.protocol}://${req.host}${req.baseUrl}`;

  req.log.info('Calling API Discovery endpoint');
  res.status(200).send({
    discovery: {
      url: `${API_URL}`,
      method: 'GET',
    },
    sendEmail: {
      url: `${API_URL}`,
      method: 'POST',
    },
  });
});

router.post('/', sendController);

module.exports = router;
