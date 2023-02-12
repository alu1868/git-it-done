var getUserRepos = function(users) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + users + "/repos";

  // make a request to the url
  fetch(apiUrl).then(function(response) {
    // returns promise --> .then() is a function in case the promise returns resolved
    response.json().then(function(data) {
      // display json data
      console.log(data)
    });
  });
};

getUserRepos();
