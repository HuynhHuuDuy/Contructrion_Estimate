
    angular.module('postApp', ['ui.bootstrap'])
   .controller('postController', ['$scope', '$http', '$filter', '$q', function ($scope, $http, $filter, $q) {

       //load list  chi tiết công trình
       $scope.list_buildings = [];
       $scope.list_tempbuildings = [];

       $scope.building_id = 0;

       $scope.totalItems = 0;

       $scope.filteredTodos = [],
       $scope.currentPage = 1,
       $scope.numPerPage = 5,
       $scope.maxSize = 5;

       $http.get('/CongTrinh/Get_AllInfoBuildings').then(function (response) {

           $scope.list_buildings = response.data;
           
           $scope.totalItems = ($scope.list_buildings.length * 2);

           $scope.$watch('currentPage + numPerPage', function () {
               var begin = (($scope.currentPage - 1) * $scope.numPerPage)
               , end = begin + $scope.numPerPage;

               $scope.filteredTodos = $scope.list_buildings.slice(begin, end);

               angular.forEach($scope.filteredTodos, function (value, key) {

                   var d = value.Description.length;
                   if (d > 75) {
                       var s = value.Description.substring(0, 75);
                       value.Description = s;
                   }
               });

           });

       }, function (response) {
           //Showing errors
       });


       $http.get('/CongTrinh/Get_AllInfoBuildings').then(function (response) {

           $scope.list_tempbuildings = response.data;

       }, function (response) {
           //Showing errors
       });

       // upload hình ảnh
       $scope.stepsModel = [];
       $scope.listdropbox = [];
       $scope.listfile = [];//list file
       var fd = new FormData();

       $scope.uploadedFile = function (event) {
           $scope.listfile = [];
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
       }

       $scope.imageIsLoaded = function (e) {
           $scope.$apply(function () {
               var image = {};
               image.Name = e.target.fileName;
               image.Size = (e.total / 1024).toFixed(2);
               image.Src = e.target.result;
               $scope.stepsModel.push(image);
           });
       }

       // thêm công trình
       $scope.submit = function () {
           if ($scope.add.$valid) {
               var tenct = document.getElementById("TenCT").value;
               var mota = document.getElementById("MoTa").value;
               var diachi = document.getElementById("DiaChi").value;
               fd.append("Name", tenct);
               fd.append("Description", mota);
               fd.append("Address", diachi);
               if ($scope.listfile) {
                   for (var i = 0; i < $scope.listfile.length; i++) {

                       fd.append("img_congtrinh", $scope.listfile[i]);
                   }
               }
               $http.post('/CongTrinh/Post_ThemCongTrinh', fd, {
                   transformRequest: angular.identity,
                   headers: { 'Content-Type': undefined }
               })
                 .then(function (result) {
                     if (result.data == "ok") {
                         open_alert("success");
                         location.reload();
                     } else {
                         open_alert("fail");
                     }
                 });
           }
       };


       // xóa hình đã thêm
       $scope.deleteTempImage = function (idx, x) {
           debugger;
           var myEl = angular.element(document.querySelector('#img_box'));
           myEl.remove();
           $scope.listfile.splice(idx, 1);
           fd.delete(idx, x);
       }

       //array did filter
       $scope.building_detail = [];
       $scope.btn_detail_building = function (id) {
           angular.forEach($scope.list_tempbuildings, function (value, key) {
               if (value.ID == id) {
                   $scope.building_detail = value;
                   return;
               }
           });
       };


       $scope.delete = function (id) {
           $scope.building_id = id;
       }
       // xóa công trình
       $scope.submit_deletebuilding = function () {
           var id = $scope.building_id
           $http({
               method: 'POST',
               url: '/CongTrinh/Delete_CongTrinh',
               params: { building_id: id },
               headers: { 'Content-Type': 'application/json' }
           })
               .then(function (result) {

                   if (result.data == "ok") {
                       open_alert("success");
                       location.reload();
                   }
                   else {
                       open_alert("fail");
                   }
               });
       }



       // save dropbox
       $scope.savetodropbox = function (id) {

           var listdropbox = [];

           function asyncGetImages(url) {

               var deferred = $q.defer();

               $http({
                   method: "GET",
                   url: url,
                   params: { ID: id }
               })
                     .then(function (response) {

                         deferred.resolve(response.data);

                     }, function (response) {
                         //showing errors
                         deferred.reject({ message: "Really bad" });
                     });


               return deferred.promise;
           }

           var promise = asyncGetImages("/CongTrinh/get_dataSavetoDropbox");

           promise.then(function (greeting) {

               angular.forEach(greeting, function (value, key) {

                   var obj = {
                       filename: value.name,
                       url: value.src
                   };

                   listdropbox.push(obj);

               });

               //console.log(listdropbox);

               var options = {

                   files: listdropbox,

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

           });



       };

   }]);
