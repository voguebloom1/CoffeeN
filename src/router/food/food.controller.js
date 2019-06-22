var elasticsearch = require('elasticsearch');
var ElasticsearchCSV = require('elasticsearch-csv');
var client = new elasticsearch.Client({
  host: 'http://172.104.114.192:9000'
});
const request = require('request-promise-native')

const default_index = 'product';
const default_type = 'coffeine';

// Food 정보 Create API
// @param Object Food
// @method POST
exports.createFood = async (req, res) => {

  let { index, type } = getIndexAndType(req);

  const { count } = await client.count({
    index: index
  });
  const food = req.body;
  console.log(food);
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
      console.log(e);
      res.send("ElasticSearch Something Wrong");
    }
  } else {
    console.log("Invalid Data, Please Check Food Data Spec")
    res.send("Invalid Data, Please Check Food Data Spec");
  }
}

// Food 정보 업데이트 API
exports.updateFoods = async (req, res) => {
    const { id } = req.params;
    let { index, type } = getIndexAndType(req);

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
          unit:           food.unit,
          calorie:        food.calorie,
          carbohydreate:  food.carbohydrate,
          protein:        food.protein,
          fat:            food.fat,
          sugars:         food.sugars,
          calcium:        food.calcium, 
          salt:           food.salt,
          cholesterol:    food.cholesterol,
          saturated_fat:  food.saturated_fat,
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
    let { foodName, page } = req.query;
    let { index, type } = getIndexAndType(req);
    console.log(req.query);
    if(page == undefined){
      page = 0;
    }  
    let response
    try{
      response = await client.search({
        index: index,
        type: type,
        body: {
          "from": page,
          "size": 20,
          "query": {
            "function_score":{
              "query":{
                "match":{
                  "food_name" : foodName
                }
              },
                "functions": [
                {
                "weight": 1.5,
                "filter":{
                  "term": {
                    "food_group": "음료"
                  }
                }
                },
                {
                "weight": 0.5,
                "filter":{
                  "term": {
                    "caffeine": 0
                  }
                }
                }
              
              ]
            }
          }
        }
      });
    }catch(e){
      response = undefined;
    }
    const json = generateResponseJson(response);
    json.page = page;
    res.json(json);
}

// Food List API
exports.getFoods = async (req, res) => {
  let { page, size } = req.query;
  let { index, type } = getIndexAndType(req);

  console.log(index);
  console.log(type);

  if(page == undefined){
    page = 0;
  }  
  if(size == undefined){
    size = 20;
  }
  const response = await client.search({
    index: index,
    type: type,
    body: {
      "from": page,
      "size": size,
      query: {
          match_all: {}
        }
      }
  });
  const json = generateResponseJson(response);
  json.page = page;
  res.json(json);
}

// Food Contents API
exports.getFoodContents = async (req, res) => {
  let { page, size } = req.query;

  if(page == undefined){
    page = 0;
  }  
  if(size == undefined){
    size = 100;
  }
  const response = await client.search({
    index: "contents",
    type: "caffeine",
    body: {
      "from": page,
      "size": size,
      "sort": {
        "id": "asc"
      }
    }
  });

  const sources = response.hits.hits;


  const jsonArray = new Array();
  for(let hit of sources){
    jsonArray.push(hit._source);
  }
  res.json(jsonArray);
}

// Food API
exports.getFoodbyId = async (req, res) => {
    let { id } = req.params;
    let { index, type } = getIndexAndType(req);
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
    && food.unit != undefined
    && food.calcium != undefined
    && food.calorie != undefined
    && food.carbohydrate != undefined
    && food.protein != undefined
    && food.fat != undefined
    && food.sugars != undefined
    && food.salt != undefined
    && food.cholesterol != undefined
    && food.saturated_fat != undefined
    && food.trans_fat != undefined
    && food.caffeine != undefined
    && food.year != undefined) {
      isValid = true;
    }
  console.log('valid : '+ isValid);
  return isValid;
}

generateResponseJson = (response, page) => {

  const foods = new Array();

  let json = new Object;
  if(response && response.hits){
    const hits = response.hits.hits;
    const total = response.hits.total;
    // 제목 가공
    for(let hit of hits){
      if(hit._source.food_name.includes(' | ')){
        try{
          const strs = hit._source.food_name.split(' | ');
          hit._source.food_name = strs[strs.length-1].trim();
        }catch(e){
          console.log(e);
        }
      }
  
      const food = hit._source;
      food.id = hit._id;
      foods.push(food);
    }
  
    json = {size: foods.length, total: total, foods : foods};
  }else{
    json = {size: 0, total: 0, foods: []};
  }
  return json;
}

getIndexAndType = (req) => {
  let { index, type } = req.query;
  if(!index){
    index = default_index;
  }
  if(!type){
    type = default_type;
  }


  return { index: index, type : type };
}
