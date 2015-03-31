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
    }]), angular.module("hereApp.collections").factory("collectionsHelper", ["utilityService", "ItineraryItem", "categories", "markerService", "markerIcons", "directionsUrlHelper", "$location", "Features", "RedirectService", "placeService", function(a, b, c, d, e, f, g, h, i, j) {
        var k = {},
            l = function(a) {
                var b, c = a.originalPosition || a.mappedPosition;
                if (c) return b = a.text ? a.text : a.comments && a.comments.length >= 1 ? a.comments[0] : c.latitude.toString() + ", " + c.longitude.toString(), {
                    position: c,
                    text: b
                }
            };
        k.parseScbeWaypoints = function(a) {
            var c = [],
                d = [];
            return angular.forEach(a, function(a) {
                var e = new b,
                    f = l(a);
                f && f.position && (c.push(f), e.populate({
                    model: {
                        position: {
                            lat: f.position.latitude,
                            lng: f.position.longitude
                        },
                        title: f.text
                    }
                }), d.push(e))
            }), {
                waypoints: c,
                itineraryItems: d
            }
        };
        var m = function(a, b, c) {
            return d.createMarker({
                PBAPIID: a.favorite.placesId,
                locationAddress: a.favorite.placesId ? void 0 : a.favorite.name,
                position: {
                    lat: a.position.latitude,
                    lng: a.position.longitude
                },
                icons: a.icons,
                flag: {
                    title: a.favorite.customName,
                    icon: a.flagIcon
                },
                routing: a.routing,
                isAlwaysVisibleFavoriteMarker: a.isAlwaysVisibleFavoriteMarker,
                onMouseEnter: b,
                onMouseLeave: c,
                onClick: function(b, c) {
                    if (k.setRedirectService(a), a.routing) {
                        c.preventDefault();
                        var d = a.favorite.mode.transportModes || "car",
                            e = k.parseScbeWaypoints(a.favorite.waypoints),
                            h = f.createUrlForItems(e.itineraryItems, d);
                        g.path(h)
                    }
                }
            })
        };
        return k.createFavoriteMarker = function(a, b, d) {
            var f, g = j.getMainCategoryId(a);
            if (a.category = g, a.location && a.location.position) f = m({
                favorite: a,
                position: a.location.position,
                icons: e.collected(g),
                flagIcon: c.getSVG(g).replace(/#fff/gi, "#ffe600")
            }, b, d);
            else if (h.collections.routeMarker && a.waypoints) {
                var i = a.waypoints[a.waypoints.length - 1],
                    k = e.collectedRoute(),
                    l = i.originalPosition || i.mappedPosition;
                f = m({
                    favorite: a,
                    position: l,
                    icons: k,
                    flagIcon: k.normal.svg.replace('viewBox="0 0 35 35"', 'viewBox="6 6 42 42"'),
                    routing: !0
                }, b, d)
            }
            return f
        }, k.createSmallFavoriteMarker = function(a) {
            var b = j.getMainCategoryId(a),
                d = c.getSVG(b).replace(/#fff/gi, "#ffe600"),
                f = e.smallFavorite();
            return m({
                isAlwaysVisibleFavoriteMarker: !0,
                PBAPI: a.placesId,
                favorite: {
                    placesId: a.placesId,
                    name: a.name
                },
                position: a.location.position,
                icons: f,
                flagIcon: d
            })
        }, k.setRedirectService = function(a) {
            a.favorite.placesId ? i.goToPlace({
                placeId: a.favorite.placesId,
                position: a.position,
                title: a.favorite.name
            }, "collection favorite place") : i.goToLocation({
                lat: a.position.latitude,
                lng: a.position.longitude,
                msg: a.favorite.name
            }, "collection favorite location")
        }, k
    }])












angular.module("hereApp.places").controller("PlacesCtrl", ["$scope", "Features", "$routeParams", "$location", "$window", "$q", "PBAPI", "geoCoder", "placeService", "RedirectService", "RecentsService", "herePageTitle", "categories", "markerService", "markerIcons", "mapContainers", "mapsjs", "utilityService", "TrackingService", "directionsUrlHelper", "$rootScope", "CollectionsAlwaysVisibleService", "splitTesting", "hereBrowser", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x) {
        var y, z, A, B = this,
            C = p.PDC,
            D = ["building"];
        a.place = null, B.initialize = function() {
            a.loading = !0, a.notFound = !1, B.getPlace(c).then(function(b) {
                a.loading = !1, a.place = b, k.addPlace(b), a.whenMapIsReady.then(function(a) {
                    y = a, B.displayMarker(y, b)
                })
            }, function() {
                a.loading = !1, a.notFound = !0
            })
        }, B.getPlace = function(a) {
            var b = f.defer(),
                c = a ? a.id : null,
                d = a && a.href ? e.atob(decodeURIComponent(a.href)) : null,
                k = c && c.match(/^loc-[0-9a-zA-Z]+/),
                m = !a || c || d ? null : a.msg,
                n = !(!c && !d || k),
                o = a.map,
                p = function(d) {
                    g.place(d).then(function(d) {
                        var e = angular.copy(d.data),
                            g = e.placeId || e.id,
                            j = function(a) {
                                return a && a.position && (!a.address || a.address && !a.address.city && !a.address.state) ? h.reverseGeoCode({
                                    location: a.position
                                }).then(function(a) {
                                    if (a && a.data) {
                                        var b = a.data.address;
                                        return b.text = b.label, b
                                    }
                                }) : a.address
                            };
                        return c && e.placeId && c !== e.placeId && (e.altPlaceId = c), k = i.isLocation(e), n = g && !k, m = k ? m : null, n && i.isDiscoverCategory(e) ? B.redirectToDiscover(e) : (e.mainCategory = i.getMainCategoryId(e), e.name = m || (k && !i.isCoordinate(e) ? e.name.replace(/,/g, "yayayayay") : e.name+"yayayayay2"), void f.when(j(e.location)).then(function(c) {
                            e.location.address = c, e.name = i.isCoordinate(e) && c ? i.getAddressLabel(c) : e.name;
                            var d = e.location.address && e.location.address.city ? " - " + e.location.address.city : "",
                                f = d && e.location.address.city !== e.name ? d : "",
                                g = D.indexOf(e.mainCategory) > -1,
                                h = k || g ? "" : " - " + e.categories[0].title,
                                j = e.name + h + f + " - HERE";
                            l.set(j), !n && !k || a && a.country || E(e), b.resolve(e)
                        }))
                    }, b.reject)
                };
            if (!c && !d && !o) return b.reject(new Error("Invalid params: no pId, pHref or pMap")), b.promise;
            if (c || d) {
                var s = d ? {
                    href: d
                } : {
                    id: c
                };
                return p(s), b.promise
            }
            var t = r.convertQueryFormatToMapInfo(o),
                u = {
                    size: 1,
                    q: t.latitude + "," + t.longitude,
                    center: new q.geo.Point(t.latitude, t.longitude),
                    lookahead: !0
                };
            return g.search(u).then(function(a) {
                a.data.items[0] ? p({
                    href: a.data.items[0].href
                }) : j.goToDiscover({
                    lat: t.latitude,
                    lng: t.longitude
                }, "", !0)
            }), b.promise
        }, B.redirectToDiscover = function(a) {
            var b = angular.copy(a.location.position);
            return b = angular.extend(b, i.getPlaceDisplayRestrictions(a)), h.geoCodeAddress(a.location.address).then(function(a) {
                var c = a && a.data && a.data.mapView;
                c && (b.bbox = c)
            })["finally"](function() {
                j.goToDiscover(b, "", !0)
            })
        }, B.formatAddressText = function(a) {
            var b = a.location && a.location.address && a.location.address.text ? a.location.address.text : "";
            return b.replace(/<br\/>/gi, ", ").replace(a.name + ", ", "poipoi")
        }, B.createCategoryMarker = function(a) {
            var b = i.getMainCategoryId(a),
                c = o.collected(b),
                d = {
                    position: a.location.position,
                    icons: o.category(b),
                    collectedIcons: c,
                    PBAPIID: a.placeId,
                    flag: {
                        title: a.name,
                        icon: m.getSVG(b),
                        collectedIcon: m.getSVG(b).replace(/#fff/gi, "#ffe600")
                    }
                };
            return n.createMarker(d)
        }, B.displayMarker = function(b, c) {
            if (C.removeAll(), z = p.getExistingMarkerByPBAPIID(c.placeId), A = z && n.getWrapped(z), !A) {
                var d = B.createCategoryMarker(c);
                p.showOnly(C), C.addObject(d), A = n.getWrapped(d)
            }
            A.addFlag(), v.showAllFavorites(), z && b.getViewBounds().containsPoint(z.getPosition()) || (B.centerMapToPlace(!1), b.getViewPort().addEventListener("resize", B.centerMapToPlace)), A.data && A.data.routing && (A.data.routing = !1), a.wrappedMarker = A
        }, B.removeMarker = function() {
            A && (A.removeFlag(), p.clearContainer(C))
        }, B.centerMapToPlace = function(c) {
            var d = a.place.location.position,
                e = c ? y.getZoom() : 16;
            if (!b.map || !b.map.syncMapToUrl) {
                var f = !b.disableTransitions && !x.isTablet && !u.firstLoad;
                return y.getViewModel().setCameraData({
                    position: new q.geo.Point(d.lat, d.lng),
                    zoom: e,
                    animate: f
                }), void(u.firstLoad = !0)
            }
            j.recenterMap(y, d, e, !0)
        }, B.tearDown = function(a) {
            if (a = a || {}, a.removeMsg) {
                var b = d.search();
                b.msg && (delete b.msg, d.search(b).replace())
            }
            z ? A && A.removeFlag() : (B.removeMarker(), y && y.getViewPort().removeEventListener("resize", B.centerMapToPlace))
        }, B.replaceInit = function(a) {
            B.tearDown(a), B.initialize(), r.scrollContainerToTop()
        }, a.$watch("place.media.images.items", function(b) {
            a.headerImage = b ? b[1] || b[0] : null
        }), a.$on("$destroy", function() {
            B.tearDown({
                removeMsg: !0
            }), G()
        });
        var E = function(a) {
                d.path(i.getFriendlyUrl(a)).replace()
            },
            F = function(b, c) {
                return !c.$$route || 0 !== c.$$route.originalPath.indexOf("/p") && 0 !== c.$$route.originalPath.indexOf("/:country") ? void(c.$$route && "/location/" === c.$$route.originalPath && (a.place && a.place.name && c.params.msg && a.place.name !== c.params.msg ? B.replaceInit() : E(a.place))) : void(a.place ? a.place.placeId !== c.params.id ? B.replaceInit({
                    removeMsg: !0
                }) : E(a.place) : B.replaceInit({
                    removeMsg: !0
                }))
            },
            G = a.$on("$routeChangeSuccess", F);
        B.initialize(), a.notificationInfoMessage = "", a.$on("notification_pdc", function(b, c) {
            a.notificationInfoMessage = c.message
        }), a.sendToCar = function() {
            s.track("pdc", "User clicks on 'Send to Car' button", {
                prop32: "Send to Car opened",
                eVar32: "Send to Car opened"
            }), u.$broadcast("modalDialog", {
                templateUrl: "features/sendToCar/dialog.html",
                replace: !0,
                context: a.place
            })
        }, a.goToDirections = function() {
            s.track("directions", "directions panel opened", {
                prop40: "placepage",
                eVar40: "placepage"
            }), d.path(t.createUrlForPlace(a.place))
        }, a.shareModule = function() {
            u.$broadcast("openShare")
        }
    }])