var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
//welcome message
console.log('Welcome to the GitHub Avatar Downloader!');

//require arguments
if (!process.argv[2] || !process.argv[3]) {
  throw 'You must enter both a repoOwner and a repoName';
}

//create function to find repo contributors for a given repoOwner and repoName
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

//create function to get image based on avatar url
function downloadImageByURL(url, filePath) {
  request.get(url)
          .on('error', function(err){
              throw err;
          })
          .pipe(fs.createWriteStream(filePath));
}

//invoke function and pass callback linking downloadImageByURL
getRepoContributors(process.argv[2], process.argv[3], function (err, result) {
  result.forEach(function(element) {
    downloadImageByURL(element.avatar_url, "avatars/" + element.login + ".jpg");
  })
});