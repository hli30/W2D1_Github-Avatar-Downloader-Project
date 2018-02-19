const request = require("request");
const secrets = require("./secrets");
const fs = require("fs");

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "request",
      "Authorization": "token " + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("hli30", "MTClicker", function(err, result) {
    console.log("Errors:", err);
    result = JSON.parse(result);
    result.forEach(function(data) {
      downloadImageByURL(data.avatar_url, "./" + data.login + ".jpg");
    });
});

function downloadImageByURL(url, filePath) {
    request.get(url)
      .on("error", function(err) {
        console.log(err);
      })
      .on("end", function() {
        console.log("Download completed");
      })
      .pipe(fs.createWriteStream(filePath));
}