(function () {
  angular.module("Post", []).controller("Listener", PostInteract);

  function PostInteract($scope, $http) {
    $scope.submitPost = submitPost;

    loadPosts();

    function loadPosts() {
      var pathSplit = window.location.href.split('/');
      if (pathSplit[pathSplit.length - 1] == "index.html") {
        $http.get("/posts").then(function(posts){
          document.getElementById("postsBox").innerHTML = "<br>"
          for(var i = 0; i < posts.data.length; i++) {
            document.getElementById("postsBox").innerHTML += (
              "<div class='post'> <postTitle>" + posts.data[i].title +
              "</postTitle><br><postBody>" + posts.data[i].content +
              "</postBody><br></div>"
            )
          }
          document.getElementById("postsBox").innerHTML += "<br><br>"
        });

      }
    }

    function submitPost(post) {
      $http.post("/posts", post);
      window.location = "./index.html";
    }
  }
})();
