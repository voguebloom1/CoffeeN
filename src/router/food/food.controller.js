var elasticsearch = require('elasticsearch');
var ElasticsearchCSV = require('elasticsearch-csv');
var client = new elasticsearch.Client({
  host: 'http://172.104.114.192:9000'
});

// var esCSV = new ElasticsearchCSV({
//     es: { index: 'foodtest', type: 'food', host: '172.104.114.192:9000' },
//     csv: { filePath: 'E:/git/foods4.csv', headers: true }
// });

const index = 'foods';
const type = 'food';


exports.createFood = async (req, res) => {
  const { count } = await client.count({
    index: index
  });
  const food = req.body;
  if(isValidFoodData(food)) {
    try {
      const response = await client.create({
        index: index,
        type: type,
        id: count + 1,
        body: food
      });
      res.json(response);
    } catch(e) {
      res.send("ElasticSearch Something Wrong");
    }
  } else {
    res.send("Invalid Data, Please Check Food Data Spec");
  }
}

// Food 정보 업데이트 API
exports.updateFoods = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const food = req.body;
    const response = await client.update({
      index: index,
      type: type,
      id: id,
      body: { 
        doc: {
          food_group:     food.food_group,
          food_name:      food.food_name,
          size:           food.size,
          calorie:        food.calorie,
          carbohydreate:   food.carbohydrate,
          protein:        food.protein,
          fat:            food.fat,
          sugars:         food.sugars,
          salt:           food.salt,
          cholesterol:    food.cholesterol,
          saturaated_fat: food.saturaated_fat,
          trans_fat:      food.trans_fat,
          caffeine:       food.caffeine,
          year:           food.year
        }
      }
    });
    res.json(response);
}

// Food 정보 Search API
// @param String food_name
// @method Get
exports.searchFood = async (req, res) => {

    const { foodName } =  req.query;
    console.log(foodName);
    const response = await client.search({
        index: index,
        type: type,
        body: {
          "query": {
            "match":{
              "food_name" : foodName
            }
          },
            "explain": true
        }
    });

    const foods = new Array();
    const hits = response.hits.hits;
    for(let hit of hits){
      // console.log(hit._source);
      if(hit._source.food_name.includes(' | ')){
        try{
          const strs = hit._source.food_name.split(' | ');
          hit._source.food_name = strs[strs.length-1];
        }catch(e){
          console.log(e);
        }
      }
      foods.push(hit._source);
    }
    res.json({foods : foods});
}

// Food List API
exports.getFoods = async (req, res) => {
  const response = await client.search({
    index: 'foodtest',
    type: 'food',
    body: {
      query: {
          match_all: {}
    }
  }
});
    res.json(response);
}

// Food List API
exports.getFoodbyId = async (req, res) => {
    const { id } = req.params;
    try{
      const response = await client.get({
        id: id,
        index: index,
        type : type
      });
      res.send(response);
    }catch(e){
      res.send("Not Found");
    }
}

isValidFoodData = (food) => {
  let isValid = false;
  if(food.food_group != undefined 
    && food.food_name != undefined 
    && food.size != undefined
    && food.calorie != undefined
    && food.carbohydrate != undefined
    && food.protein != undefined
    && food.fat != undefined
    && food.sugars != undefined
    && food.salt != undefined
    && food.cholesterol != undefined
    && food.saturaated_fat != undefined
    && food.trans_fat != undefined
    && food.caffeine != undefined
    && food.year != undefined) {
      isValid = true;
    }
  return isValid;
}

// exports.importCsv = (req, res) => {
//     esCSV.import()
//     .then(function (response) {
//         // Elasticsearch response for the bulk insert
//         console.log(response);
//     }, function (err) {
//         // throw error
//         throw err;
//     });

//     res.sendStatus(200);
// }
