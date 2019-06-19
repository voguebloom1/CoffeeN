const request = require('request-promise-native')

const clientId = "f47e708390a04225b79ab606067f2650";
const clientSecret = "a61e5107c4f0405ab594d710dea9d9b7";

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
    food_id: id,
    format: "json",
    region: "KR",
    language: "ko"

  }
  console.log(options);
  return await request(options, function (error, response, body) {
    if (error){
      callGetKey(); 
      return (error)
    };
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
    format: "json",
    region: "KR",
    language: "ko"
  }
  return await request(options, function (error, response, body) {
    if (error){ 
      callGetKey();
      return (error)
    };
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

