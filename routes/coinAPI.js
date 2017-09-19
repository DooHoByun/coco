var coinAPI = require('../public/XCoinAPI');
var request = require('request');
const consts = require('../public/constants');

module.exports = function(app, Book)
{
    app.get('/api/books/:book_id', function(req, res){
        res.end();
    });

    app.get('/api/books/author/:author', function(req, res){
        res.end();
    });

    app.post('/api/books', function(req, res){
    	 var book = new Book();
    	    book.title = req.body.name;
    	    book.author = req.body.author;
    	    book.published_date = new Date(req.body.published_date);

    	    book.save(function(err){
    	        if(err){
    	            console.error(err);
    	            res.json({result: 0});
    	            return;
    	        }
    	        res.json({result: 1});
    	    });
    });

    app.put('/api/books/:book_id', function(req, res){
        res.end();
    });

 
    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    });
    
    app.get('/api/public', function(req, res){
        var api_host = consts.apiUrl + '/public/' +  req.query.target + '/' + req.query.currency;
        
    	requestData(api_host, 'GET', null, null, function(result){
        	res.json(result);
    	});
    });
    
    app.post('/api/private', function(req, res){
    	var xcoinAPI = new coinAPI.XCoinAPI(consts.public_key, consts.secret_key);
        var endPoint = '/'+ req.query.path1+'/' + req.query.path2;
        
        console.log(endPoint);
        console.log(req.body);
        var query = xcoinAPI.xcoinApiCall(endPoint, req.body);
    	requestData(query.api_host, 'POST', query.rgParams, query.headers, function(result){
        	res.json(result);
    	});
    });
       
	app.get('/api/books', function(req,res){
    	var xcoinAPI = new coinAPI.XCoinAPI(consts.public_key, consts.secret_key);
    	var rgParams = {
    		currency:'ALL',
    	};
    	
    	var query = xcoinAPI.xcoinApiCall('/info/balance', rgParams);
    	requestData(query.api_host, 'POST', query.rgParams, query.headers, function(result){
        	res.json(result);
    	});
    });
}

function requestData(strHost, strMethod, rgParams, httpHeaders, callback) {
	var rgHeaders = {};
	if(httpHeaders) {
		rgHeaders = httpHeaders;
	}
	request({
		method : strMethod,
		uri : strHost,
		headers : rgHeaders,
		formData : rgParams
	},
	function(error, response, rgResult) {
		if(error) {
			console.log("request error : " + error);
			return;
		}

		
		var rgResultDecode = JSON.parse(rgResult);
		callback(rgResultDecode);
	});
}