// DOM Calling
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons")

var formSubmitHandler = function(event) {
  event.preventDefault();
  
  // get value from input element
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username)
    nameInputEl.value=""
  } else {
    alert("Please enter a GitHub username")
  }
}

var getUserRepos = function(users) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + users + "/repos";

  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
    // check response
    if (response.ok) {
      // returns promise --> .then() is a function in case the promise returns resolved in which case it response with the user data
      response.json().then(function(data) {
        // display json data, data is the derivative of what was called, user was called from the form
        console.log(data)
        displayRepos(data, users)
      });
    // if no response
    } else {
      alert("Error:gitHub User Not Found")
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
};

var displayRepos = function(repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
 
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i=0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center"

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = 
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl)

    // append container to the dom
    repoContainerEl.appendChild(repoEl)
  }
}

var getFeaturedRepos = function(language) {
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data)
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: GitHub User Not Found');
    }
  });
};

var buttonClickHandler = function(event) {
  // get the language attribute from the clicked element
  var language = event.target.getAttribute("data-language");

  if (language) {
    getFeaturedRepos(language);

    // clear old content
    repoContainerEl.textContent = "";
  }
};

languageButtonsEl.addEventListener("click", buttonClickHandler);
userFormEl.addEventListener("submit", formSubmitHandler);