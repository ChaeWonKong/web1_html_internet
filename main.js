const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templateHTML(title, list, body) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      <a href="/create">create</a>
      ${body}
    </body>
    </html>
  `;
};

function templateList(filelist){
  let list = '<ol>';
    for (let i in filelist) {
      list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
    };
  list += '</ol>';
  return list;
};

var app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
      if (queryData.id === undefined) {
        fs.readdir('./data', function(err, filelist) {
          const title = 'Welcome';
          const description = 'Hello, Node.js!';
          const list = templateList(filelist);
          const template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(err, filelist) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          const title = queryData.id;
          const list = templateList(filelist);
          const template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(err, filelist) {
          const title = 'Web - create';
          const list = templateList(filelist);
          const template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
              <p><input type="text" name="title" placeholder="title" /></p>
              <p><textarea name="description" placeholder="description"></textarea></p>
              <p><button type="submit">submit</button></p>
            </form>
            `);
          response.writeHead(200);
          response.end(template);
        });
    } else if(pathname === '/create_process'){
      let body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);