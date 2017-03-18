angular.module('postApp', ['ui.bootstrap'])
 .controller('postController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

     $scope.building_id = null;

     $scope.totalItems = 0;

     $scope.filteredTodos = [],
     $scope.currentPage = 1,
     $scope.numPerPage = 10,
     $scope.maxSize = 5;

     $scope.get_HangMuc = function () {
         $scope.list_hangmuc = [];
         //get building_id form url;
         var url = window.location.pathname;
         var building_id = url.substring(url.lastIndexOf('/') + 1);
         var regular_expression = /^\d+$/;
         if (regular_expression.test(building_id)) {

             //get building_id from url
             $scope.building_id = building_id;

             return $http({
                 method: "GET",
                 url: "/CongTrinh/Get_HangMuc",
                 params: { id: building_id }
             })
                 .then(function (response) {
                     $scope.list_hangmuc = response.data;
                     $scope.totalItems = $scope.list_hangmuc.length;
                     $scope.$watch('currentPage + numPerPage', function () {
                         var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                         , end = begin + $scope.numPerPage;

                         //$scope.setPage = function (pageNo) {
                         //    $scope.currentPage = pageNo;
                         //};

                         $scope.filteredTodos = $scope.list_hangmuc.slice(begin, end);
                     });

                 }, function (response) {
                     //showing errors
                 });
         };

     };

     $scope.get_HangMuc();

     //array did filter
     $scope.list_temp_inf_edit = [];
     $scope.changeclick = function (data) {

         $scope.list_temp_inf_edit = data;
     };

     //Create building item
     $scope.submit = function () {
         if ($scope.building_id != null) {
             var fd = new FormData();
             if ($scope.add.$valid) {
                 // mact = document.getElementById("MaCT").value;
                 //console.log(mact);
                 var tenhm = document.getElementById("TenHM").value;
                 var mota = document.getElementById("MoTa").value;
                 fd.append("Building_ID", $scope.building_id);
                 fd.append("Name", tenhm);
                 fd.append("Description", mota);
                 $http.post('/CongTrinh/post_themhangmuc', fd, {
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
         }
     };

     //edit building item
     $scope.modify = function () {

         $http({
             method: "post",
             url: "/CongTrinh/post_updatehangmuc",
             data: JSON.stringify($scope.list_temp_inf_edit),
             dataType: "json",
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

     $scope.delete_buildingItem = function (data) {
         var r = confirm("Bạn có thật sự muốn xóa...?");

         if (r == true) {

             var id = data.ID;

             $http({
                 method: "post",
                 url: "/CongTrinh/post_deleteHangMuc",
                 params: { id: id },
                 dataType: "json",
             })
                 .then(function (result) {
                     if (result.data == "ok") {
                         open_alert("success");
                         location.reload();
                     }
                 });

         };
     }


 }]);
