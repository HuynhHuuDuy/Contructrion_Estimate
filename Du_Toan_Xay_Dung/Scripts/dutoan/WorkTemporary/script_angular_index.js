angular.module('worktemporary', [])
    .controller('WorkTemporary_Controller', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {

        //variable
        $scope.list_UnitPrice = [];
        $scope.list_UserNormWork = [];
        $scope.tempwork = [];

        $scope.flag_validation = 0;

        $scope.show_Edit = true;
        //$scope.list_UserNormWorkDetail = [];

        getUserNormWork();
        getArea();

        function getUserNormWork() {
            $http.get('/WorkTemporary/Get_UserNormWork').then(function (response) {
                $scope.list_UserNormWork = response.data;
            }, function (response) {
                //Showing errors
            });
        };

        function getArea() {
            $http.get('/WorkTemporary/GetArea_UnitPrice').then(function (response) {
                var data = response.data;

                var obj = {
                    ID: "0",
                    Name: "---Chọn đơn giá để tìm thành phần hao phí---",
                };

                data.push(obj);

                $scope.Area = {
                    availableOptions: data,
                    selectedOption: { ID: '0' } //This sets the default value of the select in the ui
                };

            }, function (response) {
                //Showing errors
            });
        };

        function getListPrice_Picked(id) {
            return $http({
                method: "GET",
                url: "/WorkTemporary/Get_UnitPrice",
                params: { id: id }
            })
                .then(function (response) {
                    $scope.list_UnitPricePicked = response.data;
                }, function (response) {
                    //showing errors
                });
        };

        function get_UserNormDeTail(id) {

            $http({
                method: "GET",
                url: "/WorkTemporary/Get_UserNormWorkDetail",
                params: { id: id }
            })
                .then(function (response) {
                    $scope.list_UnitPrice = response.data;
                }, function (response) {
                    //showing errors
                });
        }

        $scope.change_area = function (id) {
            getListPrice_Picked(id);
        };

        $scope.add_unitPrice = function (x) {

            if ($scope.list_UnitPrice.length === 0) {
                var obj = {
                    UnitPrice_ID: x.UnitPrice_ID,
                    Name: x.Name,
                    Unit: x.Unit,
                    Number: 0,
                };
                $scope.list_UnitPrice.push(obj);
            }
            else {
                var d = 0;
                for (var i = 0; i < $scope.list_UnitPrice.length; i++) {
                    if ($scope.list_UnitPrice[i].UnitPrice_ID == x.UnitPrice_ID) {
                        d = 1;
                        break;
                    }
                };

                if (d == 1) {
                    alert("da ton tai");
                }
                else {
                    var obj = {
                        UnitPrice_ID: x.UnitPrice_ID,
                        Name: x.Name,
                        Unit: x.Unit,
                        Number: 0,
                    };
                    $scope.list_UnitPrice.push(obj);
                }
            }
        };

        $scope.delete_unitPrice = function (id) {

            for (var i = 0; i < $scope.list_UnitPrice.length; i++) {
                if ($scope.list_UnitPrice[i].UnitPrice_ID == id) {
                    $scope.list_UnitPrice.splice(i, 1);
                    i--;
                }
            };
        };

        $scope.save_tempWork = function () {

            if ($scope.flag_validation == 1) {
                var data = {
                    NormWork_ID: $scope.tempwork.ID,
                    Name: $scope.tempwork.Name,
                    Unit: $scope.tempwork.Unit,
                    Norm_Details: $scope.list_UnitPrice,
                };

                $http({
                    method: "post",
                    url: "/WorkTemporary/post_saveUser_NormWork",
                    data: JSON.stringify(data),
                    dataType: "json",
                })
                 .then(function (result) {
                     if (result.data == "ok") {
                         open_alert("success");
                         location.reload();
                     }
                 });
            }
        };

        $scope.clear_content = function () {
            $scope.tempwork = [];
            $scope.list_UnitPrice = [];
            $scope.show_Edit = true;
            $scope.show_DontEdit = false;
            $scope.flag_validation = 0;
        };

        $scope.edit_UserNormWork = function (x) {

            $scope.flag_validation = 1;
            var id = x.NormWork_ID;
            get_UserNormDeTail(id);


            angular.element("#show_DontEdit").text(x.NormWork_ID);
            $scope.show_DontEdit = true;
            $scope.show_Edit = false;

            $scope.tempwork.ID = x.NormWork_ID;
            $scope.tempwork.Name = x.Name;
            $scope.tempwork.Unit = x.Unit;

            var div = angular.element("#show_options");

            if (div.hasClass("collapse")) {
                div.removeClass("collapse");
                div.addClass("in");
                div.css("height", "auto");
            }
        };

        $scope.show_UserNormWork = function (x) {


            var tbody = angular.element("#table_showUserNormDetail");
            var id = x.NormWork_ID;

            var myNode = document.getElementById("table_showUserNormDetail");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

            $http({
                method: "GET",
                url: "/WorkTemporary/Get_UserNormWorkDetail",
                params: { id: id }
            })
                .then(function (response) {
                    angular.forEach(response.data, function (value, key) {
                        var s = '<tr>' +
                        '<td>' + value.UnitPrice_ID + '</td>' +
                        '<td>' + value.Name + '</td>' +
                        '<td>' + value.Unit + '</td>' +
                        '<td>' + value.Number + '</td>' +
                        '</tr>';
                        tbody.append(s);

                    });

                }, function (response) {
                    //showing errors
                });



            angular.element("#show_ID").text(x.NormWork_ID);
            angular.element("#show_Name").text(x.Name);
            angular.element("#show_Unit").text(x.Unit);

        };

    
        // xóa công trình
        //$scope.submit_deletebuilding = function () {
        //    var id = $scope.building_id
        //    $http({
        //        method: 'POST',
        //        url: '/CongTrinh/Delete_CongTrinh',
        //        params: { building_id: id },
        //        headers: { 'Content-Type': 'application/json' }
        //    })
        //        .then(function (result) {

        //            if (result.data == "ok") {
        //                open_alert("success");
        //                location.reload();
        //            }
        //            else {
        //                open_alert("fail");
        //            }
        //        });
        //}

        $scope.delete_UserNormWork = function (x) {

            var r = confirm("Bạn có thật sự muốn xóa...?");

            if (r == true) {

                var id = x.NormWork_ID;

                $http({
                    method: "post",
                    url: "/WorkTemporary/post_deleteUser_NormWork",
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
        };

          //  };
       // };

        $scope.validationID = function (id) {

            return $http({
                method: "GET",
                url: "/WorkTemporary/Validation_ID",
                params: { id: id }
            })
                .then(function (response) {

                    if (response.data == "ok") {
                        $scope.flag_validation = 1;
                        $scope.warning_ID_error = false;
                    }
                    else {
                        $scope.flag_validation = 0;
                        $scope.warning_ID_error = true;
                    }

                }, function (response) {
                    //showing errors
                });

        };

    }]);
