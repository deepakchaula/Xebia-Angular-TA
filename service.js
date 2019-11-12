demoApp.factory("SimpleFactory", ['$http', function ($http) {
        var factory = {};

        factory.getCustomers = function () {
            return $http.get('http://localhost:3000/customers').then(function(response){
            this.customers = response.data;
            return $http.get('http://localhost:3000/customers').then(function(response){
                this.customers.friends = response.data.userfriends;
                return this.customers;
            });
        });
    }
        return factory;
    }
]);
