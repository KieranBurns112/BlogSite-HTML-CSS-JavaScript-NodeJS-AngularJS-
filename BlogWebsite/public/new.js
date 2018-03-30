(function () {
  angular
    .module("newPost", [])
    .controller("inputListener", inputPost);

  function inputPost($scope, $http) {
    $scope.submitPost = submitPost;

    function submitPost(post) {
      $http.post("/newPost", post);
    }
  }
})();
