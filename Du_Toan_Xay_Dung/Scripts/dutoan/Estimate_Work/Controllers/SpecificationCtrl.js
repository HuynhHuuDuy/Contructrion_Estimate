'use strict';

angular.module('app_work').controller('SpecificationCtrl', ['$scope', '$http', '$rootScope', 'dataService', function ($scope, $http, $rootScope, dataService) {

    $scope.specifications = [];
    $rootScope.loading = true;

    //fix header sheet
    var wrapsheet = document.getElementById("wrapper");
    var width_wrapsheet = wrapsheet.clientWidth;
    var width_sheet = (parseInt(width_wrapsheet) - 336) + "px";
    document.getElementById("sheet_cellheader").style.width = width_sheet;


    //check session and building id
    var buildingItem_id = angular.element("#txt_building_item").val();
    var session_user = angular.element("#txt_session_user").val();
    getDataSheet();

    function getDataSheet() {
        if (typeof (buildingItem_id) != "undefined" && typeof (session_user) != "undefined") {

            var temp = [];
            var d = 0;

            dataService.getAllResource(buildingItem_id).then(function (resources) {
                //console.log(works);
                angular.forEach($rootScope.works, function (value, key) {

                    //each work
                    var regular_expression = /^\d+$/;
                    if (regular_expression.test(value.ID) && value.ID != null) {
                        var obj_work = {
                            IndexSheet: d,
                            ID: value.ID,
                            NormWork_ID: value.NormWork_ID,
                            Name: value.Name,
                            Unit: value.Unit,
                            Number_Work: value.Area,
                            Norm: "",
                            Number_Resource: "",
                            Price: value.Price,
                            Category: "",
                            Sum: "",
                            BuildingItem_ID: ""
                        };

                        $scope.specifications.push(obj_work);
                        d = parseInt(d) + 1;
                    }

                    //filter resource
                    temp = resources.filter(function (item) {
                        return (item.UserWork_ID == value.ID);
                    });

                    //display resource
                    angular.forEach(temp, function (v, k) {
                        var obj_resource = {
                            IndexSheet: d,
                            ID: value.ID,
                            NormWork_ID: "",
                            Name: v.Name,
                            Unit: v.Unit,
                            Number_Work: "",
                            Norm: v.Number_Norm,
                            Number_Resource: parseFloat(value.Area) * parseFloat(v.Number_Norm),
                            Price: v.Price,
                            Category: v.UnitPrice_ID.substring(0, 1),
                            Sum: parseFloat(value.Area) * parseFloat(v.Number_Norm) * parseFloat(v.Price),
                            BuildingItem_ID: ""
                        };
                        $scope.specifications.push(obj_resource);
                        d = parseInt(d) + 1;
                    });


                });

                for (var i = d; i < 500; i++) {
                    $scope.specifications.push({ IndexSheet: i });
                }

            });


        }
        else {
            //create sheet
            for (var i = 0; i < 500; i++) {
                $scope.specifications.push({ IndexSheet: i });
            }
        }

        $rootScope.loading = false;
    }


    $scope.location_focus = function ($event) {
        //focus and get id sheet
        var div = angular.element($event.currentTarget).parent().parent();
        var column_header = div.find(".column_header input");
        column_header.css({ "background-color": "#D4D4D4" });

        var index_eq = angular.element($event.currentTarget).parent().index();
        var row_header = angular.element(".sheet_cellheader");
        row_header.find("div").eq(index_eq).css({ "background-color": "#D4D4D4" });

        $scope.location_blur = function () {
            //focus and get id sheet
            div = angular.element($event.currentTarget).parent().parent();
            column_header = div.find(".column_header input");
            column_header.css({ "background-color": "#eaeaea" });

            index_eq = angular.element($event.currentTarget).parent().index();
            row_header = angular.element(".sheet_cellheader");
            row_header.find("div").eq(index_eq).css({ "background-color": "#eaeaea" });
        }
    }

    if ($rootScope.loading == false) {
        var div_loading = document.getElementById("loader");
        div_loading.style.display = "none";

        var div_wrap = document.getElementById("wrapper");
        div_wrap.style.opacity = "";
        div_wrap.style.pointerEvents = "";

        var body = document.getElementById("body");
        body.style.background = "";
    }

}]);