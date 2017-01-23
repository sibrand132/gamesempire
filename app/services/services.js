'use strict';

var myServices = angular.module('myServices', []);

myServices.factory('cart',['store',function(store){

    if(store.get('cart'))
        var cart=store.get('cart');
    else
        var cart=[];

    cart.show = function(){
        return cart;
    };
    cart.add=function(product){


        if(!cart.length)
        {
            product.qty =0;
            cart.push(product);
        }
        var addNew=true;
        angular.forEach(cart,function(value, key){

            if(value.Nazwa == product.Nazwa){
                addNew=false;
                cart[key].qty++;
            }
        });
        if(addNew){
            product.qty=1;
            cart.push(product);
        }
        store.set('cart', cart);

    };


    cart.ilosc = function(){
            var i=0;
            var ilosc=0;
            if(cart.show().length){

                for(i=0; i<cart.show().length; i++)
                {
                    ilosc+=cart.show()[i].qty;
                }
                cart.qty=ilosc;
            }
            else{
                return 0;
            }
        return cart.qty;
    };


    cart.empty =function(){
      store.remove('cart');
    };

    cart.update=function(newCart){
        store.set('cart',newCart);
    };

    return cart;

}]);

myServices.service( 'checkToken' , [ 'store' , 'jwtHelper' , function( store , jwtHelper ){

    var token = store.get( 'token' );

    if ( token )
        token = jwtHelper.decodeToken( token );
    else
        token = false;

    this.payload = function () {
        return token;
    };

    this.loggedIn = function () {
        if ( token )
            return true;
        else
            return false;
    };

    this.isAdmin = function () {
        if ( token.role == 'admin' )
            return true;
        else
            return false;
    };

    this.raw = function () {
        return store.get('token');
    };

    this.del = function () {
        store.remove( 'token' );
    };

}]);