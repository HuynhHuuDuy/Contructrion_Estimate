'use strict';

angular.module('app_work').controller('General_Ctrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

    //lay gia tri  id hang muc
    var buildingItem_id = angular.element("#txt_building_item").val();
    console.log(buildingItem_id);
    //   
    //tên biến lưu trữ

    $scope.namehangmuc = [];
    $scope.namecongtrinh = [];  
    $scope.total = [];
    //gettotal();
    // lấy giá trị từ controller
    function get_namebuildingitem(){
        return $http({
            method: "GET",
            url: "/HangMuc/get_namebuildingitem",
            params: { id: buildingItem_id }
        })
        .then(function (response) {
            $scope.namehangmuc = response.data[0];
            console.log($scope.namehangmuc);
           // return response.data;
        }, function (response) {
            //showing errors
        });

    };
    function get_namebuilding() {
        return $http({
            method: "GET",
            url: "/HangMuc/get_namebuilding",
            params: {id: buildingItem_id }
        })
          .then(function (response) {
              $scope.namecongtrinh = response.data[0];
              console.log($scope.namecongtrinh);
             // return response.data;
          }, function (response) {
              //showing errors
          });
    };
    //function get_total() {
    //    return $http({
    //        method: "GET",
    //        url: "/HangMuc/gettotal",
    //        params: { buildingitem_id: buildingitem_id }
    //    })
    //        .then(function (response) {
    //            console.log(response.data);
    //            return response.data;
    //        }, function (response) {
    //            //showing errors
    //        });
    //}
    get_namebuildingitem();
    get_namebuilding();
    //get_total();

}]);
