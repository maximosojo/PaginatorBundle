
/*
 * This file is part of the Atechnologies package.
 * 
 * (c) www.atechnologies.com.ve
 * 
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

var app = angular.module('atechnologies_paginator', ['ngTable'])

.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
}])

.directive('apiDataUrl',function ($rootScope){
    return {
      link: function(scope, element, attrs){
            $rootScope.apiDataUrl = attrs.apiDataUrl;
        }
    };
})

.directive('ngLoading', function() {
    return {
      restrict: "A",
      scope: false,
      link: function(scope, element, attrs) {
          var loading = '<div class="overlay">'+
              '<i class="fa fa-refresh fa-spin"></i>'+
              'Cargando...'+
            '</div>';
        var loadingLayer = angular.element("<div class='loading'><p class='blocktext'>"+loading+"</p></div>");
        element.append(loadingLayer);
        element.addClass("l-loading-container");
        scope.$watch(attrs.ngLoading, function(value) {
          loadingLayer.toggleClass("ng-hide", !value);
        });
      }
    };
})

.controller('PaginatorController', function($scope, $rootScope, NgTableParams, $http, $timeout){
    $scope.model = {};
    $scope.paginator = null;
    this.apiUrl = null;
    var self = this;
    this.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 10 // count per page
    }, {
        filterOptions: {
            filterDelay: 0
          },
        total: 0, // length of data
        getData: function (params) {
            var parameters = params.url();
            parameters.maxPerPage = parameters.count;
            var apiUrl = $scope.apiDataUrl;
            self.apiUrl = apiUrl;
            return $http.get(apiUrl, {params: parameters}).then(function (r) {
                var response = r.data;
                $scope.paginator = response;
                if(response && response.meta){
                    params.total(response.meta.totalResults);
                    return response.data;
                }
            }).finally(function(){
                self.tableParams.settings().$loading = false;
            });
        }
    });
    
    this.refresh = function () {
        self.tableParams.reload();
        self.getCurrentUrl();
    };
    
    $scope.$on("refreshPaginator",function(){
        self.refresh();
    })

    this.getCurrentUrl = function (baseUrl) {
        if (baseUrl == undefined) {
            baseUrl = self.apiUrl;
        }
        var s = "?";
        if (baseUrl.indexOf("?") != -1) {
            s = "&";
        }
        var url = baseUrl + s + jQuery.param(self.tableParams.url());
        return url;
    };
    
    this.getCurrentParams = function(returnObject){
        var params = self.tableParams.url();
        if(!returnObject){
            params = jQuery.param(params);
        }
        return params;

    };
    
    this.postCurrentUrl = function (url) {
        var url = self.getCurrentUrl(url);
        clientService.post(url);
    };
    
    this.callCurrentUrl = function (url) {
        var url = self.getCurrentUrl(url);
        window.location = url;
    };

    this.clearFilters = function () {
        $timeout(function () {
          clearFilters();
        });
    };    

    $scope.initWatch = function (modelName) {
        modelName = modelName.replace(".", "__");
        if ($scope.model[modelName]) {
            return;
        }
        $scope.model[modelName] = null;
        var lastChange = null;
        $scope.$watch("model." + modelName, function () {
            $timeout.cancel(lastChange);
            lastChange = $timeout(function () {
                var data = self.tableParams.filter();
                if (angular.isArray($scope.model[modelName])) {
                    if ($scope.model[modelName].length > 0) {
                        data[modelName] = angular.toJson($scope.model[modelName]);
                    } else {
                        data[modelName] = null;
                    }
                } else {
                    data[modelName] = $scope.model[modelName];
                }
                angular.forEach(data, function (v, k) {
                    if (null === v) {
                        delete data[k];
                    }
                });
                self.tableParams.filter(data);
            }, 1200);

        });
    };

    this.ngHref = function(url,parameters){
        if (typeof parameters == 'undefined') {
          var parameters = {};
        }
        document.location.href = Routing.generate(url,parameters, true);
    }
})
