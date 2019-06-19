const router = require('express').Router();
const controller = require('./itsite.controller');


router.get('/foods/itsite/search', controller.searchFoodName);
router.get('/foods/itsite/search/:id', controller.getFoodInfoById);
module.exports = router;