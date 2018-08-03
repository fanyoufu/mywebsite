const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
// app.use(express.bodyParser());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const ejs = require('ejs');
app.set('view engine', 'ejs');

const blogBLL = require('./src/bll/blog.js');


app.get('/add', function (req, res) {
  const rs = res.render('./admin/add.ejs', {titleName:'test'});
  console.info(rs);
//  res.send('Hello World123');
});


app.get('/edit', function (req, res) {
  const filename = req.query.filename;
  const blog = blogBLL.getBlog(filename);
  res.render('./admin/edit.ejs', {blog});
});

app.get('/admin', function (req, res) {
  fs.readFile('./views/admin/index.ejs', function (err, data) {
    if (err) {
      console.info(err);
    }

    const template = data.toString();
    const blogs = blogBLL.getAll();
    const html = ejs.render(template, {blogs});// 用dictionary数据源填充template
    res.send(html);

    fs.writeFile('static.html', html, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('数据写入成功！');
    });
  });
});

app.post('/add', function (req, res) {
  console.info(req.body);

  const response = {
    'title':req.body.title,
    'keywords':req.body.keywords,
    'content':req.body.content,
  };
  blogBLL.add(response);
  console.log(blog);
  res.json(response);
});
app.post('/saveEdit', function (req, res) {
  if (blogBLL.saveEdit(req.body)) {
    res.json({success:1});
  }
  else {
    res.json({success:0});
  }
});


app.get('/admin', function (req, res) {
  res.end('管理员');
});
const server = app.listen(8081, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log('应用实例，访问地址为 http://%s:%s', host, port);

});
