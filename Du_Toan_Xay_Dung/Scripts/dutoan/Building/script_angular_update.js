angular.module('postApp', [])
.controller('postController', ['$scope', '$http', function ($scope, $http) {
    $scope.stepsModel = [];
    $scope.listfile = [];  //list file
    $scope.listdropbox = [];
    var fd = new FormData();

    //list all Image have saved
    $scope.list_Imageold_deleted = [];
    $scope.btn_deleteImageold = function ($event) {
        $scope.submit_deleteImageold = function () {
            var div_parent = angular.element($event.currentTarget).parent();
            var url = div_parent.find("img").attr("data-attr");
            $scope.list_Imageold_deleted.push(url);
            div_parent.remove();
        };
    };

    $scope.uploadedFile = function (event) {
        $scope.div_showImagenew = {
            "display": ""
        }
        $scope.$apply(function ($scope) {
            $scope.files = event.files;
        });
        $scope.stepsModel = [];
        var files = event.target.files; //FileList object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
            $scope.listfile.push(file);
        }

        //console.log($scope.listfile);
    }
    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            var image = {};
            image.Name = e.target.fileName;
            image.Size = (e.total / 1024).toFixed(2);
            image.Src = e.target.result;
            $scope.stepsModel.push(image);
            var specify_image = {
                url: image.Src,
                filename: image.Name
            };
            $scope.listdropbox.push(specify_image);
        });
    }

    $scope.submit = function () {
        fd.append("ID", $scope.congtrinh.ID);
        fd.append("Name", $scope.congtrinh.Name);
        fd.append("Description", $scope.congtrinh.Description);
        fd.append("Address", $scope.congtrinh.Address);
        if ($scope.listfile) {
            angular.forEach($scope.listfile, function (value, key) {
                fd.append("img_congtrinh", value);

            });
        }
        if ($scope.list_Imageold_deleted) {
            angular.forEach($scope.list_Imageold_deleted, function (value, key) {
                fd.append("img_old", value);

            });
        }
        $http.post('/CongTrinh/post_updatecongtrinh', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
              .then(function (result) {
                  if (result.data == "ok") {
                      open_alert("success");
                      window.location.href = "/CongTrinh/Index";
                  } else {
                      open_alert("fail");

                  }
              });
    };
    $scope.return = function () {
        window.location.href = "/CongTrinh/Index";
    }
    $scope.savetodropbox = function () {
        var options = {
            files: $scope.listdropbox,

            // Success is called once all files have been successfully added to the user's
            // Dropbox, although they may not have synced to the user's devices yet.
            success: function () {
                // Indicate to the user that the files have been saved.
                alert("Success! Files saved to your Dropbox.");
            },

            // Progress is called periodically to update the application on the progress
            // of the user's downloads. The value passed to this callback is a float
            // between 0 and 1. The progress callback is guaranteed to be called at least
            // once with the value 1.
            progress: function (progress) { },

            // Cancel is called if the user presses the Cancel button or closes the Saver.
            cancel: function () { },

            // Error is called in the event of an unexpected response from the server
            // hosting the files, such as not being able to find a file. This callback is
            // also called if there is an error on Dropbox or if the user is over quota.
            error: function (errorMessage) {
            }
        };
        Dropbox.save(options);
    };
    $scope.deleteTempImage = function (idx, $event) {
        $scope.listfile.splice(idx, 1);
        var div_parent = angular.element($event.currentTarget).parent();
        div_parent.remove();
    }

}]);