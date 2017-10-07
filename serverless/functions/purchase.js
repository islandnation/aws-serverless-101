//Lambda Function Processes Orders And Persists Them To DynamoDB
const aws = require('aws-sdk');
const shortid = require('shortid');
const products = require('./catalog').products;

//Environment Variables
const REGION = process.env.SERVERLESS_REGION;
const STAGE = process.env.SERVERLESS_STAGE;
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;

class OrderProcessor {
    create(request) { //Returns Promise
        try {
            this.validate(request);
        } catch (err) {
            return Promise.reject(err);
        }

        return this.process(request);
    }

    validate(request) {
        if (!Array.isArray(request.products)) {
            console.log(request);
            throw new Error('Request Missing Product Detail');
        }

        //Validate Positive Quantity And Sku Exists
        request.products.forEach(item => {
            if (typeof item.sku !== 'string') {
                throw new Error(`Product Detail Missing Sku`);
            }

            var product = products.find(p => p.sku === item.sku);
            if (!product) {
                throw new Error(`Unable To Match Sku '${item.sku}'`);
            }
            item.price = product.price;

            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                throw new Error('Product Detail Missing Quantity');
            }
        });
    }

    createOrderId() {
        return shortid.generate();
    }

    process(request) {
        var orderId = this.createOrderId();
        var orderTotal = request.products.map(p => p.quantity * p.price).reduce((a, b) => a + b, 0);
        var documentClient = new aws.DynamoDB.DocumentClient({
            region: REGION
        });

        return new Promise((resolve, reject) => {
            documentClient.put({
                TableName: DYNAMODB_TABLE,
                Item: {
                    OrderId: orderId,
                    Total: orderTotal,
                    FirstName: request.customer.firstName || '',
                    LastName: request.customer.lastName || '',
                    Email: request.customer.email || '',
                    Detail: JSON.stringify(request.products)
                }
            }, (error, item) => {
                if (error) {
                    return reject(error);
                }

                return resolve({
                    orderId: orderId,
                    total: orderTotal
                });
            });
        });
    }
}

exports.handler = function(event, context, callback) {
    console.log(`Function invoked with context ${JSON.stringify(context, 3, 3)}`);

    //Incoming Request Body Is A String
    var body = JSON.parse(event.body);

    var processor = new OrderProcessor();
    processor.create(body).then(response => {
        //Follows standard NodeJS callback pattern
        console.log(`Completed processing order ${JSON.stringify(response, 3, 3)}`);
        callback(null, {
            //Response HTTP StatusCode
            statusCode: 200,
            //Body of HTTP Response, Lambda Proxy Requires A String To Be Returned
            body: JSON.stringify(response, 3, 3) 
        });
    }, error => {
        //Follows standard NodeJS callback pattern
        console.error(`Error processing order ${error.message}`);
        callback(null, {
            //Response HTTP StatusCode
            statusCode: 500,
            //Body of HTTP Response, Lambda Proxy Requires A String To Be Returned
            body: JSON.stringify({ message: error.message }, 3, 3) 
        });
    });
};