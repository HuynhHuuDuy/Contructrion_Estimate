angular.module('unitprice', [])
.controller('UnitPrice_Controller', ['$scope', '$http', function ($scope, $http) {

    $scope.list_all_Price = null;
    $scope.list_temp_Price_Add = [];
    $scope.list_temp_Price_Edit = [];
    $scope.show_default_Price = true;
    $scope.list_area = [];
    var area_id_now = null;
    getArea();
    function getArea() {
        $http.get('/UnitPrice/GetArea_PriceUser').then(function (response) {
            $scope.list_area = response.data;
            //console.log($scope.list_area);
        }, function (response) {
            //Showing errors
        });
    };

    $scope.list_ResourceUser = [];
    $scope.list_ResourceUser_length = 0;

    function getListPrice_User(id) {
        return $http({
            method: "GET",
            url: "/UnitPrice/GetResource_User",
            params: { id: id }
        })
            .then(function (response) {
                $scope.list_ResourceUser = response.data;
                $scope.list_ResourceUser_length = response.data.length;
            }, function (response) {
                //showing errors
            });
    };

    $scope.submit_unitprice = function () {

        var obj = {
            Name: $scope.Name,
            Address: $scope.Address
        };
        $http({
            method: "post",
            url: "/UnitPrice/post_createUnitPrice",
            data: JSON.stringify(obj),
            dataType: "json",
        })
         .then(function (result) {
             open_alert("success");
             location.reload();
         });
    };

    $scope.show_Resource = function (id) {
        getListPrice_User(id);
        $scope.table_Resource = true;

        //put area_id to add resourse
        area_id_now = id;
    };


    $scope.delete_unitPrice = function (id) {

    };

    $scope.btn_editPrice = function ($event) {

        var td = angular.element($event.currentTarget).parent();
        var input = td.find("input");
        input.css("display", "");

    };

    //change resource price in unitprice
    $scope.blur = function (x) {
        var d = $scope.list_temp_Price_Edit.indexOf(x);
        //checked and then unchecked
        if (d > -1) {
            //delete work when uncheck
            $scope.list_temp_Price_Edit.splice(d, 1);
        }
        else {
            $scope.list_temp_Price_Edit.push(x);
        }
    };

    $scope.btn_addResource = function () {
        $scope.list_temp_Price_Add = [];
        if ($scope.list_all_Price == null) {
            $http.get('/UnitPrice/GetDSDonGia').then(function (response) {
                $scope.list_all_Price = response.data;
            }, function (response) {
                //Showing errors
            });

        }
    };

    $scope.checkbox_search = function (x) {
        var d = $scope.list_temp_Price_Add.indexOf(x);
        //checked and then unchecked
        if (d > -1) {
            //delete work when uncheck
            $scope.list_temp_Price_Add.splice(d, 1);
        }
        else {
            $scope.list_temp_Price_Add.push(x);
        }
    };

    //save resource when user search and save with element
    $scope.btn_display_Resource = function () {

        var list_temp = [];
        angular.forEach($scope.list_temp_Price_Add, function (value, key) {
            var obj = {
                Area_ID: area_id_now,
                UnitPrice_ID: value.UnitPrice_ID,
                Price: value.Price
            };
            list_temp.push(obj);
        });

        $http({
            method: "post",
            url: "/UnitPrice/Save_Resource",
            data: JSON.stringify(list_temp),
            dataType: "json",
        })
         .then(function (result) {
             if (result.data == "ok") {
                 //console.log($scope.list_temp_Price_Add);
                 angular.forEach($scope.list_temp_Price_Add, function (value, key) {
                     $scope.list_ResourceUser.unshift(value);
                     //add value into top table.
                     //$scope.list_ResourceUser.push(value);
                     open_alert("success");
                 });
             }
         });
    };

    //save resource when user edit price
    $scope.btn_SavePrice = function () {
        var list_temp = [];
        angular.forEach($scope.list_temp_Price_Edit, function (value, key) {
            var obj = {
                Area_ID: area_id_now,
                UnitPrice_ID: value.UnitPrice_ID,
                Price: value.Price
            };
            list_temp.push(obj);
        });

        $http({
            method: "post",
            url: "/UnitPrice/Save_Resource",
            data: JSON.stringify(list_temp),
            dataType: "json",
        })
         .then(function (result) {
             if (result.data == "ok") {
                 open_alert("success");
             }
         });
    };
}]);
