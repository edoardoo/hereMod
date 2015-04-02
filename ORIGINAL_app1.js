"use strict";
angular.module("ngLocale", [], ["$provide", function(a) {
    function b(a) {
        a += "";
        var b = a.indexOf(".");
        return -1 == b ? 0 : a.length - b - 1
    }

    function c(a, c) {
        var d = c;
        void 0 === d && (d = Math.min(b(a), 3));
        var e = Math.pow(10, d),
            f = (a * e | 0) % e;
        return {
            v: d,
            f: f
        }
    }
    var d = {
        ZERO: "zero",
        ONE: "one",
        TWO: "two",
        FEW: "few",
        MANY: "many",
        OTHER: "other"
    };
    a.value("$locale", {
        DATETIME_FORMATS: {
            AMPMS: ["am", "pm"],
            DAY: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            ERANAMES: ["Before Christ", "Anno Domini"],
            ERAS: ["BC", "AD"],
            MONTH: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            SHORTDAY: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            SHORTMONTH: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            fullDate: "EEEE, d MMMM y",
            longDate: "d MMMM y",
            medium: "d MMM y HH:mm:ss",
            mediumDate: "d MMM y",
            mediumTime: "HH:mm:ss",
            "short": "dd/MM/y HH:mm",
            shortDate: "dd/MM/y",
            shortTime: "HH:mm"
        },
        NUMBER_FORMATS: {
            CURRENCY_SYM: "£",
            DECIMAL_SEP: ".",
            GROUP_SEP: ",",
            PATTERNS: [{
                gSize: 3,
                lgSize: 3,
                maxFrac: 3,
                minFrac: 0,
                minInt: 1,
                negPre: "-",
                negSuf: "",
                posPre: "",
                posSuf: ""
            }, {
                gSize: 3,
                lgSize: 3,
                maxFrac: 2,
                minFrac: 2,
                minInt: 1,
                negPre: "¤-",
                negSuf: "",
                posPre: "¤",
                posSuf: ""
            }]
        },
        id: "en-gb",
        pluralCat: function(a, b) {
            var e = 0 | a,
                f = c(a, b);
            return 1 == e && 0 == f.v ? d.ONE : d.OTHER
        }
    })
}]);
angular.module("hereApp", ["ngSanitize", "ngRoute", "ipCookie", "ngQuickDate", "ngClipboard", "monospaced.qrcode", "hereApp.service", "hereApp.directive", "hereApp.filters", "hereApp.collections", "hereApp.directions", "hereApp.traffic", "hereApp.discover", "hereApp.search", "hereApp.mapControls", "hereApp.templates", "hereApp.places", "hereApp.panels", "hereApp.nps", "hereApp.reportImage", "hereApp.reportMapProblem", "hereApp.feedback", "hereApp.photoGallery", "hereApp.sendToCar", "hereApp.settings", "hereApp.welcome", "hereApp.landingPage", "hereApp.cookieNotice"]), angular.module("hereApp.service", []), angular.module("hereApp.directive", ["ngSanitize", "hereApp.templates", "hereApp.service"]), angular.module("hereApp.filters", []), angular.module("hereApp.collections", ["hereApp.service"]), angular.module("hereApp.directions", ["hereApp.service"]), angular.module("hereApp.traffic", ["hereApp.service"]), angular.module("hereApp.search", ["ngSanitize", "hereApp.service"]), angular.module("hereApp.places", ["hereApp.service", "hereApp.directive", "hereApp.filters"]), angular.module("hereApp.discover", ["hereApp.service"]), angular.module("hereApp.panels", ["ngAnimate"]), angular.module("hereApp.templates", []), angular.module("hereApp.mapControls", ["hereApp.service"]), angular.module("hereApp.nps", ["hereApp.service"]), angular.module("hereApp.reportImage", ["hereApp.service"]), angular.module("hereApp.reportMapProblem", ["hereApp.service"]), angular.module("hereApp.feedback", ["hereApp.service"]), angular.module("hereApp.photoGallery", ["hereApp.service"]), angular.module("hereApp.collections", ["hereApp.service"]), angular.module("hereApp.sendToCar", ["hereApp.service"]), angular.module("hereApp.settings", ["hereApp.service", "ipCookie"]), angular.module("hereApp.welcome", []), angular.module("hereApp.landingPage", ["hereApp.service"]), angular.module("hereApp.cookieNotice", ["ipCookie", "hereApp.service"]), angular.module("hereApp").controller("RootCtrl", ["$rootScope", "$scope", "$q", "$route", "panelsService", "$window", "$location", "mapUtils", "utilityService", "User", "hereMapStateStorage", "HistoryService", "$timeout", "LocationService", "TrackingService", "geolocation", "Features", "cookieNotice", "LocationChangedNpsTriggeringLogic", "streetLevel", "mapsjs", "$routeParams", "$document", "Config", "LocalStorageService", "trafficFlow", "RedirectService", "unitsStorage", "lazy", "hereBrowser", "NotificationsManager", "CountryService", "CollectionsAlwaysVisibleService", "splitTesting", "directionsUrlHelper", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I) {
        function J(a, c, d, e) {
            b.defaultMapLatitude = parseFloat(a), b.defaultMapLongitude = parseFloat(c), b.defaultMapZoomLevel = d, b.defaultMapType = e, T({
                latitude: b.defaultMapLatitude,
                longitude: b.defaultMapLongitude,
                zoomLevel: b.defaultMapZoomLevel,
                mapType: b.defaultMapType
            })
        }

        function K() {
            var a = g.search().map,
                b = a && a.split ? a.split(",") : [],
                c = k.getState(),
                d = c && c.baseMapType ? c.baseMapType : "NORMAL",
                e = c && c.view && c.view.zoom ? c.view.zoom : 10,
                f = h.getDesiredMapName(g.path());
            if ("latitude" in v) J(v.latitude, v.longitude, 20, h.NORMAL);
            else if (b.length < 2) z.getInitialTrafficLocation(v).then(function(a) {
                var b, c;
                a ? "city-town-village" !== a.type && "postal-area" !== a.type && "street-square" !== a.type && (a = j.getUserInitialLocation(), A.goToTraffic()) : a = j.getUserInitialLocation(), q.map.switcher && ("TRAFFIC" === f ? b = d && 0 === d.indexOf("SATELLITE") ? "SATELLITE_TRAFFIC" : "TRAFFIC" : "PUBLIC_TRANSPORT" === f && (b = d && 0 === d.indexOf("SATELLITE") ? "SATELLITE_PUBLIC_TRANSPORT" : "PUBLIC_TRANSPORT")), b = b || f || d, c = a.zoom || e, J(a.lat, a.lng, c, h.getMapTypeByName(b))
            }, function() {
                A.goToTraffic()
            });
            else {
                var l = i.convertQueryFormatToMapInfo(a),
                    m = l.mapType || f || d,
                    n = l.zoomLevel || e;
                J(l.latitude, l.longitude, n, h.getMapTypeByName(m))
            }
        }
        a.desiredMapType = "NORMAL", a.firstLoad = !0, H.start("improveTrafficC2A");
        var L = "WELCOME_MESSAGE_VERSION",
            M = q.welcome.version,
            N = !1,
            O = g.search() ? g.search().ref : null,
            P = !1,
            Q = function() {
                p.position({
                    doNotCenterOnLocation: !0,
                    origin: "rootController"
                })
            };
        a.externalPartnerReferrer = O;
        var R = function() {
                if (q.trackExternalPartners && g.search() && g.search().ref && (g.search("ref", null).replace(), f.here.externalPartners && f.here.externalPartners.eVar57 && f.here.externalPartners.eVar58)) {
                    var a;
                    a = "shareRoute" === f.here.externalPartners.eVar57 ? "directions" : "pdc", o.track(a, null, {
                        eVar57: f.here.externalPartners.eVar57,
                        eVar58: f.here.externalPartners.eVar58
                    }, null)
                }
            },
            S = function(a) {
                m(function() {
                    T({
                        latitude: a.getCenter().lat,
                        longitude: a.getCenter().lng,
                        zoomLevel: a.getZoom(),
                        mapType: a.getBaseLayer()
                    }), k.saveMapState(a)
                })
            },
            T = function(a) {
                var b = i.convertMapInfoToQueryFormat({
                    latitude: a.latitude,
                    longitude: a.longitude,
                    zoomLevel: a.zoomLevel,
                    type: h.getMapNameByType(a.mapType).toLowerCase()
                });
                n.updateSingleUrlParam("map", b)
            },
            U = function() {
                var b = c.defer();
                a.whenMapIsReady = b.promise, a.whenMapIsReady.then(function(b) {
                    if (k.saveMapState(b), b.addEventListener("baselayerchange", function() {
                            S(b)
                        }), b.addEventListener("mapviewchangeend", function() {
                            S(b)
                        }), a.whenMapIsReady.then = function(c) {
                            var d = c(b);
                            return d && d.then ? d : a.whenMapIsReady
                        }, q.locationAtStartup) {
                        var c = !q.directions.myLocationManual,
                            d = v.routeSplat,
                            e = d && I.parseRouteSplat(d).itineraryItems,
                            g = e && e[0] && e[0].myLocation;
                        g && H.start("directionsMyLocationManual2"), (c || !g) && Q()
                    }
                    W(), q.fbTrackingPixel && (f._fbq = [], C.loadJS("//connect.facebook.net/en_US/fbds.js", function() {
                        f._fbq.push(["addPixelId", "662785427171159"]), f._fbq.push(["track", "PixelInitialized", {}])
                    }))
                }), a.setMap = function(a) {
                    b.resolve(a)
                }
            };
        b.trackPanelOpen = function(a) {
            o.track(a, a + " panel opened", {
                prop40: "searchbar",
                eVar40: "searchbar"
            })
        }, b.clickOnDirectionLinkInSearchBar = function() {
            b.trackPanelOpen("directions")
        }, b.trackDiscoverOpen = function() {
            o.track("discover", "User opened Discover panel", {
                prop32: "discover opened",
                eVar32: "discover opened",
                prop45: "HERE logo",
                eVar45: "HERE logo"
            }, "event16")
        }, D.isiPadSafari && f.addEventListener("orientationchange", function() {
            f.scrollTo(0, 0)
        }), a.searchPlaceholders = "Look near, far, wide…\nWhere would you like to check out today?\nLet\'s give this engine a crank…\nAnimal, vegetable, mineral…\nSearch the whole wide world...".split(/\r?\n/);
        var V = function() {
                var a = g.search().map,
                    b = a && a.split ? a.split(",") : [];
                if (b.length < 2) {
                    var c = k.getState();
                    T({
                        latitude: c.view.latitude,
                        longitude: c.view.longitude,
                        zoomLevel: c.view.zoom,
                        mapType: h.getMapTypeByName(c.baseMapType)
                    })
                }
            },
            W = function() {
                var a = "home",
                    b = j.isLoggedIn() ? "logged in" : "not logged in",
                    c = "",
                    d = {
                        prop21: b,
                        eVar21: b
                    };
                "/" !== g.path() && (a = g.path(), a.indexOf("/", 1) > 0 && (a = a.substring(1, a.indexOf("/", 1))), a = a.replace("/", ""), a.match(/directions|discover|search|collections|traffic/) || (a = "pdc")), "directions" === a && (c = a + " panel opened", d.prop40 = "loaded from url", d.eVar40 = "loaded from url"), o.track(a, c, d, null)
            };
        if (R(), U(), s && s.init(), l.init(), n.init(), a.$on("$routeChangeError", function() {
                g.path("/")
            }), a.$on("$routeChangeSuccess", function() {
                N ? V() : (K(), N = !0), "pitch" in v && (e.isMinimized = !0, a.whenMapIsReady.then(t.loadStreetLevel).then(t.enterStreetLevel).then(function() {
                    t.lookAt(parseFloat(v.pitch) - 90, parseFloat(v.yaw), !0), v.report && t.showReportImageForm()
                })), v.id || v.href || G.showAllFavorites()
            }), b.cookieNotice = r.initialize(), B.initialize(), P = "facebook" === O, !P && "preview" !== x.nps.triggeringLogic && !E.lockedBy()) {
            var X = y.getValue(L) ? y.getValue(L) : 0;
            M > X && (m(function() {
                a.$broadcast("popover", {
                    templateUrl: "features/welcome/message.html",
                    single: !0
                })
            }), y.setValue(L, M))
        }
        n.removeSingleUrlParam("lang"), angular.element(f.document).ready(function() {
            C.loadCSS(f.here.lazy.css)
        })
    }]), angular.module("hereApp.directive").directive("hereLogIn", ["User", "Config", "Features", "$route", "TrackingService", "HereAccountService", "CollectionsAlwaysVisibleService", function(a, b, c, d, e, f, g) {
        return {
            replace: !0,
            scope: {},
            templateUrl: "directives/account/log-in.html",
            link: function(c) {
                function h() {
                    var b = a.getUserData(),
                        d = b && b.firstname ? b.firstname : "";
                    c.accountLabel = b && b.lastname ? d + " " + b.lastname : d
                }
                c.trackClick = function(a) {
                    var b = "places" === d.current.$$route.specialPanelClass ? "pdc" : d.current.$$route.specialPanelClass,
                        c = "places" === a,
                        f = c ? "event16" : void 0,
                        g = "menu: " + a + " panel opened",
                        h = {
                            prop32: g,
                            eVar32: g
                        };
                    c && (h.prop45 = h.eVar45 = "menu"), e.track(b, g, h, f)
                }, h(), c.login = {
                    isLoggedIn: a.isLoggedIn(),
                    hereAccountSettingsURL: b.account.frontEndHost
                }, c.logIn = function() {
                    e.track("account", "signin attempt", "", null), f.openSignIn()
                }, c.$on("userLoggedIn", function() {
                    h(), c.login.isLoggedIn = !0, g.showAllFavorites()
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereActionTracker", ["$parse", "TrackingService", function(a, b) {
        return {
            link: function(c, d, e) {
                d.on("click", function() {
                    var d = a(e.hereActionTracker)(c);
                    d.page && d.action && b.track(d.page, d.action, d.customVars)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereAlignHeadline", ["$document", "$window", "$timeout", "panelsService", "Features", "utilityService", function(a, b, c, d, e, f) {
        return {
            scope: {
                place: "=",
                title: "@",
                titleContainer: "@"
            },
            controller: ["$scope", "$element", function(a, b) {
                var c = this,
                    d = function(a, b) {
                        var c = e(a),
                            d = c[0].clientHeight,
                            g = b;
                        for (c.text(g); c[0].clientHeight > d;) g = g.slice(0, -1), c.text(g);
                        return b !== g && (g = g.slice(0, -5), " " === g.slice(0, -1).match(/0-9a-zA-Z/) && (g = g.slice(0, -1)), g += "..."), f(c), g
                    },
                    e = function() {
                        var a = b.clone();
                        return a.css({
                            position: "absolute",
                            visibility: "hidden",
                            width: b[0].clientWidth + "px"
                        }).html("X<br/>X"), b.parent().append(a), a
                    },
                    f = function(a) {
                        a.remove(), a = null
                    };
                c.updateText = function() {
                    if (a.title) {
                        var c = d(b, a.title.trim()),
                            e = a.titleContainer ? angular.element(b[0].querySelector(a.titleContainer)) : b;
                        e.text(c)
                    }
                }
            }],
            link: function(a, c, d, e) {
                var g = f.debounce(e.updateText, 100);
                g(), b.addEventListener("resize", g), a.$watch("title", g), a.$on("$destroy", function() {
                    b.removeEventListener("resize", g)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereAutofocus", ["$window", "$document", "$timeout", "utilityService", function(a, b, c, d) {
        return {
            link: function(e, f, g) {
                function h(c) {
                    var e = c.keyCode >= 48 && c.keyCode <= 90,
                        g = c.altKey || c.ctrlKey || c.metaKey;
                    if (e && !g) {
                        var h = a.document.activeElement,
                            i = ["input", "textarea", "select"],
                            k = i && i.indexOf(h.tagName.toLowerCase()) >= 0;
                        if (h !== f[0] && !k) {
                            var l = !!b[0].querySelector(".modal_container > div"),
                                m = d.hasParentWithClass(f[0], "modal_container");
                            if (l && !m) return;
                            f[0].focus(), f[0].value = f[0].value.trim().length > 0 ? f[0].value.trim() + " " : ""
                        }
                    } else 27 === c.keyCode && (c.preventDefault(), j())
                }

                function i() {
                    a.document.activeElement !== f[0] && c(function() {
                        f[0].select()
                    }, 10)
                }

                function j(a) {
                    a && (a.srcElement || a.target) === f[0] || f[0].blur()
                }
                g.hereAutofocus ? e.$watch(g.hereAutofocus, function(a) {
                    a && c(function() {
                        f[0].focus(), f[0].value && f[0].select()
                    }, 100)
                }) : (f.on("mousedown", i), b.on("click", j), b.on("keydown", h)), e.$on("$destroy", function() {
                    f.off("mousedown", i), b.off("click", j), b.off("keydown", h), j()
                }), e.$on("onBrowserHistoryChange", j)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereAutoselect", ["$timeout", function(a) {
        return function(b, c) {
            c.on("focus", function() {
                a(function() {
                    c[0].setSelectionRange(0, 65535)
                }, 50)
            })
        }
    }]),
    function() {
        angular.module("hereApp.directive").directive("autosuggest", ["$window", function(a) {
            return {
                scope: {
                    items: "=autosuggest",
                    altItems: "=?autosuggestAltItems",
                    onSelect: "&autosuggestOnSelect",
                    onActivate: "&autosuggestOnActivate",
                    onReset: "&autosuggestOnReset",
                    outerSelector: "@autosuggestResetOnOuterClick"
                },
                controller: ["$scope", function(b) {
                    var c = this;
                    b.useAltItems = !1, this.activate = function(a) {
                        b.onActivate && b.onActivate({
                            item: a
                        }), b.active = a
                    }, this.select = function(a) {
                        b.onSelect({
                            item: a
                        }), this.reset()
                    }, this.selectActive = function() {
                        this.select(b.active)
                    }, this.activateNextItem = function() {
                        var a = b.useAltItems ? b.altItems : b.items,
                            d = a.indexOf(b.active);
                        c.activate(a[(d + 1) % a.length])
                    }, this.activatePreviousItem = function() {
                        var a = b.useAltItems ? b.altItems : b.items,
                            d = a.indexOf(b.active);
                        c.activate(a[0 === d ? a.length - 1 : d - 1])
                    }, this.isActive = function(a) {
                        return b.active && (angular.equals(b.active, a) || angular.equals(b.active._autosuggestParent, a))
                    }, this.IsSuggestionListVisible = function() {
                        return b.items && b.items.length
                    }, this.reset = function(a) {
                        b.active = null, c.resetAllButActive(a), a && b.$apply()
                    }, this.resetAllButActive = function(c) {
                        b.useAltItems = null, b.onReset && b.onReset(), c && b.$apply(), a.document.activeElement && a.document.activeElement.dataset && "autosuggestInput" in a.document.activeElement.dataset && a.document.activeElement.blur()
                    }, this.keysListener = function(a) {
                        c.IsSuggestionListVisible() && (40 === a.keyCode ? (a.stopPropagation(), a.preventDefault(), b.$apply(c.activateNextItem)) : 38 === a.keyCode ? (a.stopPropagation(), a.preventDefault(), b.$apply(c.activatePreviousItem)) : 39 === a.keyCode ? !b.useAltItems && b.altItems && b.altItems.length && (a.stopPropagation(), a.preventDefault(), b.$apply(function() {
                            b.useAltItems = !0, c.activate(b.altItems[0])
                        })) : 37 === a.keyCode ? b.useAltItems && (a.stopPropagation(), a.preventDefault(), b.$apply(function() {
                            b.useAltItems = !1, c.activate(b.active._autosuggestParent)
                        })) : 13 === a.keyCode ? b.active && (a.preventDefault(), b.$apply(function() {
                            c.selectActive()
                        })) : 32 === a.keyCode ? (b.active = null, b.$apply()) : 27 === a.keyCode ? c.reset(a) : b.active = null)
                    }, this.itemEnterBinder = function(a) {
                        return function() {
                            b.$apply(function() {
                                b.useAltItems = !!a._autosuggestParent, c.activate(a)
                            })
                        }
                    }, this.itemClickBinder = function(a) {
                        return function() {
                            b.$apply(function() {
                                c.select(a)
                            })
                        }
                    }, this.outerClickBinder = function(a) {
                        return function(d) {
                            b.items && b.items.length && d && d.target && d.target !== a && !a.contains(d.target) && c.reset(d)
                        }
                    }
                }],
                link: function(b, c, d, e) {
                    var f, g = b.outerSelector ? angular.element(a.document.querySelector(b.outerSelector)) : null;
                    g && (f = e.outerClickBinder(c[0]), g.on("mousedown", f), g.on("touchstart", f)), b.$on("$destroy", function() {
                        g && (g.off("mousedown", f), g.off("touchstart", f))
                    })
                }
            }
        }]), angular.module("hereApp.directive").directive("autosuggestInput", ["$window", function(a) {
            return {
                require: "^autosuggest",
                link: function(b, c, d, e) {
                    c.on("keydown", e.keysListener), b.$on("$locationChangeSuccess", function() {
                        a.document.activeElement && a.document.activeElement.dataset && "autosuggestInput" in a.document.activeElement.dataset || e.reset()
                    }), b.$on("$routeChangeSuccess", function() {
                        e.reset()
                    }), b.$on("$destroy", function() {
                        c.off("keydown", e.keysListener)
                    })
                }
            }
        }]), angular.module("hereApp.directive").directive("autosuggestItem", function() {
            return {
                require: "^autosuggest",
                link: function(a, b, c, d) {
                    var e = a.$eval(c.autosuggestItem),
                        f = d.itemClickBinder(e),
                        g = d.itemEnterBinder(e);
                    a.$watch(function() {
                        return d.isActive(e)
                    }, function(a) {
                        a ? b.addClass("hovered") : b.removeClass("hovered")
                    }), b.on("mouseenter", g), b.on("click", f), a.$on("$destroy", function() {
                        b.off("mouseenter", g), b.off("click", f)
                    })
                }
            }
        })
    }(), angular.module("hereApp.directive").directive("hereCategoryIcon", ["$templateCache", "categories", function(a, b) {
        return {
            scope: {
                category: "@",
                color: "@",
                height: "@",
                width: "@",
                viewBox: "@"
            },
            link: function(a, c) {
                function d(c, d) {
                    return c ? b.getSVG(c, a.width, a.height, a.viewBox).replace(/#FFFFFF/g, d || "#FFFFFF").replace(/#fff/g, d || "#fff") : ""
                }
                a.$watch("category", function() {
                    if (a.category) {
                        var b = d(a.category, a.color);
                        b && (a.hereCategoryIcon = angular.element(b), c.children(0).remove(), c.append(a.hereCategoryIcon))
                    }
                }, !0)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereClearInput", ["Features", "$window", function(a) {
        if (!a.search.clear) return function() {};
        var b = '<button type="button" data-ng-show="displayButton" class="clean_search" data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'#273142\', hoverColor:\'#00c9ff\'}" data-here-click-tracker="search:clear:click"></button>';
        return {
            require: "ngModel",
            compile: function(a) {
                var c = angular.element(b);
                return a.after(c),
                    function(a, b, c, d) {
                        b.next().on("click touchstart", function(c) {
                            c.stopPropagation(), c.preventDefault(), a.$evalAsync(function() {
                                d.$setViewValue(""), d.$render(), b[0].focus()
                            })
                        }), a.$watch(c.ngModel, function(b) {
                            a.displayButton = !!b
                        })
                    }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereClickTracker", ["TrackingService", function(a) {
        return {
            link: function(b, c, d) {
                c.on("click", function() {
                    a.click(d.hereClickTracker)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereDescriptionWidget", ["User", "CollectionsService", "TrackingService", function(a, b, c) {
        return {
            templateUrl: "directives/collections/description-widget.html",
            scope: {
                place: "=",
                collection: "=hereDescriptionWidget",
                isOpen: "="
            },
            link: function(a, d, e) {
                var f = angular.noop,
                    g = e.place ? "updateFavorite" : "updateCollection";
                if (a.refObj = {}, a.updateObj = {}, a.state = {
                        ready: !1
                    }, a.$watch("isOpen", function(b) {
                        b && (a.state.editDescription = !0, a.hasNoDescription = !0)
                    }), e.place) a.placeholder = "Add a description for this place. (No one will see it but you.)", a.$watch("place", function(c) {
                    c && b.getFavoriteRef(c).then(function(c) {
                        c && (a.refObj = c, a.state.ready = !0), a.favorites = b.readonlyFavorites, f = a.$watch("favorites.length", function() {
                            a.place && b.getFavoriteRef(a.place).then(function(b) {
                                b ? (a.refObj = b, a.state.ready = !0) : a.state.ready = !1
                            })
                        })
                    })
                });
                else {
                    a.placeholder = "Add a description for this collection. (No one will see it but you.)";
                    var h = a.$watch("collection", function(b) {
                        b && (a.refObj = b, a.state.ready = !0, h())
                    })
                }
                a.showEditor = function() {
                    var b;
                    b = e.place ? "collections:AddDescriptionToPlace:click" : "collections:AddDescriptionToCollection:click", c.click(b), a.refObj.description ? (a.updateObj.description = angular.copy(a.refObj.description), a.hasNoDescription = !1) : a.hasNoDescription = !0, a.state.errorDescription = !1, a.state.editDescription = !0
                }, a.hideEditor = function() {
                    a.updateObj.description = null, a.state.errorDescription = !0, a.state.editDescription = !1
                }, a.addDescription = function() {
                    var d = angular.copy(a.refObj);
                    d.description = a.updateObj.description, a.state.submitted = !0, b[g](d).then(function(b) {
                        var d = e.place ? "place description in collection changed" : "collection description changed";
                        c.track("collections", d, "", null), a.refObj = b, a.hideEditor()
                    }, function() {
                        a.state.errorDescription = !0
                    })["finally"](function() {
                        a.state.submitted = !1
                    })
                }, a.$on("$destroy", function() {
                    f()
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereSavePlace", ["$rootScope", "User", "CollectionsService", "RedirectService", "TrackingService", function(a, b, c, d, e) {
        return {
            template: '<div data-ng-show="checkFavorite" data-ng-class="{ favorited: isFavorite }" class="favorite_place_controls"><button data-ng-click="saveFavorite(place)" class="btn btn_small btn_icon btn_save left" data-here-svg="{path:\'/img/collections/save.svg\', color:\'#353535\'}">Collect</button><button data-ng-click="saveFavorite(place)" class="btn btn_small btn_icon btn_manage left" data-here-svg="{path:\'/img/collections/manage.svg\', color:\'#fffb00\'}">Manage</button></div>',
            replace: !0,
            link: function(a) {
                a.isFavorite = !1, a.checkFavorite = !1, a.favoriteRef = null, a.saveFavorite = function(b) {
                    var c = a.isFavorite ? "collections:ManageCollection:click" : "place collect attempt";
                    a.isFavorite ? e.click(c) : e.track("collections", c, "", null), d.goToCollectionsByPlace(b)
                };
                var f = angular.noop,
                    g = function() {
                        c.getFavoriteRef(a.place).then(function(b) {
                            null !== b && (a.isFavorite = !0, a.favoriteRef = b), a.favorites = c.readonlyFavorites, f = a.$watchCollection("favorites", function() {
                                c.getFavoriteRef(a.place).then(function(b) {
                                    null === b ? (a.isFavorite = !1, a.favoriteRef = null) : (a.isFavorite = !0, a.favoriteRef = b)
                                })
                            }), a.checkFavorite = !0
                        })
                    };
                a.$watch("place", function(c) {
                    c && (b.isLoggedIn() ? g() : a.checkFavorite = !0)
                });
                var h = a.$on("userLoggedIn", function() {
                    g(), h()
                });
                a.$on("userLoggedOut", function() {
                    a.isFavorite = !1, a.favoriteRef = null
                }), a.$on("$destroy", function() {
                    f()
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereSavePlaceInline", ["$rootScope", "User", "CollectionsService", "RedirectService", "TrackingService", function(a, b, c, d, e) {
        return {
            template: '<span><button data-ng-if="isFavorite" class="save_place favorite_place_controls" data-ng-class="{ favorited: isFavorite }" data-ng-click="saveFavorite(place)" data-here-svg="{ path: \'/img/collections/save_filled.svg\', color:\'#fffb00\', hoverColor:\'#fffb00\' }">Manage</button><button data-ng-if="!isFavorite" class="save_place favorite_place_controls" data-ng-class="{ favorited: isFavorite }" data-ng-click="saveFavorite(place)" data-here-svg="{ path: \'/img/collections/save.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\' }">Collect</button></span>',
            replace: !0,
            link: function(a) {
                a.isFavorite = !1, a.checkFavorite = !1, a.favoriteRef = null, a.saveFavorite = function(b) {
                    var c = a.isFavorite ? "collections:ManageCollection:click" : "place collect attempt";
                    a.isFavorite ? e.click(c) : e.track("collections", c, "", null), d.goToCollectionsByPlace(b)
                };
                var f = angular.noop,
                    g = function() {
                        c.getFavoriteRef(a.place).then(function(b) {
                            null !== b && (a.isFavorite = !0, a.favoriteRef = b), a.favorites = c.readonlyFavorites, f = a.$watchCollection("favorites", function() {
                                c.getFavoriteRef(a.place).then(function(b) {
                                    null === b ? (a.isFavorite = !1, a.favoriteRef = null) : (a.isFavorite = !0, a.favoriteRef = b)
                                })
                            }), a.checkFavorite = !0
                        })
                    };
                a.$watch("place", function(c) {
                    c && (b.isLoggedIn() ? g() : a.checkFavorite = !0)
                });
                var h = a.$on("userLoggedIn", function() {
                    g(), h()
                });
                a.$on("userLoggedOut", function() {
                    a.isFavorite = !1, a.favoriteRef = null
                }), a.$on("$destroy", function() {
                    f()
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereCollectionRouteCard", ["collectionsHelper", "directionsUrlHelper", function(a, b) {
        return {
            templateUrl: "directives/collectionsRouteCard/collections-route-card.html",
            replace: !0,
            scope: {
                favorite: "=hereCollectionRouteCard"
            },
            link: function(c) {
                var d = c.favorite.mode && c.favorite.mode.transportModes ? c.favorite.mode.transportModes : "car",
                    e = [],
                    f = {
                        car: "/features/directions/img/modes/car.svg",
                        pedestrian: "/features/directions/img/modes/pedestrian.svg",
                        publicTransportTimeTable: "/features/directions/img/modes/pt.svg"
                    },
                    g = function() {
                        c.transportModeIcon = f[d];
                        var b = a.parseScbeWaypoints(c.favorite.waypoints);
                        c.waypoints = b.waypoints, e = b.itineraryItems, h()
                    },
                    h = function() {
                        c.directionsUrl = b.createUrlForItems(e, d)
                    };
                g()
            }
        }
    }]), angular.module("hereApp.directive").directive("hereDateSpanSelector", ["User", function(a) {
        return {
            replace: !0,
            restrict: "A",
            templateUrl: "directives/dateSpanSelector/dateSpanSelector.html",
            scope: {
                onChanged: "&dateSpanSelectorOnChanged",
                settings: "=hereDateSpanSelector"
            },
            link: function(b) {
                var c, d, e = function(b, c) {
                    var d = {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        },
                        e = a.locale.tag,
                        f = b.toLocaleDateString(e, d) + " - " + c.toLocaleDateString(e, d);
                    return f
                };
                b.isExpanded = !1, b.startDate = new Date, b.endDate = new Date, b.header = "Time and date", b.toggleTab = function() {
                    b.isExpanded = !b.isExpanded, b.isExpanded && (c = b.startDate, d = b.endDate)
                }, b.save = function() {
                    b.settings = {
                        startDate: b.startDate,
                        endDate: b.endDate
                    }, b.onChanged({
                        settings: b.settings
                    }), b.isExpanded = !1
                }, b.cancel = function() {
                    b.startDate = c, b.endDate = d, b.isExpanded = !1
                }, b.timeFormat = "en-us" === a.locale.tag ? "h:mm a" : "HH:mm", b.dateFormat = "en-us" === a.locale.tag ? "M/dd/yyyy" : "dd/MM/yyyy", b.$watch("settings", function() {
                    b.startDate = b.settings && b.settings.startDate || new Date, b.endDate = b.settings && b.settings.endDate || new Date, b.header = e(b.startDate, b.endDate)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereExposeServices", ["$injector", function(a) {
        return {
            priority: 1,
            link: function(b, c, d) {
                d.hereExposeServices.split(",").map(function(c) {
                    b[c] = a.get(c)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereFacebookHref", ["FacebookService", "User", function(a, b) {
        return {
            scope: {
                url: "=hereFacebookHref"
            },
            link: function(c, d) {
                c.$watch("url", function() {
                    d.attr("href", c.url + "?fb_locale=" + b.locale.tag), a.parseElement(d.parent()[0])
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereFacebookLikeSrc", ["Config", "User", "FacebookService", function(a, b, c) {
        return {
            scope: {
                url: "=hereFacebookLikeSrc"
            },
            link: function(d, e) {
                var f = "//www.facebook.com/plugins/like.php?&layout=button&action=like&height=20&locale=" + b.locale.tagUnderscore + "&appId=" + a.facebook.appId;
                d.$watch("url", function() {
                    e.attr("src", f + "&href=" + d.url), c.parseElement(e.parent()[0])
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("filterTimeValue", ["$parse", "$document", "userInputTimeFilter", function(a, b, c) {
        return {
            restrict: "A",
            link: function(d, e, f) {
                function g() {
                    e[0].value = c(e[0].value)
                }
                g();
                var h = a(f.ngModel).assign;
                h && h(d, e[0].value), d.$watch(f.ngModel, function() {
                    e[0] !== b[0].activeElement && g()
                }), e.on("blur", g)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereFixAndroidSelect", function() {
        return function(a, b) {
            function c() {
                b[0].blur()
            }
            b.on("touchstart", function() {
                b.on("change", c)
            })
        }
    }), angular.module("hereApp.directive").directive("headerImage", ["PreloadImage", "ensureHTTPSFilter", "Features", function(a, b) {
        var c, d = "fadein",
            e = "image_loaded";
        return {
            scope: {
                imgURL: "=headerImage",
                usePreviousImage: "=",
                headerAttribution: "=",
                headerOrigin: "="
            },
            template: '<div class="image"></div><img class="img_microdata" data-ng-if="imgURL" data-ng-src="{{imgURL | ensureHTTPS}}" style="display:none;" itemprop="image"/><cite class="attribution" data-track-anchor-clicks="{{headerOrigin + \':HeaderAttribution:click\'}}" data-ng-bind-html="headerAttribution | linksInNewTab"></cite>',
            link: function(f, g) {
                var h, i = g.find("div");
                f.$watch("imgURL", function(j) {
                    var k = !!f.usePreviousImage;
                    k && c ? (g.css("background-image", "url(" + c + ")"), g.addClass(e)) : (g.css("background-image", ""), g.removeClass(e)), g.removeClass(d), h && h.abort(), j && (j = b(j), h = a.single(j), h.then(function(a) {
                        i.css("background-image", "url(" + a + ")"), g.addClass(d), g.addClass(e), k && c !== a && (c = a)
                    }))
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereHeader", ["$rootScope", "discoverHeaderHelper", "ensureHTTPSFilter", "unitsStorage", function(a, b, c, d) {
        var e, f, g, h = function(a) {
            var b = function(b) {
                    var c = '<a href="' + a.websiteUrl + '">{{content}}</a>',
                        d = a.websiteUrl ? c.replace("{{content}}", b) : b;
                    return d
                },
                c = a.ownerName ? "Provided by {{user}}".replace("{{user}}", a.ownerName) : "",
                d = "FlickrPhoto" === a.type ? "Flickr" : a.type,
                e = b(d),
                f = d ? "via {{supplier}}".replace("{{supplier}}", e) : "";
            return c + " " + f
        };
        return {
            scope: {
                category: "=?hereHeaderCategory",
                image: "=?hereHeaderImage",
                options: "=hereHeader",
                temperatureUnit: "=",
                title: "=?hereHeaderTitle"
            },
            controller: ["$scope", "$element", "$attrs", function(i, j, k) {
                var l = this;
                l._initialize = function() {
                    (i.options.weather || i.options.currentLocation) && (a.whenMapIsReady.then(l.onMapReady), i.toggleWeatherUnits = l._toggleWeatherUnits), i.options.currentLocation || (l._setImage(i.image), l._setCategory(i.category), i.$watch("image", l._setImage), i.$watch("category", l._setCategory)), i.hasContextMenu = i.options.hasContextMenu, i.$on("$destroy", l.onDestroy)
                }, l._showLocationInfo = function(a, b, c) {
                    if (!a || !b || !a.center || a.center.lat !== b.lat || a.center.lng !== b.lng) return void(i.headerImageUrl = i.headerAttribution = null);
                    if (i.options.currentLocation && !k.hereHeaderTitle) {
                        var d = a && a.locationLabel || [];
                        d = angular.copy(d), i.title = d.length > 0 ? d.splice(0, 2).join(", ") : " "
                    }
                    if (i.options.currentLocation && i.options.photo !== !1)
                        if (a && a.photoInfo && a.photoInfo.photoUrl) {
                            var e = a.photoInfo.photoUrl.replace(/w1280/, "w844");
                            i.headerImageUrl = e, i.headerAttribution = h(a.photoInfo)
                        } else c && (i.headerImageUrl = i.headerAttribution = null);
                    i.options.weather && (i.weather = a && a.weather || null)
                }, l._getLocation = function() {
                    g = e ? e.getCenter() : null, f = b.getHeaderInfo(e, i.options).then(function(a) {
                        l._showLocationInfo(a, g, !0)
                    }, function() {}, function(a) {
                        l._showLocationInfo(a, g, !1)
                    })["finally"](function() {
                        f = null
                    })
                }, l._toggleWeatherUnits = function() {
                    var b = ["fahrenheit", "celsius"],
                        c = a.temperatureUnit === b[0] ? b[1] : b[0];
                    d.saveTemperatureUnit(c)
                }, l._setImage = function(a) {
                    var b = a && a.srcRequested;
                    i.headerImageUrl = b ? c(a.srcRequested) : null, i.headerAttribution = b ? a.attribution : null
                }, l._setCategory = function(a) {
                    i.category = a
                }, l.onMapReady = function(a) {
                    e = a, e.addEventListener("mapviewchangeend", l._getLocation), l._getLocation()
                }, l.onDestroy = function() {
                    e && e.removeEventListener("mapviewchangeend", l._getLocation), f && f.abort && f.abort()
                }
            }],
            templateUrl: "directives/hereHeader/hereHeader.html",
            transclude: !0,
            replace: !0,
            link: function(a, b, c, d) {
                d._initialize()
            }
        }
    }]), angular.module("hereApp.directive").directive("hereImageAttribution", ["htmlToPlaintextFilter", "$route", function(a, b) {
        function c(b, c) {
            if (!b) return "";
            if (c && "here" === b.supplier.id) return a(b.attribution);
            if (c) return b.attribution.replace("<a ", '<a target="_blank" ');
            if ("here" !== b.supplier.id) {
                if (b.user && b.user.name && b.user.href) return "by {{user}}".replace("{{user}}", '<a href="' + b.user.href + '" target="_blank">' + b.user.name + "</a>");
                var d = b.via && b.via.href ? '<a href="' + b.via.href + '" target="_blank" >' + b.supplier.title + "</a>" : b.supplier.title;
                return "via {{supplier}}".replace("{{supplier}}", d)
            }
            return b.user && b.user.name && b.user.href ? "by {{user}}".replace("{{user}}", b.user.name) : "via {{supplier}}".replace("{{supplier}}", b.supplier.title)
        }
        return {
            transclude: !0,
            scope: {
                image: "=hereImage"
            },
            templateUrl: "directives/imageAttribution/short.html",
            link: function(a, d, e) {
                var f = "full" === e.hereImageAttribution,
                    g = function() {
                        a.content = c(a.image, f)
                    };
                d.addClass("here_image_attribution_container"), g(), a.$watch("image", function(a, b) {
                    b !== a && g()
                }), a.origin = b.current.$$route.specialPanelClass, a.onClick = function(a) {
                    a.stopPropagation()
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("infoIcon", ["$window", function(a) {
        function b(b) {
            var c = b[0].querySelector(".info_icon").offsetLeft,
                d = b[0].querySelector(".info_message_container"),
                e = a.getComputedStyle(d);
            return c - parseInt(e.paddingLeft, 10)
        }

        function c(a) {
            var c = b(a);
            angular.element(a[0].querySelector(".knife")).css({
                "-webkit-transform": "translateX(" + c + "px)",
                transform: "translateX(" + c + "px)"
            })
        }
        return {
            replace: !0,
            transclude: !0,
            scope: {},
            templateUrl: "directives/infoIcon/infoIcon.html",
            link: function(a, b) {
                var d = angular.element(b[0].querySelector(".info_icon")),
                    e = angular.element(b[0].querySelector(".info_message_container"));
                a.infoIcon = {
                    showMessage: !1
                }, d.bind("click", function() {
                    c(b), a.infoIcon.showMessage = !a.infoIcon.showMessage
                }), e.bind("click", function() {
                    a.infoIcon.showMessage = !a.infoIcon.showMessage
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereIosFixed", ["$window", "hereBrowser", function(a, b) {
        return {
            link: function(c, d) {
                if (b.isiOS) {
                    var e = function() {
                        a.scrollTo(0)
                    };
                    d.on("focusout", e), c.$on("$destroy", function() {
                        d.off("focusout", e)
                    })
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereIosTouchToClick", ["$window", "hereBrowser", function(a, b) {
        return {
            link: function(c, d) {
                if (b.isiOS) {
                    var e = !1,
                        f = function() {
                            e = !1
                        },
                        g = function() {
                            e = !0
                        },
                        h = function(b) {
                            if (!e && b.target) {
                                b.stopPropagation(), b.preventDefault(), a.document.activeElement.blur();
                                var c = a.document.createEvent("Event");
                                c.initEvent("click", !0, !0), b.target.dispatchEvent(c)
                            }
                        };
                    d.on("touchstart", f), d.on("touchmove", g), d.on("touchend", h), c.$on("$destroy", function() {
                        d.off("touchstart", f), d.off("touchmove", g), d.off("touchend", h)
                    })
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereKeyNavigation", ["$window", "panelsService", function(a, b) {
        return {
            link: function(c, d, e) {
                c.selector = e.hereKeyNavigation, c.keyboardMgmt = function(a) {
                    b.isMinimized || c.panelArrows(a)
                }, c.panelArrows = function(a) {
                    if (!(a.keyCode < 37 || a.keyCode > 40)) {
                        var b = d[0].querySelector(c.selector);
                        b && c.focusOnElement(b)
                    }
                }, c.focusOnElement = function(b) {
                    b.getAttribute("tabindex") || b.setAttribute("tabindex", "0"), b !== a.document.activeElement && b.focus()
                }, d.on("keydown", c.keyboardMgmt), c.$on("$destroy", function() {
                    d.off("keydown", c.keyboardMgmt)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMap", ["$window", "$document", "$route", "mapsjs", "mapUtils", "panelsService", "mapContainers", "$compile", "mapLocationAddress", "streetLevel", "mapMetaInfoLayerListeners", "Features", "mapCameraSync", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        function n(a) {
            var b = 1;
            return a > 4096 ? b = 5 : a > 2048 ? b = 4 : a > 1024 ? b = 3 : a > 512 && (b = 2), b
        }

        function o(a) {
            var b = n(a.getViewPort().width);
            e.setMinZoom(b), a.getZoom() > 0 && a.getZoom() < b && a.setZoom(b, !0)
        }

        function p(b, c) {
            var g = c.type,
                h = d.mapUtils.makePoint(c);
            r = new d.Map(b, g, {
                center: h,
                zoom: c.zoomLevel || 10,
                fixedCenter: !1,
                imprint: {
                    font: "10px Arial, sans-serif",
                    invert: !1,
                    href: "//legal.here.com/terms/serviceterms"
                },
                pixelRatio: a.devicePixelRatio || 1,
                renderBaseBackground: {
                    lower: 3,
                    higher: 2
                },
                margin: 0
            }), e.syncLabels(r);
            var i = f.isMinimized ? f.leftPaddingOffset : f.width;
            return r.getViewPort().setPadding(20, 20, 20, i), r.setCenter(h), l.map && l.map.metainfoTiles && k.initialize(r), l.map && l.map.syncMapToUrl && m.initialize(r), r
        }

        function q(b) {
            var c = o.bind(null, b);
            b.getViewPort().addEventListener("update", c),
                b.addEventListener("baselayerchange", c), e.mapEvents = new d.mapevents.MapEvents(b), new d.mapevents.Behavior(e.mapEvents), a.addEventListener("resize", function() {
                    b.getViewPort().resize()
                })
        }
        var r;
        return {
            scope: {
                defaultLatitude: "=hereDefaultLatitude",
                defaultLongitude: "=hereDefaultLongitude",
                defaultZoomLevel: "=hereDefaultZoomLevel",
                defaultType: "=hereDefaultType",
                setMap: "&setMap"
            },
            replace: !0,
            transclude: !0,
            template: '<div class="map"><div class="map-jsla"></div><div class="map_controls" ng-transclude></div><div class="portal" data-ng-include="\'/features/reportImage/portal.svg\'"></div></div>',
            controller: ["$scope", function(a) {
                this.getMap = function() {
                    return a.getMap()
                }
            }],
            link: function(a, b) {
                var c;
                a.initialize = function() {
                    var d = b.children()[0],
                        f = n(d.offsetWidth),
                        h = Math.max(a.defaultZoomLevel, f);
                    e.setMinZoom(f), c = p(d, {
                        latitude: a.defaultLatitude,
                        longitude: a.defaultLongitude,
                        zoomLevel: h,
                        type: a.defaultType
                    }), q(c), e.enableTilePreloading(c, h), c.addEventListener("mapviewchangeend", function j() {
                        c.removeEventListener("mapviewchangeend", j), a.displayReady = !0, a.setMap({
                            map: c
                        }), c.addObjects(g.list), i.initialise(c)
                    })
                }, a.getMap = function() {
                    return c
                }, a.triggerStreetLevel = function() {
                    j.enterStreetLevel()
                }, a.getMinZoomLevelByWidth = n, a.updateMapMinZoomLevel = o, a.createMap = p;
                var d = a.$watch("defaultType", function(b) {
                    b && (d(), a.initialize())
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereFeedback", ["$rootScope", "$timeout", "Features", "mapsjs", "TrackingService", "UserVoice", function(a, b, c, d, e, f) {
        return {
            require: "^hereMap",
            replace: !0,
            templateUrl: "directives/mapControls/feedbackButton.html",
            link: function(b) {
                b.dark = !1, b.showFeedbackForm = function() {
                    e.track("map", "feedback link clicked"), a.$broadcast("popover", {
                        templateUrl: "features/feedback/feedbackForm.html",
                        single: !0
                    }), f.initialize()
                }
            }
        }
    }]), angular.module("hereApp.mapControls").directive("hereMapControlLocation", ["$rootScope", "$timeout", "$document", "Config", "Features", "geolocation", "markerIcons", "mapsjs", "User", "TrackingService", "mapControlLocationService", "mapContainers", "streetLevel", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        return {
            require: "^hereMap",
            templateUrl: "directives/mapControls/location-control.html",
            replace: !0,
            link: function(a, d, n, o) {
                var p, q, r, s = g.geolocation(),
                    t = h.map,
                    u = "rgba(61, 137, 12, 0.3)",
                    v = {
                        style: {
                            strokeColor: u,
                            fillColor: u,
                            lineWidth: 0
                        }
                    },
                    w = {
                        messageClass: "success_message",
                        classToRemove: "error_message",
                        groupingClass: "success",
                        copyClass: "success_message_copy"
                    },
                    x = {
                        messageClass: "error_message",
                        classToRemove: "success_message",
                        groupingClass: "error",
                        copyClass: "error_message_copy"
                    },
                    y = l.geolocation,
                    z = !1;
                a.mapControlLocationService = k, a.$watch("mapControlLocationService.isLocationMessageVisible", function(b) {
                    if (!b) {
                        var c = d.hasClass("error") ? x : w;
                        d.hasClass("success") && d.addClass("active"), a.removeMessage(c)
                    }
                }), a.locationErrorMessages = {
                    locationSharingNotAllowed: "Please allow your location to be shared.",
                    couldNotNotFind: "Couldn\'t find your location.",
                    clickHere: "Centre on your location"
                }, a.showMessage = function(a) {
                    var c = d[0].querySelector(".floating_message");
                    c.classList.add(a.messageClass), c.classList.remove(a.classToRemove), d.removeClass("active progress"), d.addClass(a.groupingClass), k.isLocationMessageVisible = !0, b(function() {
                        var b, e = c.cloneNode(!0),
                            f = e.querySelector("div");
                        f.className = a.copyClass, d[0].appendChild(f), b = f.offsetWidth, f.parentNode.removeChild(f), c.style.width = b + "px", c.style.left = -1 * b + "px"
                    })
                }, a.getZoomLevelForAccuracy = function(a) {
                    return Math.min(17, Math.floor(Math.log(7827156.25 / a) / Math.LN2))
                }, a.removeClassOnTransitionEnd = function(a) {
                    var b = angular.element(c[0].querySelector(".map_control_location"));
                    b.on("transitionend", function d() {
                        b.removeClass(a.groupingClass), b.off("transitionend", d)
                    })
                }, a.removeMessage = function(b) {
                    var c = d[0].querySelector("." + b.messageClass);
                    c && (m.isStreetLevelActive() ? (d.removeClass(b.groupingClass), d.removeClass(b.messageClass)) : a.removeClassOnTransitionEnd(b), c.style.width = 0, c.style.left = 0, k.isLocationMessageVisible = !1)
                }, a.onPosition = function(c) {
                    var e = c.coords,
                        f = e.accuracy,
                        g = a.getZoomLevelForAccuracy(f),
                        j = {
                            animate: !0,
                            zoom: g,
                            position: h.mapUtils.makePoint(e)
                        },
                        k = o.getMap();
                    i.setGeoLocation({
                        latitude: e.latitude,
                        longitude: e.longitude,
                        accuracy: f
                    }), d.removeClass("progress"), a.halo && y.getObjects().indexOf(a.halo) >= 0 && y.removeObject(a.halo), a.marker && y.getObjects().indexOf(a.marker) >= 0 && y.removeObject(a.marker), a.halo = new t.Circle(j.position, f, v), a.marker = new t.Marker(j.position, {
                        icon: s.normal.icon
                    }), y.addObject(a.marker), y.addObject(a.halo), (!c.doNotCenterOnLocation || z) && k.getViewModel().setCameraData(j), z = !1, a.removeMessage(x), d.addClass("active"), b(function() {
                        a.halo && y.getObjects().indexOf(a.halo) >= 0 && y.removeObject(a.halo)
                    }, 2e3), "rootController" === c.origin && (a.message = a.locationErrorMessages.clickHere, a.showMessage(w), b.cancel(r), b.cancel(q), q = b(function() {
                        a.removeMessage(w), d.addClass("active")
                    }, 1e4))
                }, a.onFailure = function(c) {
                    return "rootController" === c.origin && 3 === c.code ? (d.removeClass("progress"), void b.cancel(r)) : (a.message = 1 === c.code ? a.locationErrorMessages.locationSharingNotAllowed : 2 === c.code ? a.locationErrorMessages.couldNotNotFind : a.locationErrorMessages.couldNotNotFind, a.showMessage(x), b.cancel(r), b.cancel(p), void(p = b(function() {
                        a.removeMessage(x)
                    }, 1e4)))
                }, d.on("click", function() {
                    return j.track("position", "My position clicked", "", null), d.hasClass("error") ? void a.removeMessage(x) : (d.hasClass("success") && a.removeMessage(w), d.addClass("progress"), z = !0, f.position({
                        origin: "mapControls",
                        doNotCenterOnLocation: !1
                    }).then(a.onPosition, a.onFailure), b.cancel(r), b.cancel(p), b.cancel(q), r = b(function() {
                        d.hasClass("progress") && a.onFailure({
                            code: 3
                        })
                    }, 1e4), void d[0].blur())
                }), f.watchForGeoLocation().then(a.onPosition, a.onFailure), e.locationAtStartup && (d.addClass("progress"), r = b(function() {
                    d.hasClass("progress") && a.onFailure({
                        code: 3,
                        origin: "rootController"
                    })
                }, 1e4), d[0].blur())
            }
        }
    }]), angular.module("hereApp.mapControls").directive("hereMapModeSwitcher", ["$rootScope", "$window", "$document", "$timeout", "mapsjs", "lazy", "streetLevel", "mapControlLocationService", function(a, b, c, d, e, f, g, h) {
        return {
            require: "^hereMap",
            templateUrl: "directives/mapControls/map-mode-switcher.html",
            replace: !0,
            link: function(d, i) {
                var j, k, l = i[0].querySelector(".map_control_type"),
                    m = c.find("body");
                d.getAlternateMapType = function() {
                    return e.mapUtils.isSatelliteLayer(j.getBaseLayer()) ? e.mapUtils.NORMAL : e.mapUtils.SATELLITE
                }, d.updateMapsTilesViewPortMargin = function() {
                    j.getViewPort().setMargin(256), k.getViewPort().setMargin(256), j.removeEventListener("mapviewchange", d.updateMapsTilesViewPortMargin)
                }, d.getMapModeName = function() {
                    var a, b = d.isSatellite,
                        c = d.isTraffic,
                        e = d.isPt,
                        f = d.isTerrain,
                        g = d.isPedestrian,
                        h = d.isGrey;
                    return a = !b || c || e ? b && c ? "SATELLITE_TRAFFIC" : b && e ? "SATELLITE_PUBLIC_TRANSPORT" : c ? "TRAFFIC" : e ? "PUBLIC_TRANSPORT" : f ? "TERRAIN" : g ? "PEDESTRIAN" : h ? "GREY" : "NORMAL" : "SATELLITE"
                }, d.updateMapsBaseLayers = function() {
                    var a = d.getMapModeName();
                    j.setBaseLayer(e.mapUtils[a], "default"), e.mapUtils.syncLabels(j), 0 === a.lastIndexOf("SATELLITE", 0) ? (m.addClass("satellite"), k.setBaseLayer(e.mapUtils.NORMAL)) : (m.removeClass("satellite"), k.setBaseLayer(e.mapUtils.SATELLITE))
                }, d.switchMapType = function(a, b) {
                    if (b !== a) switch (d.isPt = !1, d.isTraffic = !1, d.isTerrain = !1, d.isPedestrian = !1, d.isGrey = !1, a) {
                        case "TRAFFIC":
                            d.isTraffic = !0;
                            break;
                        case "PUBLIC_TRANSPORT":
                            d.isPt = !0;
                            break;
                        case "PEDESTRIAN":
                            d.isPedestrian = !0;
                            break;
                        case "TERRAIN":
                            d.isTerrain = !0;
                            break;
                        case "GREY":
                            d.isGrey = !0
                    }
                }, d.documentClickHandler = function(a) {
                    var b = ["map_control_type", "map_border", "map_content", "map_label", "map_type", "map_layer_label"].filter(function(b) {
                        return a.target.classList.contains(b)
                    });
                    d.isMapSwitcherVisible = b.length > 0
                }, d.lazyLoadBackgroundImage = function() {
                    f.loadCSS(b.here.lazy.mapSwitcherBcg)
                }, d.toggleDocumentClickHandler = function() {
                    d.isMapSwitcherVisible ? (d.lazyLoadBackgroundImage(), h.isLocationMessageVisible = !1, c.on("click touchstart", d.documentClickHandler)) : c.off("click touchstart", d.documentClickHandler)
                }, d.getSmallMapCenter = function(a, b) {
                    return a.screenToGeo(b.offsetLeft + b.offsetWidth / 2, b.offsetTop + b.offsetHeight / 2)
                }, d.createSmallMap = function() {
                    return new e.Map(l.querySelector(".map_content"), d.getAlternateMapType(), {
                        zoom: j.getZoom(),
                        center: d.getSmallMapCenter(j, l),
                        pixelRatio: b.devicePixelRatio || 1,
                        renderBaseBackground: {
                            lower: 3,
                            higher: 2
                        },
                        imprint: null,
                        margin: 0
                    })
                }, d.updateSmallMapCenterAndZoom = function() {
                    g.isStreetLevelActive() || (k.setCenter(d.getSmallMapCenter(j, l)), k.setZoom(j.getZoom()))
                }, d.initializeMapModeSwitcher = function() {
                    var b = j.getBaseLayer();
                    d.isSatellite = b === e.mapUtils.SATELLITE, d.isPt = b === e.mapUtils.PUBLIC_TRANSPORT, d.isTraffic = b === e.mapUtils.TRAFFIC, d.isTerrain = b === e.mapUtils.TERRAIN, d.isPedestrian = b === e.mapUtils.PEDESTRIAN, d.isGrey = b === e.mapUtils.GREY, b === e.mapUtils.SATELLITE_TRAFFIC && (d.isSatellite = !0, d.isTraffic = !0), b === e.mapUtils.SATELLITE_PUBLIC_TRANSPORT && (d.isSatellite = !0, d.isPt = !0), d.$watchCollection("[isSatellite, isPt, isTraffic, isTerrain, isPedestrian, isGrey]", d.updateMapsBaseLayers), d.$watch("isMapSwitcherVisible", d.toggleDocumentClickHandler), a.$watch("desiredMapType", d.switchMapType, !0), k = d.createSmallMap(), j.addEventListener("mapviewchange", d.updateMapsTilesViewPortMargin), j.addEventListener("mapviewchange", d.updateSmallMapCenterAndZoom)
                }, a.whenMapIsReady.then(function(a) {
                    j = a, d.initializeMapModeSwitcher()
                })
            }
        }
    }]), angular.module("hereApp.mapControls").directive("hereMapScale", ["$rootScope", "Features", "streetLevel", function(a, b, c) {
        return {
            templateUrl: "directives/mapControls/map-scale.html",
            replace: !0,
            link: function(d) {
                var e, f = 120;
                d.UNITS = {
                    FOOT: {
                        factor: .3048006,
                        name: "ft"
                    },
                    YARD: {
                        factor: 1.0936133,
                        name: "yd"
                    },
                    METER: {
                        factor: 1,
                        name: "m"
                    },
                    KILOMETER: {
                        factor: 1e3,
                        name: "km"
                    },
                    MILE: {
                        factor: 1609.344,
                        name: "mi"
                    }
                }, d.currentZoomLevel = -1, d.ruler = {
                    width: 0,
                    distance: 0,
                    unit: ""
                }, d.ifZoomHasChanged = function() {
                    var a = e.getZoom();
                    return a !== d.currentZoomLevel ? (d.currentZoomLevel = a, !0) : !1
                }, d.getMetersPerPixel = function() {
                    var a = Math.round(.5 * e.getViewPort().width),
                        b = Math.round(.5 * e.getViewPort().height),
                        c = 50,
                        d = e.screenToGeo(a, b),
                        f = e.screenToGeo(a + c, b),
                        g = d.distance(f);
                    return g / c
                }, d.getUnitByRulerSize = function(c) {
                    if (!b.imperialUSUK) return "miles" !== a.distanceUnit ? 900 > c ? d.UNITS.METER : d.UNITS.KILOMETER : c < d.UNITS.MILE.factor ? d.UNITS.FOOT : d.UNITS.MILE;
                    switch (a.distanceSystemUnit) {
                        case "imperialUS":
                            return c < d.UNITS.MILE.factor ? d.UNITS.FOOT : d.UNITS.MILE;
                        case "imperialGB":
                            return c < d.UNITS.MILE.factor ? d.UNITS.YARD : d.UNITS.MILE;
                        default:
                            return 900 > c ? d.UNITS.METER : d.UNITS.KILOMETER
                    }
                }, d.calculateProperBarLength = function(a) {
                    var b, c = parseInt(Math.log(a) / Math.log(10), 10),
                        d = Math.pow(10, c),
                        e = parseInt(a / d, 10);
                    return b = e > 5 ? 5 : e > 2 ? 2 : 1, b * d
                }, d.setRulerWidth = function() {
                    var a, b, c, e, g, h = d.getMetersPerPixel();
                    a = h * f, b = d.getUnitByRulerSize(a), c = a / b.factor, e = d.calculateProperBarLength(c), g = ~~(f / c * e), d.ruler = {
                        width: g,
                        distance: e,
                        unit: b.name
                    }
                }, d.updateScale = function() {
                    c.isStreetLevelActive() || d.setRulerWidth()
                }, d.initializeWhenMapIsReady = function(a) {
                    e = a, e.addEventListener("mapviewchangeend", function() {
                        d.ifZoomHasChanged() && d.updateScale()
                    }), b.imperialUSUK ? d.$watch("distanceSystemUnit", d.updateScale) : d.$watch("distanceUnit", d.updateScale)
                }, a.whenMapIsReady.then(function(a) {
                    d.initializeWhenMapIsReady(a)
                })
            }
        }
    }]), angular.module("hereApp.mapControls").directive("hereMapControlType", ["mapsjs", "$rootScope", "$document", "$window", "TrackingService", "streetLevel", "splitTesting", function(a, b, c, d, e, f) {
        return {
            require: "^hereMap",
            template: '<button class="map_control_type current"><div class="map_content"></div><div class="map_border"></div></button>',
            replace: !0,
            link: function(g, h, i, j) {
                var k, l, m, n = h[0];
                g.getSmallMapCenter = function(a, b) {
                    return a.screenToGeo(b.offsetLeft + b.offsetWidth / 2, b.offsetTop + b.offsetHeight / 2)
                }, g.getAlternateMapType = function(c) {
                    return a.mapUtils.isSatelliteLayer(c.getBaseLayer()) ? a.mapUtils[b.desiredMapType] : a.mapUtils.SATELLITE
                }, g.updateMapsTilesViewPortMargin = function() {
                    l.getViewPort().setMargin(256), k.getViewPort().setMargin(256), l.removeEventListener("mapviewchange", g.updateMapsTilesViewPortMargin)
                }, h.on("click", function() {
                    var b = j.getMap();
                    b.setBaseLayer(g.getAlternateMapType(b)), m = b.getBaseLayer() === a.mapUtils.SATELLITE, a.mapUtils.syncLabels(b), m ? c.find("body").addClass("satellite") : c.find("body").removeClass("satellite"), n.blur(), e.track("map", "map switcher clicked", {
                        prop13: m ? "satellite" : "normal",
                        eVar13: m ? "satellite" : "normal"
                    })
                }), b.whenMapIsReady.then(function(e) {
                    m = e.getBaseLayer() === a.mapUtils.SATELLITE, m && c.find("body").addClass("satellite"), b.$watch("desiredMapType", function(b, c) {
                        m = a.mapUtils.isSatelliteLayer(e.getBaseLayer()), c === b || m || (e.setBaseLayer(a.mapUtils[b], "default"), a.mapUtils.syncLabels(e)), m && k && k.getBaseLayer() !== e[b] && k.setBaseLayer(a.mapUtils[b], "default")
                    }, !0);
                    var h = n.querySelector(".map_content");
                    k = new a.Map(h, g.getAlternateMapType(e), {
                        zoom: e.getZoom(),
                        center: g.getSmallMapCenter(e, n),
                        pixelRatio: d.devicePixelRatio || 1,
                        renderBaseBackground: {
                            lower: 3,
                            higher: 2
                        },
                        imprint: null,
                        margin: 0
                    }), k.addEventListener("mapviewchangeend", function() {
                        if (!f.isStreetLevelActive()) {
                            k.setCenter(g.getSmallMapCenter(e, n));
                            var a = g.getAlternateMapType(e);
                            m && k && k.getBaseLayer() !== a && k.setBaseLayer(a, "default")
                        }
                    }), e.addEventListener("mapviewchange", function() {
                        f.isStreetLevelActive() || (k.setCenter(g.getSmallMapCenter(e, n)), k.setZoom(e.getZoom()))
                    }), l = e, e.addEventListener("mapviewchange", g.updateMapsTilesViewPortMargin), e.getViewPort().addEventListener("update", function() {
                        f.isStreetLevelActive() || (k.setCenter(g.getSmallMapCenter(e, n)), k.setZoom(e.getZoom()))
                    }), e.addEventListener("baselayerchange", function(b) {
                        if (!f.isStreetLevelActive()) {
                            var c = b.newValue === a.mapUtils.SATELLITE,
                                d = c ? "NORMAL" : "SATELLITE";
                            k.setBaseLayer(a.mapUtils[d])
                        }
                    })
                })
            }
        }
    }]), angular.module("hereApp.mapControls").directive("hereMapControlZoom", ["mapsjs", function(a) {
        return {
            require: "^hereMap",
            templateUrl: "directives/mapControls/zoom-controls.html",
            replace: !0,
            scope: {},
            link: function(b, c, d, e) {
                var f = c.children(),
                    g = angular.element(f[0]),
                    h = angular.element(f[1]),
                    i = "0.3.0" === a.buildInfo().version ? .05 : .005;
                b.mousedown = function(a) {
                    a.preventDefault();
                    var b = e.getMap().getViewModel(),
                        c = this === f[0] ? 1 : -1;
                    b.startControl(), b.control(0, 0, 0, 0, 0, 0, i * c), this.blur()
                }, b.mouseup = function(a) {
                    a.preventDefault();
                    var c = e.getMap().getViewModel();
                    c.endControl(!0, b.zoomValidator.bind(null, this === g[0])), this && this.blur && this.blur()
                }, b.zoomValidator = function(a, b) {
                    return b.zoom = a ? Math.ceil(b.zoom) : Math.floor(b.zoom), b
                };
                g[0].addEventListener("touchstart", b.mousedown), g[0].addEventListener("mousedown", b.mousedown), g[0].addEventListener("touchend", b.mouseup), g[0].addEventListener("touchcancel", b.mouseup), g[0].addEventListener("mouseup", b.mouseup), h[0].addEventListener("touchstart", b.mousedown), h[0].addEventListener("mousedown", b.mousedown), h[0].addEventListener("touchend", b.mouseup), h[0].addEventListener("touchcancel", b.mouseup), h[0].addEventListener("mouseup", b.mouseup)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMarkerFlag", ["$window", "$document", "$rootScope", "$timeout", "$routeParams", "markerIcons", "TrackingService", "utilityService", "Features", function(a, b, c, d, e, f, g, h, i) {
        return {
            replace: !0,
            templateUrl: "directives/markerFlag/marker-flag.html",
            link: function(j, k) {
                var l, m, n, o, p, q, r, s, t = a.devicePixelRatio || 1,
                    u = j.wrappedMarker.marker,
                    v = u.getParentGroup(),
                    w = u.getIcon(),
                    x = Math.ceil(w.getSize().w / t),
                    y = w.getAnchor(),
                    z = 0,
                    A = 20;
                y = {
                    x: 15,
                    y: 46
                }, j.initialize = function() {
                    if (l && -1 === l.getObjects().indexOf(u)) return void j.closeInstantly();
                    n = k.children(), o = angular.element(n[0].firstElementChild), p = o.next(), s = n[0].offsetWidth, j.icon && (p.addClass("has-icon"), p.css({
                        backgroundImage: "url(data:image/svg+xml;base64," + a.btoa(j.icon) + ")"
                    }), j.$watch("icon", function() {
                        p.css({
                            backgroundImage: "url(data:image/svg+xml;base64," + a.btoa(j.icon) + ")"
                        })
                    })), c.whenMapIsReady.then(function(a) {
                        l = a, m = l.getViewPort().padding.right, h.forwardWheelToMap(k, l)
                    }), j.syncPositionWithMarker(), j.hideWhenMarkerIsRemoved(), j.hideWhenContainerIsHidden(), j.hideOnTransitionEnd(), j.handleClicksOutside(), j.handleMouseMoves(), j.wrappedMarker.marker.setVisibility(!1), j.wrappedMarker.removeHighlight();
                    var b = -y.y + "px";
                    "route" !== j.knifeType && (b = "-2.2rem"), n.css({
                        top: b,
                        left: -y.x + "px"
                    }), j.updateOffsets(), k.css({
                        visibility: "visible"
                    }), r = d(function() {
                        j.attachKnife(), n.addClass("animated"), j.grow(), j.fitTitleIntoViewPort()
                    }), k.on("contextmenu", function(a) {
                        a.preventDefault()
                    })
                }, j.attachKnife = function() {
                    var a = f.knife(j.knifeType || "standard").trim(),
                        b = angular.element(a);
                    b.css({
                        top: -y.y + "px",
                        left: -y.x + "px",
                        visibility: "visible"
                    }), k.prepend(b)
                }, j.updateOffsets = function() {
                    var a = l.geoToScreen(j.data.position);
                    a && (k.css({
                        top: a.y + "px",
                        left: a.x + "px"
                    }), j.isGrown && j.fitTitleIntoViewPort())
                }, j.grow = function() {
                    j.isGrown = !0;
                    var a = p[0].offsetWidth,
                        b = o[0].offsetWidth,
                        c = a + b;
                    j.data.routing && (c -= 2), n.css({
                        top: -y.y + "px",
                        width: c + "px"
                    })
                }, j.fitTitleIntoViewPort = function() {
                    var a, b = p[0].offsetWidth,
                        c = l.geoToScreen(j.data.position).x,
                        d = c + (x - y.x) - b,
                        e = c - s,
                        f = l.getViewPort().padding.left - m + A,
                        g = f - d;
                    a = 0 >= g ? d : Math.min(d + g, e), n.css({
                        left: a - c + "px"
                    })
                }, j.closeInstantly = function() {
                    j.isGrown = !1, j.wrappedMarker.removeFlag()
                }, j.closeSmoothly = function() {
                    if (j.isGrown) {
                        j.isGrown = !1, n.addClass("animated"), n.css({
                            width: s + "px",
                            left: -y.x + "px"
                        });
                        var a = l.getViewBounds().containsPoint(j.wrappedMarker.marker.getPosition());
                        a && arguments.length > 0 && arguments[0].preventDefault && arguments[0].preventDefault()
                    }
                }, j.onClickOutsideFlag = function(a) {
                    var b = a.target;
                    do {
                        if (b === k[0]) return;
                        b = b.parentNode
                    } while (b);
                    j.hideOnClickOutside && j.closeInstantly()
                }, j.onMapClickOutsideFlag = function(a) {
                    j.hideOnClickOutside && j.closeSmoothly(a)
                }, j.handleClicksOutside = function() {
                    b.on("click", j.onClickOutsideFlag), l.addEventListener("tap", j.onMapClickOutsideFlag)
                }, j.handleMouseMoves = function() {
                    j.data.onMouseEnter && k.on("mouseenter", j.data.onMouseEnter.bind(null, j.wrappedMarker)), j.data.onMouseLeave && k.on("mouseleave", j.data.onMouseLeave.bind(null, j.wrappedMarker))
                }, j.syncPositionWithMarker = function() {
                    l.addEventListener("mapviewchange", j.updateOffsets), l.getViewPort().addEventListener("update", j.updateOffsets), j.$watch("data.position", j.updateOffsets, !0)
                }, j.containerVisibilityChecker = function(a) {
                    a.newValue === !1 && a.target === v && j.closeInstantly()
                }, j.hideWhenMarkerIsRemoved = function() {
                    u.addEventListener("$removed", j.closeInstantly)
                }, j.hideWhenContainerIsHidden = function() {
                    v.addEventListener("visibilitychange", j.containerVisibilityChecker)
                }, j.hideOnTransitionEnd = function() {
                    n.on("webkitTransitionEnd transitionend MSTransitionEnd", function() {
                        j.isGrown ? (z += 1, z >= 2 && n.removeClass("animated"), d(function() {
                            j.isClickable = !0
                        }, 300)) : j.closeInstantly()
                    }), i.disableTransitions && (j.isClickable = !0)
                }, j.dismantle = function() {
                    d.cancel(q), d.cancel(r), j.wrappedMarker.marker.setVisibility(!0), l && (l.removeEventListener("mapviewchange", j.updateOffsets), l.getViewPort().removeEventListener("update", j.updateOffsets), l.removeEventListener("click", j.onMapClickOutsideFlag), l.removeEventListener("tap", j.onMapClickOutsideFlag)), u.removeEventListener("$removed", j.closeInstantly), v.removeEventListener("visibilitychange", j.containerVisibilityChecker), b.off("click", j.onClickOutsideFlag)
                }, j.trackAndClose = function() {
                    j.closeSmoothly(), g.track("directions", "directions panel opened", {
                        prop40: "flag",
                        eVar40: "flag"
                    }), g.click("map:flag:directionsButton:click")
                }, j.onClick = function(b) {
                    if (b.target && b.target.href.indexOf(j.data.PBAPIID) > 1 && (j.data.routing = null, d(function() {
                            j.grow()
                        }, 100)), e.id && j.data.PBAPIID === e.id) return void b.preventDefault();
                    if (e.href) {
                        var c = a.atob(decodeURIComponent(e.href));
                        if (c.indexOf(j.data.PBAPIID) > -1) return void b.preventDefault()
                    }
                    j.data.onClick && j.data.onClick(j.wrappedMarker, b)
                }, j.isPDCPage = function() {
                    return e.id && e.id === j.wrappedMarker.data.PBAPIID || e.msg && e.msg === j.wrappedMarker.data.flag.title
                }, v && (q = d(j.initialize), j.$on("$destroy", j.dismantle))
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMarkerFlagIncident", ["$document", "$rootScope", "$timeout", "utilityService", "TrackingService", "User", "hereBrowser", "Features", "splitTesting", function(a, b, c, d, e, f, g, h) {
        return {
            replace: !0,
            templateUrl: "directives/markerFlag/marker-flag-incident.html",
            link: function(g, i) {
                var j, k, l = g.wrappedMarker.marker;
                g.improveInfo = h.traffic.improveInfo, g.dateTimeFormat = "en-us" === f.locale.tag ? "M/dd/yyyy h:mm a" : "d/MM/yyyy HH:mm", g.initialize = function() {
                    return j && -1 === j.getObjects().indexOf(l) ? void g.closeInstantly() : (k = i.children(), b.whenMapIsReady.then(function(a) {
                        j = a, d.forwardWheelToMap(i, j)
                    }), g.syncPositionWithMarker(), g.handleClicksOutside(), g.$on("$destroy", g.dismantle), c(function() {
                        g.fitIntoViewPort(), i.css({
                            visibility: "visible"
                        })
                    }), i.on("click", function() {
                        i.addClass("expanded"), e.click("traffic:incidentMarker:click")
                    }), i.on("contextmenu", function(a) {
                        a.preventDefault()
                    }), void e.click("traffic:incidentMarker:hover"))
                }, g.updateOffsets = function() {
                    var a = j.geoToScreen(g.data.position);
                    a && (i.css({
                        top: a.y + "px",
                        left: a.x + "px"
                    }), g.fitIntoViewPort())
                }, g.fitsInSpace = function(a, b, c, d) {
                    return !(c + d > b && c > a + d)
                }, g.fitIntoViewPort = function() {
                    var a = i[0],
                        b = a.firstChild,
                        c = b.classList,
                        d = j.getViewPort(),
                        e = d.padding,
                        f = g.fitsInSpace(0 + e.left, d.width - e.right, a.offsetLeft, b.offsetWidth),
                        h = g.fitsInSpace(0 + e.top, d.height - e.bottom, a.offsetTop, b.offsetHeight);
                    f ? (c.remove("left"), c.add("right")) : (c.remove("right"), c.add("left")), h ? (c.remove("top"), c.add("bottom")) : (c.remove("bottom"), c.add("top"))
                }, g.closeInstantly = function() {
                    g.wrappedMarker.removeFlag()
                }, g.onClickOutsideFlag = function(a) {
                    var b = a.target;
                    do {
                        if (b === i[0]) return;
                        b = b.parentNode
                    } while (b);
                    g.closeInstantly()
                }, g.onMapClickOutsideFlag = function() {
                    g.hideOnClickOutside && g.closeInstantly()
                }, g.handleClicksOutside = function() {
                    c(function() {
                        a.on("click", g.onClickOutsideFlag), j.addEventListener("tap", g.onMapClickOutsideFlag)
                    }, 100)
                }, g.syncPositionWithMarker = function() {
                    j.addEventListener("mapviewchange", g.updateOffsets), j.getViewPort().addEventListener("update", g.updateOffsets), g.$watch("data.position", g.updateOffsets, !0)
                }, g.dismantle = function() {
                    g.wrappedMarker.marker.setVisibility(!0), j.removeEventListener("mapviewchange", g.updateOffsets), j.getViewPort().removeEventListener("update", g.updateOffsets), j.removeEventListener("click", g.onMapClickOutsideFlag), j.removeEventListener("tap", g.onMapClickOutsideFlag), a.off("click", g.onClickOutsideFlag)
                }, c(g.initialize)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMarkerFlagJamFactor", ["$document", "$rootScope", "utilityService", "Features", function(a, b, c, d) {
        var e, f, g, h, i;
        return f = {get element() {
                return a[0].getElementById("marker_flag_jam_factor")
            },
            get $element() {
                return angular.element(f.element)
            },
            get position() {
                if (void 0 === h) {
                    var a = e.current.x,
                        b = e.current.y;
                    h = g.screenToGeo(a, b)
                }
                return h
            },
            clickHandler: function(a) {
                var b = a.target,
                    c = f.element;
                if (!e.current || null === c || i) return void(i = !1);
                do {
                    if (b === c) return;
                    b = b.parentNode
                } while (b);
                e.current = !1
            },
            viewChangeHandler: function(a) {
                if (e.current) {
                    i = "mapviewchange" === a.type;
                    var b = g.geoToScreen(f.position);
                    e.$apply(function() {
                        e.current.x = b.x, e.current.y = b.y
                    })
                }
            },
            doTheFlip: function(b, c, d) {
                var f = b.offsetWidth,
                    g = b.offsetHeight,
                    h = a[0].body.offsetWidth,
                    i = a[0].body.offsetHeight;
                h > c + f ? (b.classList.remove("right"), b.classList.add("left")) : (b.classList.remove("left"), b.classList.add("right")), i - 15 > d + g ? (b.classList.remove("bottom"), b.classList.add("top"), e.current.marginTop = 1) : (b.classList.remove("top"), b.classList.add("bottom"), e.current.marginTop = -g - 12)
            }
        }, {
            replace: !0,
            templateUrl: "directives/markerFlag/marker-flag-jam-factor.html",
            link: function(i, j) {
                e = i, e.improveInfo = d.traffic.improveInfo, b.whenMapIsReady.then(function(a) {
                    g = a, c.forwardWheelToMap(j, g), g.addEventListener("mapviewchange", f.viewChangeHandler), g.addEventListener("mapviewchangeend", f.viewChangeHandler)
                }), e.$watch("current ? current.x + current.y + current.marginTop : 0", function() {
                    e.flagStyling = {}, e.current ? (e.flagStyling.top = e.current.y + "px", e.flagStyling.left = e.current.x + "px", e.flagStyling.marginTop = e.current.marginTop + "px", f.doTheFlip(f.element, e.current.x, e.current.y)) : h = void 0
                }), e.$on("$destroy", function() {
                    a.off("click", f.clickHandler), g.removeEventListener("mapviewchange", f.viewChangeHandler), g.removeEventListener("mapviewchangeend", f.viewChangeHandler)
                }), a.on("click", f.clickHandler)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMarkerFlagManeuver", ["$document", "$rootScope", "$timeout", "utilityService", function(a, b, c, d) {
        return {
            replace: !0,
            templateUrl: "directives/markerFlag/marker-flag-maneuver.html",
            link: function(e, f) {
                var g, h, i = e.wrappedMarker.marker,
                    j = 15;
                e.initialize = function() {
                    return g && -1 === g.getObjects().indexOf(i) ? void e.closeInstantly() : (b.whenMapIsReady.then(function(a) {
                        g = a, d.forwardWheelToMap(f, g)
                    }), h = {
                        x: 17,
                        y: -j
                    }, e.syncPositionWithMarker(), e.handleClicksOutside(), e.updateOffsets(), f.css({
                        visibility: "visible"
                    }), e.$on("$destroy", e.dismantle), void f.on("contextmenu", function(a) {
                        a.preventDefault()
                    }))
                }, e.updateOffsets = function() {
                    var a, b, c = f[0].offsetWidth,
                        d = f[0].offsetHeight,
                        h = g.geoToScreen(e.data.position),
                        i = g.getViewPort();
                    h && (h.y -= d, h.x -= c, f.css({
                        top: h.y + "px",
                        left: h.x + "px"
                    }), a = parseInt(f[0].style.marginLeft) || 0, b = i.padding.left - h.x, b > j ? c > b ? (f[0].style.marginLeft = b + "px", f.children()[0].style.marginRight = b - j + "px") : (f[0].style.marginLeft = c + "px", f.children()[0].style.marginRight = c - j + "px") : (f[0].style.marginLeft = "", f.children()[0].style.marginRight = ""))
                }, e.closeInstantly = function() {
                    e.wrappedMarker.removeFlag()
                }, e.syncPositionWithMarker = function() {
                    g.addEventListener("mapviewchangeend", e.updateOffsets), g.addEventListener("mapviewchange", e.updateOffsets)
                }, e.containerRemoveObserver = function(a, b, c) {
                    "visibility" === b && c === !1 && e.closeInstantly(), "remove" === b && c === e.wrappedMarker.marker && e.closeInstantly()
                }, e.onClickOutsideFlag = function(a) {
                    var b = a.target;
                    do {
                        if (b === f[0]) return;
                        b = b.parentNode
                    } while (b);
                    e.hideOnClickOutside && e.closeInstantly()
                }, e.onMapClickOutsideFlag = function() {
                    e.hideOnClickOutside && e.closeInstantly()
                }, e.handleClicksOutside = function() {
                    a.on("click", e.onClickOutsideFlag), g.addEventListener("tap", e.onMapClickOutsideFlag)
                }, e.dismantle = function() {
                    e.wrappedMarker.marker.setVisibility(!0), g.removeEventListener("mapviewchange", e.updateOffsets), g.removeEventListener("mapviewchangeend", e.updateOffsets), g.removeEventListener("tap", e.onMapClickOutsideFlag), a.off("click", e.onClickOutsideFlag)
                }, c(e.initialize)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMenu", ["$document", "$window", "$rootScope", "$location", "$route", "$timeout", "LocalStorageService", "Features", "TrackingService", "utilityService", "hereBrowser", "User", "HereAccountService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
        return {
            replace: !0,
            templateUrl: "directives/menu/menu.html",
            link: function(g) {
                g.isReportProblemEnabled = h.map.reportProblem, g.isMenuVisible = !1, g.hideMenuIfVisible = function() {
                    f(function() {
                        g.isMenuVisible && (g.isMenuVisible = !1)
                    })
                }, g.documentClickHandler = function(a) {
                    var c = ["BUTTON", "A"].indexOf(a.target.tagName) > -1,
                        d = angular.element(a.target),
                        e = d.hasClass("menu") || j.hasParentWithClass(a.target, "menu"),
                        h = d.hasClass("menu_access_btn"),
                        i = "touchstart" === a.type;
                    k.isiOS && k.isChrome && f(function() {
                        b.scrollTo(0, 0)
                    }), h || (!e || !i && c) && g.hideMenuIfVisible()
                }, a.on("click touchstart", g.documentClickHandler), c.whenMapIsReady.then(function(a) {
                    a.addEventListener("mapviewchangestart", function() {
                        g.hideMenuIfVisible()
                    })
                }), g.changeMenuVisibility = function() {
                    if (!g.isMenuVisible) {
                        var a = j.convertQueryFormatToMapInfo(d.search().map);
                        a.latitude && (g.mapPositionCreatorURLParams = [a.latitude, a.longitude, a.zoomLevel, 0, 0].join(",")), i.track("menu", "User clicks on Hamburger button to OPEN the menu", {
                            prop32: "menu button clicked",
                            eVar32: "menu button clicked"
                        })
                    }
                    g.isMenuVisible = !g.isMenuVisible, g.closePopover(), b.UserVoice && b.UserVoice.hide && b.UserVoice.hide()
                }, g.trackClick = function(a) {
                    var b = "places" === e.current.$$route.specialPanelClass ? "pdc" : e.current.$$route.specialPanelClass,
                        c = "places" === a,
                        d = c ? "event16" : void 0,
                        f = "menu: " + a + " panel opened",
                        g = {
                            prop32: f,
                            eVar32: f
                        };
                    c && (g.prop45 = g.eVar45 = "menu"), i.track(b, f, g, d)
                }, g.trackAppDownload = function(a) {
                    var b = a || "page",
                        c = "HERE mobile app download " + b;
                    i.track("menu", c, {
                        prop32: c,
                        eVar32: c
                    })
                }, g.showSettings = function() {
                    g.$emit("modalDialog", {
                        templateUrl: "features/settings/settings.html",
                        replace: !0
                    })
                }, g.showReportMapProblem = function() {
                    g.closePopover(), c.$broadcast("popover", {
                        templateUrl: "features/reportMapProblem/reportMapProblem.html",
                        single: !0,
                        widePopup: !0
                    })
                }, g.$on("$routeChangeSuccess", function(a, b) {
                    g.isCollectionsActive = "collections" === b.specialPanelClass
                }), g.isLoggedIn = l.isLoggedIn(), g.$on("userLoggedIn", function() {
                    g.isLoggedIn = !0
                }), g.logOut = function() {
                    i.track("account", "sign out", "", null), m.signOut()
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereMobileInput", ["$document", "$timeout", "hereBrowser", function(a, b, c) {
        function d(a, b, c) {
            var d, e = a.style,
                f = "translate(" + b + ", " + c + ")";
            return void 0 !== e.transform ? (d = e.transform, e.transform = f) : void 0 !== e.webkitTransform && (d = e.webkitTransform, e.webkitTransform = f), d
        }

        function e(a, b) {
            var c = a.style;
            b = void 0 === b ? "" : b, void 0 !== c.transform ? c.transform = b : void 0 !== c.webkitTransform && (c.webkitTransform = b)
        }
        return {
            link: function(b, f) {
                return c.isAndroid ? void f.on("click", function(b) {
                    var c = f[0],
                        g = b.target,
                        h = angular.element(b.target),
                        i = "INPUT" === g.tagName && g === a[0].activeElement;
                    if (i) {
                        for (; g && g !== c;) g = g.parentNode, i = g === c;
                        if (i) {
                            var j, k = function() {
                                    f.removeClass("shifted_for_mobile_input"), e(c, j), h.off("blur", k)
                                },
                                l = -(c.getBoundingClientRect().top - 10);
                            f.addClass("shifted_for_mobile_input"), j = d(c, "0px", l + "px"), h.on("blur", k)
                        }
                    }
                }) : !1
            }
        }
    }]), angular.module("hereApp.directive").directive("modalDialog", ["$document", "$window", "$timeout", "TrackingService", "hereBrowser", function(a, b, c, d, e) {
        return {
            link: function(f) {
                f.modals = [], f.$on("modalDialog", function(b, c) {
                    f.modals.length > 0 && c.replace ? f.modals[f.modals.length - 1] = c : f.modals.push(c);
                    var d = a[0] ? a[0].activeElement : null;
                    d && "A" === d.tagName && d.blur()
                }), f.closeDialog = function() {
                    d.click("modalDialog:closeButton:click");
                    var a = f.modals.pop();
                    a.onClose && a.onClose(), e.isiOS && e.isChrome && c(function() {
                        b.scrollTo(0, 0)
                    })
                }, f.isModalDialogActive = function() {
                    return f.modals.length > 0
                }, f.$on("$locationChangeStart", function(a, b, c) {
                    f.modals.length && b && c && b.split("?")[0] !== c.split("?")[0] && f.closeDialog()
                }), a.bind("keydown", function(a) {
                    var b = 27,
                        c = a.keyCode || a.which;
                    c === b && f.modals.length > 0 && f.$apply(function() {
                        f.closeDialog()
                    })
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereNavigationHelper", ["$route", function(a) {
        return {
            link: function(b, c) {
                b.$on("$routeChangeSuccess", function(b, d, e) {
                    var f = a.current.$$route;
                    e && e.$$route && e.$$route.specialPanelClass && c.removeClass(e.$$route.specialPanelClass), f && f.specialPanelClass && c.addClass(f.specialPanelClass)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereNodeDimensions", function() {
        return {
            scope: {
                hereNodeDimensions: "&hereNodeDimensions"
            },
            link: function(a, b) {
                a.hereNodeDimensions({
                    getter: function() {
                        var a = b[0],
                            c = {
                                width: a.offsetWidth,
                                height: a.offsetHeight,
                                top: a.offsetTop,
                                left: a.offsetLeft
                            },
                            d = function(a) {
                                a.offsetParent && (c.top = c.top + a.offsetParent.offsetTop, c.left = c.left + a.offsetParent.offsetLeft, d(a.offsetParent))
                            };
                        return d(a), c
                    }
                })
            }
        }
    }), angular.module("hereApp.directive").directive("notificationBox", ["$animate", "$timeout", function(a, b) {
        return {
            replace: !0,
            scope: {
                showNotification: "=showNotification",
                notificationType: "@notificationType",
                svgColor: "@svgColor",
                notificationMessage: "@notificationMessage",
                notificationCallback: "&notificationCallback",
                notificationHideAfter: "@notificationHideAfter"
            },
            transclude: !0,
            template: '<div class="notification_box" data-ng-class="notificationType" data-ng-show="showNotification">    <div data-ng-transclude></div>    <button type="button" class="close" data-ng-click="close()" data-here-svg="{path: \'/directives/notificationBox/icon_close_error_msg.svg\', color: (svgColor || \'#b70000\')}">&nbsp;</button></div>',
            link: function(c, d) {
                var e;
                c.close = function(b) {
                    "cookie" === c.notificationType ? a.leave(d).then(c.notificationCallback) : (b ? d.addClass("fadeout") : d.removeClass("fadeout"), c.showNotification = !1);

                }, c.notificationHideAfter && !isNaN(c.notificationHideAfter) && c.$watch("showNotification", function(a) {
                    e && b.cancel(e), a && (e = b(function() {
                        c.close(!0)
                    }, c.notificationHideAfter))
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereOnerror", function() {
        return {
            link: function(a, b, c) {
                var d = function() {
                    a.$apply(c.hereOnerror)
                };
                b.on("error", d), a.$on("$destroy", function() {
                    b.off("error", d)
                })
            }
        }
    }), angular.module("hereApp.directive").directive("hereOnload", function() {
        return {
            link: function(a, b, c) {
                var d = function() {
                    a.$apply(c.hereOnload)
                };
                b.on("load", d), a.$on("$destroy", function() {
                    b.off("load", d)
                })
            }
        }
    }), angular.module("hereApp.directive").directive("panelsWithMap", ["$rootScope", "$document", "$timeout", "$route", "panelsService", function(a, b, c, d, e) {
        return {
            replace: !1,
            link: function(b, c) {
                function f() {
                    if (h) {
                        var a = h.getViewPort().padding,
                            b = h.getCenter(),
                            c = e.isMinimized ? e.leftPaddingOffset : e.width;
                        c !== i ? (h.getViewPort().setPadding(a.top, a.right, a.bottom, c), d.current.$$route.keepMapCenter || h.setCenter(b, !0), i = c) : i = c
                    }
                }

                function g() {
                    var a = c[0].offsetLeft + c[0].offsetWidth + e.leftPaddingOffset;
                    e.width !== a && (e.width = a, f())
                }
                var h, i;
                b.panelsService = e, b.$watch("panelsService.isMinimized", function() {
                    f()
                }), a.whenMapIsReady.then(function(a) {
                    h = a, h.getViewPort().addEventListener("update", g), g()
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("simplePanelDirective", ["$rootScope", "$route", "panelsService", "Features", function(a, b, c) {
        return {
            link: function(d, e) {
                d.panels = [], a.$on("$routeChangeSuccess", function(f, g, h) {
                    var i = b.current.$$route,
                        j = ("features/discover/discover.html" === g.templateUrl, "directions" === g.specialPanelClass),
                        k = "streetLevel" === g.specialPanelClass;
                    h && g.templateUrl === h.templateUrl && i && i.doNotReplacePanel || g && g.loadedTemplateUrl && (d.panels.pop(), d.panels.push({
                        templateUrl: g.loadedTemplateUrl
                    })), h && h.$$route && h.$$route.specialPanelClass && e.removeClass(h.$$route.specialPanelClass), i && i.specialPanelClass && e.addClass(i.specialPanelClass), !g.blockMinimizedPanelState || j || k ? g.blockMinimizedPanelState === !1 && (c.isMinimized = !0) : c.isMinimized = !1, a.showServiceSwitcher = !j
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("herePanelHandle", ["$route", "TrackingService", "panelsService", function(a, b, c) {
        return {
            templateUrl: "directives/panelHandle/panelHandle.html",
            replace: !0,
            link: function(d) {
                var e = function(c) {
                    var d = c ? "panelCollapsed" : "panelExpanded",
                        e = a.current.$$route.specialPanelClass;
                    b.click(e + ":" + d + ":click")
                };
                d.togglePanel = function() {
                    c.isMinimized = !c.isMinimized, e(c.isMinimized)
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("placeCard", ["ensureHTTPSFilter", "RedirectService", function(a, b) {
        return {
            templateUrl: "directives/placeCard/place-card.html",
            replace: !0,
            scope: {
                options: "=placeCard"
            },
            link: function(c) {
                var d = c.options.result,
                    e = d && d.tags ? d.tags.filter(function(a) {
                        return "cuisine" === a.group
                    }) : null;
                c.imageLoaded = !1, c.options.result.cuisine = e && e.length ? e[0].title : null, c.getImageAnimationStyle = function() {
                    return c.imageLoaded = !!d.mainImageLoaded, {
                        backgroundImage: d.mainImageLoaded ? "url(" + a(d.mainImageLoaded) + ")" : "",
                        opacity: d.mainImageLoaded ? 1 : 0
                    }
                }, c.$watch("imageLoaded", function(a) {
                    a && c.$emit("placeCardImageLoaded", d)
                }), c.boxOver = function(a) {
                    d.highlight = !0, c.options.boxOver && c.options.boxOver(d, a)
                }, c.boxOut = function(a) {
                    d.highlight = !1, c.options.boxOut && c.options.boxOut(d, a)
                }, c.goToPlace = function(a, e) {
                    d.highlight = !1, c.options.boxClick && c.options.boxClick(d), e && b.goToPlace(d, e), a.preventDefault()
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("popover", ["$rootScope", "$compile", "$document", "$timeout", "NotificationsManager", function(a, b, c, d, e) {
        return {
            link: function(a) {
                a.popups = [], a.widePopup = !1, a.$on("popover", function(b, c) {
                    var f = angular.equals(a.popups, [c]),
                        g = c.single;
                    f || (a.widePopup = !!c.widePopup, g ? a.popups = [c] : a.popups.push(c)), e.lock(e.CLIENT_POPOVER), d(function() {
                        a.$apply()
                    }, 0)
                }), a.closePopover = function(b) {
                    e.unlock(e.CLIENT_POPOVER), b = b || this.$index, a.popups.splice(b, 1), d(function() {
                        a.$apply()
                    }, 0)
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("herePreventIeTouchContextMenu", ["hereBrowser", function(a) {
        return {
            link: function(b, c) {
                function d(a) {
                    a.preventDefault()
                }
                a.isIE && (c.on("MSHoldVisual", d), c.on("contextmenu", d), b.$on("$destroy", function() {
                    c.off("MSHoldVisual", d), c.off("contextmenu", d)
                }))
            }
        }
    }]), angular.module("hereApp.directive").directive("quickDatepicker", ["$document", function() {
        return {
            restrict: "E",
            link: function(a, b, c) {
                {
                    var d = angular.element(b[0].querySelector(".quickdate-date-input")),
                        e = angular.element(b[0].querySelector(".quickdate-popup"));
                    angular.element(b[0].querySelector(".quickdate-close"))
                }
                d.attr("readonly", "readonly"), e.addClass("closed" === c.state ? "close" : "open")
            }
        }
    }]), angular.module("hereApp.directive").directive("randomizePlaceholder", ["$parse", "RandomizerService", function(a, b) {
        return {
            require: "ngModel",
            link: function(c, d, e) {
                var f = a(e.randomizePlaceholder)(c);
                if (f && f.array) {
                    var g = b.create(f.array),
                        h = function() {
                            d[0].placeholder = g.getNext()
                        };
                    h(), g.getLength() < 2 || c.$watch(e.ngModel, function(a) {
                        angular.isString(a) && 0 === a.length && h()
                    })
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereReviewRateIcon", ["$window", "$templateCache", function(a, b) {
        function c(a, c, d) {
            var e, f, g = "/directives/ratings/icons/icon-rating.svg",
                h = "/directives/ratings/icons/icon-rating-tripadvisor.svg";
            switch (c) {
                case "tripadvisor":
                    f = h;
                    break;
                default:
                    f = g
            }
            return d = d || (a ? "#00c9ff" : "#d9d9d9"), e = b.get(f).replace("_color_", d)
        }
        return {
            scope: {
                hereRating: "@",
                hereRatingProvider: "@",
                hereRatedElementColor: "@",
                hereEmptyElementColor: "@"
            },
            link: function(a, b) {
                var d = function() {
                        b.find("div").remove()
                    },
                    e = function() {
                        if (d(), a.hereRating) {
                            for (var e = a.hereRatingProvider, f = Math.round(2 * a.hereRating) / 2, g = 5, h = 100 * f / g, i = c(!0, e, a.hereRatedElementColor), j = c(!1, e, a.hereEmptyElementColor), k = angular.element("<div></div>"), l = angular.element('<div class="rated" style="width:' + h + '%;"></div>'), m = 0; g > m; m++) k.append(j), l.append(i);
                            b.append(k), b.append(l)
                        }
                    };
                e(), a.$watch("[hereRating, hereRatingProvider, hereRatedElementColor, hereEmptyElementColor]", e, !0)
            }
        }
    }]), angular.module("hereApp.directive").directive("hereReadMore", function() {
        var a = {
            getCutPoint: function(a) {
                for (var b, c = /\s+/gm, d = 0; null !== (b = c.exec(a));) d = b.index;
                return d
            },
            replaceBreaks: function(a) {
                return a.replace(/<br\/>/g, "\n")
            },
            restoreBreaks: function(a) {
                return a.replace(/\n/g, "<br/>")
            }
        };
        return {
            scope: {
                content: "@hereReadMore"
            },
            templateUrl: "directives/readMore/read-more.html",
            link: function(b, c, d) {
                b.options = {
                    max: parseInt(d.hereReadMoreMax, 10) || 170,
                    readMoreText: d.hereReadMoreMoreText || "See more",
                    readLessText: d.hereReadMoreLessText || "See less",
                    scrollTo: d.hereReadLessScrollTo || !1
                }, b.truncated = !1, b.toggle = function() {
                    b.truncated = !b.truncated, b.buttonContent = b.truncated ? b.options.readMoreText : b.options.readLessText, b.scrollTo = b.options.scrollTo && b.truncated && b.rest ? b.$eval(b.options.scrollTo) : !1
                };
                var e = b.content.trim();
                e = a.replaceBreaks(e);
                var f, g = e.substring(0, b.options.max),
                    h = e.length;
                if (h > b.options.max) {
                    var i = a.getCutPoint(g);
                    g = g.substr(0, i), f = e.substring(i), f = a.restoreBreaks(f), b.rest = f, b.toggle()
                }
                g = a.restoreBreaks(g), b.preview = g, b.helper = a
            }
        }
    }), angular.module("hereApp.directive").directive("reportForm", ["PBAPI", function(a) {
        return {
            scope: {
                reportURL: "=reportForm",
                onAbort: "&",
                onSuccess: "&",
                errorMessage: "@"
            },
            templateUrl: "directives/reportForm/reportForm.html",
            link: function(b) {
                b.processData = function(c) {
                    var d = angular.copy(c);
                    b.processing = !0, d.reason = d.reason.split("_")[1], a.report(d).then(function() {
                        return b.onSuccess && b.onSuccess()
                    }, function() {
                        b.showErrorMessage = !!b.errorMessage
                    })["finally"](function() {
                        b.processing = !1
                    })
                }, b.$watch("reportURL", function(c) {
                    b.results = {}, b.showErrorMessage = !1, b.processing = !1, b.formData = null, b.loading = !1, c && (b.loading = !0, a.report({
                        url: c
                    }).then(function(a) {
                        b.loading = !1, b.formData = a.data
                    }))
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereScrollAbsolute", ["$window", "utilityService", function(a, b) {
        return {
            link: function(c, d) {
                var e = function() {
                    var c = a.innerHeight - b.getOffsetTop(d[0]);
                    d[0].style.maxHeight = c + "px"
                };
                e(), a.addEventListener("resize", e, !1), c.$on("$destroy", function() {
                    a.removeEventListener("resize", e, !1)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereScrollable", ["$document", "Features", "utilityService", "hereAnimation", function(a, b, c, d) {
        return {
            controller: ["$scope", "$element", function(a, b) {
                this.smoothScroll = new d.Animate(b[0], "scrollTop")
            }],
            link: function(b, d, e) {
                var f, g, h = angular.element(a[0].querySelector(e.hereCollapsedElement)),
                    i = 42,
                    j = function() {
                        g = g || d[0].offsetHeight, f = f || a[0].querySelector(".header_content").offsetHeight;
                        var b = g + (f - i) < d[0].scrollHeight,
                            c = 0 !== d[0].scrollTop;
                        c && b ? h.addClass("collapsed") : h.removeClass("collapsed")
                    };
                h.removeClass("collapsed"), c.setScrollContainer(d[0]), d.on("scroll", j), b.$on("$destroy", function() {
                    d.off("scroll", j)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereScrollIntoView", function() {
        return {
            require: "^?hereScrollable",
            link: function(a, b, c, d) {
                var e = c.hereScrollIntoViewMargin ? parseInt(c.hereScrollIntoViewMargin, 10) : 0;
                c.$observe("hereScrollIntoView", function(a) {
                    "true" === a && d.smoothScroll.to(function() {
                        return Math.max(b[0].offsetTop - e, 0)
                    }, 500, "easeInOutSine")
                })
            }
        }
    }), angular.module("hereApp.directive").directive("hereServiceSwitcher", ["$document", "$window", "$route", "$timeout", "Features", "TrackingService", "recentRouteStorage", function(a, b, c, d, e, f) {
        var g = c;
        return {
            templateUrl: "directives/serviceSwitcher/serviceSwitcher.html",
            replace: !0,
            link: function(e, h) {
                e.indicatorWidth = 0, e.indicatorLeft = 0, e.trafficUrl = "/traffic/explore";
                var i = h[0].getElementsByClassName("active_indicator")[0],
                    j = {
                        discover: "#ss_places",
                        places: "#ss_places",
                        search: "#ss_places",
                        collections: "#ss_collections",
                        traffic: "#ss_traffic"
                    },
                    k = function(b, c) {
                        if (c || (c = g.current), c && c.$$route && c.$$route.specialPanelClass && j[c.$$route.specialPanelClass] && a[0].body.classList.contains(c.$$route.specialPanelClass)) {
                            var f = h[0].querySelector(j[c.$$route.specialPanelClass]);
                            if ("_blank" === f.target || "_new" === f.target) return;
                            (0 === f.clientWidth || 0 === f.offsetLeft) && e.indicatorWidth && e.indicatorLeft ? (i.style.width = e.indicatorWidth + "px", i.style.left = e.indicatorLeft + "px", "discover" === c.$$route.specialPanelClass && (i.style.left = "48px")) : f.clientWidth > 0 && f.offsetLeft > 0 && (e.indicatorWidth = f.clientWidth, e.indicatorLeft = f.offsetLeft, i.style.width = f.clientWidth + "px", i.style.left = f.offsetLeft + "px", d(function() {
                                e.initialized = !0
                            }, 0))
                        }
                    };
                e.$on("$routeChangeSuccess", k), b.addEventListener("resize", k), b.addEventListener("load", k), k(), e.trackClick = function(a) {
                    var b, d = "places" === c.current.$$route.specialPanelClass ? "pdc" : c.current.$$route.specialPanelClass,
                        e = 'service switcher (click on "' + a + '" button)',
                        g = "places" === a,
                        h = g ? "event16" : void 0;
                    switch (a) {
                        case "logo":
                            b = "landing page opened from here button";
                            break;
                        case "places":
                            b = "discover opened";
                            break;
                        case "collections":
                            b = "collections card opened switcher bar";
                            break;
                        case "traffic":
                            b = "traffic opened switcher bar"
                    }
                    var i = {
                        prop32: b,
                        eVar32: b
                    };
                    g && (i.prop45 = i.eVar45 = "switcher bar"), f.track(d, "User opens the " + a + " panel via " + e, i, h)
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereShowOnFocus", ["$timeout", "utilityService", function(a, b) {
        return function(c, d, e) {
            function f() {
                var a = b.findParentByClass(d[0], e.hereShowOnFocus);
                a.scrollTop = d[0].offsetTop
            }
            d.on("focus", function() {
                a(f, 1e3)
            })
        }
    }]), angular.module("hereApp.directive").directive("hereSpinner", ["$timeout", function(a) {
        var b = {
                big: "/img/spinner_big.svg",
                small: "/img/spinner_small.svg",
                "small-white": "/img/spinner_small_white.svg"
            },
            c = {
                route: "/img/route.svg"
            };
        return {
            scope: {},
            templateUrl: "directives/spinner/spinner.html",
            link: function(d, e, f) {
                var g = f.hereSpinner,
                    h = f.hereInsideSpinnerImage,
                    i = c[h] ? c[h] : "",
                    j = f.hereSpinnerCaption,
                    k = g && b[g] ? g : "big";
                d.type = k, d.spinnerImagePath = b[k], d.insideSpinnerImagePath = i, d.caption = j, a(function() {
                    e.find("section").css({
                        opacity: 1
                    })
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereStreetLevelClose", ["streetLevel", function(a) {
        return {
            templateUrl: "directives/streetLevel/streetLevelClose.html",
            replace: !0,
            link: function(b) {
                b.closeStreetlevel = a.exitStreetLevel
            }
        }
    }]), angular.module("hereApp.directive").directive("hereStreetLevelCompass", ["$rootScope", "streetLevel", function(a, b) {
        return {
            replace: !0,
            templateUrl: "directives/streetLevel/streetLevelCompass.html",
            link: function(c) {
                a.whenMapIsReady.then(function(a) {
                    var d = a.getViewModel();
                    a.addEventListener("mapviewchange", function() {
                        b.isStreetLevelActive() && (c.heading = -d.getCameraData().yaw, c.$digest())
                    })
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereStreetLevelExpose", ["streetLevel", function(a) {
        return {
            link: function(b) {
                b.isStreetLevelActive = a.isStreetLevelActive
            }
        }
    }]), angular.module("hereApp.directive").directive("hereStreetLevelKeyboard", ["$rootScope", "$document", "mapsjs", "streetLevel", function(a, b, c, d) {
        return {
            link: function(e) {
                e.SPEED_FACTOR = .05, e.WALK_DISTANCE = 20, e.KEYS = {
                    UP: 38,
                    DOWN: 40,
                    LEFT: 37,
                    RIGHT: 39
                }, e.whichButton = function(a) {
                    var b = e.KEYS;
                    return {
                        up: a === b.UP,
                        down: a === b.DOWN,
                        left: a === b.LEFT,
                        right: a === b.RIGHT
                    }
                }, e.rotate = function(a, b) {
                    a.startControl(), a.control(0, 0, 0, 0, e.SPEED_FACTOR * (b ? 1 : -1), 0, 0)
                }, e.moveTo = function(a, b, d) {
                    var f, g = b.getCameraData(),
                        h = g.yaw;
                    d || (h += 180), f = c.geo.Point.fromIPoint(g.position).walk(h, e.WALK_DISTANCE), g.position.lat = f.lat, g.position.lng = f.lng, g.animate = !0, b.setCameraData(g)
                }, a.whenMapIsReady.then(function(a) {
                    var c = a.getViewModel();
                    b.on("keydown", function(b) {
                        if (!(!d.isStreetLevelActive() || b.altKey || b.ctrlKey || b.metaKey || b.shiftKey)) {
                            var f = e.whichButton(b.which);
                            (f.left || f.right) && e.rotate(c, f.left), (f.up || f.down) && e.moveTo(a, c, f.up)
                        }
                    }), b.on("keyup", function(a) {
                        if (d.isStreetLevelActive()) {
                            var b = e.whichButton(a.which);
                            (b.left || b.right) && c.endControl(!0)
                        }
                    })
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereStreetLevelMinimap", ["$window", "$rootScope", "mapsjs", "streetLevel", function(a, b, c, d) {
        return {
            templateUrl: "directives/streetLevel/streetLevelMinimap.html",
            link: function(e, f) {
                var g, h, i, j, k, l, m, n = f[0].querySelector(".map_content"),
                    o = "rotate({{yaw}},50,50)",
                    p = "M50,55 {{fov1}},-250 {{fov2}},-250 50,55z";
                f.on("click", function() {
                    d.exitStreetLevel()
                }), j = function() {
                    i = f.find("path")[0], h = new c.Map(n, c.mapUtils.NORMAL, {
                        zoom: 17,
                        center: g.getCenter(),
                        pixelRatio: a.devicePixelRatio || 1,
                        renderBaseBackground: {
                            lower: 3,
                            higher: 2
                        },
                        imprint: null,
                        margin: 256
                    })
                }, k = function() {
                    if (d.isStreetLevelActive()) {
                        h || j();
                        var a = g.getViewModel().getCameraData();
                        i.setAttribute("fill", "transparent"), i.setAttribute("fill", "url(#a)"), i.setAttribute("d", l(a)), i.setAttribute("transform", m(a)), h.setCenter(g.getCenter())
                    }
                }, l = function(a) {
                    var b = -1 * a.fov - 250,
                        c = a.fov + 350;
                    return p.replace("{{fov1}}", b).replace("{{fov2}}", c)
                }, m = function(a) {
                    return o.replace("{{yaw}}", a.yaw)
                }, b.whenMapIsReady.then(function(a) {
                    g = a, g.addEventListener("mapviewchange", k), g.getViewPort().addEventListener("update", k)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereReportImage", ["$rootScope", "streetLevel", "Features", function(a, b) {
        return {
            replace: !0,
            template: '<span class="report_link"><button class="btn_simple report_image_link" data-ng-click="showReportImageForm()" data-here-click-tracker="SLI:reportimage:internal:click">Report an image problem</button></span>',
            link: function(a) {
                a.showReportImageForm = b.showReportImageForm
            }
        }
    }]), angular.module("hereApp.directive").directive("hereSvg", ["$window", "$templateCache", "hereBrowser", function(a, b, c) {
        return {
            scope: {
                params: "=hereSvg"
            },
            link: function(d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = d.params || {},
                    r = /#fff/gi,
                    s = q.color,
                    t = q.hoverColor,
                    u = q.activeColor,
                    v = q.disabledColor,
                    w = e[0].disabled,
                    x = e[0].style,
                    y = b.get(q.path);
                if (!y) return null;
                f = s ? y.replace(r, s) : y, g = y.replace(r, t), i = y.replace(r, v), p = function(b) {
                    return "url(data:image/svg+xml;base64," + a.btoa(b) + ")"
                }, m = function() {
                    e.hasClass("active") || (x.backgroundImage = j)
                }, n = function() {
                    e.hasClass("active") || (x.backgroundImage = k)
                }, o = function() {
                    w && v && (i = y.replace(r, v), x.backgroundImage = p(i))
                }, o(), j = p(f), m(), u && (h = y.replace(r, u), l = p(h), d.$watch(function() {
                    return e.hasClass("active")
                }, function() {
                    e.hasClass("active") ? x.backgroundImage = l : m()
                }));
                var z = function() {
                    k = p(g);
                    var a = "mouseenter",
                        b = "mouseleave";
                    e.on(a, n), e.on(b, m), d.$on("$destroy", function() {
                        e.off(a, n), e.off(b, m)
                    })
                };
                t && (c.mouse ? z() : d.$on("mouseDetected", function() {
                    z()
                }))
            }
        }
    }]), angular.module("hereApp.directive").directive("tip", ["$document", "$window", "$timeout", "TrackingService", "TipsService", "Features", function(a, b, c, d, e, f) {
        var g = {
            ORIENTATION: {
                VERTICAL: {
                    TOP: "top",
                    TOPCORNER: "topCorner",
                    BOTTOMCORNER: "bottomCorner",
                    BOTTOM: "bottom"
                },
                HORIZONTAL: {
                    LEFT: "left",
                    LEFTCORNER: "leftCorner",
                    RIGHTCORNER: "rightCorner",
                    RIGHT: "right"
                }
            }
        };
        return {
            scope: {},
            templateUrl: "directives/tips/tip.html",
            link: function(d, h) {
                if (f.tips) {
                    var i, j, k, l, m, n, o, p, q, r, s, t, u = 100,
                        v = [
                            [g.ORIENTATION.HORIZONTAL.LEFT, g.ORIENTATION.VERTICAL.TOPCORNER],
                            [g.ORIENTATION.HORIZONTAL.LEFT, g.ORIENTATION.VERTICAL.BOTTOMCORNER],
                            [g.ORIENTATION.HORIZONTAL.RIGHT, g.ORIENTATION.VERTICAL.TOPCORNER],
                            [g.ORIENTATION.HORIZONTAL.RIGHT, g.ORIENTATION.VERTICAL.BOTTOMCORNER],
                            [g.ORIENTATION.HORIZONTAL.LEFTCORNER, g.ORIENTATION.VERTICAL.TOP],
                            [g.ORIENTATION.HORIZONTAL.RIGHTCORNER, g.ORIENTATION.VERTICAL.TOP],
                            [g.ORIENTATION.HORIZONTAL.LEFTCORNER, g.ORIENTATION.VERTICAL.BOTTOM],
                            [g.ORIENTATION.HORIZONTAL.RIGHTCORNER, g.ORIENTATION.VERTICAL.BOTTOM]
                        ],
                        w = {
                            ok: "ok",
                            next: "next",
                            done: "done"
                        },
                        x = 2,
                        y = 2,
                        z = 80,
                        A = 20,
                        B = 10,
                        C = 10,
                        D = new Array(4),
                        E = [".scrollable_content"],
                        F = {
                            visible: "visible",
                            hidden: "hidden",
                            closing: "closing",
                            init: "init"
                        },
                        G = 200,
                        H = 1e3,
                        I = function(b) {
                            n = angular.element(a[0].querySelector(o))[0], q = n.offsetWidth, r = n.offsetHeight;
                            var c = h[0].querySelector(".tip");
                            s = c.offsetWidth, t = c.offsetHeight, J(), K(b)
                        },
                        J = function() {
                            l = b.innerWidth || a.documentElement && a.documentElement.clientWidth, m = b.innerHeight || a.documentElement && a.documentElement.clientHeight, p = U(n)
                        },
                        K = function(a) {
                            var b = L();
                            if (b) {
                                d.orientation = b;
                                var c = M(b);
                                O(c), d.arrowClass = b.horizontal + "_" + b.vertical, R(a), j = (new Date).getTime() / 1e3
                            } else d.state = F.hidden
                        },
                        L = function() {
                            if (!isNaN(l) && !isNaN(m)) {
                                var a = new Array(8),
                                    b = p.x + q / 2,
                                    c = p.y + r / 2,
                                    d = l - (p.x + q),
                                    e = l - b,
                                    f = m - (p.y + r),
                                    g = m - c;
                                a[0] = {
                                    width: p.x,
                                    height: g
                                }, a[1] = {
                                    width: p.x,
                                    height: c
                                }, a[2] = {
                                    width: d,
                                    height: g
                                }, a[3] = {
                                    width: d,
                                    height: c
                                }, a[4] = {
                                    width: e,
                                    height: p.y
                                }, a[5] = {
                                    width: b,
                                    height: p.y
                                }, a[6] = {
                                    width: e,
                                    height: f
                                }, a[7] = {
                                    width: b,
                                    height: f
                                };
                                for (var h = -1, i = 0, j = 0; j < a.length; j++) {
                                    var k = a[j].width,
                                        n = a[j].height,
                                        o = k * n;
                                    if (o > i && k - C > s && n - C > t) {
                                        var u = M({
                                            horizontal: v[j][0],
                                            vertical: v[j][1]
                                        });
                                        u && !N(u, s, t, C) && (h = j, i = a[h].width * a[h].height)
                                    }
                                }
                                var w;
                                return -1 !== h && (w = {
                                    horizontal: v[h][0],
                                    vertical: v[h][1]
                                }), w
                            }
                        },
                        M = function(a) {
                            if (a) {
                                var b = {
                                    x: 0,
                                    y: 0
                                };
                                return a.vertical === g.ORIENTATION.VERTICAL.TOP ? b.y = p.y - t - B : a.vertical === g.ORIENTATION.VERTICAL.BOTTOM ? b.y = p.y + r + B : a.vertical === g.ORIENTATION.VERTICAL.TOPCORNER ? b.y = p.y + r / 2 - A : a.vertical === g.ORIENTATION.VERTICAL.BOTTOMCORNER && (b.y = p.y + r / 2 - t + A), a.horizontal === g.ORIENTATION.HORIZONTAL.LEFT ? b.x = p.x - q - B : a.horizontal === g.ORIENTATION.HORIZONTAL.RIGHT ? b.x = p.x + q + B : a.horizontal === g.ORIENTATION.HORIZONTAL.LEFTCORNER ? b.x = p.x + q / 2 - z : a.horizontal === g.ORIENTATION.HORIZONTAL.RIGHTCORNER && (b.x = p.x + q / 2 + z - s), {
                                    x: Math.round(b.x),
                                    y: Math.round(b.y)
                                }
                            }
                        },
                        N = function(a, b, c, d) {
                            var e = !1,
                                f = d || 0;
                            return a.x + b > l - f ? e = !0 : a.x < f ? e = !0 : a.y + c > m - f ? e = !0 : a.y < f && (e = !0), e
                        },
                        O = function(a) {
                            d.position && parseInt(d.position.left) === a.x && parseInt(d.position.top) === a.y || (d.position = {
                                left: a.x + "px",
                                top: a.y + "px"
                            })
                        },
                        P = function() {
                            if (o) {
                                J();
                                var a = M(d.orientation);
                                a && (O(a), (d.state === F.hidden || N(a, s, t, C)) && K())
                            }
                        },
                        Q = function(a) {
                            d.state = F.closing, c(function() {
                                d.tipContent = {}, d.state = F.hidden, a && a()
                            }, u)
                        },
                        R = function(a) {
                            c(function() {
                                d.state = F.visible, a && a()
                            }, 10)
                        },
                        S = function(a) {
                            Q(function() {
                                T(a)
                            })
                        },
                        T = function(a) {
                            _();
                            var b = a ? 0 : 1e3 * x;
                            c.cancel(i), i = c(function() {
                                var a = e.next();
                                if (a) {
                                    d.state = F.init, d.tipContent = {
                                        header: a.title,
                                        description: a.desc
                                    }, d.tipsPaginator = [];
                                    for (var b = e.getCount(), c = e.getCurrentIndex(), f = 0; b > f; f++) d.tipsPaginator.push({
                                        active: f === c
                                    });
                                    d.okButtonType = w.ok, b > 1 && (d.okButtonType = e.canGoNext() ? w.next : w.done), d.showDots = !1, o = a.domSelector;
                                    var g = a.positionCss;
                                    o ? W(function() {
                                        I(function() {
                                            d.state === F.visible && e.saveState()
                                        }), $()
                                    }) : g && (d.position = g, d.arrowClass = "noArrow", R(function() {
                                        e.saveState()
                                    }), $())
                                }
                            }, b)
                        };
                    d.state = F.hidden, d.onCloseButtonClick = function() {
                        var a = (new Date).getTime() / 1e3;
                        y > a - j && e.saveState(!0), _(), Q()
                    }, d.onNextButtonClick = function() {
                        S(!0)
                    };
                    var U = function(a) {
                            return {
                                x: a.getBoundingClientRect().left,
                                y: a.getBoundingClientRect().top
                            }
                        },
                        V = function(c) {
                            for (var d = !0; null != c && c !== a[0];) {
                                if (b.getComputedStyle(c) && "none" === b.getComputedStyle(c).display) {
                                    d = !1;
                                    break
                                }
                                c = c.parentNode
                            }
                            return d
                        },
                        W = function(b) {
                            a[0].querySelector(o) && V(a[0].querySelector(o)) && h[0].querySelector(".tip") ? b() : c(function() {
                                W(b)
                            }, H)
                        },
                        X = function(a) {
                            var b = 27,
                                c = a.keyCode || a.which;
                            c === b && d.$apply(function() {
                                S()
                            })
                        },
                        Y = function() {
                            c.cancel(k), k = c(P, 50)
                        },
                        Z = function() {
                            for (var a = 0; 4 >= a; a++) c.cancel(D[a]), D[a] = c(P, G * a)
                        },
                        $ = function() {
                            angular.element(b).on("resize", Y), angular.element(b).on("orientationchange", Y), a.on("click", aa), a.on("keydown", X);
                            for (var c = 0; c < E.length; c++) {
                                var d = a[0].querySelector(E[c]);
                                d && angular.element(d).on("scroll", Z)
                            }
                        },
                        _ = function() {
                            angular.element(b).off("resize", Y), angular.element(b).off("orientationchange", Y), a.off("click", aa), a.off("keydown", X);
                            for (var c = 0; c < E.length; c++) {
                                var d = a[0].querySelector(E[c]);
                                d && angular.element(d).off("scroll", Z)
                            }
                        },
                        aa = function(a) {
                            if (d.state !== F.hidden) {
                                var b = a.target;
                                do {
                                    if (b === h[0]) return void a.preventDefault();
                                    b = b.parentNode
                                } while (b);
                                S()
                            }
                        },
                        ba = function(a, b, c) {
                            (b && !c && b.loadedTemplateUrl || b && c && b.loadedTemplateUrl !== c.loadedTemplateUrl) && S(!0)
                        },
                        ca = function() {
                            T(!0)
                        };
                    d.$on("$destroy", _), d.$on("$routeChangeSuccess", ba), d.$on("tipsConfigLoaded", ca)
                }
            }
        }
    }]), angular.module("hereApp.directive").directive("hereTouch", ["hereBrowser", "$rootScope", function(a, b) {
        return {
            link: function(c, d) {
                d.addClass(a.mouse ? "here_no_touch" : "here_touch"), d.addClass(a.isIE ? "here_IE" : "here_no_IE"), (a.isAndroid || a.isiOS) && d.addClass("here_disable_collapse_header"), a.mouse || b.$on("mouseDetected", function() {
                    d.removeClass("here_touch here_no_touch"), d.addClass(a.mouse ? "here_no_touch" : "here_touch")
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("trackAnchorClicks", ["$timeout", "TrackingService", function(a, b) {
        return {
            restrict: "A",
            scope: {
                linkName: "@trackAnchorClicks"
            },
            link: function(a, c) {
                var d = function() {
                    angular.element(c[0]).on("click", function(c) {
                        "a" === c.target.tagName.toLowerCase() && b.click(a.linkName)
                    })
                };
                d()
            }
        }
    }]), angular.module("hereApp.directive").directive("weatherIcon", ["$templateCache", "$window", "WeatherIconsMatcherService", function(a, b, c) {
        return {
            replace: !1,
            scope: {
                iconName: "@iconName",
                daylight: "@daylight"
            },
            link: function(d, e) {
                d.$watch("[iconName, daylight]", function(d) {
                    if (d[0]) {
                        var f = a.get("/directives/weather/icons/icon-l-weather-" + c.getIconName(d[0], d[1]) + ".svg");
                        e[0].style.backgroundImage = "url(data:image/svg+xml;base64," + b.btoa(f) + ")"
                    }
                }, !0)
            }
        }   
    }]), angular.module("hereApp.collections").controller("CollectionDetailCtrl", ["$scope", "$routeParams", "$location", "$timeout", "CollectionsService", "COLLECTION_NAME_SIZE", "mapContainers", "markerService", "collectionsHelper", "PBAPI", "PreloadImage", "ensureHTTPSFilter", "RedirectService", "herePageTitle", "hereBrowser", "Features", "TrackingService", "panelsService", "User", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
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
    }]), angular.module("hereApp.collections").controller("CollectionsOverviewCtrl", ["$rootScope", "$scope", "$location", "CollectionsService", "collectionsHelper", "PreloadImage", "ensureHTTPSFilter", "herePageTitle", "mapContainers", "markerIcons", "markerService", "utilityService", "mapsjs", "Features", "TrackingService", "RedirectService", "panelsService", "User", "HereAccountService", "splitTesting", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
        var u, v = !1,
            w = i.favorites,
            x = function() {
                i.clearContainer(w), i.showOnly(i.favorites)
            },
            y = !1;
        h.set(), b.landingPage = "old" !== n.collections.landingPage, b.images = {}, b.collections = [], b.emptyCollections = !0, b.state = {
            editMode: !1,
            confirmDelete: null
        };
        var z = function() {
                y || (b.$watch("collections.length", function() {
                    b.state.loaded = !1, b.state.loading = !0, C()
                }), b.$on("userLoggedIn", D), b.$on("$destroy", x), y = !0)
            },
            A = function() {
                var a = l.convertQueryFormatToMapInfo(c.search().map);
                u.getViewModel().setCameraData({
                    position: new m.geo.Point(a.latitude, a.longitude),
                    zoom: a.zoomLevel,
                    animate: !0
                })
            },
            B = function() {
                b.state.loaded = !1, b.state.loading = !0
            },
            C = function() {
                var a = !b.unsortedVirtualCollection || 0 === b.unsortedVirtualCollection.length;
                b.emptyCollections = a && (!b.collections || 0 === b.collections.length), b.state.editMode = b.state.editMode && !b.emptyCollections, b.state.loading = !1, b.state.loaded = !0, b.state.confirmDelete = null, b.state.deleteProgress = null
            },
            D = function() {
                return t.start("collectionsLanding"), B(), b.isLoggedIn = r.isLoggedIn(), r.isLoggedIn() ? void d.getAllCollections().then(function() {
                    x(), b.collections = d.readonlyCollections, b.collections.forEach(function(a) {
                        if (a.landscapeImageUrl) {
                            var c = {
                                src: g(a.landscapeImageUrl)
                            };
                            f.single(c.src).then(function() {
                                c.loaded = !0
                            }), b.images[a.id] = c
                        }
                    }), d.getVirtualCollection().then(function(a) {
                        a && (b.unsortedVirtualCollection = a, b.emptyCollections = !1)
                    })["finally"](function() {
                        v = !0
                    }), n.collections.overviewFavoritesMarker && d.getAllFavorites().then(function(a) {
                        var b = [];
                        a && a.length && (a.forEach(function(a) {
                            var c = e.createFavoriteMarker(a);
                            c && b.push(c)
                        }), b.length && w.addObjects(b))
                    }), C(), z()
                }, function() {
                    C(), z()
                }) : (C(), z(), void(b.landingPage ? t.start("collectionsLandingButton") : s.openSignIn()))
            };
        b.getImageStyles = function(a) {
            var c = {};
            return b.images[a.id] && (c = {
                "background-image": "url(" + b.images[a.id].src + ")"
            }, b.images[a.id].loaded && (c.opacity = 1)), c
        }, b.toggleEditMode = function() {
            b.state.editMode || (q.isMinimized && (q.isMinimized = !1), o.click("collections:EditCollectionsCard:click")), b.state.confirmDelete = null, b.state.editMode = !b.state.editMode
        }, b.confirmDelete = function(a) {
            o.click("collections:RemoveCollection:click"), b.state.confirmDelete = a
        }, b.deleteCollection = function(a) {
            b.state.deleteProgress = a, d.removeCollection(a.id)["finally"](function() {
                o.track("collections", "collection removed", "", null)
            })
        }, b.createCollection = function() {
            o.click("collections:CreateCollection:click"), b.$emit("modalDialog", {
                templateUrl: "features/collections/create.html",
                replace: !0,
                onExit: function() {
                    b.modals.pop()
                }
            })
        }, b.showDetails = function(a) {
            p.goToCollection(a.id, "collections")
        }, b.signIn = function() {
            t.conversion("collectionsLandingButton"), o.track("account", "signin attempt", "", null), s.openSignIn()
        }, b.whenMapIsReady.then(function(a) {
            u = a, D(), A(), i.showOnly(w)
        },b.downloadBackup = function(){
            console.dir(w);
            
        })
    }]), angular.module("hereApp.collections").controller("CoverCtrl", ["$scope", "orderByFilter", "CollectionsService", "PBAPI", "PreloadImage", "ensureHTTPSFilter", "TrackingService", function(a, b, c, d, e, f, g) {
        var h, i = ["w300", "w700"],
            j = 8;
        a.galleries = [], a.limitImages = j, a.collection = a.modals[0].context, c.getFavorites(a.collection.id).then(function(c) {
            c = b(c, "-createdTime"), angular.forEach(c, function(b) {
                b.placesId && d.images({
                    id: b.placesId,
                    image_dimensions: i.join(",")
                }).then(function(c) {
                    if (c && c.data && c.data.available) {
                        var d = {
                            name: b.name,
                            items: [],
                            limit: j
                        };
                        a.galleries.push(d), angular.forEach(c.data.items, function(b, c) {
                            var g = f(b.dimensions[i[0]]),
                                h = {
                                    src: g,
                                    org: b.dimensions[i[1]]
                                };
                            d.items.push(h), b.dimensions[i[1]] === a.collection.landscapeImageUrl && (a.selectedImage = h),
                                j >= c && e.single(g).then(function() {
                                    h.loaded = !0
                                })
                        })
                    }
                })
            })
        }), a.selectCover = function(b) {
            a.selectedImage = a.selectedImage !== b ? b : "", a.coverError = !1
        }, a.updateCover = function() {
            if (a.coverError = !1, !a.collection.landscapeImageUrl && !a.selectedImage || a.selectedImage && a.collection.landscapeImageUrl === a.selectedImage.org) return void a.modals[0].onExit();
            var b = angular.extend(a.collection, {
                landscapeImageUrl: a.selectedImage ? a.selectedImage.org : ""
            });
            h || (h = !0, c.updateCollection(b).then(function(b) {
                a.modals[0].context = b, a.modals[0].onExit(), g.track("collections", "collection cover image changed", "", null)
            }, function() {
                a.coverError = !0
            })["finally"](function() {
                h = !1
            }))
        }, a.toggleAll = function(a) {
            if (a.limit === j) {
                var b = a.items.slice(j);
                angular.forEach(b, function(a) {
                    e.single(a.src).then(function() {
                        a.loaded = !0
                    })
                }), a.limit = a.items.length
            } else a.limit = j
        }
    }]), angular.module("hereApp.collections").value("COLLECTION_NAME_SIZE", 46).controller("CreateCollectionCtrl", ["$scope", "CollectionsService", "manageFavoriteService", "COLLECTION_NAME_SIZE", "TrackingService", function(a, b, c, d, e) {
        var f, g = c.stateNames,
            h = function() {
                f = a.modals[0].onExit
            };
        a.COLLECTION_NAME_PLACEHOLDER = "e.g. \'My neighbourhood\'", a.COLLECTION_NAME_SIZE = d, a.errors = {
            backend: {}
        }, a.createCollection = function() {
            a.buttonBusy = !0;
            var d = b.addCollection(a.collection.title);
            d.then(function(b) {
                e.track("collections", "collection created", "", "event18"), c.addCollection(b.id), a.onExit(), a.buttonBusy = !1
            }, function() {
                a.errors.backend.unSpecified = !0, a.buttonBusy = !1
            })
        }, a.onExit = function() {
            f()
        }, a.$on("$destroy", function() {
            c.setState(g.CLOSE)
        }), h()
    }]), angular.module("hereApp.collections").controller("ManageFavoriteCtrl", ["$scope", "$window", "$rootScope", "Features", "CollectionsService", "manageFavoriteService", "mapContainers", "TrackingService", "collectionsHelper", "markerService", "CollectionsAlwaysVisibleService", function(a, b, c, d, e, f, g, h, i, j, k) {
        function l() {
            a.showTitle = !0, a.getState = f.getState, e.getVirtualCollection().then(function(b) {
                a.unsortedVirtualCollection = b
            }), e.getAllCollections().then(function(b) {
                m = a.modals[0].context;
                var c = e.getFavoriteRef(m);
                c.then(function(c) {
                    var d = f.getSelectedCollections();
                    if (c)
                        if (f.setState(0 === b.length ? o.EMPTY : o.MANAGE), n = angular.copy(c), n.collectionId || (n.collectionId = [], a.isUnsortedItem = !0), a.selectedCollections = angular.copy(n.collectionId), 0 === a.selectedCollections.length && (a.selectedCollections = ["unsorted"], f.setState(o.MANAGE)), !angular.equals(d, a.selectedCollections) && d.length > 0) {
                            var e = a.selectedCollections.indexOf("unsorted");
                            a.selectedCollections = d, -1 !== e && p(e)
                        } else f.setSelectedCollections(a.selectedCollections);
                    else f.setState(0 === b.length ? o.EMPTY : o.SAVE), a.selectedCollections = d;
                    a.showTitle = !1
                })
            }), a.collections = e.readonlyCollections
        }
        var m, n = null,
            o = f.stateNames,
            p = function(b) {
                a.selectedCollections.splice(b, 1);
                var c = f.getSelectedCollections().indexOf("unsorted"); - 1 !== c && f.removeCollection(c)
            },
            q = "collectionsModalClosed",
            r = function() {
                k.showAllFavorites(), c.$broadcast(q)
            };
        a.toggleCollection = function(b) {
            var c = a.selectedCollections.indexOf(b);
            if ("unsorted" === b) {
                if (a.getState() !== o.MANAGE) return;
                if (n && n.collectionId.length) return
            }
            if (n && !n.collectionId.length) {
                var d = a.selectedCollections.indexOf("unsorted"); - 1 !== d ? "unsorted" !== b && p(d) : "unsorted" === b && (a.selectedCollections = ["unsorted"], f.resetCollectionIds())
            } - 1 !== c ? f.removeCollection(c) : f.addCollection(b), a.errors.frontend.deleteWarning = 0 === a.selectedCollections.length && a.getState() === o.MANAGE ? !0 : !1, a.selectedCollections = f.getSelectedCollections()
        }, a.errors = {
            backend: {},
            frontend: {
                deleteWarning: !1
            }
        }, a.addFavoriteStarMarker = function(a) {
            var b = i.createSmallFavoriteMarker(a);
            g.favoritesSmall.addObject(b);
            var c = j.getWrapped(b);
            c.addFlag()
        }, a.addFavorite = function() {
            var b = {
                name: m.name,
                location: m.location,
                placesId: m.placeId,
                type: "favoritePlace"
            };
            m.mainCategory ? b.categories = [{
                categoryId: m.mainCategory
            }] : m.categories && m.categories.length > 0 && (b.categories = [{
                categoryId: m.categories[0].id,
                name: m.categories[0].title
            }]), e.addFavorite(b, a.selectedCollections).then(function(b) {
                a.addedPlace = b, a.closeDialog(), a.buttonBusy = !1, r(), h.track("collections", "place added to collection", {
                    eVar15: a.selectedCollections.length,
                    prop15: a.selectedCollections.length
                }, "event19")
            }, function() {
                a.errors.backend.unSpecified = !0, a.buttonBusy = !1
            })
        }, a.updateFavorite = function() {
            -1 !== a.selectedCollections.indexOf("unsorted") && a.selectedCollections.splice(a.selectedCollections.indexOf("unsorted"), 1), angular.equals(a.selectedCollections, n.collectionId) ? a.closeDialog() : e.updateFavorite(n, a.selectedCollections).then(function(b) {
                a.updatedPlace = b, a.closeDialog(), a.buttonBusy = !1, r(), h.track("collections", "place moved to other or extra collection", "", null)
            }, function() {
                a.errors.backend.unSpecified = !0, a.buttonBusy = !1
            })
        }, a.removeFavorite = function() {
            n.deleted = !0, e.removeFavorite(n, a.selectedCollections).then(function(b) {
                a.deletedPlace = b, a.closeDialog(), a.buttonBusy = !1, r(), h.track("collections", "place removed from collection", "", null)
            }, function() {
                a.errors.backend.unSpecified = !0, a.buttonBusy = !1
            })
        }, a.goToNewCollection = function() {
            h.click("collections:CreateCollection:click"), f.setState(o.CREATE);
            var a = function() {
                f.setState(o.CREATE), c.$broadcast("modalDialog", {
                    templateUrl: "features/collections/manage.html",
                    replace: !0,
                    context: m
                })
            };
            c.$broadcast("modalDialog", {
                templateUrl: "features/collections/create.html",
                replace: !0,
                onExit: a
            })
        }, a.mainCallToAction = function() {
            switch (a.buttonBusy = !0, a.getState()) {
                case o.MANAGE:
                    0 === a.selectedCollections.length ? a.removeFavorite() : a.updateFavorite();
                    break;
                case o.SAVE:
                    a.addFavorite();
                    break;
                default:
                    return
            }
        }, a.$on("$destroy", function() {
            f.setState(o.CLOSE)
        }), a.getAvailableHeight = function() {
            return b.innerHeight
        }, l()
    }]), angular.module("hereApp.directive").directive("collectionCard", function() {
        return {
            templateUrl: "features/collections/collection-card.html",
            replace: !0,
            scope: {
                options: "=collectionCard"
            }
        }
    }), angular.module("hereApp.collections").factory("collectionsHelper", ["utilityService", "ItineraryItem", "categories", "markerService", "markerIcons", "directionsUrlHelper", "$location", "Features", "RedirectService", "placeService", function(a, b, c, d, e, f, g, h, i, j) {
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
                    title: a.favorite.name,
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
    }]), angular.module("hereApp.collections").config(["$httpProvider", function(a) {
        a.interceptors.push(["$q", "$rootScope", "$injector", "Features", function(a, b, c) {
            return {
                responseError: function(d) {
                    if (d && 401 === d.status && d.config && -1 !== d.config.url.indexOf("/api/collections/")) {
                        b.$broadcast("logOutUser");
                        var e = c.get("HereAccountService");
                        e.openSignIn()
                    }
                    return a.reject(d)
                }
            }
        }])
    }]), angular.module("hereApp.service").factory("manageFavoriteService", function() {
        var a = {
                CLOSE: "close",
                CREATE: "create",
                EMPTY: "empty",
                MANAGE: "manage",
                SAVE: "save"
            },
            b = [],
            c = function(a) {
                b.push(a)
            },
            d = function(a) {
                b.splice(a, 1)
            },
            e = function() {
                return b
            },
            f = function(a) {
                b = a
            },
            g = function() {
                b = []
            },
            h = {
                close: function(a) {
                    "create" === a ? i = a : g()
                },
                create: function() {},
                empty: function() {},
                manage: function() {},
                save: function() {}
            },
            i = null,
            j = function(a) {
                a in h ? (h[a](i), i = a) : i = null
            },
            k = function() {
                return i
            };
        return {
            addCollection: c,
            getSelectedCollections: e,
            getState: k,
            removeCollection: d,
            resetCollectionIds: g,
            setSelectedCollections: f,
            setState: j,
            stateNames: a
        }
    }), angular.module("hereApp.cookieNotice").service("cookieNotice", ["$rootScope", "$timeout", "ipCookie", "Config", "Features", function(a, b, c, d, e) {
        this.shown = !1, this.initialize = function() {
            var a = c(d.cookieNotice.cookieName);
            return this.shown = !a && !e.mocks, this
        }, this.onClose = function() {
            var e, f = d.cookieNotice;
            a.whenMapIsReady.then(function(a) {
                e = a
            }), b(function() {
                e.getViewPort().resize()
            }), c(f.cookieName, !0, {
                expires: f.cookieExpiryInDays,
                path: f.cookiePath,
                domain: f.cookieDomain
            })
        }
    }]), angular.module("hereApp.directions").controller("DirectionsCtrl", ["$window", "$document", "$rootScope", "$scope", "$timeout", "$q", "$location", "$routeParams", "userInputTimeFilter", "mapsjs", "routing", "PBAPI", "geoCoder", "routesParser", "recentRouteStorage", "directionsUrlHelper", "Features", "User", "herePageTitle", "ItineraryItem", "directionsMapHelperFactory", "geolocation", "RecentsService", "TrackingService", "readableTimeSpanFilter", "weather", "routeOptions", "Config", "hereBrowser", "panelsService", "unitsStorage", "temperatureFilter", "routeTrafficIncidents", "LocationService", "routingUtilsFactory", "utilityService", "splitTesting", "skyScannerService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L) {
        var M, N, O, P, Q, R, S, T, U, V = "-2",
            W = this,
            X = "From",
            Y = "To",
            Z = "via";
        d.itineraryOverhaulFeature = q.directions.itineraryOverhaul, d.flightsEnabled = q.directions.flights, d.showPrint = q.directions.print, d.featureCommute = q.directions.commute, d.featureC2AOverhaul = q.directions.C2AOverhaul, W.initialize = function() {
            if (M = u.create(this, d), N = I.create(this, d, M), W.getNumberOfCompletedItineraryItems = N.getNumberOfCompletedItineraryItems, U = new Date, d.MAX_ITINERARY_ITEMS = B.directions && B.directions.maxItineraryItems && q.directions.itineraryOverhaul ? B.directions.maxItineraryItems : 5, d.MAX_RECENTS_PER_ITINIRARY = 5, d.hoverRouteAlternative = M.hoverRouteAlternative, d.leaveRouteAlternative = M.leaveRouteAlternative, d.canSendRoutingRequest = !1, d.currentRouteIndex = -1, d.currentRoute = null, d.flights = null, d.requestPending = !1, d.routeError = "", d.trafficRoute = null, d.selectedFlight = null, d.showSelectedFlight = !1, d.locationInRoute = !1, d.availableRoutes = [], d.availableRoutesTrafficIncidents = [], d.itineraryOverhaulFeature || (d.recents = [], d.itineraryOverhaul = q.directions.itineraryOverhaul, d.itineraryItemFocused = !1), d.conf = {}, d.timeSelector = "", d.isImperialUKUS = q.imperialUSUK, d.incidentsAmongManeuvers = q.directions.incidentsAmongManeuvers, D.isMinimized = !0, d.transportModes = [{
                    type: "car",
                    label: "Drive",
                    active: !0,
                    alternatives: 2,
                    icon: "/features/directions/img/modes/car.svg",
                    defaultMapType: "TRAFFIC",
                    routeMapType: "NORMAL"
                }, {
                    type: "publicTransportTimeTable",
                    label: "Public transport",
                    active: !1,
                    alternatives: 2,
                    icon: "/features/directions/img/modes/pt.svg",
                    defaultMapType: "PUBLIC_TRANSPORT",
                    routeMapType: "GREY"
                }, {
                    type: "pedestrian",
                    label: "Walk",
                    active: !1,
                    alternatives: 1,
                    icon: "/features/directions/img/modes/pedestrian.svg",
                    defaultMapType: "PEDESTRIAN",
                    routeMapType: "PEDESTRIAN"
                }], q.directions.flights) {
                d.transportModes[d.transportModes.length] = {
                    type: "flight",
                    label: "Flights",
                    active: !1,
                    alternatives: 0,
                    icon: "/features/directions/img/modes/plane.svg",
                    defaultMapType: "NORMAL",
                    routeMapType: "NORMAL"
                };
                var b = new Date,
                    e = new Date;
                b.setDate(b.getDate() + 2), e.setDate(b.getDate() + 3), d.flightSettings = {
                    startDate: b,
                    endDate: e
                }
            }
            d.timeSelectors = [{
                value: "departNow",
                label: "Leave now"
            }, {
                value: "departAt",
                label: "Leave at"
            }, {
                value: "arriveBy",
                label: "Arrive by"
            }], d.isOptionsExpanded = !1, d.isTimeDateExpanded = !1, d.featureCommute && (d.isCommuteExpanded = !1), d.disclaimer = {
                text: "",
                show: !1
            }, g.search().arrive ? (d.timeSelector = "arriveBy", d.routeDate = new Date(parseInt(g.search().arrive, 10))) : g.search().leave ? (d.timeSelector = "departAt", d.routeDate = new Date(parseInt(g.search().leave, 10))) : (d.timeSelector = "departNow", d.routeDate = new Date), d.routeOptions = A.getRouteOptions(), d.itineraryItems = [new t(X), new t(Y)], d.locationSharingNotAllowed = "Please allow your location to be shared.", d.couldNotNotFind = "Couldn\'t find your location.", d.isWindows = C.isWindows, c.whenMapIsReady.then(function(a) {
                O = a, d.mapZoomLevel = O.getZoom(), W.initializeWithRouteParams(W.normaliseRouteParams(h)), q.directions.recentRoutes && W.initializeRecentRoutes(h), d.featureCommute && W.initializeRecentCommutes(), O.addEventListener("mapviewchangeend", N.refreshRouteOnZoomChange), O.getViewPort().addEventListener("update", W.updateOnPaddingGrowth);
                var b = d.itineraryItems[0];
                b.id || b.query || b.title || b.coordinate || !h.routeSplat || W.reverseGeoCodeCurrentLocation(function(a) {
                    N.setItineraryItem(0, {
                        model: a.data
                    })
                })
            }), d.$watch("itineraryItems", W.performRoutingCheck), d.$watch("itineraryItems", W.syncGeolocationPending, !0), d.$watch("itineraryItems", W.updateUrl, !0), d.$watch("transportModes", W.updateUrl, !0), d.$watch("currentRoute", W.syncOperators), d.$watch("currentRoute", W.showRoute), d.$watch("weather", W.syncWeatherString), d.$watch("temperatureUnit", W.syncWeatherString), d.$watch("timeSelector", function() {
                "departNow" === d.timeSelector && (d.routeDate = new Date, d.routeDateTime = new Date)
            }), d.isImperialUKUS ? d.$watch("distanceSystemUnit", function() {
                W.performRoutingCheck(), d.routeScaleSystemUnit = E.getUnits().distanceSystemUnit, d.conf.routeUnits = d.routeScaleSystemUnit
            }) : d.$watch("distanceUnit", function() {
                W.performRoutingCheck(), d.routeScale = E.getUnits().distance, d.conf.routeUnits = d.routeScale
            }), R = c.$on("$routeChangeSuccess", function(a, b) {
                g.path().indexOf("/directions") > -1 && (b.params.mode || b.params.routeSplat || b.params.placeId) && W.initializeWithRouteParams(W.normaliseRouteParams(b.params))
            }), d.$on("$destroy", W.onDestroy), a.addEventListener("beforeunload", function() {
                d.printRouteWindow && d.printRouteWindow.close()
            }), K.start("itineraryImprovements"), s.set()
        }, W.updateOnPaddingGrowth = function() {
            D.isMinimized || M.ensureRouteIsVisibleOnMap(d.currentRoute)
        }, W.onDestroy = function() {
            R(), c.desiredMapType = "NORMAL", M.clearMapObjects(), O.getViewPort().removeEventListener("update", W.updateOnPaddingGrowth), O.removeEventListener("mapviewchangeend", N.refreshRouteOnZoomChange), d.printRouteWindow && d.printRouteWindow.close()
        }, W.removeItinerary = function(a) {
            a.reset(), M.removeMarkerAt(d.itineraryItems.indexOf(a)), d.routeError = null
        }, W.initializeRecentRoutes = function(a) {
            if (!(d.currentRoute || a.routeSplat || a.placeId && r.getGeoLocation())) {
                d.gettingRecentRoutes = !0;
                var b = o.retrieveRoutesFromStorage("recentRoutes");
                b.reverse(), d.recentRoutes = b.map(function(a) {
                    return {
                        summary: {
                            baseTime: 0,
                            distance: 0
                        },
                        storedRoute: a,
                        dummy: !1
                    }
                }), d.gettingRecentRoutes = !1
            }
        }, W.initializeRecentCommutes = function() {
            if (!d.currentRoute) {
                d.gettingRecentRoutes = !0;
                var a = o.retrieveRoutesFromStorage("recentCommutes");
                a.reverse(), d.recentCommutes = a.map(function(a) {
                    return a.icon = W.getTransportModeByType(a.mode[0], d.transportModes).icon, {
                        summary: {
                            baseTime: 0,
                            distance: 0
                        },
                        storedRoute: a,
                        dummy: !1
                    }
                }), d.gettingRecentRoutes = !1
            }
        }, W.initializeWithRouteParams = function(a) {
            var b, c, e = !0;
            a.mode && (b = p.urlComponentToModeMap[a.mode], c = d.getActiveTransportModes()[0].type, d.currentRoute && b !== c && (e = !1)), e && (a.placeId ? W.initializeWithPlace(a.placeId) : a.address ? W.initializeWithAddress(a.address) : a.routeSplat && W.initializeWithSplat(a.routeSplat)), a.mode && (W.getTransportModeByType(b, d.transportModes).active || (W.setTransportMode(W.getTransportModeByType(b, d.transportModes)), e || W.performRoutingCheck()))
        }, W.reverseGeoCodeCurrentLocation = function(a) {
            var b = r.getGeoLocation();
            b && m.reverseGeoCode({
                location: b
            }).then(a)
        }, W.initializeWithPlace = function(a) {
            l.place({
                id: a
            }).then(function(a) {
                var b = a.data;
                W.reverseGeoCodeCurrentLocation(function(a) {
                    N.setItineraryItem(0, {
                        model: a.data
                    })
                }), N.setItineraryItem(1, {
                    placeModel: b
                })
            })
        }, W.initializeWithAddress = function(a) {
            l.search({
                size: 1,
                q: a,
                center: O.getCenter(),
                viewBounds: O.getViewBounds()
            }).then(function(a) {
                W.reverseGeoCodeCurrentLocation(function(a) {
                    N.setItineraryItem(0, {
                        model: a.data
                    })
                }), N.setItineraryItem(1, {
                    placeModel: a.data.items[0]
                })
            })
        }, W.getTransportModeByType = function(a, b) {
            return b.filter(function(b) {
                return b.type === a
            })[0]
        }, W.initializeWithSplat = function(a) {
            var b = p.parseRouteSplat(a);
            N.processGivenItineraryItems(b.itineraryItems)
        }, W.performRoutingCheck = function() {
            var a = N.getNumberOfCompletedItineraryItems(),
                b = a === d.itineraryItems.length;
            b ? W.sendRoutingRequest() : W.clearRoutes(), W.updateUrl(), W.updateMapType(b)
        }, W.updateMapType = function(a) {
            var b, e = d.getActiveTransportModes()[0];
            b = d.requestPending || a && d.availableRoutes.length > 0, c.desiredMapType = b ? e.routeMapType : e.defaultMapType
        }, W.updatePTDisclaimer = function(a) {
            var b = new Date;
            "departNow" !== d.timeSelector && d.routeDate - b >= 6048e5 ? (d.disclaimer.show = !0, d.disclaimer.text = "Transport schedules are only available a week in advance. For more exact travel times, please check your route again a week before your journey.", D.isMinimized = !1) : "departNow" !== d.timeSelector && "publicTransportTimeTable" !== a[0].mode.transportModes[0] && (d.disclaimer.show = !0, d.disclaimer.text = "Schedules aren\'t available for this route. Arrival times may vary.", D.isMinimized = !1)
        }, W.putFocusOnTransportModeButton = function() {
            b[0].querySelector(".panel .transport_modes a.active").focus()
        }, d.itineraryOverhaulFeature ? (d.removeItinerary = function(a) {
            W.removeItinerary(a)
        }, d.setMyLocation = function(a) {
            var b = f.defer(),
                c = r.getGeoLocation();
            return c ? m.reverseGeoCode({
                location: c
            }).then(function(c) {
                N.setItineraryItem(a, {
                    model: c.data
                }), b.resolve()
            }) : v.position({
                doNotCenterOnLocation: !0
            }).then(function(c) {
                W.onRetrieveLocation(c, a), b.resolve()
            }, function(c) {
                W.onLocationRetrieveFailure(c, a), b.reject()
            }), b.promise
        }, d.scrollPanelToTop = function() {
            J.scrollContainerToTop()
        }, W.onRetrieveLocation = function(a, b) {
            r.setGeoLocation(a.coords);
            var c = d.itineraryItems[b];
            c.getCoordinate() || W.reverseGeoCodeCurrentLocation(function(a) {
                N.setItineraryItem(b, {
                    model: a.data
                })
            })
        }) : (d.resetAndShowItems = function(a, b) {
            d.locationInRoute && a.isMyLocation && (d.locationInRoute = !1), W.removeItinerary(a), d.showItems(a, b)
        }, d.showItems = function(a, b) {
            N.showItems(a, b)
        }, W.putFocusOnNextElement = function(a) {
            var c, f = d.canSendRoutingRequest;
            a = a || {}, f ? W.putFocusOnTransportModeButton() : (c = d.itineraryItems[d.itineraryItemIndex + 1], c ? e(function() {
                b[0].querySelector("#itinerary_item_input_" + (d.itineraryItemIndex + 1)).focus()
            }) : a.avoidPreviousFields || d.itineraryItems.some(function(a) {
                return a.getCoordinate() ? void 0 : (a.focussed = !0, !0)
            }))
        }, d.selectSearchElement = function(a, b) {
            N.selectSearchElement(a, b)
        }, d.selectFromSearchList = function() {
            N.selectFromSearchList()
        }, d.blurItineraryItem = function(a, b) {
            N.blurItineraryItem(a, b)
        }, d.navigateSearchList = function(a) {
            if (27 === a.which) N.clearSearchLists();
            else if (9 === a.which) N.selectFromSearchList();
            else if (38 === a.which) a.preventDefault(), d.hoveredResultIndex = Math.max(-d.recentSearchResults.length, (d.hoveredResultIndex || 0) - 1);
            else if (40 === a.which) {
                a.preventDefault();
                var b, c = 0;
                b = null === d.hoveredResultIndex ? -d.recentSearchResults.length || 0 : d.hoveredResultIndex + 1, d.results && d.results.items && d.results.items.length > 0 ? c = d.results.items.length - 1 : d.recentSearchResults && (c = -1), d.hoveredResultIndex = Math.min(c, b)
            }
        }, d.hoverSearchElement = function(a) {
            d.hoveredResultIndex = a
        }, d.leaveSearchElement = function() {
            d.hoveredResultIndex = null
        }, d.setMyLocation = function() {
            var a = d.itineraryItemIndex,
                b = d.itineraryItems[a];
            a >= 0 && W.removeItinerary(b), b && (b.isMyLocation = !0, b.query = "Finding your location…"), r.getGeoLocation() ? (W.reverseGeoCodeCurrentLocation(function(b) {
                N.setItineraryItem(a, {
                    model: b.data
                })
            }), N.clearSearchLists(), W.putFocusOnNextElement(), d.locationInRoute = !0) : (S || (x.track("position", "my position in directions panel"), S = !0), v.position({
                doNotCenterOnLocation: !0
            }).then(function(b) {
                W.onRetrieveLocation(b, a)
            }, function(b) {
                W.onLocationRetrieveFailure(b, a)
            }))
        }, W.onRetrieveLocation = function(a, b) {
            r.setGeoLocation(a.coords);
            var c = d.itineraryItems[b];
            c.getCoordinate() || (W.reverseGeoCodeCurrentLocation(function(a) {
                N.setItineraryItem(b, {
                    model: a.data
                })
            }), N.clearSearchLists(), W.putFocusOnNextElement(), d.locationInRoute = !0)
        }), d.setItineraryItem = function(a, b) {
            N.setItineraryItem(a, b)
        }, d.trackDiscoverOpen = function() {
            x.track("discover", "User opened Discover panel", {
                prop32: "discover opened",
                eVar32: "discover opened",
                prop45: "HERE logo",
                eVar45: "HERE logo"
            }, "event16")
        }, d.goBack = function() {
            H.goBack(!0)
        }, W.onLocationRetrieveFailure = function(a, b) {
            var c = d.itineraryItems[b];
            c.getCoordinate() || (c.locationError = !0, c.query = "", 1 === a.code ? d.routeError = "geoLocationNotGranted" : c.query = d.couldNotNotFind)
        }, W.sendTrafficRoutingRequest = function(a) {
            return Q && Q.abort(), Q = k.route({
                waypoints: a,
                alternatives: 0,
                mode: {
                    type: "fastest",
                    transportModes: W.getActiveTransportModeTypes(),
                    trafficMode: "enabled",
                    routeOptions: W.getRouteOptionsToAvoid()
                },
                departureDate: "arriveBy" !== d.timeSelector ? d.routeDate : null,
                arrivalDate: "arriveBy" === d.timeSelector ? d.routeDate : null,
                requestLinkAttributes: k.getRoughDistance(a) < 8e4,
                avoidTransportTypes: W.getPTOptionsToAvoid()
            })
        }, W.setDepartNowAndShowDisclaimer = function(a) {
            d.timeSelector = "departNow", d.routeDate = new Date, d.routeDateTime = new Date, d.disclaimer.show = !0, d.disclaimer.text = a, D.isMinimized = !1, H.removeSingleUrlParam("arrive")
        }, W.sendRoutingRequest = function() {
            d.currentRouteIndex = null, d.requestPending = !0, d.availableRoutes = [], d.availableRoutesTrafficIncidents = [], d.routeError = "";
            var a, b = d.itineraryItems.map(function(a) {
                return a.asWaypoint(W.getActiveTransportModeTypes()[0])
            });
            q.directions.flights && W.clearRoutes(), q.directions.flights && "flight" === W.getActiveTransportModeTypes()[0] ? P = L.browseQuotes(d.itineraryItems.slice(0), d.flightSettings) : (W.syncCurrentRoute(), "pedestrian" === d.getActiveTransportModes()[0].type && (d.weather = null, W.getWeatherForRoute()), "arriveBy" === d.timeSelector && "publicTransportTimeTable" !== d.getActiveTransportModes()[0].type ? W.setDepartNowAndShowDisclaimer("\'Arrive by\' times are available only for public transport routes. We found you a route that\'s leaving now.") : "arriveBy" === d.timeSelector && "publicTransportTimeTable" === d.getActiveTransportModes()[0].type && d.itineraryItems.length > 2 ? W.setDepartNowAndShowDisclaimer("\'Arrive by\' times are available only for public transport routes without waypoints, so we\'re showing you a route that\'s leaving now.") : d.disclaimer.show = !1, P && P.abort(), P = k.route({
                waypoints: b,
                alternatives: d.getActiveTransportModes()[0].alternatives,
                mode: {
                    type: "fastest",
                    transportModes: W.getActiveTransportModeTypes(),
                    trafficMode: "disabled",
                    routeOptions: W.getRouteOptionsToAvoid()
                },
                departureDate: "arriveBy" !== d.timeSelector ? d.routeDate : null,
                arrivalDate: "arriveBy" === d.timeSelector ? d.routeDate : null,
                requestLinkAttributes: k.getRoughDistance(b) < 8e4,
                avoidTransportTypes: W.getPTOptionsToAvoid()
            })), "car" === W.getActiveTransportModeTypes()[0] ? (a = W.sendTrafficRoutingRequest(b), f.all([P.then(void 0, function(a) {
                return a
            }), a.then(void 0, function(a) {
                return a
            })]).then(function(a) {
                200 === a[0].status || 200 === a[1].status || a[0].cancelled || W.onErrorRoutesCallback(a[0]);
                var b = a[0].data,
                    c = a[1].data ? a[1].data[0] : "ERROR";
                W.onRoutesCallback({
                    data: n.filterDriveRoutes(b, c)
                })
            })) : "flight" === W.getActiveTransportModeTypes()[0] ? P.then(function(a) {
                return d.routeError = null, a ? (d.flights = n.parseFlightRoutes(a), d.requestPending = !1, D.isMinimized = !1, void(d.flights.length ? M.createFlightRoute({
                    start: b[0],
                    end: b[b.length - 1],
                    style: {
                        lineCap: "round",
                        lineJoin: "round",
                        strokeColor: n.strokeColor,
                        lineWidth: 10
                    }
                }) : d.routeError = "noRouteFound")) : void(d.routeError = "networkProblems")
            }) : P.then(W.onRoutesCallback, W.onErrorRoutesCallback)
        }, W.clearRoutes = function() {
            d.currentRouteIndex = null, d.availableRoutes = [], d.availableRoutesTrafficIncidents = [], d.currentRouteManeuvers = [], d.trafficRoute = null, q.directions.flights && (d.flights = []), W.syncCurrentRoute(), d.currentRoute = null, D.isMinimized = !0, P && P.abort(), Q && Q.abort()
        }, W.lookForRouteErrors = function(a) {
            a ? a.cancelled ? d.routeError = "" : "NoRouteFound" === a.subtype ? (d.requestPending = !1, d.routeError = "No timetable coverage available. Estimated PT Routing does not support arrival time." === a.details ? "noArrivalSupported" : "noRouteFound") : "InvalidInputData" === a.subtype && (d.requestPending = !1, d.routeError = "Arrival time is not supported." === a.details ? "noArrivalSupported" : "wrongParameters") : d.itineraryItems.forEach(function(a, b) {
                if (a.locationError) switch (d.routeError) {
                    case "":
                        d.routeError = 0 === b ? "givenStartNotFound" : "givenDestinationNotFound";
                        break;
                    case "givenStartNotFound":
                        d.routeError = 0 === b ? "givenStartNotFound" : "givenBothNotFound";
                        break;
                    case "givenDestinationNotFound":
                        d.routeError = 0 === b ? "givenBothNotFound" : "givenDestinationNotFound"
                }
            })
        }, W.onErrorRoutesCallback = function(a) {
            d.availableRoutes = [], d.availableRoutesTrafficIncidents = [], d.routeError = "networkProblems", W.lookForRouteErrors(a), W.trackRouteWasCalculated(!1)
        }, W.onRoutesCallback = function(a) {
            a.data && (M.polylines = n.parseRoutes(a.data), d.availableRoutes = a.data, d.currentRouteIndex = 0, d.requestPending = !1, d.recentRoutes = [], d.recentCommutes = [], W.syncCurrentRoute(), "car" === W.getActiveTransportModeTypes()[0] && (d.availableRoutesTrafficIncidents = [], G.getTrafficIncidentsForRoutes(d.availableRoutes, 0).then(function(a) {
                d.availableRoutesTrafficIncidents = a || [], G.displayIncidents(d.availableRoutesTrafficIncidents[d.currentRouteIndex])
            })), N.updateItineraryItemsFromRouteWaypoints(d.availableRoutes[0].waypoint), q.directions.recentRoutes && o.storeRoute("recentRoutes", {
                itineraryItems: d.itineraryItems,
                mode: W.getActiveTransportModeTypes()
            }), "publicTransportTimeTable" === d.getActiveTransportModes()[0].type && W.updatePTDisclaimer(a.data), W.trackRouteWasCalculated(!0))
        }, W.trackRouteWasCalculated = function(a) {
            var b = d.itineraryItems.length,
                c = W.getActiveTransportModeTypes(),
                e = a ? d.currentRoute.summary.distance : 0;
            x.track("directions", "routing calculation performed", {
                prop41: d.locationInRoute,
                eVar41: d.locationInRoute,
                prop42: c,
                eVar42: c,
                prop43: a,
                eVar43: a,
                eVar46: b,
                prop46: b,
                prop47: e
            }, "event8"), K.hasStarted("directionsMyLocationManual2") && K.conversion("directionsMyLocationManual2")
        }, W.routeCardDelayTimeString = "incl. {{delayTime}} delay", d.getCarRouteDelayTimeString = function(a) {
            return N.getCarRouteDelayTimeString(a)
        }, W.showRoute = function() {
            d.currentRoute && (M.removePolylinesFromMap(), M.showRouteLinesOnMap(), e(M.showDestinationFlag, 100), d.currentRoute.note.length > 0 && d.currentRoute.note.forEach(function(a) {
                "routingOptionViolated" === a.code && (d.disclaimer.show = !0, d.disclaimer.text = "blockedRoad" === a.text ? "This route includes at least one blocked or closed road." : "This route includes travel options other than those you prefer, but there\'s no route available otherwise.", D.isMinimized = !1)
            }))
        }, d.getActiveTransportModes = function() {
            return d.transportModes.filter(function(a) {
                return a.active
            })
        }, W.getActiveTransportModeTypes = function() {
            return d.getActiveTransportModes().map(function(a) {
                return a.type
            })
        }, W.getRouteOptionsToAvoid = function() {
            var a = [];
            return "publicTransportTimeTable" === d.getActiveTransportModes()[0].type ? "" : (d.routeOptions.forEach(function(b) {
                b.checked || -1 === b.mode.indexOf(d.getActiveTransportModes()[0].type) || a.push(b.type + ":" + V)
            }), a.join(","))
        }, W.getPTOptionsToAvoid = function() {
            var a = [];
            return "publicTransportTimeTable" !== d.getActiveTransportModes()[0].type ? "" : (d.routeOptions.forEach(function(b) {
                b.checked || -1 === b.mode.indexOf(d.getActiveTransportModes()[0].type) || "publicTransportTimeTable" !== d.getActiveTransportModes()[0].type || a.push(b.transportTypes)
            }), a.join(","))
        }, d.getUrlForMode = function(a) {
            return p.updateDirectionsUrl(p.modeToUrlComponentMap[a.type])
        }, W.setTransportMode = function(a) {
            d.transportModes.forEach(function(b, c) {
                b.active = b.type === a.type, b.active && d.setMenuIndicator(c)
            }, this), W.updateMapType(!1)
        }, d.reverseRoute = function() {
            N.reverseRoute(), x.click("routing:reverseroute:click")
        }, d.addWaypoint = function() {
            var a = new t(Z),
                b = d.itineraryItems.length - 1;
            d.itineraryItems.splice(b, 0, a), x.click("routing:waypoint:added:click")
        }, d.removeWaypoint = function(a) {
            d.itineraryItems.splice(a, 1), M.removeMarkerAt(a), x.click("routing:waypoint:removed:click")
        }, d.setRouteOnClick = function(a, b) {
            if (d.recentRoutes && d.recentRoutes.length) {
                var c = d.recentRoutes[a];
                W.setTransportMode(W.getTransportModeByType(c.storedRoute.mode[0], d.transportModes)), N.processGivenItineraryItems(c.storedRoute.itineraryItems), x.track("directions", "recent route selected"), d.recentRoutes = []
            } else d.availableRoutes.length > 1 && d.currentRouteIndex !== a && ((b || !C.mouse) && (M.hoveredRouteIndex = a, M.showPreviewPolyline(M.polylines[a], a)), d.currentRouteIndex = a, W.syncCurrentRoute(b), x.click(b ? "routing:routeAlternative:map:click" : "routing:routeAlternative:card:click"));
            D.isMinimized = !1
        }, d.setCommuteOnClick = function(a, b) {
            if (d.recentCommutes && d.recentCommutes.length) {
                var c = d.recentCommutes[a];
                W.setTransportMode(W.getTransportModeByType(c.storedRoute.mode[0], d.transportModes)), N.processGivenItineraryItems(c.storedRoute.itineraryItems), d.recentCommutes = []
            } else d.availableRoutes.length > 1 && d.currentRouteIndex !== a && ((b || !C.mouse) && (M.hoveredRouteIndex = a, M.showPreviewPolyline(M.polylines[a], a)), d.currentRouteIndex = a, W.syncCurrentRoute(b));
            D.isMinimized = !1
        }, d.getDriveLegArriveTimeInclTraffic = function(a, b) {
            var c, e, f, g, h, i = 0;
            for (c = new Date(a.leg[0].maneuver[0].time), g = d.itineraryItems.map(function(a) {
                    return a.getCoordinate()
                }).filter(function(a) {
                    return a
                }), h = k.getRoughDistance(g) >= 8e4, f = 0; b >= f; f++) i += h ? a.leg[f].summary.baseTime : a.leg[f].summary.trafficTime;
            return e = new Date(c.getTime() + 1e3 * i)
        }, W.syncCurrentRoute = function(a) {
            M.clearMapObjects(a), M.updateMarkers(), d.currentRoute = d.availableRoutes[d.currentRouteIndex], "car" === W.getActiveTransportModeTypes()[0] && d.currentRouteIndex >= 0 && d.availableRoutesTrafficIncidents[d.currentRouteIndex] && G.displayIncidents(d.availableRoutesTrafficIncidents[d.currentRouteIndex])
        }, W.syncOperators = function() {
            d.operators = "";
            var a, b, c = d.currentRoute;
            c && c.publicTransportLine && (a = c.publicTransportLine.map(function(a) {
                return a.companyName
            }), b = [], a.forEach(function(a) {
                -1 === b.indexOf(a) && b.push(a)
            }), d.operators = b.join(", "))
        }, W.syncGeolocationPending = function() {
            var a = d.itineraryItems,
                b = a.filter(function(a) {
                    return a.isMyLocation && !a.locationError
                }),
                c = b.length,
                e = c > 0,
                f = a.filter(function(a) {
                    return a.coordinate
                }).length,
                g = e && b[0].query;
            d.geolocationPending = e && g && c + f === a.length
        }, W.updateUrl = function() {
            var a = g.path(),
                b = p.createUrlForItems(d.itineraryItems, W.getActiveTransportModeTypes()[0]);
            a !== b && "/directions/drive" !== b && g.path(b).replace()
        }, W.normaliseRouteParams = function(a) {
            var b = {},
                c = /^[0-9a-z]{8}-[0-9a-f]{32}$/,
                d = /^loc-[0-9a-zA-Z]{250,300}$/;
            return a.placeId ? a.placeId.match(c) || a.placeId.match(d) ? b.placeId = a.placeId : a.placeId.match(/^(walk|drive|publicTransport|flight)$/) ? b.mode = a.placeId : b.address = a.placeId : (b.mode = a.mode, b.routeSplat = a.routeSplat), b
        }, W.getWeatherForRoute = function() {
            function a(a) {
                T && T.abort(), a.data && (e = a.data.mapReference, f = [e.cityId, e.countyId, e.countryId].join("")), T = z.get({
                    latitude: parseFloat(c.lat.toFixed(1)),
                    longitude: parseFloat(c.lng.toFixed(1)),
                    key: f
                }), T.then(function(a) {
                    a.data && (d.weather = a.data)
                }, function() {})["finally"](function() {
                    T = null
                })
            }
            var b = d.itineraryItems[d.itineraryItems.length - 1],
                c = b.coordinate,
                e = {},
                f = "";
            m.reverseGeoCode({
                location: c
            }).then(a)
        }, W.syncWeatherString = function() {
            try {
                d.weatherString = "{{weather.localConditions.temperature}}°{{weather.unit}} at your destination".replace("{{weather.localConditions.temperature}}", F(d.weather.localConditions.temperature, d.temperatureUnit)).replace("{{weather.unit}}", "celsius" === d.temperatureUnit ? "C" : "F")
            } catch (a) {}
        }, d.saveDateTimeOptions = function(a, b) {
            if (angular.isDate(a)) {
                d.routeDateTime = i(angular.isDate(d.routeDateTime) ? [d.routeDateTime.getHours(), d.routeDateTime.getMinutes()].join(":") : d.routeDateTime);
                var c = [a.getMonth() + 1, ".", a.getDate(), ".", a.getFullYear(), " ", d.routeDateTime].join("");
                d.routeDate = Date.create(c)
            } else d.routeDate = a;
            d.timeSelector = b, "arriveBy" === b ? (H.updateSingleUrlParam("arrive", a.getTime()), H.removeSingleUrlParam("leave")) : "departAt" === b ? (H.updateSingleUrlParam("leave", a.getTime()), H.removeSingleUrlParam("arrive")) : (H.removeSingleUrlParam("leave"), H.removeSingleUrlParam("arrive")), W.performRoutingCheck()
        }, d.saveRouteOptions = function() {
            var a, b = d.conf.routeUnits,
                c = d.distanceSystemUnit;
            d.isImperialUKUS ? (a = b === c, a || (a = A.optionsHaveChanged(d.routeOptions), E.saveDistanceSystemUnit(b), E.saveDistanceUnit("metric" === b ? "kilometers" : "miles"))) : (a = b === E.getUnits().distance, E.saveDistanceUnit(b)), a && W.performRoutingCheck(), A.saveOptions(d.routeOptions)
        }, d.resetRouteOptions = function() {
            d.routeOptions = A.getRouteOptions(), d.routeScaleSystemUnit = E.getUnits().distanceSystemUnit
        }, d.preserveOrRestoreDateTimeOptions = function() {
            d.isTimeDateExpanded ? d.restoreDateTimeOptions() : d.conf.timeSelector = d.timeSelector
        }, d.restoreDateTimeOptions = function() {
            d.routeDate = new Date, d.routeDateTime = new Date, d.conf.timeSelector && d.conf.timeSelector !== d.timeSelector && (d.timeSelector = d.conf.timeSelector), d.conf.timeSelector = ""
        }, d.saveCommute = function(a) {
            d.availableRoutes.length && (o.storeRoute("recentCommutes", {
                itineraryItems: d.itineraryItems,
                mode: [d.getActiveTransportModes()[0].type],
                name: a
            }), d.currentRouteIndex = 0, W.syncCurrentRoute(), d.commuteRoutes = o.retrieveRoutesFromStorage("recentCommutes"), d.routeSelectable = !0)
        }, d.removeCommute = function(a) {
            o.removeRoute("recentCommutes", a), W.initializeRecentCommutes()
        }, d.resetDepartNow = function(a, b) {
            var c = new Date;
            "departNow" === a && b - c > 1e3 && (d.routeDateTime = null, d.timeSelector = "departAt")
        }, d.preferencesOnTimeChange = function() {
            "publicTransportTimeTable" !== d.getActiveTransportModes()[0].type ? d.timeSelector = "departAt" : "departNow" === d.timeSelector && (d.timeSelector = "departAt")
        }, d.showTrafficRoutes = function(a) {
            d.showTrafficRouteFlag = a
        }, d.toggleTab = function(a) {
            if (d.featureCommute) switch (a) {
                case "timeDate":
                    d.isOptionsExpanded = !1, d.isCommuteExpanded = !1, d.isTimeDateExpanded = !d.isTimeDateExpanded;
                    break;
                case "options":
                    d.isTimeDateExpanded = !1, d.isCommuteExpanded = !1, d.isOptionsExpanded = !d.isOptionsExpanded, d.conf.routeUnits = d.isImperialUKUS ? d.routeScaleSystemUnit : d.routeScale, d.restoreDateTimeOptions();
                    break;
                case "commute":
                    d.isOptionsExpanded = !1, d.isTimeDateExpanded = !1, d.isCommuteExpanded = !d.isCommuteExpanded
            } else "options" === a ? (d.isOptionsExpanded = !d.isOptionsExpanded, d.isTimeDateExpanded = !1, d.conf.routeUnits = d.isImperialUKUS ? d.routeScaleSystemUnit : d.routeScale, d.restoreDateTimeOptions()) : (d.isOptionsExpanded = !1, d.isTimeDateExpanded = !d.isTimeDateExpanded)
        }, d.onlyFutureDates = function(a) {
            var b = new Date;
            return 864e5 >= b - a
        }, d.timeFormat = "en-us" === r.locale.tag ? "h:mm a" : "HH:mm", d.dateFormat = "en-us" === r.locale.tag ? "M/dd/yyyy" : "dd/MM/yyyy", d.getContainerBottomRight = angular.noop, d.setContainerBottomRightGetter = function(a) {
            d.getContainerBottomRight = function() {
                var b = a();
                return {
                    x: b.width + b.left,
                    y: b.height + b.top
                }
            }
        }, d.setMenuIndicator = function(a) {
            d.indicatorPos = 100 * a
        }, W.replaceWaypointInShape = function(a, b, c) {
            a[b + 0] = c.lat, a[b + 1] = c.lng
        }, d.sendRouteToCar = function() {
            x.track("pdc", "User clicks on 'Send to Car' button", {
                prop32: "Send to Car opened",
                eVar32: "Send to Car opened"
            });
            var a = angular.copy(d.currentRoute.shape);
            W.replaceWaypointInShape(a, 0, d.itineraryItems[0].mapCoordinate), W.replaceWaypointInShape(a, a.length - 2, d.itineraryItems[d.itineraryItems.length - 1].mapCoordinate);
            var b = {
                isRoute: !0,
                itineraryItems: d.itineraryItems,
                shape: a
            };
            c.$broadcast("modalDialog", {
                templateUrl: "features/sendToCar/dialog.html",
                replace: !0,
                context: b
            })
        }, d.printRoute = function() {
            a.here.printRoute = {
                route: d.currentRoute,
                itinerary: d.itineraryItems
            }, d.printRouteWindow = a.open("/printroute", "printwindow", "scrollbars=1, location=1, menubar=0, status=0, toolbar=0, resizable=1, width=595, height=800, directories=0"), x.click("routing:print:preview:click")
        }, d.flightSettingsChanged = function(a) {
            d.flightSettings = a, W.performRoutingCheck()
        }, W.initialize()
    }]), angular.module("hereApp.directions").factory("ItineraryItem", ["Features", "mapsjs", "withoutBRsFilter", "RecentsService", "directionsUrlHelper", "utilityService", function(a, b, c, d, e, f) {
        var g;
        return g = function(a) {
            this.label = a, this.query = "", this.lastQuery = null, this.reset()
        }, g.prototype.reset = function() {
            this.locationError && (this.query = ""), this.id = null, this.title = null, this.coordinate = null, this.accessPoint = null, this.mapCoordinate = null, this.category = null, this.vicinity = null, this.isMyLocation = !1, this._urlRepresentation = null, this.locationError = !1, this.isViaPoint = !1
        }, g.prototype.resetUrl = function() {
            this._urlRepresentation = null
        }, g.prototype.populate = function(a) {
            if (this._urlRepresentation = null, this.id = null, a.placeModel) {
                a = a.placeModel, this.id = a.placeId;
                var d = a.location.address && a.location.address.text ? c(a.location.address.text) : "",
                    e = d.split(", "),
                    f = a.name.split(", "),
                    g = f.concat(e.filter(function(a) {
                        return -1 === f.indexOf(a)
                    })),
                    h = g.filter(Boolean).join(", ");
                this.title = h, this.coordinate = a.location.position, a.location.access && a.location.access.length && (this.accessPoint = new b.geo.Point(a.location.access[0].position[0], a.location.access[0].position[1])), this.category = a.categories[0].id
            } else a.geoCoderModel ? (a = a.geoCoderModel, this.title = a.address.label, this.coordinate = a.displayPosition, this.accessPoint = new b.geo.Point(a.navigationPosition[0].lat, a.navigationPosition[0].lng)) : (a = a[Object.keys(a)[0]], this.title = a.title || a.name || (a.address ? a.address.label : ""), this.coordinate = a.navigationPosition && a.navigationPosition[0] || a.position || a.center || a.displayPosition, this.accessPoint = null);
            this.model = a, this.isViaPoint = a.isViaPoint === !0, this.mapCoordinate = this.accessPoint || this.coordinate
        }, g.prototype.getTitle = function() {
            return this.title
        }, g.prototype.getId = function() {
            return this.id
        }, g.prototype.getCoordinate = function() {
            return this.coordinate
        }, g.prototype.getAccessPoint = function() {
            return this.accessPoint
        }, g.prototype.getMapCoordinate = function() {
            return this.mapCoordinate
        }, g.prototype.getCategory = function() {
            return this.category
        }, g.prototype.asWaypoint = function(a) {
            var b = this.coordinate;
            return "car" === a && this.accessPoint && (b = this.accessPoint, b.display = this.coordinate, (!this.id || this.id && !this.id.match(/^[0-9a-z]{8}-[0-9a-f]{32}$/)) && (b.label = this.query)), b && (b.via = !!this.isViaPoint), b
        }, g.prototype.isPlace = function() {
            return !(!this.id || !this.id.match(/^[0-9a-z]{8}-[0-9a-f]{32}$/))
        }, g.prototype.toUrlComponent = function(a) {
            if (this._urlRepresentation) return this._urlRepresentation;
            if (!this.coordinate) return this.isMyLocation ? "mylocation" : "";
            var b, c, d = this.coordinate;
            return "car" !== a || this.isMyLocation || (d = this.mapCoordinate), b = f.replaceSpecialChars(this.title, "-"), c = this.isPlace() ? this.id : d.lat + "," + d.lng, this._urlRepresentation = b + e.SEPARATOR, this.isViaPoint && (this._urlRepresentation += "via"), this._urlRepresentation += c, this._urlRepresentation
        }, g
    }]), angular.module("hereApp.directions").controller("PrintCtrl", ["$rootScope", "$window", "$scope", "mapsjs", "mapUtils", "$templateCache", "routingUtilsFactory", "routesParser", "TrackingService", "unitsStorage", function(a, b, c, d, e, f, g, h, i, j) {
        var k = this;
        k.initialise = function() {
            j.initialize(), c.currentRoute = b.opener.here.printRoute.route, c.itinerary = b.opener.here.printRoute.itinerary, c.transportMode = c.currentRoute.mode.transportModes[0];
            var a = {
                    car: {
                        label: "Drive",
                        icon: f.get("/features/directions/img/modes/car.svg")
                    },
                    publicTransportTimeTable: {
                        label: "Public transport",
                        icon: f.get("/features/directions/img/modes/pt.svg")
                    },
                    publicTransport: {
                        label: "Public transport",
                        icon: f.get("/features/directions/img/modes/pt.svg")
                    },
                    pedestrian: {
                        label: "Walk",
                        icon: f.get("/features/directions/img/modes/pedestrian.svg")
                    }
                },
                d = a[c.transportMode].icon.replace(/#fff/gi, "#353535");
            c.transportIcon = "data:image/svg+xml;base64," + b.btoa(d), l(c.currentRoute)
        };
        var l = function(a) {
            if (a.mode) {
                var b, d = {
                    type: "pedestrian",
                    title: "",
                    icon: "/features/directions/img/modes/pedestrian.svg"
                };
                h.routeModeIsPT(a) ? (b = a.publicTransportLine.map(function(a) {
                    return {
                        type: "pt",
                        title: a.lineName,
                        color: a.lineBackground || "#1584e2"
                    }
                }), "leave" !== a.leg[0].maneuver[1].action && b.unshift(d), "enter" !== a.leg[0].maneuver.slice(-2)[0].action && b.push(d), 2 === b.length && "pedestrian" === b[0].type && "pedestrian" === b[1].type && (b = [d]), c.segments = b) : c.segments = g.getLongestDriveRouteSegments(a, 2)
            }
        };
        c.print = function() {
            b.print(), i.click("routing:print:print:click")
        }, k.initialise()
    }]), angular.module("hereApp.service").factory("routingUtilsFactory", ["$rootScope", "RecentsService", "$route", "Features", "routesParser", "$timeout", "PBAPI", "TrackingService", "ItineraryItem", "mapsjs", "$document", "User", "readableTimeSpanFilter", "hereBrowser", "geoCoder", "geolocation", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        var q = {},
            r = "From",
            s = "To",
            t = "via",
            u = -1;
        return q.getLongestDriveRouteSegments = function(a, b) {
            var c = q.getDriveRouteSegments(a);
            return c.sort(function(a, b) {
                return b.length - a.length
            }), c = c.slice(0, b || 2), 2 === c.length && (c[0].maneuver.nextRoadNumber && c[1].maneuver.nextRoadNumber || (c = c.slice(0, 1))), c.sort(function(a, b) {
                return a.index - b.index
            }), c.map(function(a) {
                return a.maneuver
            })
        }, q.getDriveRouteSegments = function(a) {
            var b = [],
                c = e.getRouteManeuvers(a);
            return c.forEach(function(a) {
                if (a.nextRoadNumber || a.nextRoadName) {
                    var c = b.filter(function(b) {
                        return q.isSameManeuver(a, b.maneuver)
                    })[0];
                    c ? c.length += a.length : b.push({
                        index: b.length,
                        length: a.length,
                        maneuver: a
                    })
                }
            }), b
        }, q.isSameManeuver = function(a, b) {
            var c = a.nextRoadNumber,
                d = b.nextRoadNumber,
                e = a.nextRoadName,
                f = b.nextRoadName;
            return c === d && "" !== d || e === f && "" !== f && "" === d
        }, q.create = function(l, v, w) {
            var x, y = 5,
                z = function() {
                    a.whenMapIsReady.then(function(a) {
                        x = a
                    })
                };
            return q.reverseRoute = function() {
                var a = v.itineraryItems.length - 1;
                v.itineraryItems.reverse(), v.itineraryItems.forEach(function(b, c) {
                    b.routingModel = null, w.removeMarkerAt(c), b.label = 0 === c ? r : c === a ? s : t
                })
            }, q.createSearchList = function(a, b) {
                return b.length < 3 ? (a.lastQuery = "", v.results = [], void l.removeItinerary(a)) : void(b !== a.lastQuery && (v.routeError = null, a.lastQuery = b, q.fireNewSearch(a.lastQuery, function(a) {
                    var c = a.data,
                        d = v.itineraryItems[v.itineraryItemIndex];
                    d && d.query === b && c && c.items && c.items.length > 0 && (v.hoveredResultIndex = 0, v.results = q.filterOutSearchResults(c, v.recentSearchResults))
                })))
            }, q.showRecentSearchResults = function(a) {
                b.getItems(a, b.types.place, y).then(function(b) {
                    v.recentSearchResults = q.deserializeRecentPlaces(b), v.hoveredResultIndex = "" !== a ? -v.recentSearchResults.length : null
                })
            }, q.showItems = function(a, b) {
                var c = a.query || "";
                v.itineraryItemFocused = !0, v.itineraryItemIndex = b, q.showRecentSearchResults(c), q.createSearchList(a, c)
            }, q.deserializeRecentPlaces = function(a) {
                return a.map(function(a) {
                    var b = angular.copy(a),
                        c = b.data.place.position;
                    return b.data.place.position = new j.geo.Point(c.latitude, c.longitude), b
                })
            }, q.fireNewSearch = function(a, b) {
                var c = g.search({
                    size: 5,
                    q: a,
                    center: x.getCenter(),
                    viewBounds: x.getViewBounds()
                });
                c.then(b)
            }, q.filterOutSearchResults = function(a, b) {
                var c = b.map(function(a) {
                        return a.data.id
                    }),
                    d = [];
                return a.items.forEach(function(a) {
                    -1 === c.indexOf(a.id) && d.push(a)
                }), a.items = d, a
            }, q.selectSearchElement = function(a, d) {
                if (a.id) {
                    b.addPlace(a), u = v.itineraryItemIndex;
                    var e = g.place({
                        id: a.id
                    });
                    e.then(function(b) {
                        var c = angular.copy(b.data);
                        c.name = a.title || c.name, q.setItineraryItem(u, {
                            placeModel: c
                        })
                    })
                } else q.setItineraryItem(v.itineraryItemIndex, {
                    basicModel: a
                });
                "directions" === c.current.$$route.specialPanelClass && d && h.track("directions", "search performed", {
                    prop36: v.itineraryItems[v.itineraryItemIndex].query,
                    eVar36: v.itineraryItems[v.itineraryItemIndex].query,
                    prop37: v.results && v.results.items ? v.results.items.length : 0,
                    eVar37: v.results && v.results.items ? v.results.items.length : 0,
                    prop38: d,
                    eVar38: d
                }, "event14"), v.results = [], l.putFocusOnNextElement && l.putFocusOnNextElement()
            }, q.clearSearchLists = function() {
                v.results = [], v.recentSearchResults = [], v.hoveredResultIndex = null
            }, q.selectFromSearchList = function() {
                var a, b = v.results && v.results.items && v.results.items.length > 0,
                    c = v.recentSearchResults && v.recentSearchResults.length > 0,
                    d = v.hoveredResultIndex;
                c && 0 > d ? a = v.recentSearchResults[v.recentSearchResults.length + d].data : b && d >= 0 && (a = v.results.items[d]), a && (q.selectSearchElement(a, c ? "recent" : "suggestion"), v.itineraryItemFocused = !1, q.clearSearchLists()), v.itineraryItemIndex === v.itineraryItems.length - 1 && f(function() {
                    var a = k[0].querySelector("#itinerary_item_input_" + v.itineraryItemIndex);
                    a.blur()
                })
            }, q.blurItineraryItem = function(a, b) {
                f(function() {
                    a.focussed = !1, d.directions.itineraryOverhaul && 0 > u && !a.coordinate && a.query.trim().length > 0 && q.tryAutoSelect(a), v.itineraryItemFocused && v.itineraryItemIndex === b && (v.itineraryItemFocused = !1, q.clearSearchLists())
                }, 200)
            }, q.tryAutoSelect = function(a) {
                var b = a.query.trim();
                q.fireNewSearch(b, function(a) {
                    var b = a.data.items;
                    b.length > 0 && q.selectSearchElement(b[0], "autoselect")
                })
            }, q.getNumberOfCompletedItineraryItems = function() {
                for (var a = 0, b = 0; a < v.itineraryItems.length; a++) v.itineraryItems[a].getCoordinate() && b++;
                return b
            }, q.updateItineraryItemsFromRouteWaypoints = function(a) {
                a.forEach(function(a, b) {
                    v.itineraryItems[b].mapCoordinate = a.mappedPosition
                })
            }, q.processGivenItineraryItems = function(a) {
                if (a.length > v.MAX_ITINERARY_ITEMS) {
                    var b = a[a.length - 1];
                    a.length = v.MAX_ITINERARY_ITEMS - 1, a.push(b)
                }
                v.itineraryItems = a.map(function(b, c) {
                    var d, e = new i;
                    return v.itineraryItems[c] && (e = v.itineraryItems[c]), d = t, 0 === c ? d = r : c === a.length - 1 && (d = s), e.label = d, e
                }), a.forEach(function(b, c) {
                    if (angular.isUndefined(b)) return void v.itineraryItems[c].reset();
                    var e = v.itineraryItems[c];
                    if (e.query = b.name, e.lastQuery = b.name, b.myLocation) v.fromMyLocationLink = !0, !d.directions.myLocationManual || p.hadPermission() ? d.directions.itineraryOverhaul ? v.setMyLocation(c).then(function() {
                        v.locationInRoute = !0
                    }) : (v.itineraryItemIndex = c, v.setMyLocation()) : (v.itineraryItemIndex = c, e.isMyLocation = !0);
                    else if (b.placeId) b.placeId !== e.id && g.place({
                        id: b.placeId
                    }).then(function(a) {
                        /^e-/.test(b.placeId) && a.data.location && a.data.location.address && (a.data.location.address.text = "");
                        var e = v.itineraryItems[c],
                            f = e && e.id && e.id !== a.data.placeId;
                        d.directions.itineraryOverhaul && f || q.setItineraryItem(c, {
                            placeModel: a.data
                        })
                    }, function() {
                        var a = v.itineraryItems[c];
                        switch (a.locationError = !0, v.routeError) {
                            case "":
                                v.routeError = 0 === c ? "givenStartNotFound" : "givenDestinationNotFound";
                                break;
                            case "givenStartNotFound":
                                v.routeError = 0 === c ? "givenStartNotFound" : "givenBothNotFound";
                                break;
                            case "givenDestinationNotFound":
                                v.routeError = 0 === c ? "givenBothNotFound" : "givenDestinationNotFound"
                        }
                    });
                    else if (b.center) {
                        if (e.coordinate && e.coordinate.lat !== b.center.latitude && e.coordinate.lng !== b.center.longitude && e.reset(), b.center.distance || (b.center = new j.mapUtils.makePoint(b.center)), !b.name) {
                            var f = b.center.lat + "," + b.center.lng;
                            b.name = f, o.reverseGeoCode({
                                location: b.center
                            }).then(function(a) {
                                b.name === f && q.setItineraryItem(c, {
                                    geoCoderModel: a.data
                                })
                            })
                        }
                        q.setItineraryItem(c, {
                            basicModel: b
                        })
                    } else b.name && c === a.length - 1 && (e.lastQuery = "", q.showItems(e, c))
                })
            }, q.setItineraryItem = function(a, b) {
                var c = v.itineraryItems[a];
                c.populate(b), b.model && b.model.locationId && (c.isMyLocation = !0, v.locationInRoute = !0), c.query = c.title, c.lastQuery = c.query, u = -1
            }, l.routeCardDelayTimeString = "incl. {{delayTime}} delay", q.getCarRouteDelayTimeString = function(a) {
                var b = a.summary.trafficTime,
                    c = a.summary.baseTime,
                    d = b - c,
                    e = l.routeCardDelayTimeString,
                    f = "";
                return d >= 60 && (f = m(d), f = e.replace("{{delayTime}}", f)), f
            }, q.refreshRouteOnZoomChange = function() {
                if (!(w.mapContainer.getObjects().length <= 1 || n.isiOS || v.getActiveTransportModes && "flight" === v.getActiveTransportModes()[0].type)) {
                    var a = v.mapZoomLevel,
                        b = x.getZoom(),
                        c = e.getRouteLineWidthByZoomLevel(a),
                        d = e.getRouteLineWidthByZoomLevel(b);
                    c !== d && (v.mapZoomLevel = b, w.removePolylinesFromMap(), w.showRouteLinesOnMap(!0))
                }
            }, z(), q
        }, q
    }]), angular.module("hereApp.directions").factory("directionsMapHelperFactory", ["$compile", "$rootScope", "splitTesting", "mapsjs", "mapContainers", "mapUtils", "markerIcons", "markerService", "routesParser", "routeTrafficIncidents", "RedirectService", "hereBrowser", "rubberBanding", "routeLinePopupFactory", "$location", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        return {
            create: function(a, c) {
                var p, q = {},
                    r = o.path().indexOf("/traffic/") > -1;
                return q.initialize = function() {
                    q.markers = [], q.polylines = [], q.previewedPolyline = [], q.mapContainer = e.directions, q.hoveredRouteIndex = -1, q.transitTypeToIconCategoryMap = {
                        busPublic: "bus",
                        busTouristic: "bus",
                        busIntercity: "bus",
                        busExpress: "bus",
                        railMetro: "metro",
                        railMetroRegional: "train",
                        railLight: "tram",
                        railRegional: "train",
                        trainRegional: "train",
                        trainIntercity: "intercity-train",
                        trainHighSpeed: "intercity-train",
                        monoRail: "monorail",
                        aerial: "cable-car",
                        inclined: "funicular",
                        water: "ferry-terminal",
                        privateService: "public-transport"
                    }, c.$watch("itineraryItems", q.updateMarkers, !0), c.$watch("currentRoute", q.updateModeChangeMarkers), c.$watch("currentRoute", q.showRoute), c.$watch("canSendRoutingRequest", q.removePolylinesFromMap), q.onVisibilityChange(), b.whenMapIsReady.then(function(a) {
                        p = a
                    }), q.mapContainer.setVisibility(!0), m.initialise(a, c)
                }, q.createMarker = function(a, b, d, e) {
                    var f = a === c.itineraryItems.length - 1,
                        i = {
                            PBAPIID: b,
                            position: d,
                            icons: null,
                            flag: {
                                title: e,
                                icon: null,
                                knife: "route"
                            },
                            routing: !0,
                            onClick: function(a, c) {
                                if (c.preventDefault(), b) k.goToPlaceById(b, "direction marker");
                                else {
                                    var d = angular.copy(a.data.position);
                                    d.msg = a.data.flag.title, k.goToLocation(d, "direction marker")
                                }
                            }
                        };
                    return i.icons = g.route(0 === a ? "start" : f ? "destination" : a), h.createMarker(i)
                }, q.createModeChangeMarker = function(a, b) {
                    return h.createMarker({
                        position: b.position,
                        icons: g.modeChange(q.transitTypeToIconCategoryMap[a.type] || "public-transport"),
                        flag: {
                            title: b.stopName,
                            icon: null,
                            knife: "route"
                        },
                        routing: !0
                    })
                }, q.updateMarkers = function() {
                    c.itineraryItems.forEach(function(a, b) {
                        var c = a.mapCoordinate,
                            d = q.markers[b];
                        d && q.mapContainer.contains(d) && (h.removeMarker(d, q.mapContainer), q.markers[b] = null), c && (d = q.createMarker(b, a.getId(), c, a.query), l.isAndroid || l.isiOS || r || m.setDraggableMarker(d, a, b), q.markers[b] = d, q.mapContainer.addObject(d))
                    })
                }, q.updateModeChangeMarkers = function() {
                    if (i.routeModeIsPT(c.currentRoute)) {
                        var a = [],
                            b = -1,
                            d = i.getRouteManeuvers(c.currentRoute);
                        d.forEach(function(e, f) {
                            var g, h = d[f + 1],
                                i = "leave" === e.action && !(h && "enter" === h.action);
                            "enter" === e.action && (b += 1), g = b, ("enter" === e.action || i) && a.push(q.createModeChangeMarker(c.currentRoute.publicTransportLine[g], e))
                        }), q.mapContainer.addObjects(a)
                    }
                }, q.showDestinationFlag = function() {
                    var a = q.markers[q.markers.length - 1];
                    h.getWrapped(a).addFlag(!0)
                }, q.onVisibilityChange = function() {
                    c.currentRoute ? e.showOnly(e.directions) : q.mapContainer.setVisibility(!0)
                }, q.removeMarkerAt = function(a) {
                    var b = q.markers[a];
                    b && (q.markers[a] = null, q.mapContainer.getObjects().indexOf(b) >= 0 && h.removeMarker(b, q.mapContainer))
                }, q.removePolylinesFromMap = function() {
                    q.mapContainer.forEach(function(a) {
                        a instanceof d.map.Polyline && q.mapContainer.removeObject(a)
                    })
                }, q.clearMapObjects = function(a) {
                    e.clearContainer(j.container), a || e.clearContainer(q.mapContainer)
                }, q.showRoute = function() {
                    c.currentRoute && (e.showOnly(e.directions), j.container.setVisibility(!0))
                }, q._prepareDragDropForPolyLines = function(a) {
                    var b = [];
                    return c.currentRoute && (c.currentRoute.polylines = []), a.forEach(function(a) {
                        Array.isArray(a) ? a.forEach(function(a) {
                            q.addMouseEventsToRoute(a), l.isAndroid || l.isiOS || r || m.setDraggablePolyline(a), b.push(a)
                        }) : (q.addMouseEventsToRoute(a), l.isAndroid || l.isiOS || r || m.setDraggablePolyline(a), b.push(a), c.currentRoute && c.currentRoute.polylines.push(a))
                    }), b
                }, q._addRouteSwitchHandler = function(a, b) {
                    a.forEach(function(a) {
                        a.hasTapHandler || (a.addEventListener("tap", function() {
                            c.setRouteOnClick(b, !0)
                        }), a.hasTapHandler = !0)
                    })
                }, q._getJoinedPolyLines = function() {
                    var a = c.currentRouteIndex,
                        b = [];
                    return q.polylines.forEach(function(c, d) {
                        var e;
                        a !== d ? i.setPolylineOpacity(c, !0) : l.mouse || q.showPreviewPolyline(q.polylines[a], a), c = i.setRouteLineWidth(c, p.getZoom()), e = q._prepareDragDropForPolyLines(c), l.isiOS || l.isAndroid || q._addRouteSwitchHandler(e, d), a !== d ? b.unshift(e) : b.push(e)
                    }), b
                }, q.showRouteLinesOnMap = function(a) {
                    var b = q._getJoinedPolyLines();
                    b.forEach(function(a) {
                        q.mapContainer.addObjects(a)
                    }), a || q.ensureRouteIsVisibleOnMap(c.currentRoute)
                }, q.addMouseEventsToRoute = function(a) {
                    if (!r) {
                        var b = n.create();
                        a.addEventListener("pointerenter", function(a) {
                            var d = a.target;
                            (d.linkId || d.lineName) && b.showInfo(c.currentRoute, d, {
                                x: a.currentPointer.viewportX + 12,
                                y: a.currentPointer.viewportY + 15
                            })
                        }), a.addEventListener("pointerleave", function() {
                            b.visible = !1, b.$digest()
                        }), a.addEventListener("dragstart", function() {
                            b.visible = !1, b.$digest()
                        })
                    }
                }, q.hoverRouteAlternative = function(a) {
                    l.mouse && (q.hoveredRouteIndex = a, q.polylines.length && q.showPreviewPolyline(q.polylines[a], a))
                }, q.leaveRouteAlternative = function() {
                    l.mouse && (c.currentRoute || q.polylines.length) && (q.hoveredRouteIndex !== c.currentRouteIndex && (q.showRouteLinesOnMap(!0), i.setPolylineOpacity(q.polylines[c.currentRouteIndex], !1), i.setRouteLineWidth(q.polylines[c.currentRouteIndex], p.getZoom())), q.hoveredRouteIndex = -1, q.previewedPolyline = [])
                }, q.showPreviewPolyline = function(a, b) {
                    if (q.hoveredRouteIndex === b && c.currentRouteIndex !== b) {
                        var d = [];
                        i.setPolylineOpacity(q.polylines[c.currentRouteIndex], !0), i.setPolylineOpacity(a, !1), i.setRouteLineWidth(a, p.getZoom()), a.forEach(function(a) {
                            a.length ? a.forEach(function(a) {
                                d.push(a)
                            }) : d.push(a)
                        }), q.previewedPolyline = d, q.mapContainer.addObjects(q.previewedPolyline)
                    }
                }, q.routeWouldBeCovered = function(a, b) {
                    var e = c.getContainerBottomRight() || {
                            x: 0,
                            y: 0
                        },
                        g = d.math.Rect.fromPoints({
                            x: 0,
                            y: 0
                        }, e),
                        h = f.pixelRectToGeoInCamera(g, b, p),
                        i = a.getStrip ? a.getStrip() : d.geo.Strip.fromLatLngArray(a.shape),
                        j = new d.map.Polyline(i);
                    return j.clip(h).length > 0
                }, q.growRectToMakeItVisible = function(a, b) {
                    var c = a.getCenter(),
                        e = a.getTopLeft(),
                        f = c.lat,
                        g = c.lng,
                        h = b.getViewPort(),
                        i = a.getWidth(),
                        j = a.getHeight(),
                        k = i / j > h.width / h.height;
                    return k ? f = e.lat : g = e.lng, a.resizeToCenter(new d.geo.Point(f, g))
                }, q.ensureRouteIsVisibleOnMap = function(a) {
                    if (a) {
                        var b, c, d = a.boundingBox || a.getBounds(),
                            e = p.getViewModel().getCameraData(),
                            f = p.getCameraDataForBounds(d, !0),
                            g = q.growRectToMakeItVisible(d, p);
                        b = p.getViewBounds().containsRect(d), c = p.getZoom() + 1 < f.zoom, !b || c ? (q.routeWouldBeCovered(a, f) && (d = g), p.setViewBounds(d, !0)) : q.routeWouldBeCovered(a, e) && p.setViewBounds(g, !0)
                    }
                }, q.createFlightRoute = function(a) {
                    function b(a, b, c, e, f) {
                        f.pushPoint(new d.geo.Point(a, b)), f.pushPoint(new d.geo.Point(c, e))
                    }

                    function c(a) {
                        return a * Math.PI / 180
                    }

                    function e(a) {
                        return 180 * a / Math.PI
                    }

                    function f(a, b) {
                        var d = c(a.lat),
                            f = c(b.lat),
                            g = c(b.lng - a.lng),
                            h = Math.sin(g) * Math.cos(f),
                            i = Math.cos(d) * Math.sin(f) - Math.sin(d) * Math.cos(f) * Math.cos(g),
                            j = Math.atan2(h, i);
                        return (e(j) + 360) % 360
                    }
                    var g, h, i, j = a.start.lat || null,
                        k = a.start.lng || null,
                        l = a.end.lat || null,
                        m = a.end.lng || null,
                        n = a.style || null,
                        o = a.arrows || null,
                        p = 1,
                        r = a.resolution || .001,
                        s = new d.geo.Strip,
                        t = j,
                        u = k,
                        v = [],
                        w = [],
                        x = f(a.start, a.end),
                        y = !0;
                    (x > 135 && 225 > x || x > 315 && 360 > x || x > 0 && 45 > x) && (y = !1);
                    for (var z = 0; 1 >= z; z += r) {
                        v.push(z);
                        var A = .6 * Math.sin(Math.PI * z / 1);
                        w.push(A)
                    }
                    var B = 0;
                    i = y ? .1 * (m - k) : .1 * (l - j);
                    for (var C = 0; C < v.length; C++) 4 === C && (B = 1.5 * p), B = C >= 5 ? i * w[C] * p : i * w[C] * p, y ? (g = j + (l - j) * v[C] + B, h = k + (m - k) * v[C]) : (g = j + (l - j) * v[C], h = k + (m - k) * v[C] + B), b(t, u, g, h, s), t = g, u = h;
                    b(t, u, l, m, s);
                    var D = new d.map.Polyline(s, {
                        style: n,
                        arrows: o
                    });
                    q.mapContainer.addObject(D), q.ensureRouteIsVisibleOnMap(D)
                }, q.initialize(), q
            }
        }
    }]), angular.module("hereApp.directions").factory("directionsUrlHelper", ["utilityService", "$location", "Features", "withoutBRsFilter", function(a, b, c, d) {
        var e = {};
        return e.SEPARATOR = ":", e.modeToUrlComponentMap = {
            car: "drive",
            pedestrian: "walk",
            publicTransportTimeTable: "publicTransport",
            flight: "flight"
        }, e.urlComponentToModeMap = {
            drive: "car",
            walk: "pedestrian",
            publicTransport: "publicTransportTimeTable",
            flight: "flight"
        }, e._parseSplatSection = function(a) {
            var b, c, d, f = e.SEPARATOR,
                g = a.match("^([^" + f + "]*)" + f + "([^" + f + "]+)$"),
                h = a.match("^([se]-[a-zA-Z0-9+/]+={0,3})$"),
                i = a.match(/^(.*)\[([^\]]+)\]$/),
                j = g || h || i,
                k = /^(via)?(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
                l = /^(via)?[0-9a-z]{8}-[0-9a-f]{32}$/,
                m = /^loc-[0-9a-zA-Z]{250,300}$/;
            return "MYLOCATION" === a.toUpperCase() ? d = {
                myLocation: !0
            } : j ? (d = {}, null === h ? (d.name = j[1].replace(/[_-]/g, " "), b = j[2].match(k), c = j[2].match(l) || j[2].match(m)) : c = j, c ? (d.placeId = c[0], c[1] && null === h && (d.isViaPoint = !0)) : b && (d.center = {
                latitude: parseFloat(b[2]),
                longitude: parseFloat(b[3])
            }, b[1] && (d.isViaPoint = !0))) : 0 === a.indexOf("@") ? d = null : a.length && "directions" !== a && (d = {
                name: a
            }), d
        }, e.parseRouteSplat = function(a) {
            var b, c = a.split("/");
            for (b = c.map(e._parseSplatSection); b.length > 0 && null === b[b.length - 1];) b.pop();
            for (; b.length < 2;) b.push(void 0);
            return {
                itineraryItems: b
            }
        }, e._coordinateToUrlComponent = function(a) {
            return a.lat + "," + a.lng
        }, e.createUrlComponentForItem = function(a, b) {
            return a.toUrlComponent(b)
        }, e._combineUrlComponents = function(a, b) {
            var c = b.join("/");
            return a = a || "drive", c.match(/^\/+$/) && (c = ""), "" !== c ? "/directions/" + a + "/" + c : "/directions/" + a
        }, e.createUrlForItems = function(a, b) {
            var c = a.map(function(a) {
                return e.createUrlComponentForItem(a, b)
            });
            return b = e.modeToUrlComponentMap[b], e._combineUrlComponents(b, c)
        }, e.createUrlForFlag = function(b) {
            var c, d, f = a.replaceSpecialChars(b.flag.title, "-");
            return b.PBAPIID ? c = b.PBAPIID : b.locationAddress && (f = a.replaceSpecialChars(b.locationAddress, "-"), c = e._coordinateToUrlComponent(b.navigationPosition || b.position)), d = f + e.SEPARATOR + c, e.updateDirectionsUrl(void 0, d)
        }, e.updateDirectionsUrl = function(a, c) {
            var d, f = b.path(),
                g = f.match(/\/(drive|walk|publicTransport|flight)/);
            if (a = a || g && g[1] || "drive", f.indexOf("/directions") < 0) return e._combineUrlComponents(a, ["", c]);
            for (d = f.replace(/^\/directions\/(drive|walk|publicTransport|flight)\/?/, "").split("/"); d.length < 2;) d.push("");
            return c && (d.pop(), d.push(c)), e._combineUrlComponents(a, d)
        }, e.createUrlForPlace = function(b) {
            var c = ["/directions", "drive", ""],
                f = b.name,
                g = b.placeId || b.id;
            g.match(/^loc-[0-9a-zA-Z]+/) && b.location && (b.location.address && (f += ", " + d(b.location.address.text).replace(b.name + ", ", "")), g = e._coordinateToUrlComponent(b.location.access && b.location.access.length > 0 ? {
                lat: b.location.access[0].position[0],
                lng: b.location.access[0].position[1]
            } : b.location.position));
            var h = a.replaceSpecialChars(f, "-");
            return c.push(h + e.SEPARATOR + g), c.join("/")
        }, e.createUrlForSearchBar = function(b) {
            return e._combineUrlComponents("drive", ["", a.replaceSpecialChars(b, "-")])
        }, e
    }]), angular.module("hereApp.directive").directive("hereFlightDirective", ["TrackingService", "skyScannerService", function(a, b) {
        return {
            replace: !0,
            restrict: "A",
            templateUrl: "features/directions/flights/flights.html",
            link: function(a) {
                var c, d = "Depart from {{airport}}",
                    e = "Arrive at {{airport}}",
                    f = [],
                    g = [],
                    h = function(a, b) {
                        var c = [];
                        return a.OperatingCarriers.forEach(function(a) {
                            b.Carriers.forEach(function(b) {
                                b.Id === a && c.push(b)
                            })
                        }), c
                    },
                    i = function(b, c, d) {
                        if (b && c && !isNaN(d)) {
                            if (f[d]) return a.selectedFlight = f[d], a.requestingFlights = !1, void(a.errorMessage = !1);
                            var e, g, i, j = b.carrier.CarrierId,
                                k = angular.copy(c),
                                l = [],
                                m = null;
                            if (k.Legs.forEach(function(a) {
                                    a.Carriers[0] === j && (l.push(a), k.Itineraries.forEach(function(b) {
                                        b.OutboundLegId === a.Id && (null === m || b.PricingOptions[0].Price < m) && (e = b, m = b.PricingOptions[0].Price)
                                    }))
                                }), l.forEach(function(a) {
                                    a.Id === e.OutboundLegId && (g = a), a.Id === e.InboundLegId && (i = a)
                                }), !(l.length && g && i)) return a.errorMessage = !0, a.requestingFlights = !1, void(a.selectedFlightIndex = d);
                            a.errorMessage = !1, g.OperatingCarriers = h(g, k), i.OperatingCarriers = h(i, k), g.segments = [], i.segments = [];
                            var n = function(a) {
                                var b = this;
                                k.Segments.forEach(function(b) {
                                    b.Id === a && (b.ArrivalDateTime = Date.create(b.ArrivalDateTime), b.DepartureDateTime = Date.create(b.DepartureDateTime), k.Places.forEach(function(a) {
                                        a.Id === b.OriginStation ? b.OriginStation = a : a.Id === b.DestinationStation && (b.DestinationStation = a)
                                    }), this.segments.push(b))
                                }, b)
                            };
                            g.SegmentIds.forEach(n, g), i.SegmentIds.forEach(n, i), g.Duration = 60 * g.Duration, i.Duration = 60 * i.Duration, a.selectedFlight = {
                                itinerary: e,
                                outboundLeg: g,
                                inboundLeg: i,
                                flight: b
                            }, a.requestingFlights = !1, f[d] = a.selectedFlight
                        }
                    };
                a.selectedFlightIndex = null, a.selectedFlight = null, a.requestingFlights = !1, a.getPriceString = function(a) {
                    var b = "From<br/><span class=\"bold_price\">{{currency}}{{price}}</span>",
                        c = a.currencies.SpaceBetweenAmountAndSymbol ? " " : "";
                    return a.currencies.SymbolOnLeft ? b = b.replace("{{currency}}", a.currencies.Symbol + c).replace("{{price}}", a.price) : (b = b.replace("{{currency}}", ""), b = b.replace("</span>", ""), b += "{{currency}}</span>", b = b.replace("{{price}}", a.price + c).replace("{{currency}}", a.currencies.Symbol)), b
                }, a.getLivePriceString = function() {
                    var b = "";
                    if (a.selectedFlight) {
                        var c = a.selectedFlight.flight.currencies,
                            d = c.SpaceBetweenAmountAndSymbol ? " " : "",
                            e = c.SymbolOnLeft;
                        b = e ? a.selectedFlight.flight.currencies.Symbol + d + a.selectedFlight.itinerary.PricingOptions[0].Price : a.selectedFlight.itinerary.PricingOptions[0].Price + d + a.selectedFlight.flight.currencies.Symbol
                    }
                    return b
                }, a.selectFlight = function(d, e, f) {
                    if (f === a.selectedFlightIndex) return void(d.target.id.indexOf("book_button_") < 0 && (a.selectedFlightIndex = null, a.selectedFlight = null));
                    var g = a.itineraryItems.map(function(a) {
                        return a.asWaypoint("flight")
                    });
                    return a.requestingFlights = !0, a.selectedFlightIndex = f, c ? void i(e, c, f) : void b.livePrices(g, e, a.flightSettings).then(function(a) {
                        c = a, i(e, a, f)
                    })
                }, a.getDepartureAirport = function(a) {
                    return d.replace("{{airport}}", "<b>" + a.Name + "</b>")
                }, a.getArrivalAirport = function(a) {
                    return e.replace("{{airport}}", "<b>" + a.Name + "</b>")
                }, a.getCarrierLogo = function(a, b) {
                    if (g[a]) return g[a];
                    var c = "";
                    return b.OperatingCarriers.some(function(b) {
                        return b.Id === a ? (c = b.ImageUrl, !0) : void 0
                    }), g[a] = c, c
                };
                var j = function() {
                    a.selectedFlight = null, a.selectedFlightIndex = null, a.errorMessage = !1, c = null, f = []
                };
                a.$watch("flights", j)
            }
        }
    }]), angular.module("hereApp.service").factory("hereDragTypeWorkaround", function() {
        return {}
    }).factory("hereDropEffectWorkaround", function() {
        return {}
    }), angular.module("hereApp.directive").directive("hereDraggable", ["$parse", "$timeout", "Features", "hereDropEffectWorkaround", "hereDragTypeWorkaround", function(a, b, c, d, e) {
        return function(b, f, g) {
            c.directions.itineraryOverhaul && (f.attr("draggable", "true"), f.on("dragstart", function(c) {
                var h = a(g.hereDraggable)(b);
                return c = c.originalEvent || c, h.validator && h.validator.call && !h.validator(c, f, h.index) ? (c.stopPropagation(), c.preventDefault(), !1) : (c.dataTransfer.setData("Text", "dragging"), c.dataTransfer.effectAllowed = "move", f.parent().addClass("dragging"), f.addClass("dragged"), d.dropEffect = "none", e.isDragging = !0, h.callback && h.callback.call && h.callback(c, h.index, h.item), void c.stopPropagation())
            }), f.on("dragend", function(a) {
                a = a.originalEvent || a, f.parent().removeClass("dragging"), f.removeClass("dragged"), e.isDragging = !1, a.stopPropagation()
            }))
        }
    }]), angular.module("hereApp.directive").directive("hereDroppable", ["$parse", "$timeout", "hereDropEffectWorkaround", "Features", function(a, b, c, d) {
        return function(e, f, g) {
            function h(a, b, c) {
                var d = a.offsetY || a.layerY,
                    e = b.offsetHeight,
                    f = b.offsetTop;
                return f = c ? f : 0, f + e / 2 > d
            }

            function i() {
                return Array.prototype.indexOf.call(o.children, n)
            }

            function j(a) {
                return l(a.dataTransfer.types) ? !0 : !1
            }

            function k() {
                return m.remove(), f.removeClass("dndDragover"), !0
            }

            function l(a) {
                if (!a) return !0;
                for (var b = 0; b < a.length; b++)
                    if ("Text" === a[b] || "text/plain" === a[b]) return !0;
                return !1;

            }
            if (d.directions.itineraryOverhaul) {
                var m = angular.element("<li class='placeholder'></li>"),
                    n = m[0],
                    o = f[0];
                e.dragOverHandler = function(b) {
                    var c = a(g.hereDroppable)(e);
                    if (b = b.originalEvent || b, !j(b)) return !0;
                    if (n.parentNode !== o && f.append(m), b.target !== o) {
                        for (var d = b.target; d.parentNode !== o && d.parentNode;) d = d.parentNode;
                        d.parentNode === o && d !== n && (h(b, d) ? o.insertBefore(n, d) : o.insertBefore(n, d.nextSibling))
                    } else if (h(b, n, !0))
                        for (; n.previousElementSibling && (h(b, n.previousElementSibling, !0) || 0 === n.previousElementSibling.offsetHeight);) o.insertBefore(n, n.previousElementSibling);
                    else
                        for (; n.nextElementSibling && !h(b, n.nextElementSibling, !0);) o.insertBefore(n, n.nextElementSibling.nextElementSibling);
                    if (c.dragOverCallback) {
                        var l = c.dragOverCallback(b, i());
                        if (l) return k()
                    }
                    return f.addClass("dndDragover"), b.preventDefault(), b.stopPropagation(), !1
                }, e.dropHandler = function(b) {
                    var d = a(g.hereDroppable)(e);
                    return b = b.originalEvent || b, j(b) ? (b.preventDefault(), d.dropCallback && d.dropCallback(b, i()), c.dropEffect = "none" === b.dataTransfer.dropEffect ? "copy" === b.dataTransfer.effectAllowed || "move" === b.dataTransfer.effectAllowed ? b.dataTransfer.effectAllowed : b.ctrlKey ? "copy" : "move" : b.dataTransfer.dropEffect, k(), b.stopPropagation(), !1) : !0
                }, f.on("dragover", e.dragOverHandler), f.on("drop", e.dropHandler), f.on("dragleave", function() {
                    f.removeClass("dndDragover"), b(function() {
                        f.hasClass("dndDragover") || m.remove()
                    }, 100)
                })
            }
        }
    }]), angular.module("hereApp.directive").directive("hereItineraryBar", ["Features", "TrackingService", "PBAPI", "RecentsService", "$route", "$document", "$timeout", "$window", "mapsjs", "$rootScope", "splitTesting", function(a, b, c, d, e, f, g, h, i, j, k) {
        return {
            replace: !0,
            restrict: "A",
            templateUrl: "features/directions/itineraryBar/itineraryBar.html",
            scope: {
                itineraryItems: "=hereItineraryBar",
                maxItineraryItems: "=?maxItineraryItems",
                maxRecents: "=?maxRecents",
                addWaypoint: "&itineraryAdd",
                removeWaypoint: "&itineraryRemove",
                removeItinerary: "&onItineraryRemoved",
                setMyLocation: "&itinerarySetMyLocation",
                populateItinerary: "&itineraryItemPopulate",
                reverseRoute: "&itinerariesReverse",
                expandStopovers: "&onExpandStopovers",
                locationInRoute: "=hasLocationInRoute"
            },
            link: function(l, m) {
                l.itineraryOverhaul = a.directions.itineraryOverhaul, l.recents = [], l.suggestions = [], l.itineraryItemFocused = !1;
                var n, o = -1,
                    p = {
                        index: -1,
                        item: null
                    };
                j.whenMapIsReady.then(function(a) {
                    n = a
                }), l.navigateSearchList = function(a) {
                    if (27 === a.which) r();
                    else if (9 === a.which) l.selectFromSearchList();
                    else if (38 === a.which) a.preventDefault(), l.hoveredResultIndex = Math.max(-l.recents.length, (l.hoveredResultIndex || 0) - 1);
                    else if (40 === a.which) {
                        a.preventDefault();
                        var b, c = 0;
                        b = null === l.hoveredResultIndex ? -l.recents.length || 0 : l.hoveredResultIndex + 1, l.suggestions && l.suggestions.items && l.suggestions.items.length > 0 ? c = l.suggestions.items.length - 1 : l.recents && (c = -1), l.hoveredResultIndex = Math.min(c, b)
                    }
                }, l.showItems = function(a, b, c) {
                    c && (l.locationInRoute && a.isMyLocation && (l.locationInRoute = !1), l.removeItinerary({
                        item: a
                    }));
                    var d = a.query || "";
                    l.itineraryItemFocused = !0, l.itineraryItemIndex = b, t(d, l.maxRecents), u(a, d)
                }, l.selectSearchElement = function(a, f) {
                    a.id ? (d.addPlace(a), o = l.itineraryItemIndex, c.place({
                        id: a.id
                    }).then(function(b) {
                        var c = angular.copy(b.data);
                        c.name = a.title || c.name, l.populateItinerary({
                            index: o,
                            model: {
                                placeModel: c
                            }
                        })
                    })) : l.populateItinerary({
                        index: l.itineraryItemIndex,
                        model: {
                            basicModel: a
                        }
                    }), "directions" === e.current.$$route.specialPanelClass && f && b.track("directions", "search performed", {
                        prop36: l.itineraryItems[l.itineraryItemIndex].query,
                        eVar36: l.itineraryItems[l.itineraryItemIndex].query,
                        prop37: l.suggestions && l.suggestions.items ? l.suggestions.items.length : 0,
                        eVar37: l.suggestions && l.suggestions.items ? l.suggestions.items.length : 0,
                        prop38: f,
                        eVar38: f
                    }, "event14"), l.suggestions = [], s()
                }, l.blurItineraryItem = function(b, c) {
                    g(function() {
                        b.focussed = !1, a.directions.itineraryOverhaul && 0 > o && !b.coordinate && b.query.trim().length > 0 && x(b), l.itineraryItemFocused && l.itineraryItemIndex === c && (l.itineraryItemFocused = !1, r())
                    }, 200)
                }, l.selectFromSearchList = function() {
                    var a, b = l.suggestions && l.suggestions.items && l.suggestions.items.length > 0,
                        c = l.recents && l.recents.length > 0,
                        d = l.hoveredResultIndex;
                    c && 0 > d ? a = l.recents[l.recents.length + d].data : b && d >= 0 && (a = l.suggestions.items[d]), a && (l.selectSearchElement(a, c ? "recent" : "suggestion"), l.itineraryItemFocused = !1, r()), l.itineraryItemIndex === l.itineraryItems.length - 1 && g(function() {
                        var a = f[0].querySelector("#itinerary_item_input_" + l.itineraryItemIndex);
                        a.blur()
                    })
                }, l.trackExpandStopoversClick = function() {
                    b.click("routing:stopovers:expanded:click")
                }, l.dragCallback = function(a, b, c) {
                    p.index = b, p.item = c
                }, l.dragValidator = function(a, b, c) {
                    var d = a.target === b[0];
                    return d &= !(l.itineraryItemIndex === c && !l.itineraryItems[c].coordinate), !!d
                }, l.dropCallback = function(a, c) {
                    if (parseInt(c, 10) !== parseInt(p.index, 10)) {
                        var d = l.itineraryItems.slice(0);
                        d.splice(p.index, 1), d.splice(c, 0, p.item);
                        var e = d.map(function(a, b) {
                            return 0 === b || b === d.length - 1 ? (a.isViaPoint = !1, a.coordinate ? (a.coordinate.via = !1, a.mapCoordinate.via = !1) : a.label = 0 === b ? "From" : "To") : a.label = "via", a.resetUrl(), a
                        });
                        l.$apply(function() {
                            l.itineraryItems = e.slice(0)
                        }), b.click("routing:itineraryItems:dragNdrop")
                    }
                }, l.hoverSuggestion = function(a) {
                    l.hoveredResultIndex = a
                }, l.prepareSetMyLocation = function(a) {
                    b.track("position", "my position in directions panel");
                    var c = l.itineraryItems[a];
                    c && (c.isMyLocation = !0, c.query = "Finding your location…"), l.setMyLocation({
                        index: a
                    }).then(function() {
                        r(), s(), l.locationInRoute = !0
                    })
                };
                var q, r = function() {
                        l.suggestions = [], l.recents = [], l.hoveredResultIndex = null
                    },
                    s = function() {
                        var a = l.itineraryItems[l.itineraryItemIndex + 1],
                            b = "#itinerary_item_input_" + (l.itineraryItemIndex + 1);
                        return a ? void g(function() {
                            f[0].querySelector(b).focus()
                        }) : void l.itineraryItems.some(function(a) {
                            return a.getCoordinate() ? void 0 : (a.focussed = !0, !0)
                        })
                    },
                    t = function(a, b) {
                        d.getItems(a, d.types.place, b).then(function(b) {
                            l.recents = w(b), l.hoveredResultIndex = "" !== a ? -l.recents.length : null
                        })
                    },
                    u = function(a, b) {
                        return b.length < 3 ? (a.lastQuery = "", l.suggestions = [], void l.removeItinerary({
                            item: a
                        })) : void(b !== a.lastQuery && (o = -1, a.lastQuery = b, c.search({
                            size: 5,
                            q: a.lastQuery,
                            center: n.getCenter(),
                            viewBounds: n.getViewBounds()
                        }).then(function(c) {
                            var d = c.data;
                            a.query === b && d && d.items && d.items.length > 0 && (l.suggestions = v(d, l.recents), l.suggestions.length > 0 && (l.hoveredResultIndex = 0))
                        })))
                    },
                    v = function(a, b) {
                        if (!b || !b.length) return a;
                        var c = b.map(function(a) {
                                return a.data.id
                            }),
                            d = [];
                        return a.items.forEach(function(a) {
                            -1 === c.indexOf(a.id) && d.push(a)
                        }), a.items = d, a
                    },
                    w = function(a) {
                        return a.map(function(a) {
                            var b = angular.copy(a),
                                c = b.data.place.position;
                            return b.data.place.position = new i.geo.Point(c.latitude, c.longitude), b
                        })
                    },
                    x = function(a) {
                        var b = a.query.trim();
                        c.search({
                            size: 5,
                            q: b,
                            center: n.getCenter(),
                            viewBounds: n.getViewBounds()
                        }).then(function(a) {
                            var b = a.data.items;
                            b.length > 0 && (l.selectSearchElement(b[0], "autoselect"), k.conversion("itineraryImprovements"))
                        })
                    },
                    y = function(a) {
                        h.document.activeElement && h.document.activeElement.dataset && "hereAutoselect" in h.document.activeElement.dataset && h.document.activeElement.blur(), a && l.$apply()
                    },
                    z = function(a) {
                        return function(b) {
                            b && b.target && b.target !== a && !a.contains(b.target) && y(b)
                        }
                    },
                    A = angular.element(h.document.querySelector("body"));
                A && (q = z(m[0]), A.on("mousedown", q), A.on("touchstart", q)), l.$on("$destroy", function() {
                    A && (A.off("mousedown", q), A.off("touchstart", q))
                })
            }
        }
    }]), angular.module("hereApp.directions").controller("ManeuverPreviewCtrl", ["$scope", "markerService", "$templateCache", "markerIcons", "mapContainers", "$sce", "maneuverIcons", "mapsjs", "hereBrowser", function(a, b, c, d, e, f, g, h, i) {
        var j, k, l, m = this,
            n = null,
            o = e.directions,
            p = ["depart", "arrive"];
        a.maneuverIcon = g.getTrustedSVG, a.fixatedManeuver = null, m.maneuverToIgnore = function(a) {
            return p.indexOf(a.action) >= 0
        }, m.showRouteStepMarker = function(c, e) {
            var f;
            f = n === c.id, f |= a.fixatedManeuver === c.id, f |= m.maneuverToIgnore(c), f || i.touch && !e || (a.hoverManeuver = c.id, n = c.id, k && b.removeMarker(k, o), k = b.createMarker({
                maneuver: !0,
                icons: d.maneuvers(c.action),
                position: c.position,
                flag: {
                    maneuverIcon: g.getSVG(c.action),
                    knife: d.knife("standard"),
                    description: c.instruction,
                    closeCallback: function() {
                        a.fixatedManeuver === c.id && (a.fixatedManeuver = null), n === c.id && (n = null), b.removeMarker(l, o), k = null, a.hoverManeuver = null
                    }
                }
            }), o.addObject(k), k.setZIndex(10))
        }, m.hideRouteStepMarker = function(c) {
            n === c.id && (a.hoverManeuver = null, n = !1, k && (b.removeMarker(k, o), k = null))
        }, m.zoomToManeuver = function(a) {
            var b = a.boundingBox.topLeft,
                c = a.boundingBox.bottomRight,
                d = new h.geo.Rect(b.latitude, b.longitude, c.latitude, c.longitude);
            j.setViewBounds(d, !i.isiOS && !i.isAndroid)
        }, m.fixateRouteStepMarker = function() {
            l = k, l && (b.getWrapped(l).addFlag(), b.getWrapped(l).flagScope.hideOnClickOutside = !0, l.setVisibility(!1), k = null)
        }, m.maneuverDetails = function(c) {
            if (!m.maneuverToIgnore(c)) {
                if (m.zoomToManeuver(c), a.fixatedManeuver !== c.id) l && b.getWrapped(l).flagOpened && b.removeMarker(l, o), i.touch && m.showRouteStepMarker(c, !0);
                else {
                    if (l && b.getWrapped(l).flagOpened) return;
                    l ? k = l : m.showRouteStepMarker(c, !0)
                }
                a.fixatedManeuver = c.id, m.fixateRouteStepMarker()
            }
        }, m.initialize = function(b) {
            j = b, a.showRouteStepMarker = m.showRouteStepMarker, a.hideRouteStepMarker = m.hideRouteStepMarker, a.maneuverDetails = m.maneuverDetails
        }, a.whenMapIsReady && a.whenMapIsReady.then(function(a) {
            m.initialize(a)
        }), a.$on("$destroy", function() {
            l && b.getWrapped(l).flagScope.closeInstantly()
        })
    }]), angular.module("hereApp.directions").controller("ptCtrl", ["$scope", function(a) {
        var b = this;
        a.ptWalkSegmentColor = "#1584e2", a.iconsMap = {
            railRegional: "railMetroRegional",
            trainRegional: "railMetroRegional",
            water: "ferry"
        }, b.initialize = function() {
            a.$watch("currentRoute", b.syncCurrentRouteManeuvers)
        }, b.syncCurrentRouteManeuvers = function() {
            a.linesMap = {}, a.currentRoute.publicTransportLine.forEach(function(b) {
                a.linesMap[b.id] = b
            });
            var c = a.getActiveTransportModes ? a.getActiveTransportModes()[0].type : "publicTransportTimeTable";
            a.routeManeuvers = b.getManeuversForRoute(a.currentRoute, c)
        }, b.getManeuverMiddlePointsData = function(b, c) {
            var d, e = {},
                f = [];
            return "enter" === c.action && c.line.length > 0 && (b.link && (f = b.link.filter(function(a) {
                return a.line === c.line
            })), f.length > 1 && (d = a.linesMap[c.line], e = {
                points: f,
                lineName: d.lineName,
                iconPath: "/features/directions/img/maneuvers/" + (a.iconsMap[d.type] || d.type) + ".svg",
                type: d.type,
                baseTime: c.travelTime
            })), e
        }, b.getManeuverInstructionPrefix = function(a, b) {
            return b && "leave" === b.action ? b.stopName || "" : a && a.stopName ? a.stopName : ""
        }, b.getManeuverInstruction = function(a, b, c) {
            var d = a.maneuver[b],
                e = b === a.maneuver.length - 1,
                f = d.instruction;
            return e && c && (f += "<br>" + c.instruction), f = f.replace(/<\/span>.$/, "</span>"), "enter" === d.action && "leave" === c.action && (f += c.instruction), f
        }, b.getManeuverLineColor = function(b, c) {
            "continue" === b.action && "leave" === c.action && (b = c);
            var d = a.linesMap[b && b.line];
            return d && d.lineBackground
        }, b.getPreviousManeuver = function(a, b, c) {
            if (c > 0) return a.leg[b].maneuver[c - 1];
            if (b > 0) {
                var d = a.leg[b - 1].maneuver;
                return d[d.length - 1]
            }
            return void 0
        }, b.getNextManeuver = function(a, b, c) {
            return c < a.leg[b].maneuver.length - 1 ? a.leg[b].maneuver[c + 1] : b < a.leg.length - 1 ? a.leg[b + 1].maneuver[0] : void 0
        }, b.canDisplayManeuver = function(a, b, c, d) {
            var e;
            return e = "leave" !== a.action && b.length > 2, e = e && (0 === c || c > 0 && d > 0)
        }, b.getManeuversForRoute = function(c, d) {
            var e = [];
            return c && c.leg && c.leg.length > 0 && c.leg[0].maneuver && c.leg[0].maneuver.length > 0 && d ? (c.leg.forEach(function(d, f) {
                d.maneuver.forEach(function(g, h) {
                    var i, j, k, l = b.getPreviousManeuver(c, f, h),
                        m = b.getNextManeuver(c, f, h),
                        n = e[e.length - 1],
                        o = b.getManeuverInstruction(d, h, m),
                        p = b.getManeuverInstructionPrefix(g, l),
                        q = b.getManeuverMiddlePointsData(d, g),
                        r = b.canDisplayManeuver(g, o, f, h);
                    if (r && (i = {
                            id: h,
                            legId: f,
                            action: g.action,
                            time: g.time,
                            lineColor: b.getManeuverLineColor(g, l) || a.ptWalkSegmentColor,
                            lineName: g.line || "",
                            previousLineColor: n ? n.lineColor : a.ptWalkSegmentColor,
                            previousAction: n ? n.action : "",
                            instruction: o,
                            instructionPrefix: p,
                            middlePointsData: q,
                            expanded: !1
                        }, e.push(i)), q.points && q.points.length > 1)
                        for (j = q.points.length, k = 0; j - 1 > k; k++) e.push({
                            lineColor: i.lineColor,
                            action: "change_PT",
                            container: i,
                            instruction: q.points[k].nextStopName
                        })
                })
            }), e) : []
        }, b.initialize()
    }]), angular.module("hereApp.directions").factory("recentRouteStorage", ["$window", "mapUtils", function(a, b) {
        function c(a, b) {
            var c = -1;
            return a.forEach(function(a, d) {
                var e = a.itineraryItems,
                    f = b.itineraryItems;
                e[0].name === f[0].name && e[1].name === f[1].name && (c = d)
            }), c
        }

        function d(a) {
            var b = a.itineraryItems.map(function(a) {
                var b = a.getCoordinate();
                return {
                    name: a.getTitle(!0),
                    center: {
                        latitude: b.lat,
                        longitude: b.lng
                    },
                    placeId: a.isPlace() ? a.getId() : "",
                    myLocation: !!a.geolocationModel
                }
            });
            return a.name ? {
                itineraryItems: b,
                mode: a.mode,
                name: a.name
            } : {
                itineraryItems: b,
                mode: a.mode
            }
        }
        var e = {};
        return e.storeRoute = function(b, f) {
            var g = e.retrieveRoutesFromStorage(b),
                h = d(f),
                i = c(g, h);
            i > -1 && g.splice(i, 1), 5 === g.length && (g = g.slice(1)), g.push(h);
            try {
                a.localStorage.setItem(b, JSON.stringify(g))
            } catch (j) {}
        }, e.removeRoute = function(b, c) {
            var d = e.retrieveRoutesFromStorage(b);
            c > -1 && d.splice(d.length - c - 1, 1);
            try {
                a.localStorage.setItem(b, JSON.stringify(d))
            } catch (f) {}
        }, e.retrieveRoutesFromStorage = function(c) {
            try {
                var d = JSON.parse(a.localStorage.getItem(c) || "[]");
                return d.forEach(function(a) {
                    a.itineraryItems.forEach(function(a) {
                        a.center = b.makePoint(a.center)
                    })
                }), d
            } catch (e) {
                return []
            }
        }, e
    }]), angular.module("hereApp.directions").directive("hereRouteCard", ["Features", "routesParser", "$templateCache", "$sce", "routingUtilsFactory", function(a, b, c, d, e) {
        return {
            replace: !0,
            restrict: "A",
            templateUrl: "features/directions/routeCard/route-card.html",
            scope: !1,
            link: function(a) {
                a.getRouteSegmentOverview = function(c) {
                    if (c.mode) {
                        var d, f = {
                            type: "pedestrian",
                            title: "",
                            icon: "/features/directions/img/modes/pedestrian.svg"
                        };
                        b.routeModeIsPT(c) ? (d = c.publicTransportLine.map(function(a) {
                            return {
                                type: "pt",
                                title: a.lineName,
                                color: a.lineBackground || "#1584e2"
                            }
                        }), "leave" !== c.leg[0].maneuver[1].action && d.unshift(f), "enter" !== c.leg[0].maneuver.slice(-2)[0].action && d.push(f), 2 === d.length && "pedestrian" === d[0].type && "pedestrian" === d[1].type && (d = [f]), a.segments = d) : a.segments = e.getLongestDriveRouteSegments(c, 2)
                    }
                }, a.getSvgForRouteMode = function(b) {
                    var e, f, g, h = a.transportModes.length;
                    for (e = void 0 === b.storedRoute ? b.mode.transportModes[0] : b.storedRoute.mode[0], "publicTransport" === e && (e = "publicTransportTimeTable"); h--;) {
                        var i = a.transportModes[h];
                        if (i.type === e) {
                            f = i.icon;
                            break
                        }
                    }
                    return g = c.get(f).replace(/#ffffff/gi, "#BCBCBC").replace(/#fff/gi, "#BCBCBC"), d.trustAsHtml(g)
                }, a.getDepartTime = function(a) {
                    return a.leg[0].maneuver[0].time
                }, a.getArriveTime = function(a) {
                    var b = a.leg.length - 1,
                        c = a.leg[b],
                        d = c.maneuver[c.maneuver.length - 1];
                    return d.time
                }, a.getRouteSegmentOverview(a.route)
            }
        }
    }]), angular.module("hereApp.directions").factory("routeLinePopupFactory", ["$document", "$compile", "$rootScope", "Features", "routesParser", function(a, b, c, d, e) {
        function f(a, b, c) {
            if (a) {
                for (var d, e = 0, f = a.length; f > e; e++)
                    if (a[e][c] === b) {
                        d = a[e];
                        break
                    }
                return d
            }
        }
        var g, h, i = "Stopped traffic",
            j = "Queuing traffic",
            k = {};
        return k.template = '<div id="route_info" data-ng-show="visible" data-ng-style="{top:top, left:left}" class="route_info"><div data-ng-bind-html="header"></div><div>{{message}}</div></div>', k.getRoad = function(a, b, c) {
            var d = f(e.getRouteLegLinks(a), b, "linkId"),
                g = f(e.getRouteManeuvers(a), c, "maneuverId"),
                h = d.roadName || g.roadName || d.roadNumber;
            return d && 1 === d.functionalClass && (h = d.roadNumber + (d.roadName ? " : " + d.roadName : "")), h
        }, k.showInfo = function(a, b, c) {
            var d = "#EE0000" === b.color;
            g.top = c.y + "px", g.left = c.x + "px", g.visible = !0, b.linkId ? (g.header = this.getRoad(a, b.linkId, b.maneuverId), g.message = d ? i : j) : b.lineName && (g.header = b.lineName, g.message = ""), g.$digest()
        }, k.create = function() {
            return void 0 === g && (g = c.$new(), g.showInfo = k.showInfo.bind(k)), void 0 === h && (h = b(k.template)(g), a.find("body").append(h)), g
        }, k
    }]), angular.module("hereApp.directions").factory("routeOptions", ["$window", function(a) {
        var b = {},
            c = "ROUTE_OPTIONS",
            d = a.localStorage;
        return b.options = [{
            id: "tunnel",
            type: "tunnel",
            label: "Tunnels",
            icon: "tunnel",
            mode: ["car"]
        }, {
            id: "dirtRoad",
            type: "dirtRoad",
            label: "Unpaved roads",
            icon: "unpaved-road",
            mode: ["car"]
        }, {
            id: "tollroad",
            type: "tollroad",
            label: "Toll roads",
            icon: "toll-gate",
            mode: ["car"]
        }, {
            id: "boatFerryDrive",
            type: "boatFerry",
            label: "Ferries",
            icon: "ferry-terminal",
            mode: ["car"]
        }, {
            id: "boatFerryWalk",
            type: "boatFerry",
            label: "Ferries",
            icon: "ferry-terminal",
            mode: ["pedestrian"]
        }, {
            id: "water",
            type: "water",
            label: "Ferries",
            icon: "ferry-terminal",
            mode: ["publicTransportTimeTable"],
            transportTypes: "water"
        }, {
            id: "motorway",
            type: "motorway",
            label: "Motorways",
            icon: "highway",
            mode: ["car"]
        }, {
            id: "railFerry",
            type: "railFerry",
            label: "Motorail trains",
            icon: "motorail-trains",
            mode: ["car"]
        }, {
            id: "buses",
            type: "buses",
            label: "Buses",
            icon: "bus",
            mode: ["publicTransportTimeTable"],
            transportTypes: "busPublic,busTouristic,busIntercity,busExpress"
        }, {
            id: "metros",
            type: "metros",
            label: "Underground",
            icon: "metro",
            mode: ["publicTransportTimeTable"],
            transportTypes: "railMetro"
        }, {
            id: "streetcars",
            type: "streetcars",
            label: "Trams",
            icon: "tram",
            mode: ["publicTransportTimeTable"],
            transportTypes: "railLight"
        }, {
            id: "trains",
            type: "trains",
            label: "Trains",
            icon: "train",
            mode: ["publicTransportTimeTable"],
            transportTypes: "trainRegional,trainIntercity,trainHighSpeed,railMetroRegional,railRegional"
        }], b.options.forEach(function(a) {
            a.checked = !0
        }), b.saveOptions = function(a) {
            var b = a.map(function(a) {
                return {
                    id: a.id,
                    checked: a.checked
                }
            });
            try {
                d.setItem(c, JSON.stringify(b))
            } catch (e) {}
        }, b.getRouteOptions = function() {
            var a;
            try {
                a = d.getItem(c)
            } catch (e) {}
            return a && (a = JSON.parse(a), a.forEach(function(a) {
                b.options.forEach(function(b) {
                    a.id === b.id && (b.checked = a.checked)
                })
            })), angular.copy(b.options)
        }, b.optionsHaveChanged = function(a) {
            var b, e = !1;
            try {
                b = d.getItem(c)
            } catch (f) {}
            return b && (b = JSON.parse(b), b.forEach(function(b) {
                a.forEach(function(a) {
                    e || b.id !== a.id || b.checked !== a.checked && (e = !0)
                })
            })), e
        }, b
    }]), angular.module("hereApp.directions").factory("routeTrafficIncidents", ["$http", "$log", "$q", "Config", "mapContainers", "trafficIncidents", "mapsjs", "markerIcons", "markerService", "capitalizeFilter", function(a, b, c, d, e, f, g, h, i, j) {
        var k = {
                container: e.trafficIncidents,
                _MAX_CORRIDOR_LENGTH: 5e5
            },
            l = {
                accident: "incident-accident",
                disabledvehicle: "incident-accident",
                congestion: "incident-congestion",
                construction: "incident-construction",
                roadhazard: "incident-roadhazard",
                roadclosure: "incident-roadclosure",
                lanerestriction: "incident-lanerestriction",
                generic: "incident-generic"
            };
        return k._incidentTitle = "{{incidentType}} on {{street}} {{direction}}", k._incidentTypes = {
            accident: "Accident",
            congestion: "Congestion",
            "disabled vehicle": "Stalled vehicle",
            "road hazard": "Road hazard",
            construction: "Road works",
            "planned event": "Planned event",
            "mass transit": "Public transport",
            "other news": "Other news",
            weather: "Weather",
            road_closure: "Road closure",
            lane_restriction: "Lane restriction",
            miscellaneous: "Disruption"
        }, k._getIncidentType = function(a) {
            return k._incidentTypes[a.toLowerCase()]
        }, k.getIncidentTitle = function(a) {
            var b, c, d, e = k._incidentTitle,
                f = k._getIncidentType(a.TRAFFIC_ITEM_TYPE_DESC);
            return a.LOCATION.DEFINED ? (b = a.LOCATION.DEFINED.ORIGIN, c = b.ROADWAY.DESCRIPTION[0].value, d = j(b.DIRECTION.DESCRIPTION[0].value), e = e.replace("{{incidentType}}", f).replace("{{street}}", c).replace("{{direction}}", d)) : e = f, e
        }, k.displayIncidents = function(a) {
            if (a) {
                var b = [],
                    c = [];
                return a.filter(function(a) {
                    if (void 0 === a.CRITICALITY || "3" === a.CRITICALITY.ID) return !1;
                    a.icon = l[a.TRAFFIC_ITEM_TYPE_DESC ? a.TRAFFIC_ITEM_TYPE_DESC.replace(" ", "").replace("_", "").toLowerCase() : "generic"] || l.generic, a.criticality = "major", a.CRITICALITY && "minor" === a.CRITICALITY.DESCRIPTION && (a.criticality = "minor"), a.CRITICALITY && "critical" === a.CRITICALITY.DESCRIPTION && (a.criticality = "critical"), a.TRAFFIC_ITEM_DETAIL && a.TRAFFIC_ITEM_DETAIL.ROAD_CLOSED && (a.icon = l.roadclosure, a.criticality = "critical");
                    var d = a.LOCATION.GEOLOC.ORIGIN,
                        e = i.createMarker({
                            incident: !0,
                            icons: h.trafficIncidents(a.icon, a.criticality),
                            position: d,
                            flag: {
                                title: k.getIncidentTitle(a),
                                description: a.TRAFFIC_ITEM_DESCRIPTION[0].value,
                                startTime: a.START_TIME,
                                endTime: a.END_TIME
                            },
                            onMouseEnter: a.onMouseEnter,
                            onMouseLeave: a.onMouseLeave
                        }),
                        f = a.TMC_ID;
                    return b.push(e), c[f] || (c[f] = []), c[f].push(e), !0
                }), b.length && k.container.addObjects(b), c
            }
        }, k.displayClusteredIncidents = function(a) {
            if (a) {
                var b = [],
                    c = g.clustering.DataPoint,
                    d = [];
                return a.filter(function(a) {
                    var e, f, g, i;
                    return void 0 === a.CRITICALITY || "3" === a.CRITICALITY.ID ? !1 : (a.icon = l[a.TRAFFIC_ITEM_TYPE_DESC ? a.TRAFFIC_ITEM_TYPE_DESC.replace(" ", "").replace("_", "").toLowerCase() : "generic"] || l.generic, e = a.CRITICALITY.DESCRIPTION, a.criticality = "minor" === e || "critical" === e ? e : "major", a.TRAFFIC_ITEM_DETAIL && a.TRAFFIC_ITEM_DETAIL.ROAD_CLOSED && (a.icon = l.roadclosure, a.criticality = "critical"), f = a.LOCATION.GEOLOC.ORIGIN, g = {
                        incident: !0,
                        icons: h.trafficIncidents(a.icon, a.criticality),
                        position: f,
                        flag: {
                            title: k.getIncidentTitle(a),
                            description: a.TRAFFIC_ITEM_DESCRIPTION[0].value,
                            startTime: a.START_TIME,
                            endTime: a.END_TIME
                        },
                        onMouseEnter: a.onMouseEnter,
                        onMouseLeave: a.onMouseLeave
                    }, i = a.TMC_ID, d.push(new c(f.lat, f.lng, 1, g)), b[i] || (b[i] = []), !0)
                }), {
                    markers: b,
                    dataPoints: d
                }
            }
        }, k.getTrafficIncidentsForRoutes = function(a, b) {
            var d = a.map(function(a) {
                return a.summary.distance < k._MAX_CORRIDOR_LENGTH ? f.getIncidentsForShape(a.shape, b).then(void 0, function() {
                    return void 0
                }) : void 0
            });
            return c.all(d)
        }, k
    }]), angular.module("hereApp.directions").factory("routesParser", ["mapsjs", "utilityService", "hereBrowser", function(a, b, c) {
        function d(a, b) {
            a.forEach(function(a) {
                a.color = b
            })
        }
        var e = {};
        e._publicTransportLineIndex = -1, e.strokeColor = "rgba(22, 82, 180, 1.0)", e.alternativeRouteColor = "rgba(77, 144, 193, 0.6)", e.mediumJamFactorColor = "rgba(252, 178, 43, 1.0)", e.highJamFactorColor = "rgba(238, 0, 0, 1.0)", e.normalOpacity = "0.6", e.trafficOpacity = "0.6", e.previewOpacity = "0.6", e._groupManeuversByMode = function(a) {
            var b = [],
                c = [b];
            return a.forEach(function(a) {
                "enter" === a.action ? 0 === b.length ? b.push(a) : (b = [a], c.push(b)) : "leave" === a.action ? (b.push(a), b = [], c.push(b)) : b.push(a)
            }), c
        }, e._getManeuverShapes = function(a, b, c) {
            return a.shape.slice(2 * b, 2 * c + 2)
        }, e._getManeuverLineColor = function(a, c) {
            if (["enter", "change"].indexOf(c.action) > -1) {
                e._publicTransportLineIndex += 1;
                var d = a.publicTransportLine[e._publicTransportLineIndex];
                return d && d.lineForeground ? "rgba(" + b.cssColorToNumbers(d.lineForeground).concat(e.normalOpacity).join() + ")" : e.strokeColor.replace("1.0", e.normalOpacity)
            }
            return e.strokeColor.replace("1.0", e.normalOpacity)
        }, e._parseLinkTrafficInformation = function(a) {
            for (var b, c, f = [], g = a.length, h = [], i = 0, j = a.length - 1; j >= 0; j--) {
                var k = a[j];
                if (k.dynamicSpeedInfo.trafficTime !== k.dynamicSpeedInfo.baseTime) {
                    var l = Math.floor(k.dynamicSpeedInfo.jamFactor),
                        m = j;
                    if (l >= 4) {
                        var n = "#000000";
                        if (8 > l ? n = e.mediumJamFactorColor : 10 > l && (n = e.highJamFactorColor), angular.isUndefined(c) && (c = n), b = {
                                shape: k.shape,
                                linkId: k.linkId,
                                color: n,
                                jamFactor: l,
                                roadName: k.roadName,
                                roadNumber: k.roadNumber,
                                trafficTime: k.dynamicSpeedInfo.trafficTime,
                                trafficSpeed: k.dynamicSpeedInfo.trafficSpeed,
                                baseTime: k.dynamicSpeedInfo.baseTime,
                                speedAverage: k.dynamicSpeedInfo.trafficSpeed,
                                length: k.length,
                                jamCount: i
                            }, n === c) h.push(b);
                        else if (h.length > 2 || g - m > 1 || 0 === f.length) f = f.concat(h), c = n, i += 1, b.jamCount = i, h = [b];
                        else {
                            var o = f[f.length - 1].color;
                            h.push(b), d(h, o), c = o, i += 1
                        }
                    } else i += 1
                }
                g = j
            }
            return f = f.concat(h)
        }, e.getRouteManeuvers = function(a) {
            return [].concat.apply([], a.leg.map(function(a) {
                return a.maneuver
            }))
        }, e.getRouteLegLinks = function(a) {
            return a.leg[0].link ? [].concat.apply([], a.leg.map(function(a) {
                return a.link
            })) : null
        }, e._getRouteSegments = function(a) {
            var b, c = [];
            if (e.routeModeIsPT(a)) e._publicTransportLineIndex = -1, b = e._groupManeuversByMode(e.getRouteManeuvers(a)), c = b.map(function(b) {
                return {
                    shape: e._getManeuverShapes(a, b[0].firstPoint, b[b.length - 1].lastPoint),
                    color: e._getManeuverLineColor(a, b[0]),
                    lineName: "enter" === b[0].action ? /^.*<span.*"line"\>(.*)<\/span\>.*$/g.exec(b[0].instruction)[1] : null
                }
            });
            else {
                var d = e.getRouteLegLinks(a),
                    f = d && e._parseLinkTrafficInformation(d),
                    g = !1;
                f && f.length > 0 && (g = !0, c.push({
                    links: f
                })), c.push({
                    shape: a.shape,
                    color: e.strokeColor.replace("1.0", g ? e.trafficOpacity : e.normalOpacity)
                })
            }
            return c
        }, e._parseRoute = function(a) {
            var b = e._getRouteSegments(a);
            return b.map(function(a) {
                var b = a.links;
                return b && b.length ? b.map(function(a) {
                    return e.createPolylineWithShapeAndColor({
                        shape: a.shape,
                        color: a.color,
                        linkId: a.linkId,
                        jamFactor: a.jamFactor,
                        roadName: a.roadName,
                        roadNumber: a.roadNumber,
                        trafficTime: a.trafficTime,
                        trafficSpeed: a.trafficSpeed,
                        baseTime: a.baseTime,
                        speedAverage: a.speedAverage,
                        jamCount: a.jamCount,
                        length: a.length
                    })
                }) : e.createPolylineWithShapeAndColor({
                    shape: a.shape,
                    color: a.color,
                    lineName: a.lineName
                })
            })
        }, e.routeModeIsPT = function(a) {
            return a && /^publicTransport/.test(a.mode.transportModes[0])
        }, e.getRouteLineWidthByZoomLevel = function(a) {
            var b = 5;
            if (c.isiOS) return b;
            switch (a = Math.round(a)) {
                case 8:
                case 9:
                case 10:
                    b = 6;
                    break;
                case 11:
                case 12:
                case 13:
                    b = 7;
                    break;
                case 14:
                case 15:
                    b = 10;
                    break;
                case 16:
                case 17:
                    b = 13;
                    break;
                case 18:
                    b = 15;
                    break;
                case 19:
                    b = 18;
                    break;
                case 20:
                    b = 20;
                    break;
                default:
                    b = 5
            }
            return b
        }, e.setRouteLineWidth = function(a, b) {
            function c(a) {
                if (Array.isArray(a)) return a.forEach(function(a) {
                    c(a)
                });
                var d = angular.extend({}, a.getStyle());
                d.lineWidth = e.getRouteLineWidthByZoomLevel(b), d.strokeColor && (e.mediumJamFactorColor === d.strokeColor || e.highJamFactorColor === d.strokeColor) && (d.lineWidth += 6), a.setStyle(d)
            }
            return a && a.length && a.forEach(c), a
        }, e.createPolylineWithShapeAndColor = function(b) {
            var c, d, f, g, h, i, j;
            return c = b.shape, d = b.color, f = b.linkId, g = b.lineWidth, h = a.geo.Strip.fromLatLngArray(c), j = {
                lineCap: (d !== e.strokeColor && f, "round"),
                lineJoin: "round",
                strokeColor: d || e.strokeColor
            }, angular.isUndefined(g) || (j.lineWidth = g), i = new a.map.Polyline(h, {
                style: j
            }), i.color = d, i.linkId = f, i.lineName = b.lineName, i.jamFactor = b.jamFactor, i.speedAverage = b.speedAverage, i.roadName = b.roadName, i.roadNumber = b.roadNumber, i.trafficTime = b.trafficTime, i.trafficSpeed = b.trafficSpeed, i.baseTime = b.baseTime, i.jamCount = b.jamCount, i.length = b.length, i
        }, e.parseRoutes = function(a) {
            return a ? a.map(e._parseRoute) : void 0
        }, e.getSegmentColorWithOpacity = function(a, b, c) {
            var d = a,
                f = e.mediumJamFactorColor,
                g = e.mediumJamFactorColor.replace("1.0", "0"),
                h = e.highJamFactorColor,
                i = e.highJamFactorColor.replace("1.0", "0");
            if (c) switch (a) {
                case h:
                    d = i;
                    break;
                case f:
                    d = g;
                    break;
                case i:
                    d = i;
                    break;
                case g:
                    d = g;
                    break;
                default:
                    d = e.alternativeRouteColor
            } else switch (a) {
                case i:
                    d = h;
                    break;
                case g:
                    d = f;
                    break;
                default:
                    d = b
            }
            return d
        }, e.setPolylineOpacity = function(a, b) {
            function c(a, f) {
                if (angular.isArray(a)) return a.forEach(function(a, b) {
                    c(a, b)
                });
                var g = angular.extend({}, a.getStyle()),
                    h = d[f] && d[f].color ? d[f].color : null;
                g.strokeColor = e.getSegmentColorWithOpacity(g.strokeColor, h, b), a.setStyle(g)
            }
            var d = a;
            a && a.length && a.forEach(c)
        }, e.maneuverCount = function(a) {
            var b = 0;
            return a.forEach(function(a) {
                b += a.maneuver.length
            }), b
        };
        var f = function(a, b) {
                return 0 === b ? 0 === a : Math.abs(1 - a / b).toFixed(2) <= .15
            },
            g = function(a, b) {
                var c = !1;
                return a.forEach(function(a) {
                    f(a.summary.trafficTime, b.summary.trafficTime) && f(a.summary.distance, b.summary.distance) && f(e.maneuverCount(a.leg), e.maneuverCount(b.leg)) && (c = !0)
                }), c
            };
        return e.filterDriveRoutes = function(a, b) {
            if ("ERROR" === b || !a) return a;
            b.THIS_IS_A_TRAFFIC_ROUTE = !0;
            var c = a.filter(function(a) {
                var b = !1;
                return a.note.forEach(function(a) {
                    ("routingOptionViolated" === a.code && "blockedRoute" === a.text || "closure" === a.code) && (b = !0)
                }), !b
            });
            return 0 === c.length ? [b] : (g(c, b) || c.push(b), c = c.sort(function(a, b) {
                return a.summary.trafficTime - b.summary.trafficTime
            }), 4 === c.length && (c = c.slice(0, 3)), c)
        }, e.parseFlightRoutes = function(a) {
            var b, c, d = [],
                e = a.Places,
                f = a.Currencies,
                g = a.Carriers,
                h = [],
                i = 0,
                j = !1,
                k = function(a) {
                    var c = a.OutboundLeg;
                    c.DepartureDate === b.DepartureDate && c.OriginId === b.OriginId && c.DestinationId === b.DestinationId && c.CarrierIds[0] === b.CarrierIds[0] && (j = !0)
                };
            do b = a.Quotes[i], c = b && b.OutboundLeg, j = !1, c && (d.forEach(k), j || d.push(b)), i++; while (i < a.Quotes.length && d.length < 3);
            return d.forEach(function(a) {
                var b = a.OutboundLeg;
                if (b) {
                    var c = {
                        departureDate: Date.create(b.DepartureDate),
                        price: a.MinPrice,
                        direct: a.Direct
                    };
                    e.forEach(function(a) {
                        a.PlaceId === b.OriginId ? c.origin = a : a.PlaceId === b.DestinationId && (c.destination = a)
                    }), g.forEach(function(a) {
                        a.CarrierId === b.CarrierIds[0] && (c.carrier = a)
                    }), c.currencies = f[0], h.push(c)
                }
            }), h
        }, e
    }]), angular.module("hereApp.directions").factory("rubberBanding", ["$rootScope", "mapUtils", "ItineraryItem", "markerService", "geoCoder", "routing", "mapsjs", "routesParser", "mapContainers", "routeTrafficIncidents", "$interval", "$document", function(a, b, c, d, e, f, g, h, i, j, k, l) {
        var m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E = {},
            F = !1,
            G = [],
            H = [],
            I = null,
            J = 0,
            K = null,
            L = !1,
            M = i.rubberBanding,
            N = {
                1: 50312,
                2: 25156,
                3: 12578,
                4: 6289,
                5: 3145,
                6: 1300,
                7: 786,
                8: 393,
                9: 197,
                10: 98,
                11: 49,
                12: 25,
                13: 12,
                14: 6,
                15: 3,
                16: 2,
                17: 1,
                18: 1,
                19: 1,
                20: 1,
                21: 1,
                22: 1,
                23: 1
            };
        return a.whenMapIsReady.then(function(a) {
            m = a, A = m.getViewModel(), n = m.getViewPort()
        }), E.initialise = function(a, b) {
            x = a, w = b
        }, E.addHandle = function() {
            if (!C) {
                var a = n.element;
                C = l[0].createElement("div"), C.className = "route_handle", a.appendChild(C), m.getElement().style.cursor = "pointer", C.style.visibility = "visible"
            }
        }, E.removeHandle = function() {
            C && (angular.element(l[0].querySelectorAll(".route_handle")).remove(), C.style.visibility = "hidden", m.getElement().style.cursor = "default", C = null)
        }, E.setDraggablePolyline = function(a) {
            a.draggable = !0, a.addEventListener("pointerenter", function() {
                E.addHandle()
            }), a.addEventListener("pointerleave", function() {
                F || E.removeHandle()
            }), a.addEventListener("pointermove", function(a) {
                var b = C.style,
                    c = a.currentPointer.viewportX - 10,
                    d = a.currentPointer.viewportY - 10;
                b.webkitTransform = b.msTransform = b.transform = "translate(" + c + "px," + d + "px)"
            }), a.addEventListener("dragstart", function(a) {
                E.addHandle(), F = !0, E._polylineDragStart(a)
            }), a.addEventListener("drag", function(a) {
                E._polylineDrag(a)
            }), a.addEventListener("dragend", function(a) {
                F && (F = !1, E.removeHandle(), E._dragEnd(a, null, this), a.stopPropagation())
            }), a.addEventListener("longpress", function(a) {
                a.preventDefault(), a.stopPropagation()
            })
        }, E._getNearestIndex = function(a, c) {
            var d, e, f = c.length,
                g = a.distance(b.makePoint({
                    latitude: c[0],
                    longitude: c[1]
                })),
                h = 0;
            for (d = 3; f > d; d += 3) e = a.distance(b.makePoint({
                latitude: c[d],
                longitude: c[d + 1]
            })), g > e && (h = d / 3, g = e);
            return h
        }, E._extractShape = function(a) {
            var b = [];
            return a.forEach(function(a) {
                b.push.apply(b, a.getStrip().getLatLngAltArray())
            }), b
        }, E._polylineDragStart = function(a) {
            if (B = a.currentPointer, C) {
                var b, c = m.screenToGeo(B.viewportX - 8, B.viewportY - 8),
                    d = w.currentRoute.polylines,
                    e = E._extractShape(d),
                    f = E._getNearestIndex(c, e),
                    g = w.itineraryItems[0].getMapCoordinate(),
                    h = 0,
                    i = 1e-5,
                    j = function(a, b, c) {
                        var d = Math.abs(a.lat - b.lat) <= c,
                            e = Math.abs(a.lng - a.lng) <= c;
                        return d && e
                    };
                if (0 === f) h += 1;
                else
                    for (b = 0; 3 * (f + 1) >= b; b += 3) {
                        var k = {
                            lat: e[b],
                            lng: e[b + 1]
                        };
                        j(g, k, i) && (h += 1, g = w.itineraryItems[h].getMapCoordinate())
                    }
                D = h, z = x.getNumberOfCompletedItineraryItems() === w.itineraryItems.length, C.style.backgroundColor = "#124191", M.setVisibility(!0), E._setupAutoPanning(), E._removeExistingRouteLines(null), a.stopPropagation()
            }
        }, E._polylineDrag = function(a) {
            if (C) {
                var b = C.style,
                    c = a.currentPointer.viewportX - 10,
                    d = a.currentPointer.viewportY - 10;
                b.visibility = "visible", b.webkitTransform = b.msTransform = b.transform = "translate(" + c + "px," + d + "px)", v = m.screenToGeo(B.viewportX, B.viewportY), E._performAutoPan(), E._sendSimpleRouteRequest(), a.stopPropagation()
            }
        }, E.setDraggableMarker = function(a, b, c) {
            a.draggable = !0, a.addEventListener("pointerenter", function() {
                m.getElement().style.cursor = "pointer"
            }), a.addEventListener("pointerleave", function() {
                m.getElement().style.cursor = "default"
            }), a.addEventListener("dragstart", function(a) {
                E._markerDragStart(a, c, this)
            }, !0), a.addEventListener("drag", function(a) {
                E._markerDrag(a, c, this)
            }), a.addEventListener("dragend", function(a) {
                E._dragEnd(a, c, this)
            }), a.addEventListener("longpress", function(a) {
                a.preventDefault(), a.stopPropagation()
            })
        }, E._markerDragStart = function(a, b, c) {
            a.stopPropagation(), B = a.currentPointer, K = b;
            var d, e = a.currentPointer.viewportX,
                f = a.currentPointer.viewportY;
            E._setupAutoPanning(), u = a.target.getPosition(), d = m.geoToScreen(u), G = [], H = [], s = e - d.x, t = f - d.y, z = x.getNumberOfCompletedItineraryItems() === w.itineraryItems.length, M.setVisibility(!0), j.container.setVisibility(!1), w.noSelect = !0, E._removeExistingRouteLines(c)
        }, E._setupAutoPanning = function() {
            o = n.padding, p = n.width, q = n.height, r = Math.min(Math.min(q / 4, p / 4), 80)
        }, E._removeExistingRouteLines = function(a) {
            var b = w.getActiveTransportModes && "publicTransportTimeTable" === w.getActiveTransportModes()[0].type;
            i.directions.forEach(function(c) {
                var d = c instanceof g.map.Polyline,
                    e = c instanceof g.map.Marker,
                    f = e && c.__expandoWrapper;
                d || e && !f ? (G.push(c), i.directions.removeObject(c)) : e && c !== a && b && !c.draggable && (H.push(c), i.directions.removeObject(c))
            })
        }, E._stopPanning = function() {
            0 !== J && (k.cancel(J), J = 0, A.endControl(!0))
        }, E._markerDrag = function(a, b, c) {
            a.stopPropagation(), v = m.screenToGeo(B.viewportX - s, B.viewportY - t), d.getWrapped(c).setPosition(v), E._performAutoPan(), E._sendSimpleRouteRequest()
        }, E._performAutoPan = function() {
            var a;
            a = B.viewportX > p - r || B.viewportX < r + o.left || B.viewportY > q - r || B.viewportY < r + o.top, a ? 0 === J && (J = k(function() {
                var a = E._getOffset(B.viewportX, B.viewportY);
                A.startControl(), A.control(a.x, a.y, 0, 0, 0, 0, 0)
            }, 20)) : E._stopPanning()
        }, E._getOffset = function(a, b) {
            var c = {};
            return a > p - r ? (c.x = (r - p + a) / 2e4, c.y = (b - q / 2) / q / 200) : a < r + o.left ? (c.x = (a - (r + o.left)) / 2e4, c.y = (b - q / 2) / q / 200) : b > q - r ? (c.y = (r - q + b) / 2e4, c.x = (a - p / 2) / p / 200) : b < r + o.top && (c.y = (b - (r + o.top)) / 2e4, c.x = (a - p / 2) / p / 200), c.x < 0 && c.x < -.009 ? c.x = -.009 : c.x > 0 && c.x > .009 && (c.x = .009), c.y < 0 && c.y < -.009 ? c.y = -.009 : c.y > 0 && c.y > .009 && (c.y = .009), c
        }, E._sendSimpleRouteRequest = function() {
            var a;
            z && !L && (a = E._prepareSimpleRouteRequestParams(), L = !0, y = f.simpleRoute(a), y.success.then(E._onRoutesCallback), y.cancel.promise.then(function() {
                L = !1
            }))
        }, E._prepareSimpleRouteRequestParams = function() {
            var a, b, c, d, e = m.getViewBounds().getTopLeft(),
                f = m.getViewBounds().getBottomRight(),
                g = m.getZoom();
            return a = w.itineraryItems.map(function(a) {
                return a.getCoordinate()
            }), K >= 0 && null !== K ? a[K] = v : (v.via = !0, a.splice(D, 0, v)), b = x.getActiveTransportModeTypes(), c = "" + e.lat + "," + e.lng + ";" + f.lat + "," + f.lng, d = "" + N[g] + ":" + N[g], d.indexOf("undefined") > -1 && (d = "1:1"), {
                waypoints: a,
                mode: {
                    type: "fastest",
                    transportModes: b,
                    trafficMode: "disabled"
                },
                departureDate: "arriveBy" !== w.timeSelector ? w.routeDate : null,
                arrivalDate: "arriveBy" === w.timeSelector ? w.routeDate : null,
                representation: "dragNDrop",
                resolution: d,
                viewbounds: c
            }
        }, E._dragEnd = function(a, b, f) {
            a.stopPropagation(), E._stopPanning(), e.reverseGeoCode({
                location: v
            }).then(function(a) {
                if (a.data && a.data.address) {
                    var e;
                    f instanceof g.map.Marker ? e = w.itineraryItems[b] : (e = new c, w.itineraryItems.splice(D, 0, e)), e.populate({
                        model: {
                            navigationPosition: a.data.navigationPosition,
                            center: a.data.displayPosition,
                            name: a.data.address.label,
                            isViaPoint: !(f instanceof g.map.Marker)
                        }
                    }), e.isMyLocation = !1
                } else d.getWrapped(f).setPosition(u), i.directions.addObjects(G), i.directions.addObjects(H), j.container.setVisibility(!0)
            })["finally"](function() {
                I && (M.removeObject(I), I = null), w.noSelect = !1, K = null
            })
        }, E._onRoutesCallback = function(a) {
            L = !1, a && (I && M.removeObject(I), I = h.createPolylineWithShapeAndColor({
                shape: a.data.response.route[0].shape,
                color: h.strokeColor.replace("1.0", h.normalOpacity),
                lineWidth: h.getRouteLineWidthByZoomLevel(m.getZoom())
            }), M.addObject(I))
        }, E
    }]), angular.module("hereApp.discover").controller("DiscoverCtrl", ["$rootScope", "$location", "$q", "$log", "$routeParams", "$scope", "$timeout", "$route", "$window", "categories", "Config", "hereBrowser", "herePageTitle", "mapContainers", "markerIcons", "markerService", "mapsjs", "panelsService", "RedirectService", "streetLevel", "User", "utilityService", "CollectionsService", "discoverPlacesHelper", "Features", "CollectionsAlwaysVisibleService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
        function A(a, b) {
            return parseFloat(a.toFixed(b))
        }

        function B() {
            M(F, E) && (v.scrollContainerToTop(), D(), g(function() {
                K(F)
            }, 1e3))
        }
        var C, D, E, F, G, H = this,
            I = [],
            J = n.discover;
        f.panelsService = r;
        var K = function(a) {
            F = a.getCenter ? a : F, E = a ? {
                height: a.getViewPort ? a.getViewPort().height : null,
                width: a.getViewPort ? a.getViewPort().width : null,
                lat: a.getCenter ? a.getCenter().lat : a.latitude,
                lng: a.getCenter ? a.getCenter().lng : a.longitude,
                zoomLevel: a.getZoom ? a.getZoom() : a.zoomLevel
            } : null
        };
        D = v.debounce(function() {
            if (!t.isStreetLevelActive()) {
                var a = F.getViewBounds(),
                    b = parseInt(F.getZoom(), 10),
                    c = e.categoryId || j.getDefaultCategory(b);
                K(F), G && G.abort && G.abort(), G = x.getPlaces(a, c, b), G.then(function(a) {
                    G = null, f.exploreResults = a, f.displayMarkersOnTheMap()
                })
            }
        }, 10), f.displayMarkersOnTheMap = function() {
            C(), f.exploreResults && (f.exploreResults.forEach(function(a) {
                var b = o.category(a.category.id),
                    c = o.collected(a.category.id),
                    d = j.getSVG(a.category.id),
                    e = j.getSVG(a.category.id).replace(/#fff/gi, "#ffe600"),
                    g = {
                        PBAPIID: a.id,
                        position: a.position,
                        icons: b,
                        collectedIcons: c,
                        flag: {
                            title: a.title,
                            icon: d,
                            collectedIcon: e
                        },
                        onMouseEnter: function() {
                            f.$apply(function() {
                                f.addResultHighlight(a)
                            })
                        },
                        onMouseLeave: function() {
                            f.$apply(function() {
                                f.removeResultHighlight(a)
                            })
                        },
                        onClick: function(b, c) {
                            c.preventDefault(), s.goToPlace(a, "discover marker"), H.removeResultVisibility(a)
                        }
                    };
                y.scrollToPlace && (g.flag.openCallback = function() {
                    f.$apply(function() {
                        H.addResultVisibility(a)
                    })
                }, g.flag.closeCallback = function() {
                    f.$apply(function() {
                        H.removeResultVisibility(a)
                    })
                });
                var h = p.createMarker(g);
                I.push(h)
            }), J.addObjects(I), z.showAllFavorites(), f.exploreResultsBB = J.getBounds())
        }, C = function() {
            n.clearContainer(J), n.showOnly(n.discover), I = []
        }, H.addResultVisibility = function(a) {
            a.highlight = !0, a.shouldBeVisible = !0
        }, H.removeResultVisibility = function(a) {
            a.highlight = !1, a.shouldBeVisible = !1
        }, f.addResultHighlight = function(a) {
            a.highlight = !0
        }, f.removeResultHighlight = function(a) {
            a.highlight = !1
        }, f.boxClick = function(a) {
            y.scrollToPlace && H.removeResultVisibility(a), s.goToPlace(a, "discover")
        }, f.boxOver = function(a, b) {
            a.highlight = !0, l.mouse && I[b] && p.getWrapped(I[b]).addHighlight()
        }, f.boxOut = function(a, b) {
            a.highlight = !1, l.mouse && I[b] && p.getWrapped(I[b]).removeHighlight()
        }, f.$on("$destroy", function() {
            F && F.removeEventListener("mapviewchangeend", B), G && G.abort && G.abort()
        });
        var L = function(a, c) {
                var d = v.convertQueryFormatToMapInfo(b.search().map),
                    e = !c && !y.disableTransitions && !l.isTablet;
                M(a, d) && a.getViewModel().setCameraData({
                    position: new q.geo.Point(d.latitude, d.longitude),
                    zoom: d.zoomLevel,
                    animate: e
                })
            },
            M = function(a, b) {
                if (!a || v.isObjectEmpty(b)) return !1;
                var c = void 0 !== b.lat ? b.lat : b.latitude,
                    d = void 0 !== b.lng ? b.lng : b.longitude,
                    e = A(d, 5) === A(a.getCenter().lng, 5) && A(c, 5) === A(a.getCenter().lat, 5) && b.zoomLevel === parseInt(a.getZoom(), 10);
                return !e
            },
            N = function() {
                -1 !== b.path().indexOf("/discover") && (F && F.removeEventListener("mapviewchangeend", B), a.whenMapIsReady.then(function(c) {
                    if (K(c), c.addEventListener("mapviewchangeend", B), y.map && y.map.syncMapToUrl) D();
                    else {
                        var d = v.convertQueryFormatToMapInfo(b.search().map);
                        M(c, d) ? L(c, a.firstLoad) : D(), a.firstLoad = !1
                    }
                }), m.set(), J.setVisibility(!0))
            };
        N(), f.$on("$locationChangeSuccess", N), f.$on("$routeChangeSuccess", N)
    }]), angular.module("hereApp.directive").directive("hereDiscoverGrid", ["panelsService", "$window", "$timeout", function(a, b, c) {
        return {
            replace: !0,
            template: "<div><div ng-repeat='result in exploreResults' data-place-card='{result: result, index: $index, boxOver: options.boxOver, boxOut: options.boxOut, boxClick: options.boxClick, origin: options.origin}'></div></div>",
            scope: {
                exploreResults: "=",
                options: "=hereDiscoverGrid"
            },
            link: function(a, d, e) {
                function f(b, d) {
                    f.timeout && c.cancel(f.timeout), o = null, m(), f.timeout = c(a.computePositions, d ? 0 : 100)
                }
                var g, h, i, j, k, l, m, n, o, p;
                l = d.parent()[0], n = null, o = null, p = function() {
                    return d.children()[0] ? d.children()[0].offsetWidth % 2 === 1 ? d.children()[0].offsetWidth - 1 : d.children()[0].offsetWidth : void 0
                }, k = function() {
                    return n || (n = parseInt(e.margin, 10) || 8)
                }, m = function() {
                    return o || p()
                }, i = function() {
                    return m() + k()
                }, g = function(a) {
                    return a + k()
                }, h = function() {
                    var a = l.offsetWidth;
                    return a % 2 === 1 && (a += 1), parseInt((a - k()) / (i() - k()), 10)
                }, j = function() {
                    return h() * i() + k()
                }, a.computePositions = function() {
                    var a, b, c, e, f, l, m, n, o, p, r, s, t, u;
                    for (q = null, b = function() {
                            var a, b, c;
                            for (c = [], f = a = 0, b = h(); b >= 0 ? b > a : a > b; f = b >= 0 ? ++a : --a) c.push(0);
                            return c
                        }(), n = 0, u = d.children(), f = p = 0, s = u.length; s > p; f = ++p) {
                        for (c = u[f], o = null, l = 0, f = r = 0, t = b.length; t > r; f = ++r) a = b[f], (null == o || o > a) && (o = a, l = f);
                        m = l * i() % j(), e = o + g(c.offsetHeight), e > n && (n = e), b[l] = e, c.style.left = m + "px", c.style.top = o + k() + "px"
                    }
                    return d[0].style.height = n + "px", {
                        width: "" + j() + "px",
                        height: "" + n + "px"
                    }
                }, b.addEventListener("resize", f);
                var q;
                a.$on("placeCardImageLoaded", function() {
                    q && c.cancel(q), q = c(a.computePositions, 100)
                }), a.$watch("exploreResults", function(a) {
                    a && a.length && f(null, !0)
                }), a.$on("$destroy", f)
            }
        }
    }]), angular.module("hereApp.discover").factory("discoverHeaderHelper", ["$q", "Config", "geoCoder", "$rootScope", "cityStateOrCountryFilter", "weather", "utilityService", "PhotosAPI", "WeatherIconsMatcherService", function(a, b, c, d, e, f, g, h, i) {
        var j, k, l, m, n = {},
            o = [],
            p = {},
            q = 8;
        return n._requiresReload = function(a, b) {
            var c = !g.isObjectEmpty(a),
                d = !1;
            if (!b && c) return d;
            if (!(b && c && a.location && a.weather && a.dateTime && a.photoInfo)) return !d;
            if (a.zoom === b.zoom) {
                var e = a.zoom < 14 ? 1 : 2,
                    f = g.roundCoordinate(a.center, e),
                    h = g.roundCoordinate(b.center, e);
                d = angular.equals(f, h)
            }
            return !d
        }, n._resolveLocation = function(a, b, c) {
            var d = c && b && b.data ? e(b.data.address, c.zoom) : null;
            if (!d) {
                var f = {};
                return c && (f.center = c.center, f.zoom = c.zoom, f.requiresWeather = f.requiresPhoto = !1), f
            }
            var g = b.data && b.data.address ? b.data.address.district : null,
                h = g ? d[0] === g : !1,
                i = h ? 1 : 0,
                j = a && a.locationLabel ? a.locationLabel[i] !== d[i] : !0,
                k = {
                    location: b.data
                },
                l = j ? k : a,
                m = !c.options || c.options && c.options.weather !== !1,
                n = !c.options || c.options && c.options.photo !== !1;
            return l.locationLabel = d, l.center = c.center, l.zoom = c.zoom, l.requiresWeather = m && c.zoom > q, l.requiresPhoto = n, l.requiresWeather || (delete l.weather, delete l.dateTime), l.requiresPhoto || delete l.photoInfo, l
        }, n._resolveWeather = function(b) {
            var c = a.defer(),
                d = b && b.location ? b.location.mapReference : null;
            if (!d || b.weather) return c.resolve(b), c.promise;
            l && l.abort();
            var e = d ? [d.cityId, d.countyId, d.countryId].join("") : "",
                h = g.roundCoordinate(b.center, 1),
                i = {
                    latitude: h.lat,
                    longitude: h.lng,
                    key: e
                };
            return l = f.get(i), l.then(function(a) {
                if (!a || !a.data) return void c.resolve(b);
                var d = angular.copy(a.data),
                    e = d.localConditions.precip ? d.localConditions.precip + ". " : "",
                    f = new Date(d.localtime.match(/.+\d{1,2}:\d{1,2}:\d{1,2}/)[0]);
                d.localConditions.description = e + d.localConditions.sky + ".", c.resolve({
                    weather: d,
                    dateTime: f
                })
            }, function(a) {
                0 === a.status ? c.reject() : c.resolve()
            })["finally"](function() {
                l = null
            }), c.promise
        }, n._getDayPart = function(a) {
            if (!a) return "DAY";
            var b = a.getHours();
            return b >= 6 && 9 > b ? "MORNING" : b >= 9 && 17 > b ? "DAY" : b >= 17 && 21 > b ? "EVENING" : "NIGHT"
        }, n._getSeason = function(a) {
            if (!a || !a.weather || !a.center) return "SUMMER";
            var b = a.weather.gmtDate.substr(2, 2),
                c = a.center.lat >= 0;
            return c ? b >= 10 && 12 >= b ? "AUTUMN" : b >= 1 && 3 >= b ? "WINTER" : b >= 4 && 6 >= b ? "SPRING" : "SUMMER" : b >= 10 && 12 >= b ? "SPRING" : b >= 1 && 3 >= b ? "SUMMER" : b >= 4 && 6 >= b ? "AUTUMN" : "WINTER"
        }, n._resolvePhoto = function(b) {
            var c = a.defer();
            if (g.isObjectEmpty(b) || b.photoInfo && b.photoInfo.photoUrl) return c.resolve(b), c.promise;
            m && m.abort();
            var d = n._getDayPart(b.dateTime),
                e = n._getSeason(b),
                f = h.getTags([d, e]),
                j = b.weather ? b.weather.localConditions.iconName : "sunny",
                k = i.getCondition(j),
                l = Math.ceil(b.zoom / 2),
                o = g.roundCoordinate(b.center, l);
            return m = h.getSinglePhoto({
                latitude: o.lat,
                longitude: o.lng,
                tags: f,
                tag_mode: "AND",
                condition: k,
                mapRef: b.location ? b.location.mapReference : null
            }), m.then(function(a) {
                c.resolve({
                    photoInfo: angular.copy(a)
                })
            }, function(a) {
                a && 0 === a.status ? c.reject() : c.resolve({
                    photoInfo: {
                        photoUrl: null
                    }
                })
            })["finally"](function() {
                m = null
            }), c.promise
        }, n._abort = function() {
            j && (k && k.abort(), l && (l.abort(), l = null), m && (m.abort(), m = null), o.push(j))
        }, n._getHeaderId = function(a) {
            return a && a.center && a.zoom ? a.center.lat + "-" + a.center.lng + "-" + a.zoom : void 0
        }, n.getHeaderInfo = function(b, e) {
            var f = a.defer();
            if (!b) return f.reject(), f.promise;
            var g = {
                    center: b.getCenter(),
                    zoom: b.getZoom(),
                    options: e
                },
                h = n._requiresReload(p, g),
                i = function(a) {
                    var b = n._getHeaderId(a),
                        c = o.indexOf(b);
                    if (c > -1) return o.splice(c, 1), null;
                    var d = !a.requiresWeather || a.requiresWeather && a.weather,
                        e = !a.requiresPhoto || a.requiresPhoto && a.photoInfo,
                        g = !!(a && a.location && d && e);
                    return a.completed = !a || !a.location || g, a.completed ? (g && (p = a), f.resolve(a), j = null, k = null) : f.notify(a), a
                };
            return n._abort(), h ? (j = n._getHeaderId(g), k = c.reverseGeoCode({
                location: g.center
            }), k.then(function(a) {
                var b = n._resolveLocation(p, a, g);
                return d.$broadcast("headerData", {
                    headerData: b
                }), b
            }, function() {
                return {}
            }).then(i).then(function(a) {
                var b = a,
                    c = function(a) {
                        a && (angular.extend(b, a), i(b))
                    };
                a && (a.requiresPhoto && n._resolvePhoto(a).then(c), a.requiresWeather && n._resolveWeather(a).then(c))
            }), f.promise.abort = function() {
                n._abort(), f.reject()
            }, f.promise) : (p.cached = !0, f.resolve(p), f.promise)
        }, n
    }]), angular.module("hereApp.discover").factory("discoverPlacesHelper", ["$q", "Features", "Config", "PBAPI", "categories", "PreloadImage", "ensureHTTPSFilter", function(a, b, c, d, e, f, g) {
        var h, i, j, k = {},
            l = {},
            m = 20;
        return k.filterPlaces = function(a) {
            return a.sort(function(a, b) {
                return parseFloat(b.weight) - parseFloat(a.weight)
            }), a.splice(m, a.length - m), a
        }, k.getTilesCoords = function(a, b) {
            var c, d, e, f, g = [],
                h = 256 << b,
                i = function(a) {
                    var b = a.lng / 360 + .5,
                        c = Math.min(1, Math.max(0, .5 - Math.log(Math.tan(Math.PI / 4 + Math.PI / 2 * a.lat / 180)) / Math.PI / 2));
                    return {
                        x: Math.round(b * h),
                        y: Math.round(c * h)
                    }
                },
                j = [4, 3, 2, 1],
                k = i(a.getTopLeft()),
                l = i(a.getBottomRight()),
                m = k.x / 256 | 0,
                n = k.y / 256 | 0,
                o = (l.x / 256 | 0) + 1,
                p = (l.y / 256 | 0) + 1,
                q = o - m,
                r = p - n;
            for (e = m; o > e; e++)
                for (f = n; p > f; f++)
                    for (c = 0, d; d = j[c]; c++)
                        if (e % d === 0 && f % d === 0 && q >= e - m + d && r >= f - n + d) {
                            g.push({
                                x: e,
                                y: f,
                                z: b
                            });
                            break
                        }
            return g
        }, k.getDomains = function(b) {
            var c = function(b) {
                var c = a.defer();
                return d.exploreTiles(b).then(function(a) {
                    c.resolve(a.data)
                }), c.promise
            };
            return h !== b && (l[b] ? i = l[b] : (h = b, i = a.all([c({
                size: 15,
                cat: "all-places" === b ? null : b
            }), c({
                size: 15,
                teasers: 15,
                image_dimensions: "w400",
                cat: "all-places" === b ? null : b
            })]).then(function(a) {
                return l[b] = a, h = null, i = null, a
            }))), i
        }, k.getPlacesByTile = function(b, c, e, h) {
            var i, j = a.defer(),
                l = !1,
                n = [],
                o = a.when(k.getDomains(c));
            return o.then(function(o) {
                l && j.reject(), i = k.getTilesCoords(b, e - 1), i.forEach(function(a) {
                    n.push(d.tile(o[h ? 1 : 0][a.y % 4], a.z, a.x, a.y))
                }), a.all(n).then(function(a) {
                    var d = [],
                        i = [];
                    a.forEach(function(a) {
                        var c = [];
                        a.data.forEach(function(a) {
                            b.containsPoint(a.position) && c.push(a)
                        }), c.sort(function(a, b) {
                            return parseFloat(b.weight) - parseFloat(a.weight)
                        }), i = i.concat(c.splice(0, 3)), d = d.concat(c)
                    }), d.sort(function(a, b) {
                        return parseFloat(b.weight) - parseFloat(a.weight)
                    }), i = i.concat(d.splice(0, m - i.length)), i.sort(function(a, b) {
                        return parseFloat(b.weight) - parseFloat(a.weight)
                    }), i = k.filterPlaces(i), h || k.getPlacesByTile(b, c, e, !0).then(function(a) {
                        i.forEach(function(b, c) {
                            a[c].teaser && (b.image = a[c].teaser.image, f.single(g(b.image.w400)).then(function(a) {
                                b.mainImageLoaded = a
                            }))
                        })
                    }), j.resolve(i)
                })
            }), j.promise.abort = function() {
                j.reject(), l = !0, n.forEach(function(a) {
                    a.abort()
                })
            }, j.promise
        }, k.getPlaces = function(a, b, c) {
            return j && j.abort(), j = k.getPlacesByTile(a, b, c, !1)
        }, k
    }]), angular.module("hereApp.discover").factory("discoverRedirect", ["geoCoder", "$rootScope", "$location", "mapsjs", function(a, b, c, d) {
        var e = {
            getBestZoomLevelForBBox: function(a) {
                var b, c, e, f, g, h, i, j, k = 20,
                    l = 0;
                return a.isEmpty() || (b = new d.geo.PixelProjection, b.rescale(k), c = b.geoToPixel(a.getTopLeft()).round(), e = b.geoToPixel(a.getBottomRight()).round(), f = b.w, a.isCDB() && (c.x -= f), g = e.x - c.x, h = e.y - c.y, i = 800, j = 600, k = -8 + Math.min(Math.log(f * (i / g)) / Math.LN2, Math.log(f * (j / h)) / Math.LN2) - l), Math.round(k)
            },
            geocode: function(b) {
                a.geoCode({
                    city: b.city,
                    country: b.country
                }).then(function(a) {
                    if (a && a.data && a.data.mapView) {
                        var d = a.data.displayPosition,
                            f = b.category,
                            g = "/discover/" + (f ? f : ""),
                            h = e.getBestZoomLevelForBBox(a.data.mapView);
                        d || (d = a.data.mapView.getCenter()), c.search({
                            map: d.lat + "," + d.lng + "," + h
                        }).path(g)
                    } else c.path("/")
                }, function() {
                    c.path("/")
                })
            }
        };
        return e
    }]), angular.module("hereApp.feedback").controller("FeedbackCtrl", ["$rootScope", "$scope", "UserVoice", "NPS", "Features", function(a, b, c, d, e) {
        b.NPS = d, b.isReportProblemEnabled = e.map.reportProblem, b.showUserVoice = function() {
            b.closePopover(), c.showUserVoice()
        }, b.showNPS = function() {
            b.closePopover(), d.open()
        }, b.showReportMapProblem = function() {
            b.closePopover(), a.$broadcast("popover", {
                templateUrl: "features/reportMapProblem/reportMapProblem.html",
                single: !0,
                widePopup: !0
            })
        }
    }]), angular.module("hereApp").service("hereFooterStyle", ["$rootScope", "mapsjs", function(a, b) {
        this._initialize = function(a) {
            this._map = a, this._updateFooterStyle(), this._map.addEventListener("baselayerchange", this._updateFooterStyle)
        }.bind(this), this._updateFooterStyle = function() {
            this.style = b.mapUtils.isSatelliteLayer(this._map.getBaseLayer()) ? "dark" : ""
        }.bind(this), a.whenMapIsReady.then(this._initialize)
    }]), angular.module("hereApp").service("hereMapImprint", ["$rootScope", function(a) {
        this.initialize = function() {
            this.copyright = (new Date).getFullYear() + " HERE", a.whenMapIsReady.then(this._useMap)
        }, this._useMap = function(a) {
            this._imprint = a.getImprint(), this._hideMapImprint(this._imprint), this._updateCopyright(), a.addEventListener("mapviewchangeend", this._updateCopyright), a.addEventListener("baselayerchange", this._updateCopyright)
        }.bind(this), this._updateCopyright = function() {
            this.copyright = this._imprint.getCopyrights().replace("1987&ndash;", " ")
        }.bind(this), this._hideMapImprint = function(a) {
            var b = a.getElement().childNodes;
            b[0].style.left = "5px", b[0].style.top = "10px", b[1].style.display = "none"
        }
    }]), angular.module("hereApp.landingPage").controller("LandingPageCtrl", ["$rootScope", "$scope", "$location", "Features", "mapsjs", "mapContainers", "panelsService", "utilityService", "herePageTitle", "hereBrowser", function(a, b, c, d, e, f, g, h, i, j) {
        var k, l = this;
        l.initializeMap = function(a) {
            k = a, l.moveCamera()
        }, l.moveCamera = function() {
            if (k) {
                var b = h.convertQueryFormatToMapInfo(c.search().map),
                    f = !d.disableTransitions && !j.isTablet && !a.firstLoad;
                l.requiresCameraMove(k, b) && (k.getViewModel().setCameraData({
                    position: new e.geo.Point(b.latitude, b.longitude),
                    zoom: b.zoomLevel,
                    animate: f
                }), a.firstLoad = !0)
            }
        }, l.requiresCameraMove = function(a, b) {
            return !a || h.isObjectEmpty(b) ? !1 : b.longitude !== parseFloat(a.getCenter().lng.toFixed(5)) || b.latitude !== parseFloat(a.getCenter().lat.toFixed(5)) || b.zoomLevel !== parseInt(a.getZoom(), 10)
        }, l.setListeners = function() {
            a.whenMapIsReady.then(l.initializeMap), b.$on("$locationChangeSuccess", l.moveCamera)
        }, l.initialize = function() {
            f.showOnly(f.landingPage), i.set(), d.map && d.map.syncMapToUrl || l.setListeners()
        }, l.initialize()
    }]), angular.module("hereApp.directive").directive("npsBar", function() {
        return {
            replace: !0,
            template: '<div class="nps-overlay" data-score="score" data-is-submit-disabled="isSubmitDisabled">    <div title="0" class="fill cl0" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">        <div title="1" class="fill cl1" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">            <div title="2" class="fill cl2" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                <div title="3" class="fill cl3" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                    <div title="4" class="fill cl4" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                        <div title="5" class="fill cl5" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                            <div title="6" class="fill cl6" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                                <div title="7" class="fill cl7" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                                    <div title="8" class="fill cl8" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                                        <div title="9" class="fill cl9" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)">                                            <div title="10" class="fill cl10" data-ng-click="onBarClicked($event)" data-ng-mouseover="onBarHovered($event)" data-ng-mouseout="onBarHovered($event)"></div>                                        </div>                                    </div>                                </div>                            </div>                        </div>                    </div>                </div>            </div>        </div>    </div></div>',
            link: function(a, b) {
                var c = a.score;
                a.onBarClicked = function(d) {
                    d.stopPropagation();
                    var e = d.currentTarget,
                        f = e;
                    angular.element(b[0].ownerDocument.querySelectorAll(".nps-bar .fill")).removeClass("on"), e.classList.add("on");
                    for (var g = 0, h = parseInt(e.title, 10) - 1; h >= g; h--) f = f.parentElement, f.classList.add("on");
                    a.score = c = parseInt(e.title, 10), a.isSubmitDisabled = !1
                }, a.onBarHovered = function(b) {
                    b.stopPropagation(), a.score = "mouseover" === b.type ? parseInt(b.currentTarget.title, 10) : "mouseout" === b.type && null != c ? c : ""
                }
            }
        }
    }), angular.module("hereApp.nps").controller("NPSCtrl", ["$scope", "$document", "NPS", "User", function(a, b, c, d) {
        var e, f = !1,
            g = d.getUserData(),
            h = d.locale,
            i = "";
        a.score = "", a.nps = {
            show: !0
        }, a.isSubmitDisabled = !0, g && g.countryCode && (i += "?cc=" + g.countryCode), h && h.tag && (i += -1 === i.indexOf("?") ? "?" : "&", i += "lang=" + h.tag), a.langParams = i, a.validateFrom = function() {
            var b, c = a.score,
                d = a.comment,
                f = a.email,
                g = a.checked;
            return 0 > c || c > 10 ? void a.closePopover() : (b = {
                score: c
            }, "" !== f && g && (b.email = f), "" !== d && (b.feedback = d), void e(b))
        }, e = function(b) {
            var d;
            f || (d = c.send(b), d.then(function() {
                f = !0
            })["finally"](function() {
                d = null
            })), a.closePopover(), a.$emit("popover", {
                templateUrl: "features/nps/npsConfirm.html"
            })
        }
    }]), angular.module("hereApp.photoGallery").controller("PhotoGalleryCtrl", ["$scope", "$window", "$document", "PhotoGalleryService", "TrackingService", function(a, b, c, d, e) {
        a.place = d.getPlace(), a.service = d, a.loadedPhotos = 0, a.photosCount = d.getPhotosCount(), a.currentIndex = d.getIndex() + 1, a.photoNormalDim = "w600-h600", a.photoThumbDim = "w200-h200", a.reportDisplay = !1, a.reportSuccess = !1;
        var f = this;
        this.updatePhoto = function(b) {
            a.currentPhoto = b, a.currentIndex = d.getIndex() + 1
        }, this.showCurrentPhoto = function() {
            d.getPhoto().then(f.updatePhoto)
        }, this.updateCounter = function(b, c) {
            a.allPhotos[b].isAvailable = c, a.loadedPhotos < a.photosCount && a.loadedPhotos++
        }, a.isNextBtnVisible = function() {
            return !a.reportDisplay && d.getIndex() < d.getPhotosCount() - 1
        }, a.isPreviousBtnVisible = function() {
            return !a.reportDisplay && d.getIndex() > 0
        }, a.isGridBtnDisabled = function() {
            return a.reportDisplay || !a.currentPhoto || 1 === d.getPhotosCount()
        }, a.showNextPhoto = function() {
            e.click("photoGallery:nextPhotoButton:click"), d.getNextPhoto().then(f.updatePhoto)
        }, a.showPreviousPhoto = function() {
            e.click("photoGallery:previousPhotoButton:click"), d.getPreviousPhoto().then(f.updatePhoto)
        }, a.showPhoto = function(a) {
            e.click("photoGallery:gridThumbnail:click"), d.getPhoto(a).then(f.updatePhoto)
        }, a.showAllPhotos = function() {
            d.getAllPhotos().then(function(b) {
                a.allPhotos = b, a.currentPhoto = null
            })
        }, a.addPhotos = function() {
            e.click("photoGallery:addPhotosButton:click")
        }, a.singlePhotoClick = function() {
            e.click("photoGallery:singlePhoto:click")
        }, a.onloadPhoto = function(a) {
            f.updateCounter(a, !0)
        }, a.onerrorPhoto = function(a) {
            f.updateCounter(a, !1)
        }, a.onReportPhoto = function() {
            a.reportSuccess = !1, a.reportDisplay = !0
        }, a.reportPhotoClose = function() {
            a.reportDisplay = !1, a.reportLink = null
        }, a.onReportPhotoCancelled = function() {
            a.reportPhotoClose()
        }, a.onReportPhotoSuccess = function() {
            a.reportSuccess = !0, a.reportPhotoClose()
        }, d.getIndex() > -1 ? this.showCurrentPhoto() : a.showAllPhotos(), a.$on("photoReportLinkClicked", function() {
            a.reportLink = d.getReportPhotoURL(a.currentPhoto), a.onReportPhoto()
        }), a.$on("$locationChangeStart", function(b, c, d) {
            var e = c ? c.split("?")[0] : "",
                f = d ? d.split("?")[0] : "";
            e !== f && angular.isFunction(a.closeDialog) && (b.preventDefault(), a.closeDialog())
        })
    }]), angular.module("hereApp.directive").directive("photo", ["$window", "$document", "ensureHTTPSFilter", "PreloadImage", "Features", function(a, b, c, d, e) {
        var f = "w600-h600",
            g = e.pdc && e.pdc.reporting,
            h = function() {
                var a = b[0].querySelector(".single_photo"),
                    c = b[0].querySelector(".single_photo .container"),
                    d = b[0].querySelector(".single_photo .photo img");
                a && c && d && (d.style.maxHeight = a.clientHeight - 96 + "px", d.style.maxWidth = c.clientWidth + "px")
            };
        return {
            replace: !0,
            scope: {
                photo: "="
            },
            templateUrl: "features/photoGallery/photo.html",
            link: function(b) {
                var e, i = angular.element(a);
                b.$watch("photo", function(a) {
                    a && (e && e.reject && e.reject(), b.imageWasLoaded = !1, b.imageHasReportLink = !1, e = d.single(c(a.dimensions[f])).then(function(a) {
                        b.photoSrc = a, h(), e = null, b.imageWasLoaded = !0, b.imageHasReportLink = g && b.photo && b.photo.supports && b.photo.supports.indexOf("report") > -1
                    }))
                }), b.onReportLinkClick = function() {
                    b.$emit("photoReportLinkClicked", {
                        image: b.image
                    })
                }, i.on("resize", h), b.$on("$destroy", function() {
                    i.off("resize", h)
                })
            }
        }
    }]), angular.module("hereApp.places").controller("PlacesCtrl", ["$scope", "Features", "$routeParams", "$location", "$window", "$q", "PBAPI", "geoCoder", "placeService", "RedirectService", "RecentsService", "herePageTitle", "categories", "markerService", "markerIcons", "mapContainers", "mapsjs", "utilityService", "TrackingService", "directionsUrlHelper", "$rootScope", "CollectionsAlwaysVisibleService", "splitTesting", "hereBrowser", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x) {
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
                        return c && e.placeId && c !== e.placeId && (e.altPlaceId = c), k = i.isLocation(e), n = g && !k, m = k ? m : null, n && i.isDiscoverCategory(e) ? B.redirectToDiscover(e) : (e.mainCategory = i.getMainCategoryId(e), e.name = m || (k && !i.isCoordinate(e) ? e.name.replace(/,/g, "") : e.name), void f.when(j(e.location)).then(function(c) {
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
    }]), angular.module("hereApp.places").controller("ReportCtrl", ["$scope", "$rootScope", function(a, b) {
        var c = this;
        c.init = function(a) {
            a.place = a.modals[0].place
        }, a.onAbort = function() {
            a.closeDialog()
        }, a.onSuccess = function() {
            a.closeDialog(), b.$broadcast("notification_pdc", {
                message: "Thanks for letting us know. We\'ll get right on it."
            })
        }, c.init(a)
    }]), angular.module("hereApp.places").directive("pdcModuleAbout", ["formatFilter", "User", "TrackingService", function(a, b, c) {
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleAbout/pdcModuleAbout.html",
            replace: !0,
            link: function(d) {
                d.$watch("place.name", function(b) {
                    d.title = b ? a("About {0}", b) : "About"
                }), d.$watch("place.media.editorials.items", function(a) {
                    a ? (d.editorials = a.filter(function(a) {
                        return !a.language || a.language === b.locale.language
                    }), d.editorials.length && c.click("pdc:ModuleAbout:shown")) : d.editorials = []
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleAdditionalResources", ["TrackingService", function(a) {
        return {
            scope: {
                place: "="
            },
            templateUrl: "features/places/pdcModules/pdcModuleAdditionalResources/pdcModuleAdditionalResources.html",
            replace: !0,
            link: function(b) {
                b.$watch("place.media", function(c) {
                    if (c) {
                        var d = [];
                        d.push({
                            url: "http://www.tripadvisor.com/" + b.place.name,
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Tripadvisor"
                            }
                        }), c.links && c.links.available && d.push({
                            url: c.links.items[0].url,
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Facebook"
                            }
                        }), d.push({
                            url: "http://www.urbanspoon.com/",
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Urbanspoon"
                            }
                        }), d.push({
                            url: "http://www.citysearch.com/",
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Citysearch"
                            }
                        }), d.push({
                            url: "http://www.foursquare.com/",
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Foursquare"
                            }
                        }), d.push({
                            url: "http://www.google.com?#q=" + b.place.name,
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Google+"
                            }
                        }), d.push({
                            url: "http://www.chow.com/",
                            supplier: {
                                icon: "http://download.st.vcdn.nokia.com/p/d/places2_stg/icons/suppliers/62.icon",
                                title: "Chow"
                            }
                        }), c.links = c.links ? c.links : {
                            available: 7
                        }, c.links.imaginary = d, a.click("pdc:ModuleAdditionalResources:shown")
                    }
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleAmenities", ["TrackingService", function(a) {
        var b = ["chaos", "openingHours", "price", "departures", "transitLines"],
            c = 10;
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleAmenities/pdcModuleAmenities.html",
            replace: !0,
            link: function(d) {
                d.toggleDisplay = function() {
                    d.limit = d.limit === c ? d.amenities.length : c
                }, d.isMoreToDisplay = function() {
                    return d.amenities && d.amenities.length > c
                }, d.isEverythingDisplayed = function() {
                    return d.limit > c
                }, d.$watch("place.extended", function(e) {
                    d.amenities = [], d.limit = c, e && (Object.keys(e).forEach(function(a) {
                        -1 === b.indexOf(a) && d.amenities.push(e[a])
                    }), d.amenities.length && a.click("pdc:ModuleAmenities:shown"))
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleArticles", ["TrackingService", function(a) {
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleArticles/pdcModuleArticles.html",
            replace: !0,
            link: function(b) {
                b.displayCount = b.displayCountMin = 2, b.displayCountMax = 4, b.toggleDisplay = function() {
                    b.displayCount = b.displayCount === b.displayCountMin ? b.displayCountMax : b.displayCountMin
                }, b.isEverythingDisplayed = function() {
                    return b.displayCount === b.displayCountMax
                }, b.$watch("place.media.articles", function(c) {
                    c && c.available && (c.filteredItems = c.items.filter(function(a) {
                        return !!a.description
                    }), b.shortData = function() {
                        return c.filteredItems.length <= b.displayCountMin
                    }, a.click("pdc:ModuleArticles:shown"))
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleFacebook", ["User", "TrackingService", "Features", "placeService", function(a, b, c, d) {
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleFacebook/pdcModuleFacebook.html",
            replace: !0,
            link: function(e) {
                e.fbLikeButtonEnabled = c.pdc && c.pdc.fbLikeButton, e.locale = a.locale.tagUnderscore, e.$watch("place", function() {
                    e.facebookUrl = e.place && d.getFacebookUrl(e.place), e.facebookUrl && b.click("pdc:ModuleFacebook:shown")
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleInfo", ["$rootScope", "PBAPI", "Features", "addBRsFilter", "routing", "routesParser", "markerIcons", "markerService", "mapContainers", "TrackingService", "placeService", "utilityService", "splitTesting", function(a, b, c, d, e, f, g, h, i, j, k, l) {
        var m, n, o, p, q = !1,
            r = i.PDC,
            s = 1e3,
            t = function() {
                n && r.removeObject(n), o && r.removeObjects(o)
            },
            u = function(a) {
                var b = h.createMarker(a);
                r.addObject(b), n = b
            },
            v = function(a) {
                a.processed || (a.stations = a.title.split(", "), a.positionObj = {
                    lat: a.position[0],
                    lng: a.position[1]
                }, a.processed = !0)
            },
            w = function(a, b) {
                v(a), x(a), e.route({
                    waypoints: [a.positionObj, b.location.position],
                    alternatives: 0,
                    mode: {
                        type: "fastest",
                        transportModes: ["pedestrian"],
                        trafficMode: "disabled"
                    },
                    departureDate: new Date,
                    requestLinkAttributes: !1
                }).then(function(b) {
                    var c = b.data[0],
                        d = f.parseRoutes(b.data)[0],
                        e = Math.ceil(c.summary.travelTime / 60);
                    return a.boundingBox = c.boundingBox, a.waypoint = c.waypoint, a.walkTime = "{{minutes}} min walk".replace("{{minutes}}", e), d
                }).then(function(b) {
                    a.polylines = b
                })
            },
            x = function(a) {
                if (a.stations && a.stations.length && a.transitLines) {
                    a.stationsExtended = [];
                    var b = a.transitLines.lines;
                    return a.stations.forEach(function(c) {
                        var d, e = {},
                            f = {};
                        return e.name = c, d = b[c], d && d.style ? (d.style.color && (f.backgroundColor = d.style.color), d.style.textColor && (f.color = d.style.textColor), e.style = f, void a.stationsExtended.push(e)) : void a.stationsExtended.push(e)
                    }), a
                }
            },
            y = function(a) {
                var b = m.getViewBounds().containsRect(a),
                    c = m.getZoom() + 2 < m.getCameraDataForBounds(a, !0).zoom;
                (!b || c) && m.getViewModel().setCameraData({
                    position: a.getCenter(),
                    zoom: m.getCameraDataForBounds(a, !0).zoom - 1,
                    animate: !0
                })
            },
            z = function(a, b) {
                var c = [a.location.position],
                    d = b.map(function(a) {
                        return a.position
                    });
                return e.matrixRoute(c, d, {
                    mode: {
                        type: "fastest",
                        transportModes: ["pedestrian"]
                    },
                    matrixattributes: "none,su,ix",
                    summaryattributes: "none,cf,di",
                    searchrange: 1800
                })
            },
            A = function(a) {
                var b;
                return a.forEach(function(a) {
                    a.count > 0 && a.average >= 0 && (b = b && b.count > a.count ? b : a)
                }), b
            },
            B = function(a) {
                var b = a ? "pdc:PTSeeLess:click" : "pdc:PTSeeMore:click";
                j.click(b)
            };
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleInfo/pdcModuleInfo.html",
            replace: !0,
            link: function(e) {
                e.ptStations = [], e.ptImprovements = c.pdc && c.pdc.ptImprovements, e.isReportProblemEnabled = c.map && c.map.reportProblem, p = 5, e.cleanUp = function() {
                    r.removeAll(), n = o = void 0, e.showAllPT = !1, q = !1, e.ptStations = []
                }, e.openReportPlace = function(b) {
                    k.isLocation(b) ? a.$broadcast("popover", {
                        templateUrl: "features/reportMapProblem/reportMapProblem.html",
                        single: !0,
                        widePopup: !0,
                        place: b
                    }) : a.$broadcast("modalDialog", {
                        templateUrl: "features/places/report.html",
                        replace: !0,
                        place: b
                    })
                }, e.switchShowAllPT = function() {
                    B(e.showAllPT), e.showAllPT = !e.showAllPT, h()
                };
                var h = function() {
                    q || (e.ptStations.forEach(function(a) {
                        a.processed || w(a, e.place)
                    }), q = !0)
                };
                e.showPTRoute = function(a) {
                    t();
                    var b = a.waypoint[0].mappedPosition,
                        c = {
                            position: b,
                            icons: g.modeChange("public-transport"),
                            flag: {
                                title: a.vicinity,
                                knife: "route"
                            },
                            routing: !0
                        };
                    u(c), y(a.boundingBox), e.wrappedMarker.addFlag(), o = a.polylines, o && angular.isArray(o) && (o.map(function(a) {
                        return "setStyle" in a && m ? a.setStyle({
                            lineWidth: f.getRouteLineWidthByZoomLevel(m.getZoom()),
                            strokeColor: "rgba(0,170,217,.7)"
                        }) : void 0
                    }), r.addObjects(o))
                }, e.$watch("place", function(a) {
                    if (a) {
                        if (k.isLocation(a)) return void(e.infoArrays = null);
                        var b = function(a, b, c) {
                                var d = l.arrayGetLabels(a);
                                return {
                                    items: d ? d.join(", ") : null,
                                    label: d && d.length > 1 ? b : c
                                }
                            },
                            c = [];
                        c.push(b(a.categories, "Categories", "Category")), c.push(b(a.tags, "Cuisines", "Cuisine")), e.infoArrays = c.filter(function(a) {
                            return !!a.items
                        })
                    }
                }), e.$watch("place.location", function(a) {
                    e.isLocation = k.isLocation(e.place), e.address = a && a.address && a.address.text ? d(a.address.text) : "", e.reportingEnabled = e.place && c.pdc && (!e.isLocation && c.pdc.reporting || e.isLocation && c.pdc.reportMap && e.isReportProblemEnabled)
                }), e.$watch("place.media", function(a) {
                    e.rating = a && a.ratings && a.ratings.available ? A(a.ratings.items) : void 0
                }), e.$watch("place.related['public-transport'].href", function(a) {
                    a && b.relatedPT({
                        href: a
                    }).then(function(a) {
                        var b = a.data.items;
                        b && b.length && (C(b), j.click("pdc:ModulePublicTransport:shown"))
                    })
                }), e.$watch("place.contacts.website", function(a) {
                    a && a.length && j.click("pdc:Website:shown")
                });
                var i = function(a) {
                    a && a.price && "" === a.price.text.replace(/\$/g, "") && (e.place.extended.price.starsOff = "$$$$".substr(0, 4 - a.price.text.length))
                };
                e.$watch("place.extended", i), e.$watch("place.references.tripadvisor.id", function(a) {
                    if (e.bookHotelLink = null, e.place && e.place.categories) {
                        var b = e.place.categories.filter(function(a) {
                            return ["hotel", "motel", "hostel"].indexOf(a.id) >= 0
                        }).length > 0;
                        b && (e.bookHotelLink = "https://www.tripadvisor.com/" + a + "?ref=herecom")
                    }
                });
                var x = function(a) {
                        var b = a.filter(function(a) {
                            return a.distance < s
                        });
                        b = b.length > 0 ? b.slice(0, p) : a, b.forEach(function(a) {
                            v(a)
                        }), b.length && w(b[0], e.place), e.ptStations = b
                    },
                    C = function(a) {
                        z(e.place, a).then(function(b) {
                            var c, d, f, g, h = 0;
                            if (!b) return x(a);
                            if (b = b.filter(function(a) {
                                    return !(a.status && "rangeExceeded" === a.status)
                                }), e.ptStations = [], b.length) {
                                for (g = 0; g < b.length; g++) b[g].summary.distance < b[h].summary.distance && (h = g);
                                for (g = 0; g < b.length; g++) b[g].summary.distance === b[h].summary.distance && b[g].summary.costFactor < b[h].summary.costFactor && (h = g);
                                f = b[h].summary.distance, Math.ceil(f / 60) < 30 && (c = b[h].destinationIndex, d = a.splice(c, 1)[0], a.unshift(d), w(d, e.place), e.ptStations = a)
                            }
                        })
                    };
                a.whenMapIsReady.then(function(a) {
                    m = a
                }), e.$on("$destroy", function() {
                    e.cleanUp()
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleLatest", ["TrackingService", "utilityService", "RedirectService", "Config", function(a, b, c) {
        var d = 0;
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModuleLatest/pdcModuleLatest.html",
            replace: !0,
            link: function(e) {
                var f = "pdc:ModuleLatest:shown",
                    g = function() {
                        e.latest = {
                            isAvailable: !1,
                            supplier: null,
                            review: null,
                            image: null
                        }
                    },
                    h = function(a) {
                        a.suppliers.items.forEach(function(a) {
                            a.items.forEach(function(c) {
                                b.isContentOld(c.date) || e.latest.review || (e.latest.supplier = a, e.latest.review = c)
                            })
                        })
                    };
                e.openPhoto = function() {
                    c.goToPhotoGallery(e.place, d, "latest module")
                }, e.$watch("place.media", function(b) {
                    g(), b && b.images && b.images.items.length && b.reviews && !(b.reviews.available <= 0) && (e.latest.image = b.images.items.length > 2 ? b.images.items[d] : null, h(b.reviews), e.latest.isAvailable = !!(e.latest.image && b.reviews.available > 2 && e.latest.review), e.latest.available && a.click(f))
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModulePhotos", ["$timeout", "$rootScope", "RedirectService", "Features", "panelsService", "MIAPI", "ensureHTTPSFilter", "TrackingService", "Config", function(a, b, c, d, e, f, g, h) {
        return {
            scope: {
                place: "="
            },
            templateUrl: "features/places/pdcModules/pdcModulePhotos/pdcModulePhotos.html",
            replace: !0,
            link: function(a) {
                a.isImageSmall = function(a, b) {
                    return a > 0 && (3 === b || b > 4)
                }, a.openPhoto = function(b) {
                    c.goToPhotoGallery(a.place, b, "photo grid")
                }, a.openPhotoGallery = function() {
                    c.goToPhotoGallery(a.place)
                }, a.isGridHover = !1, a.setHoverGrid = function(b, c, d) {
                    var e = 4 === d ? 1 : 0,
                        f = b && d > 0 && c === e;
                    a.isGridHover = f
                }, a.$watch("place.media.images.items", function(b) {
                    return b ? (b = b.map(function(a, b) {
                        return a.index = b, a
                    }), a.galleryItems = b.length > 2 ? b.slice(1) : b, void(a.galleryItems.length && h.click("pdc:ModulePhotos:shown"))) : void(a.galleryItems = [])
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModulePlacesNearby", ["Features", "PBAPI", "PreloadImage", "ensureHTTPSFilter", "TrackingService", function(a, b, c, d, e) {
        var f = function(a) {
            var b = a ? "pdc:PlacesNearby:SeeLess:click" : "pdc:PlacesNearby:SeeMore:click";
            e.click(b)
        };
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModulePlacesNearby/pdcModulePlacesNearby.html",
            replace: !0,
            link: function(a) {
                var g, h = [4, 8, 16];
                a.recommendedItems = [], a.showMoreNearbyPlaces = function() {
                    var b = a.maxNearbyPlacesToDisplay >= a.recommendedItemsLength,
                        c = b ? 0 : h.indexOf(a.maxNearbyPlacesToDisplay) + 1;
                    f(b), a.maxNearbyPlacesToDisplay = h[c] || h[0], a.recommendedItems = g.slice(0, a.maxNearbyPlacesToDisplay)
                }, a.$watch("maxNearbyPlacesToDisplay", function(b) {
                    a.nearbyModuleShowMore = a.recommendedItemsLength ? b < h[2] && b < a.recommendedItemsLength : !0
                }), a.$watch("place.related.recommended.href", function(f) {
                    if (f) {
                        var i = h[h.length - 1],
                            j = {
                                href: f,
                                size: i,
                                teasers: i,
                                image_dimensions: "w400"
                            };
                        b.recommendedPlaces(j).then(function(b) {
                            var f = b.data.items;
                            f && f.length && (f.forEach(function(a) {
                                a.teaser && (a.image = a.teaser.image, c.single(d(a.image.w400)).then(function(b) {
                                    a.mainImageLoaded = b
                                }))
                            }), g = f, a.maxNearbyPlacesToDisplay = h[0], a.recommendedItemsLength = f.length, a.recommendedItems = f.slice(0, a.maxNearbyPlacesToDisplay), e.click("pdc:ModulePlacesNearby:shown"))
                        })
                    }
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModulePrivateCollections", ["$location", "User", "RedirectService", "CollectionsService", "TrackingService", function(a, b, c, d, e) {
        return {
            scope: !0,
            templateUrl: "features/places/pdcModules/pdcModulePrivateCollections/pdcModulePrivateCollections.html",
            replace: !0,
            link: function(f) {
                var g = !1,
                    h = function(a) {
                        var b = a && a.length > 0;
                        b ? (a.sort(function(a, b) {
                            return a.createdTime < b.createdTime ? 1 : -1
                        }), f.collections = a, e.click("pdc:ModulePrivateCollections:shown")) : f.collections = null, g = !!b
                    },
                    i = function() {
                        return b.isLoggedIn() ? void d.getFavoriteRef(f.place).then(function(a) {
                            a ? angular.isArray(a.collectionId) && a.collectionId ? d.getCollectionsByIds(a.collectionId).then(h) : d.getCollectionById(d.UNSORTED_KEY).then(function(a) {
                                var b = a ? [a] : null;
                                h(b)
                            }) : h()
                        }, h) : (f.collections = null, void(g = !1))
                    };
                f.isAvailable = function() {
                    return g
                }, f.$watch("place", function(b) {
                    b && (i(), a.search().favedit && (f.editMode = !0, a.search("favedit", null).replace()))
                }), f.$on("userLoggedIn", i), f.$on("collectionsModalClosed", i), f.goToCollection = function(a) {
                    c.goToCollection(a, "collection detail")
                }
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleReviews", ["TrackingService", function(a) {
        return {
            scope: {
                place: "="
            },
            templateUrl: "features/places/pdcModules/pdcModuleReviews/pdcModuleReviews.html",
            replace: !0,
            link: function(b) {
                b.$watch("place.media.reviews", function(b) {
                    b && b.available && a.click("pdc:ModuleReviews:shown")
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleShare", ["$http", "$document", "$timeout", "$window", "splitTesting", "Shorten", "ZeroClipboard", function(a, b, c, d, e, f, g) {
        var h = !1;
        return {
            templateUrl: "features/places/pdcModules/pdcModuleShare/pdcModuleShare.html",
            replace: !0,
            link: function(a) {
                e.start("copyPdcUrl2"), a.flashAvailable = !g.isFlashUnusable(), a.showShare = !1, a.$on("openShare", function() {
                    a.showShare = !a.showShare
                }), a.$watch("place.view", function(b) {
                    a.showShare = !1, a.viewUrl = b
                }), a.$watch("showShare", function(b) {
                    b ? f.url(a.place.view).then(function(b) {
                        a.shareUrl = b
                    }) : a.shareUrl = null
                }), a.selectUrl = function(a) {
                    h || (e.conversion("copyPdcUrl2"), h = !0);
                    var b = a.currentTarget;
                    b.setSelectionRange ? (b.focus(), b.setSelectionRange(0, 9999)) : b.select()
                }, a.trackCopy = function() {
                    a.sharedLink = !0, c(function() {
                        a.sharedLink = !1
                    }, 3e3), h || (e.conversion("copyPdcUrl2"), h = !0)
                }
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleStreetLevel", ["$timeout", "$rootScope", "RedirectService", "Features", "panelsService", "MIAPI", "ensureHTTPSFilter", "TrackingService", "streetLevel", "mapsjs", function(a, b, c, d, e, f, g, h, i, j) {
        return {
            scope: {
                place: "=",
                marker: "="
            },
            templateUrl: "features/places/pdcModules/pdcModuleStreetLevel/pdcModuleStreetLevel.html",
            replace: !0,
            link: function(c) {
                c.streetLevelData = null, c.openStreetLevel = function(d) {
                    h.track("pdc", "StreetLevel entered", {
                        prop32: d,
                        eVar32: d
                    }), c.marker && c.marker.removeFlag && c.marker.removeFlag(), b.whenMapIsReady.then(function(a) {
                        a.setCenter(c.streetLevelData.point)
                    }), a(function() {
                        i.enterStreetLevel().then(function() {
                            i.lookAt(c.streetLevelData.tilt, c.streetLevelData.bearing, !0)
                        })
                    }, 10)
                }, c.onPicletResponse = function(a) {
                    c.streetLevelData = a.panoramaParameters, d.mocks || b.whenMapIsReady.then(i.loadStreetLevel).then(function() {
                        j.PanoramaUtil.prefetchImages(c.streetLevelData.prefix), j.PanoramaSearchService.getClosestPanoramas(c.streetLevelData.point, function(a) {
                            a.length > 0 && j.PanoramaUtil.prefetchPanorama(a[0])
                        }, 1, 500)
                    }), h.click("pdc:ModuleStreetLevel:shown")
                }, c.$watch("place.location", function(a) {
                    a && (c.streetLevelData = null, f.piclet({
                        dimensions: e.getDimensions(),
                        point: a.position
                    }).then(c.onPicletResponse))
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleTips", ["$timeout", function(a) {
        return {
            scope: {
                items: "=",
                title: "@"
            },
            templateUrl: "features/places/pdcModules/pdcModuleTips/pdcModuleTips.html",
            replace: !0,
            link: function(b) {
                b.$watch("items", function() {
                    b.isLoading = !0, a(function() {
                        b.isLoading = !1
                    }, 100)
                })
            }
        }
    }]), angular.module("hereApp.places").directive("pdcModuleWhatReviewersSay", ["TrackingService", function(a) {
        return {
            scope: {
                place: "="
            },
            templateUrl: "features/places/pdcModules/pdcModuleWhatReviewersSay/pdcModuleWhatReviewersSay.html",
            replace: !0,
            link: function(b) {
                b.$watch("place.media.reviews", function(c) {
                    if (c && c.available) {
                        var d = c.suppliers.items[0].items;
                        b.place.whatReviewersSay = d.map(function(a) {
                            return {
                                text: a.title ? a.title : "hmmmm... thinking about it...",
                                sentiment: a.rating && a.rating > 3 ? "positive" : "negative"
                            }
                        }), b.place.whatReviewersSay.length && a.click("pdc:ModuleWhatReviewersSay:shown")
                    }
                })
            }
        }
    }]), angular.module("hereApp.reportImage").controller("ReportImageCtrl", ["$rootScope", "$scope", "reportSLI", "utilityService", "Features", function(a, b, c, d, e) {
        b.reason = "", b.kind = "", b.invalid = !0, b.checked = !1, b.homeChecked = !1, b.validation = d.validation, b.isReportSLIHomeNumber = e.map.reportSLIHomeNumber;
        var f, g;
        a.whenMapIsReady.then(function(a) {
            f = a, g = f.getViewPort().element.parentNode.parentNode.parentNode, g.classList.add("portal_show")
        }), b.submitReport = function() {
            if (b.reason && b.kind) {
                var a = {
                    problem: "imageQuality" === b.reason ? "IMAGE_QUALITY" : "IMAGE_BLURRING",
                    imageProblem: b.kind,
                    email: b.email ? b.email : "",
                    description: b.description ? b.description : ""
                };
                b.sending = !0, c.report(a, f).then(function() {
                    b.closePopover(), b.$emit("popover", {
                        templateUrl: "features/reportImage/reportImageConfirm.html"
                    })
                })["finally"](function() {
                    b.sending = !1
                })
            }
        }, b.$on("$destroy", function() {
            g.classList.remove("portal_show")
        })
    }]), angular.module("hereApp.reportMapProblem").controller("ReportMapProblemCtrl", ["$rootScope", "$scope", "Features", "reportMapProblem", "Config", "$sce", "geoCoder", "User", "mapsjs", "$window", function(a, b, c, d, e, f, g, h, i, j) {
        var k, l = b.popups[0].place;
        b.url = "", b.useMapReportWidget = c.mapReportingWidget, b.height = j.outerHeight < 770 ? 500 : 550, b.useMapReportWidget ? (j.addEventListener("message", function(a) {
            "FeedbackWidgetClose" === a.data && b.closePopover(0)
        }, !1), a.whenMapIsReady.then(function(a) {
            k = a;
            var c = e.mapReporting.url,
                d = l && l.location ? l.location.position : k.getCenter(),
                j = d.lat + "," + d.lng,
                m = ["accId=", "appId=" + e.appId, "coord=" + j, "report=", "zoomLevel=" + k.getZoom(), "mapType=" + k.getBaseLayer() === i.mapUtils.SATELLITE ? "hybrid" : "normal", "locale=" + h.locale.tag, "cb=mapReporterCallback"];
            l && (m.push("name=" + l.name), m.push("linkid=" + l.placeId)), g.reverseGeoCode({
                location: d
            }).then(function() {
                b.url = f.trustAsResourceUrl(c + "?" + m.join("&"))
            })
        })) : (a.whenMapIsReady.then(function(a) {
            k = a
        }), b.submitReport = function() {
            d.report(b.details, k), b.closePopover(), b.$emit("popover", {
                templateUrl: "features/reportMapProblem/reportMapProblemConfirm.html"
            })
        })
    }]), angular.module("hereApp.search").controller("SearchBarCtrl", ["$scope", "$rootScope", "$timeout", "$location", "$routeParams", "$route", "Features", "directionsUrlHelper", "ItineraryItem", "RecentsService", "PBAPI", "mapsjs", "RedirectService", "TrackingService", "utilityService", "placeService", "categoriesLive", "$q", "LocationService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
        var t, u = this,
            v = u.map = {},
            w = function(b) {
                var c = angular.copy(b),
                    d = c.query,
                    e = function(a) {
                        return !a || a.length > 1 || g.search.desti ? !1 : p.isDiscoverCategory(a[0])
                    },
                    f = function(b) {
                        var c = p.addReasons(b.suggestionItems[0], a.query);
                        m.goToPlace(c, "single search result found"), a.autosuggest.hide(!0)
                    },
                    h = function(b) {
                        x(d, "typed"), 1 !== b.suggestionItems.length || g.search.desti ? (m.goToSearch(d), a.autosuggest.hide(!0)) : f(b)
                    };
                return b.suggestionItems[0] && b.suggestionItems[0].bbox && (c.suggestionItems[0].bbox = b.suggestionItems[0].bbox), g.search && g.search.categories ? void q.getCategoryByName(d, !0).then(function(b) {
                    b && !e(c.suggestionItems) ? (m.goToCategory(b.id), a.autosuggest.hide(!0)) : h(c)
                }) : void h(c)
            },
            x = function(a, b, c, d) {
                var e = "Search Performed",
                    f = {
                        prop32: e,
                        eVar32: e,
                        prop36: a,
                        eVar36: a,
                        prop38: b,
                        eVar38: b
                    };
                c && (f.prop37 = f.eVar37 = c), d && (f.prop39 = f.eVar39 = d), n.track("search", e, f, "event14")
            };
        b.whenMapIsReady.then(function(a) {
            v = u.map = a
        }.bind(this)), u.setQueryFromURL = function() {
            0 === d.$$path.indexOf("/search/") && e.query ? a.query = decodeURIComponent(e.query) : g.search && g.search.categories && 0 === d.$$path.indexOf("/discover/") && e.categoryId ? q.getCategoryById(e.categoryId, !0).then(function(b) {
                a.query = b && b.title ? b.title : ""
            }) : a.query = ""
        }, u.setQueryFromURL(), a.onSubmit = function(b) {
            var c = b.trim();
            c && 0 !== c.trim().length && (a.autosuggest.hasBeenSubmitted = !0, a.autosuggest.requestedInfo = !1, a.autosuggest.isInProgress !== c && r.when(a.autosuggest.searchSuggestions(c)).then(function(b) {
                a.autosuggest.proceedSuggestions(b, c)
            }))
        }, a.onClickBack = function() {
            a.autosuggest.hide(), s.goBack()
        }, a.autosuggest = {
            suggestionItems: [],
            recentItems: [],
            categoryItems: [],
            subCategoryItems: [],
            items: [],
            maxItemsNumber: 4,
            recentItemsLimit: g && g.search && g.search.categories ? 4 : 5,
            searchCategories: function(a) {
                if (!g || !g.search || !g.search.categories || a && a.length && !g.search.categoriesFiltered) return [];
                var b = g && g.search && g.search.categoriesFilteredFull;
                return q.search(a, b)
            },
            processCategories: function(b) {
                a.autosuggest.categoryItems = b ? angular.copy(b) : []
            },
            searchSuggestions: function(b) {
                if (a.autosuggest.isInProgress !== b && o.isValidSearchQuery(b) && (a.autosuggest.hasBeenSubmitted || o.isValidSearchQuery(b, 3))) {
                    var c = {
                        size: 5,
                        q: b,
                        center: v.getCenter(),
                        viewBounds: v.getViewBounds(),
                        lookahead: !0
                    };
                    return a.autosuggest.isInProgress && t.abort(), a.autosuggest.isInProgress = b, t = k[g.search.newSuggestions ? "suggestions" : "search"](c)
                }
            },
            proceedSuggestions: function(b, c) {
                if (b && b.data) {
                    var d = g.search.newSuggestions ? b.data.suggestions : b.data.items;
                    d.forEach(function(a) {
                        var b = p.isCoordinate(a);
                        a.title = b ? a.title.replace(/,/g, "") : a.title, a.category.id = p.getMainCategoryId(a)
                    }), a.autosuggest.suggestionItems = d, g.search.newSuggestions || (a.autosuggest.suggestionContext = b.data.context), a.autosuggest.suggestionBbox = v.getViewBounds()
                } else a.autosuggest.suggestionItems = [];
                a.autosuggest.isInProgress = null, a.autosuggest.hasBeenSubmitted && (a.autosuggest.query = c, w(a.autosuggest))
            },
            searchRecents: function(b) {
                var c = j.types.search | j.types.place;
                return j.getItems(b, c, a.autosuggest.recentItemsLimit + 2)
            },
            proceedRecents: function(b, c) {
                if (b) {
                    var f = e.id,
                        g = e.query,
                        h = d.search() ? d.search().msg : "",
                        i = b.filter(function(a) {
                            return a.data.id !== f && a.data.title !== g && a.data.title !== c && a.data.title !== h
                        });
                    a.autosuggest.recentItems = i.splice(0, a.autosuggest.recentItemsLimit)
                }
            },
            _mergeResults: function(b) {
                if (g.search && g.search.categoriesFiltered) {
                    var c = o.arraysBalance([a.autosuggest.recentItems, a.autosuggest.suggestionItems], a.autosuggest.maxItemsNumber);
                    a.autosuggest.recentItems = c[0], a.autosuggest.suggestionItems = c[1]
                }
                a.autosuggest.items = a.autosuggest.recentItems.concat(a.autosuggest.suggestionItems, a.autosuggest.categoryItems), a.autosuggest.subCategoryItems = [], a.autosuggest.query = b
            },
            onActivate: function(b) {
                return b && "urn:nlp-types:category" === b.type ? void(b && b.hasSubCategories ? q.getCategories(b.id).then(function(c) {
                    a.autosuggest.subCategoryItems = c.map(function(a) {
                        var c = angular.copy(a);
                        return c.hasSubCategories = !1, c._autosuggestParent = b, c
                    })
                }) : b._autosuggestParent || (a.autosuggest.subCategoryItems = [])) : void(a.autosuggest.subCategoryItems = [])
            },
            onSelect: function(b) {
                if (b) {
                    var c, d = a.autosuggest.suggestionItems.indexOf(b) >= 0,
                        e = d ? a.autosuggest.suggestionItems : a.autosuggest.recentItems,
                        f = e ? e.length : 0,
                        g = e ? e.indexOf(b) + 1 : -1,
                        h = g > 0 ? d ? "suggestion" : "recent" : void 0;
                    g > 0 && x(a.query, h, f, g);
                    var i = "";
                    if (b.data && b.type) switch (b.type) {
                            case j.types.place:
                                angular.isArray(b.data.bbox) && (b.data.bbox = new l.geo.Rect(b.data.bbox[0], b.data.bbox[1], b.data.bbox[2], b.data.bbox[3])), b.data.matches = {
                                    available: 1,
                                    items: [{
                                        text: "You recently visited this place"
                                    }]
                                }, m.goToPlace(b.data, h);
                                break;
                            case j.types.search:
                                b.data.boundingBox && (c = b.data.boundingBox, v.setViewBounds(new l.geo.Rect(c[0], c[1], c[2], c[3]))), i = b.data.title, m.goToSearch(o.unescapeTags(i))
                        } else if ("urn:nlp-types:search" === b.type) m.goToSearch(b.title);
                        else if ("urn:nlp-types:category" === b.type) {
                        var k = b._autosuggestParent && b._autosuggestParent.id;
                        m.goToCategory(b.id, {
                            parentCategoryId: k,
                            query: a.query
                        })
                    } else b = p.addReasons(b, a.query), m.goToPlace(b, h);
                    a.query = i, a.autosuggest.hide(!0)
                }
            },
            onReset: function() {
                a.autosuggest.hide()
            },
            hide: function(b) {
                b && (a.autosuggest.hasBeenSubmitted = !1), a.autosuggest.preventMerge = !0, a.autosuggest.items = [], a.autosuggest.subCategoryItems = []
            },
            requestItems: function() {
                a.autosuggest.requestedInfo = !0, a.autosuggest.triggerSuggestions()
            },
            triggerSuggestions: o.debounce(function() {
                var b = a.query;
                !a.autosuggest.requestedInfo || a.autosuggest.isInProgress && b === a.autosuggest.isInProgress || (a.autosuggest.preventMerge = !1, r.all([a.autosuggest.searchRecents(b), a.autosuggest.searchSuggestions(b), a.autosuggest.searchCategories(b)]).then(function(c) {
                    a.autosuggest.proceedRecents(c[0], b), a.autosuggest.proceedSuggestions(c[1], b), a.autosuggest.processCategories(c[2])
                }).then(function() {
                    a.autosuggest.preventMerge || a.autosuggest._mergeResults(b)
                }))
            })
        }, u.updateForSingleResult = function() {
            var b, c, d = a.autosuggest.recentItems,
                e = a.autosuggest.suggestionItems;
            0 === d.length && 1 === e.length && (b = e[0]), 0 === e.length && 1 === d.length && (b = d[0]), b && (c = new i(""), c.populate({
                data: b
            }), a.directionsUrl = h.createUrlForItems([new i(""), c], "drive"))
        }, u.updateBackButtonState = function() {
            a.showBackButton = !s.isEntryPoint()
        }, a.$watch("query", function() {
            a.directionsUrl = h.createUrlForSearchBar(a.query)
        }), a.$watch("autosuggest.recentItems", u.updateForSingleResult), a.$watch("autosuggest.suggestionItems", u.updateForSingleResult), a.$on("$routeChangeSuccess", u.setQueryFromURL), a.$on("$routeChangeSuccess", u.updateBackButtonState), a.$on("$locationChangeSuccess", u.updateBackButtonState), u.updateBackButtonState()
    }]), angular.module("hereApp.search").controller("SearchCtrl", ["$rootScope", "$scope", "$q", "Features", "PBAPI", "hereBrowser", "markerIcons", "categories", "markerService", "$timeout", "$location", "$routeParams", "$sanitize", "herePageTitle", "mapContainers", "mapsjs", "utilityService", "PreloadImage", "RecentsService", "$window", "RedirectService", "TrackingService", "panelsService", "CollectionsService", "ensureHTTPSFilter", "placeService", "CollectionsAlwaysVisibleService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A) {
        b.resultsNext = !1, b.searching = !1, b.searchingMore = !1, b.query = "", b.favoritePlacesIds = [];
        var B, C = this,
            D = o.search,
            E = 20,
            F = !1,
            G = d.search.desti ? "destiSearch" : "search",
            H = function(a) {
                t.history.replaceState({
                    map: a
                }, null, null)
            },
            I = function() {
                var c = B ? B.getCenter() : {
                        lat: 0,
                        lng: 0
                    },
                    d = B && B.getViewBounds ? B.getViewBounds() : null;
                if (!q.isValidSearchQuery(b.query)) return b.results = [], void(b.boundingBox = null);
                b.searching = !0;
                var f = {
                        size: E,
                        q: b.query,
                        center: c,
                        viewBounds: d,
                        teasers: E,
                        image_dimensions: "w400"
                    },
                    g = e[G](f);
                g.then(function(e) {
                    var f = e.data;
                    f = f || {}, b.results = f.items || [], b.contextCenter = c, b.boundingBox = d, b.resultsNext = f.next || null, b.results.forEach(function(a, c) {
                        if (b.results[c].teaser && b.results[c].teaser.image) {
                            b.results[c].image = b.results[c].teaser.image;
                            var d = b.results[c].image.w400;
                            r.single(y(d)).then(function(a) {
                                b.results[c].mainImageLoaded = a
                            })
                        }
                    });
                    var g = "Search list displayed";
                    v.track("search", g, {
                        prop32: g,
                        eVar32: g,
                        prop36: b.query,
                        eVar36: b.query,
                        prop37: f.items.length,
                        eVar37: f.items.length
                    });
                    var h = "Searched for";
                    n.set(h + ' "' + decodeURIComponent(b.query) + '" - HERE'), a.whenMapIsReady.then(function(a) {
                        b.displayMarkers(a)
                    }), s.addSearch({
                        query: b.query,
                        context: f.context,
                        boundingBox: d
                    })
                }), g["finally"](function() {
                    b.searching = !1
                })
            };
        a.whenMapIsReady.then(function(a) {
            B = a, o.showOnly(D)
        }), b.search = function() {
            if (q.isValidSearchQuery(b.query)) {
                var a = "/search/" + encodeURIComponent(b.query);
                if (a === k.path()) {
                    I();
                    var c = {
                        latitude: B.getCenter().lat,
                        longitude: B.getCenter().lng,
                        zoomLevel: B.getZoom()
                    };
                    H(c)
                } else k.path(a)
            }
        }, b.cleanUp = function() {
            B && B.removeEventListener("mapviewchangeend", K)
        }, b.$on("$destroy", b.cleanUp), b.displayMarkers = function() {
            var a, c = b.results;
            if (b.searchingMore) {
                var e = Math.max(Math.floor(c.length / E) - 1, 0) * E,
                    f = c.length - e;
                c = c.slice(c.length - f)
            } else o.clearContainer(D);
            if (c && c.length) {
                var j = M(b.results),
                    k = j.isZoomNeeded;
                if (a = c.map(function(a, c) {
                        var e, f = a.category ? a.category.id : "unknown",
                            j = g.category(f),
                            k = g.collected(f),
                            l = h.getSVG(f),
                            m = h.getSVG(f).replace(/#fff/gi, "#ffe600"),
                            n = {
                                position: a.position,
                                icons: j,
                                collectedIcons: k,
                                flag: {
                                    title: a.title,
                                    icon: l,
                                    collectedIcon: m
                                },
                                onMouseEnter: function() {
                                    b.$apply(function() {
                                        b.addResultHighlight(a)
                                    })
                                },
                                onMouseLeave: function() {
                                    b.$apply(function() {
                                        b.removeResultHighlight(a)
                                    })
                                },
                                onClick: function(d, e) {
                                    e.preventDefault(), a = z.addReasons(a, b.query, c), u.goToPlace(a, "search result marker"), C.removeResultVisibility(a)
                                }
                            };
                        return d.scrollToPlace && (n.flag.openCallback = function() {
                            b.$apply(function() {
                                C.addResultVisibility(a)
                            })
                        }, n.flag.closeCallback = function() {
                            b.$apply(function() {
                                C.removeResultVisibility(a)
                            })
                        }), a.id.match(/^loc-[0-9a-zA-Z]+/) ? (n.locationAddress = a.title + ", " + a.vicinity, n.locId = a.id) : n.PBAPIID = a.id, e = i.createMarker(n)
                    }), D.addObjects(a), A.showAllFavorites(), k) {
                    var l = 1 === c.length && c[0].bbox ? c[0].bbox : D.getBounds(),
                        m = B.getCameraDataForBounds(l, !0).zoom;
                    m > 16 ? (B.setViewBounds(l), B.setZoom(16), b.resultsBoundingBox = B.getViewBounds()) : (B.setViewBounds(l), b.resultsBoundingBox = l)
                }
            }
        }, b.boxOver = function(a) {
            var b = o.getExistingMarkerByPBAPIID(a.id);
            i.getWrapped(b).addHighlight()
        }, b.boxOut = function(a) {
            var b = o.getExistingMarkerByPBAPIID(a.id);
            i.getWrapped(b).removeHighlight()
        }, C.addResultVisibility = function(a) {
            a.highlight = !0, a.shouldBeVisible = !0
        }, C.removeResultVisibility = function(a) {
            a.highlight = !1, a.shouldBeVisible = !1
        }, b.addResultHighlight = function(a) {
            a.highlight = !0
        }, b.removeResultHighlight = function(a) {
            a.highlight = !1
        }, b.boxClick = function(a) {
            var c = b.results.indexOf(a),
                d = "search result clicked";
            v.track("search", d, {
                prop32: d,
                eVar32: d,
                prop36: b.query,
                eVar36: b.query,
                prop37: b.results.length,
                eVar37: b.results.length,
                prop39: c,
                eVar39: c
            }), a = z.addReasons(a, b.query, c), u.goToPlace(a, "search result list"), C.removeResultVisibility(a)
        }, b.searchMore = function() {
            var a = "load more results clicked",
                c = {
                    viewBounds: b.boundingBox,
                    href: b.resultsNext,
                    size: E
                };
            v.track("search", a, {
                prop32: a,
                eVar32: a,
                prop36: b.query,
                eVar36: b.query
            }), b.resultsNext && (b.searchingMore = !0, e[G](c).then(function(a) {
                var c = a.data;
                c = c || {}, c.items.forEach(function(a, b) {
                    if (c.items[b].teaser && c.items[b].teaser.image) {
                        c.items[b].image = c.items[b].teaser.image;
                        var d = c.items[b].image.w400;
                        r.single(y(d)).then(function(a) {
                            c.items[b].mainImageLoaded = a
                        })
                    }
                }), b.results = b.results.concat(c.items || []), b.resultsNext = c.next, c.items && c.items.length && b.displayMarkers(B), b.searchingMore = !1
            }))
        };
        var J = function(a, b) {
                var c;
                a ? (c = q.convertQueryFormatToMapInfo(a, b), H(c)) : t.history.state && t.history.state.map && (c = t.history.state.map), q.isObjectEmpty(c) || (F = !0, c.longitude === b.getCenter().lng && c.latitude === b.getCenter().lat && c.zoomLevel === b.getZoom() ? K() : b.getViewModel().setCameraData({
                    position: new p.geo.Point(c.latitude, c.longitude),
                    zoom: c.zoomLevel
                }))
            },
            K = function() {
                F && (I(), b.displayMarkers(B), F = !1)
            },
            L = function() {
                return l && q.isValidSearchQuery(l.query) ? (w.isMinimized = !1, D.setVisibility(!0), b.query = decodeURIComponent(l.query), n.set('Search for "' + decodeURIComponent(b.query) + '" - HERE'), void a.whenMapIsReady.then(function(a) {
                    J(k.search().map, a), a.addEventListener("mapviewchangeend", K)
                })) : void k.path("/discover").replace()
            },
            M = function(a) {
                var c, d, e = [],
                    f = B.getViewBounds();
                if (b.searchingMore) c = a, d = !c.every(function(a) {
                    return f.containsPoint(a.position)
                });
                else {
                    for (var g = 0; g < a.length; g++) {
                        var h = a[g];
                        f.containsPoint(h.position) && e.push(h)
                    }
                    d = 0 === e.length, c = e.length > 0 ? e : a
                }
                return {
                    results: c,
                    isZoomNeeded: d
                }
            };
        L()
    }]), angular.module("hereApp.sendToCar").controller("SendToCarCtrl", ["$q", "sendToCar", "carIdStorage", "carManufacturerStorage", "$scope", "TrackingService", "geoCoder", "PBAPI", function(a, b, c, d, e, f, g, h) {
        var i = this;
        i.initialize = function() {
            e.context = e.modals[0].context, e.isContextRoute = !(!e.context || !e.context.isRoute), e.rememberCarId = !0, e.showErrorNotification = !1, b.getManufacturers(e.isContextRoute).then(function(a) {
                e.manufacturers = a, e.manufacturer = i.getLastManufacturer(a), e.$watch("manufacturer", i.onManufacturerChange), e.$watch("carId", i.onCarIdChange)
            })
        }, i.getLastManufacturer = function(a) {
            var b = d.getLast();
            return b && b in a ? b : Object.keys(a)[0]
        }, i.onManufacturerChange = function() {
            d.setLast(e.manufacturer), e.carId = c.getCarId(e.manufacturer)
        }, i.onCarIdChange = function() {
            e.error = void 0, e.form.carId.$setValidity("", !0)
        }, i.successCallback = function() {
            e.success = !0, e.sendingToCar = !1, e.rememberCarId && c.saveCarId(e.manufacturer, e.carId)
        }, i.errorCallback = function(a) {
            e.error = a, e.sendingToCar = !1, e.showErrorNotification = a && !a.data.wrongID, a && a.data.wrongID && e.form.carId.$setValidity("", !1)
        }, i.resolveItineraryItem = function(a) {
            return a.id ? h.place({
                id: a.id
            }) : g.reverseGeoCode({
                location: {
                    lat: a.mapCoordinate.lat,
                    lng: a.mapCoordinate.lng
                }
            })
        }, i.getValueFromAdditionalData = function(a, b) {
            if (!a.additionalData || !Array.isArray(a.additionalData)) return null;
            var c = a.additionalData.filter(function(a) {
                return a.key === b
            })[0];
            return c && c.value
        }, i.toAutomotiveCloudAddress = function(a) {
            var b = {};
            return a.label ? (b.house = a.houseNumber, b.street = a.street, b.city = a.city, b.province = i.getValueFromAdditionalData(a, "StateName") || a.city, b.district = a.district, b.state = a.state, b.country = i.getValueFromAdditionalData(a, "CountryName") || a.country, b.countryCode = a.country, b.postalCode = a.postalCode, b.text = a.label) : (b.house = a.house, b.street = a.street, b.city = a.city, b.district = a.district, b.state = a.state, b.country = a.country, b.countryCode = a.countryCode, b.postalCode = a.postalCode, b.text = a.text), {
                address: b
            }
        }, e.send = function(c, d, g) {
            e.showErrorNotification = !1, e.isContextRoute ? a.all(g.itineraryItems.map(i.resolveItineraryItem)).then(function(a) {
                a.map(function(a) {
                    return a.data.address || a.data.location.address
                }).map(function(a, b) {
                    angular.extend(g.itineraryItems[b], i.toAutomotiveCloudAddress(a))
                }), f.track("send2car", "User clicks on 'Send' button in the 'SendToCar' modal to send route to car.", {
                    prop32: "Send route to Car requested",
                    eVar32: "Send route to Car requested"
                }), b.sendRouteToCar(c, d, g).then(i.successCallback, i.errorCallback)
            }, i.errorCallback) : (f.track("send2car", "User clicks on 'Send' button in the 'SendToCar' modal to send place to car.", {
                prop32: "Send place to Car requested",
                eVar32: "Send place to Car requested"
            }), b.sendToCar(c, d, g).then(i.successCallback, i.errorCallback))
        }, i.initialize()
    }]), angular.module("hereApp.settings").controller("SettingsCtrl", ["$scope", "$window", "ipCookie", "Config", "User", "unitsStorage", "Features", "RecentsService", function(a, b, c, d, e, f, g, h) {
        var i = this;
        a.isImperialUKUS = g.imperialUSUK, a.actionStatus = {
            enabled: 0,
            disabled: 1,
            inProgress: 2,
            completed: 3,
            error: 10
        }, a.submit = function() {
            i.distance !== a.distance && f.saveDistanceUnit(a.distance), a.isImperialUKUS && i.distanceSystemUnit !== a.distanceSystemUnit && (f.saveDistanceSystemUnit(a.distanceSystemUnit), f.saveDistanceUnit("metric" === a.distanceSystemUnit ? "kilometers" : "miles")), i.temperature !== a.temperature && f.saveTemperatureUnit(a.temperature), i.language !== a.language.tag && i.saveLanguage(a.language.tag), a.closeDialog()
        }, i.saveLanguage = function(a) {
            var e = d.cookieNotice;
            c("locale", a, {
                path: "/",
                expires: 86400,
                expirationUnit: "hours",
                domain: e.cookieDomain
            }), b.location.reload()
        }, i.makeSupportedLanguages = function(a) {
            var b = {
                "nl-nl": "Nederlands",
                "en-gb": "English GB",
                "en-us": "English US",
                "fr-fr": "Français",
                "de-de": "Deutsch",
                "id-id": "Indonesia",
                "it-it": "Italiano",
                "pl-pl": "Polski",
                "pt-br": "Português",
                "es-es": "Español",
                "th-th": "ไทย",
                "tr-tr": "Türkçe",
                "vi-vn": "Tiếng Việt",
                "zh-tw": "中文(台灣)",
                "el-gr": "Ελληνικά",
                "hu-hu": "Magyar",
                "ro-ro": "Român",
                "cs-cz": "Čeština",
                "ru-ru": "Pусский"
            };
            return a.map(function(a) {
                return {
                    tag: a,
                    label: b[a] || a
                }
            })
        }, i.clearRecents = function() {
            a.clearRecentsStatus = a.actionStatus.inProgress, a.clearRecentsEnabled = !1, h.deleteAllItems().then(function() {
                a.clearRecentsStatus = a.actionStatus.completed
            }, function() {
                a.clearRecentsStatus = a.actionStatus.error, a.clearRecentsEnabled = !0
            })
        }, i.initialize = function() {
            i.language = e.locale.tag, i.temperature = a.temperatureUnit, i.distance = a.distanceUnit, i.distanceSystemUnit = a.distanceSystemUnit, a.distance = i.distance, a.temperature = i.temperature, a.languages = i.makeSupportedLanguages(e.locale.supported), a.language = a.languages.filter(function(a) {
                return i.language === a.tag
            })[0], a.clearRecentsStatus = h.isEmpty() ? a.actionStatus.disabled : a.actionStatus.enabled, a.clearRecents = i.clearRecents, a.clearRecentsEnabled = a.clearRecentsStatus === a.actionStatus.enabled || a.clearRecentsStatus === a.actionStatus.error
        }, i.initialize()
    }]), angular.module("hereApp").controller("StyleGuideCtrl", ["$scope", function(a) {
        a.showErrorMessage = !0, a.showInfoMessage = !0, a.showSuccessMessage = !0
    }]), angular.module("hereApp.traffic").controller("CommuteCtrl", ["$rootScope", "$scope", "$location", "$q", "$document", "$window", "$filter", "$timeout", "mapsjs", "routing", "routeTrafficIncidents", "ItineraryItem", "routesParser", "recentRouteStorage", "directionsMapHelperFactory", "Features", "mapUtils", "hereBrowser", "readableTimeSpanFilter", "mapContainers", "TrackingService", "splitTesting", "routingUtilsFactory", "trafficUtilsFactory", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x) {
        var y, z, A, B, C, D = this,
            E = "0.5",
            F = "0.9",
            G = "From",
            H = "To",
            I = {};
        p.directions.hereJamFactor ? (b.jamFactorLabel = "HERE Jam Factor", b.jamFactorDescription = "Jam Factor is a number from 0 to 10 that describes the current level of congestion on a road. A Jam Factor of 0 means traffic is flowing freely, and a Jam Factor of 10 means traffic isn\'t moving at all.".replace("Jam Factor", "HERE Jam Factor").replace("Jam factor", "HERE Jam Factor")) : (b.jamFactorLabel = "Jam factor", b.jamFactorDescription = "Jam Factor is a number from 0 to 10 that describes the current level of congestion on a road. A Jam Factor of 0 means traffic is flowing freely, and a Jam Factor of 10 means traffic isn\'t moving at all."), p.traffic.improveInfo && (b.jamFactorLabel = "All delay info"), D.initialize = function() {
            A = o.create(this, b), B = w.create(this, b, A), C = x.create(b), b.jamfactorDescriptions = C.jamfactorDescriptions, b.showWidget = !1, b.commuteFlows = [], b.itineraryItemFocused = !1, b.recentSearchResults = [], b.currentRouteIndex = -1, b.currentRoute = null, b.currentMapCenter = {}, b.requestPending = !1, b.routeError = null, b.availableRoutes = [], b.availableRoutesTrafficIncidents = [], b.location = "", b.hoverRouteAlternative = A.hoverRouteAlternative, b.leaveRouteAlternative = A.leaveRouteAlternative, b.getContainerBottomRight = angular.noop, b.commuteRoutes = n.retrieveRoutesFromStorage("recentCommutes"), b.itineraryItems = [new l(G), new l(H)], a.whenMapIsReady.then(function(c) {
                y = c, b.mapZoomLevel = y.getZoom(), b.currentMapCenter = y.getCenter(), a.desiredMapType = "TRAFFIC", b.commuteRoutes.length ? (b.routeSelectable = !0, B.processGivenItineraryItems(b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems)) : b.showWidget = !0, p.imperialUSUK ? b.$watch("distanceSystemUnit", function() {
                    D.performRoutingCheck()
                }) : b.$watch("distanceUnit", function() {
                    D.performRoutingCheck()
                }), D.mapViewChangeEndCallback(), y.addEventListener("mapviewchangeend", D.mapViewChangeEndCallback)
            }), b.$watch("itineraryItems[0].getTitle() + itineraryItems[1].getTitle()", function() {
                D.performRoutingCheck(), D.updateItineraryItems()
            }), b.$on("$destroy", D.onDestroy)
        }, b.activateTraffic = function() {
            A.clearMapObjects(), c.path("/traffic/explore"), v.conversion("improveTrafficC2A")
        }, D.updateItineraryItems = function() {
            b.itineraryItems[0] && b.itineraryItems[0].query && (b.commuteOrigin = g("substring")(b.itineraryItems[0].query)), 0 !== b.itineraryItems.length && b.itineraryItems[b.itineraryItems.length - 1].query && (b.commuteDestination = g("substring")(b.itineraryItems[b.itineraryItems.length - 1].query))
        }, D.removeItinerary = function(a) {
            a.reset(), A.removeMarkerAt(b.itineraryItems.indexOf(a))
        }, b.reverseRoute = function() {
            b.currentRoute = null, b.currentRouteIndex = null, B.reverseRoute(), v.conversion("improveTrafficC2A")
        }, b.showItems = function(a, b) {
            B.showItems(a, b)
        }, b.resetAndShowItems = function(a, c) {
            D.removeItinerary(a), b.showItems(a, c)
        }, b.hoverSearchElement = function(a) {
            b.hoveredResultIndex = a
        }, b.leaveSearchElement = function() {
            b.hoveredResultIndex = null
        }, b.selectSearchElement = function(a, b) {
            B.selectSearchElement(a, b)
        }, b.selectFromSearchList = function() {
            B.selectFromSearchList()
        }, b.blurItineraryItem = function(a, b) {
            B.blurItineraryItem(a, b)
        }, D.performRoutingCheck = function() {
            var a = B.getNumberOfCompletedItineraryItems(),
                c = b.itineraryItems.length >= 2 && a === b.itineraryItems.length;
            c && D.sendRoutingRequest(), 0 === a && (A.clearMapObjects(), b.currentRoute = null), 2 > a && (b.availableRoutes = [])
        }, D.syncCurrentRoute = function() {
            A.clearMapObjects(), b.currentRoute = b.availableRoutes[b.currentRouteIndex], D.showRoute()
        }, D.sendRoutingRequest = function() {
            b.currentRouteIndex = null, b.requestPending = !0, b.availableRoutes = [], b.availableRoutesTrafficIncidents = [], b.routeError = null;
            var a = b.itineraryItems.map(function(a) {
                    return a.asWaypoint("car")
                }),
                c = D.sendTrafficRoutingRequest(a);
            b.state = 0, d.all([c.then(void 0, function(a) {
                return a
            })]).then(function(a) {
                200 !== a[0].status && D.onErrorRoutesCallback(a[0]), D.onRoutesCallback({
                    data: a[0].data
                })
            })
        }, D.sendTrafficRoutingRequest = function(a) {
            return z = j.route({
                waypoints: a,
                alternatives: 0,
                mode: {
                    type: "fastest",
                    transportModes: ["car"],
                    trafficMode: "enabled",
                    routeOptions: ""
                },
                departureDate: new Date,
                requestLinkAttributes: !0,
                avoidTransportTypes: ""
            })
        }, D.onErrorRoutesCallback = function(a) {
            b.availableRoutes = [], b.availableRoutesTrafficIncidents = [], a && a.cancelled ? b.routeError = null : (b.routeError = a && "NoRouteFound" === a.subtype ? "No timetable coverage available. Estimated PT Routing does not support arrival time." === a.details ? "noArrivalSupported" : "noRouteFound" : a && "InvalidInputData" === a.subtype ? "Arrival time is not supported." === a.details ? "noArrivalSupported" : "wrongParameters" : "networkProblems", b.requestPending = !1)
        }, D.onRoutesCallback = function(a) {
            a.data && (b.availableRoutes = a.data, b.availableRoutes.length >= 2 && (b.availableRoutes = b.availableRoutes.slice(0, 2)), b.availableRoutes.forEach(function(a) {
                a.segments = B.getLongestDriveRouteSegments(a, 2)
            }), A.polylines = m.parseRoutes(b.availableRoutes), b.currentRouteIndex = 0, b.requestPending = !1, b.recentRoutes = [], D.syncCurrentRoute(), b.flows = b.commuteFlows, B.updateItineraryItemsFromRouteWaypoints(b.availableRoutes[0].waypoint))
        }, D.showRoute = function() {
            b.currentRoute && (A.updateMarkers(), A.showRouteLinesOnMap(), t.directions.setVisibility(!0), t.trafficIncidents.setVisibility(!0), D.getTrafficFlowAlongRoute(), b.availableRoutesTrafficIncidents = [], k.getTrafficIncidentsForRoutes(b.availableRoutes).then(function(a) {
                a.length && (b.availableRoutesTrafficIncidents = a, k.displayIncidents(a[0]))
            }), y.addEventListener("mapviewchangeend", B.refreshRouteOnZoomChange))
        }, b.saveCommute = function() {
            b.availableRoutes.length && (n.storeRoute("recentCommutes", {
                itineraryItems: b.itineraryItems,
                mode: ["car"]
            }), b.currentRouteIndex = 0, D.syncCurrentRoute(), b.commuteRoutes = n.retrieveRoutesFromStorage("recentCommutes"), b.showWidget = !1, b.routeSelectable = !0, u.track("traffic", "User clicks Done button to save the commute", {
                prop32: "Commute is saved",
                eVar32: "Commute is saved"
            }))
        }, b.deleteCommute = function() {
            b.commuteRoutes = [];
            try {
                f.localStorage.removeItem("recentCommutes"), A.clearMapObjects(), b.itineraryItems = [new l(G), new l(H)]
            } catch (a) {}
        }, b.trackCommuteEdit = function() {
            u.track("traffic", "User clicks on 'Edit' commute button", {
                prop32: "Edit commute clicked",
                eVar32: "Edit commute clicked"
            }), v.conversion("improveTrafficC2A")
        }, b.showCommuteTrafficFlow = function(a) {
            var b = [];
            return a.flowShapes.forEach(function(c) {
                var d = D.createLine(a.jamFactor, c, !0),
                    e = d.getStyle();
                d.style.strokeColor = d.style.strokeColor.replace(E, F), d.setArrows({
                    frequency: 2
                }), d.setStyle(e), b.push(d)
            }), t.trafficIncidents.addObjects(b), b
        }, b.panelFlowClick = function(a) {
            if (a && a.flowShapes) {
                var b = q.makePoint({
                        lat: a.flowShapes[0][0],
                        lng: a.flowShapes[0][1]
                    }),
                    c = y.geoToScreen(b);
                u.click("traffic:trafficPanel:click"), h(function() {
                    D.showInfoFlag(a, {
                        x: c.x,
                        y: c.y
                    })
                }, 10)
            }
        }, b.hideCommuteTrafficFlow = function(a) {
            t.trafficIncidents.removeObjects(a)
        }, D.getTrafficFlowAlongRoute = function() {
            var a = A.polylines && A.polylines[b.currentRouteIndex] && angular.isArray(A.polylines[b.currentRouteIndex][0]),
                c = a ? A.polylines[b.currentRouteIndex][0].slice() : [];
            c = c.reverse(), b.commuteFlows.length = 0, angular.isArray(c) && c.length ? (c.forEach(function(a) {
                D.processCommuteFlowData(a)
            }), b.state = null) : b.state = 1
        }, D.processCommuteFlowData = function(c) {
            if (c.flowShapes = [], c.units = "kilometers" === a.distanceUnit ? "metric" : "imperial", b.commuteFlows.length) {
                var d = b.commuteFlows[b.commuteFlows.length - 1];
                if (d.roadName === c.roadName) {
                    if (d.baseTime += c.baseTime, d.jamCount === c.jamCount) {
                        var e = d.flowShapes[d.flowShapes.length - 1],
                            f = c.getStrip().getLatLngAltArray();
                        e.push.apply(e, f)
                    } else d.flowShapes.push(c.getStrip().getLatLngAltArray());
                    d.trafficSpeed = (d.trafficSpeed + c.trafficSpeed) / 2, d.jamFactor = Math.ceil((d.jamFactor + c.jamFactor) / 2)
                } else c.flowShapes = [c.getStrip().getLatLngAltArray().slice()], b.commuteFlows.push(c)
            } else c.flowShapes = [c.getStrip().getLatLngAltArray()], b.commuteFlows.push(c)
        }, D.createLine = function(a, b, c) {
            var d, e, f;
            return d = 10 === a ? "rgba(0, 0, 0, " + E + ")" : a >= 8 ? "rgba(255, 0, 0, " + E + ")" : a >= 4 ? "rgba(255,205, 0, " + E + ")" : "rgba(0, 255, 0, " + E + ")", e = c ? new i.geo.Strip(b) : i.geo.Strip.fromLatLngArray(b.value[0].trim().split(/,| /)), f = new i.map.Polyline(e, {
                style: {
                    lineWidth: 8,
                    lineCap: "round",
                    lineJoin: "round",
                    strokeColor: d
                }
            })
        }, D.showInfoFlag = function(a, c) {
            b.current = {
                jamFactor: a.jamFactor,
                roadName: a.roadName,
                roadEnd: a.roadEnd,
                delay: a.delay,
                speedAverage: a.speedAverage,
                x: c.x,
                y: c.y
            }
        }, b.setRouteOnClick = angular.noop, D.routeCardDelayTimeString = "incl. {{delayTime}} delay", b.getCarRouteDelayTimeString = function(a) {
            return B.getCarRouteDelayTimeString(a)
        }, b.panelFlowHighlight = function(a) {
            a ? I = b.showCommuteTrafficFlow(a) : (b.hideCommuteTrafficFlow(I), I = {})
        }, D.mapViewChangeEndCallback = function() {
            C.updateTrafficTitle(y, !0)
        }, D.onDestroy = function() {
            a.desiredMapType = "NORMAL", A.clearMapObjects(), y.removeEventListener("mapviewchangeend", D.mapViewChangeEndCallback), y.removeEventListener("mapviewchangeend", B.refreshRouteOnZoomChange)
        }, D.initialize()
    }]), angular.module("hereApp.traffic").controller("TrafficCtrl", ["$rootScope", "$scope", "$location", "$q", "$timeout", "$routeParams", "$filter", "mapsjs", "routeTrafficIncidents", "recentRouteStorage", "trafficFlow", "hereBrowser", "mapContainers", "trafficIncidents", "Features", "geoCoder", "markerClustering", "utilityService", "mapUtils", "TrackingService", "splitTesting", "trafficUtilsFactory", "panelsService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w) {
        var x, y, z, A, B = this,
            C = "0.0",
            D = "0.9",
            E = {},
            F = {},
            G = 0;
        B.initializeClustering = function() {
            var a = 16,
                b = 7,
                c = {
                    min: b,
                    clusteringOptions: {
                        minWeight: 3
                    }
                },
                d = {
                    svgPath: "/services/markerIcons/containers/incident-cluster.svg",
                    size: {
                        w: 30,
                        h: 33
                    },
                    options: {
                        maxZoomToCluster: a,
                        minZoomToShow: b,
                        upperLimit: 1e3
                    }
                };
            A = q.createClusterLayer(x, {
                cluster: c,
                theme: d
            }), x.addLayer(A)
        }, B.initialize = function() {
            y = v.create(b), z = [], b.jamfactorDescriptions = y.jamfactorDescriptions, b.exploreMode = !0, b.isCityView = !!f.trafficCity, b.flows = [], b.trafficFlows = [], b.location = "", b.hoveredElement = {}, b.currentMapCenter = {}, b.currentZoomLevel = 0, b.requestPending = !1, b.call2action = !1, w.isMinimized = !0, o.directions.hereJamFactor ? (b.jamFactorLabel = "HERE Jam Factor", b.jamFactorDescription = "Jam Factor is a number from 0 to 10 that describes the current level of congestion on a road. A Jam Factor of 0 means traffic is flowing freely, and a Jam Factor of 10 means traffic isn\'t moving at all.".replace("Jam Factor", "HERE Jam Factor").replace("Jam factor", "HERE Jam Factor")) : (b.jamFactorLabel = "Jam factor", b.jamFactorDescription = "Jam Factor is a number from 0 to 10 that describes the current level of congestion on a road. A Jam Factor of 0 means traffic is flowing freely, and a Jam Factor of 10 means traffic isn\'t moving at all."), o.traffic.improveInfo && (b.jamFactorLabel = "All delay info"), b.getContainerBottomRight = angular.noop, b.commuteRoutes = j.retrieveRoutesFromStorage("recentCommutes"), a.whenMapIsReady.then(function(c) {
                x = c, b.mapZoomLevel = x.getZoom(), F = x.getCenter(), B.initializeClustering(), a.desiredMapType = "TRAFFIC", o.imperialUSUK ? b.$watch("distanceSystemUnit", function() {
                    B.mapViewChangeEndCallback({}, !0)
                }) : b.$watch("distanceUnit", function() {
                    B.mapViewChangeEndCallback({}, !0)
                }), b.activateTraffic()
            }), b.$on("$destroy", B.onDestroy), b.$watch("commuteRoutes", B.updateItineraryItems)
        }, b.activateTraffic = function() {
            m.showOnly(m.trafficIncidents), x.addLayer(A), B.mapViewChangeEndCallback({}, !0), x.addEventListener("mapviewchangeend", B.mapViewChangeEndCallback), x.removeEventListener("mapviewchangeend", B.refreshRouteOnZoomChange), y.updateTrafficTitle(x, !0), b.flows = b.trafficFlows
        }, b.deactivateTraffic = function() {
            x.removeEventListener("mapviewchangeend", B.mapViewChangeEndCallback), x.removeLayer(A), c.path("/traffic/commute")
        }, B.updateItineraryItems = function() {
            0 !== b.commuteRoutes.length && b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems && (b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems[0] && (b.commuteOrigin = g("substring")(b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems[0].name)), b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems[1] && (b.commuteDestination = g("substring")(b.commuteRoutes[b.commuteRoutes.length - 1].itineraryItems[1].name)))
        }, B.getDistanceToleranceForZoomLevel = function(a) {
            switch (a) {
                case 7:
                    return 12e4;
                case 8:
                    return 6e4;
                case 9:
                    return 3e4;
                case 10:
                    return 24e3;
                case 11:
                    return 12e3;
                case 12:
                    return 6e3;
                case 13:
                    return 3e3;
                case 14:
                    return 1500;
                case 15:
                    return 800;
                case 16:
                    return 700;
                case 17:
                    return 500;
                case 18:
                    return 300;
                case 19:
                    return 200;
                case 20:
                    return 100;
                default:
                    return 18e4
            }
        }, B.doRepaintTrafficMap = function() {
            var a = !1,
                b = F,
                c = x.getCenter(),
                d = Math.floor(c.distance(b)),
                e = x.getZoom();
            return (G !== e || d > B.getDistanceToleranceForZoomLevel(e)) && (a = !0, F = c, G = e), a
        }, B.mapViewChangeEndCallback = function(a, c) {
            (B.doRepaintTrafficMap() || c) && (z.length = 0, b.trafficFlows.length = 0, y.updateTrafficTitle(x), m.clearContainer(m.trafficIncidents), x.getZoom() > 6 ? k.checkCoverage(x).then(function() {
                B.discoverTraffic()
            }, function(a) {
                b.state = "error" === a ? 3 : 2
            }) : b.state = 4)
        }, B.discoverTraffic = r.debounce(function() {
            var a = {};
            b.state = 0, b.trafficFlows.length = 0, d.all([n.getIncidentsForMap(x), k.getDataForMap(x)]).then(function(c) {
                var d = c[0],
                    f = c[1],
                    g = x.getViewBounds();
                if ("error" === f) return void(b.state = 3);
                if (d) {
                    var h = [];
                    d.forEach(function(a) {
                        g.containsPoint(a.LOCATION.GEOLOC.ORIGIN) && h.push(a)
                    });
                    var j = i.displayClusteredIncidents(h);
                    A.getProvider().setDataPoints(j.dataPoints)
                }
                if (f && f.length) {
                    var k = !1;
                    f.forEach(function(c) {
                        if (c.shapeData) {
                            var d = c.shapeData[0].value[0].split(" ")[0].split(","),
                                e = s.makePoint({
                                    lat: d[0],
                                    lng: d[1]
                                });
                            if (g.containsPoint(e)) {
                                if (c.shapeData.forEach(function(a) {
                                        B.updateTrafficData(c, a)
                                    }), c.lines && m.trafficIncidents.addObjects(c.lines), c.pushed) {
                                    k = !0;
                                    var f = a[c.roadTMC];
                                    f && (c.incidents = f), c.delay = Math.ceil(60 * (c.roadLength / c.speedAverage - c.roadLength / c.speedFreeFlow))
                                }
                                c.delay = Math.ceil(60 * (c.roadLength / c.trafficSpeed - c.roadLength / c.speedFreeFlow)), b.trafficFlows.push(c)
                            }
                        }
                    }), b.trafficFlows.length > 0 ? b.trafficFlows.sort(function(a, b) {
                        return a.roadName > b.roadName ? 1 : a.roadName < b.roadName ? -1 : 0
                    }) : e(function() {
                        b.state = 1
                    }, 10), b.trafficTime = f[0].timestamp, b.state = null
                } else b.state = 1
            })
        }, 10), b.boxOver = function(a) {
            a.lines.forEach(function(a) {
                var b = angular.extend({}, a.getStyle());
                b.strokeColor = b.strokeColor.replace(C, D), a.setArrows({
                    frequency: 2
                }), a.setStyle(b)
            })
        }, b.boxOut = function(a) {
            a.lines.forEach(function(a) {
                var b = angular.extend({}, a.getStyle());
                b.strokeColor = b.strokeColor.replace(D, C), a.setStyle(b)
            })
        }, B.createLine = function(a, b, c) {
            var d, e, f;
            return d = 10 === a ? "rgba(0, 0, 0, " + C + ")" : a >= 8 ? "rgba(255, 0, 0, " + C + ")" : a >= 4 ? "rgba(255,205, 0, " + C + ")" : "rgba(0, 255, 0, " + C + ")", e = c ? new h.geo.Strip(b) : h.geo.Strip.fromLatLngArray(b.value[0].trim().split(/,| /)), f = new h.map.Polyline(e, {
                style: {
                    lineWidth: 8,
                    lineCap: "round",
                    lineJoin: "round",
                    strokeColor: d
                }
            })
        }, B.updateTrafficData = function(a, c) {
            var d = B.createLine(a.jamFactor, c);
            if (x.getViewBounds().intersects(d.getBounds()) && a.jamFactor > 3) {
                if (a.lines || (a.lines = []), a.lines.push(d), a.pushed || (a.pushed = !0), l.isAndroid || l.isiOS) return;
                d.addEventListener("pointerenter", function() {
                    b.$apply(function() {
                        a.highlight = !0, a.lines.forEach(function(a) {
                            var b = angular.extend({}, a.getStyle());
                            b.strokeColor = b.strokeColor.replace(C, D), a.setArrows({
                                frequency: 2
                            }), a.setStyle(b)
                        })
                    })
                }), d.addEventListener("pointerleave", function() {
                    b.$apply(function() {
                        a.highlight = !1, a.lines.forEach(function(a) {
                            var b = angular.extend({}, a.getStyle());
                            b.strokeColor = b.strokeColor.replace(D, C), a.setArrows(), a.setStyle(b)
                        })
                    })
                }), d.addEventListener("tap", function(b) {
                    var c = b.pointers.length > 0 ? b.pointers[0] : b.currentPointer;
                    B.showInfoFlag(a, {
                        x: c.viewportX,
                        y: c.viewportY
                    }), t.click("traffic:routeLine:click")
                })
            }
        }, b.trackCommuteSetup = function() {
            t.track("traffic", "User clicks on 'Set up' commute button on the traffic panel", {
                prop32: "Set up commute clicked",
                eVar32: "Set up commute clicked"
            }), u.conversion("improveTrafficC2A")
        }, b.improveTrafficC2AConversion = function() {
            u.conversion("improveTrafficC2A")
        }, B.showInfoFlag = function(a, c) {
            b.current = {
                jamFactor: a.jamFactor,
                roadName: a.roadName,
                roadEnd: a.roadEnd,
                delay: a.delay,
                trafficSpeed: a.trafficSpeed,
                units: a.units,
                x: c.x,
                y: c.y
            }
        }, b.panelFlowHighlight = function(a) {
            a && a.lines ? (E = a, b.boxOver(a)) : (E.lines && b.boxOut(E), E = {})
        }, b.panelFlowClick = function(a) {
            if (a && a.shapeData) {
                var b = a.shapeData[0].value[0].split(" ")[0].split(","),
                    c = s.makePoint({
                        lat: b[0],
                        lng: b[1]
                    }),
                    d = x.geoToScreen(c);
                t.click("traffic:trafficPanel:click"), e(function() {
                    B.showInfoFlag(a, {
                        x: d.x,
                        y: d.y
                    })
                }, 10)
            }
        }, B.onDestroy = function() {
            a.desiredMapType = "NORMAL", x.removeLayer(A), x.removeEventListener("mapviewchangeend", B.mapViewChangeEndCallback), x.removeEventListener("mapviewchangeend", B.refreshRouteOnZoomChange)
        }, B.initialize()
    }]), angular.module("hereApp.service").factory("trafficUtilsFactory", ["$rootScope", "geoCoder", "cityStateOrCountryFilter", "Features", function(a, b, c, d) {
        var e, f = {};
        return f.create = function(g) {
            var h = function() {
                a.whenMapIsReady.then(function(a) {
                    e = a
                }), g.improveC2A = d.traffic.improveC2A
            };
            return f.jamfactorDescriptions = {
                4: "Moderate",
                5: "Moderate",
                6: "Moderate",
                7: "Moderate",
                8: "Heavy",
                9: "Heavy",
                10: "Stopped"
            }, d.traffic.improveInfo && (f.jamfactorDescriptions = {
                4: "Moderate: Start-stop flow of traffic",
                5: "Moderate: Start-stop flow of traffic",
                6: "Moderate: Start-stop flow of traffic",
                7: "Moderate: Start-stop flow of traffic",
                8: "Heavy: Slow flow of traffic",
                9: "Heavy: Slow flow of traffic",
                10: "Stopped: Traffic stopped or road closed"
            }), f.updateTrafficTitle = function(a, d, e) {
                b.reverseGeoCode({
                    location: a.getCenter()
                }).then(function(b) {
                    if (b.data && b.data.address) {
                        var f = b.data.address,
                            h = c(f, e || a.getZoom());
                        d && g.isCityView && f.city && (h = [f.city]), g.location = h[0]
                    } else g.location = null
                })
            }, h(), f
        }, f
    }]), window.here = window.here || {}, window.here.user = window.here.user || {}, window.here.user.location = window.here.user.location || {}, window.here.user.location.position = window.here.user.location.position || {}, window.here.trafficCities = window.here.trafficCities || {}, window.here.trafficLanding = {
        setUpHeaderMap: function() {
            var a, b, c, d, e = window.here.user.location.position,
                f = {
                    latitude: e.latitude ? e.latitude : 42.35866,
                    longitude: e.longitude ? e.longitude : -71.05674,
                    type: "TRAFFIC"
                },
                g = document.getElementById("map");
            b = new mapsjs.service.Platform({
                useHTTPS: !0,
                useCIT: window.here.config.map.base.url.match(/\.cit\./),
                app_id: window.here.config.appId,
                app_code: window.here.config.appCode
            }), c = b.createDefaultLayers(), d = new mapsjs.geo.Point(f.latitude, f.longitude), this.baseMapType = c.normal.traffic, a = new mapsjs.Map(g, this.baseMapType, {
                center: d,
                zoom: 8,
                fixedCenter: !1,
                imprint: {
                    font: "10px Arial, sans-serif",
                    invert: !1,
                    href: "//legal.here.com/terms/serviceterms"
                },
                pixelRatio: window.devicePixelRatio || 1,
                renderBaseBackground: {
                    lower: 3,
                    higher: 2
                },
                margin: 256
            }), window.addEventListener("resize", function() {
                a.getViewPort().resize()
            }), g.addEventListener("click", function() {
                window.location = "/traffic/explore?map=" + f.latitude + "," + f.longitude + ",9,traffic"
            })
        },
        setUpMiniMaps: function() {
            var a = [],
                b = document.getElementById("tiles").getElementsByTagName("li"),
                c = this.baseMapType;
            window.here.trafficCities.forEach(function(d, e) {
                a.push(new mapsjs.Map(b[e], c, {
                    center: new mapsjs.geo.Point(window.here.trafficCities[e].center.latitude, window.here.trafficCities[e].center.longitude),
                    zoom: 11
                })), b[e].addEventListener("click", function() {
                    window.location = window.here.trafficCities[e].url
                })
            })
        },
        showContinent: function(a, b) {
            for (var c = document.getElementById("blocks").children, d = document.getElementById("traffic_switcher").children, e = 0; e < c.length; e++) c[e].setAttribute("class", "block"), d[e].classList.remove("active");
            document.getElementById(a).setAttribute("class", "block active"), b.target.parentNode.setAttribute("class", "active"), b.preventDefault()
        },
        baseMapType: {},
        init: function() {
            this.setUpHeaderMap(), this.setUpMiniMaps()
        }
    }, angular.module("hereApp.welcome").controller("WelcomeMessageCtrl", ["$rootScope", "$scope", "$window", "NotificationsManager", "User", "Features", "TrackingService", function(a, b, c, d, e, f, g) {
        return b.showDownloadApp = f.welcome.downloadApp, b.showDownloadApp ? void(b.trackAppDownload = function(a) {
            var b = a || "page",
                c = "HERE mobile app download " + b;
            g.track("WelcomeMessage", c, {
                prop32: c,
                eVar32: c
            })
        }) : void b.closePopover()
    }]), angular.module("hereApp.filters").filter("addBRs", function() {
        return function(a, b) {
            if (!a || !a.replace) return "";
            var c = /, /g;
            return b && (c = b instanceof RegExp ? b : new RegExp(b, "g")), a.replace(c, "<br/>")
        }
    }), angular.module("hereApp.filters").filter("atLeast", function() {
        function a(a, b) {
            return a > b ? a : b
        }
        return a
    }), angular.module("hereApp.filters").filter("breakSlashedWords", function() {
        return function(a) {
            return a.replace(/([A-Za-z0-9])\/([A-Za-z0-9])/g, "$1 / $2")
        }
    }), angular.module("hereApp.filters").filter("capitalize", function() {
        return function(a) {
            if (!a || !a.toLowerCase) return "";
            var b = a.toLowerCase();
            return b.charAt(0).toUpperCase() + b.substring(1)
        }
    }), angular.module("hereApp.filters").filter("cityStateOrCountry", ["Features", function() {
        function a(a, b) {
            var c = a.filter(function(a) {
                return a.key === b
            });
            return c.length > 0 ? c[0].value : ""
        }

        function b(a) {
            var b = (a.country || "").toLowerCase(),
                c = ["usa", "rus", "can", "chn", "bra", "aus", "ind", "arg", "kaz", "dza"],
                d = c.indexOf(b) > -1;
            return d
        }
        return function(c, d) {
            if (c) {
                var e = b(c),
                    f = e ? 5 : 7,
                    g = e ? 8 : 10,
                    h = e ? 10 : 11,
                    i = e ? 12 : 13,
                    j = d || f + 1,
                    k = [],
                    l = a(c.additionalData, "CountryName"),
                    m = a(c.additionalData, "StateName"),
                    n = c.district;
                return k = n && j > i ? [n] : k, k = c.city && j > h && -1 === k.indexOf(c.city) ? k.concat([c.city]) : k, k = c.county && j > g && h >= j && -1 === k.indexOf(c.county) ? k.concat([c.county]) : k, k = m && j > f && -1 === k.indexOf(m) ? k.concat([m]) : k, k = l && -1 === k.indexOf(l) ? k.concat([l]) : k
            }
        }
    }]), angular.module("hereApp.filters").filter("concatenate", function() {
        return function() {
            var a = Array.prototype.slice.apply(arguments),
                b = a.splice(1, 1)[0];
            return a = a.filter(function(a) {
                return a
            }), a.join(b)
        }
    }), angular.module("hereApp.filters").filter("hereIsoDuration", function() {
        return function(a) {
            var b = "",
                c = Math.floor(a / 86400),
                d = Math.floor(a / 3600) % 24,
                e = Math.floor(a / 60) % 60;
            return c > 0 && (b += c + "D"), d > 0 && (b += d + "H"), e > 0 && (b += e + "M"), b += a % 60 + "S", "P" + b
        }
    }), angular.module("hereApp.filters").filter("localizedTime", ["dateFilter", "User", function(a, b) {
        function c(c) {
            if (!c) return "";
            var d = "en-us" === b.locale.tag ? c.getHours() > 11 ? " pm" : " am" : "",
                e = "en-us" === b.locale.tag ? "h:mm" : "H:mm",
                f = a(c, e) + d;
            return f
        }
        return c
    }]), angular.module("hereApp.filters").filter("readableTimeSpan", function() {
        function a(a, b) {
            var c, d = 0,
                e = 0,
                f = 0,
                g = '<span class="value">{{v}}</span><span class="unit">{{u}}</span>',
                h = '<span class="value">{{v}}</span><span class="unit">{{u}}</span>',
                i = '<span class="value">{{v}}</span><span class="unit">{{u}}</span>';
            return e = Math.floor(a / 86400), f = Math.floor((a - 86400 * e) / 3600), d = Math.floor((a - 86400 * e - 3600 * f) / 60), e > 0 && b && d > 30 && (a += 1800, e = Math.floor(a / 86400), f = Math.floor((a - 86400 * e) / 3600)), e > 0 ? (c = g.replace("{{u}}", 'd').replace("{{v}}", e), f > 0 && (c += h.replace("{{u}}", 'h').replace("{{v}}", f)), d > 0 && !b && (c += i.replace("{{u}}", 'min').replace("{{v}}", d))) : f > 0 ? (c = h.replace("{{u}}", 'h').replace("{{v}}", f), d > 0 && (c += i.replace("{{u}}", 'min').replace("{{v}}", d))) : c = i.replace("{{u}}", 'min').replace("{{v}}", d), c
        }
        return a
    }), angular.module("hereApp.filters").filter("userInputTime", ["User", function(a) {
        function b(b) {
            var c = "en-us" === a.locale.tag,
                d = new Date,
                e = b && b.match(/^\s*?(\d+)\s*?(?::)?\s*?(\d+)?\s*?(am|pm|a|p)?$/i) || [],
                f = e[1] || "",
                g = e[2] || "",
                h = e[3] || "",
                i = "";
            !g && f && f.length > 2 && (parseInt(f.slice(0, 2), 10) > 12 ? (g = f.slice(1, 3), f = f.slice(0, 1)) : (g = f.slice(2, 4), f = f.slice(0, 2))), (!f && !g || f > 23 || g > 59 || 1 === g.length && parseInt(g + "0") > 59) && (g = d.getMinutes().toString(), f = d.getHours().toString(), 1 === g.length && (g = "0" + g)), c ? (i = "p" === h.toLowerCase()[0] || f >= 12 ? "PM" : "AM", f > 12 && (f = (f - 12).toString())) : (f = parseInt(f), f = "p" === h.toLowerCase()[0] && 12 > f ? f + 12 : f);
            var j = parseInt(f),
                k = (1 === g.length ? g + "0" : g) || "00";
            return i = c ? " " + i : "", [j, ":", k, i].join("")
        }
        return b
    }]), angular.module("hereApp.filters").filter("distance", ["numberFilter", function(a) {
        function b(b, c, d) {
            var e, f;
            return void 0 === d && (d = 2), "kilometers" === c ? (e = 1e3, f = "km") : (e = 1609.34, f = "mi"), a(b / e, d) + " " + f
        }
        return b
    }]), angular.module("hereApp.filters").filter("ensureHTTPS", ["$location", function(a) {
        var b = /^http:/i;
        return function(c) {
            return angular.isString(c) && "http" !== a.protocol() ? c.replace(b, "https:") : c
        }
    }]), angular.module("hereApp.filters").filter("format", function() {
        return function(a) {
            if (a && a.replace) {
                var b = Array.prototype.slice.call(arguments, 1);
                return a.replace(/{(\d+)}/g, function(a, c) {
                    return "undefined" != typeof b[c] ? b[c] : a
                })
            }
        }
    }), angular.module("hereApp.filters").filter("htmlToPlaintext", function() {
        return function(a, b) {
            return a && a.replace ? (b = b || "", a.replace(/<[^>]+>/gim, b)) : ""
        }
    }), angular.module("hereApp.filters").filter("linksInNewTab", function() {
        return function(a) {
            return a ? a.replace(/<a /gi, '<a target="_blank" ') : ""
        }
    }), angular.module("hereApp.filters").filter("markSubString", ["utilityService", function(a) {
        return function(b, c, d) {
            if (!b || !c) return b;
            c = a.escapeTags(c);
            var e = c.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
            e = d ? e : e.replace(/\s+/g, "|");
            var f = new RegExp("(" + e + ")", "gi");
            return b.replace(f, '<span class="mark">$&</span>')
        }
    }]), angular.module("hereApp.filters").filter("replaceSpecialChars", ["utilityService", function(a) {
        return function(b) {
            return a.replaceSpecialChars(b)
        }
    }]), angular.module("hereApp.filters").filter("speed", function() {
        var a = function(b, c) {
            var d = a.kmhString;
            return b = parseFloat(b), isNaN(b) ? "" : ("imperial" === c && (d = a.mphString), Math.round(parseFloat(b)) + " " + d)
        };
        return a.mphString = "mph", a.kmhString = "km/h", a
    }), angular.module("hereApp.filters").filter("substring", function() {
        return function(a, b, c) {
            if ("string" != typeof a) return a;
            var d = b || ",",
                e = c ? c : 0;
            return a.substring(e, a.indexOf(d))
        }
    }), angular.module("hereApp.filters").filter("temperature", function() {
        return function(a, b) {
            return a = parseFloat(a), isNaN(a) ? "" : "celsius" === b ? Math.round(a) : Math.round(1.8 * a) + 32
        }
    }), angular.module("hereApp.filters").filter("threeLinedAddress", function() {
        return function(a) {
            var b = a.split(", "),
                c = [];
            for (b.length <= 3 ? c = b : (c.push(b.shift()), c.push(b.slice(0, -2).join(", ")), c.push(b.slice(-2).join(", "))); c.length < 3;) c.push("");
            return c
        }
    }), angular.module("hereApp.filters").filter("truncate", function() {
        return function(a, b, c) {
            if ("string" != typeof a) return a;
            var d = a;
            return b = isNaN(+b) ? 20 : +b, c = "string" == typeof c ? c : "&hellip;", a.length > b && (d = a.substring(0, b) + c), d
        }
    }), angular.module("hereApp.filters").filter("withoutBRs", function() {
        return function(a, b) {
            return a && a.replace ? (b = b || ", ", a.replace(/(\s*<br[\s\/]*>\s*)+/gi, b)) : ""
        }
    }), angular.module("hereApp").config(["$windowProvider", "ngClipProvider", function(a, b) {
        b.setPath(a.$get().here.zeroclipboard)
    }]), angular.module("hereApp").config(["$windowProvider", "ngQuickDateDefaultsProvider", function(a, b) {
        var c = a.$get().here.user.locale,
            d = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M18.048 1h-2.048v1s0 1-1 1c0 0-1 0-1-1v-1h-8v1c0 .264 0 1-1 1s-1-.736-1-1v-1h-2.047c-.525 0-.953.43-.953.952v16.048c0 .523.428 1 .953 1h16.095c.522 0 .949-.452.949-.977l.003-16.061c0-.523-.43-.962-.952-.962zm-13.048 15.5c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm3 6c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm3 9c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm3 9c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm3 6c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1zm0-3c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v1z"/></svg>';

        return b.set({
            closeButtonHtml: d,
            nextLinkHtml: ">",
            prevLinkHtml: "<",
            parseDateFunction: function(a) {
                var b = Date.create(a, "en-us" === c.tag ? "en" : c.tag);
                return b.isValid() ? b : null
            }
        })
    }]), angular.module("hereApp").config(["$routeProvider", "$locationProvider", "$windowProvider", function(a, b, c) {
        var d = {
                templateUrl: "features/places/places.html",
                doNotReplacePanel: !0,
                reloadOnSearch: !1,
                specialPanelClass: "places",
                blockMinimizedPanelState: !0
            },
            e = {
                resolve: {
                    load: ["discoverRedirect", "$route", function(a, b) {
                        return a.geocode(b.current.params)
                    }]
                }
            },
            f = c.$get().here.features;
        a.when("/search/:query?", {
            templateUrl: "features/search/search.html",
            reloadOnSearch: !1,
            specialPanelClass: "discover"
        }).when("/collections", {
            templateUrl: "features/collections/collections.html",
            blockMinimizedPanelState: !0,
            specialPanelClass: "collections",
            reloadOnSearch: !1
        }).when("/collections/:collectionId", {
            templateUrl: "features/collections/detail.html",
            blockMinimizedPanelState: !0,
            specialPanelClass: "collections",
            reloadOnSearch: !1
        }).when("/directions", {
            templateUrl: f.directions.itineraryOverhaul ? "features/directions/directions_new.html" : "features/directions/directions.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "directions",
            keepMapCenter: !0,
            blockMinimizedPanelState: !0
        }).when("/directions/:mode/:routeSplat*", {
            templateUrl: f.directions.itineraryOverhaul ? "features/directions/directions_new.html" : "features/directions/directions.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "directions",
            keepMapCenter: !0,
            blockMinimizedPanelState: !0
        }).when("/directions/:placeId", {
            templateUrl: f.directions.itineraryOverhaul ? "features/directions/directions_new.html" : "features/directions/directions.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "directions",
            keepMapCenter: !0,
            blockMinimizedPanelState: !0
        }).when("/d/:placeId", {
            redirectTo: function(a) {
                return "/directions/" + a.placeId
            }
        }).when("/discover/:categoryId?", {
            templateUrl: "features/discover/discover.html",
            reloadOnSearch: !1,
            specialPanelClass: "discover",
            doNotReplacePanel: !0,
            blockMinimizedPanelState: !0
        }).when("/:country/:city/:category/:place--:id", d).when("/p/h-:href", d).when("/location/", d).when("/p/:id?", d).when("/place/:id", d).when("/streetLevel/:latitude/:longitude/:yaw/:pitch/:report?", {
            template: "",
            controller: "RootCtrl",
            specialPanelClass: "streetLevel",
            reloadOnSearch: !1
        }), f.styleGuide && (a.when("/styleguideOld", {}), a.when("/styleguide", {})), a.when("/traffic/explore", {
            templateUrl: "features/traffic/traffic.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "traffic",
            blockMinimizedPanelState: !0
        }), f.directions.commute ? a.when("/traffic/commute", {
            redirectTo: "/directions/"
        }) : a.when("/traffic/commute", {
            templateUrl: "features/traffic/commute.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "traffic",
            blockMinimizedPanelState: !0
        }), a.when("/traffic/:trafficCountry/:trafficCity", {
            templateUrl: "features/traffic/traffic.html",
            reloadOnSearch: !1,
            doNotReplacePanel: !0,
            specialPanelClass: "traffic",
            blockMinimizedPanelState: !0
        }), a.when("printroute", {
            templateUrl: "features/directions/print.html"
        }), a.when("/city/:country/:city", e).when("/:country/:city/recommendations/:page?", e).when("/:country/:city?/:category?/:page?", e), a.when("/", {
            templateUrl: "features/landingPage/landingPage.html",
            reloadOnSearch: !1,
            specialPanelClass: "landing_page",
            blockMinimizedPanelState: !1
        }).otherwise({
            redirectTo: "/"
        }), b.html5Mode({
            enabled: !0,
            requireBase: !1
        })
    }]);
//# sourceMappingURL=http://aihwsen001.dv.ber01.locn.s.nokia.com/sourcemaps/8113/app1.min.js.map