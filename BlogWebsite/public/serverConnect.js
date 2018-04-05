(function () {
  angular.module('Post', []).controller("Listener", PostInteract);

  function PostInteract($scope, $http, $compile) {
    $scope.loadPosts = loadPosts;
    $scope.newPostForm = newPostForm;
    $scope.newPost = newPost;
    $scope.amendPost = amendPost;
    $scope.deletePost = deletePost;

    $scope.signUpForm = signUpForm;
    $scope.signUp = signUp;
    $scope.logInForm = logInForm;
    $scope.logIn = logIn;
    $scope.logOut = logOut;

    loadPosts('Newest');

    var userName = null;

    function loadPosts(sortBy) {
      $http.get('/posts').then(function(posts){
        document.getElementById('postsBox').innerHTML = "<br>";
        if (posts.data.length == 0) {
          document.getElementById('postsBox').innerHTML += (
            "There are no posts! Make one by clicking 'New Post' above!"
          );
        }
        else {
          for(var i = 0; i < posts.data.length; i++) {
            //Newest to Oldest by default
            var order = (posts.data.length -1) - i;
            if (sortBy === 'Oldest') {
              order = i;
            }

            var firstTag = "<div class='post'>"
            if (userName === posts.data[order].userName || userName === 'Admin' ) {
              //Visible permissions to edit or delete a post
              var firstTag = "<div class='post'>"
            }

            var theHTMLbit = (
              firstTag + "<postTitle>" +  posts.data[order].title +
              " - " + posts.data[order].userName + "</postTitle><br><postBody>"
              + posts.data[order].content +"</postBody><br></div>"
            );
            var temp = $compile(theHTMLbit)($scope);
            angular.element(document.getElementById('postsBox')).append(temp);
          }
        }
        var HTMLpadding = "<br><br>";
        var temp = $compile(HTMLpadding)($scope);
        angular.element(document.getElementById('postsBox')).append(temp);
      });
    }

    var postModal = document.getElementById('postModal');
    var logInModal = document.getElementById('logInModal');
    var signUpModal = document.getElementById('signUpModal');

    function newPostForm() {
      if (userName != null) {
        postModal.style.display = "block";
      }
      else {
        logInForm();
      }
    }

    function logInForm() {
      logInModal.style.display = "block";
    }

    function signUpForm() {
      signUpModal.style.display = "block";
    }

    window.onclick = function(event) {
      if (event.target == postModal) {
          postModal.style.display = "none";
          document.getElementById('title').value = '';
          document.getElementById('content').value = '';
      }
      if (event.target == logInModal) {
          logInModal.style.display = "none";
          document.getElementById('logInUserName').value = '';
          document.getElementById('logInPassword').value = '';
      }
      if (event.target == signUpModal) {
          signUpModal.style.display = "none";
          document.getElementById('signUpUserName').value = '';
          document.getElementById('signUpPassword').value = '';
      }
    }

    function newPost(post) {
      post.userName = userName;
      $http.post('/posts', post);
      postModal.style.display = "none";
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
      loadPosts('Newest');
    }

    function amendPost() {

    }

    function deletePost(post) {
      $http.delete('/posts', post);
      loadPosts('Newest');
    }

    function signUp(user) {
      var userExists = false;

      if (user.userName != null) {
        $http.get('/users', user).then(function(users){
          for(var i = 0; i < users.data.length; i++) {
            if (user.UserName === users.data[i].userName) {
              userExists = true;
            }
          }
        });

        if (!userExists) {
          if (user.password != null) {
            $http.post('/users', user);
            signUpModal.style.display = "none";
            document.getElementById('signUpUserName').value = '';
            document.getElementById('signUpPassword').value = '';
            document.getElementById('logInUserName').value = '';
            document.getElementById('logInPassword').value = '';
            loadPosts('Newest');
          }
          else {
            alert("Password field is blank!");
          }
        }
        else {
          alert("Username is already taken!");
        }
      }
      else {
        alert("Password field is blank!");
      }
    }

    function logIn(user) {
      var userExists = false;
      var logInSuccess = false;
      $http.get('/users').then(function(users){
        for(var i = 0; i < users.data.length; i++) {
          if (user.userName === users.data[i].userName) {
            userExists = true;
          }
          if (userExists) {
            if (user.password === users.data[i].password) {
              logInSuccess = true;
              userName = user.userName;
            }
          }
        }

        if (userExists) {
          if (logInSuccess) {
            postModal.style.display = "none";
            var theHTMLbit = (
              "<button ng-click='logOut()'>Log Out</button>" +
              "<name>" + userName + "</name>"
            );
            var temp = $compile(theHTMLbit)($scope);
            document.getElementById('logStatus').innerHTML = null;
            angular.element(document.getElementById('logStatus')).append(temp);
            logInModal.style.display = "none";
            document.getElementById('logInUserName').value = '';
            document.getElementById('logInPassword').value = '';
            document.getElementById('signUpUserName').value = '';
            document.getElementById('signUpPassword').value = '';
            loadPosts('Newest');
          }
          else {
            alert("Incorrect Password!");
          }
        }
        else {
          alert("User does not Exist, please select Sign Up!");
        }
      });
    }

    function logOut() {
      userName = null;
      var theHTMLbit = (
        "<button ng-click='signUpForm()'>Sign Up</button>" +
        "<button ng-click='logInForm()'>Log In</button>"
      );
      var temp = $compile(theHTMLbit)($scope);
      document.getElementById('logStatus').innerHTML = null;
      angular.element(document.getElementById('logStatus')).append(temp);
      loadPosts('Newest');
    }
  }
})();
