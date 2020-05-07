const axios = require('axios');
const { win } = require('..');
const { GitHubToken } = require('../config');

const http = axios.create({
  baseURL: '//api.github.com/graphql'
});

const reqInterceptor = req => {
  req.auth = {
    Kreedzt: GitHubToken
  };

  return req;
};

const resInterceptor = res => {
  if (res.status !== 200) {
    console.log('Request Error:', res.data);
  }

  return res.data;
};

http.interceptors.request.use(reqInterceptor);

http.interceptors.response.use(resInterceptor);

const RepoQuery = `{
  viewer {
    login
  }
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
  }
}`;

const getRepoLastCommit = () => http.post('', RepoQuery);

/**
 * Test GitHub Url request
 */
function testReq() {
  console.log('sending request...');
  getRepoLastCommit().then(res => {
    console.log('Repo last commit', res);
  });
}

module.exports = {
  getRepoLastCommit,
  testReq
};
