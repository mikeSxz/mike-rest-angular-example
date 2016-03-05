angular.module('libraryApp')
        .controller('listado', function ($scope, $http, $sce, $compile, $filter, $rootScope, $window) {
            $scope.query = "";
            $scope.registrosHistoFianza = [];
            $scope.orderProp = "";
            $scope.auxSorter = "";

            $scope.items = [];
            $scope.itemsPerPage = 10;
            $scope.getGap = function () {
                var howMany = 0;
                if ($scope.filteredItems !== undefined) {
                    howMany = $scope.filteredItems.length / parseInt($scope.itemsPerPage);
                }
                return Math.ceil(howMany);
            };
            //init
            $scope.sort = {
                sortingOrder: 'title',
                reverse: false
            };

            $scope.gap = 10;
            $scope.filteredItems = [];
            $scope.groupedItems = [];

            $scope.pagedItems = [];
            $scope.currentPage = 0;

            var searchMatch = function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
            };

            // init the filtered items
            $scope.search = function () {
                $scope.filteredItems = $filter('filter')($scope.items, function (item) {
                    for (var attr in item) {
                        if (searchMatch(item[attr], $scope.query))
                            return true;
                    }
                    return false;
                });
                // take care of the sorting order
                if ($scope.sort.sortingOrder !== '') {
                    $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
                }

                $scope.gap = $scope.getGap();
                $scope.currentPage = 0;
                // now group by pages
                $scope.groupToPages();
            };

            // calculate page in place
            $scope.groupToPages = function () {
                $scope.pagedItems = [];
                try {
                    for (var i = 0; i < $scope.filteredItems.length; i++) {
                        if (i % $scope.itemsPerPage === 0) {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                        } else {
                            $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                        }
                    }
                } catch (e) {
                }
            };

            $scope.range = function (size, start, end) {
                var ret = [];
//        console.log(size, start, end);

                if (size < end) {
                    end = size;
                    start = size - $scope.gap;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
//        console.log(ret);
                return ret;
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pagedItems.length - 1) {
                    $scope.currentPage++;
                }
            };

            $scope.setPage = function () {
                $scope.currentPage = this.n;
            };

            // functions have been describe process the data for display
            $scope.search();

            $scope.setClickedRow = function (index) {  //function that sets the value of selectedRow to current index
                $scope.selectedRow = index;
            };



            $scope.init_library_rows = function () {
                $scope.selectedRow = null;  // initialize our variable to null

                $scope.items = [];
                $scope.filteredItems = [];
                $scope.gap = 1;
                $scope.visibleloading = true;
                $scope.visibleError = false;
                $scope.visibleData = false;

                var url = urlListBooks();

                callServiceAG($http, url, "", $scope.getBooks_success, $scope.getBooks_error);
            };

            $scope.getBooks_success = function (response) {                
                $scope.visibleloading = false;
                $scope.visibleError = false;
                $scope.visibleData = true;

                if (response.length > 100) {
                    $scope.itemsPerPage = 15;
                }
                $scope.registrosHistoFianza = response.data;

                $scope.items = $scope.registrosHistoFianza;
                $scope.gap = $scope.getGap();
                $scope.search();
            };

            $scope.getBooks_error = function (response) {
                $scope.visibleloading = false;
                $scope.visibleError = true;
                $scope.visibleData = false;
            };

        });

angular.module('libraryApp').$inject = ['$scope', '$filter'];

angular.module('libraryApp').directive("customSort", function () {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            order: '=',
            sort: '='
        },
        template:
                ' <a ng-click="sort_by(order)">' +
                '    <span ng-transclude></span>' +
                '    <i ng-class="selectedCls(order)"></i>' +
                '</a>',
        link: function (scope) {

            // change sorting order
            scope.sort_by = function (newSortingOrder) {
                var sort = scope.sort;
                if (sort.sortingOrder == newSortingOrder) {
                    sort.reverse = !sort.reverse;
                }

                sort.sortingOrder = newSortingOrder;
            };
            scope.selectedCls = function (column) {
                if (column == scope.sort.sortingOrder) {
                    return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
                } else {
                    return'icon-sort'
                }
            };
        }// end link
    };
});


