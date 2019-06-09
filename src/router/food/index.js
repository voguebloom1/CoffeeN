const router = require('express').Router();
const controller = require('./food.controller');

router.get('/foods/search', controller.searchFood);
router.get('/foods', controller.getFoods);
router.get('/foods/:id', controller.getFoodbyId);
router.post('/foods', controller.updateFoods);

// router.get('/foods/importcsv', controller.importCsv)

module.exports = router;