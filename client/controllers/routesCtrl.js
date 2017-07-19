angular.module('routes', []);
angular.module('routes').controller('routesCtrl', function($scope, $window, $http) {
    $scope.newRoute = {
      name: '',
      vehicle_id: 1
    };
    $scope.selectedRoute = "0";

    var map = $window.L.map('routesMap').setView([-3.753, -38.55], 15);
    var markersLayer = new $window.L.LayerGroup();
    $window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    		maxZoom: 18,
    		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    		id: 'mapbox.streets'
    	}).addTo(map);

    markersLayer.addTo(map);
    map.on('click', addMarker);
    var routingControl = $window.L.Routing.control({
         waypoints: [],
         routeWhileDragging: true
     }).addTo(map);

    /*
     * Funcao para obter as rotas do usuario e passa-las para a view.
     */
    $scope.getAllRoutes = function() {
         $http({method: 'POST', url: '/db/read/routes'}).
            success(function(data, status) {
                // console.log(data);
                $scope.dataset = data;
                $scope.selectedRoute = "0";
                markersLayer.clearLayers();
            }).
            error(function(data, status) {
                $scope.dataset = data || "Request failed ";
            });
    }

    /*
     * Funcao para adicionar uma rota do usuario e atualizar a view.
     */
    $scope.addRoute = function() {
        $scope.newRoute.stops = [];
        markersLayer.eachLayer(function (marker) {
            $scope.newRoute.stops.push({
              name: "Marker " + marker._leaflet_id,
              lat: marker._latlng.lat,
              lng: marker._latlng.lng
            });
        });

        if ($scope.newRoute.stops.length < 2) {
          alert("A route need at least 2 STOP points to be saved.");
          return;
        }

        $http({method: 'POST', url: '/db/add/route', data: $scope.newRoute}).
            success(function(data, status) {
                alert('New route added!');
                $scope.addClicked = false;
                $scope.getAllRoutes();
                $scope.newRoute = {
                  name: '',
                  vehicle_id: 1
                };
            });
    }

    /*
     * Funcao para obter as paradas da rota selecionada
     */
     $scope.updateMap = function() {
       console.log($scope.selectedRoute);
        if ($scope.selectedRoute != "0") {

          $http({method: 'GET', url: '/db/read/stops?id=' + $scope.selectedRoute}).
             success(function(data, status) {
                 // console.log(data);
                 markersLayer.clearLayers();
                 var waypoints = [];
                 data.forEach(function(stop) {
                    waypoints.push($window.L.latLng(stop.lat, stop.lng));
                 });
                 routingControl.setWaypoints(waypoints);
             }).
             error(function(data, status) {
                 console.log("Request failed!");
             });

        }
        else {
          resetMarkersMap();
        }
     }

    /*
     * Funcao para deletar uma rota do usuario e atualizar a view.
     */
    $scope.delRoute = function() {
        if(confirm('Are you sure about [DELETE] this route?'))
        {
            $http({method: 'DELETE', url: '/db/del/route?id=' + $scope.selectedRoute}).
                success(function(data, status) {
                    $scope.getAllRoutes();
                });
        }
    }

    /*
     * Funcao para desconectar o usuario e encaminhar para o tela de login.
     */
    $scope.doLogout = function() {
        $http({method: 'POST', url: '/db/doLogout'}).
                success(function(data, status) {
                    window.location = "/";
                });
    }

    /*
     * Funcao para identificar quando o botao de adicionar rota for clicado.
     */
    $scope.newRouteClick = function() {
        $scope.addClicked = !$scope.addClicked;
        if ($scope.addClicked) {
          $scope.selectedRoute = "0";
          markersLayer.clearLayers();
        }
    };

    function addMarker(e) {
        if ($scope.addClicked) {
          $window.L.marker(e.latlng, {draggable:'true'}).addTo(markersLayer);
        }
    }

    function resetMarkersMap() {
      markersLayer.clearLayers();
      routingControl.setWaypoints([]);
    }

    $scope.getAllRoutes();
});
