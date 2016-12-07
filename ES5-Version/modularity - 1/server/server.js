
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

"use strict";


// Think to yourself, what are the steps we want to modularize?
//
// ...
//

// Incoming Request
//   if GET
//     If (valid url)
//       do something
//       send response (200, 301, 404, 500, etc.)
//
//     Else If (other valid url)
//       do something
//       send response
//
//     else
//       respond with 404 not found
//
//   Else if POST
//     ...
//
//   Else
//     respond 405
//

// Incoming Request
//   If (valid url)
//     convert url to file system address
//     load file
//     send response with contents of file
//
//   else
//     respond with 404 not found
//
//   <sendResponse might be in common>
//
//
// Each of these steps appear to be reusable for many requests.  That is what
//  we'll attempt to refactor.
//

// NOTE: for demonstration purposes, some of the file handlers are asynchronous and others
//  synchronous.  There's no other technical reason why they are one way or the other.
//

// NOTE: The below code is an example of how one might handle incoming requests without
//  modularization.  Modularization is when we break the code into re-usable functions
//  and/or node modules (files).
//

// NOTE: module.exports is only there so the unit tests can successfully run.  There is
//  no other technical reason to include it.
//
var server = module.exports = http.createServer(function(request, response) {
  console.log(request.method + " " + request.url);

  if (request.method === "GET") {
    if (request.url === "/" || request.url === "/index.html") {
      var pathname = (request.url === "/") ? "/index.html" : url.parse(request.url).pathname;
      var filename = path.join(__dirname, "../web/" + pathname);

      fs.readFile(filename, function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end(JSON.stringify(err));
        }
        else {
          var content = data.toString();

          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(content, "utf-8");
          response.end();
        }
      });
    }

    else if (request.url === "/about.html") {
      var pathname = url.parse(request.url).pathname;
      var filename = path.join(__dirname, "../web/" + pathname);

      fs.readFile(filename, function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end(JSON.stringify(err));
        }
        else {
          var content = data.toString();

          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(content, "utf-8");
          response.end();
        }
      });
    }

    else if (request.url === "/contact.html") {
      var pathname = url.parse(request.url).pathname;
      var filename = path.join(__dirname, "../web/" + pathname);

      fs.readFile(filename, function(err, data) {
        if (err) {
          response.writeHead(404);
          response.end(JSON.stringify(err));
        }
        else {
          var content = data.toString();

          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(content, "utf-8");
          response.end();
        }
      });
    }

    else if (request.url === "/style.css") {
      var pathname = url.parse(request.url).pathname;
      var filename = path.join(__dirname, "../web/" + pathname);

      fs.readFile(filename, function(err,data) {
        if (err) {
          response.writeHead(404);
          response.end(JSON.stringify(err));
        }
        else {
          var content = data.toString();

          response.writeHead(200, { "Content-Type": "text/css" });
          response.write(content, "utf8");
          response.end();
        }
      });
    }

    else if (request.url === "/scripts.js") {
      var pathname = url.parse(request.url).pathname;
      var filename = path.join(__dirname, "../web/" + pathname);

      fs.readFile(filename, function(err,data) {
        if (err) {
          response.writeHead(404);
          response.end(JSON.stringify(err));
        }
        else {
          var content = data.toString();

          response.writeHead(200, { "Content-Type": "application/javascript" });
          response.write(content, "utf8");
          response.end();
        }
      });
    }

    else {
      response.writeHead(404);
      response.end("Not found.", "");
    }
  }

  else if (request.method === "POST") {
    var data = "";

    request.on("data", function(chunk) {
      data += chunk;
    });

    request.on("end", function() {
      var contentType = (request.contentType || "text/plain");

      response.setHeader("content-Type", contentType);
      response.end(data, 200);
    })
  }

  else {
    response.writeHead(405);
    response.end("Method not allowed.", "");
  }
});

var port = process.env.PORT || 3000;
server.listen(port);

console.log("Server running at http://127.0.0.1:" + port);