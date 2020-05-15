const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const {
  promisedReadDir,
  promisedWriteFile,
  promisedReadFile
} = require('./promisedFs');

const logger = log.scope('fixPath.js');

const REPLACE_SOURCE_STR = '../../../WebTools/GFTool/';
const PAGES_FOLDER_PATH = path.join(__dirname, '../../public/pages');

/**
 * replace files href & src path
 * @param fileNames {Array}
 */
const replacePath = fileNames => {
  const wrappedArr = fileNames.map(fileName => {
    const wholeName = path.join(PAGES_FOLDER_PATH, fileName);
    logger.info('wholeName', wholeName);
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
      logger.info('修改成功');
    })
    .catch(err => {
      logger.error('修改失败');
      throw err;
    });
});

fs.readdir(PAGES_FOLDER_PATH, (err, files) => {
  if (err) {
    logger.error('未找到public目录, 程序可能运行异常');
  } else {
    logger.info('files', files);
  }
});
