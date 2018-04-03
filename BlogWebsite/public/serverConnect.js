(function () {
  angular.module("Post", []).controller("Listener", PostInteract);

  function PostInteract($scope, $http) {
    $scope.submitPost = submitPost;
    $scope.displayNewest = displayNewest;
    $scope.displayOldest = displayOldest;

    var pathSplit = window.location.href.split('/');
    if (pathSplit[pathSplit.length - 1] == "index.html") {
      displayNewest();
    }

    function loadPosts(sortBy) {
      $http.get("/posts").then(function(posts){
        document.getElementById("postsBox").innerHTML = "<br>";
        for(var i = 0; i < posts.data.length; i++) {
          if (sortBy === "Newest") {
            document.getElementById("postsBox").innerHTML += (
              "</postTitle><br><postBody>" + posts.data[(posts.data.length -1) - i].content +
              "</postBody><br></div>"
            );
          }
          else if (sortBy === "Oldest") {
            document.getElementById("postsBox").innerHTML += (
              "<div class='post'> <postTitle>" + posts.data[i].title +
              "</postTitle><br><postBody>" + posts.data[i].content +
              "</postBody><br></div>"
            );
          }
        }
        document.getElementById("postsBox").innerHTML += "<br><br>";
        document.getElementById("postHeading").innerHTML =  "All Posts(" + sortBy + " First):";
      });
    }

    function submitPost(post) {
      $http.post("/posts", post);
      window.location = "./index.html";
    }

    function displayNewest() {
      loadPosts("Newest");
    }

    function displayOldest() {
      loadPosts("Oldest");
    }
  }
})();
