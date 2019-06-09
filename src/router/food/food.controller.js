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


// Food 정보 업데이트 API
exports.updateFoods = (req, res) => {
    res.sendStatus(200);
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
