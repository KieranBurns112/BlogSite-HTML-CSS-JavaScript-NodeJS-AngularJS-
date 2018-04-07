(function () {
  angular.module('Post', []).controller("Listener", PostInteract);

  function PostInteract($scope, $http, $compile) {
    $scope.loadPosts = loadPosts;
    $scope.newPostForm = newPostForm;
    $scope.newPost = newPost;
    $scope.amendPostForm = amendPostForm;
    $scope.amendPost = amendPost;
    $scope.deletePost = deletePost;

    $scope.logInForm = logInForm;
    $scope.logIn = logIn;
    $scope.signUpForm = signUpForm;
    $scope.signUp = signUp;
    $scope.logOut = logOut;

    var userName = null;
    var postModal = document.getElementById('postModal');
    var amendModal = document.getElementById('amendModal');
    var logInModal = document.getElementById('logInModal');
    var signUpModal = document.getElementById('signUpModal');

    loadPosts('Newest');

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
              var delById = "deletePost('" + posts.data[order]._id + "')";
              var amById = "amendPostForm('" + posts.data[order]._id + "')";
              var firstTag = (
                "<div class='post'><button ng-click=" + delById  + " class=\"deleteButton\">Delete Post</button>" +
                "<button ng-click=" + amById  + " class=\"amendButton\">Edit Post</button>"
              );
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

    function newPostForm() {
      if (userName != null) {
        postModal.style.display = "block";
      }
      else {
        logInForm();
      }
    }

    function newPost(post) {
      post.userName = userName;
      $http.post('/posts', post).then(function() {
        postModal.style.display = "none";
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        loadPosts('Newest');
      });
    }

    function amendPostForm(postId) {
      $http.get('/posts/' + postId).then(function(foundPost){
        amendModal.style.display = "block";
        document.getElementById('amendTitle').value = foundPost.data.title;
        document.getElementById('amendContent').value = foundPost.data.content;
        document.getElementById('editButton').innerHTML = null;
        var buttonHTML = (
          "<button ng-click='amendPost(\""+  postId +"\")'>Edit</button>"
        );
        var temp = $compile(buttonHTML)($scope);
        angular.element(document.getElementById('editButton')).append(temp);
      });
    }

    function amendPost(postId) {
      var updatePost = new Object();
      updatePost.title = document.getElementById('amendTitle').value;
      updatePost.content = document.getElementById('amendContent').value;
      $http.put('/posts/' + postId, updatePost).then(function() {
        amendModal.style.display = "none";
        loadPosts('Newest');
      });
    }

    function deletePost(postId) {
      $http.delete('/posts/' + postId).then(function() {
        loadPosts('Newest');
      });
    }

    function logInForm() {
      logInModal.style.display = "block";
    }

    function logIn(user) {
      var userExists = false;
      var logInSuccess = false;
      $http.get('/users').then(function(users) {
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

    function signUpForm() {
      signUpModal.style.display = "block";
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
            $http.post('/users', user).then(function() {
              signUpModal.style.display = "none";
              document.getElementById('signUpUserName').value = '';
              document.getElementById('signUpPassword').value = '';
              document.getElementById('logInUserName').value = '';
              document.getElementById('logInPassword').value = '';
              loadPosts('Newest');
            });
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

    window.onclick = function(event) {
      if (event.target == postModal) {
          postModal.style.display = "none";
          document.getElementById('title').value = '';
          document.getElementById('content').value = '';
      }
      if (event.target == amendModal) {
          amendModal.style.display = "none";
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
})();
