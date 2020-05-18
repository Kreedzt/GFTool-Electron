const fs = require('fs');

const encode = 'utf8';

const promisedAccessFile = (...params) =>
  new Promise((resolve, reject) => {
    fs.access(...params, fs.constants.R_OK, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const promisedMkdir = (...params) =>
  new Promise((resolve, reject) => {
    fs.mkdir(...params, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const promisedReadFile = (...params) =>
  new Promise((resolve, reject) => {
    fs.readFile(...params, encode, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });

const promisedWriteFile = (...params) =>
  new Promise((resolve, reject) => {
    fs.writeFile(...params, encode, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });

const promisedReadDir = (...params) =>
  new Promise((resolve, reject) => {
    fs.readdir(...params, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

module.exports = {
  encode,
  promisedAccessFile,
  promisedReadFile,
  promisedWriteFile,
  promisedMkdir,
  promisedReadDir,
};
