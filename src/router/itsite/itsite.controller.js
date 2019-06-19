const request = require('request-promise-native');

const apiKey = "0a01dc13-0f0f-4e36-9fad-850431caa855";

exports.searchFoodName = async (req, res) => {
    const { foodName, page, size } = req.query;
    const response = await callSearchApi(foodName, 0, 100);

    const jsonResponse = JSON.parse(response);


    const resResult = [];
    if(jsonResponse.pageInfo.totalCount > 0){
      for(item of jsonResponse.items){
        if(item.clsNm.includes('가공식품') && item.gnlOwnerNm ){
          resResult.push(item);
        }
      }
    }
    const result = {
      foods : resResult,
      size : resResult.length

    }

    res.json(result);
}


exports.getFoodInfoById = async (req, res) => {

  console.log('getFoodInfoById');
  const { id } = req.params;
  const response = await callDetailApi(id);
  const jsonResponse = JSON.parse(response);

  res.json(jsonResponse);
}

callSearchApi = async (foodName, page, size) => {
    const options = { 
        method: 'Get',
        headers: { 'content-type': 'application/json', 'appKey': apiKey },
        url : 'http://35.221.88.245:8080/v1.0/productInfo/products',
        qs: {
            searchValue: foodName,
            page: page,
            size: size,
            searchField: 'searchProductNm'
        }
      };
    // console.log(options);
    return await request(options, function (error, response, body) {
      if (error){
        return (error)
      };
      return body;
    });;
}

callDetailApi = async (id) => {
  const options = { 
    method: 'Get',
    headers: { 'content-type': 'application/json', 'appKey': apiKey },
    url : 'http://35.221.88.245:8080/v1.0/productInfo/detail/' + id
  };

  return await request(options, function (error, response, body) {
    if (error){
      return (error)
    };
    return body;
  });;
}
