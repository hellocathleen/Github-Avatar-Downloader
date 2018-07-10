var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

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
      cb(err, data.forEach(function(data) {
          console.log(data.avatar_url);
      }))
  })
}

function downloadImageByURL(url, filePath) {
    request.get(url)
            .on('error', function(err){
                throw err;
            })
            .pipe(fs.createWriteStream(filePath));
    }

getRepoContributors("jquery", "jquery", function (err, result){
    console.log("Errors:", err);
    console.log("Result:", result);
});

downloadImageByURL('https://avatars2.githubusercontent.com/u/2741?v=3&s=466', 'avatars/kvirani.jpg');