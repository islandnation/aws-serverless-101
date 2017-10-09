'use strict';

//Lambda Function Returns Product List For Products To Purchase
const products = require('./catalog').products;

exports.handler = function(event, context, callback) {
    console.log(`Function invoked with context ${JSON.stringify(context, 3, 3)}`);

    //Follows standard NodeJS callback pattern
    callback(null, {
        //Response HTTP StatusCode
        statusCode: 200,
        //Body of HTTP Response, Lambda Proxy Requires A String To Be Returned
        body: JSON.stringify({ products: products }, 3, 3) 
    });

    console.log(`Function returned with ${products.length} products`);
};