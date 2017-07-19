angular.module('routesLogin', []);
angular.module('routesLogin').controller('routesLoginCtrl', function($scope, $http) {
    /*
     * Funcao para autenticar, conectar um usuario e redirecionar para a pagina principal.
     */
    $scope.connect = function() {
        $http({method: 'POST', url: '/db/doLogin?login=' + $scope.login + '&password=' + $scope.password}).
            success(function(data, status) {
                if (data != 'Success')
                	$scope.errorMsg = data;
                else
                	window.location = "/";
            }).
            error(function(data, status) {
                $scope.errorMsg = data || "Falha em conectar.";
            });
    }
    
    /*
     * Funcao para verificar se foi teclado o 'enter'.
     */
    $scope.enter = function(keyEvent) {
    	if(keyEvent.which === 13) {
    		$scope.connect();
    	}
    }

});
