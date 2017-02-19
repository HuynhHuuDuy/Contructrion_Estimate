'use strict';

angular.module('app_work').controller('MaterialCtrl', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {


    $scope.materials = [];
    var buildingItem_id = angular.element("#txt_building_item").val();
    var session_user = angular.element("#txt_session_user").val();
    getDataSheet();


    function getDataSheet() {
        if (typeof (buildingItem_id) != "undefined" && typeof (session_user) != "undefined") {
            dataService.getGroupbyResources(buildingItem_id).then(function (data) {

                var d = 0;
                //load data saved of user
                angular.forEach(data, function (value, key) {

                    var obj = {
                        IndexSheet: d,
                        Category: value.UnitPrice_ID.substring(0, 1),
                        Name: value.Name,
                        Unit: value.Unit,
                        Number: value.Number_Norm,
                        Price: value.Price,
                        Sum: parseFloat(value.Number_Norm) * parseFloat(value.Price),
                        UnitPrice_ID: value.UnitPrice_ID,
                        BuildingItem_ID: ""
                    };

                    $scope.materials.push(obj);
                    d = parseInt(d) + 1;

                });

                for (var i = d; i < 500; i++) {
                    $scope.materials.push({ IndexSheet: i });
                }

            });
        }
        else {
            //create sheet
            for (var i = 0; i < 500; i++) {
                $scope.materials.push({ IndexSheet: i });
            }
        }
    };

    $scope.location_focus = function ($event) {
        //focus and get id sheet
        var div = angular.element($event.currentTarget).parent().parent();
        var column_header = div.find(".column_header input");
        column_header.css({ "background-color": "#D4D4D4" });

        var index_eq = angular.element($event.currentTarget).parent().index();
        var row_header = angular.element("#sheet_cellheader");
        row_header.find("div").eq(index_eq).css({ "background-color": "#D4D4D4" });

        $scope.location_blur = function () {
            //focus and get id sheet
            div = angular.element($event.currentTarget).parent().parent();
            column_header = div.find(".column_header input");
            column_header.css({ "background-color": "#eaeaea" });

            index_eq = angular.element($event.currentTarget).parent().index();
            row_header = angular.element("#sheet_cellheader");
            row_header.find("div").eq(index_eq).css({ "background-color": "#eaeaea" });
        }
    }

    
    $scope.focus = function (value_focus, $event) {
        var div = angular.element($event.currentTarget).parent().parent();
        var id = div.find(".column_header input").val();

        $scope.blur = function (value_blur) {
            if (value_focus != value_blur) {

                //calculate sum
                var sum = parseFloat($scope.materials[id].Number) * parseFloat($scope.materials[id].Price);
                $scope.materials[id].Sum = sum;

                //saving price updated to database
                SavePricetoDatabase($scope.materials[id]);
            }
        };
    };


    function SavePricetoDatabase(items) {
        if (typeof (buildingItem_id) != "undefined" && typeof (session_user) != "undefined") {
            $scope.message_save = true;
            var unitprice_id = items.UnitPrice_ID;
            var price = items.Price;
            var obj = {
                BuildingItem_ID: buildingItem_id,
                UnitPrice_ID: unitprice_id,
                Price: price
            };

            $http({
                method: "post",
                url: "/HangMuc/post_updateprice",
                data: JSON.stringify(obj),
                dataType: "json",
            })
                .success(function (result) {
                    //display message
                    window.setTimeout(function () { $scope.message_save = false; }, 100);
                });
        }
        else {
            $scope.message_save = true;
            angular.element("#Message_saved").text("Bạn chưa đăng nhập...!!!");
        }

    };

}]);