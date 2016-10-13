var express = require("express")
var http = require('http');
var network = require('network');

var gatewayIp
network.get_gateway_ip(function(err, ip) {
  gatewayIp = ip
  console.log('gateway ip: ', err || ip); // err may be 'No active network interface found.' 
})

// var redirect = require("express-redirect");
 
var PORT = 3030;

var app = express();
// redirect(app);


app.get('/', function (req, res){
  res.send('Hello from chess router!');
});

// app.redirect("/apkbuilder/:command", "localhost/:command(1)", 301, true);

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);



/* your app config here */

app.get('/api/app.apk', function(req, res) {

  var options = {
    // host to forward to
    host:   gatewayIp,
    // port to forward to
    port:   5000,
    // path to forward to
    path:   '/app.apk',
    // request method
    method: 'GET',
    // headers to send3030/ap
    headers: req.headers
  };

  var creq = http.request(options, function(cres) {

    // set encoding
    // res.setEncoding('binary');
    res.writeHead(cres.statusCode);

    // wait for data
    cres.on('data', function(chunk){
      res.write(chunk);
    });

    cres.on('close', function(){
      // closed, let's end client request as well 
      // res.writeHead(cres.statusCode);
      res.end();
    });

    cres.on('end', function(){
      // finished, let's finish client request as well 
      // res.writeHead(cres.statusCode);
      res.end();
    });

  }).on('error', function(e) {
    // we got an error, return 500 error to client and log error
    console.log(e.message);
    // res.writeHead(500);
    // res.write('\n' + e.message + '\n' + e.stack + '\n')
    res.end();
  });

  creq.end();

});