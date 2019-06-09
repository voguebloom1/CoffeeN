const router = require('express').Router();
const controller = require('./food.controller');

router.get('/foods/search', controller.searchFood);
router.get('/foods', controller.getFoods);
router.get('/foods/:id', controller.getFoodbyId);
router.put('/foods/:id', controller.updateFoods);
router.post('/foods', controller.createFood);

// router.get('/foods/importcsv', controller.importCsv)

module.exports = router;