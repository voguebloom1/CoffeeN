const router = require('express').Router();
const controller = require('./fatsecret.controller');

router.get('/foods/secret/key', controller.getSecretKey);
router.get('/foods/secret/search/:id', controller.getSecretFoodInfoById);
router.get('/foods/secret/search', controller.searchSecretFood);

module.exports = router;