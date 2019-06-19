const router = require('express').Router();
const controller = require('./fatsecret.controller');

router.get('/secret/key', controller.getSecretKey);
router.get('/secret/search/:id', controller.getSecretFoodInfoById);
router.get('/secret/search', controller.searchSecretFood);

module.exports = router;