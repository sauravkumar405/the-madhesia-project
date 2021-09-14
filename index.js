const http = require("http");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const port = 8000;

http
  .createServer((request, response) => {
    let url = request.url;
    let urlArray = url.split("/");
    let value = urlArray[urlArray.length - 1];

    if (url == "/") {
      response.writeHead(200, "OK", { "Content-Type": "text/html" });
      response.write("<h1> Welcome to home page </h1>");
      response.end();
    } else if (url == "/html") {
      fs.readFile("./martin.html", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          response.writeHead(404, "Not Found");
          response.write("Contents you are looking are Not Found");
          response.end();
        } else {
          response.writeHead(200, "OK", { "Content-Type": "text/html" });
          response.write(data);
          response.end();
        }
      });
    } else if (url == "/json") {
      fs.readFile("./secondJson.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          response.writeHead(404, "Not Found");
          response.write("Contents you are looking are Not Found");
          response.end();
        } else {
          response.writeHead(200, "OK", { "Content-Type": "application/json" });
          response.write(data);
          response.end();
        }
      });
    } else if (url == "/uuid") {
      let newId = uuidv4();
      let data = { uuid: newId };

      response.writeHead(200, "OK", { "Content-Type": "application/json" });
      response.write(JSON.stringify(data));
      response.end();
    } else if (url == `/status/${value}`) {
      let allCode = http.STATUS_CODES;

      if (allCode[value] != undefined) {
        response.writeHead(value, allCode[value], {
          "Content-Type": "text/html",
        });
        response.write(`<h1> Message-- ${allCode[value]}</h1>`);
        response.end();
      } else {
        response.writeHead(400, "Bad Request", { "Content-Type": "text/html" });
        response.write(`<h1> Invalid status code-- ${value} </h1>`);
        response.end();
      }
    } else if (url == `/delay/${value}`) {
      setTimeout(() => {
        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.write(`<h1>You have been waiting for ${value} seconds.</h1>`);
        response.end();
      }, value * 1000);
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
