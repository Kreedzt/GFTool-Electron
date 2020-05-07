const path = require('path');
const fs = require('fs');
const {
  promisedReadDir,
  promisedWriteFile,
  promisedReadFile
} = require('./promisedFs');

const REPLACE_SOURCE_STR = '../../../WebTools/GFTool/';
const PAGES_FOLDER_PATH = path.join(__dirname, '../../public/pages');

/**
 * replace files href & src path
 * @param fileNames {Array}
 */
const replacePath = fileNames => {
  const wrappedArr = fileNames.map(fileName => {
    const wholeName = path.join(PAGES_FOLDER_PATH, fileName);
    console.log('wholeName', wholeName);
    return () =>
      promisedReadFile(wholeName).then(content => {
        // console.log('content', content);
        const res = content.split(REPLACE_SOURCE_STR).join('');
        return promisedWriteFile(wholeName, res);
      });
  });

  return Promise.all(wrappedArr.map(fn => fn()));
};

promisedReadDir(PAGES_FOLDER_PATH).then(fileNames => {
  replacePath(fileNames)
    .then(() => {
      console.log('修改成功');
    })
    .catch(err => {
      console.log('修改失败');
      throw err;
    });
});

fs.readdir(PAGES_FOLDER_PATH, (err, files) => {
  if (err) {
    console.error('未找到public目录, 程序可能运行异常');
  } else {
    console.log('files', files);
  }
});
