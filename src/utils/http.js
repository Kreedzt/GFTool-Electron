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

const ApplicationQuery = `{
  repository(name: "GFTool-Electron", owner: "Kreedzt") {
    id
    releases(last: 1) {
      nodes {
        id
        description
        createdAt
        tagName
      }
    }
  }
}`;

const getRepoLastCommit = () =>
  superagent
    .post(`${BaseUrl}/graphql`)
    .set('Authorization', AccessCode)
    .set('User-Agent', 'request')
    .timeout({
      response: 3000, // 发送请求后 5 秒视为超时
      deadline: 30000, // 允许响应延迟
    })
    .send({
      query: RepoQuery,
      variables: {},
    });

const getLatestRelease = () =>
  superagent
    .post(`${BaseUrl}/graphql`)
    .set('Authorization', AccessCode)
    .set('User-Agent', 'request')
    .timeout({
      response: 3000, // 发送请求后 5 秒视为超时
      deadline: 30000, // 允许响应延迟
    })
    .send({
      query: ApplicationQuery,
      variables: {},
    });

/**
 * Get latest web page commit info
 */
async function getWebPageCommit() {
  logger.info('getWebPageCommit fn');

  let latestCommitInfo;

  try {
    const res = await getRepoLastCommit();
    logger.info('getRepoLastCommit res:', res.body, res.status);

    if (res.timeout) {
      logger.error('getRepoLastCommit timeout');
    } else {
      [latestCommitInfo] = res.body.data.repository.ref.target.history.nodes;
      logger.info('lastest commit:', latestCommitInfo);
    }
  } catch (err) {
    logger.error('getRepoLastCommit err:', err.message, err.response);
  }

  return latestCommitInfo;
}

/**
 * Get latest Application release info
 */
async function getApplicationRelease() {
  logger.info('getApplicationRelease fn');

  let latestReleaseInfo;

  try {
    const res = await getLatestRelease();
    logger.info('getApplication latest release res:', res.body.res.status);

    if (res.timeout) {
      logger.error('getApplicationRelease timeout');
    } else {
      [latestReleaseInfo] = res.body.data.repository.releases.nodes;
    }
  } catch (err) {
    logger.error('getApplicationRelease err:', err.message, err.response);
  }

  return latestReleaseInfo;
}

module.exports = {
  getRepoLastCommit,
  getWebPageCommit,
  getApplicationRelease,
};
