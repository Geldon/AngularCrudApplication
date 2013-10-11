var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:itemId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

TodoApp.directive('sorted', function () {
    return {
        scope: true,
        transclude: true,
        templateUrl: 'tableHeader.html',
        controller: function($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;

            $scope.do_sort = function() { $scope.sort_by($scope.sort); };

            $scope.do_show = function(asc) {
                return (asc != $scope.sort_desc) && ($scope.sort_order == $scope.sort);
            };
        }
    };
});

var EditCtrl = function ($scope, $routeParams, $location, Todo) {
    var id = $routeParams.itemId;

    $scope.action = 'Update';
    $scope.item = Todo.get({ id: id });
    
    $scope.save = function () {
        Todo.update({ id: id }, $scope.item, function () {
            $location.path('/');
        });
    };
};

var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = 'Add';
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
};

var ListCtrl = function($scope, $location, Todo) {
    $scope.sort_desc = false;
    $scope.sort_order = 'Priority';
    $scope.limit = 20;

    $scope.sort_by = function (ord) {
        if ($scope.sort_order == ord) { $scope.sort_desc = !$scope.sort_desc; }
        else { $scope.sort_desc = false; }
        $scope.sort_order = ord;
        $scope.reset();
    };

    $scope.search = function () {
        Todo.query({ q: $scope.query, limit: $scope.limit, offset: $scope.offset, desc: $scope.sort_desc, sort: $scope.sort_order },
            function (items) {
                var cnt = items.length;
                $scope.no_more = cnt < 20;
                $scope.items = $scope.items.concat(items);
            }
        );
    };

    $scope.reset = function () {
        $scope.offset = 0;
        $scope.items = [];
        $scope.search();
    };

    $scope.show_more = function () { return !$scope.no_more; };

    $scope.reset();

    $scope.delete = function() {
        var id = this.item.Id;
        
        Todo.delete({ id: id }, function() {
            $('#todo_'+id).fadeOut();
        });
    };
};