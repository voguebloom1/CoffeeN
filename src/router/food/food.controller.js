var elasticsearch = require('elasticsearch');
var ElasticsearchCSV = require('elasticsearch-csv');
var client = new elasticsearch.Client({
  host: 'http://172.104.114.192:9000'
});
const request = require('request-promise-native')

// var esCSV = new ElasticsearchCSV({
//     es: { index: 'foodtest', type: 'food', host: '172.104.114.192:9000' },
//     csv: { filePath: 'E:/git/foods4.csv', headers: true }
// });

const index = 'foods';
const type = 'food';

// Food 정보 Create API
// @param Object Food
// @method POST
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
          carbohydreate:  food.carbohydrate,
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

    let { foodName, page } =  req.query;
    console.log(req.query);
    if(page == undefined){
      page = 1;
    }  
    let response
    try{
      response = await client.search({
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
    }catch(e){screen
      response = undefined;
    }
    const json = generateResponseJson(response);
    json.page = page;
    res.json(json);
}

// Food List API
exports.getFoods = async (req, res) => {
  let { page, size } = req.query;
  if(page == undefined){
    page = 0;
  }  
  if(size == undefined){
    size = 10;
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

const clientId = "9b52c785139541e6a501103caaf78134";
const clientSecret = "96901104b2eb474a9cbea591f9bd57dd";

var keyOptions = { 
  method: 'POST',
  url: 'https://oauth.fatsecret.com/connect/token',
  auth : {
     user : clientId, 
     password : clientSecret
  },
  headers: { 'content-type': 'application/json'},
  form: {
     'grant_type': 'client_credentials',
     'scope' : 'basic'
  },
  json: true 
};


exports.getSecretKey = async (req, res) => {

  const body = await callGetKey();
  console.log(body);
  res.json(body);
}

exports.getSecretFoodInfoById = async (req, res) => {
  const { id } = req.params;
  const body = await callGetFoodById(id);
  console.log(body);
  const json = JSON.parse(body);
  res.json(json);
}

exports.searchSecretFood = async (req, res) => {
  let { foodName } =  req.query;;
  const body = await callSearch(foodName);
  console.log(body);
  const json = JSON.parse(body);
  res.json(json);
}

let access_token = "";

callGetFoodById = async (id) => {
  
  let options = await getApiOption();
  options.qs = {
    method: "food.get",
    food_id: id
  }
  console.log(options);
  return await request(options, function (error, response, body) {
    if (error){ return (error)};
    return body;
  });;
}

callGetKey = async () => {
  return await request(keyOptions, function (error, response, body) {
    if (error){ return (error)};
    access_token = body.access_token;
    return body;
  });;
}

callSearch = async (foodName)=>{
  let options = await getApiOption();
  options.qs = {
    method: "foods.search",
    search_expression: foodName,
    max_results: 20,
    format: "json"
  }
  return await request(options, function (error, response, body) {
    if (error){ return (error)};
    return body;
  });;
}

getApiOption = async () => {

  if(!access_token){
    await callGetKey();
  }
  let options = { 
    method: 'POST',
    uri: 'https://platform.fatsecret.com/rest/server.api',
    headers: { 'content-type': 'application/json', 'Authorization': 'Bearer '+ access_token }
  };
  return options;
}
