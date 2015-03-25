
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var setStuff = function (){

  $.ajax({
    url: 'https://www.here.com',
    success: function(i){

      // i = i.replace(/myApp/g, 'mySecondApp =       // i = i.replace(/third/g, 'fourth');
       var inject = '<script>angular.module("hereApp.collections").controller("CollectionDetailCtrl",["$scope","$routeParams","$location","$timeout","CollectionsService","COLLECTION_NAME_SIZE","mapContainers","markerService","collectionsHelper","PBAPI","PreloadImage","ensureHTTPSFilter","RedirectService","herePageTitle","hereBrowser","Features","TrackingService","panelsService","User",function(e,i,t,o,l,n,c,a,s,r,d,u,f,p,h,g,v,m,I){var y,C,D={},E=c.favorites,F=angular.noop,O=["w300","w700"],k=function(){D={},c.clearContainer(E),c.showOnly(c.favorites)};p.set(),v.track("collections","collection opened","",null),e.showUpdateErrorNotification=!1,e.COLLECTION_NAME_SIZE=n,e.isVirtual=!0,e.images={},t.search().edit&&(e.editMode=!0,t.search("edit",null).replace()),t.search().favedit&&t.search("favedit",null).replace(),e.highlighted=null,e.hasNoDescription=!0,e.LIMIT_DESCRIPTION=250,e.updateObj={},e.favorites=[],e.imagesAvailable=[],e.state={editMode:!1,editDescription:!1,confirmDelete:null},e.displayOtherCollectionsFavorites=function(e){c.clearContainer(c.favoritesSmall),l.getAllFavorites().then(function(i){var t,o=[],l=[];e.forEach(function(e){e.placesId&&l.push(e.placesId)}),i.forEach(function(e){e.placesId&&-1===l.indexOf(e.placesId)&&(t=s.createSmallFavoriteMarker(e),t&&(o.push(t),D[e.id]=a.getWrapped(t)))}),o.length&&(c.favoritesSmall.addObjects(o),c.favoritesSmall.setVisibility(!0))})};var b=function(){l.getFavorites(i.collectionId).then(function(o){var l=[];e.favorites=o,g.collections.alwaysVisible&&e.displayOtherCollectionsFavorites(e.favorites),e.loadingFavorites=!1,k(),e.favorites.length?(e.collection.total=e.favorites.length,e.favorites.forEach(function(i){i.placesId&&r.images({id:i.placesId,image_dimensions:O.join(",")}).then(function(t){t.data&&t.data.available&&(e.imagesAvailable.push(i.id),e.images[i.placesId]={src:u(t.data.items[0].dimensions[O[0]])},d.single(e.images[i.placesId].src).then(function(){e.images[i.placesId].loaded=!0}))});var t=s.createFavoriteMarker(i,function(){e.$apply(function(){e.highlighted=i})},function(){e.$apply(function(){e.highlighted=null})});t&&(l.push(t),D[i.id]=a.getWrapped(t))}),l.length&&(E.addObjects(l),y.setViewBounds(E.getBounds())),F=e.$watch("favorites.length",function(){e.favorites&&(0===e.favorites.length?("unsorted"===i.collectionId&&t.path("/collections"),e.emptyFavorites=!0,e.state.editDescription=!1):e.emptyFavorites=!1)})):("unsorted"===i.collectionId&&t.path("/collections"),e.emptyFavorites=!0)})};e.loadingDetail=!0,e.loadingFavorites=!0,C=function(){return I.isLoggedIn()?(l.getCollectionById(i.collectionId).then(function(i){e.collection=i,e.loadingDetail=!1,e.isVirtual=l.isCollectionVirtual(i)},function(){t.path("/collections")}),void o(b,1e3)):void t.path("/collections")},e.whenMapIsReady.then(function(e){y=e,C(),c.showOnly(E)}),e.getImageStyles=function(i){var t={};return i.placesId&&e.images[i.placesId]&&(t={"background-image":"url("+e.images[i.placesId].src+")"},e.images[i.placesId].loaded&&(t.opacity=1)),t},e.isCity=function(e){return"city-town-village"===e.category},e.showEditor=function(){e.collection.description?(e.updateObj.description=angular.copy(e.collection.description),e.hasNoDescription=!1):e.hasNoDescription=!0,e.state.errorDescription=!1,e.state.editDescription=!0},e.hideEditor=function(){e.updateObj.description=null,e.state.errorDescription=!0,e.state.editDescription=!1},e.addDescription=function(){var i=angular.copy(e.collection);i.description="POIPOIPOIPOISDFPOISDPFOISDPOFISPDOIFPSODIFPOSDIFPOSIDFPOSIDF",e.submitted=!0,l.updateCollection(i).then(function(i){e.collection=i,e.hideEditor()},function(){e.state.errorDescription=!0})["finally"](function(){e.submitted=!1})},e.toggleEditMode=function(){e.state.editMode||(m.isMinimized&&(m.isMinimized=!1),v.click("collections:EditPlacesFromCollections:click")),e.state.confirmDelete=null,e.showUpdateErrorNotification=!1,e.state.editMode&&"unsorted"!==e.collection.id&&l.updateCollection(e.collection).then(function(){e.showUpdateErrorNotification=!1},function(){e.showUpdateErrorNotification=!0}),e.state.editMode=!e.state.editMode},e.showDetails=function(e,i){var o=e.location.position;e.placesId&&i&&t.search("favedit",!0),s.setRedirectService({favorite:e,position:o})},e.doHighlight=function(e){h.mouse&&D[e.id]&&D[e.id].addHighlight(),console.log("highlaiiiiiiit")},e.removeHighlight=function(e){h.mouse&&D[e.id]&&D[e.id].removeHighlight()},e.confirmDelete=function(i){v.click("collections:RemovePlaceFromCollection:click"),e.state.confirmDelete=i},e.deleteFavorite=function(i){console.log("ready for remove"),e.state.deleteProgress=i;var t=e.imagesAvailable.indexOf(i.id);if(-1!==t&&e.imagesAvailable.splice(t,1),i.collectionId.length>1){var o=angular.copy(i.collectionId),n=o.indexOf(e.collection.id);-1!==n&&o.splice(n,1),l.updateFavorite(i,o).then(function(){b(),e.state.confirmDelete=null,v.track("collections","item removed from collection","",null),console.log("delete mofo")})["finally"](function(){e.state.deleteProgress=null})}else l.removeFavorite(i).then(function(){b(),e.state.confirmDelete=null,v.track("collections","item removed from last collection","",null)})["finally"](function(){e.state.deleteProgress=null})},e.chooseCover=function(){v.click("collections:ChangeImage:click"),e.$emit("modalDialog",{templateUrl:"features/collections/cover.html",replace:!0,context:e.collection,onExit:function(){e.modals.pop()}})},e.startDiscover=function(i){e.panelsService.discoverIsMinimized=i,t.path("/discover/eat-drink")},e.onBackButtonClick=function(){f.goToCollection()},e.$on("$destroy",function(){k(),F()})}]);</script>';
        //var inject = "<script\> function testMe(){console.log('Aimma tester');}</script\>";
        //clean the code: 
        i = i.replace(/<(\/)?html.*>/g, '');
        i = i.replace(/<head([^.]|[.])*\/head>/g, '');
        i = i.replace(/<(\/)?body.*>/g, '');

        i = i.replace(/<!doctype.*>/g, '');
        i = i.replace('"use strict";','');


        
       // i = i.split("</head>").join(inject + "</head>");

       // angular = null;
        //console.dir(i);
        $('body').html(i+inject);
        // h = document.getElementsByTagName('body')[0];
        // h.innerHTML = i+inject;
        // debugger;
        angular.bootstrap(document, ['hereApp'])
    }
  });

}

loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", setStuff);


