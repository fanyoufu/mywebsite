// 把public中的文件复制到fanyoufu.github.io

const fs = require('fs');
const stat = fs.stat;

const copy = function (src, dst) {
  // 读取目录
  fs.readdir(src, function (err, paths) {
    console.log(paths);
    if (err) {
      throw err;
    }
    paths.forEach(function (path) {
      const _src = `${src}/${path}`;
      const _dst = `${dst}/${path}`;
      let readable;
      let writable;
      stat(_src, function (err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          readable = fs.createReadStream(_src);// 创建读取流
          writable = fs.createWriteStream(_dst);// 创建写入流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
};

const exists = function (src, dst, callback) {
  // 测试某个路径下文件是否存在
  fs.exists(dst, function (exists) {
    if (exists) {// 不存在
      callback(src, dst);
    } else {// 存在
      fs.mkdir(dst, function () {// 创建目录
        callback(src, dst);
      });
    }
  });
};

exists('./public', './fanyoufu.github.io', copy);
