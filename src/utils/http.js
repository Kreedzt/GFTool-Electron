const request = require('request');
const logger = require('electron-log');
const { AccessCode } = require('../config');

const BaseUrl = 'https://api.github.com/graphql';

const RepoQuery = `{
  repository(name: "GFTool", owner: "hycdes") {
    id
    commitComments(first: 10) {
      nodes {
        commit {
          id
          committedDate
        }
      }
    }
}`;

// TODO: 权限异常
const getRepoLastCommit = callback =>
  request.post(
    `${BaseUrl}/graphql`,
    {
      headers: {
        'User-Agent': 'request',
        Authorization: AccessCode,
        'content-type': 'application/json'
      },
      json: true,
      // auth: {
      //   user: 'Kreedzt',
      //   pass: AccessCode
      // },
      body: JSON.stringify({
        query: RepoQuery,
        variables: {}
      })
    },
    callback
  );

/**
 * Test GitHub Url request
 */
function testReq() {
  logger.info('sending request...');
  getRepoLastCommit((error, response, body) => {
    if (error) {
      logger.error('err', error);
    } else {
      logger.info('response', response);
      logger.info('body', body);
    }
  });
}

module.exports = {
  getRepoLastCommit,
  testReq
};
