const http = require("http");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const port = 8080;

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

http
  .createServer((request, response) => {
    let url = request.url;
    let method = request.method;
    let urlArray = url.split("/");
    let value = urlArray[urlArray.length - 1];

    if (url == "/") {
      if (method == "GET") {
        response.writeHead(200, "OK", { "Content-Type": "text/html" });
        response.write("<h1> Welcome to home page </h1>");
        response.end();
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else if (url == "/html") {
      if (method == "GET") {
        readFile(path.join(__dirname, "quote.html"))
          .then((data) => {
            response.writeHead(200, "OK", { "Content-Type": "text/html" });
            response.write(data);
            response.end();
          })
          .catch((err) => {
            console.error(err);
            response.writeHead(503, "Service Unavailable");
            response.write("Retry after sometime");
            response.end();
          });
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else if (url == "/json") {
      if (method == "GET") {
        readFile(path.join(__dirname, "secondJson.json"))
          .then((data) => {
            response.writeHead(200, "OK", {
              "Content-Type": "application/json",
            });
            response.write(data);
            response.end();
          })
          .catch((err) => {
            console.error(err);
            response.writeHead(503, "Service Unavailable");
            response.write("Retry after sometime");
            response.end();
          });
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else if (url == "/uuid") {
      if (method == "GET") {
        let newId = uuidv4();
        let data = { uuid: newId };

        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.write(JSON.stringify(data));
        response.end();
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else if (url == `/status/${value}`) {
      if (method == "GET") {
        let allCode = http.STATUS_CODES;

        if (allCode[value] != undefined) {
          // response.writeHead(value, allCode[value], {
          //   "Content-Type": "text/html",
          // });

          response.writeHead(200, "OK", {
            "Content-Type": "text/html",
          });
          response.write(`<h1> Message-- ${allCode[value]}</h1>`);
          response.end();
        } else {
          response.writeHead(422, "Unprocessable entry", {
            "Content-Type": "text/html",
          });
          response.write(`<h1> Invalid status code-- ${value} </h1>`);
          response.end();
        }
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else if (url == `/delay/${value}`) {
      if (method == "GET") {
        setTimeout(() => {
          response.writeHead(200, "OK", { "Content-Type": "text/html" });
          response.write(
            `<h1>You have been waiting for ${value} seconds.</h1>`
          );
          response.end();
        }, value * 1000);
      } else {
        response.writeHead(501, "Not Implemented");
        response.write("<h1> 501, Not Implemented</h1>");
        response.end();
      }
    } else {
      response.writeHead(404, "Not Found");
      response.write(
        '<h1 style="text-align: center; font-size:3em;">404 Not Found</h1>'
      );
      response.end();
    }
  })
  .listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
