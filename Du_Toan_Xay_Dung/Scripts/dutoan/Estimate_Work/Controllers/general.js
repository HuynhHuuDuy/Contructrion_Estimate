'use strict';

angular.module('app_work').controller('General', ['$scope', '$http', '$rootScope', 'dataService', '$filter', function ($scope, $http, $rootScope, dataService, $filter) {

    //...
    var buildingItem_id = angular.element("#txt_building_item").val();
    //   
    //tên biến lưu trữ
    
    $scope.namehangmuc = [];
    getname_Buildingitem();

    $scope.namecongtrinh = [];
    getname_building();

    $scope.total = [];
    gettotal();
    // lấy giá trị từ controller

    function get_namebuildingitem() {
        dataService.get_namebuildingitem(buildingItem_id).then(function (data) {
            var eachItem;
            angular.forEach(data, function (value, key) {
                eachItem = {
                    name:value.name
                };
                $scope.namehangmuc.push(eachItem);
            });
        });
    };
    function get_namebuidling() {
        dataService.get_namebuilding(buildingItem_id).then(function (data) {
            var eachItem;
            angular.forEach(data, function (value, key) {
                eachItem = {
                    name:value.name
                };
                $scope.namecongtrinh.push(eachItem);
            });
        });
        

    };
    function get_total() {
        dataService.get_total(buildingItem_id).then(function (data) {
            var eachItem;
            angular.forEach(data, function (value, key) {
                eachItem = {
                    name: value.total
                };
                $scope.total.push(eachItem);
            });
        });


    };
}
])
