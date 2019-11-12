demoApp.controller('SimpleController', function ($scope, $mdDialog, $http, SimpleFactory) {

  var scopeGlobal = $scope;
  //pagination variables.
  $scope.customers = [];
  $scope.filteredCustomers = [];
  $scope.currentPage = 1;
  $scope.numPerPage = 4;
  $scope.maxSize = 5;

  init();

  function init() {
    $scope.customers = SimpleFactory.getCustomers().then(function(response){
            $scope.customers = response;
        });
  }
  $scope.sort = function(keyname){
    $scope.sortKey = keyname;
    $scope.reverse = !$scope.reverse;
  }
  
  $scope.showAdvanced = function (ev, id, name, qty, price) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'customDirective.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: { id: id, name: name, qty: qty, price: price},
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen
      }).then(function (answer) {
          $scope.status = 'You changes "' + answer + '".';
      }, function () {
          $scope.status = 'You changes cancelled.';
      });
  };

  function DialogController($scope, $mdDialog, id, name, qty, price) {
    $scope.id = id;
    $scope.name = name;
    $scope.qty = qty;
    $scope.price = price;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.$watch('qty', function() {
      $scope.qty = $scope.qty.replace(/[^0-9]/g, '');
      if(!$scope.qty){ $scope.qty = 0};
    });
    $scope.$watch('price', function() {
      $scope.price = $scope.price.replace(/[^\d.]/g,'');
      if(!$scope.price){ $scope.price = 0};
    });

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.updateData = function(id, name, qty, price, answer) {
      console.log(id, name, qty, price);
      $mdDialog.hide(answer);
      $http.put('http://localhost:3000/customers/'+id, {name:name, qty: qty, price: price})
      .then(function (response) {
        let data = response.data;
        let dataGobal = scopeGlobal.customers[(data.id - 1)];
        dataGobal.qty = data.qty;
        dataGobal.price = data.price;
        console.log(response);
        console.log(dataGobal);
      },function (error){
          console.log(error);
      });
    }

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
        console.log($scope.id, $scope.qty );
    };
  }

  setTimeout(function(){
    $scope.$watch('currentPage + numPerPage', updateFilteredItems);
  });
  

  function updateFilteredItems() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage),
      end = begin + $scope.numPerPage;

    $scope.filteredCustomers = $scope.customers.slice(begin, end);
  }
});