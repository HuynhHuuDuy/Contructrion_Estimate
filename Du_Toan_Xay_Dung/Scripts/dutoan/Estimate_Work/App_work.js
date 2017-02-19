var app = angular.module("app_work", ["ui.router", "ui.bootstrap"]);

app.run(function ($rootScope) {
    $rootScope.works = [];
    $rootScope.allmaterials = [];
});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');              //home
    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('DuToan', {
            url: '/',
            templateUrl: '/Views_Angularjs/Estimate.htm'
        })
        .state('HaoPhi', {
            url: '/HaoPhi',
            templateUrl: '/Views_Angularjs/Material.htm'
        })
        .state('PhanTich', {
            url: '/PhanTich',
            templateUrl: '/Views_Angularjs/Specification.htm'
        })
        .state('TongHop', {
            url: '/TongHop',
            templateUrl: '/Views_Angularjs/General.htm'
        })
});

app.controller("mainController", ['$scope', '$rootScope', 'dataService', '$http', '$filter', function ($scope, $rootScope, dataService, $http, $filter) {

    //$scope.showloading = false;

    //<!-- Menu Toggle Script -->
    $scope.active_leftmenu = false;
    $scope.active_contentwrapper = false;
    $scope.toggle_sheet = false;

    $rootScope.ListDetailNormWork_Price = [];
    $rootScope.ListDetail_UserNormWork_Price = [];
    get_areapirce();

    $scope.menu_toggle = function ($event) {

        $scope.active_leftmenu = !$scope.active_leftmenu;
        $scope.active_contentwrapper = !$scope.active_contentwrapper;
        $scope.toggle_sheet = !$scope.toggle_sheet;

        var width_fullscreen = $(window).width();
        var width_contentestimate = document.getElementById("content_wrap_page").clientWidth;
        var width_headersheet = 0;

        if (document.getElementById("wrap_sheet_estimate")) {
            width_headersheet = document.getElementById("wrap_sheet_estimate").clientWidth;
        }
        if (document.getElementById("wrap_sheet_material")) {
            width_headersheet = document.getElementById("wrap_sheet_material").clientWidth;
        }
        if (document.getElementById("wrap_sheet_specification")) {
            width_headersheet = document.getElementById("wrap_sheet_specification").clientWidth;
        }

        var margin = parseFloat(width_contentestimate - width_headersheet);

        if ($scope.toggle_sheet) {
            angular.element(".sheet_cellheader").css("width", parseFloat(width_fullscreen - margin - 2 - 17 - 17) + "px");
        }
        if (!$scope.toggle_sheet) {

            angular.element(".sheet_cellheader").css("width", parseFloat(width_fullscreen - 250 - margin - 2 - 7 - 17) + "px");
        }
    }

    //check session and building id
    var buildingItem_id = angular.element("#txt_building_item").val();
    var session_user = angular.element("#txt_session_user").val();

    $scope.treeview = function ($event) {

        var div = angular.element($event.currentTarget);
        var icon = div.find("i").eq(1);
        var div_view = div.parent().find(".treeview-menu");

        if (div_view.hasClass("menu-open")) {
            div_view.css("display", "none");
            div_view.removeClass("menu-open");
            icon.css({
                "-ms-transform": "",
                "-webkit-transform": "",
                "transform": ""
            });
            //console.log("haha");
        }
        else {
            div_view.css("display", "block");
            div_view.addClass("menu-open");
            icon.css({
                "-ms-transform": "rotate(-90deg) /* IE 9 */",
                "-webkit-transform": "rotate(-90deg) /* Chrome, Safari, Opera */",
                "transform": "rotate(-90deg)"
            });
        }
    };



    //get building_id and show title
    if (typeof (buildingItem_id) != "undefined" && typeof (session_user) != "undefined") {
        get_infotitle(buildingItem_id);
    }
    function get_infotitle(id) {
        //$scope.showloading = true;
        $http({
            method: "post",
            url: "/HangMuc/get_infoBuildingItem",
            params: { id: id },
            headers: { 'Content-Type': 'application/json' }
        })
                .success(function (response) {
                    //display message
                    $scope.infortitle = response;
                    //$scope.showloading = false;
                });
    };

    function get_areapirce() {
        dataService.GetArea_Price().then(function (data) {
            $scope.unitprice = {
                availableOptions: data,
                selectedOption: { ID: '1' } //This sets the default value of the select in the ui
            };
            GetDetailNormWork_Price($scope.unitprice.selectedOption.ID);
            GetDetail_UserNormWork_Price($scope.unitprice.selectedOption.ID);
        });
    };

    function GetDetailNormWork_Price(area_id) {
        dataService.GetDetailNormWork_Price(area_id).then(function (data) {
            $rootScope.ListDetailNormWork_Price = data;
        });
    };

    function GetDetail_UserNormWork_Price(area_id) {
        dataService.GetDetail_UserNormWork_Price(area_id).then(function (data) {
            $rootScope.ListDetail_UserNormWork_Price = data;
        });
    };


    $scope.change_price = function (selection) {
        GetDetailNormWork_Price(selection);
        GetDetail_UserNormWork_Price(selection);
    };

    $rootScope.index_work = 1;


    //create list works
    for (var i = 0; i < 10; i++) {
        var item = {
            IndexSheet: i,
            ID: "",
            NormWork_ID: "",
            Name: "",
            Unit: "",
            Number: "",
            Horizontal: "",
            Vertical: "",
            Height: "",
            Area: "",
            PriceMaterial: "",
            PriceLabor: "",
            PriceMachine: "",
            SumMaterial: "",
            SumLabor: "",
            SumMachine: "",
            BuildingItem_ID: buildingItem_id,
            Sub_BuildingItem_ID: ""
        };
        $rootScope.works.push(item);
    }


    if (typeof (buildingItem_id) != "undefined" && typeof (session_user) != "undefined") {
        dataService.getAllSheet(buildingItem_id).then(function (data) {

            angular.forEach(data.sheets, function (value, key) {

                var regular_expression = /^\d+$/;

                $rootScope.works[value.IndexSheet].ID = value.ID;
                $rootScope.works[value.IndexSheet].NormWork_ID = value.NormWork_ID;
                $rootScope.works[value.IndexSheet].Name = value.Name;
                $rootScope.works[value.IndexSheet].Unit = value.Unit;
                $rootScope.works[value.IndexSheet].Number = value.Number;
                $rootScope.works[value.IndexSheet].Horizontal = value.Horizontal;
                $rootScope.works[value.IndexSheet].Vertical = value.Vertical;
                $rootScope.works[value.IndexSheet].Height = value.Height;
                $rootScope.works[value.IndexSheet].Area = value.Area;
                //put data sum from user work resourse
                $rootScope.works[value.IndexSheet].BuildingItem_ID = value.BuildingItem_ID;
                $rootScope.works[value.IndexSheet].Sub_BuildingItem_ID = value.Sub_BuildingItem_ID;

                if (regular_expression.test(value.ID)) {
                    var p_material = 0;
                    var p_labor = 0;
                    var p_machine = 0;
                    var resourcework = $filter('filter')(data.userworkresource, { UserWork_ID: value.ID }, true);

                    if (value.ID == 4) {
                        console.log(resourcework);
                    }

                    angular.forEach(resourcework, function (v, k) {

                        if (v.UnitPrice_ID.substring(0, 1) == "V") {
                            p_material = parseFloat(p_material) + (parseFloat(v.Number_Norm) * parseFloat(v.Price));
                        }
                        if (v.UnitPrice_ID.substring(0, 1) == "N") {
                            p_labor = parseFloat(p_labor) + (parseFloat(v.Number_Norm) * parseFloat(v.Price));
                        }
                        if (v.UnitPrice_ID.substring(0, 1) == "M")
                            p_machine = parseFloat(p_machine) + (parseFloat(v.Number_Norm) * parseFloat(v.Price));
                    });



                    $rootScope.works[value.IndexSheet].PriceMaterial = p_material;
                    $rootScope.works[value.IndexSheet].PriceLabor = p_labor;
                    $rootScope.works[value.IndexSheet].PriceMachine = p_machine;
                    $rootScope.works[value.IndexSheet].SumMaterial = parseFloat(p_material) * parseFloat(value.Area);
                    $rootScope.works[value.IndexSheet].SumLabor = parseFloat(p_labor) * parseFloat(value.Area);
                    $rootScope.works[value.IndexSheet].SumMachine = parseFloat(p_machine) * parseFloat(value.Area);


                    $rootScope.index_work = parseInt($rootScope.index_work) + 1;

                }
            });
        });
    }

    /*
    $scope.change_buildingitem = function (selection) {
        if (typeof (session_user) != "undefined") {
            dataService.getAllSheet(selection).then(function (data) {
                angular.forEach(data, function (value, key) {
                    $rootScope.works[value.IndexSheet].ID = value.ID;
                    $rootScope.works[value.IndexSheet].NormWork_ID = value.NormWork_ID;
                    $rootScope.works[value.IndexSheet].Name = value.Name;
                    $rootScope.works[value.IndexSheet].Unit = value.Unit;
                    $rootScope.works[value.IndexSheet].Number = value.Number;
                    $rootScope.works[value.IndexSheet].Horizontal = value.Horizontal;
                    $rootScope.works[value.IndexSheet].Vertical = value.Vertical;
                    $rootScope.works[value.IndexSheet].Height = value.Height;
                    $rootScope.works[value.IndexSheet].Area = value.Area;
                    $rootScope.works[value.IndexSheet].PriceMaterial = value.PriceMaterial;
                    $rootScope.works[value.IndexSheet].PriceLabor = value.PriceLabor;
                    $rootScope.works[value.IndexSheet].PriceMachine = value.PriceMachine;
                    $rootScope.works[value.IndexSheet].SumMaterial = value.SumMaterial;
                    $rootScope.works[value.IndexSheet].SumLabor = value.SumLabor;
                    $rootScope.works[value.IndexSheet].SumMachine = value.SumMachine;
                    $rootScope.works[value.IndexSheet].BuildingItem_ID = value.BuildingItem_ID;
                    $rootScope.works[value.IndexSheet].Sub_BuildingItem_ID = value.Sub_BuildingItem_ID;

                    var regular_expression = /^\d+$/;
                    if (regular_expression.test(value.ID)) {
                        $rootScope.index_work = parseInt($rootScope.index_work) + 1;
                    }
                });
            });
        }
    };
    */

}]);




//right click and show menu context
app.directive('ngRightClick', [function () {
    return {
        restrict: 'AE',
        scope: '@&',
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                post: function postLink(scope, iElement, iAttrs, controller) {
                    var ul = $('#' + iAttrs.context),
                        div_rowsheet = null;

                    ul.css({
                        'display': 'none'
                    });

                    $(iElement).bind('contextmenu', function (event) {

                        event.preventDefault();

                        //choose row
                        div_rowsheet = angular.element(event.currentTarget).parent();

                        if (div_rowsheet.hasClass("picked")) {
                            //show context menu
                            ul.css({
                                position: "fixed",
                                display: "block",
                                left: event.clientX + 'px',
                                top: event.clientY + 'px'
                            });
                        }
                    });
                }
            };
        }
    };

}]);

//key press and move another textbox in sheet
app.directive('movefocus', function () {
    return {
        restrict: 'AE',
        scope: '@&',
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                post: function postLink(scope, iElement, iAttrs, controller) {

                    $(iElement).find("input").bind('keydown', function (event) {

                        var keycode = (event.keyCode ? event.keyCode : event.which);

                        if (keycode == '37') {
                            var temp = $(this).parent().prev();
                            if (temp.find("textarea").is("textarea")) {
                                temp.find("textarea").focus();
                            }
                            if (temp.find("input").is("input")) {
                                temp.find("input").focus();
                            }
                        }

                        if (keycode == '39') {
                            var temp = $(this).parent().next();
                            if (temp.find("textarea").is("textarea")) {
                                temp.find("textarea").focus();
                            }
                            if (temp.find("input").is("input")) {
                                temp.find("input").focus();
                            }
                        }

                        //div row_sheet
                        var div = $(this).parent().parent();
                        var index = $(this).parent().index();

                        if (keycode == '40') {
                            var temp = div.next();
                            temp.find("div").eq(index).children().focus();
                        }

                        if (keycode == '38') {
                            var temp = div.prev();
                            temp.find("div").eq(index).children().focus();
                        }

                    });

                    $(iElement).find("textarea").bind('keydown', function (event) {

                        var keycode = (event.keyCode ? event.keyCode : event.which);

                        if (keycode == '37') {
                            var temp = $(this).parent().prev();
                            if (temp.find("textarea").is("textarea")) {
                                temp.find("textarea").focus();
                            }
                            if (temp.find("input").is("input")) {
                                temp.find("input").focus();
                            }
                        }

                        if (keycode == '39') {
                            var temp = $(this).parent().next();
                            if (temp.find("textarea").is("textarea")) {
                                temp.find("textarea").focus();
                            }
                            if (temp.find("input").is("input")) {
                                temp.find("input").focus();
                            }
                        }

                        //div row_sheet
                        var div = $(this).parent().parent();
                        var index = $(this).parent().index();

                        if (keycode == '40') {
                            var temp = div.next();
                            temp.find("div").eq(index).children().focus();
                        }

                        if (keycode == '38') {
                            var temp = div.prev();
                            temp.find("div").eq(index).children().focus();
                        }

                    });
                }
            };
        }
    };

});


