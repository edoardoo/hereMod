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










angular.module("hereApp.collections")
.controller("CollectionsOverviewCtrl", ["$rootScope", "$scope", "$location", "CollectionsService", "collectionsHelper", "PreloadImage", "ensureHTTPSFilter", "herePageTitle", "mapContainers", "markerIcons", "markerService", "utilityService", "mapsjs", "Features", "TrackingService", "RedirectService", "panelsService", "User", "HereAccountService", "splitTesting", function(e, t, o, n, l, i, c, a, s, r, d, u, g, f, m, v, p, C, h, k) {
	var y, I = !1,
		M = s.favorites,
		S = function() {
			s.clearContainer(M), s.showOnly(s.favorites)
		},
		w = !1;
	a.set(), t.landingPage = "old" !== f.collections.landingPage, t.images = {}, t.collections = [], t.emptyCollections = !0, t.state = {
		editMode: !1,
		confirmDelete: null
	};
	var P = function() {
			w || (t.$watch("collections.length", function() {
				t.state.loaded = !1, t.state.loading = !0, $()
			}), t.$on("userLoggedIn", T), t.$on("$destroy", S), w = !0)
		},
		D = function() {
			var e = u.convertQueryFormatToMapInfo(o.search()
				.map);
			y.getViewModel()
				.setCameraData({
					position: new g.geo.Point(e.latitude, e.longitude),
					zoom: e.zoomLevel,
					animate: !0
				})
		},
		L = function() {
			t.state.loaded = !1, t.state.loading = !0
		},
		$ = function() {
			var e = !t.unsortedVirtualCollection || 0 === t.unsortedVirtualCollection.length;
			t.emptyCollections = e && (!t.collections || 0 === t.collections.length), t.state.editMode = t.state.editMode && !t.emptyCollections, t.state.loading = !1, t.state.loaded = !0, t.state.confirmDelete = null, t.state.deleteProgress = null
		},
		T = function() {
			return k.start("collectionsLanding"), L(), t.isLoggedIn = C.isLoggedIn(), C.isLoggedIn() ? void n.getAllCollections()
				.then(function() {
					S(), t.collections = n.readonlyCollections, t.collections.forEach(function(e) {
							if (e.landscapeImageUrl) {
								var o = {
									src: c(e.landscapeImageUrl)
								};
								i.single(o.src)
									.then(function() {
										o.loaded = !0
									}), t.images[e.id] = o
							}
						}), n.getVirtualCollection()
						.then(function(e) {
							e && (t.unsortedVirtualCollection = e, t.emptyCollections = !1)
						})["finally"](function() {
							I = !0
						}), f.collections.overviewFavoritesMarker && n.getAllFavorites()
						.then(function(e) {
							var t = [];
							e && e.length && (e.forEach(function(e) {
								var o = l.createFavoriteMarker(e);
								o && t.push(o)
							}), t.length && M.addObjects(t))
						}), $(), P()
				}, function() {
					$(), P()
				}) : ($(), P(), void(t.landingPage ? k.start("collectionsLandingButton") : h.openSignIn()))
		};
	t.getImageStyles = function(e) {
		var o = {};
		return t.images[e.id] && (o = {
			"background-image": "url(" + t.images[e.id].src + ")"
		}, t.images[e.id].loaded && (o.opacity = 1)), o
	}, t.toggleEditMode = function() {
		t.state.editMode || (p.isMinimized && (p.isMinimized = !1), m.click("collections:EditCollectionsCard:click")), t.state.confirmDelete = null, t.state.editMode = !t.state.editMode
	}, t.confirmDelete = function(e) {
		m.click("collections:RemoveCollection:click"), t.state.confirmDelete = e
	}, t.deleteCollection = function(e) {
		t.state.deleteProgress = e, n.removeCollection(e.id)["finally"](function() {
			m.track("collections", "collection removed", "", null)
		})
	}, t.createCollection = function() {
		m.click("collections:CreateCollection:click"), t.$emit("modalDialog", {
			templateUrl: "features/collections/create.html",
			replace: !0,
			onExit: function() {
				t.modals.pop()
			}
		})
	}, t.showDetails = function(e) {
		v.goToCollection(e.id, "collections")
	}, t.signIn = function() {
		k.conversion("collectionsLandingButton"), m.track("account", "signin attempt", "", null), h.openSignIn()
	}, t.whenMapIsReady.then(function(e) {
		y = e, T(), D(), s.showOnly(M)
	}, t.downloadBackupFile = function(text) {
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', 'BackupHereMaps.kml');
		pom.style.display = 'none';
		document.body.appendChild(pom);
		pom.click();
		document.body.removeChild(pom);
	},t.assembleBackup = function(optimizedFaves){
		var base = "<?xml version='1.0' encoding='UTF-8'?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n<Document>@content</Document>\n</kml>",
		element = "\n<Placemark>\n<name>@name</name>\n<description>@description</description>\n<Point>\n<coordinates>@coordinates</coordinates>\n</Point>\n</Placemark>",
		collectionString = "\n<Folder>\n<name>@name</name>\n@placemarks\n</Folder>",
		collections = "";


		optimizedFaves.forEach(function(e) {
		var o = collectionString.replace("@name", e.name),
			n = "";
		e.faves.forEach(function(e) {
			n += element.replace("@name", (e.customName != undefined) ? e.customName.escapeXml() + " ~ " + e.name.escapeXml() : e.name.escapeXml() )
				.replace("@description", e.location.address.text ? e.location.address.text.escapeXml() : '')
				.replace("@coordinates", e.location.position.longitude + "," + e.location.position.latitude + ",0")
		}), o = o.replace("@placemarks", n), collections += o
		});
		return base.replace("@content", collections);

		}, t.downloadBackup = function() {

		var that = this;
		var o = [],
			e = n.readonlyCollections;

		 
		String.prototype.escapeXml = function () {
			//remember to escape &amp again after compression and escaping!!!!!!
			var XML_CHAR_MAP = {
				'<': '&lt;',
				'>': '&gt;',
				'&': '&amp;',
				'"': '&quot;',
				"'": '&apos;'
			}
			return this.replace(/[<>&"']/g, function (ch) {
				return XML_CHAR_MAP[ch];
			});
		}
		n.getAllFavorites()
			.then(function(n) {

				var optimizedFaves = [];
				//create collection for spare places:
				optimizedFaves[0] = { id:0, name: "Uncategorized", description: "This places didn't have a collection." , faves:[]};

				//function to check if object of an array has a key 'id' equal to j

				Array.prototype.hasId = function(j){
					var i = this.length;
					while(i--){
						if( this[i].id == j) return i;
					}
					return false;
				}

				//let's produce the optimizedFaves array where the places will be organized on collections, 
				//even those without a collection [BugFix 14/4/2015]

				n.forEach(function(nth){
					if(nth.collectionId){

						for(var k =0, kl = nth.collectionId.length; k<kl; k++){

							var  indexOfCollection = optimizedFaves.hasId(nth.collectionId[k]);

							if( indexOfCollection === false ){

								var eId =  e.hasId(nth.collectionId[k]); 

								if( eId !== false ){
									indexOfCollection = optimizedFaves.push({
										id: nth.collectionId[k],
										name: e[eId].name ? e[eId].name.escapeXml() : 'no name',
										description: e[eId].description ? e[eId].description.escapeXml() : 'no description',
										faves: []
									});
								}else{
									indexOfCollection = optimizedFaves.push({
										id: nth.collectionId[k],
										name: 'No collection specified ',
										description: "Looks like these places didn't were under any collection.",
										faves: []
									});
								}

								indexOfCollection -=1 ;
							}
							optimizedFaves[indexOfCollection].faves.push(nth); 
						}

					}else{
						optimizedFaves[0].faves.push(nth);
					}

				});

				that.downloadBackupFile( that.assembleBackup( optimizedFaves ) );
			})
	})
}]);


