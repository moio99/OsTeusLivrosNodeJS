const express = require('express');
const router = express.Router();

/**
 * GET
 */
router.get('/', async function(req, res, next) {
  const resultado = {resultado:'Chamada realizada'};
  res.json(resultado);
});

module.exports = router;