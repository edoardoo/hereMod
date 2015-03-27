 angular.module("hereApp.collections").controller("CollectionDetailCtrl", ["$scope", "$routeParams", "$location", "$timeout", "CollectionsService", "COLLECTION_NAME_SIZE", "mapContainers", "markerService", "collectionsHelper", "PBAPI", "PreloadImage", "ensureHTTPSFilter", "RedirectService", "herePageTitle", "hereBrowser", "Features", "TrackingService", "panelsService", "User", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
        var t, u, v = {},
            w = g.favorites,
            x = angular.noop,
            y = ["w300", "w700"],
            z = function() {
                v = {}, g.clearContainer(w), g.showOnly(g.favorites)
            };
        n.set(), q.track("collections", "collection opened", "", null), a.showUpdateErrorNotification = !1, a.COLLECTION_NAME_SIZE = f, a.isVirtual = !0, a.images = {}, c.search().edit && (a.editMode = !0, c.search("edit", null).replace()), c.search().favedit && c.search("favedit", null).replace(), a.highlighted = null, a.hasNoDescription = !0, a.LIMIT_DESCRIPTION = 250, a.updateObj = {}, a.favorites = [], a.imagesAvailable = [], a.state = {
            editMode: !1,
            editDescription: !1,
            confirmDelete: null
        }, a.displayOtherCollectionsFavorites = function(a) {
            g.clearContainer(g.favoritesSmall), e.getAllFavorites().then(function(b) {
                var c, d = [],
                    e = [];
                a.forEach(function(a) {
                    a.placesId && e.push(a.placesId)
                }), b.forEach(function(a) {
                    a.placesId && -1 === e.indexOf(a.placesId) && (c = i.createSmallFavoriteMarker(a), c && (d.push(c), v[a.id] = h.getWrapped(c)))
                }), d.length && (g.favoritesSmall.addObjects(d), g.favoritesSmall.setVisibility(!0))
            })
        };
        var A = function() {
            e.getFavorites(b.collectionId).then(function(d) {
                var e = [];
                console.dir(d);
                a.favorites = d, p.collections.alwaysVisible && a.displayOtherCollectionsFavorites(a.favorites), a.loadingFavorites = !1, z(), a.favorites.length ? (a.collection.total = a.favorites.length, a.favorites.forEach(function(b) {
                    b.placesId && j.images({
                        id: b.placesId,
                        image_dimensions: y.join(",")
                    }).then(function(c) {
                        c.data && c.data.available && (a.imagesAvailable.push(b.id), a.images[b.placesId] = {
                            src: l(c.data.items[0].dimensions[y[0]])
                        }, k.single(a.images[b.placesId].src).then(function() {
                            a.images[b.placesId].loaded = !0
                        }))
                    });
                    var c = i.createFavoriteMarker(b, function() {
                        a.$apply(function() {
                            a.highlighted = b
                        })
                    }, function() {
                        a.$apply(function() {
                            a.highlighted = null
                        })
                    });
                    c && (e.push(c), v[b.id] = h.getWrapped(c))
                }), e.length && (w.addObjects(e), t.setViewBounds(w.getBounds())), x = a.$watch("favorites.length", function() {
                    a.favorites && (0 === a.favorites.length ? ("unsorted" === b.collectionId && c.path("/collections"), a.emptyFavorites = !0, a.state.editDescription = !1) : a.emptyFavorites = !1)
                })) : ("unsorted" === b.collectionId && c.path("/collections"), a.emptyFavorites = !0)
            })
        };
        a.loadingDetail = !0, a.loadingFavorites = !0, u = function() {
            return s.isLoggedIn() ? (e.getCollectionById(b.collectionId).then(function(b) {
                a.collection = b, a.loadingDetail = !1, a.isVirtual = e.isCollectionVirtual(b)
            }, function() {
                c.path("/collections")
            }), void d(A, 1e3)) : void c.path("/collections")
        }, a.whenMapIsReady.then(function(a) {
            t = a, u(), g.showOnly(w)
        }), a.getImageStyles = function(b) {
            var c = {};
            return b.placesId && a.images[b.placesId] && (c = {
                "background-image": "url(" + a.images[b.placesId].src + ")"
            }, a.images[b.placesId].loaded && (c.opacity = 1)), c
        }, a.isCity = function(a) {
            return "city-town-village" === a.category
        }, a.showEditor = function() {
            a.collection.description ? (a.updateObj.description = angular.copy(a.collection.description), a.hasNoDescription = !1) : a.hasNoDescription = !0, a.state.errorDescription = !1, a.state.editDescription = !0
        }, a.hideEditor = function() {
            a.updateObj.description = null, a.state.errorDescription = !0, a.state.editDescription = !1
        }, a.addDescription = function() {
            var b = angular.copy(a.collection);
            b.description = a.updateObj.description, a.submitted = !0, e.updateCollection(b).then(function(b) {
                a.collection = b, a.hideEditor()
            }, function() {
                a.state.errorDescription = !0
            })["finally"](function() {
                a.submitted = !1
            })
        }, a.toggleEditMode = function() {
            a.state.editMode || (r.isMinimized && (r.isMinimized = !1), q.click("collections:EditPlacesFromCollections:click")), a.state.confirmDelete = null, a.showUpdateErrorNotification = !1, a.state.editMode && "unsorted" !== a.collection.id && e.updateCollection(a.collection).then(function() {
                a.showUpdateErrorNotification = !1
            }, function() {
                a.showUpdateErrorNotification = !0
            }), a.state.editMode = !a.state.editMode
        }, a.showDetails = function(a, b) {
            var d = a.location.position;
            a.placesId && b && c.search("favedit", !0), i.setRedirectService({
                favorite: a,
                position: d
            })
        }, a.doHighlight = function(a) {
            o.mouse && v[a.id] && v[a.id].addHighlight()
        }, a.removeHighlight = function(a) {
            o.mouse && v[a.id] && v[a.id].removeHighlight()
        }, a.confirmDelete = function(b) {
            q.click("collections:RemovePlaceFromCollection:click"), a.state.confirmDelete = b
        }, a.deleteFavorite = function(b) {
            a.state.deleteProgress = b;
            var c = a.imagesAvailable.indexOf(b.id);
            if (-1 !== c && a.imagesAvailable.splice(c, 1), b.collectionId.length > 1) {
                var d = angular.copy(b.collectionId),
                    f = d.indexOf(a.collection.id); - 1 !== f && d.splice(f, 1), e.updateFavorite(b, d).then(function() {
                    A(), a.state.confirmDelete = null, q.track("collections", "item removed from collection", "", null)
                })["finally"](function() {
                    a.state.deleteProgress = null
                })
            } else e.removeFavorite(b).then(function() {
                A(), a.state.confirmDelete = null, q.track("collections", "item removed from last collection", "", null)
            })["finally"](function() {
                a.state.deleteProgress = null
            })
        }, a.chooseCover = function() {
            q.click("collections:ChangeImage:click"), a.$emit("modalDialog", {
                templateUrl: "features/collections/cover.html",
                replace: !0,
                context: a.collection,
                onExit: function() {
                    a.modals.pop()
                }
            })
        }, a.startDiscover = function(b) {
            a.panelsService.discoverIsMinimized = b, c.path("/discover/eat-drink")
        }, a.onBackButtonClick = function() {
            m.goToCollection()
        }, a.$on("$destroy", function() {
            z(), x()
        })
    }])