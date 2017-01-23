'use strict';
var app=angular.module('aplikacja', ["ngCookies", "ngRoute",'ngAnimate', 'ui.bootstrap', 'angular-storage', 'myServices', 'angularFileUpload','myDirectives', 'angular-jwt']);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/partials/home.html',
                controller: 'kontrolerMainPage'
            })
            .when('/cart', {
                templateUrl: 'app/partials/cart.html',
                controller: 'kontrolerCart'
            })
            .when('/list', {
                templateUrl: 'app/partials/list.html',
                controller: 'kontrolerListy'
            })
            .when('/game/:id', {
                templateUrl: 'app/partials/game.html',
                controller: 'product'
            })
            .when('/admin/panel/', {
                templateUrl: 'app/partials//admin/adminPanel.html',
                controller: 'adminPanel'
            })
        // ================== Admin Game ========================
            .when('/admin/edit/:id/', {
                templateUrl: 'app/partials//admin/adminPanelEdit.html',
                controller: 'adminPanelEdit'
            })
            .when('/admin/create', {
                templateUrl: 'app/partials/admin/adminPanelCreate.html',
                controller: 'adminPanelCreate'
            })
        // ================== Admin User ========================
            .when('/admin/createUser', {
                templateUrl: 'app/partials/admin/adminPanelCreateUser.html',
                controller: 'adminPanelCreateUser'
            })
            .when('/admin/editUser/:id', {
                templateUrl: 'app/partials/admin/adminPanelEditUser.html',
                controller: 'adminPanelEditUser'
            })
        // ================= User ================================
            .when('/profile/', {
                templateUrl: 'app/partials/profilePanel.html',
                controller: 'orders'
            })
        // ================= Login and Register ================================
            .when('/login', {
                templateUrl: 'app/partials/login.html',
                controller: 'login'
            })
            .when('/register', {
                templateUrl: 'app/partials/register.html',
                controller: 'register'
            })
        // ================ Default ==============================
        //    .otherwise({redirectTo: '/'})
    }]); //routing

app.controller('kontrolerMainPage', function($scope, $http, cart) {



    $scope.slider=[
        {
            "Plakat":"slider/img/theDivision.jpg",
            "Nazwa": "The Division",
            "Cena": 182.24,
            "PlakatMin": "slider/img/The-Divisionmin.png",
            "Platforma": 'Uplay CD Key'

        },
        {
            "Plakat":"slider/img/gtaVjpg.jpg",
            "Nazwa": "Grand Theft Auto V",
            "Cena": 136.49,
            "PlakatMin": "slider/img/gtaVmin.jpg",
            "Platforma": 'DIGITAL'
        },

        {
            "Plakat":"slider/img/Hitman.jpg",
            "Nazwa": "Hitman",
            "Cena": 171.39,
            "PlakatMin": "slider/img/Hitmanmin.jpg",
            "Platforma": 'Steam CD Key'
        },
        {
            "Plakat":"slider/img/XCOM.jpg",
            "Nazwa": "XCOM 2",
            "Cena": 165.96,
            "PlakatMin": "slider/img/XCOMmin.jpg",
            "Platforma": 'Steam CD Key'
        }

    ];

    $scope.addToCart=function(gra){
        cart.add(gra);
    };

$http.get("api/site/products/get").success(function(data){
    $scope.gry=data;
});

    $scope.closeDate= new Date();
    $scope.closeDate.setMonth( $scope.closeDate.getMonth() - 5);
    $scope.closeDate = $scope.closeDate.toISOString();

    $scope.actDate= new Date();
    $scope.actDate = $scope.actDate.toISOString();


}); //strona główna

app.controller('navigation', function($scope,$location, cart, checkToken){

    $scope.navigation = function(){
        var adminAlert=false;
        var profileAlert=false;
        if(/^\/admin/.test($location.path())){
            if(!checkToken.isAdmin()){
                adminAlert=true;
                window.location.href = '#/?alert=noAdmin'
            }
            return 'app/partials/admin/navigation.html';
        }
        else if(/^\/profile/.test($location.path())){

            if(!checkToken.loggedIn()){
                adminAlert=true;
                window.location.href = '#/?alert=noProfile'
            }

            return 'app/partials/navigation.html';
        }

        else{
            if($location.search().alert=='noAdmin')
                $scope.noAdmin=true;
            else
                $scope.noAdmin=false;

            if($location.search().alert=='noProfile')
                $scope.noProfile=true;
            else
                $scope.noProfile=false;


            if( checkToken.loggedIn())
                $scope.loggedIn=true;
            else
                $scope.loggedIn=false;


            if( checkToken.isAdmin())
                $scope.isAdmin=true;
            else
                $scope.isAdmin=false;

            return 'app/partials/navigation.html';
        }

    };

    $scope.$watch(function(){
        $scope.ilosc=cart.ilosc();
    });


    $scope.logout= function(){
        checkToken.del();
        location.reload();
    }


}); // nawigacja

app.controller('kontrolerCart', function($scope, $http, cart, checkToken) {

$scope.items=cart.show();

$scope.emptyCart=function(){
    $scope.items.splice(0,cart.show().length);

    $scope.$watch(function(){
        cart.ilosc();
    });
    cart.update($scope.items);
    cart.empty();
};


    $scope.remove = function(index) {
        $scope.items.splice(index, 1);
        $scope.$watch(function(){
            cart.ilosc();
        });
        cart.update($scope.items);

    };

    $scope.total=function(){
        var total = 0;
        angular.forEach($scope.items, function(item){
            total += item.qty * item.Cena;
        });
        return total.toFixed(2);
    };

    $scope.setOrder =function($event){

        if ( !checkToken.loggedIn() )
        {
            $event.preventDefault();
            $scope.alert = { type : 'warning' , msg : 'Musisz być zalogowany, żeby złożyć zamówienie.' };
            return false;

        }
        $http({
            method: 'POST',
            url: 'api/site/orders/create/',
            data: $.param({
                token: checkToken.raw(),
                payload: checkToken.payload(),
                items: $scope.items,
                total: $scope.total()
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function( data ){
            cart.empty();
            $scope.items.splice(0,cart.show().length);
            $scope.alert = { type : 'success' , msg : 'Zamówienie złożone. Nie odświeżaj strony. Trwa przekierowywanie do płatności...' };
            $( '#paypalForm' ).submit();

        }).error( function(){
            console.log( 'Błąd połączenia z API' );
        });


    };

    $scope.$watch(function(){
        cart.empty();
    });
    $scope.$watch(function(){
       cart.update($scope.items);
    });
});  //koszyk

app.controller('kontrolerListy', function($scope, $http, cart) {

    $scope.gry={};
    $http.get("api/site/products/get").success(function(data){
        $scope.gry=data;

    });

    $scope.addToCart=function(gra){
        cart.add(gra);
    };


    $scope.limit = Infinity;
    $scope.totalItems = 64;
    $scope.currentPage = 1;



    <!--Filtrowanie-->
    $scope.sortColumn = 'Nazwa';
    $scope.counterValue = 0;
    $scope.platforma = '';

    $scope.SortValue = function (Sort) {
        if ($scope.counterValue == 0) {
            $scope.sortColumn = '-'+Sort;
            $scope.counterValue = 1;

        } else if ($scope.counterValue == 1) {
            $scope.sortColumn = Sort;
            $scope.counterValue = 0;
        }
    };


    <!--DodawaniePrzedmiotu-->
    $scope.countItems=0;
    $scope.AddItem = function () {
        $scope.countItems += 1;

    }
});  //lista

app.controller('product', function($scope,$http, $routeParams, cart){

var id=$routeParams.id;
    $http.get("api/site/products/get/"+id)
        .success(function(data){
        $scope.gra= data;
    });

    $scope.addToCart=function(gra){
        cart.add(gra);
    };


    function getImages(){
        $http.get("api/site/products/getImages/"+id).success(function(data){
            console.log(data);
            $scope.images=data;
        });
    }
    getImages();

}); //gra

app.controller('adminPanel', function($scope,$http, $filter, $routeParams, checkToken){

    //$http.get("api/admin/products/get").success(function(data){
    //    $scope.gry=data;
    //
    //});


    // ===================== Users ===================
    $http({
        method: 'POST',
        url: 'api/admin/users/get/',
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data){
        $scope.users=data;
    });

    // ====================== Products =====================
    $http({
        method: 'POST',
        url: 'api/admin/products/get/',
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data){
        $scope.gry=data;
    });

    // ===================== Orders =====================
    $http({
        method: 'POST',
        url: 'api/admin/orders/get/',
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success( function( data ){
        $scope.orders=data;
        angular.forEach($scope.orders, function(order, key){
            var parsed= JSON.parse(order.items);
            $scope.orders[key].items=parsed;
        });
    }).error( function(){
        console.log( 'Błąd połączenia z API' );
    });


    $scope.delete = function(product, $index){

        if(!confirm('Czy na pewno chcesz usunąć? ')){
            return false;
        }
        $scope.gry.splice($index,1);

        $http({
            method: 'POST',
            url: 'api/admin/products/delete/',
            data: $.param({product: product,
                token: checkToken.raw(),
                payload: checkToken.payload()}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(){
            $scope.success=true;
            $scope.product={};
        }).error(function(){
            console.log('Błąd pobrania pliku json');
        })


    };

    $scope.deleteUser = function(user, $index){
        if(!confirm('Czy na pewno chcesz usunąć? ')){
            return false;
        }
        $scope.users.splice($index,1);

        $scope.gry.splice($index,1);

        $http({
            method: 'POST',
            url: 'api/admin/users/delete/',
            data: $.param({user: user,
                            token: checkToken.raw(),
                            payload: checkToken.payload()}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(){
            $scope.success=true;
            $scope.product={};
        }).error(function(){
            console.log('Błąd pobrania pliku json');
        })

    };

    $scope.deleteOrder = function(order, $index){
        if(!confirm('Czy na pewno chcesz usunąć? ')){
            return false;
        }
        $scope.orders.splice($index,1);

            $http({
            method: 'POST',
            url: 'api/admin/orders/delete/',
            data: $.param({
                token: checkToken.raw(),
                id: order.id,
                status: order.status
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function( data ){
        }).error( function(){
            console.log( 'Błąd połączenia z API' );
        });


    };

    $scope.changeStatus=function(order){

        if(order.status == 0)
            order.status=1;
        else
            order.status =0;


        $http({
            method: 'POST',
            url: 'api/admin/orders/update/',
            data: $.param({
                token: checkToken.raw(),
                id: order.id,
                status: order.status
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function( data ){
        }).error( function(){
            console.log( 'Błąd połączenia z API' );
        });



    }
}); //panel admina

app.controller('adminPanelEdit', function($scope,$http, $routeParams, FileUploader, $timeout, checkToken){


    var productId=$routeParams.id;
    $scope.id=productId;
    //$http.get("api/admin/products/get/"+productId).success(function(data){
    //    $scope.gra=data;
    //});

    $http({
        method: 'POST',
        url: 'api/admin/products/get/'+productId,
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data){
        $scope.gra=data;
    });

    $scope.przykladoweGatunki=[{
      "Gatunek": "Akcji"
    },
        {
         "Gatunek": "Przygodowe"
        },
        {
            "Gatunek": "Strategiczne"
        },
        {
            "Gatunek": "RPG"
        },
        {
            "Gatunek": "Sportowe"
        },
        {
            "Gatunek": "Wyścigi"
        },
        {
            "Gatunek": "FPS"
        },
        {
            "Gatunek": "MMO"
        }
    ];

    //$http.get("api/admin/products/getGatunek/"+productId).success(function(data){
    //    $scope.gatunki=data;
    //});
    //
    //
    //
    //$http.get("api/admin/products/getOpisMini/"+productId).success(function(data){
    //    $scope.opisMini=data;
    //});

    function getImages(){
        //$http.get("api/admin/images/get/"+productId).success(function(data){
        //    $scope.images=data;
        //});

        $http({
            method: 'POST',
            url: 'api/admin/images/get/'+productId,
            data: $.param({
                token: checkToken.raw(),
                payload: checkToken.payload()
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            $scope.images=data;
        });



    }
    getImages();

    $scope.saveChanges=function(product){

            $http({
            method: 'POST',
            url: 'api/admin/products/update/',
            data: $.param({product: product,
                token: checkToken.raw(),
                payload: checkToken.payload()}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(){
                $scope.success=true;
                $timeout(function(){
                    $scope.success = false;
                } , 3000 );

        }).error(function(){
                console.log('Błąd pobrania pliku json');
            })

    };

    $scope.delImg=function(imageName,$index){
        $scope.images.splice($index,1);
        $http.post("api/admin/images/delete/", {
            id: productId,
            image: imageName,
            token: checkToken.raw()

        }).success(function(){

        });

    };

    $scope.setThumb= function (product, image) {
        $http({
            method: 'POST',
            url: 'api/admin/images/setThumb/',
            data: $.param({
                product: product,
                token: checkToken.raw(),
                image: image}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .success(function(data){

            })

    };







    //================== Upload Zdjęć ========================
    var uploader = $scope.uploader= new FileUploader({
        url: 'api/admin/images/upload/'+productId,

    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        getImages()
    };


}); //edycja gry

app.controller('adminPanelCreate', function($scope,$http, $routeParams, FileUploader, $timeout, checkToken){

    $scope.przykladoweGatunki=[{
        "Gatunek": "Akcji"
    },
        {
            "Gatunek": "Przygodowe"
        },
        {
            "Gatunek": "Strategiczne"
        },
        {
            "Gatunek": "RPG"
        },
        {
            "Gatunek": "Sportowe"
        },
        {
            "Gatunek": "Wyścigi"
        },
        {
            "Gatunek": "FPS"
        },
        {
            "Gatunek": "MMO"
        }
    ];

    $scope.createProduct=function(product) {

        $http({
            method: 'POST',
            url: 'api/admin/products/create/',
            data: $.param({product: product,
                token: checkToken.raw(),
                payload: checkToken.payload()}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function () {
            $scope.success = true;
            $scope.product = {};
            $timeout(function () {
                $scope.success = false;
            }, 3000);

        }).error(function () {
            console.log('Błąd pobrania pliku json');
        });
    };

}); //tworzenie gry

app.controller('adminPanelEditUser', function($scope, $http, $routeParams, $timeout, checkToken){

    var userId=$routeParams.id;
    $scope.id=userId;
    //$http.get("api/admin/users/get/"+userId).success(function(data){
    //    $scope.user=data;
    //    console.log($scope.user);
    //});

    $http({
        method: 'POST',
        url: 'api/admin/users/get/'+userId,
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data){
        $scope.user=data;
    });


    $scope.success=false;
       $scope.saveChanges=function(user){


        $http({
            method: 'POST',
            url: 'api/admin/users/update/',
            data: $.param({
                user:user,
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                passconf: user.passconf}),

            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(errors) {
            if(errors){
                $scope.errors=errors;
            }
            else{
                $scope.success=true;
                $timeout(function(){
                    $scope.success = false;
                } , 3000 );
            }
            $scope.submit=true;

        }).error(function(){
            console.log('Błąd pobrania pliku json');
        })

    };

}); //edycja użytkownika

app.controller('adminPanelCreateUser', function($scope,$http,$timeout, checkToken){



    $scope.createUser=function(user){

        $http({
            method: 'POST',
            url: 'api/admin/users/create/',
            data: $.param({
                user:user,
                name: user.name,
                email: user.email,
                password: user.password,
                passconf: user.passconf,
                token: checkToken.raw(),
                payload: checkToken.payload()
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(errors) {
            $scope.success=true;
            if(errors){
                $scope.errors=errors;
            }
            else{
                $scope.success=true;
                $scope.product={};
                $timeout(function(){
                    $scope.success = false;
                } , 3000 );
            }
            $scope.submit=true;

            }).error(function(){
            console.log('Błąd pobrania pliku json');
        })

    }
}); //tworzenie użytkownika

app.controller('orders', function($scope,$http, checkToken){

    $http({
        method: 'POST',
        url: 'api/site/orders/get/',
        data: $.param({
            token: checkToken.raw(),
            payload: checkToken.payload()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success( function( data ){
       $scope.orders=data;
        angular.forEach($scope.orders, function(order, key){
               var parsed= JSON.parse(order.items);
               $scope.orders[key].items=parsed;
               console.log(parsed);
        });


    }).error( function(){
        console.log( 'Błąd połączenia z API' );
    });



}); //zamówienia

app.controller('login', function($scope,$http,store,checkToken, $location){

    if (checkToken.loggedIn()){
        $location.path('/')
    }

    $scope.user={};
    $scope.formSubmit=function(user){
        $http({
            method: 'POST',
            url: 'api/site/user/login/',
            data: $.param({
                email: user.email,
                password: user.password}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success( function( data ){

            $scope.submit = true;
            $scope.error = data.error;

            if ( !data.error )
            {
                store.set( 'token' , data.token );
                location.reload();
            }

        }).error( function(){
            console.log( 'Błąd połączenia z API' );
        });


    };

    console.log(checkToken.payload());
}); //logowanie

app.controller('register', function($scope,$http){
    $scope.user={};
    $scope.succes=false;
    $scope.formSubmit=function(user){
        $http({
            method: 'POST',
            url: 'api/site/user/create/',
            data: $.param({
                user:user,
                name: user.name,
                email: user.email,
                password: user.password,
                passconf: user.passconf}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(errors) {

            //$scope.user={};
            $scope.submit=true;
            if(errors){
                $scope.errors=errors;
            }
            else{
                $scope.errors={};
                $scope.user={};
                $scope.success=true;
            }


        }).error(function(){
            console.log('Błąd pobrania pliku json');
        })
    };
});  //rejestracja