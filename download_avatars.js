var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');
if (!process.argv[2] || !process.argv[3]) {
  throw 'You must enter both a repoOwner and a repoName';
}

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body){
    var data = JSON.parse(body);
    cb(err, data)
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
          .on('error', function(err){
              throw err;
          })
          .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function (err, result) {
  result.forEach(function(element) {
    downloadImageByURL(element.avatar_url, "avatars/" + element.login + ".jpg");
  })
});

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
