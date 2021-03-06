const markjs = require('marked');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const blogBLL = require('../bll/blog.js');
const filePath = './src/blog/';
const results = [];

const create = function (blog) {
  const filename = blog.filename;
  const fileFullName = path.join(filePath, filename);

  const data = fs.readFileSync(fileFullName, 'utf8');
  const article = markjs(data);


  const d = {article, ...blog,pageName:'none'};//keywords:blog.keywords, categroy:blog.categroy, title:blog.title, dateTime:blog.dateTime};
  ejs.renderFile('./views/front/blog/blog.ejs', d, function (err, html) {
    if (err) {
      console.info(err);
    }
    fs.writeFileSync(`./public/blog/${filename}.html`, html);
    console.info(`./public/blog/${filename}.html --- done`);
  });
};

const blogs = blogBLL.getAll();
blogs.sort(function(a,b){
  return a.filename.substring(0,10) < b.filename.substring(0,10)
})


const categoryNameList = Array.from( new Set(blogs.map(item=>item.categroy)) )
console.info(categoryNameList)
// 统计分类数据
const categoryDataList = categoryNameList.map(item=>{

  return blogs.filter(it => it.categroy == item)
});

console.info(categoryDataList)
// blogs.forEach(item => {
//   let obj = categories.find(it => {
//     return it.cateName == item.categroy;
//   })
//   let date = item.filename ? item.filename.substr(0,10) : ""
//   if(obj){
//     obj.cateLinks.push(item.filename+".html");
//     obj.cateTitles.push(item.title);
//     obj.cateDates.push(date)
//   }
//   else{
//     categories.push({cateName:item.categroy,cateTitles:[item.title],cateLinks:[item.filename],cateDates:[date]})
//   }
// })

//  生成博文
blogs.forEach(item => {
  item.dateTime = item.filename.substring(0, 10);
  const fileFullName = path.join(filePath, item.filename);
  // filePath+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
  fs.stat(fileFullName, function (err, stats) {
    if (err) throw err;
    // 文件
    if (stats.isFile()) {
      create(item);
    }
  });
});

// 生成主页
ejs.renderFile('./views/front/index.ejs', {data:blogs,title:'主页'}, function (err, html) {
  if (err) {
    console.info(err);
  }

  fs.writeFile('./public/index.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/index.html 数据写入成功！');
  });
});

// 生成分类页
ejs.renderFile('./views/front/categories.ejs', {categoryNameList,categoryDataList,title:'分类'}, function (err, html) {
  
  if (err) {
    console.info(err);
  }

  fs.writeFile('./public/categories.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/categories.html 数据写入成功！');
  });
});


// 生成 关于页
ejs.renderFile('./views/front/about.ejs', {data:blogs,title:'关于Mr.fan'}, function (err, html) {
  if (err) {
    console.info(err);
  }

  fs.writeFile('./public/about.html', html, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('./public/about.html 数据写入成功！');
  });
});
