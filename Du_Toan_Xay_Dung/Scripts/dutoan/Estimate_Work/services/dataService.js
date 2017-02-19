
angular.module('app_work').factory('dataService', ['$http', function ($http) {

    var get_namebuildingitem = function (buidlingitem_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/getname_building",
            params: { buildingitem_id: buildingitem_id }
        })
        .then(function (response) {
            console.log(response.data);
            return response.data;
        }, function (response) {
            //showing errors
        });

    };
    var get_namebuilding = function (buidlingitem_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/getname_building",
            params: { buildingitem_id: buildingitem_id }
        })
          .then(function (response) {
              console.log(response.data);
              return response.data;
          }, function (response) {
              //showing errors
          });
    };
    var get_total=function(buildingitem_id)
    {
        return $http({
            method: "GET",
            url: "/HangMuc/gettotal",
            params: { buildingitem_id: buildingitem_id }
        })
            .then(function (response) {
                console.log(response.data);
                return response.data;
            }, function (response) {
                //showing errors
            });
    }
    var getAllSheet = function (buildingitem_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/getAllSheets",
            params: { buildingitem_id: buildingitem_id }
        })
            .then(function (response) {
                console.log(response.data);
                return response.data;
            }, function (response) {
                //showing errors
            });
    };

    var getAllResource = function (buildingitem_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/getAllResources",
            params: { buildingitem_id: buildingitem_id }
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                //showing errors
            });
    };


    var getGroupbyResources = function (buildingitem_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/getGroupbyResources",
            params: { buildingitem_id: buildingitem_id }
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                //showing errors
            });
    };

    var getNormworks = function () {
        return $http.get('/HangMuc/GetNormWorks').then(function (response) {
            return response.data
        }, function (response) {
            //Showing errors
        });
    };


    var getUser_Normworks = function () {
        return $http.get('/HangMuc/getUser_Normworks').then(function (response) {
            return response.data
        }, function (response) {
            //Showing errors
        });
    };



    //var getListPrice = function () {
    //    return $http.get('/HangMuc/GetDSDonGia').then(function (response) {
    //        return response.data
    //    }, function (response) {
    //        //Showing errors
    //    });
    //};



    var GetDetailNormWork_Price = function (area_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/GetDetailNormWork_Price",
            params: { area_id: area_id }
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                //showing errors
            });
    };

    var GetDetail_UserNormWork_Price = function (area_id) {
        return $http({
            method: "GET",
            url: "/HangMuc/GetDetail_UserNormWork_Price",
            params: { area_id: area_id }
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                //showing errors
            });
    };

    var GetArea_Price = function () {
        return $http.get('/HangMuc/GetArea_Price').then(function (response) {
            return response.data
        }, function (response) {
            //Showing errors
        });
    };

    var GetBuildings = function () {
        return $http.get('/HangMuc/get_Buildings').then(function (response) {
            return response.data
        }, function (response) {
            //Showing errors
        });
    };

    var get_BuildingItems = function (id) {
        return $http({
            method: "GET",
            url: "/HangMuc/get_BuildingItems",
            params: { id: id }
        })
            .then(function (response) {
                return response.data;
            }, function (response) {
                //showing errors
            });
    };
    return {
        GetArea_Price: GetArea_Price,
        getAllResource: getAllResource,
        getAllSheet: getAllSheet,
        getGroupbyResources: getGroupbyResources,
        getNormworks: getNormworks,
        getUser_Normworks: getUser_Normworks,
        //getListPrice: getListPrice,
        GetDetailNormWork_Price: GetDetailNormWork_Price,
        GetDetail_UserNormWork_Price: GetDetail_UserNormWork_Price,
        GetBuildings: GetBuildings,
        get_BuildingItems: get_BuildingItems,
        get_namebuildingitem: get_namebuildingitem,
        get_namebuidling: get_namebuilding,
        get_total:get_total
    };

}]);
