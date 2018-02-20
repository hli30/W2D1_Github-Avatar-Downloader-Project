const request = require("request");
const fs = require("fs");
const dotenv = require('dotenv').config()
var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "request",
      "Authorization": "token " + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on("error", function(err) {
      throw err;
    })
    .on("end", function() {
      console.log("Download completed");
    })
    .pipe(fs.createWriteStream(filePath));
}

//Checks for input errors, .env missing/incorrect errors, before starting the program
if(process.argv.length !== 4) {
  throw "Incorrect number of arguments entered, please enter two parameters (repoOwner repoName)."
}

if(!fs.existsSync(".env")) {
  throw ".env file missing.";
}

if(!process.env.GITHUB_TOKEN){
  throw ".env is missing information."
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  result = JSON.parse(result);

  //Checks if user input (owner and repo name) exists in github
  if(result.message === "Not Found") {
    throw "Either the repoOwner or the repoName entered does not exist.";
  }

  //Checks for correct credentials
  if(result.message === "Bad credentials") {
    throw ".env has incorrect token";
  }

  //Checks if download directory exists, if not, make the directory
  let saveDir = "./avatar/";
  if(!fs.existsSync(saveDir)){
    fs.mkdirSync(saveDir);
  }

  result.forEach(function(data) {
    downloadImageByURL(data.avatar_url, saveDir + data.login + ".jpg");
  });
});