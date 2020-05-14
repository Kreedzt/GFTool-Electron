const superagent = require('superagent');
const log = require('electron-log');
const { AccessCode } = require('../config');

const logger = log.scope('http.js');

const BaseUrl = 'https://api.github.com';

const RepoQuery = `{
  repository(name: "GFTool", owner: "hycdes") {
    id
    ref(qualifiedName: "master") {
      name
      target {
        ... on Commit {
          id
          history(first: 1) {
            nodes {
              committedDate
              id
              oid
              message
            }
          }
        }
      }
    }
  }
}`;

// TODO: 权限异常
const getRepoLastCommit = () => {
  return superagent
    .post(`${BaseUrl}/graphql`)
    .set('Authorization', AccessCode)
    .set('User-Agent', 'request')
    .timeout({
      response: 3000, // 发送请求后 5 秒视为超时
      deadline: 30000 // 允许响应延迟
    })
    .send({
      query: RepoQuery,
      variables: {}
    });
};

/**
 * Get latest web page commit info
 */
async function getWebPageCommit() {
  logger.info('sending request...');

  let latestCommitInfo;

  try {
    const res = await getRepoLastCommit();
    logger.info('getRepoLastCommit res:', res.body, res.status);
    
    if (res.timeout) {
      logger.error('getRepoLastCommit timeout');
    } else {
      latestCommitInfo = res.body.data.repository.ref.target.history.nodes[0];
      logger.info('lastest commit:', latestCommitInfo);
    }
  } catch (err) {
    logger.error('getRepoLastCommit err:', err.message, err.response);    
  }
  
  return latestCommitInfo;
}

module.exports = {
  getRepoLastCommit,
  getWebPageCommit
};
