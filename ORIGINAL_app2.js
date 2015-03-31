angular.module("hereApp.service").config([ "$httpProvider", "$windowProvider", function(a, b) {
    a.interceptors.push(function() {
        return {
            request: function(a) {
                var c = /^(http|\/\/)/, d = b.$get().here.csrf, e = [ "POST", "PUT", "DELETE" ];
                return !c.test(a.url) && e.indexOf(a.method) > -1 && (a.headers["CSRF-Token"] = d), 
                a;
            }
        };
    });
} ]), angular.module("hereApp.service").factory("CollectionsAlwaysVisibleService", [ "Features", "$route", "$location", "$q", "splitTesting", "CollectionsService", "collectionsHelper", "markerService", "mapContainers", "User", function(a, b, c, d, e, f, g, h, i, j) {
    var k = {}, l = "collectionsAlwaysVisible";
    return k._getAllMarkers = function() {
        var a = [];
        return [ i.discover, i.search, i.PDC, i.context ].forEach(function(b) {
            b.getVisibility() && (a = a.concat(b.getObjects()));
        }), a;
    }, k._colorExistingMarkers = function(a, b) {
        var c = a.map(function(a) {
            return a.placesId;
        });
        b.forEach(function(a) {
            var b = h.getWrapped(a);
            if (b && b.data && b.data.PBAPIID) {
                var d = c.indexOf(b.data.PBAPIID) > -1;
                d !== b.isCollected && b.setMarkerCollected(d);
            }
        });
    }, k._getAllVisibleMarkersPlaceIds = function(a) {
        if (!a) return [];
        var b, c = [];
        return a.forEach(function(a) {
            b = h.getWrapped(a), b && b.data && b.data.PBAPIID && (b.marker && b.marker.getVisibility() || b.flagOpened) && c.push(b.data.PBAPIID);
        }), c;
    }, k._createMissingSmallFavoriteMarkers = function(a, b) {
        var c, d = b || [], e = [], f = i.favoritesSmall.getObjects(), j = f.map(function(a) {
            return h.getWrapped(a).data.PBAPIID;
        });
        a.forEach(function(a) {
            -1 === j.indexOf(a.placesId) && -1 === d.indexOf(a.placesId) && (c = g.createSmallFavoriteMarker(a), 
            c && e.push(c));
        }), e.length > 0 && i.favoritesSmall.addObjects(e);
    }, k._displaySmallFavoriteMarkers = function(a, b) {
        var d, e, f, g = k._getAllVisibleMarkersPlaceIds(b), j = "/collections" === c.path();
        k._createMissingSmallFavoriteMarkers(a, g), f = i.favoritesSmall.getObjects(), f.forEach(function(a) {
            d = h.getWrapped(a), d && d.marker && (e = -1 === g.indexOf(d.data.PBAPIID) && !d.flagOpened && j === !1, 
            d.marker.setVisibility(e));
        });
    }, k._initABTest = function() {
        e.hasStarted(l) || e.start(l);
    }, k.showAllFavorites = function() {
        var b, c = d.defer();
        return j.isLoggedIn() ? (f.getAllFavoritePlaces().then(function(d) {
            d.length > 0 && (b = k._getAllMarkers(), k._colorExistingMarkers(d, b), a.collections.alwaysVisible && (k._initABTest(), 
            k._displaySmallFavoriteMarkers(d, b))), c.resolve(d);
        }), c.promise) : (c.resolve(), c.promise);
    }, k;
} ]), angular.module("hereApp.service").factory("CollectionsService", [ "$q", "$http", "$window", "$rootScope", "Features", "mapContainers", "markerService", "markerIcons", "categories", "PBAPI", "utilityService", "User", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    var m = "_removeFromCollections", n = "_addToCollections", o = "_favoritesToRemove", p = "_photo", q = "total", r = "unsorted", s = {
        id: r,
        total: null,
        name: "All other items"
    }, t = {
        httpDefaults: {
            cache: !1,
            responseType: "json",
            dataType: "json",
            headers: {
                Accept: "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0"
            }
        },
        getAllCollectionsUrl: "/api/collections/collection",
        createCollectionUrl: "/api/collections/collection",
        deleteCollectionUrl: "/api/collections/collection/:id",
        deleteFavoriteUrl: "/api/collections/:type/:id",
        getAllFavoritesUrl: "/api/collections/favoritePlace",
        getFavoritesUrl: "/api/collections/favoritePlace/:id",
        createObjectUrl: "/api/collections/:type",
        updateObjectUrl: "/api/collections/:type/:id",
        cleanupUrl: "/api/collections/cleanup",
        favoriteObjectFields: [ "name", "type", "collectionId", "location", "placesId", "categories", "contacts", "position", "latitude", "longitude", "address", "text", "countryCode", "country", "county", "city", "street", "postalCode", "categoryId", n, m ],
        updateFields: [ "id", "placesId", "name", "description", "type", "landscapeImageUrl" ]
    }, u = [], v = [], w = {
        location: {
            to: function(a) {
                var b = angular.copy(a);
                return a && angular.isArray(a.position) && 2 === a.position.length && (b.position = {
                    latitude: a.position[0],
                    longitude: a.position[1]
                }), a && a.position && a.position.lat && a.position.lng && (b.position = {
                    latitude: a.position.lat,
                    longitude: a.position.lng
                }), b;
            }
        }
    }, x = function(a) {
        return /loc-/.test(a);
    }, y = function(a) {
        return !(!a || "favoriteRoute" !== a.type);
    }, z = function() {
        var c = {};
        return function(d) {
            var e = a.defer();
            return c[d] || (c[d] = []), c[d].push(e), 1 === c[d].length && b.get(d).success(function(a) {
                c[d].forEach(function(b) {
                    b.resolve(a);
                }), c[d] = [];
            }).error(function(a) {
                c[d].forEach(function(b) {
                    b.reject(a);
                }), c[d] = [];
            }), e.promise;
        };
    }(), A = function(a, b) {
        var c;
        if (angular.isObject(a) && angular.isArray(b)) {
            var d = JSON.stringify(a, b);
            c = JSON.parse(d);
        }
        return c;
    }, B = function() {
        var a = u.length, b = v.length;
        if (a > 0) for (var c = 0; a > c; c++) {
            for (var d = u[c], e = 0, f = 0; b > f; f++) {
                var g = v[f].collectionId || [];
                -1 !== g.indexOf(d.id) && e++;
            }
            d[q] = e;
        }
        u.forEach(C.choose);
    }, C = function() {
        var a = {};
        return {
            choose: function(b) {
                var c = b.id;
                a[c] = {
                    original: b.landscapeImageUrl,
                    "default": null
                }, a[c].original || Z(b.id).then(function(d) {
                    for (var e = function(d) {
                        if (d.data && d.data.items && d.data.items.length > 0) {
                            var e = d.data.items[0].src;
                            a[c]["default"] = e, b.landscapeImageUrl = e, b[p] = d.data.items[0];
                        }
                    }, f = 0; f < d.length; f++) if (!x(d[f].placesId) && !y(d[f])) {
                        j.images({
                            id: d[f].placesId
                        }).then(e);
                        break;
                    }
                });
            },
            setOriginalImage: function(b) {
                var c = a[b.id] || {}, d = c.original, e = c["default"];
                e === b.landscapeImageUrl && (b.landscapeImageUrl = d);
            }
        };
    }(), D = function(a, b) {
        var c = {
            status: b,
            errorMessage: a
        };
        return angular.isObject(a) && angular.extend(c, a), c;
    }, E = function(a, b) {
        if (angular.isArray(a) && b && b.id && b.type) for (var c = 0; c < a.length; c++) if (a[c].id === b.id && a[c].type === b.type) {
            angular.extend(a[c], b);
            break;
        }
    }, F = function(c) {
        var d = a.defer(), e = {
            name: c
        };
        return b.post(t.createCollectionUrl, e, t.httpDefaults).success(function(a) {
            u.push(a), d.resolve(angular.copy(a));
        }).error(function(a, b) {
            d.reject(D(a, b));
        }), d.promise;
    }, G = function(b) {
        var c = a.defer();
        return N().then(function(a) {
            var d = [];
            angular.forEach(a, function(a) {
                angular.isArray(a.collectionId) && 1 === a.collectionId.length && a.collectionId[0] === b && d.push({
                    id: a.id,
                    type: a.type
                });
            }), H(b, d).then(function(a) {
                c.resolve(a);
            }, function(a, b) {
                c.reject(D(a, b));
            });
        }, function(a, b) {
            c.reject(D(a, b));
        }), c.promise;
    }, H = function(c, d) {
        var e = a.defer(), f = {};
        f[o] = d || [];
        var g = angular.extend(t.httpDefaults, {});
        return b["delete"](t.deleteCollectionUrl.replace(":id", c), g).success(function(a) {
            if (a && a.id && a.deleted) {
                for (var c = 0; c < u.length; c++) if (u[c].id === a.id) {
                    u.splice(c, 1);
                    break;
                }
                if (d.length) {
                    b.post(t.cleanupUrl, f, g);
                    for (var h = 0; h < d.length; h++) for (var i = 0; i < v.length; i++) d[h].id === v[i].id && v.splice(i, 1);
                }
                for (var j = 0; j < v.length; j++) {
                    var k = v[j].collectionId || [], l = k.indexOf(a.id);
                    -1 !== l && k.splice(l, 1);
                }
                e.resolve(angular.copy(a));
            } else e.reject(a);
        }).error(function(a, b) {
            e.reject(D(a, b));
        }), e.promise;
    }, I = function(c) {
        var d = a.defer();
        if (c && c.id && c.type) {
            var e = t.deleteFavoriteUrl.replace(":id", c.id).replace(":type", c.type);
            b["delete"](e, t.httpDefaults).success(function(a) {
                if (a && a.id && a.deleted) {
                    for (var b = 0; b < v.length; b++) if (v[b].id === a.id) {
                        v.splice(b, 1);
                        break;
                    }
                    B(), d.resolve(angular.copy(a));
                } else d.reject(a);
            }).error(function(a, b) {
                d.reject(D(a, b));
            });
        } else d.reject(D("Invalid arguments exception. Expected object with 'id' and 'type' properties."));
        return d.promise;
    }, J = function() {
        var b = a.defer();
        return u.length > 0 ? b.resolve(angular.copy(u)) : z(t.getAllCollectionsUrl, t.httpDefaults).then(function(a) {
            u.splice(0, u.length), Array.prototype.push.apply(u, a), N().then(B), b.resolve(angular.copy(a));
        }, function(a, c) {
            b.reject(D(a, c));
        }), b.promise;
    }, K = function(b) {
        var c = a.defer();
        return J().then(function(a) {
            var d = angular.isArray(b) ? b : b.split ? b.split(",") : [ b ], e = a.filter(function(a) {
                return d.indexOf(a.id.toString()) > -1;
            });
            0 === e.length ? c.reject(D("collection(s) not found")) : c.resolve(e);
        }, function(a, b) {
            c.reject(D(a, b));
        }), c.promise;
    }, L = function(b) {
        var c = a.defer();
        if (!b || b === r) {
            var d = b === r ? s : null;
            return c.resolve(d), c.promise;
        }
        return K([ b.toString() ]).then(function(a) {
            c.resolve(a[0]);
        }, function(a, b) {
            c.reject(D(a, b));
        }), c.promise;
    }, M = function() {
        return l.isLoggedIn() ? N() : a.all([]);
    }, N = function() {
        var b = a.defer();
        return v.length > 0 ? b.resolve(angular.copy(v)) : z(t.getAllFavoritesUrl, t.httpDefaults).then(function(a) {
            v.splice(0, v.length), Array.prototype.push.apply(v, a), b.resolve(angular.copy(a));
        }, function(a, c) {
            b.reject(D(a, c));
        }), b.promise;
    }, O = function() {
        var b = [], c = a.defer();
        return P().then(function(a) {
            b = a.map(function(a) {
                return a.placesId;
            });
        })["finally"](function() {
            c.resolve(b);
        }), c.promise;
    }, P = function() {
        var b = [], c = a.defer();
        return N().then(function(a) {
            b = a.filter(function(a) {
                return a.placesId;
            });
        })["finally"](function() {
            c.resolve(b);
        }), c.promise;
    }, Q = function() {
        return l.isLoggedIn() ? O() : a.all([]);
    }, R = function(c, d) {
        var e = a.defer();
        return angular.isObject(c) && c.type && angular.isArray(d) && d.length > 0 ? (c = angular.copy(c), 
        c.location = w.location.to(c.location), c = A(c, t.favoriteObjectFields), c[n] = d, 
        b.post(t.createObjectUrl.replace(":type", c.type), c, t.httpDefaults).success(function(a) {
            v.push(a), B(), e.resolve(angular.copy(a));
        }).error(function(a, b) {
            e.reject(D(a, b));
        })) : e.reject(D("Invalid arguments exception")), e.promise;
    }, S = function(b) {
        var c = a.defer();
        return b ? (N().then(function(a) {
            angular.isArray(a) || c.resolve(null);
            var d = a.filter(function(a) {
                return y(a) ? !1 : b.placeId ? (b.altPlaceId && a.placesId === b.altPlaceId && (a.placesId = b.placeId, 
                Y(a)), x(b.placeId) ? e.collections.compareLocationsByAroundCheck ? X(a, b) : a.placesId ? a.placesId === b.placeId : X(a, b) : a.placesId === b.placeId) : !1;
            }), f = d.length > 0 ? angular.copy(d[0]) : null;
            c.resolve(f);
        }, function() {
            c.resolve(null);
        }), c.promise) : (c.resolve(null), c.promise);
    }, T = function(a, b) {
        return a && a.location && a.location.position && a.location.position.latitude && a.location.position.longitude && b && b.location && b.location.position && b.location.position.lat && b.location.position.lng ? !0 : !1;
    }, U = function(a, b) {
        var c = 5;
        return k.getDistanceBetweenPositionsInMeters(a, b) <= c;
    }, V = function(a, b) {
        return parseFloat(a.toFixed(b));
    }, W = function(a) {
        return V(a, 4);
    }, X = function(a, b) {
        var c = a.location.position, d = b.location.position;
        return e.collections.compareLocationsByAroundCheck ? T(a, b) && U(c, {
            latitude: d.lat,
            longitude: d.lng
        }) : T(a, b) ? W(a.location.position.latitude) === W(b.location.position.lat) && W(a.location.position.longitude) === W(b.location.position.lng) : !1;
    }, Y = function(c, d) {
        var e = !1, f = a.defer();
        if (c && c.id) {
            c = angular.copy(c);
            var g = t.updateObjectUrl.replace(":type", "favoritePlace").replace(":id", c.id);
            if (d && angular.isArray(d)) {
                d && -1 !== d.indexOf(r) && d.splice(d.indexOf(r), 1);
                var h, i = angular.isArray(c.collectionId) ? c.collectionId : [], j = [], k = [];
                for (h = 0; h < d.length; h++) -1 === i.indexOf(d[h]) && k.push(d[h]);
                for (h = 0; h < i.length; h++) -1 === d.indexOf(i[h]) && j.push(i[h]);
                k.length || j.length ? (c[n] = k, c[m] = j, c = A(c, t.favoriteObjectFields)) : e = !0;
            } else c = A(c, t.updateFields);
            e ? f.resolve(c) : (c.collectionId = d, b.put(g, c, t.httpDefaults).success(function(a) {
                E(v, a), B(), f.resolve(angular.copy(a));
            }).error(function(a, b) {
                f.reject(D(a, b));
            }));
        } else f.reject(D("Invalid arguments exception"));
        return f.promise;
    }, Z = function(b) {
        var c = a.defer();
        return N().then(function(a) {
            for (var d = [], e = 0; e < a.length; e++) {
                var f = a[e];
                f.collectionId = f.collectionId || [], b === r && 0 === f.collectionId.length ? d.push(f) : -1 !== f.collectionId.indexOf(b) && -1 === d.indexOf(f) && d.push(f);
            }
            c.resolve(d);
        }, function(a, b) {
            c.reject(D(a, b));
        }), c.promise;
    }, $ = function() {
        var b = a.defer();
        return _().then(function(a) {
            s.total = a.length, b.resolve(a.length > 0 ? s : null);
        }, function(a, c) {
            b.reject(D(a, c));
        }), b.promise;
    }, _ = function() {
        return Z(r);
    }, ab = function(a) {
        return a.id === r;
    }, bb = function(c) {
        var d = a.defer();
        if (c && c.id && "collection" === c.type) {
            c = angular.copy(c), C.setOriginalImage(c), c = A(c, t.updateFields);
            var e = t.updateObjectUrl.replace(":type", c.type).replace(":id", c.id);
            b.put(e, c, t.httpDefaults).success(function(a) {
                E(u, a), B(), d.resolve(angular.copy(a));
            }).error(function(a, b) {
                d.reject(D(a, b));
            });
        } else d.reject(D("Invalid arguments exception"));
        return d.promise;
    };
    return {
        UNSORTED_KEY: r,
        addCollection: F,
        addFavorite: R,
        getAllCollections: J,
        getAllFavorites: N,
        getAllFavoritePlaces: P,
        getAllFavoritesIfSignedIn: M,
        getAllFavoritesIds: O,
        getAllFavoritesIdsIfSignedIn: Q,
        getCollectionsByIds: K,
        getCollectionById: L,
        getFavoriteRef: S,
        getFavorites: Z,
        getVirtualCollection: $,
        getUnsortedFavorites: _,
        isCollectionVirtual: ab,
        removeFavorite: I,
        removeCollection: G,
        readonlyCollections: u,
        readonlyFavorites: v,
        updateCollection: bb,
        updateFavorite: Y
    };
} ]), angular.module("hereApp.service").factory("CountryService", function() {
    function a(a) {
        if (!a) return "";
        var c = b[a] ? b[a] : a;
        return c.toLowerCase();
    }
    var b = {
        AFG: "AF",
        ALA: "AX",
        ALB: "AL",
        DZA: "DZ",
        ASM: "AS",
        AND: "AD",
        AGO: "AO",
        AIA: "AI",
        ATA: "AQ",
        ATG: "AG",
        ARG: "AR",
        ARM: "AM",
        ABW: "AW",
        AUS: "AU",
        AUT: "AT",
        AZE: "AZ",
        BHS: "BS",
        BHR: "BH",
        BGD: "BD",
        BRB: "BB",
        BLR: "BY",
        BEL: "BE",
        BLZ: "BZ",
        BEN: "BJ",
        BMU: "BM",
        BTN: "BT",
        BOL: "BO",
        BES: "BQ",
        BIH: "BA",
        BWA: "BW",
        BVT: "BV",
        BRA: "BR",
        IOT: "IO",
        BRN: "BN",
        BGR: "BG",
        BFA: "BF",
        BDI: "BI",
        KHM: "KH",
        CMR: "CM",
        CAN: "CA",
        CPV: "CV",
        CYM: "KY",
        CAF: "CF",
        TCD: "TD",
        CHL: "CL",
        CHN: "CN",
        CXR: "CX",
        CCK: "CC",
        COL: "CO",
        COM: "KM",
        COG: "CG",
        COD: "CD",
        COK: "CK",
        CRI: "CR",
        CIV: "CI",
        HRV: "HR",
        CUB: "CU",
        CUW: "CW",
        CYP: "CY",
        CZE: "CZ",
        DNK: "DK",
        DJI: "DJ",
        DMA: "DM",
        DOM: "DO",
        ECU: "EC",
        EGY: "EG",
        SLV: "SV",
        GNQ: "GQ",
        ERI: "ER",
        EST: "EE",
        ETH: "ET",
        FLK: "FK",
        FRO: "FO",
        FJI: "FJ",
        FIN: "FI",
        FRA: "FR",
        GUF: "GF",
        PYF: "PF",
        ATF: "TF",
        GAB: "GA",
        GMB: "GM",
        GEO: "GE",
        DEU: "DE",
        GHA: "GH",
        GIB: "GI",
        GRC: "GR",
        GRL: "GL",
        GRD: "GD",
        GLP: "GP",
        GUM: "GU",
        GTM: "GT",
        GGY: "GG",
        GIN: "GN",
        GNB: "GW",
        GUY: "GY",
        HTI: "HT",
        HMD: "HM",
        VAT: "VA",
        HND: "HN",
        HKG: "HK",
        HUN: "HU",
        ISL: "IS",
        IND: "IN",
        IDN: "ID",
        IRN: "IR",
        IRQ: "IQ",
        IRL: "IE",
        IMN: "IM",
        ISR: "IL",
        ITA: "IT",
        JAM: "JM",
        JPN: "JP",
        JEY: "JE",
        JOR: "JO",
        KAZ: "KZ",
        KEN: "KE",
        KIR: "KI",
        PRK: "KP",
        KOR: "KR",
        KWT: "KW",
        KGZ: "KG",
        LAO: "LA",
        LVA: "LV",
        LBN: "LB",
        LSO: "LS",
        LBR: "LR",
        LBY: "LY",
        LIE: "LI",
        LTU: "LT",
        LUX: "LU",
        MAC: "MO",
        MKD: "MK",
        MDG: "MG",
        MWI: "MW",
        MYS: "MY",
        MDV: "MV",
        MLI: "ML",
        MLT: "MT",
        MHL: "MH",
        MTQ: "MQ",
        MRT: "MR",
        MUS: "MU",
        MYT: "YT",
        MEX: "MX",
        FSM: "FM",
        MDA: "MD",
        MCO: "MC",
        MNG: "MN",
        MNE: "ME",
        MSR: "MS",
        MAR: "MA",
        MOZ: "MZ",
        MMR: "MM",
        NAM: "NA",
        NRU: "NR",
        NPL: "NP",
        NLD: "NL",
        NCL: "NC",
        NZL: "NZ",
        NIC: "NI",
        NER: "NE",
        NGA: "NG",
        NIU: "NU",
        NFK: "NF",
        MNP: "MP",
        NOR: "NO",
        OMN: "OM",
        PAK: "PK",
        PLW: "PW",
        PSE: "PS",
        PAN: "PA",
        PNG: "PG",
        PRY: "PY",
        PER: "PE",
        PHL: "PH",
        PCN: "PN",
        POL: "PL",
        PRT: "PT",
        PRI: "PR",
        QAT: "QA",
        REU: "RE",
        ROU: "RO",
        RUS: "RU",
        RWA: "RW",
        BLM: "BL",
        SHN: "SH",
        KNA: "KN",
        LCA: "LC",
        MAF: "MF",
        SPM: "PM",
        VCT: "VC",
        WSM: "WS",
        SMR: "SM",
        STP: "ST",
        SAU: "SA",
        SEN: "SN",
        SRB: "RS",
        SYC: "SC",
        SLE: "SL",
        SGP: "SG",
        SXM: "SX",
        SVK: "SK",
        SVN: "SI",
        SLB: "SB",
        SOM: "SO",
        ZAF: "ZA",
        SGS: "GS",
        SSD: "SS",
        ESP: "ES",
        LKA: "LK",
        SDN: "SD",
        SUR: "SR",
        SJM: "SJ",
        SWZ: "SZ",
        SWE: "SE",
        CHE: "CH",
        SYR: "SY",
        TWN: "TW",
        TJK: "TJ",
        TZA: "TZ",
        THA: "TH",
        TLS: "TL",
        TGO: "TG",
        TKL: "TK",
        TON: "TO",
        TTO: "TT",
        TUN: "TN",
        TUR: "TR",
        TKM: "TM",
        TCA: "TC",
        TUV: "TV",
        UGA: "UG",
        UKR: "UA",
        ARE: "AE",
        GBR: "GB",
        USA: "US",
        UMI: "UM",
        URY: "UY",
        UZB: "UZ",
        VUT: "VU",
        VEN: "VE",
        VNM: "VN",
        VGB: "VG",
        VIR: "VI",
        WLF: "WF",
        ESH: "EH",
        YEM: "YE",
        ZMB: "ZM",
        ZWE: "ZW"
    };
    return {
        transformCode: a
    };
}), angular.module("hereApp.service").factory("FacebookService", [ "$window", "$q", "Config", "$timeout", function(a, b, c, d) {
    var e = !1, f = !1, g = a.here.user, h = a.document, i = h.body, j = null, k = function() {
        return j;
    };
    return {
        isLoaded: function() {
            return e;
        },
        load: function() {
            var h, k = b.defer();
            return f || e || (f = !0, h = a.document.createElement("script"), h.id = "facebook-jssdk", 
            h.src = c.facebook.host + g.locale.tagUnderscore + "/all.js", h.onload = function() {
                e = !0, j = a.FB, j.init({
                    appId: c.facebook.appId,
                    status: c.facebook.status,
                    xfbml: c.facebook.xfbml,
                    version: "v2.0"
                }), d(function() {
                    k.resolve(e);
                }, 2e3);
            }, h.onerror = function() {
                k.reject(!1);
            }, i.appendChild(h)), k.promise;
        },
        login: function(a) {
            var c = b.defer(), d = {
                scope: a && a.permissions || "email,public_profile"
            };
            return a && a.rerequest && (d.auth_type = "rerequest"), k().login(function(a) {
                a && a.authResponse ? c.resolve(a) : c.reject(a);
            }, d), c.promise;
        },
        logout: function() {
            var a = b.defer();
            return k().logout(function(b) {
                a.resolve(b);
            }), a.promise;
        },
        me: function() {
            var a = b.defer();
            return k().api("/me", function(b) {
                !b || b.error ? a.reject(b) : a.resolve(b);
            }), a.promise;
        },
        getAvatar: function() {
            var a = b.defer();
            return k().api("/me/picture?width=160&height=160", function(b) {
                !b || b.error ? a.reject(b) : a.resolve(b);
            }), a.promise;
        },
        getFacebookApi: function() {
            var a = b.defer();
            return e ? a.resolve(k()) : this.load().then(function() {
                a.resolve(k());
            }), a.promise;
        },
        parseElement: function(a) {
            this.getFacebookApi().then(function(b) {
                b.XFBML.parse(a);
            });
        }
    };
} ]), angular.module("hereApp.service").factory("HereAccountService", [ "$window", "$rootScope", "Config", "TrackingService", "User", function(a, b, c, d, e) {
    var f, g = a.here.Account, h = function() {
        var a = {
            clientId: c.account.clientId,
            environment: c.account.frontEndHost,
            callback: l,
            lang: e.locale.tag
        };
        f = g(a);
    }, i = function() {
        f.openSignIn();
    }, j = function() {
        f.signOut();
    }, k = function(a) {
        a.data.loggedIn = !0, e.setUserData(a.data);
    }, l = function(b, c) {
        g.flows.SIGN_IN === c.flow && g.actions.COMPLETED === c.action && (k(c), d.track("account", "successful sign-in", "", "event17")), 
        g.flows.SIGN_UP === c.flow && g.actions.COMPLETED === c.action && (k(c), d.track("account", "successful sign-in after sign-up", "", "event17")), 
        g.flows.SIGN_IN === c.flow && g.actions.ALREADY_SIGNED_IN === c.action && (d.track("account", "successful already-sign-in", "", "event17"), 
        k(c)), g.flows.SIGN_OUT === c.flow && g.actions.COMPLETED === c.action && (d.track("account", "successful sign-out", "", "event17"), 
        a.location.href = "/");
    };
    return h(), {
        openSignIn: i,
        signOut: j
    };
} ]), angular.module("hereApp.service").factory("HistoryService", [ "$rootScope", "$window", "$location", "$timeout", "utilityService", function(a, b, c, d, e) {
    var f, g = function() {
        a.$on("$locationChangeStart", function(a, c, d) {
            var g = b.history.state, h = c.split("?") && c.split("?")[0], i = d.split("?") && d.split("?")[0];
            e.isObjectEmpty(g) || h !== i || (f = g);
        }), a.$on("$locationChangeSuccess", function() {
            e.isObjectEmpty(b.history.state) && !e.isObjectEmpty(f) && (b.history.replaceState(f, null, null), 
            f = null);
        }), b.onpopstate = function(b) {
            a.$broadcast("onBrowserHistoryChange", b);
        };
    };
    return {
        init: g
    };
} ]), angular.module("hereApp.service").factory("LocalStorageService", [ "$window", function(a) {
    var b, c, d, e, f;
    try {
        b = a.localStorage;
    } catch (g) {}
    return c = function(a) {
        var c;
        try {
            c = b.getItem(a);
        } catch (d) {
            c = !1;
        }
        return c;
    }, d = function(a, c) {
        try {
            b.setItem(a, c);
        } catch (d) {
            return !1;
        }
        return !0;
    }, e = function(a) {
        try {
            b.removeItem(a);
        } catch (c) {
            return !1;
        }
    }, f = function() {
        try {
            b.clear();
        } catch (a) {
            return !1;
        }
    }, {
        getValue: c,
        setValue: d,
        removeValue: e,
        clearAll: f
    };
} ]), angular.module("hereApp.service").factory("LocationService", [ "$location", "$rootScope", "$window", "$document", "utilityService", "$routeParams", function(a, b, c, d, e, f) {
    var g, h = "x", i = "ep", j = "/", k = !1, l = !1, m = !1, n = {}, o = {};
    return o.brandEntryPoint = function() {
        a.search(h, i).replace();
    }, o.startUserActivity = function() {
        l = !0, m = !0, d.off("click", o.startUserActivity), d.off("touchstart", o.startUserActivity), 
        d.off("keydown", o.startUserActivity);
    }, o.startUrlChange = function() {
        var b = angular.copy(a.search());
        e.isObjectEmpty(b) || (delete b[h], g = b);
    }, o.finishUrlChange = function() {
        return k && 0 === a.path().indexOf("/directions/") ? n.goBack(k) : (k = !1, void ((l || e.isObjectEmpty(a.search()) && !e.isObjectEmpty(g)) && (a.search(g).replace(), 
        l = !1)));
    }, o.resetRequirementToRemoveBrand = e.debounce(function() {
        n.isEntryPoint() && (m && (d.on("click", o.startUserActivity), d.on("touchstart", o.startUserActivity), 
        d.on("keydown", o.startUserActivity)), m = !1);
    }, 200), n.isEntryPoint = function() {
        return a.search()[h] === i;
    }, n.init = function() {
        b.$on("$locationChangeStart", o.startUrlChange), b.$on("$locationChangeSuccess", o.finishUrlChange), 
        b.$on("onBrowserHistoryChange", o.resetRequirementToRemoveBrand), b.$on("mouseDetected", o.startUserActivity), 
        d.on("click", o.startUserActivity), d.on("touchstart", o.startUserActivity), d.on("keydown", o.startUserActivity), 
        o.brandEntryPoint();
    }, n.goBack = function(b) {
        b && n.isEntryPoint() ? (l = !1, a.path(j).search(h, i).replace(), k = !1, o.resetRequirementToRemoveBrand()) : (k = b, 
        c.history.back());
    }, n.updateSingleUrlParam = function(b, c) {
        var d = a.search(), e = !(n.isEntryPoint() && m);
        d[b] !== c && (d[b] = c, e ? a.search(d).replace() : a.search(d));
    }, n.removeSingleUrlParam = function(b) {
        var c = a.search();
        c[b] && (delete c[b], a.search(c).replace());
    }, n.isRouteEnabled = function(b) {
        if (!b || !b.length || 0 === b.length) return !0;
        var c = f.id || f.href, d = -1 === b.indexOf("pdc"), e = !c || c && d;
        return e && b.forEach(function(b) {
            e = e && 0 !== a.path().indexOf(b);
        }), e;
    }, n;
} ]), angular.module("hereApp.service").factory("MIAPI", [ "Config", "$http", "mapsjs", "utilityService", function(a, b, c, d) {
    var e = {};
    return e.defaultParams = {
        app_id: a.appId,
        app_code: a.appCode,
        fov: 180,
        ptype: 0,
        pp: !0,
        pph: !0
    }, e.defaultConfig = {
        url: a.MIAPI + "piclet",
        cache: !0,
        method: "GET",
        params: e.defaultParams
    }, e.transformParams = function(a) {
        var b = a.point;
        if (a = angular.copy(a), a.dimensions && (a.w = a.dimensions.width, a.h = a.dimensions.height, 
        delete a.dimensions), !b) throw "Cannot continue without a geo coordinates";
        return a.clat = b.lat, a.clon = b.lng, delete a.point, a;
    }, e.transformResponse = function(a) {
        var b = a.headers(), e = JSON.parse(b["x-panorama-parameters"]);
        return a.panoramaParameters = {
            url: d.buildAngularUrl(a.config.url, a.config.params),
            prefix: e.url_prefix,
            point: new c.geo.Point(parseFloat(e.lat), parseFloat(e.lon)),
            fov: parseFloat(e.fov),
            bearing: parseFloat(e.bearing),
            tilt: parseFloat(e.tilt)
        }, a;
    }, e.piclet = function(a) {
        var c = angular.copy(e.defaultConfig);
        return angular.extend(c.params, e.transformParams(a)), b(c).then(e.transformResponse);
    }, e;
} ]), angular.module("hereApp.service").factory("MatcherService", function() {
    var a = {}, b = {};
    return a.save = function(a, c) {
        b[a] = c;
    }, a.get = function(a) {
        return b[a];
    }, a.remove = function(a) {
        return b[a] = null, !0;
    }, a;
}), angular.module("hereApp.service").factory("NPS", [ "$http", "$q", "Config", "$window", "$rootScope", "LocalStorageService", "TrackingService", "Features", "splitTesting", function(a, b, c, d, e, f, g, h, i) {
    function j(a) {
        var b = new d.Date();
        return b.setDate(b.getDate() + a), b;
    }
    var k = {}, l = c.nps, m = "";
    return k.jsonpCallbackName = "npsApiCallback", k.defaultParams = {
        projectId: l.projectId,
        sourceId: l.sourceId,
        referrer: l.referrer,
        version: l.version,
        jsonpCallback: k.jsonpCallbackName
    }, k.defaultHeaders = {
        "Content-Type": "application/json"
    }, k.defaultConfig = {
        url: l.url,
        cache: !1,
        method: "JSONP",
        params: k.defaultParams,
        headers: k.defaultHeaders,
        responseType: "application/json"
    }, d[k.jsonpCallbackName] = angular.noop, k._isNPSBtnDisabled = function() {
        var a;
        if ("preview" === c.nps.triggeringLogic) {
            var b = c.nps.previewTrialSchedule, e = f.getValue("HERE_LAST_NPS"), g = new d.Date(), h = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate();
            a = 36e5;
            var i = function(b, c) {
                var f = k(b);
                if (f && c && j(f, c)) return !0;
                if (!f && e) {
                    var h = new d.Date(e.date), i = g - h;
                    return 24 > i / a;
                }
                return !1;
            }, j = function(a, b) {
                return -1 !== a.indexOf(b);
            }, k = function(a) {
                for (var c = 0, d = b.length; d > c; c++) {
                    var e = b[c].dates;
                    if (-1 !== e.indexOf(a)) return e;
                }
                return null;
            }, l = function() {
                return e && (e = JSON.parse(e), e.date = e.date ? new d.Date(e.date) : null, e.date) ? e.date.getFullYear() + "-" + (e.date.getMonth() + 1) + "-" + e.date.getDate() : void 0;
            };
            return i(h, l()) ? !0 : !1;
        }
        var m = f.getValue("HERE_LAST_NPS");
        if (a = 36e5, m) {
            var n = new d.Date(JSON.parse(m).date), o = new Date() - n;
            return 24 > o / a;
        }
        return !1;
    }, k.npsBtnDisabled = k._isNPSBtnDisabled(), k.getNewDate = function(a) {
        var b = j(parseInt(d.Math.random() * l.npsPeriod, 10));
        return a && b.setDate(b.getDate() + 14), JSON.stringify({
            date: b
        });
    }, k.open = function(a) {
        e.$broadcast("popover", {
            templateUrl: "features/nps/nps.html"
        }), e.$broadcast("nps.open"), m = a ? "NPSpassive" : "NPSprompt";
        var b = a ? "The NPS form is visible and it was triggered by NPS logic" : "The NPS form is visible and it was actively opened by the user";
        a && g.track(m, b);
    }, k.send = function(c) {
        var d, f = b.defer(), h = angular.copy(k.defaultConfig);
        angular.extend(h.params, c), h.timeout = f.promise, d = a(h), d.abort = function() {
            h.canceled = !0, f.resolve();
        }, e.$broadcast("nps.send");
        var j = "NPSpassive" === m ? "The NPS score was submitted in passive flow" : "The NPS score was submitted in active flow";
        return g.track(m, j, {
            prop19: h.params.score.toString(),
            eVar19: h.params.score.toString()
        }), k.npsBtnDisabled = !0, i.NPS(c), d;
    }, k;
} ]), angular.module("hereApp.service").factory("NotificationsManager", function() {
    var a, b = {
        CLIENT_TIPS: "tips",
        CLIENT_POPOVER: "popover",
        CLIENT_FTU: "ftu"
    };
    return b.lockedBy = function() {
        return a;
    }, b.lock = function(b) {
        a = b;
    }, b.unlock = function(b) {
        a === b && (a = null);
    }, b;
}), angular.module("hereApp.service").factory("PBAPI", [ "$http", "$q", "$window", "Config", "mapsjs", "User", function(a, b, c, d, e, f) {
    var g = e.geo, h = d.PBAPI, i = 10, j = 25, k = Math.max(j, i), l = ~~(1e5 * c.Math.random()), m = "w600-h600", n = {};
    return n.defaultParams = {
        app_id: d.appId,
        app_code: d.appCode
    }, n.defaultHeaders = {
        Accept: "application/json",
        "Accept-Language": f.locale.tagUnderscore
    }, n.defaultConfig = {
        cache: !0,
        method: "GET",
        params: n.defaultParams,
        headers: n.defaultHeaders,
        responseType: "json"
    }, n.defaultCall = function(c, d) {
        var e, f = b.defer(), g = angular.copy(n.defaultConfig), i = c.href;
        return c.url && (g.url = c.url, delete c.url), i && (i.indexOf(h) > -1 && (g.url = i), 
        i.indexOf("app_id=") > -1 && delete g.params.app_id, i.indexOf("app_code=") > -1 && delete g.params.app_code, 
        delete c.href), c.deleteAuth && (delete g.params.app_id, delete g.params.app_code, 
        delete c.deleteAuth), angular.extend(g.params, n.transformParams(c)), g.timeout = f.promise, 
        g.transformResponse = function(a) {
            var b = a ? "object" != typeof a ? JSON.parse(a) : a : null;
            if (b && !b.status) return d && (b = d(b)), b;
        }, g.interceptor = function(a) {
            return a.data ? a.data : b.reject("failed");
        }, e = a(g), e.abort = function() {
            g.canceled = !0, f.resolve();
        }, e;
    }, n.destiSearch = function(a) {
        a.size = a.size || 15, a.url = h + "desti/search", a.teasers = a.size || 15, a.image_dimensions = "w400";
        var b = function(a) {
            var b = a.items ? a : a.results;
            return b.processed ? b : (b.items = b.items.map(function(a) {
                return a.position = n.transformCoordinate(a.position, "jsla"), a.bbox && (a.bbox = n.transformBoundingBox(a.bbox, "jsla")), 
                a;
            }), b.processed = !0, b);
        };
        return n.defaultCall(a, b);
    }, n.search = function(a) {
        a.size = a.size || 15, a.url = h + "discover/search";
        var b = function(a) {
            var b = a.items ? a : a.results;
            return b && b.processed ? b : (b.items = b.items.map(function(a) {
                return a.position = n.transformCoordinate(a.position, "jsla"), a.bbox && (a.bbox = n.transformBoundingBox(a.bbox, "jsla")), 
                a;
            }), b.processed = !0, b);
        };
        return n.defaultCall(a, b);
    }, n.keyByKey = function(a) {
        a.size = a.size || 15, a.url = "//places.cit.api.here.com/places/v1/browse/keybykey", 
        a.app_id = "honda_automotive_search_demo", a.app_code = "0DC3cECwpq5dWepQX2nC0Q";
        var b = function(a) {
            var b = a.items ? a : a.results;
            return b && b.processed ? b : (b.items = b.items.map(function(a) {
                return a.position = n.transformCoordinate(a.position, "jsla"), a.bbox && (a.bbox = n.transformBoundingBox(a.bbox, "jsla")), 
                a;
            }), b.processed = !0, b);
        };
        return n.defaultCall(a, b);
    }, n.suggestions = function(a) {
        a.size = a.size || 15, a.url = h + "suggestions";
        var b = function(a) {
            return a;
        };
        return n.defaultCall(a, b);
    }, n.explore = function(a) {
        a.size = a.size || 15, a.url = h + "discover/explore";
        var b = function(a) {
            var b = a.results.items.map(function(a) {
                return a.position = a.position.distance ? a.position : n.transformCoordinate(a.position, "jsla"), 
                a;
            });
            return b;
        };
        return n.defaultCall(a, b);
    }, n.exploreTiles = function(a) {
        a.size = a.size || 15, a.cacheBuster = l, a.url = h + "tiles";
        var b = function(a) {
            return a.tiles;
        };
        return n.defaultCall(a, b);
    }, n.tile = function(a, b, c, d) {
        var e = {}, f = function(a) {
            var b = a.results.items.map(function(a) {
                return a.position = a.position.distance ? a.position : n.transformCoordinate(a.position, "jsla"), 
                a;
            });
            return b;
        };
        return e.noAPITrackingID = !0, e.url = a + "" + b + "/" + c + "/" + d, e.deleteAuth = !0, 
        n.defaultCall(e, f);
    }, n.place = function(a) {
        a.size = a.size || k, a.image_dimensions = a.image_dimensions || m, a.show_refs = a.show_refs || "facebook,tripadvisor", 
        a.href || (a.url = h + "places/lookup?source=sharing&id=" + a.id, delete a.id);
        var b = function(a) {
            var b = a.location;
            if (b) {
                b.position && !b.position.distance && (b.position = n.transformCoordinate(b.position, "jsla"));
                var c = a.media;
                if (c) {
                    var d = c.images;
                    d && d.available && (a.mainImage = d.items[0], d.items = d.items.map(function(a) {
                        return a.srcRequested = a.dimensions && a.dimensions[m] ? a.dimensions[m] : a.src, 
                        a;
                    }));
                    var e = c.reviews;
                    if (e && e.available && e.items) {
                        var f = n.transformReviews(e.items);
                        e.suppliers = f, e.displayed = Math.min(e.available, i), delete e.items;
                    }
                }
            }
            return a;
        };
        return n.defaultCall(a, b);
    }, n.images = function(a) {
        a.size = a.size || 1e5, a.href || (a.url = h + "places/" + a.id + "/media/images", 
        delete a.id);
        var b = function(a) {
            return a && a.available ? a : void 0;
        };
        return n.defaultCall(a, b);
    }, n.relatedPT = function(a) {
        return n.defaultCall(a);
    }, n.recommendedPlaces = function(a) {
        return n.defaultCall(a);
    }, n.categories = function(a) {
        var b = a || {}, c = b.type || "places";
        return delete b.type, b.url = h + "categories/" + c, n.defaultCall(b);
    }, n.report = function(b) {
        var c = b.reason ? "POST" : "GET";
        if ("GET" === c) return n.defaultCall(b, n.transformReportViewData);
        var d = {
            url: b.url,
            method: "POST",
            data: b
        };
        return delete b.url, a(d);
    }, n.transformParams = function(a) {
        return a.center && (a.at = n.transformCoordinate(a.center, "pbapi"), delete a.center), 
        a.radius && a.at && (a["in"] = a["in"] || a.at + ";r=" + a.radius, delete a.radius), 
        (a["in"] || a.viewBounds) && delete a.at, a.viewBounds && (a["X-Map-Viewport"] = angular.isString(a.viewBounds) ? a.viewBounds : n.transformBoundingBox(a.viewBounds, "pbapi"), 
        delete a.viewBounds), a.lookahead && (a["X-NOSE-nokiamaps-lookahead"] = "1", delete a.lookahead), 
        a;
    }, n.transformReportViewData = function(a) {
        a = angular.copy(a);
        var b, c, d = {}, e = Object.keys(a).map(function(b) {
            var c = a[b];
            return c && c.labels && c.labels.reason && c.labels.reason.values && (c.id = b, 
            c.labels.reason.values = Object.keys(angular.copy(c.labels.reason.values)).map(function(a) {
                var d = c.labels.reason.values[a];
                return d.value = a, d.comment = {
                    maxlength: 255
                }, "other" === a && (d.comment.required = !0, "non-existent" === b && (d.comment.minlength = 20)), 
                delete d.values, d;
            })), c;
        });
        if (e.forEach(function(a) {
            "inappropriate" === a.id ? b = a : "non-existent" === a.id && (c = a);
        }), d = c || b, b && c) {
            var f = d.labels.reason.values;
            f.splice(f.length - 1, 0, b);
        }
        return d;
    }, n.transformCoordinate = function(a, b) {
        return "pbapi" === b ? a.lat.toFixed(4) + "," + a.lng.toFixed(4) : "jsla" === b ? new g.Point(a[0], a[1]) : void 0;
    }, n.transformBoundingBox = function(a, b) {
        return "pbapi" === b ? [ a.getTopLeft().lng.toFixed(4), a.getBottomRight().lat.toFixed(4), a.getBottomRight().lng.toFixed(4), a.getTopLeft().lat.toFixed(4) ].join(",") : "jsla" === b ? new g.Rect(a[3], a[0], a[1], a[2]) : void 0;
    }, n.transformReviews = function(a) {
        var b = angular.copy(a), c = {}, d = [];
        b = b.filter(function(a) {
            return a.description && a.description.length >= 80;
        }), b.sort(function(a, b) {
            return a.date > b.date ? -1 : 1;
        }), b = b.splice(0, 5), b.forEach(function(a) {
            var b = a.supplier;
            if (!c[b.id]) {
                var e = angular.copy(a.supplier);
                e.items = [], c[b.id] = e, d.push(b.id);
            }
            c[b.id].items.push(angular.copy(a));
        });
        var e = d.map(function(a) {
            var b = c[a];
            return b.items.sort(function(a, b) {
                return a.date > b.date ? -1 : 1;
            }), b.available = b.items.length, b.mostRecentDate = b.items[0].date, b;
        });
        e.sort(function(a, b) {
            return a.mostRecentDate > b.mostRecentDate ? -1 : 1;
        });
        var f = {
            available: e.length,
            items: e
        };
        return f;
    }, n.transformCategories = function(a) {
        if (!a || a.status) return null;
        var b = {};
        return a.items.forEach(function(a) {
            var c = a.id, d = a.within.length ? a.within[0] : null;
            !b[d] && d && (b[d] = []), d && b[d].push(c);
        }), b;
    }, n;
} ]), angular.module("hereApp.service").factory("PersistenceService", [ "$window", "$q", function(a, b) {
    var c, d, e, f, g, h = function(a) {
        c = a;
    };
    return d = function(a) {
        var d = b.defer();
        try {
            d.resolve(c.getItem(a));
        } catch (e) {
            d.reject();
        }
        return d.promise;
    }, e = function(a, d) {
        var e = b.defer();
        try {
            e.resolve(c.setItem(a, d));
        } catch (f) {
            e.reject();
        }
        return e.promise;
    }, f = function(a) {
        var d = b.defer();
        try {
            d.resolve(c.removeItem(a));
        } catch (e) {
            d.reject();
        }
        return d.promise;
    }, g = function() {
        var a = b.defer();
        try {
            a.resolve(c.clear());
        } catch (d) {
            a.reject();
        }
        return a.promise;
    }, h(a.localStorage), {
        getValue: d,
        setValue: e,
        removeValue: f,
        clearAll: g
    };
} ]), angular.module("hereApp.service").factory("PhotoGalleryService", [ "$q", "PBAPI", function(a, b) {
    var c, d = {}, e = [ "w200-h200", "w600-h600" ].join(","), f = [], g = 0, h = e, i = -1, j = function() {
        f = [], g = 0, h = e, i = -1;
    }, k = function() {
        var d = a.defer();
        return c ? (b.images({
            id: c.placeId,
            image_dimensions: h
        }).then(function(a) {
            var b = a && a.data ? a.data : null;
            f = b && b.items ? b.items : [], g = b && b.available ? b.available : 0, f = f.map(function(a) {
                return a.supplier && (a.supplier.isInternal = "here" === a.supplier.id), a;
            }), d.resolve(f);
        }), d.promise) : (j(), d.resolve(f), d.promise);
    };
    return d.initialize = function(a, b, d) {
        c = a, a || j(), h = b || e;
        var k = a && a.media && a.media.images && a.media.images.available, l = k && !isNaN(d) && d >= 0 && d < a.media.images.available;
        f = [], g = k ? a.media.images.available : 0, i = l ? d : -1;
    }, d.getPlace = function() {
        return c;
    }, d.getIndex = function() {
        return i;
    }, d.getDimensions = function() {
        return h;
    }, d.hasPhotos = function() {
        return g > 0;
    }, d.getPhotosCount = function() {
        return g;
    }, d.getAllPhotos = function() {
        var b = a.defer();
        return d.hasPhotos() ? (i = -1, g !== f.length ? k().then(function(a) {
            b.resolve(a);
        }) : b.resolve(f), b.promise) : (b.resolve([]), b.promise);
    }, d.getPhoto = function(b) {
        var c = a.defer(), e = isNaN(b) ? i >= 0 ? i : 0 : b;
        return !d.hasPhotos() || e >= g || 0 > e ? (c.resolve(null), c.promise) : (i = e, 
        i >= f.length ? k().then(function(a) {
            c.resolve(a[i]);
        }) : c.resolve(f[i]), c.promise);
    }, d.getNextPhoto = function() {
        return d.getPhoto(i + 1);
    }, d.getPreviousPhoto = function() {
        return d.getPhoto(i - 1);
    }, d.getReportPhotoURL = function(a) {
        if (!(a && a.id && c && c.report && c.report.href)) return "";
        var b = c.report.href.split("?");
        return b[0] = b[0] + "/media/images/" + a.id, b.join("?");
    }, d;
} ]), angular.module("hereApp.service").factory("PhotosAPI", [ "$http", "$q", function(a, b) {
    var c, d = "/api/photos", e = {};
    return c = {
        cache: !0,
        method: "GET",
        responseType: "json",
        url: d
    }, e.photos = function(d) {
        var e, f, g = b.defer(), h = angular.copy(c);
        return f = "/" + d.latitude + "/" + d.longitude + "/" + d.tag_mode + (d.tags ? "/" + d.tags : "") + (d.condition ? "/" + d.condition : ""), 
        h.url += encodeURI(f), h.timeout = g, e = a(h), e.abort = function() {
            h.canceled = !0, g.resolve();
        }, e;
    }, e.getSinglePhoto = function(d) {
        var e, f, g = angular.copy(c), h = b.defer(), i = b.defer();
        return e = "/" + d.latitude + "/" + d.longitude + "/" + d.tag_mode + (d.tags ? "/" + d.tags : "") + (d.condition ? "/" + d.condition : ""), 
        g.url += encodeURI(e), g.timeout = h, f = a(g), f.then(function(a) {
            var b = a.data;
            if (!b || !b.photos || !b.photos.photo) return void i.reject(a);
            var c = {};
            c.photoUrl = b.photos.photo.vcdn_url_cropped._, c.ownerName = b.photos.photo.owner_name, 
            c.websiteUrl = b.photos.photo.website_url, c.type = b.photos.photo.type, i.resolve(c);
        }, function(a) {
            i.reject(a);
        }), i.promise.abort = function() {
            i.reject(), g.canceled = !0, h.resolve();
        }, i.promise;
    }, e.getTags = function(a) {
        var b = {
            ANNUALEVENT: "AnnualEvent",
            AUTUMN: "Autumn",
            CLEAR: "Clear",
            CLOUD: "Cloud",
            DAY: "Day",
            EVENING: "Evening",
            INSIDE: "Inside",
            LANDMARK: "Landmark",
            MORNING: "Morning",
            NIGHT: "Night",
            OUTSIDE: "Outside",
            PANORAMA: "Panorama",
            PEOPLE: "People",
            RAIN: "Rain",
            SNOW: "Snow",
            SPRING: "Spring",
            SUMMER: "Summer",
            WINTER: "Winter"
        }, c = [];
        return angular.forEach(a, function(a) {
            c.push(b[a]);
        }), c.toString();
    }, e;
} ]), angular.module("hereApp.service").factory("PreloadImage", [ "$window", "$q", function(a, b) {
    var c = {
        single: function(d) {
            var e = b.defer(), f = new a.Image();
            return this._img = f, f.onload = function() {
                f && (e.resolve(f.src), f = null, c._img = null);
            }, f.onerror = e.promise.abort = function() {
                e.reject(), f = null, c._img = null;
            }, d ? f.src = d : e.reject(), e.promise;
        }
    };
    return c;
} ]), angular.module("hereApp.service").factory("RandomizerService", function() {
    var a = {}, b = "", c = function(a, c) {
        if (0 === a.length) return b;
        if (1 === a.length) return a[0];
        for (var d; !d; ) {
            var e = a[Math.floor(Math.random() * a.length)];
            d = e !== c ? e : null;
        }
        return d;
    };
    return a.create = function(a) {
        var b, d = angular.isArray(a) ? a : [], e = {};
        return e.getNext = function() {
            var a = c(d, b);
            return b = a, a;
        }, e.getLength = function() {
            return d.length;
        }, e;
    }, a;
}), angular.module("hereApp.service").factory("RecentsCollectionLocalHelper", [ "PersistenceService", "$q", function(a, b) {
    var c = 100, d = "HERE_SEARCH_RECENTS", e = {};
    return e.load = function() {
        var c = b.defer();
        return a.getValue(d).then(function(a) {
            c.resolve(JSON.parse(a) || []);
        }, function() {
            c.resolve([]);
        }), c.promise;
    }, e.update = function(e, f) {
        var g = b.defer();
        if (e = e || [], !f) return g.resolve(e), g.promise;
        e = e.filter(function(a) {
            return a.query !== f.query;
        }), e.unshift(f), e.length > c && e.splice(c, e.length - c);
        var h = angular.toJson(e);
        return a.setValue(d, h).then(function() {
            g.resolve(e);
        }), g.promise;
    }, e.clearAll = function() {
        var c = b.defer();
        return a.removeValue(d).then(function() {
            c.resolve(!0);
        }, function() {
            c.reject();
        }), c.promise;
    }, e;
} ]), angular.module("hereApp.service").factory("RecentsCollectionSCBEHelper", [ "$http", "$q", function(a, b) {
    var c = {}, d = {
        storageInitialized: !1
    };
    return d.types = {
        search: 1,
        place: 2,
        category: 4
    }, c[d.types.search] = "recentSearch", c[d.types.place] = "recentLocation", c[d.types.category] = "recentCategory", 
    d.load = function() {
        var c = b.defer();
        return a.get("/api/recents").success(function(a) {
            var b = [];
            a.places && a.places.forEach(function(a) {
                b.push({
                    data: a,
                    type: d.types.place,
                    query: (d.types.place + " " + a.title + " " + a.description).toLowerCase()
                });
            }), a.searches && a.searches.forEach(function(a) {
                b.push({
                    data: a,
                    type: d.types.search,
                    query: (d.types.search + " " + a.title).toLowerCase()
                });
            }), b = b.sort(function(a, b) {
                return b.data.accessedTime - a.data.accessedTime;
            });
            var e = {};
            b = b.filter(function(a) {
                var b = !e[a.query];
                return e[a.query] = !0, b;
            }), d.storageInitialized = !0, c.resolve(b);
        }).error(function() {
            c.reject([]);
        }), c.promise;
    }, d.update = function(e, f) {
        var g, h = b.defer(), i = angular.copy(f);
        return e = e || [], i && d.storageInitialized ? (i.type === d.types.search && (i.data.description = void 0, 
        i.query = (d.types.search + " " + i.data.title).toLowerCase()), e.forEach(function(a) {
            a.query === i.query && (g = a, a.categoryId && (i.type = d.types.category));
        }), g && (i.data.context = g.data.context, i.data.scbeId = g.data.scbeId, i.data.category = g.data.category), 
        a.post("/api/recents", {
            type: c[i.type],
            payload: i.data
        }).success(function(a) {
            var b = g ? g : i;
            g ? e.splice(e.indexOf(g), 1) : (b.data.scbeId = a.scbeId, b.data.category = a.categoryId || a.category), 
            b.data.accessedTime = a.accessedTime, b.data.context = a.context, e.unshift(b), 
            h.resolve(e);
        }).error(function(a) {
            h.reject(a);
        }), h.promise) : (h.resolve(e), h.promise);
    }, d.clearAll = function() {
        var c = b.defer();
        return a["delete"]("/api/recents").success(function(a) {
            c.resolve(a.deleted);
        }).error(function() {
            c.reject();
        }), c.promise;
    }, d;
} ]), angular.module("hereApp.service").factory("RecentsService", [ "$rootScope", "$q", "RecentsCollectionLocalHelper", "RecentsCollectionSCBEHelper", "withoutBRsFilter", "placeService", "utilityService", "User", "Features", "geoCoder", function(a, b, c, d, e, f, g, h, i, j) {
    var k, l, m = [], n = {}, o = {}, p = 3e4;
    return o.isSCBE = function() {
        return h.isLoggedIn() && i.scbeRecentsService;
    }, o.switchHelper = function() {
        return k = o.isSCBE() ? d : c, l = new Date().getTime(), k.load().then(function(a) {
            m = a;
        });
    }, o.refreshCollection = function() {
        var a = b.defer(), c = l ? new Date().getTime() - l : p;
        return c >= p && o.isSCBE() ? o.switchHelper().then(function() {
            a.resolve(m);
        }) : a.resolve(m), a.promise;
    }, n.types = {
        search: 1,
        place: 2
    }, n.addItem = function(a, b) {
        if (!a || !b || !b.title) return m;
        b.title = b.title || "", b.description = b.description || "";
        var c = a + " " + b.title + " " + b.description, d = {
            type: a,
            data: b,
            query: c.toLowerCase()
        };
        return k.update(m, d).then(function(a) {
            m = a;
        }), !0;
    }, n.addPlace = function(a) {
        var c, d = a.description, g = a.location && a.location.position ? a.location.position : a.position;
        if (a.location && a.location.address && (d = e(a.location.address.text), d = d.replace(a.location.address.country, ""), 
        f.isLocation(a) && (d = a.location.address.postalCode && a.location.address.city ? a.location.address.postalCode + " " + a.location.address.city : a.location.address.city || a.location.address.country), 
        d = d.replace(/^[, ]+/, "").replace(/[, ]+$/, "")), g) {
            var h = void 0 !== g.lat ? g.lat : g.latitude, i = void 0 !== g.lng ? g.lng : g.longitude;
            c = {
                latitude: h,
                longitude: i
            };
        }
        return b.when({
            id: a.placeId || a.id,
            title: a.name || a.title,
            description: d,
            category: f.getMainCategoryId(a),
            position: c,
            place: {
                id: a.placeId || a.id,
                position: c
            }
        }).then(function(b) {
            return !a.bbox && a.location && a.location.address ? j.geoCodeAddress(a.location.address).then(function(a) {
                var c = a && a.data && a.data.mapView;
                return c && (b.bbox = c), b;
            }) : (b.bbox = a.bbox, b);
        }).then(function(a) {
            a.bbox && a.bbox.getTopLeft && (a.bbox = [ a.bbox.getTopLeft().lat, a.bbox.getTopLeft().lng, a.bbox.getBottomRight().lat, a.bbox.getBottomRight().lng ]), 
            n.addItem(n.types.place, a);
        });
    }, n.addSearch = function(a) {
        var b = a.boundingBox, c = b ? [ b.getTopLeft().lat, b.getTopLeft().lng, b.getBottomRight().lat, b.getBottomRight().lng ] : null;
        return n.addItem(n.types.search, {
            id: null,
            title: g.escapeTags(a.query),
            description: a.context && a.context.location && a.context.location.address ? a.context.location.address.city : "",
            category: "search",
            boundingBox: c
        });
    }, n.getItems = function(a, c, d) {
        var e, f = c, h = g.isValidSearchQuery(a) ? a : null, i = b.defer();
        return o.refreshCollection().then(function(b) {
            return f || h ? (h && (a = a.toLowerCase()), e = b.filter(function(b) {
                var d = f ? !!(c & b.type) : !0;
                return h ? (b.type === n.types.search && (a = g.escapeTags(a)), b.query.indexOf(a) > -1 && d) : d;
            }), void i.resolve(e.slice(0, d))) : (i.resolve(b.slice(0, d)), i.promise);
        }), i.promise;
    }, n.isEmpty = function() {
        return 0 === m.length;
    }, n.deleteAllItems = function() {
        var a = b.defer();
        return n.isEmpty() ? (a.resolve(m), a.promise) : (k.clearAll().then(function(b) {
            return b ? (m = [], void a.resolve(m)) : void a.reject();
        }, function() {
            a.reject();
        }), a.promise);
    }, o.switchHelper(), a.$on("userLoggedIn", function() {
        o.switchHelper();
    }), n;
} ]), angular.module("hereApp.service").factory("RedirectService", [ "$location", "$route", "$window", "$rootScope", "mapUtils", "MatcherService", "utilityService", "placeService", "PhotoGalleryService", "RecentsService", "TrackingService", "PBAPI", "Features", "HereAccountService", "$routeParams", "mapsjs", "User", "geoCoder", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    var s = function(a, b) {
        var c = a + " opened", d = b ? b : "unknown", e = "pdc" === a ? "event13" : "event16", f = {
            prop32: c,
            eVar32: c
        };
        "pdc" === a ? f.prop44 = f.eVar44 = d : "discover" === a && (f.prop45 = f.eVar45 = d), 
        k.track(a, c, f, e);
    }, t = [ "discover", "collections" ], u = [ "collection favorite place", "search result list", "collection favorite location", "collection detail", "address marker" ], v = t.concat(u), w = function(a, b) {
        var c = [ "discover marker", "suggestion", "recent", "search result marker" ], d = v.indexOf(a) > -1 || "direction marker" === a && b.indexOf("/directions") > -1 || c.indexOf(a) > -1 && (b.indexOf("/discover") > -1 || b.indexOf("/search") > -1);
        return d;
    }, x = function(a) {
        return t.indexOf(a) > -1;
    }, y = function(a) {
        return x(a) && B.containerUrl.length > 0;
    }, z = function() {
        return m.discover.autoRedirect ? "/discover" : m.map && m.map.syncMapToUrl && 0 === a.path().indexOf("/traffic") ? a.path() : 0 === a.path().indexOf("/discover") ? "/discover" : "/";
    }, A = function(a, b, c) {
        var d = a.getZoom() >= c ? a.getZoom() : c, e = parseFloat(a.getCenter().lng.toFixed(5)) === parseFloat(b.lng.toFixed(5)) && parseFloat(a.getCenter().lat.toFixed(5)) === parseFloat(b.lat.toFixed(5)) && d === parseInt(a.getZoom(), 10), f = 0;
        return 11 > d ? f = 2 : d > 14 && (f = -1), d += 0 >= f && e ? 1 : f;
    }, B = {
        containerUrl: [],
        storeContainerUrl: function(b) {
            var c = a.url();
            w(b, c) && (y(b) && (this.containerUrl.length = 0), this.containerUrl.push(c));
        },
        goBackToContainer: function() {
            var c = this.containerUrl.pop();
            c ? a.url(c) : a.path("/discover"), b.reload();
        },
        goToPlace: function(a, b) {
            var c = this;
            if (a.id || a.href || a.placeId || !a.position) c._goToPlace(a, b); else {
                var d = {
                    size: 1,
                    q: a.title || a.position.latitude + "," + a.position.longitude,
                    center: new p.geo.Point(a.position.latitude, a.position.longitude),
                    lookahead: !0
                };
                l.search(d).then(function(d) {
                    d.data.items[0] ? c._goToPlace(d.data.items[0], b) : c.goToSearch(g.unescapeTags(a.title));
                });
            }
        },
        goToPlaceById: function(a, b) {
            var c = this;
            l.place({
                id: a
            }).then(function(a) {
                var d = a.data;
                c._goToPlace(d, b);
            });
        },
        _goToPlace: function(b, d) {
            if (this.storeContainerUrl(d), h.isDiscoverCategory(b)) {
                j.addPlace(b);
                var e = b.location ? b.location.position : b.position, g = void 0 !== e.lat ? e.lat : e.latitude, i = void 0 !== e.lng ? e.lng : e.longitude, k = {
                    lat: g,
                    lng: i,
                    bbox: b.bbox
                };
                return k = angular.extend(k, h.getPlaceDisplayRestrictions(b)), void B.goToDiscover(k, d);
            }
            var l = b, m = l.placeId || l.id;
            l.matches && f.save(l.href || m, l.matches);
            var n = "/p/" + (l.href ? "h-" + encodeURIComponent(c.btoa(l.href)) : m), o = {};
            s("pdc", d), b.title && (o.msg = b.title), a.path(n).search(o);
        },
        goToLocation: function(c, d) {
            var f = g.convertQueryFormatToMapInfo(a.search().map) || {};
            d && s("location", d), this.storeContainerUrl(d);
            var h = "/location/", i = void 0 !== c.lat ? c.lat : c.latitude, j = void 0 !== c.lng ? c.lng : c.longitude, k = {
                map: g.convertMapInfoToQueryFormat({
                    latitude: i,
                    longitude: j,
                    zoomLevel: f.zoomLevel || 13,
                    mapType: f.mapType || e.NORMAL
                }),
                msg: c.msg
            };
            a.path(h).search(k), b.reload();
        },
        goToDiscover: function(c, f, h) {
            f && s("discover", f), d.whenMapIsReady.then(function(d) {
                var f = c.bbox ? d.getCameraDataForBounds(c.bbox).zoom : 13;
                f = c.minZoomLevel ? Math.max(f, c.minZoomLevel) : f;
                var i = z(), j = g.convertMapInfoToQueryFormat({
                    latitude: c.lat,
                    longitude: c.lng,
                    zoomLevel: f,
                    type: e.getMapNameByType(d.getBaseLayer()).toLowerCase()
                }), k = {
                    map: j
                };
                h ? a.path(i).search(k).replace() : a.path(i).search(k), b.reload();
            });
        },
        goToCategory: function(c, d) {
            if (c) {
                var e = d && d.parentCategoryId ? d.parentCategoryId + ":" + c : c, f = d && d.query ? d.query : "", g = "search performed";
                k.track("search", g, {
                    prop32: g,
                    eVar32: g,
                    prop36: f,
                    eVar36: f,
                    prop38: e,
                    eVar38: e
                }, "event14"), a.path("/discover/" + c), b.reload();
            }
        },
        goToSearch: function(c) {
            var d = g.isValidSearchQuery(c) ? c.trim() : "";
            d = d.replace(/%/g, ""), d = encodeURIComponent(d), a.path("/search/" + d), b.reload();
        },
        goToPhotoGallery: function(a, b, c) {
            if (a) {
                var e = b ? "singlePhoto" : "grid", f = "photo gallery opened" + (c ? " from " + c : "");
                k.track("photoGallery", "User opened the photo gallery", {
                    prop32: f,
                    eVar32: f,
                    prop8: e,
                    eVar8: e
                }), i.initialize(a, void 0, b), d.$broadcast("modalDialog", {
                    templateUrl: "features/photoGallery/container.html"
                });
            }
        },
        goToTraffic: function() {
            a.path("/traffic/explore").replace();
        },
        goToCollection: function(b, c) {
            this.storeContainerUrl(c);
            var d = b ? "/collections/" + b : "/collections";
            a.path(d);
        },
        goToCollectionsByPlace: function(a) {
            if (q.isLoggedIn()) d.$broadcast("modalDialog", {
                templateUrl: "features/collections/manage.html",
                replace: !0,
                context: a
            }); else {
                n.openSignIn();
                var b = d.$on("userLoggedIn", function() {
                    d.$broadcast("modalDialog", {
                        templateUrl: "features/collections/manage.html",
                        replace: !0,
                        context: a
                    }), b();
                });
            }
        },
        goToCity: function(a, b, c, d) {
            if (a && b) {
                var e = {
                    bbox: b ? r.transformBoundingBox(b.getViewBounds(), "geocoder") : "",
                    searchtext: a
                }, f = {
                    lat: c ? c.lat || c.latitude : b.getCenter().lat,
                    lng: c ? c.lng || c.longitude : b.getCenter().lng
                }, g = A(b, f, parseInt(b.getZoom(), 10));
                r.geoCode(e).then(function(a) {
                    if (a && a.data && a.data.mapView && a.data.displayPosition) {
                        var c = r.transformBoundingBox(a.data.mapView, "jsla"), e = b.getCameraDataForBounds(c, !0), h = A(b, a.data.displayPosition, parseInt(e.zoom, 10));
                        return void B.recenterMap(b, a.data.displayPosition, h, d);
                    }
                    B.recenterMap(b, f, g, d);
                }, function() {
                    B.recenterMap(b, f, g, d);
                });
            }
        },
        recenterMap: function(b, c, d, f) {
            if (c && c.lat && c.lng && d && b) {
                var h = {
                    latitude: c.lat,
                    longitude: c.lng,
                    zoomLevel: d,
                    type: e.getMapNameByType(b.getBaseLayer()).toLowerCase()
                }, i = g.convertMapInfoToQueryFormat(h);
                f ? a.search({
                    map: i
                }).replace() : a.search({
                    map: i
                });
            }
        },
        zoomMap: function(a, b, c) {
            if (a) {
                var d = b || 1, e = a.getZoom() + d;
                B.recenterMap(a.getCenter(), e, c);
            }
        }
    };
    return B;
} ]), angular.module("hereApp.service").factory("SessionStorageService", [ "$window", function(a) {
    var b, c, d, e, f;
    try {
        b = a.sessionStorage;
    } catch (g) {}
    return c = function(a) {
        var c;
        try {
            c = b.getItem(a);
        } catch (d) {
            c = !1;
        }
        return c;
    }, d = function(a, c) {
        try {
            b.setItem(a, c);
        } catch (d) {
            return !1;
        }
        return !0;
    }, e = function(a) {
        try {
            b.removeItem(a);
        } catch (c) {
            return !1;
        }
    }, f = function() {
        try {
            b.clear();
        } catch (a) {
            return !1;
        }
    }, {
        getValue: c,
        setValue: d,
        removeValue: e,
        clearAll: f
    };
} ]), angular.module("hereApp.service").factory("Shorten", [ "$http", "$q", function(a, b) {
    var c = {}, d = {};
    return c.url = function(c) {
        var e;
        return e = d[c] ? b.when(d[c]) : a.post("/api/shorten", {
            url: c
        }).then(function(a) {
            return d[c] = a.data.url, a.data.url;
        });
    }, c;
} ]), angular.module("hereApp.service").factory("TipsService", [ "$window", "$rootScope", "ipCookie", "NotificationsManager", "lazy", function(a, b, c, d, e) {
    var f, g, h, i = null, j = +Date.now(), k = null, l = "here_tip_";
    a.here.constants = a.here.constants || {};
    var m = function() {
        var b = a.here.constants.tipsConfig;
        if (b) for (var c = 0; c < b.length; c++) {
            g = b[c];
            var d = +Date.create(g.period.start), e = +Date.create(g.period.end);
            if (j >= d && e >= j) {
                k = g;
                break;
            }
        }
    };
    a.here.constants.tipsConfig ? m() : e.loadJS(a.here.lazy.constants, function() {
        m(), h && s(k, h), b.$broadcast("tipsConfigLoaded");
    }), b.$on("$routeChangeSuccess", function(a, b) {
        b.loadedTemplateUrl && (h = b.loadedTemplateUrl, s(k, h));
    }), b.$on("popover", function() {
        d.unlock(d.CLIENT_TIPS);
    });
    var n = function(a) {
        return c(l + k.id + "_" + a);
    }, o = function(a, b) {
        c(l + (k && k.id) + "_" + a, !0, {
            path: "/",
            expires: b,
            expirationUnit: "seconds"
        });
    }, p = function(a) {
        return a.templateUrl.replace(/[^A-Za-z0-9]/g, "_");
    }, q = function y(a) {
        var b = !1;
        if (n(p(a))) b = !0; else if (a.childs) for (var c = 0; c < a.childs.length && !(b = y(a.childs[c])); c++) ;
        return b;
    }, r = function(a, b) {
        var c;
        if (a.childs) for (var d = 0; d < a.childs.length; d++) {
            var e = a.childs[d], f = p(e), g = q(e, b);
            if (!g && e.templateUrl === b && !n(f)) {
                c = e;
                break;
            }
            c = r(e, b);
        }
        return c;
    }, s = function(a, b) {
        if (f = 0, a && a.id && !n(a.id)) {
            i = null;
            for (var c = 0; c < a.items.length; c++) {
                var d = a.items[c], e = p(d), g = q(d, b);
                if (!g && d.templateUrl === b && !n(e)) {
                    i = angular.copy(d);
                    break;
                }
                if (i = r(d, b)) break;
            }
        }
    }, t = function() {
        if (!d.lockedBy() || d.lockedBy() === d.CLIENT_TIPS) {
            var a;
            return i && (a = i.steps[f], a && d.lock(d.CLIENT_TIPS)), a;
        }
    }, u = function() {
        return f;
    }, v = function() {
        var a = 0;
        return i && i.steps && i.steps.length && (a = i.steps.length), a;
    }, w = function() {
        return i && i.steps && i.steps.length ? f + 1 < i.steps.length : !1;
    }, x = function(a) {
        (!w() || a) && d.unlock(d.CLIENT_TIPS), i && f < i.steps.length && f++;
        var b = +Date.now(), c = +Date.create(g.period.end), e = c - b;
        if (e > 0) {
            var h;
            a && (h = k && k.id, i = null), i && (h = p(i)), o(h, e);
        }
    };
    return {
        next: t,
        getCurrentIndex: u,
        getCount: v,
        canGoNext: w,
        saveState: x
    };
} ]), angular.module("hereApp.service").factory("TrackingService", [ "$window", "Features", function(a, b) {
    var c = a.s, d = {}, e = function() {
        f("prop"), f("eVar"), f("events"), c.campaign = null, c.channel || (c.channel = "here:maps:fw");
    }, f = function(a) {
        for (var b in c) c.hasOwnProperty(b) && 0 === b.indexOf(a) && delete c[b];
    };
    return d.track = function(a, d, f, g) {
        if (!b.mocks) {
            if (e(), c.pageName = c.channel + ":" + a, d && (c.eVar32 = c.prop32 = d), f && "object" == typeof f) for (var h in f) if (f.hasOwnProperty(h)) {
                var i;
                i = "string" == typeof f[h] ? f[h].toLowerCase() : "boolean" == typeof f[h] ? f[h] ? "yes" : "no" : f[h], 
                c[h] = i;
            }
            c.events = g, c.t();
        }
    }, d.click = function(a) {
        b.mocks || c.tl(this, "o", a);
    }, d;
} ]), angular.module("hereApp.service").factory("User", [ "$window", "$q", "$rootScope", "Config", "mapsjs", "hereMapStateStorage", "CountryService", function(a, b, c, d, e, f, g) {
    function h(a) {
        return !(!(a && a.latitude && a.longitude) || isNaN(parseFloat(a.latitude)) || isNaN(parseFloat(a.longitude)));
    }
    function i() {
        return h(u.fromGeoLocation) && u.fromGeoLocation.accuracy && u.fromGeoLocation.accuracy < x;
    }
    function j() {
        return !!u.fromIpLookup;
    }
    function k() {
        var a = f.getState();
        return !(y || !a || !a.view);
    }
    function l() {
        if (i()) return e.mapUtils.makePoint(u.fromGeoLocation);
        if (u.customLocation) return u.customLocation;
        if (k()) {
            var a = f.getState().view, b = a.zoom;
            return a = e.mapUtils.makePoint(a), a.zoom = b, a;
        }
        return j() ? u.fromIpLookup : u.defaultLocation;
    }
    function m(a) {
        a && a.latitude && a.longitude && a.accuracy && (u.fromGeoLocation = a);
    }
    function n(b) {
        a.here.user.auth = b, c.$broadcast("userLoggedIn"), s();
    }
    function o() {
        return a.here.user.auth;
    }
    function p() {
        a.here.user.auth.loggedIn = !1, c.$broadcast("userLoggedOut");
    }
    function q() {
        return a.here.user.auth.loggedIn || !1;
    }
    function r() {
        return a.here.user.ipAddress;
    }
    function s() {
        var b, c = a.here.user.auth;
        b = c.loggedIn ? g.transformCode(c.countryCode) || "gb" : v.country, t ? t.country = b : w = b;
    }
    var t, u, v, w, x, y;
    return function() {
        var b, c = "PREVIOUS_IPLOOKUP", f = a.here.user, g = f.location && f.location.position;
        x = 1e4, v = f.locale, u = {
            fromGeoLocation: null,
            fromIpLookup: h(g) ? e.mapUtils.makePoint(g) : null,
            customLocation: d.customLocation ? e.mapUtils.makePoint(d.customLocation) : null,
            defaultLocation: e.mapUtils.makePoint(d.defaultLocation)
        };
        try {
            b = a.localStorage.getItem(c), b = b ? e.mapUtils.makePoint(JSON.parse(b)) : void 0;
        } catch (i) {
            b = null;
        }
        y = !(!b || b.equals(u.fromIpLookup));
        try {
            u.fromIpLookup && a.localStorage.setItem(c, JSON.stringify(u.fromIpLookup));
        } catch (i) {}
        s();
    }(), c.$on("logOutUser", function() {
        p();
    }), t = {
        getGeoLocation: function() {
            var a = u.fromGeoLocation;
            return a ? e.mapUtils.makePoint(a) : null;
        },
        getUserInitialLocation: l,
        setGeoLocation: m,
        getUserData: o,
        setUserData: n,
        country: w,
        locale: v,
        isLoggedIn: q,
        getUserIPAddress: r,
        _updateCountry: s
    };
} ]), angular.module("hereApp.service").factory("UserVoice", [ "$rootScope", "$window", "$http", "Features", "User", "hereBrowser", function(a, b, c, d, e, f) {
    var g = {}, h = !1;
    return g._lazyLoadUserVoice = function() {
        h || c.jsonp("//widget.uservoice.com/PaCkHJpVyZCjbc6IKgaw.js"), h = !0;
    }, g.initialize = function() {
        b.UserVoice = b.UserVoice || [], d.mocks || g._lazyLoadUserVoice();
    }, g.showUserVoice = function() {
        b.UserVoice.push([ "set", {
            screenshot_enabled: !1,
            locale: "th" !== e.locale.language ? e.locale.language : "en",
            height: f.touch ? "200px" : "325px",
            width: "100%",
            accent_color: "#00C9FF",
            contact_title: "Send us a message",
            contact_enabled: !0,
            smartvote_enabled: !1,
            post_idea_enabled: !1
        } ]), b.UserVoice.showPrompt();
    }, a.$on("popover", function(a, c) {
        b.UserVoice = b.UserVoice || [], c.single && b.UserVoice.hide && b.UserVoice.hide();
    }), g;
} ]), angular.module("hereApp.service").factory("WeatherIconsMatcherService", function() {
    function a(a) {
        var b;
        switch (a) {
          case "clear":
          case "sunny":
            b = {
                condition: g,
                icon: "sun"
            };
            break;

          case "mostly-sunny":
          case "mostly-clear":
          case "passing-clouds":
          case "more-sun-than-clouds":
          case "scattered-clouds":
          case "partly-cloudy":
          case "mixture-sun-clouds":
          case "increasing-cloudiness":
          case "break-of-sun-late":
          case "afternoon-clouds":
          case "morning-clouds":
          case "partly-sunny":
          case "high-level-clouds":
          case "decreasing-cloudiness":
          case "clearing-skies":
          case "more-clouds-than-sun":
          case "broken-clouds":
          case "high-clouds":
            b = {
                condition: d,
                icon: "sun-clouds"
            };
            break;

          case "rain-early":
          case "heavy-rain-early":
          case "heavy-rain":
          case "lots-of-rain":
          case "tons-of-rain":
          case "rain-late":
          case "heavy-rain-late":
          case "flash-floods":
          case "drizzel":
          case "light-rain":
          case "light-rain-late":
          case "numerous-showers":
          case "rain":
          case "rain-showers":
          case "showers":
          case "showers-late":
          case "sprinkles":
          case "sprinkles-early":
          case "sprinkles-late":
          case "few-showers":
          case "light-showers":
          case "passing-showers":
          case "scattered-showers":
          case "floods":
            b = {
                condition: e,
                icon: "rain"
            };
            break;

          case "thunderstorms":
          case "strong-thunderstorms":
          case "severe-tstorms":
          case "thundershower":
          case "thunderstorms-early":
          case "scattered-tstorms":
          case "isolated-thunderstorms-late":
          case "scattered-thunderstorms-late":
          case "thundershower-late":
          case "widely-scattered-thunderstorms":
          case "few-thunderstorms":
          case "isolated-thunderstorms":
          case "few-thunderstorms-night":
          case "isolated-thunderstorms-night":
          case "thunderstorms-night":
          case "widely-scattered-thunderstorms-night":
          case "tstorms":
            b = {
                condition: e,
                icon: "rain-thunder"
            };
            break;

          case "light-fog":
          case "fog":
          case "dense-fog":
          case "ice-fog":
          case "low-level-haze-night":
          case "smoke-night":
          case "haze-night":
            b = {
                condition: f,
                icon: "fog"
            };
            break;

          case "smoke":
          case "low-level-haze":
          case "hazy-sunshine":
          case "haze":
          case "early-fog-followed-by-sun":
            b = {
                condition: g,
                icon: "sun-fog"
            };
            break;

          case "clear-night":
          case "night-clear-night":
            b = {
                condition: g,
                icon: "moon"
            };
            break;

          case "overcast":
          case "cloudy":
          case "low-clouds":
          case "mostly-cloudy":
            b = {
                condition: d,
                icon: "cloud"
            };
            break;

          case "hail":
          case "scattered-flurries":
          case "snow-flurries":
          case "light-snow-showers":
          case "snow-showers":
          case "light-snow":
          case "flurries-early":
          case "snow-showers-early":
          case "light-snow-early":
          case "snow":
          case "moderate-snow":
          case "heavy-snow":
          case "snow-early":
          case "heavy-snow-early":
          case "snow-late":
          case "heavy-snow-late":
          case "light-snow-late":
          case "light-snow-showers-early":
          case "light-snow-showers-late":
          case "snow-flurries-early":
          case "snow-flurries-late":
            b = {
                condition: f,
                icon: "snow"
            };
            break;

          case "light-mixture-of-precip":
          case "sleet":
          case "icy-mix":
          case "mixture-of-precip":
          case "heavy-mixture-of-precip":
          case "icy-mix-changing-to-rain":
          case "icy-mix-changing-to-snow":
          case "rain-changing-to-snow":
          case "rain-changing-to-icy-mix":
          case "light-icy-mix-eraly":
          case "light-icy-mix-early":
          case "icy-mix-early":
          case "snow-changing-to-rain":
          case "snow-changing-to-icy-mix":
          case "light-icy-mix-late":
          case "icy-mix-late":
          case "snow-rain-mix":
            b = {
                condition: f,
                icon: "snow-rain"
            };
            break;

          case "decreasing-cloudiness-night":
          case "clearing-skies-night":
          case "high-level-clouds-night":
          case "mostly-clear-night":
          case "passing-clouds-night":
          case "scattered-clouds-night":
          case "broken-clouds-night":
          case "mostly-cloudy-night":
          case "afternoon-clouds-night":
          case "increasing-cloudiness-night":
          case "morning-clouds-night":
          case "partly-cloudy-night":
          case "high-clouds-night":
            b = {
                condition: d,
                icon: "moon-clouds"
            };
            break;

          case "light-showers-night":
          case "few-showers-night":
          case "passing-showers-night":
          case "rain-showers-night":
          case "scattered-showers-night":
          case "sprinkles-night":
            b = {
                condition: e,
                icon: "moon-rain"
            };
            break;

          case "light-freezing-rain":
          case "freezing-rain":
            b = {
                condition: e,
                icon: "icy-rain"
            };
            break;

          case "tropical-storm":
          case "hurricane":
          case "sandstorm":
          case "dust-storm":
          case "snow-storm":
          case "blizzard":
          case "tornado":
            b = {
                condition: d,
                icon: "storm"
            };
        }
        return b;
    }
    function b(b) {
        return b = b.replace(/_/g, "-"), b = b.replace(/night\-/g, ""), b = b.replace(/\-night/g, ""), 
        a(b) && a(b).condition ? a(b).condition : !1;
    }
    function c(b, c) {
        b = b.replace(/_/g, "-");
        var d, e = "N" === c ? "-night" : "";
        return d = -1 !== b.indexOf("night-") ? b.replace(/night\-/g, "") + "-night" : b + e, 
        a(d) ? a(d).icon : a(b) ? a(b).icon : void 0;
    }
    var d = "CLOUD", e = "RAIN", f = "SNOW", g = "CLEAR";
    return {
        getIconName: c,
        getCondition: b
    };
}), angular.module("hereApp.service").factory("hereBrowser", [ "$window", "$document", "$rootScope", function(a, b, c) {
    var d = {
        touch: !1,
        mouse: !1
    }, e = !1, f = angular.element(a.document.documentElement);
    if (a.navigator.msMaxTouchPoints || "ontouchstart" in a) d.touch = !0; else {
        var g = "#testMozTouch { position: absolute; left: -1000px; top: -1000px; visibility: visible !important; }\n", h = "@media (-moz-touch-enabled){ #testMozTouch {visibility: hidden !important} }", i = angular.element(a.document.body), j = angular.element("<style>").text(g + h), k = angular.element('<div id="testMozTouch">');
        i.append(j), i.append(k), "hidden" === a.getComputedStyle(k[0]).visibility && (d.touch = !0), 
        j.remove(), k.remove();
    }
    this.onMouseDown = function() {
        e = !1;
    }.bind(this), this.onMouseMove = function() {
        if (e) {
            if (f.off("mousedown", this.onMouseDown), f.off("mousemove", this.onMouseMove), 
            /(iPad)/g.test(a.navigator.userAgent)) return void (d.mouse = !1);
            d.mouse = !0, c.$broadcast("mouseDetected");
        }
        e = !0;
    }.bind(this), f.on("mousedown", this.onMouseDown), f.on("mousemove", this.onMouseMove);
    var l = a.navigator.userAgent.match(/^.*(iPhone|iPad|iPod).*(CriOS|Version).*Mobile.*$/i);
    return d.isiPadSafari = l && "iPad" === l[1] && "CriOS" !== l[2], d.isiOS = !!l, 
    d.isAndroid = /(Android)/g.test(a.navigator.userAgent), d.isChrome = null !== a.chrome && "Google Inc." === a.navigator.vendor || /CriOS/g.test(a.navigator.userAgent), 
    d.isIE = /MSIE/g.test(a.navigator.userAgent) || !!a.navigator.userAgent.match(/Trident\/7\./), 
    d.isWindows = /windows/g.test(a.navigator.userAgent.toLowerCase()), d.imageScalingRatio = Math.round(a.devicePixelRatio) || 1, 
    d.isTablet = d.isiOS || d.isAndroid, d.usesMouseRightButton = function(a) {
        return !(!a || !a.originalEvent || 2 !== a.originalEvent.button);
    }, d.isLongPress = function(a) {
        return !(!a || "longpress" !== a.type || !a.pointers || 1 !== a.pointers.length);
    }, d.isRightClickOrLongPress = function(a) {
        if (!a) return !1;
        var b = a.type, c = "click" === b || "tap" === b, e = c && d.usesMouseRightButton(a);
        return e || d.isLongPress(a);
    }, d;
} ]), angular.module("hereApp.service").factory("carIdStorage", [ "$window", function(a) {
    var b = {}, c = "HERE_CAR_IDS";
    return b._getIds = function() {
        var b = {};
        try {
            b = JSON.parse(a.localStorage.getItem(c)) || {};
        } catch (d) {}
        return b;
    }, b.getCarId = function(a) {
        var c = b._getIds();
        return c[a];
    }, b.saveCarId = function(d, e) {
        var f = b._getIds();
        f[d] = e;
        try {
            a.localStorage.setItem(c, JSON.stringify(f));
        } catch (g) {}
    }, b;
} ]), angular.module("hereApp.service").factory("carManufacturerStorage", [ "$window", function(a) {
    var b = {}, c = "HERE_CAR_MANUFACTURER";
    return b.getLast = function() {
        try {
            return a.localStorage.getItem(c);
        } catch (b) {
            return void 0;
        }
    }, b.setLast = function(b) {
        try {
            a.localStorage.setItem(c, b);
        } catch (d) {}
    }, b;
} ]), angular.module("hereApp.service").factory("categories", [ "$templateCache", "categoryList", "Config", function(a, b, c) {
    var d = "others";
    return {
        getDefaultCategory: function(a) {
            var b = c.defaultCategory || "";
            if (angular.isObject(c.defaultCategories) && !isNaN(a)) {
                var d = a + "";
                if (c.defaultCategories[d]) b = c.defaultCategories[d]; else {
                    var e = Object.keys(c.defaultCategories);
                    e.push(d);
                    var f = e.sort(function(a, b) {
                        return parseInt(a, 10) - parseInt(b, 10);
                    }), g = f.indexOf(d) - 1;
                    if (g > -1) {
                        var h = f[g];
                        b = c.defaultCategories[h];
                    }
                }
            }
            return b;
        },
        getCategoryIconName: function(a) {
            var c = a ? a : d;
            if (b.icons.indexOf(c) > -1) return c;
            if (-1 === b.all.indexOf(a)) return 0 === a.indexOf("cuisines.") ? "restaurant" : d;
            var e = b.mapped[a] && b.mapped[a] !== a ? b.mapped[a] : d;
            return this.getCategoryIconName(e);
        },
        getIconPath: function(b) {
            return a.get("/services/categories/paths/" + this.getCategoryIconName(b) + ".svg");
        },
        getSVG: function(a, b, c, d) {
            return b = b || 18, c = c || 18, d = d || "0 0 18 18", '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="' + d + '" width="' + b + '" height="' + c + '">' + this.getIconPath(a) + "</svg>";
        }
    };
} ]), angular.module("hereApp.service").factory("categoriesLive", [ "$q", "PBAPI", "categories", "utilityService", function(a, b, c, d) {
    var e = {}, f = {}, g = [ "eat-drink", "shopping", "going-out", "accommodation", "sights-museums", "transport", "business-services" ], h = [ "administrative-areas-buildings" ], i = [ {
        type: "places",
        parent: ""
    }, {
        type: "cuisines",
        parent: "restaurant"
    } ];
    return f.processFilter = function(a, b) {
        return a.filter(function(a) {
            var c = a.within[0] && b.indexOf(a.within[0]) > -1;
            return -1 === b.indexOf(a.id) && !c;
        });
    }, f.processSort = function(a, b) {
        var d = b.length, e = a.map(function(e) {
            var g = b.indexOf(e.id);
            return e.position = g > -1 ? g : d++, e.hasSubCategories = f.getCategories(a, e.id).length > 0, 
            e.categoryIconId = c.getCategoryIconName(e.id), e;
        });
        return e.sort(function(a, b) {
            return a.position - b.position;
        });
    }, f.processFixCategoryTypes = function(a) {
        return i.forEach(function(b) {
            b.parent && a.forEach(function(a) {
                var c = a.within.indexOf(b.type);
                c > -1 && (a.within[c] = b.parent);
            });
        }), a;
    }, f.processLiveCategories = function(a) {
        var b = f.processFilter(a, h);
        return b = f.processFixCategoryTypes(b), b = f.processSort(b, g);
    }, f.getCategory = function(a, b, c, d) {
        if (!a || !c) return null;
        var e = c.trim().toLowerCase(), f = a.filter(function(a) {
            var c = a[b] ? a[b].toLowerCase() : "";
            return c.indexOf(e) > -1 || e.indexOf(c) > -1;
        }), g = f.filter(function(a) {
            return a[b].toLowerCase() === e;
        });
        return d ? g[0] : g[0] || f[0];
    }, f.getCategoryById = function(a, b) {
        return f.getCategory(a, "id", b, !0);
    }, f.getCategoryByName = function(a, b, c) {
        return f.getCategory(a, "title", b, c);
    }, f.getCategories = function(a, b, c) {
        var d = a.filter(function(a) {
            return b ? a.within.indexOf(b) > -1 : 0 === a.within.length;
        });
        return c && !isNaN(c) ? d.splice(0, c) : d;
    }, f.categories = function() {
        return a.when(f.items || f.getItemsFromPBAPI()).then(function(a) {
            return f.items = a, a;
        });
    }, f.getItemsFromPBAPI = function() {
        var c = i.map(function(a) {
            return b.categories({
                type: a.type
            });
        });
        return a.all(c).then(function(a) {
            var b = [];
            return a.forEach(function(a, c) {
                var d = i[c], e = a.data && a.data.items ? a.data.items : [];
                d.parent && e.length && (e = e.filter(function(a) {
                    return a.id !== d.type;
                })), b = b.concat(e);
            }), f.processLiveCategories(b);
        });
    }, e.getCategories = function(a, b) {
        return f.categories().then(function(c) {
            return f.getCategories(c, a, b);
        });
    }, e.getCategoryByName = function(a, b) {
        return f.categories().then(function(c) {
            return f.getCategoryByName(c, a, b);
        });
    }, e.getCategoryById = function(a) {
        return f.categories().then(function(b) {
            return f.getCategoryById(b, a);
        });
    }, e.search = function(a, b, c) {
        return f.categories().then(function(e) {
            if (!d.isValidSearchQuery(a, 2)) return f.getCategories(e, "", c);
            var g = f.getCategoryByName(e, a, !0), h = g ? f.getCategories(e, g.id, c) : null;
            if (h && h.length) return h;
            var i = a.replace(/[^a-z0-9\s\/&,\-']/gi, ""), j = new RegExp(i, "i"), k = e.filter(function(a) {
                return a.title.match(j);
            }), l = b ? f.getCategories(e, "", c) : [], m = k.length > 0 ? k : l;
            return c && !isNaN(c) ? m.splice(0, c) : m;
        });
    }, e;
} ]), angular.module("hereApp.service").factory("categoryList", function() {
    var a = {};
    return a.tree = {
        "eat-drink": [ "restaurant", "snacks-fast-food", "bar-pub", "coffee-tea" ],
        "going-out": [ "dance-night-club", "cinema", "theatre-music-culture", "casino" ],
        "sights-museums": [ "landmark-attraction", "museum", "religious-place" ],
        transport: [ "airport", "railway-station", "public-transport", "ferry-terminal", "taxi-stand" ],
        accommodation: [ "hotel", "motel", "hostel", "camping" ],
        shopping: [ "kiosk-convenience-store", "mall", "department-store", "food-drink", "bookshop", "pharmacy", "electronics-shop", "hardware-house-garden-shop", "clothing-accessories-shop", "sport-outdoor-shop", "shop" ],
        "business-services": [ "atm-bank-exchange", "police-emergency", "post-office", "tourist-information", "petrol-station", "car-rental", "car-dealer-repair", "travel-agency", "communication-media", "business-industry", "service" ],
        facilities: [ "hospital-health-care-facility", "government-community-facility", "education-facility", "library", "fair-convention-facility", "parking-facility", "toilet-rest-area", "sports-facility-venue", "facility" ],
        "leisure-outdoor": [ "recreation", "amusement-holiday-park" ],
        "administrative-areas-buildings": [ "administrative-region", "city-town-village", "outdoor-area-complex", "building", "street-square" ],
        "natural-geographical": [ "body-of-water", "mountain-hill", "undersea-feature", "forest-heath-vegetation" ],
        "coffee-tea": [ "coffee", "tea" ],
        "kiosk-convenience-store": [ "wine-and-liquor" ],
        "police-emergency": [ "ambulance-services", "fire-department", "police-station" ],
        "hospital-health-care-facility": [ "hospital" ],
        "amusement-holiday-park": [ "zoo" ]
    }, a.icons = [ "accommodation", "administrative-areas-buildings", "airport", "amusement-holiday-park", "atm-bank-exchange", "landmark-attraction", "bar-pub", "business-services", "camping", "car-rental", "casino", "cinema", "city-town-village", "coffee-tea", "eat-drink", "education-facility", "facilities", "ferry-terminal", "going-out", "hospital-health-care-facility", "leisure-outdoor", "library", "natural-geographical", "dance-night-club", "others", "parking-facility", "petrol-station", "pharmacy", "police-emergency", "post-office", "transport", "religious-place", "shopping", "sights-museums", "sports-facility-venue", "taxi-stand", "toilet-rest-area", "tourist-information", "alternate-bridge", "border-crossing", "bridge", "bus", "cable-car", "elevator", "escalator", "funicular", "highway", "intercity-train", "metro", "monorail", "motorail-trains", "ramp", "train", "toll-gate", "train", "tram", "tunnel", "underpath", "unpaved-road", "search", "route", "collections", "explore" ], 
    a.all = [], a.mapped = {}, angular.forEach(a.tree, function(b, c) {
        -1 === a.all.indexOf(c) && (a.all.push(c), a.mapped[c] = c), b.forEach(function(b) {
            a.all.push(b), a.mapped[b] = c;
        });
    }), a;
}), angular.module("hereApp").factory("$exceptionHandler", [ "$window", "$log", "Config", "logStorage", function(a, b, c, d) {
    if (a.jasmine || !c.sentry || !c.sentry.enabled) return function() {
        b.error.apply(b, arguments);
    };
    var e = a.Raven;
    return e.config(c.sentry.publicDSN, {
        whitelistUrls: [ /localhost/, /here\.com/, /here\.sc/ ]
    }).install(), function(a, c) {
        e.captureException(a, {
            extra: {
                logs: d
            }
        }), b.error(a, c);
    };
} ]), angular.module("hereApp.service").factory("ZeroClipboard", [ "$window", function(a) {
    return a.ZeroClipboard;
} ]), angular.module("hereApp").factory("Config", [ "$window", "Features", function(a, b) {
    var c = a.here.config;
    return b.mocks && (c.PBAPI = "/mocks/places/v1/", c.geoCoder.forward = "/mocks/", 
    c.geoCoder.reverse = "/mocks/", c.routing.url = "/mocks/routing/7.2/calculateroute.json", 
    c.simpleRouting.url = "/mocks/routing/7.2/calculateroute.json", c.matrixRouting.url = "/mocks/routing/7.2/calculatematrix.json", 
    c.MIAPI = "/mocks/mia/1.6/", c.traffic.url = "/mocks/traffic/6.1/", c.mapFeedback.url = "/mocks/feedback", 
    c.facebook.host = "/mocks/", c.skyScanner.baseUrl = "/mocks/skyScanner/", c.skyScanner.tokenUrl = "/mocks/skyScanner/tokenRequest", 
    c.skyScanner.currenciesUrl = "/mocks/skyScanner/currenciesRequest", c.skyScanner.proxyPost = "/mocks/proxyPost"), 
    c;
} ]), angular.module("hereApp").factory("Features", [ "$window", function(a) {
    return a.here.features;
} ]), angular.module("hereApp.service").factory("mapsjs", [ "$window", function(a) {
    return a.mapsjs;
} ]), angular.module("hereApp.service").factory("geoCoder", [ "$http", "$q", "Config", "mapsjs", "User", function(a, b, c, d, e) {
    function f(a) {
        return !!(a && a.response && a.response.view && a.response.view.length > 0 && a.response.view[0].result && a.response.view[0].result.length > 0 && a.response.view[0].result[0].location);
    }
    var g = {}, h = d.geo, i = c.geoCoder;
    return g.DETAIL_LEVELS = [ "district", "city", "county", "state", "country" ], g.defaultParams = {
        app_id: c.appId,
        app_code: c.appCode,
        languages: e.locale.tag,
        gen: 3,
        "int": !0,
        jsonAttributes: 1,
        maxresults: 1
    }, g.defaultHeaders = {
        Accept: "application/json"
    }, g.defaultConfig = {
        cache: !0,
        method: "GET",
        params: g.defaultParams,
        headers: g.defaultHeaders,
        responseType: "json"
    }, g.geoCode = function(c) {
        var d, e = b.defer(), f = angular.copy(g.defaultConfig);
        return angular.extend(f.params, g.transformParams(c)), f.timeout = e.promise, f.transformResponse = [ function(a) {
            return angular.isString(a) ? JSON.parse(a) : a;
        }, g.transformResponse.bind(f) ], f.url = i.forward + "/6.2/geocode.json", d = a(f), 
        d.abort = function() {
            f.canceled = !0, e.resolve();
        }, d;
    }, g.geoCodeAddress = function(a) {
        var b = {};
        return Object.keys(a).forEach(function(c) {
            g.DETAIL_LEVELS.indexOf(c) > -1 && (b[c] = a[c]);
        }), this.geoCode(b);
    }, g.reverseGeoCode = function(c) {
        var d, e = b.defer(), f = angular.copy(g.defaultConfig);
        return f.params.mode = "retrieveAddresses", f.params.additionaldata = "SuppressStreetType,Unnamed", 
        angular.extend(f.params, g.transformParams(c)), f.timeout = e.promise, f.transformResponse = [ function(a) {
            return angular.isString(a) ? JSON.parse(a) : a;
        }, g.transformResponse.bind(f) ], f.url = i.reverse + "/6.2/reversegeocode.json", 
        d = a(f), d.abort = function() {
            f.canceled = !0, e.resolve();
        }, d;
    }, g.transformResponse = function(a) {
        var b;
        if (f(a)) return b = a.response.view[0].result[0].location, b.mapView instanceof h.Rect ? b : (b.mapView = h.Rect.coverPoints([ d.mapUtils.makePoint(b.mapView.topLeft), d.mapUtils.makePoint(b.mapView.bottomRight) ]), 
        b.displayPosition = d.mapUtils.makePoint(b.displayPosition), b.navigationPosition && (b.navigationPosition = b.navigationPosition.map(function(a) {
            return d.mapUtils.makePoint(a);
        })), b);
        if (this.cancelled) throw {
            cancelled: !0,
            message: "ReverseGeoCode request was cancelled"
        };
    }, g.transformParams = function(a) {
        return a.location && (a.prox = a.location.lat + "," + a.location.lng + ",200", delete a.location), 
        a;
    }, g.transformBoundingBox = function(a, b) {
        var c = [ "geocoder", "jsla" ];
        if (a && b && -1 !== c.indexOf(b)) {
            if ("geocoder" === b) {
                var d = a.getTopLeft().lat + "," + a.getTopLeft().lng, e = a.getBottomRight().lat + "," + a.getBottomRight().lng;
                return d + ";" + e;
            }
            return "jsla" === b ? new h.Rect(a.getTopLeft().lat, a.getTopLeft().lng, a.getBottomRight().lat, a.getBottomRight().lng) : void 0;
        }
    }, g;
} ]), angular.module("hereApp.service").factory("geolocation", [ "$window", "$q", "$timeout", "$rootScope", "hereBrowser", "TrackingService", "ipCookie", "Config", "splitTesting", "Features", function(a, b, c, d, e, f, g, h) {
    var i, j = {}, k = b.defer(), l = 500, m = 6e4, n = "HERE_GRANTED_GEOLOCATION", o = {
        NON_INITIATED: 0,
        WAITING_FOR_PERMISSION: 1,
        PERMISSION_GRANTED: 2,
        PERMISSION_DENIED: 3,
        UNSUPPORTED: 4,
        ERROR: 5
    }, p = o.NON_INITIATED;
    g(h.cookieNotice.cookieName);
    return j.geoLocationStatus = o, j.getStatus = function() {
        return p;
    }, j._getCurrentPosition = function(c) {
        var e = a.navigator.geolocation, g = b.defer();
        return e ? (p = o.WAITING_FOR_PERMISSION, a.navigator.geolocation.getCurrentPosition(function(a) {
            d.$apply(function() {
                g.resolve(a);
            });
        }, function(a) {
            d.$apply(function() {
                g.reject(a);
            });
        }, c), g.promise) : (f.track("position", null, {
            prop49: "not supported"
        }), p = o.UNSUPPORTED, b.reject({}));
    }, j._updateSuccessStatus = function(a) {
        return p = o.PERMISSION_GRANTED, a;
    }, j._updateFailureStatus = function(a) {
        return f.track("position", null, {
            prop49: 1 === a.code ? "permission denied" : "position fails"
        }), p = 1 === a.code ? o.PERMISSION_DENIED : o.ERROR, b.reject(a);
    }, j._updatePermissionGranted = function(b) {
        try {
            a.localStorage[n] = "true";
        } catch (c) {}
        return b;
    }, j._updatePermissionRejected = function(c) {
        try {
            delete a.localStorage[n];
        } catch (d) {}
        return b.reject(c);
    }, j._ensureGoodAccuracy = function(a) {
        return a.coords && a.coords.accuracy <= l ? a : (f.track("position", null, {
            prop49: "not accurate enough"
        }), p = o.ERROR, b.reject({}));
    }, j._copy = function(a) {
        return {
            coords: a.coords
        };
    }, j.position = function(a, c) {
        return c || (c = {}), c.timeout || (c.timeout = m), i || (i = j._getCurrentPosition(c).then(j._updateSuccessStatus, j._updateFailureStatus).then(j._updatePermissionGranted, j._updatePermissionRejected).then(j._ensureGoodAccuracy).then(j._copy).then(function(a) {
            return f.track("position", "geolocation success"), a;
        })), i.then(function(b) {
            return angular.extend(b, a);
        }, function(c) {
            return b.reject(angular.extend(c, a));
        }).then(function(a) {
            return k.resolve(a), a;
        });
    }, j.watchForGeoLocation = function() {
        return k.promise;
    }, j.hadPermission = function() {
        try {
            return e.isChrome && a.localStorage[n];
        } catch (b) {
            return !1;
        }
    }, j;
} ]), angular.module("hereApp.service").factory("healthyImages", [ "$window", "ensureHTTPSFilter", function(a, b) {
    function c(c, d, e) {
        function f() {
            var d = g;
            if (!(d > h)) {
                var j = i[d][e], k = new a.Image();
                k.addEventListener("error", function() {
                    for (var a = 0, b = c.length; b > a; a++) if (c[a][e] === j) {
                        c.splice(a, 1);
                        break;
                    }
                    f();
                }), k.src = b(j), g++;
            }
        }
        for (var g = 0, h = c.length - 1, i = angular.copy(c), j = 0, k = d; k > j; j++) i[j] && f();
    }
    return {
        filter: c
    };
} ]), angular.module("hereApp.service").factory("hereAnimation", [ "$window", function(a) {
    function b() {
        return a.performance && a.performance.now ? a.performance.now() : Date.now ? Date.now() : new Date().getTime();
    }
    function c(a, b) {
        return this.elm = a, this.prop = b, this;
    }
    !function() {
        for (var c = 0, d = [ "ms", "moz", "webkit", "o" ], e = 0; e < d.length && !a.requestAnimationFrame; ++e) a.requestAnimationFrame = a[d[e] + "RequestAnimationFrame"], 
        a.cancelAnimationFrame = a[d[e] + "CancelAnimationFrame"] || a[d[e] + "CancelRequestAnimationFrame"];
        a.requestAnimationFrame || (a.requestAnimationFrame = function(d) {
            var e = b(), f = Math.max(0, 16 - (e - c)), g = a.setTimeout(function() {
                d(e + f);
            }, f);
            return c = e + f, g;
        }), a.cancelAnimationFrame || (a.cancelAnimationFrame = function(b) {
            a.clearTimeout(b);
        });
    }();
    var d = {
        easeInOutSine: function(a, b, c, d) {
            return c = c || 0, d = d || 1, -d / 2 * (Math.cos(Math.PI * b / a) - 1) + c;
        }
    };
    return c.prototype.to = function(c, e, f) {
        this.currentValue = this.elm[this.prop], this.endValue = c, this.duration = e, this.easingFn = d[f] || d.easeInOutSine, 
        this.startTime = b(), this._frame && a.cancelAnimationFrame(this._frame), this._frame = a.requestAnimationFrame(this._step.bind(this));
    }, c.prototype._step = function() {
        var c = angular.isFunction(this.endValue) ? this.endValue() : this.endValue, d = b() - this.startTime, e = this.easingFn(this.duration, d), f = this.currentValue + (c - this.currentValue) * e;
        this.elm[this.prop] = f, d < this.duration && (this._frame = a.requestAnimationFrame(this._step.bind(this)));
    }, {
        request: a.requestAnimationFrame,
        cancel: a.cancelAnimationFrame,
        now: b,
        easing: d,
        Animate: c
    };
} ]), angular.module("hereApp.service").factory("lazy", [ "$window", function(a) {
    return {
        attached: [],
        loadJS: function(b, c) {
            if (-1 === this.attached.indexOf(b)) {
                var d = a.document.createElement("script");
                d.type = "text/javascript", d.src = b, angular.isFunction(c) && (d.onload = c), 
                a.document.head.appendChild(d), this.attached.push(b);
            } else angular.isFunction(c) && c();
        },
        loadCSS: function(b) {
            if (-1 === this.attached.indexOf(b)) {
                var c = a.document.createElement("link");
                c.rel = "stylesheet", c.href = b, a.document.head.appendChild(c), this.attached.push(b);
            }
        }
    };
} ]), angular.module("hereApp").factory("logStorage", [ "$log", "Config", function(a, b) {
    var c = 10, d = {
        info: [],
        warn: [],
        error: []
    }, e = "prod" !== b.role;
    return d.wrap = function(a, b) {
        var f = a[b];
        a[b] = function() {
            (e || "error" === b) && f.apply(a, arguments);
            var g = d[b], h = [].map.call(arguments, function(a) {
                return a && a.toString();
            });
            g.push(h.join("\n")), g.length > c && g.unshift();
        };
    }, b.sentry && b.sentry.enabled && (d.wrap(a, "info"), d.wrap(a, "warn"), d.wrap(a, "error")), 
    d;
} ]), angular.module("hereApp.service").factory("mapCameraSync", [ "$location", "$rootScope", "Features", "hereBrowser", "mapsjs", "utilityService", "LocationService", function(a, b, c, d, e, f, g) {
    var h = {}, i = {};
    return i.map = null, i.isOn = !1, i.requiresCameraMove = function(a, b) {
        return !a || f.isObjectEmpty(b) ? !1 : b.longitude !== parseFloat(a.getCenter().lng.toFixed(5)) || b.latitude !== parseFloat(a.getCenter().lat.toFixed(5)) || b.zoomLevel !== parseInt(a.getZoom(), 10);
    }, i.moveCamera = function() {
        var g = f.convertQueryFormatToMapInfo(a.search().map), h = !c.disableTransitions && !d.isTablet && !b.firstLoad;
        i.requiresCameraMove(i.map, g) && i.map.getViewModel().setCameraData({
            position: new e.geo.Point(g.latitude, g.longitude),
            zoom: g.zoomLevel,
            animate: h
        });
    }, i.synchronizeSection = f.debounce(function() {
        var a = g.isRouteEnabled(i.notSupportedRoutes);
        i.isOn = a, a && (i.moveCamera(), b.firstLoad = !1);
    }, 100), h.initialize = function(a) {
        a && !i.map && (i.map = a, i.notSupportedRoutes = [], c.directions && c.directions.syncMapToUrl || (i.notSupportedRoutes = [ "/directions" ]), 
        c.map && c.map.syncMapToUrl || (i.notSupportedRoutes = i.notSupportedRoutes.concat([ "/traffic", "/search", "/collections", "pdc" ])), 
        b.$on("$locationChangeSuccess", i.synchronizeSection), b.$on("$routeChangeSuccess", i.synchronizeSection), 
        i.synchronizeSection());
    }, h;
} ]), angular.module("hereApp.service").factory("mapContainers", [ "mapsjs", "markerService", function(a, b) {
    var c = a.map, d = c.Group, e = c.Marker, f = {
        landingPage: new d(),
        directions: new d(),
        discover: new d(),
        search: new d(),
        PDC: new d(),
        geolocation: new d(),
        context: new d(),
        trafficIncidents: new d(),
        trafficFlow: new d(),
        favorites: new d(),
        favoritesSmall: new d({
            zIndex: -1
        }),
        rubberBanding: new d()
    }, g = [ f.landingPage, f.directions, f.discover, f.search, f.PDC, f.geolocation, f.context, f.trafficIncidents, f.trafficFlow, f.favorites, f.favoritesSmall, f.rubberBanding ];
    return f.list = g, f.getExistingMarkerByPBAPIID = function(c, d) {
        try {
            return (d || g).forEach(function(a) {
                a.getVisibility() && a.forEach(function(a) {
                    if (a instanceof e) {
                        var d = b.getWrapped(a);
                        if (d && (a.getVisibility() || d.flagOpened) && (d.data.PBAPIID === c || d.data.locId === c)) throw a;
                    }
                });
            }), null;
        } catch (f) {
            if (f instanceof a.map.Marker) return f;
            throw f;
        }
    }, f.clearContainer = function(a) {
        a.forEach(function(a) {
            a.dispatchEvent("$removed");
        }), a.removeAll();
    }, f.showOnly = function(a) {
        f.landingPage.setVisibility(a === f.landingPage), f.directions.setVisibility(a === f.directions), 
        f.trafficIncidents.setVisibility(a === f.trafficIncidents), f.trafficFlow.setVisibility(a === f.trafficFlow), 
        f.discover.setVisibility(a === f.discover), f.search.setVisibility(a === f.search), 
        f.favorites.setVisibility(a === f.favorites), f.rubberBanding.setVisibility(a === f.rubberBanding);
    }, f;
} ]), angular.module("hereApp.service").factory("mapControlLocationService", function() {
    return {
        isLocationMessageVisible: null
    };
}), angular.module("hereApp.service").factory("mapLocationAddress", [ "$rootScope", "geoCoder", "Features", "markerService", "mapContainers", "markerIcons", "utilityService", "TrackingService", "categories", "placeService", "hereBrowser", "streetLevel", "RedirectService", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n, o, p, q, r = {}, s = e.context;
    r.initialise = function(a) {
        var b = g.debounce(r.handleMapClick, 200);
        n = a, n.addEventListener("tap", function(a) {
            p && p.flagOpened && a.preventDefault(), b(a);
        }), n.addEventListener("longpress", r.handleMapClick);
    };
    var t = function(a, b) {
        if (a) {
            var c = b, e = j.getAddressLabel(a.address), g = j.getMainCategoryId(a), h = {
                locationAddress: a.address.label,
                position: b,
                navigationPosition: a.navigationPosition ? a.navigationPosition[0] : null,
                icons: f.category(g),
                flag: {
                    title: e,
                    icon: i.getSVG(g),
                    closeCallback: function() {
                        d.removeMarker(o, s), p.removeFlag(), p = null, o = null;
                    }
                },
                onClick: function(a, b) {
                    b.preventDefault();
                    var d = angular.copy(c);
                    d.msg = e, m.goToLocation(d, "address marker");
                }
            };
            o = d.createMarker(h), p = d.getWrapped(o), o.setVisibility(!1), s.addObject(o), 
            p.addFlag(), q || (p.flagScope.hideOnClickOutside = !0);
        }
    }, u = function() {
        p && p.removeFlag();
    }, v = function(a) {
        var c = a.currentPointer, d = n.screenToGeo(c.viewportX, c.viewportY);
        b.reverseGeoCode({
            location: d
        }).then(function(a) {
            t(a.data, d);
        }), h.click("map:flag:addressFlag:" + a.type);
    };
    return r.handleMapClick = function(a) {
        if (a.target.__expandoWrapper) {
            var b = a.target.__expandoWrapper;
            if (b.data.incident && b.flagOpened) return;
        }
        if (q && "tap" === a.type) return void (q = !1);
        q = k.isLongPress(a) && !k.usesMouseRightButton(a);
        var c = k.isRightClickOrLongPress(a) || q;
        u(), c && !l.isStreetLevelActive() && (a.preventDefault(), v(a));
    }, r;
} ]), angular.module("hereApp.service").factory("mapMetaInfoLayer", [ "$window", "mapUtils", "hereBrowser", function(a, b, c) {
    var d = {}, e = {};
    return e.isOn = !1, e.map = null, e.types = [ "city center labels", "labels", "buildings", "street labels", "transit stops", "POIs" ], 
    e.listeners = {
        categories: [],
        callbacks: {}
    }, e.metaInfoLayer = null, e.updateMapCursor = function(a) {
        var b = a.target !== e.map ? a.target.getData() : null, c = !!a.target.__expandoWrapper, d = c || b, f = e.map.getElement();
        d ? f.style.cursor = "pointer" : (f.style.cursor = "", delete f.style.cursor);
    }, e.clickHandler = function(a) {
        if (!a || !a.target) return !0;
        var b = a.target.getData ? a.target.getData() : null, d = b && !c.isRightClickOrLongPress(a);
        return d && e.listeners.callbacks[b.category](a, b), !d;
    }, e.getMetaInfoLayer = function(c) {
        var d = a.devicePixelRatio || 1, f = d >= 1.5, g = f ? 512 : 256, h = b.service.getMetaInfoService(), i = e.types.filter(function(a) {
            return -1 === c.indexOf(a);
        }), j = {
            ppi: f ? 320 : 72
        }, k = h.createTileLayer(g, d, i, j);
        return k;
    }, d.addCategoryListener = function(a, b) {
        a && -1 !== e.types.indexOf(a) && b && (-1 === e.listeners.categories.indexOf(a) && e.listeners.categories.push(a), 
        e.listeners.callbacks[a] = b);
    }, d.enable = function(a) {
        if (a && 0 !== e.listeners.categories.length) {
            d.disable(), e.map = a, e.metaInfoLayer = e.getMetaInfoLayer(e.listeners.categories), 
            e.map.addLayer(e.metaInfoLayer), e.map.addEventListener("pointermove", e.updateMapCursor), 
            e.map.addEventListener("tap", e.clickHandler), e.isOn = !0;
            var b = e.metaInfoLayer.getProvider();
            b.addEventListener("pointermove", e.updateMapCursor);
        }
    }, d.disable = function() {
        e.isOn && (e.metaInfoLayer && (e.map.removeLayer(e.metaInfoLayer), e.metaInfoLayer = null), 
        e.map.removeEventListener("pointermove", e.updateMapCursor), e.map.removeEventListener("tap", e.clickHandler), 
        e.isOn = !1);
    }, d.isOn = function() {
        return e.isOn;
    }, d.getSupportedCategories = function() {
        return e.listeners.categories;
    }, d;
} ]), angular.module("hereApp.service").factory("mapMetaInfoLayerListeners", [ "$location", "$rootScope", "mapMetaInfoLayer", "RedirectService", "LocationService", "Features", "TrackingService", function(a, b, c, d, e, f, g) {
    var h = {}, i = {};
    return i.map = null, i.cityLabelsClickListener = function(a, b) {
        var c = b["city center info"];
        g.click("map:label:city_center:click"), d.goToCity(c.name, i.map, c.position, !1);
    }, i.synchronizeSection = function() {
        var a = e.isRouteEnabled(i.notSupportedRoutes);
        a !== c.isOn() && (a ? c.enable(i.map) : c.disable());
    }, h.initialize = function(a) {
        a && !i.map && (i.map = a, i.notSupportedRoutes = [], f.directions && f.directions.metainfoTiles && f.directions.syncMapToUrl || (i.notSupportedRoutes = [ "/directions" ]), 
        f.map && f.map.syncMapToUrl || (i.notSupportedRoutes = i.notSupportedRoutes.concat([ "/traffic", "/search", "/collections", "pdc" ])), 
        c.addCategoryListener("city center labels", i.cityLabelsClickListener), b.$on("$locationChangeSuccess", i.synchronizeSection), 
        i.synchronizeSection());
    }, h;
} ]), angular.module("hereApp.service").factory("hereMapStateStorage", [ "$window", "mapUtils", function(a, b) {
    function c(c) {
        var d = c.getBaseLayer(), f = b.getMapNameByType(d), g = {
            view: {
                latitude: parseFloat(c.getCenter().lat.toFixed(5)),
                longitude: parseFloat(c.getCenter().lng.toFixed(5)),
                zoom: parseInt(c.getZoom(), 10)
            },
            baseMapType: f
        };
        try {
            a.localStorage.setItem(e, JSON.stringify(g));
        } catch (h) {}
    }
    function d() {
        try {
            var b = a.localStorage.getItem(e);
            return b && JSON.parse(b) || {};
        } catch (c) {
            return {};
        }
    }
    var e = "hereMapState";
    return {
        saveMapState: c,
        getState: d
    };
} ]), angular.module("hereApp.service").factory("mapUtils", [ "$window", "mapsjs", "Config", "Features", function(a, b, c, d) {
    var e = {};
    return e.initialize = function() {
        e.service = new b.service.Platform({
            useHTTPS: !0,
            useCIT: c.map.base.url.match(/\.cit\./),
            app_id: c.appId,
            app_code: c.appCode
        }), delete e.service.getBaseUrl().getQuery().xnlp, e.baseMapTiler = e.service.getMapTileService({
            type: "base",
            version: c.map.base.version,
            subdomain: c.map.base.sub
        }), e.aerialMapTiler = e.service.getMapTileService({
            type: "aerial",
            version: c.map.aerial.version,
            subdomain: c.map.aerial.sub
        }), e.trafficMapTiler = e.service.getMapTileService({
            type: "traffic",
            version: c.map.traffic.version,
            subdomain: c.map.traffic.sub
        }), e.createTileProviders(e.baseMapTiler, e.aerialMapTiler, e.trafficMapTiler, e);
    }, e.createMockTileLayer = function() {
        return new b.map.layer.TileLayer(new b.map.provider.ImageTileProvider({
            getURL: function() {
                return "/mocks/maptile/2.1/";
            }
        }));
    }, e.createTileProviders = function(b, e, f, g) {
        var h = (a.devicePixelRatio || 1) >= 1.5, i = h ? 512 : 256, j = {
            lg: c.map.MARC,
            ppi: h ? 320 : 72
        };
        d.mocks ? (g.NORMAL = g.createMockTileLayer(), g.PEDESTRIAN = g.createMockTileLayer(), 
        g.GREY = g.createMockTileLayer(), g.PUBLIC_TRANSPORT = g.createMockTileLayer(), 
        g.TRAFFIC = g.createMockTileLayer(), g.SATELLITE = g.createMockTileLayer(), g.SATELLITE_TRAFFIC = g.createMockTileLayer(), 
        g.SATELLITE_PUBLIC_TRANSPORT = g.createMockTileLayer(), g.SATELLITE_STREETS = g.createMockTileLayer(), 
        g.SATELLITE_LABELS = g.createMockTileLayer(), g.TERRAIN = g.createMockTileLayer()) : (d.directions.routeSandwich ? (g.NORMAL = b.createTileLayer("basetile", "normal.day", i, "png8", j), 
        g.PEDESTRIAN = b.createTileLayer("basetile", "pedestrian.day", i, "png8", j), g.GREY = b.createTileLayer("basetile", "normal.day.grey", i, "png8", j), 
        g.LABELS = b.createTileLayer("labeltile", "normal.day", i, "png8", j)) : (g.NORMAL = b.createTileLayer("maptile", "normal.day", i, "png8", j), 
        g.PEDESTRIAN = b.createTileLayer("maptile", "pedestrian.day", i, "png8", j), g.GREY = b.createTileLayer("maptile", "normal.day.grey", i, "png8", j)), 
        g.PUBLIC_TRANSPORT = b.createTileLayer("maptile", "normal.day.transit", i, "png8", j), 
        g.TRAFFIC = f.createTileLayer("traffictile", "normal.day", i, "png8", angular.extend({
            tprof: "PrtlHere"
        }, j)), g.SATELLITE_TRAFFIC = f.createTileLayer("traffictile", "hybrid.day", i, "png8", j), 
        g.SATELLITE_PUBLIC_TRANSPORT = e.createTileLayer("maptile", "hybrid.day.transit", i, "png8", j), 
        g.TERRAIN = e.createTileLayer("maptile", "terrain.day", i, "png8", j), d.map.satelliteSandwich ? (g.SATELLITE = e.createTileLayer("maptile", "satellite.day", i, "jpg", j), 
        g.SATELLITE_STREETS = e.createTileLayer("linetile", "hybrid.day", i, "png8", j, .5), 
        g.SATELLITE_LABELS = e.createTileLayer("labeltile", "hybrid.day", i, "png8", j)) : d.directions.routeSandwich ? (g.SATELLITE = e.createTileLayer("basetile", "hybrid.day", i, "jpg", j), 
        g.SATELLITE_LABELS = e.createTileLayer("labeltile", "hybrid.day", i, "png8", j)) : g.SATELLITE = e.createTileLayer("maptile", "hybrid.day", i, "png8", j)), 
        g.tileProviders = [ g.NORMAL, g.PEDESTRIAN, g.GREY, g.PUBLIC_TRANSPORT, g.TRAFFIC, g.SATELLITE, g.SATELLITE_TRAFFIC, g.SATELLITE_PUBLIC_TRANSPORT, g.TERRAIN ];
    }, e.getMapTypeByName = function(a) {
        switch ((a || "").toUpperCase()) {
          case "TERRAIN":
            return e.TERRAIN;

          case "SATELLITE":
            return e.SATELLITE;

          case "SATELLITE_TRAFFIC":
            return e.SATELLITE_TRAFFIC;

          case "SATELLITE_PUBLIC_TRANSPORT":
            return e.SATELLITE_PUBLIC_TRANSPORT;

          case "TRAFFIC":
            return e.TRAFFIC;

          case "PEDESTRIAN":
            return e.PEDESTRIAN;

          case "PUBLIC_TRANSPORT":
            return e.PUBLIC_TRANSPORT;

          case "GREY":
            return e.GREY;

          default:
            return e.NORMAL;
        }
    }, e.getMapNameByType = function(a) {
        switch (a) {
          case e.TERRAIN:
            return "TERRAIN";

          case e.SATELLITE:
            return "SATELLITE";

          case e.SATELLITE_TRAFFIC:
            return "SATELLITE_TRAFFIC";

          case e.SATELLITE_PUBLIC_TRANSPORT:
            return "SATELLITE_PUBLIC_TRANSPORT";

          case e.TRAFFIC:
            return "TRAFFIC";

          case e.PEDESTRIAN:
            return "PEDESTRIAN";

          case e.PUBLIC_TRANSPORT:
            return "PUBLIC_TRANSPORT";

          case e.GREY:
            return "GREY";

          default:
            return "NORMAL";
        }
    }, e.isSatelliteLayer = function(a) {
        return a === b.mapUtils.SATELLITE || a === b.mapUtils.SATELLITE_TRAFFIC || a === b.mapUtils.SATELLITE_PUBLIC_TRANSPORT;
    }, e.getAlternateMapType = function(a) {
        var b = e.getMapNameByType(a), c = b.replace("SATELLITE_", ""), d = [ "TRAFFIC", "PUBLIC_TRANSPORT" ].indexOf(c) > -1, f = e.isSatelliteLayer(a), g = [];
        f || g.push("SATELLITE"), d && g.push(c);
        var h = g.join("_");
        return e.getMapTypeByName(h);
    }, e.getDesiredMapName = function(a) {
        a = a || "";
        var b, c = a.match(/\/directions\/publicTransport\/.+\/.+/), d = a.match(/\/directions\/drive\/.+\/.+/), e = function(b) {
            return a.slice(0, b.length) === b;
        };
        return c ? b = "GREY" : e("/directions/publicTransport") ? b = "PUBLIC_TRANSPORT" : e("/directions/walk") ? b = "PEDESTRIAN" : e("/directions/flight") ? b = "NORMAL" : e("/directions") && !d ? b = "TRAFFIC" : e("/traffic") && (b = "TRAFFIC"), 
        b;
    }, e.syncLabels = function(a) {
        d.map.satelliteSandwich && (a.getBaseLayer() === e.SATELLITE ? (a.addLayer(e.SATELLITE_STREETS, 1), 
        a.getLayers().indexOf(e.SATELLITE_LABELS) < 0 && a.getLayers().add(e.SATELLITE_LABELS)) : (a.removeLayer(e.SATELLITE_STREETS), 
        a.getLayers().remove(e.SATELLITE_LABELS))), d.directions.routeSandwich && (a.getBaseLayer() === e.NORMAL || a.getBaseLayer() === e.PEDESTRIAN || a.getBaseLayer() === e.GREY ? (a.getLayers().remove(e.SATELLITE_LABELS), 
        a.getLayers().indexOf(e.LABELS) < 0 && a.getLayers().add(e.LABELS)) : a.getBaseLayer() === e.SATELLITE && (a.getLayers().remove(e.LABELS), 
        a.getLayers().indexOf(e.SATELLITE_LABELS) < 0 && a.getLayers().add(e.SATELLITE_LABELS)));
    }, e.setMinZoom = function(a) {
        e.tileProviders.forEach(function(b) {
            b.setMin(a);
        });
    }, e.makePoint = function(a) {
        var c = void 0 !== a.latitude ? a.latitude : a.lat, d = void 0 !== a.longitude ? a.longitude : a.lng;
        return new b.geo.Point(c, d);
    }, e.enableTilePreloading = function(a, c) {
        var f, g, h = 1024, i = {
            x: h,
            y: h
        }, j = function(a) {
            return new b.map.layer.TileLayer(a.getBaseLayer().getProvider());
        }, k = function(a) {
            return new b.map.layer.TileLayer(a.getBaseLayer() === e.NORMAL || a.getBaseLayer() === e.PEDESTRIAN || a.getBaseLayer() === e.GREY ? e.LABELS.getProvider() : e.SATELLITE_LABELS.getProvider());
        }, l = function() {
            if (a.geoToScreen({
                lat: 0,
                lng: 0
            })) {
                var e = a.getZoom() || c, h = Math.round(Math.max(0, e - 2)), j = a.getViewBounds(), k = a.geoToScreen(j.getTopLeft()).sub(i), l = a.geoToScreen(j.getBottomRight()).add(i), m = new b.geo.Rect.fromPoints(a.screenToGeo(k.x, k.y), a.screenToGeo(l.x, l.y));
                f.requestTiles(m, h, !1, {
                    x: 0,
                    y: 0
                }), (d.directions.routeSandwich || d.map.satelliteSandwich) && g.requestTiles(m, h, !1, {
                    x: 0,
                    y: 0
                });
            }
        }, m = function() {
            f = j(a), (d.directions.routeSandwich || d.map.satelliteSandwich) && (g = k(a)), 
            l();
        };
        return m(), a.addEventListener("baselayerchange", m), a.addEventListener("mapviewchangeend", l), 
        a;
    }, e.getProjectionForCam = function(a, c) {
        var d, e = new b.geo.PixelProjection(), f = c.getViewPort();
        return e.rescale(a.zoom), d = e.geoToPixel(a.position), e.x = d.x - f.width / 2, 
        e.y = d.y - f.height / 2, e;
    }, e.pixelRectToGeoInCamera = function(a, c, d) {
        var f = e.getProjectionForCam(c, d), g = f.pixelToGeo({
            x: a.left,
            y: a.top
        }), h = f.pixelToGeo({
            x: a.right,
            y: a.bottom
        });
        return b.geo.Rect.fromPoints(g, h);
    }, e.initialize(), b.mapUtils = e, e;
} ]), angular.module("hereApp.service").factory("markerClustering", [ "$templateCache", "mapsjs", "markerService", "markerIcons", function(a, b, c, d) {
    var e = {
        createTheme: function(b, e, f) {
            var g, h, i = a.get(b), j = {
                width: e.w,
                height: e.h,
                anchorX: e.w / 2,
                anchorY: e.h
            }, k = f.weightPlaceHolder ? f.weightPlaceHolder : /{W}/, l = f.fontSizes ? f.fontSizes : {
                3: "12",
                4: "10"
            }, m = f.maxZoomToCluster ? f.maxZoomToCluster : 16, n = f.minZoomToShow ? f.minZoomToShow : 7, o = void 0 !== f.upperLimit ? f.upperLimit : !1;
            return l["default"] = l["default"] ? new RegExp(l["default"]) : "14", g = f.clusterFunc ? f.clusterFunc : function(a) {
                var b, e, f = a.getWeight(), g = o && f >= o ? "" + (o - 1) + "+" : f, h = i.replace(k, g);
                return Object.keys(l).forEach(function(a) {
                    if ("default" !== a && ("" + g).length >= a) {
                        var b = new RegExp("font-size=." + l["default"]);
                        h = h.replace(b, 'font-size="' + l[a]);
                    }
                }), b = {
                    position: a.getPosition(),
                    icons: d.staticStyled(h, j),
                    min: a.getMinZoom(),
                    max: a.getMaxZoom(),
                    data: {
                        bounds: a.getBounds(),
                        min: a.getMinZoom(),
                        max: a.getMaxZoom()
                    }
                }, b.min < n && (b.min = n), b.max > m && (b.max = m), e = c.createMarker(b);
            }, h = f.noiseFunc ? f.noiseFunc : function(a) {
                var b, d = a.getData();
                return d.min = a.getMinZoom(), d.min > m && (d.min = m + 1), b = c.createMarker(d);
            }, {
                getClusterPresentation: g,
                getNoisePresentation: h
            };
        },
        createClusterLayer: function(a, c) {
            var d, f, g, h = c.cluster, i = c.theme;
            return g = e.createTheme(i.svgPath, i.size, i.options || {}), h.theme = g, f = new b.clustering.Provider([], h), 
            d = new b.map.layer.ObjectLayer(f), f.addEventListener("tap", function(b) {
                var c = b.target.getData().bounds;
                a.setViewBounds(c, !0);
            }), d;
        }
    };
    return e;
} ]), angular.module("hereApp.service").factory("maneuverIcons", [ "$templateCache", "$sce", function(a, b) {
    function c(b) {
        return a.get("/features/directions/img/maneuvers/" + b + ".svg");
    }
    function d(a, b, d) {
        return b = b || 43, d = d || 43, f.replace(/\{\{W}}/g, b).replace(/\{\{H}}/g, d).replace(/\{\{PATH}}/g, c(a));
    }
    function e() {
        return b.trustAsHtml(d.apply(null, arguments));
    }
    var f = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 43" width="{{W}}" height="{{H}}">{{PATH}}</svg>';
    return {
        getIconPath: c,
        getSVG: d,
        getTrustedSVG: e
    };
} ]), angular.module("hereApp.service").factory("markerIcons", [ "$window", "$templateCache", "categories", "maneuverIcons", "mapsjs", "hereBrowser", function(a, b, c, d, e, f) {
    function g(a) {
        return ("marker" === a || "marker-mode-change" === a) && (a = "blue-marker"), b.get("/services/markerIcons/containers/" + a + ".svg");
    }
    function h(a, b, c) {
        return a.replace(/#333/g, b).replace(/#222/g, c);
    }
    function i(a, b) {
        return a.replace('<svg class="svg_contents"/>', b);
    }
    function j(a, b) {
        return a.replace('<svg class="svg_contents"/>', '<g transform="translate(' + p + ", " + q + ')" id="contents">' + b + "</g>");
    }
    function k(a, b, c, d) {
        var e = h(a, b[0], b[1]), f = h(a, c[0], c[1]), g = d || l;
        return {
            normal: m(e, g),
            active: m(f, g)
        };
    }
    var l, m, n = {}, o = {
        normal: [ "#00c9ff", "#1b7ba3" ],
        active: [ "black", "black" ],
        collected: [ "#ffe600", "#bba005" ]
    }, p = 6, q = 6, r = {}, s = {}, t = {
        memoizeCache: {},
        memoize: function(a, b) {
            var c = t.memoizeCache, d = c[a];
            return d || (c[a] = {}, d = c[a]), function(a) {
                var c = d[a];
                return c || (d[a] = b(a), c = d[a]), c;
            };
        }
    };
    return l = {
        width: 30,
        height: 46,
        anchorX: 15,
        anchorY: 43
    }, l = {
        width: 36,
        height: 36,
        anchorX: 18,
        anchorY: 18
    }, o.normal = [ "#00b4e5", "#1d7ba3" ], p = 9, q = 5, m = function(b, c) {
        var d, g, h, i, j = a.devicePixelRatio || 1, k = {};
        return i = r[b], i || (g = new a.Image(), d = "data:image/svg+xml;base64," + a.btoa(b), 
        g.src = d, k = {
            size: {
                w: c.width * j,
                h: c.height * j
            },
            anchor: {
                x: c.anchorX * j,
                y: c.anchorY * j
            }
        }, f.touch || (k.hitArea = new e.map.HitArea(e.map.HitArea.ShapeType.RECT, [ 0, 0, 36 * j, 32 * j ])), 
        h = new e.map.Icon(g, k), r[b] = {
            svg: b,
            url: d,
            image: g,
            icon: h
        }, i = r[b]), i;
    }, n.knife = t.memoize("knife", function(a) {
        return b.get("/services/markerIcons/knives/" + a + ".svg");
    }), n.normal = t.memoize("normal", function() {
        return k(g("marker"), o.normal, o.active);
    }), n.geolocation = t.memoize("geolocation", function() {
        return k(g("geolocation"), o.normal, o.normal, {
            width: 20,
            height: 20,
            anchorX: 10,
            anchorY: 10
        });
    }), n.numbered = t.memoize("numbered", function(a) {
        var b = i(g("marker"), g("numbered").replace("99", a));
        return k(b, o.normal, o.active);
    }), n.category = t.memoize("category", function(a) {
        var b = j(g("marker"), c.getIconPath(a));
        return k(b, o.normal, o.active);
    }), n.smallFavorite = t.memoize("smallFavorite", function() {
        var a = g("star"), b = h(a, o.collected[0], o.collected[1]), c = a.replace(/#CDAF2C/gi, "#000").replace(/#FEE600/gi, "#000"), d = {
            width: 32,
            height: 32,
            anchorX: 16,
            anchorY: 21
        };
        return {
            normal: m(b, d),
            active: m(c, d)
        };
    }), n.route = t.memoize("route", function(a) {
        var b, c, d = {
            width: 30,
            height: 50,
            anchorX: 15,
            anchorY: 46
        };
        return angular.isNumber(a) ? (b = i(g("start"), g("numbered").replace("99", a)), 
        c = k(b, o.normal, o.active, d)) : "destination" === a ? c = k(g("destination"), o.normal, o.active, d) : "start-destination" === a ? (b = i(g("marker"), g("start-destination")), 
        c = k(b, o.normal, o.active, d)) : c = k(g("start"), o.normal, o.active, d), c;
    }), n.modeChange = t.memoize("modeChange", function(a) {
        var b = j(g("marker-mode-change"), c.getIconPath(a));
        return k(b, o.normal, o.active, l);
    }), n.collected = t.memoize("collected", function(a) {
        var b = j(g("marker"), c.getIconPath(a)), d = b.replace("#0d2e41", "#4c4a00"), e = d.replace(/#fff/gi, "#010b1e").replace('"0.3"', '"0.25"'), f = h(e, o.collected[0], o.collected[1]), i = h(d, o.active[0], o.active[1]).replace(/#fff/gi, "#ffe600");
        return {
            normal: m(f, l),
            active: m(i, l)
        };
    }), n.collectedRoute = t.memoize("collectedRoute", function() {
        var a = g("collected-routes"), b = a.replace(/#FBDB0A/gi, "#FFFFFF"), c = {
            width: 35,
            height: 35,
            anchorX: 17,
            anchorY: 19
        };
        return {
            normal: m(a, c),
            active: m(b, c)
        };
    }), n.trafficIncidents = function(a, b) {
        var c = s[a + b];
        if (c) return c;
        var d, e, f = g(a), h = {
            width: 22,
            height: 26,
            anchorX: 11,
            anchorY: 26
        };
        switch (b) {
          case "minor":
            f = f.replace(/#D5232F/g, "#FFA100"), d = f.replace(/#FFA100/g, "#D6800F");
            break;

          case "critical":
            f = f.replace(/#D5232F/g, "#323232"), d = f.replace(/#323232/g, "#666666");
            break;

          default:
            d = f.replace(/#D5232F/g, "#890000");
        }
        return e = s[a + b] = {
            normal: m(f, h),
            active: m(d, h)
        };
    }, n.maneuvers = t.memoize("maneuvers", function(a) {
        var b = i(g("marker"), d.getIconPath(a));
        return b = b.replace(/<path d=/g, '<path fill="white" transform="scale(.4) translate(25, 12)" d='), 
        k(b, o.active, o.active);
    }), n.staticStyled = t.memoize("cluster", function(a, b) {
        return k(a, [], [], b);
    }), n;
} ]), angular.module("hereApp.service").factory("markerService", [ "mapsjs", "$location", "$compile", "$rootScope", "splitTesting", "directionsUrlHelper", "utilityService", "hereBrowser", function(a, b, c, d, e, f, g, h) {
    function i(a) {
        this.data = a, this.currentIcons = a.icons;
        var b = {
            icon: this.currentIcons.normal.icon,
            anchor: this.currentIcons.normal.anchor
        };
        a.min && (b.min = a.min), a.max && (b.max = a.max), a.data && (b.data = a.data), 
        this.marker = new k.Marker(a.position, b), this.marker.__expandoWrapper = this, 
        this.flagOpened = !1, d.whenMapIsReady.then(function(a) {
            j = a;
        });
        var c = this._clickHandler.bind(this), e = this._enterHandler.bind(this), f = this._leaveHandler.bind(this);
        a.flag && this.marker.addEventListener("tap", c), this.marker.addEventListener("pointerenter", e), 
        this.marker.addEventListener("pointerleave", f), this.marker.addEventListener("dragstart", function() {
            a.flag && this.removeEventListener("tap", c), this.removeEventListener("pointerenter", e), 
            this.removeEventListener("pointerleave", f);
        }, !0), this.marker.addEventListener("dragend", function() {
            a.flag && this.addEventListener("tap", c), this.addEventListener("pointerenter", e), 
            this.addEventListener("pointerleave", f);
        }, !1);
    }
    var j, k = a.map, l = 0;
    return i._currentMarkerWithFlag = null, i._currentHighlightedMarker = null, i.prototype._createScope = function() {
        var a = d.$new();
        if (a.title = this.data.flag.title, a.icon = this.isCollected ? this.data.flag.collectedIcon : this.data.flag.icon, 
        a.knifeType = this.data.flag.knife, a.data = this.data, a.wrappedMarker = this, 
        a.directionsUrl = a.data.PBAPIID || a.data.locationAddress ? f.createUrlForFlag(a.data) : null, 
        a.data.PBAPIID) a.pdcUrl = "/p/" + a.data.PBAPIID; else if (a.data.position) {
            var c = g.convertQueryFormatToMapInfo(b.search().map), e = a.title || a.data.locationAddress, h = a.data.position, i = void 0 !== h.lat ? h.lat : h.latitude, j = void 0 !== h.lng ? h.lng : h.longitude;
            c.latitude = i, c.longitude = j, a.pdcUrl = "/location/?map=" + g.convertMapInfoToQueryFormat(c) + "&msg=" + e;
        } else a.pdcUrl = null;
        return a;
    }, i.prototype._createIncidentScope = function() {
        var a = d.$new(), b = this.data.flag;
        return a.title = b.title, a.description = b.description, a.startTime = b.startTime, 
        a.endTime = b.endTime, a.data = this.data, a.wrappedMarker = this, a;
    }, i.prototype._createManeuverScope = function() {
        var a = d.$new(), b = this.data.flag;
        return a.maneuverIcon = b.maneuverIcon, a.description = b.description, a.data = this.data, 
        a.wrappedMarker = this, a;
    }, i.prototype._clickHandler = function(a) {
        (angular.isUndefined(a.originalEvent.button) || 0 === a.originalEvent.button) && (j.getElement().style.cursor = "default", 
        this.addFlag(), this.flagScope.expanded = !0, this.flagScope.hideOnClickOutside = !0, 
        this.data.isAlwaysVisibleFavoriteMarker && e.conversion("collectionsAlwaysVisible"));
    }, i.prototype._enterHandler = function(a) {
        h.mouse && (j.getElement().style.cursor = "pointer", this.addHighlight(), this.data.incident && (this.addFlag(), 
        h.isIE && h.touch && ("tap" === a.type || "pointerdown" === a.originalEvent.type) && (this.flagScope.expanded = !0), 
        this.flagScope.hideOnClickOutside = !0), this.data.onMouseEnter && this.data.onMouseEnter(this));
    }, i.prototype._leaveHandler = function() {
        j.getElement().style.cursor = "default", this.removeHighlight(), this.data.onMouseLeave && this.data.onMouseLeave(this);
    }, i.prototype._closeCurrentFlagBeforeOpeningFlag = function() {
        var a = i._currentMarkerWithFlag;
        a && a !== this && a.removeFlagSmoothly(!0), i._currentMarkerWithFlag = this;
    }, i.prototype.setPosition = function(a) {
        this.marker.setPosition(a), this.data.position = a;
    }, i.prototype.addHighlight = function() {
        i._currentHighlightedMarker && i._currentHighlightedMarker !== this && i._currentHighlightedMarker.removeHighlight(), 
        i._currentHighlightedMarker = this, this.marker.setIcon(this.currentIcons.active.icon), 
        this.marker.setZIndex(10);
    }, i.prototype.removeHighlight = function() {
        this.marker.setIcon(this.currentIcons.normal.icon), this.marker.setZIndex(0);
    }, i.prototype.addFlag = function(a) {
        if (this._closeCurrentFlagBeforeOpeningFlag(), !this.flagOpened) {
            if (this.flagOpened = !0, this.data.incident) this.flagElement = angular.element("<div data-here-marker-flag-incident>"), 
            this.flagScope = this._createIncidentScope(); else if (this.data.maneuver) this.flagElement = angular.element("<div data-here-marker-flag-maneuver>"), 
            this.flagScope = this._createManeuverScope(); else {
                if (!this.data.flag) return;
                this.flagElement = angular.element("<div data-here-marker-flag>"), this.flagScope = this._createScope();
            }
            this.data.flag.openCallback && this.data.flag.openCallback(), j.getViewPort().element.parentNode.appendChild(this.flagElement[0]), 
            c(this.flagElement)(this.flagScope);
        }
        this.flagScope.hideOnClickOutside = !!a;
    }, i.prototype.removeFlag = function() {
        this.flagOpened && (this.flagOpened = !1, this.flagScope.$destroy(), this.flagScope = void 0, 
        this.flagElement.remove(), this.flagElement = void 0, i._currentMarkerWithFlag === this && (i._currentMarkerWithFlag = void 0), 
        this.data.flag.closeCallback && this.data.flag.closeCallback());
    }, i.prototype.removeFlagSmoothly = function(a) {
        (this.flagOpened || a) && (this.data.incident || this.data.maneuver || a ? this.removeFlag() : this.flagScope.closeSmoothly && this.flagScope.closeSmoothly(), 
        i._currentMarkerWithFlag === this && (i._currentMarkerWithFlag = void 0));
    }, i.prototype.setMarkerCollected = function(a) {
        this.isCollected = a, this.currentIcons = a ? this.data.collectedIcons : this.data.icons, 
        this.flagOpened && (this.flagScope.icon = this.isCollected ? this.data.flag.collectedIcon : this.data.flag.icon), 
        this.currentIcons && this.currentIcons.normal && this.marker.setIcon(this.currentIcons.normal.icon);
    }, {
        getWrapped: function(a) {
            return a.__expandoWrapper;
        },
        createMarker: function(a) {
            return l++, new i(a).marker;
        },
        removeMarker: function(a, b) {
            j && j.getObjects().indexOf(a) > -1 && (a.dispatchEvent("$removed"), b.removeObject(a), 
            l--);
        },
        getNumberOfExistingMarkers: function() {
            return l;
        }
    };
} ]), angular.module("hereApp").config([ "$httpProvider", function(a) {
    delete a.defaults.headers.common["X-Requested-With"];
} ]), angular.module("hereApp.service").factory("LocationChangedNpsTriggeringLogic", [ "$window", "$rootScope", "Config", "LocalStorageService", "NPS", "NotificationsManager", function(a, b, c, d, e, f) {
    var g = "HERE_NPS_LCTL";
    return {
        init: function() {
            var h = c.nps, i = 0, j = "HERE_LAST_NPS", k = h.lowerThreshold, l = h.upperThreshold, m = d.getValue(g), n = function() {
                d.setValue(j, JSON.stringify({
                    date: new a.Date()
                }));
            }, o = function() {
                d.setValue(g, e.getNewDate(!0));
            };
            if (!m) return void d.setValue(g, e.getNewDate());
            if (new a.Date(JSON.parse(m).date) <= new a.Date()) var p = k + a.Math.random() * l, q = b.$on("$locationChangeSuccess", function() {
                f.lockedBy() || (i++, i > p && (e.open(!0), q()));
            });
            b.$on("nps.open", o), b.$on("nps.send", n);
        }
    };
} ]), angular.module("hereApp.service").factory("herePageTitle", [ "$window", function(a) {
    return {
        "default": "HERE - City and Country Maps - Driving Directions - Satellite Views - Routes",
        set: function(b) {
            a.document.title = b || this["default"];
        },
        get: function() {
            return a.document.title;
        }
    };
} ]), angular.module("hereApp.service").factory("panelsService", [ "$route", "$document", "Features", "hereBrowser", function(a, b, c, d) {
    var e = 20, f = b[0].querySelector(".panel"), g = {
        bodyNode: b[0].querySelector("body"),
        discoverIsMinimized: !1,
        isMinimized: !1,
        leftPaddingOffset: e,
        width: f ? f.offsetWidth + f.offsetLeft + e : e,
        getSize: function() {
            return g.bodyNode.offsetWidth < 1301 ? "small" : "default";
        },
        getDimensions: function() {
            var a, b = d.imageScalingRatio;
            switch (g.getSize()) {
              case "small":
                a = {
                    width: 380 * b,
                    height: 95 * b
                };
                break;

              default:
                a = {
                    width: 582 * b,
                    height: 146 * b
                };
            }
            return a;
        },
        minimize: function() {
            a.current.$$route.blockMinimizedPanelState !== !0 && (g.isMinimized = !0);
        }
    };
    return g;
} ]), angular.module("hereApp.service").factory("placeService", [ "utilityService", "$location", function(a, b) {
    var c = {}, d = "city-town-village", e = [ d, "administrative-region" ];
    return c.isLocation = function(a) {
        if (!a) return !1;
        var b = !(!a.location || !a.location.address), d = a.placeId || a.id || a.locationId;
        return !(!d || !d.match(/^loc-[0-9a-zA-Z]+/) || !b && !c.isCoordinate(a));
    }, c.isDiscoverCategory = function(a) {
        if (!a || c.isLocation(a)) return !1;
        if (a.categories) return !!a.categories.filter(function(a) {
            return e.indexOf(a.id) > -1;
        }).length;
        if (a.category) {
            if ("string" == typeof a.category || a.category instanceof String) return e.indexOf(a.category) > -1;
            if (a.category.id) return e.indexOf(a.category.id) > -1;
        }
        return !1;
    }, c.getFriendlyUrl = function(b) {
        var d = b && b.location && b.location.address && b.location.address.country || "_", e = b && b.location && b.location.address && b.location.address.city || "_", f = c.getMainCategoryId(b) || "_", g = b && b.name || "_", h = b && b.placeId, i = "/" + a.replaceSpecialChars(d.toLowerCase()) + "/" + a.replaceSpecialChars(e.toLowerCase()) + "/" + a.replaceSpecialChars(f.toLowerCase()) + "/" + a.replaceSpecialChars(g.toLowerCase());
        return i = i.replace(/\-+$/, ""), i + "--" + h;
    }, c.getMainCategoryId = function(a) {
        if (!a) return null;
        if (a.mainCategory) return a.mainCategory;
        if (c.isLocation(a)) return "street-square";
        if (a.categories && a.categories.length) return a.categories[0].id || a.categories[0].categoryId;
        if (a.category) {
            if ("string" == typeof a.category) return a.category;
            if (a.category.id) return a.category.id;
        }
        return null;
    }, c.isCoordinate = function(a) {
        var b = a ? a.name || a.title : null;
        return !!("" === a.name || b && b.match(/^[N|S]\d+(\.\d+)*\s*,*\s*[E|W]\d+(\.\d+)*$/));
    }, c.isCity = function(a) {
        if (a.category) {
            if ("string" == typeof a.category) return a.category === d;
            if (a.category.id) return a.category.id === d;
        }
        return a.categories && a.categories.some ? a.categories.some(function(a) {
            return "city-town-village" === a.id;
        }) : !1;
    }, c.getPlaceDisplayRestrictions = function(a) {
        var b = {};
        return c.isCity(a) && (b.minZoomLevel = 12), b;
    }, c.getUrl = function(d) {
        if (d.location && d.location.address && d.location.address.country && (d.category || d.categories) && d.name && d.placeId) return c.getFriendlyUrl(d);
        if (d.placeId) return "/p/" + d.placeId;
        if (d.location && d.location.position) {
            var e = b.search(), f = a.convertQueryFormatToMapInfo(e.map), g = d.location.position, h = void 0 !== g.lat ? g.lat : g.latitude, i = void 0 !== g.lng ? g.lng : g.longitude;
            f.latitude = h, f.longitude = i, e.map = a.convertMapInfoToQueryFormat(f);
            var j = [];
            for (var k in e) j.push(k + "=" + e[k]);
            return d.name && j.push("msg=" + d.name), "/location/?" + j.join("&");
        }
    }, c.getAddressLabel = function(a) {
        if (!a || !a.label && !a.text) return "";
        var b = a.label || a.text, c = b.split(","), d = "", e = a.additionalData ? a.additionalData.map(function(a) {
            return a.value;
        }) : [], f = function(a) {
            return a && isNaN(a) && a.length > 5;
        }, g = function(a) {
            var b = a.trim();
            return -1 === e.indexOf(b);
        };
        for (e.push(a.city), e.push(a.postalCode), e.push(a.state); !f(d) && c.length > 0; ) {
            var h = c.shift();
            g(h) && (d += " " + h.trim());
        }
        return d = "" === d && a.city ? a.city : d, d = d.replace(a.postalCode + " ", "").trim(), 
        "" !== d ? d : b.replace(/,/g, "");
    }, c.addReasons = function(a, b, c) {
        if (!a || a && a.matches) return a;
        a.matches = {}, a.matches.items = [];
        var d = a.title.toLowerCase().indexOf(b.toLowerCase()) > -1, e = !isNaN(c) && 5 > c, f = a.averageRating && a.averageRating >= 4, g = a.tags && a.tags.length > 2;
        if (d) {
            var h = b.toLowerCase() === a.title.toLowerCase() ? "Exact" : "Partial";
            a.matches.items.push({
                text: h + " match for " + b + "!",
                subText: b
            });
        }
        return e && a.matches.items.push({
            text: "One of the top in its class!"
        }), f && a.matches.items.push({
            text: "The high ratings show its importance!"
        }), g && a.matches.items.push({
            text: "The diversity in its cuisine"
        }), a.matches.available = a.matches.items.length, 0 === a.matches.available && delete a.matches, 
        a;
    }, c.getFacebookUrl = function(a) {
        if (a.references && a.references.facebook) return "https://facebook.com/" + a.references.facebook.id;
        if (a.media && a.media.links && a.media.links.items && a.media.links.items.length) {
            var b = a.media.links.items.filter(function(a) {
                return a.url.indexOf("facebook.com/") > -1;
            })[0];
            return b && b.url;
        }
        return void 0;
    }, c;
} ]), angular.module("hereApp.service").factory("reportMapProblem", [ "Config", "$http", function(a, b) {
    var c = {}, d = {
        headers: {
            "Content-Type": "application/vnd.navteq.layerObjectList+json; charset=utf-8",
            Accept: "application/json; charset=UTF-8",
            "Group-Id": "FGx1AWaAzKOo0imNkLmf",
            "Auth-Service-Id": "here_app",
            "Auth-Identifier": a.appId,
            "Auth-Secret": a.appCode
        }
    };
    return c.report = function(c, e) {
        var f = [ {
            type: "Point",
            coordinates: [ e.getCenter().lng, e.getCenter().lat, 0 ],
            properties: {
                v: "2.1",
                appId: a.appId,
                error: 11,
                details: c,
                zoomLevel: e.getZoom()
            }
        } ];
        return b.post(a.mapFeedback.url, f, d);
    }, c;
} ]), angular.module("hereApp.service").factory("reportSLI", [ "$http", "User", function(a, b) {
    var c = {};
    return c._prepareParams = function(a) {
        var c, d = a.getViewModel().getCameraData(), e = a.getEngine(), f = e.getPanoramaId ? e.getPanoramaId() : 12345, g = b.locale.language;
        return g = g.substring(0, 2).toUpperCase(), c = {
            imageId: f,
            latitude: a.getCenter().lat,
            longitude: a.getCenter().lng,
            yaw: d.yaw,
            pitch: d.pitch,
            fovX: 5,
            fovY: 5,
            language: g
        };
    }, c.report = function(b, d) {
        var e = c._prepareParams(d);
        return angular.extend(e, b), a.post("/api/reportSLI/", e);
    }, c;
} ]), angular.module("hereApp.service").factory("routing", [ "$http", "$log", "$q", "$timeout", "Features", "Config", "mapsjs", "User", "unitsStorage", "mapUtils", "utilityService", function(a, b, c, d, e, f, g, h, i, j, k) {
    var l = 3e4, m = 5e3, n = {}, o = f.routing, p = g.geo, q = !1;
    return n.defaultParameters = angular.extend({}, o, {
        app_id: f.appId,
        app_code: f.appCode,
        jsonAttributes: 41
    }), delete n.defaultParameters.url, n.simpleRouteParameters = angular.extend({}, f.simpleRouting, {
        app_id: f.appId,
        app_code: f.appCode,
        jsonAttributes: 41
    }), delete n.simpleRouteParameters.url, n.matrixRouteParameters = angular.extend({}, f.matrixRouting, {
        app_id: f.appId,
        app_code: f.appCode,
        jsoncallback: "JSON_CALLBACK"
    }), delete n.matrixRouteParameters.url, n.defaultConfig = {
        method: "GET",
        url: o.url,
        params: n.defaultParameters,
        cache: !1
    }, n.simpleRouteConfig = {
        method: "GET",
        url: o.url,
        params: n.simpleRouteParameters,
        cache: !1
    }, n.matrixRouteConfig = {
        method: "JSONP",
        url: f.matrixRouting.url,
        params: n.matrixRouteParameters,
        cache: !1
    }, n.route = function(b) {
        var e, f = c.defer(), g = angular.copy(n.defaultConfig);
        return angular.extend(g.params, n.transformParams(b)), g.timeout = f.promise, g.transformResponse = [ function(a) {
            return angular.isString(a) ? JSON.parse(a) : a;
        }, n.transformResponse.bind(g) ], b.requestLinkAttributes && (g.params.legattributes = "all", 
        g.params.linkattributes = "none,sh,ds,rn,ro,nl,pt,ns,le"), q = !b.requestLinkAttributes, 
        g.params.requestLinkAttributes = null, e = a(g), d(f.resolve, l), e.abort = function() {
            g.cancelled = !0, f.resolve();
        }, e;
    }, n.simpleRoute = function(b) {
        var e, f, g = c.defer(), h = angular.copy(n.simpleRouteConfig);
        return angular.extend(h.params, n.transformParams(b)), h.timeout = g.promise, f = a(h), 
        d(g.resolve, m), f.abort = function() {
            h.cancelled = !0, g.resolve();
        }, e = Date.now(), {
            success: f.then(function(a) {
                var b = Date.now() - e;
                return b > m ? !1 : a;
            }),
            cancel: g
        };
    }, n.matrixRoute = function(b, e, f) {
        var g, h = c.defer(), i = angular.copy(n.matrixRouteConfig);
        return angular.extend(i.params, n.transformParams(f)), angular.extend(i.params, n.buildMatrixRouteParameters(b, e)), 
        i.timeout = h.promise, g = a(i), d(h.resolve, l), g.abort = function() {
            i.cancelled = !0, h.resolve();
        }, h.promise.then(function() {
            i.cancelled = !0;
        }), g.then(function(a) {
            return a.status < 300 ? a.data.response.matrixEntry : !1;
        });
    }, n.pointToString = function(a) {
        if (a.length && 2 === a.length) return a.join(",");
        if (void 0 !== a.lat || void 0 !== a.latitude) {
            var b = void 0 !== a.lat ? a.lat : a.latitude, c = void 0 !== a.lng ? a.lng : a.longitude;
            return "" + b + "," + c;
        }
    }, n.buildMatrixRouteParameters = function(a, b) {
        var c = {};
        return a.forEach(function(a, b) {
            c["start" + b] = n.pointToString(a);
        }), b.forEach(function(a, b) {
            c["destination" + b] = n.pointToString(a);
        }), c;
    }, n.transformResponse = function(a) {
        if (a && a.response && a.response.route) {
            var b = a.response.route, c = a.response.sourceAttribution;
            return b.forEach(function(a) {
                a.boundingBox = p.Rect.coverPoints([ g.mapUtils.makePoint(a.boundingBox.topLeft), g.mapUtils.makePoint(a.boundingBox.bottomRight) ]), 
                a.waypoint.forEach(function(a) {
                    a.mappedPosition = g.mapUtils.makePoint(a.mappedPosition), a.originalPosition = g.mapUtils.makePoint(a.originalPosition);
                }), a.leg.forEach(function(a) {
                    a.maneuver.forEach(function(a) {
                        a.position = j.makePoint(a.position), a.time && (a.time = a.time.replace(/[+-]\d\d:\d\d$/, ""), 
                        a.time = Date.create(a.time.replace("Z", "")));
                    });
                }), a.publicTransportLine && n._makeColorsReadable(a.publicTransportLine), q && (a.summary.trafficTime = a.summary.baseTime), 
                c && (a.publicTransportAttribution = c);
            }), b.sort(function(a, b) {
                return a.summary.trafficTime ? a.summary.trafficTime - b.summary.trafficTime : a.summary.baseTime - b.summary.baseTime;
            }), b;
        }
        throw a ? a : this.cancelled ? {
            cancelled: !0,
            message: "Route request was cancelled"
        } : new Error("Something wrong about the request");
    }, n._makeColorsReadable = function(a) {
        var b = .75, c = .1, d = function(a, b, c) {
            var d = 2;
            a[1] === b ? d = 1 : a[0] === b && (d = 0), a[d] = Math.round(a[d] * c);
        };
        a.forEach(function(a) {
            if (a.lineForeground) {
                var e = a.lineForeground, f = k.cssColorToNumbers(e), g = k.getColorBrightness(f), h = Math.max.apply(Math, f), i = Math.min.apply(Math, f);
                g > 200 && (d(f, h, b), d(f, i, c), a.lineForeground = k.numbersToCssColor(f), a.lineForeground = a.lineForeground.replace("#bf13cb", "#FFC0CB"), 
                a.lineBackground = a.lineForeground);
            }
        });
    }, n.transformDate = function(a) {
        var b = angular.copy(a);
        return b.setTime(b.getTime() - 60 * b.getTimezoneOffset() * 1e3), b.setMilliseconds(0), 
        b.toISOString().replace(/\.0+/g, "").replace("Z", "");
    }, n.transformParams = function(a) {
        var b = a.waypoints;
        if (b && (b.forEach(function(b, c) {
            var d = "geo!";
            b.via && (d += "passThrough!"), a["waypoint" + c] = d + b.lat + "," + b.lng;
        }), delete a.waypoints), b && b.length > 2 && delete a.alternatives, "metric" in a ? (a.metricSystem = a.metric ? "metric" : "imperial", 
        delete a.metric) : a.metricSystem = "kilometers" === i.getUnits().distance ? "metric" : "imperial", 
        e.imperialUSUK && (a.metricSystem = "metric" === i.getUnits().distanceSystemUnit ? "metric" : "imperial"), 
        a.language || (a.language = h.locale.tagUnderscore), angular.isObject(a.mode)) {
            var c = [], d = a.mode, f = d.transportModes || [ "car" ];
            b && b.length > 2 && (f = f.map(function(a) {
                return "publicTransportTimeTable" === a ? "publicTransport" : a;
            })), c.push(d.type ? d.type : "fastest"), c.push(f.join()), c.push(d.trafficMode ? "traffic:" + d.trafficMode : "traffic:disabled"), 
            c.push(d.routeOptions ? d.routeOptions : ""), a.mode = c.join(";");
        } else void 0 === a.mode && (a.mode = "fastest;car;traffic:disabled;");
        return a.departureDate && (a.departure = n.transformDate(a.departureDate), delete a.departureDate), 
        a.arrivalDate && (a.arrival = n.transformDate(a.arrivalDate), delete a.arrivalDate), 
        "" === a.avoidTransportTypes && delete a.avoidTransportTypes, a;
    }, n.getRoughDistance = function(a) {
        return a.reduce(function(a, b, c, d) {
            return c > 0 && (a += b.distance(d[c - 1])), a;
        }, 0);
    }, n;
} ]), angular.module("hereApp.service").factory("sendToCar", [ "$http", "Features", function(a, b) {
    var c = {}, d = "/api/sendToCar/";
    return b.mocks && (d = "/mocks/api/sendToCar/"), c.isContextRoute = !1, c._transformManufacturers = function(a) {
        var b = a.data.providers, d = {};
        return b.forEach(function(a) {
            var b = a.configuration, e = b && b.accessRestrictions, f = e && e.authenticationRequired, g = b && b.supportedPayloadTypes, h = g ? g.place : !0, i = g ? g.route : !1;
            (h && !f && !c.isContextRoute || i && !f && c.isContextRoute) && (d[a.id] = a.name);
        }), d;
    }, c.getManufacturers = function(b) {
        return c.isContextRoute = !!b, a({
            method: "GET",
            url: d + "providers",
            responseType: "json",
            transformResponse: function(a) {
                return angular.isString(a) ? JSON.parse(a) : a;
            },
            cache: !0
        }).then(c._transformManufacturers);
    }, c.sendToCar = function(b, c, e) {
        return a({
            method: "POST",
            url: d + "message",
            data: {
                manufacturer: b,
                carId: c,
                placeId: e.placeId,
                placeName: e.name,
                placeIcon: e.icon,
                placeLocation: JSON.stringify({
                    position: [ e.location.position.lat, e.location.position.lng ],
                    address: e.location.address
                })
            }
        });
    }, c.sendRouteToCar = function(b, c, e) {
        return a({
            method: "POST",
            url: d + "route",
            data: {
                manufacturer: b,
                carId: c,
                context: e
            }
        });
    }, c;
} ]), angular.module("hereApp.service").factory("skyScannerService", [ "$q", "$http", "User", "geoCoder", "Config", "PBAPI", "ipCookie", "SessionStorageService", "$filter", "$timeout", function(a, b, c, d, e, f, g, h, i, j) {
    function k(a, c) {
        var d = [ e.skyScanner.baseUrl + e.skyScanner.autoSuggestPath ], f = g(e.skyScanner.cookieName);
        d.push(o), d.push(c.Code), d.push(n.tag);
        var h = d.join("/"), i = {
            method: "JSONP",
            url: h,
            params: {
                query: a,
                apikey: f,
                callback: "JSON_CALLBACK"
            },
            headers: {
                Accept: "application/json"
            },
            cache: !0,
            responseType: "json"
        };
        return b(i);
    }
    function l(d, f, g, h) {
        var i = [ e.skyScanner.baseUrl + e.skyScanner.browseQuotesPath ], j = f[0], k = f[1].places.Places[0], l = f[2].places.Places[0], m = q(g), o = a.defer(), p = o.promise;
        i.push(k.CountryId), i.push(j.Code), i.push(n.tag), i.push(k.CityId ? k.CityId : k.CountryId), 
        i.push(l.CityId ? l.CityId : l.CountryId), i.push(m[0]), i.push(m[1]);
        var r = i.join("/"), s = {
            method: "JSONP",
            url: r,
            params: {
                apikey: d,
                callback: "JSON_CALLBACK"
            },
            headers: {
                Accept: "application/json",
                "X-Forwarded-For": c.getUserIPAddress()
            },
            cache: !0,
            responseType: "json",
            timeout: p
        }, t = b(s).then(function(a) {
            h.resolve(a.data);
        });
        return b(s).error(h.resolve), t.abort = function() {
            o.reject();
        }, t;
    }
    var m = {}, n = c.locale, o = n.country.toUpperCase(), p = {
        CM: "XAF",
        CF: "XAF",
        TD: "XAF",
        GQ: "XAF",
        GA: "XAF",
        BJ: "XOF",
        BF: "XOF",
        CI: "XOF",
        GW: "XOF",
        ML: "XOF",
        NE: "XOF",
        SN: "XOF",
        TG: "XOF",
        PF: "CFP",
        NC: "CFP",
        WF: "CFP"
    }, q = function(a) {
        var b = a && a.startDate || new Date(), c = a && a.endDate || new Date(), d = "yyyy-MM-dd", e = i("date")(b, d), f = i("date")(c, d);
        return [ e, f ];
    }, r = 1e3, s = 1;
    m.getSkyScannerToken = function() {
        var c = {
            method: "GET",
            url: e.skyScanner.tokenUrl,
            responseType: "json"
        }, d = e.skyScanner, f = a.defer(), h = g(d.cookieName);
        return h ? f.resolve(h) : b(c).then(function(a) {
            a.data && (g(d.cookieName, a.data.token, {
                path: d.cookiePath,
                expires: d.cookieExpiryInMinutes,
                expirationUnit: "minutes",
                domain: d.cookieDomain
            }), f.resolve(a.data.token));
        }), f.promise;
    }, m.resolveWaypoint = function(b) {
        if (g(e.skyScanner.cookieName)) {
            var c = a.defer();
            return "airport" === b.category ? a.all([ f.search({
                size: 1,
                q: b.lastQuery,
                center: b.mapCoordinate
            }), m.currencies() ]).then(function(a) {
                if (a[0] && a[0].data && a[1]) {
                    var d = a[0].data.items[0], e = a[1], f = d.title, g = f.indexOf("(", f.length - 6);
                    g > -1 && (f = f.substring(g + 1, f.length - 1)), k(f, e).then(function(a) {
                        var d = {
                            places: a.data,
                            address: b.model.location.address
                        };
                        c.resolve(d);
                    });
                }
            }) : a.all([ d.reverseGeoCode({
                location: b.mapCoordinate ? b.mapCoordinate : b
            }), m.currencies() ]).then(function(a) {
                if (a[0] && a[0].data && a[1]) {
                    var b = a[0].data, d = a[1], e = b.address, f = e.city ? e.city : e.country;
                    k(f, d).then(function(a) {
                        var b = {
                            places: a.data,
                            address: e
                        };
                        c.resolve(b);
                    });
                }
            }), c.promise;
        }
    }, m.browseQuotes = function(b, c) {
        var d, e = a.defer(), f = m.getSkyScannerToken().then(function(f) {
            return a.all([ m.currencies(), m.resolveWaypoint(b[0]), m.resolveWaypoint(b[b.length - 1]) ]).then(function(a) {
                return a[0] && a[1] && a[2] && 0 !== a[1].places.Places.length && 0 !== a[2].places.Places.length ? d = l(f, a, c, e) : void 0;
            });
        });
        return e.promise.abort = function() {
            e.reject(), d && d.abort();
        }, f.then(e.resolve, e.reject), e.promise;
    };
    var t = function(a, b, c) {
        c.Segments.forEach(function(d) {
            d.Id === a && (d.ArrivalDateTime = Date.create(d.ArrivalDateTime), d.DepartureDateTime = Date.create(d.DepartureDateTime)), 
            c.Places.forEach(function(a) {
                a.Id === d.OriginStation ? d.OriginStation = a : a.Id === d.DestinationStation && (d.DestinationStation = a);
            }), b.segments.push(d);
        });
    }, u = function(a, b) {
        var c = [];
        return a.OperatingCarriers.forEach(function(a) {
            b.Carriers.forEach(function(b) {
                b.Id === a && c.push(b);
            });
        }), c;
    }, v = function(a, b) {
        var c = [];
        return a.Stops.forEach(function(a) {
            b.Places.forEach(function(b) {
                b.Id === a && c.push(b);
            });
        }), c;
    };
    return m.livePriceResponseTransform = function(a) {
        var b = angular.copy(a), c = [];
        return b.Itineraries.forEach(function(a) {
            var d = {
                price: a.PricingOptions[0].Price,
                deepLink: a.PricingOptions[0].DeeplinkUrl
            }, e = a.OutboundLegId, f = a.InboundLegId;
            b.Legs.forEach(function(a) {
                a.Id === e ? d.outboundLeg = a : a.Id === f && (d.inboundLeg = a);
            }), d.outboundLeg.segments = [], d.inboundLeg.segments = [], d.outboundLeg.SegmentIds.forEach(function(a) {
                t(a, d.outboundLeg, b);
            }), d.inboundLeg.SegmentIds.forEach(function(a) {
                t(a, d.inboundLeg, b);
            }), d.outboundLeg.OperatingCarriers = u(d.outboundLeg, b), d.inboundLeg.OperatingCarriers = u(d.inboundLeg, b), 
            d.outboundLeg.Stops.length > 0 && (d.outboundLeg.Stops = v(d.outboundLeg, b)), d.inboundLeg.Stops.length > 0 && (d.inboundLeg.Stops = v(d.inboundLeg, b)), 
            d.outboundLeg.Duration = 60 * d.outboundLeg.Duration, d.inboundLeg.Duration = 60 * d.inboundLeg.Duration, 
            c.push(d);
        }), {
            flights: c,
            Status: a.Status,
            location: a.location
        };
    }, m.pollForLivePrices = function(a, c) {
        j(function() {
            var d = {
                method: "GET",
                url: e.skyScanner.proxyPoll,
                params: {
                    url: a
                },
                headers: {
                    Accept: "application/json"
                },
                cache: !0,
                responseType: "json",
                transformResponse: m.livePriceResponseTransform
            };
            return b(d).then(function(a) {
                var b = a.data;
                "UpdatesComplete" === b.Status || 10 === s ? c.resolve(b) : (c.notify(b), s += 1, 
                m.pollForLivePrices(b.location, c));
            });
        }, 4 > s ? r : 3 * r);
    }, m.livePrices = function(c, d) {
        var f = e.skyScanner.baseUrl + e.skyScanner.livePricesPath, g = a.defer();
        return m.getSkyScannerToken().then(function(h) {
            return a.all([ m.currencies(), m.resolveWaypoint(c[0]), m.resolveWaypoint(c[c.length - 1]) ]).then(function(a) {
                if (a[0] && a[1] && a[1].places.Places.length && a[2] && a[2].places.Places.length) {
                    var c = a[0], i = a[1].places.Places[0], j = a[2].places.Places[0], k = {
                        method: "POST",
                        url: e.skyScanner.proxyPost,
                        data: {
                            url: f,
                            apikey: h,
                            country: i.CountryId,
                            currency: c.Code,
                            locale: n.tag,
                            locationschema: "Sky",
                            originplace: i.CityId,
                            destinationplace: j.CityId,
                            outbounddate: d.startDate.format("{yyyy}-{MM}-{dd}"),
                            inbounddate: d.endDate.format("{yyyy}-{MM}-{dd}"),
                            adults: 1,
                            stops: 1
                        },
                        cache: !0,
                        responseType: "json",
                        transformResponse: m.livePriceResponseTransform
                    };
                    b(k).then(function(a) {
                        var b = a.data;
                        "UpdatesComplete" === b.Status ? g.resolve(b.flights) : (g.notify(b.flights), s = 1, 
                        m.pollForLivePrices(b.location, g));
                    });
                }
            });
        }), g.promise;
    }, m.currencies = function() {
        var c = a.defer(), d = h.getValue("currencies"), f = function(a) {
            var b, c = p[o];
            return a.some(function(a) {
                return 0 === a.Code.indexOf(o) || 0 === a.Code.indexOf(c) ? (b = a, !0) : void 0;
            }), b || a.some(function(a) {
                return "EUR" === a.Code ? (b = a, !0) : void 0;
            }), b;
        };
        if (d) d = JSON.parse(d), c.resolve(f(d)); else {
            var g = {
                method: "GET",
                url: e.skyScanner.currenciesUrl,
                cache: !0,
                responseType: "json"
            };
            b(g).then(function(a) {
                h.setValue("currencies", JSON.stringify(a.data.Currencies)), d = a.data.Currencies, 
                c.resolve(f(d));
            });
        }
        return c.promise;
    }, m;
} ]), angular.module("hereApp.service").factory("splitTesting", [ "$http", "Features", function(a, b) {
    var c = {}, d = {}, e = {};
    return c.start = function(c) {
        d[c] = !0, b.splitTesting && a({
            method: "post",
            url: "/api/splitTesting/start",
            data: {
                testName: c
            }
        });
    }, c.conversion = function(c) {
        e[c] = !0, b.splitTesting && a({
            method: "post",
            url: "/api/splitTesting/conversion",
            data: {
                testName: c
            }
        });
    }, c.NPS = function(c) {
        b.splitTesting && a({
            method: "post",
            url: "/api/splitTesting/nps",
            data: c
        });
    }, c.hasStarted = function(a) {
        return !!d[a];
    }, c.hasConverted = function(a) {
        return !!e[a];
    }, c;
} ]), angular.module("hereApp.service").factory("streetLevel", [ "$window", "$location", "$q", "$timeout", "$rootScope", "mapsjs", "Config", "mapUtils", "lazy", function(a, b, c, d, e, f, g, h, i) {
    var j, k = {
        _previousMapState: void 0
    }, l = c.defer(), m = !1, n = !1, o = !1, p = a.document.body;
    return k.map = {}, k.isReady = l.promise, k.enterStreetLevel = function() {
        var a = l.promise;
        return a.then(function() {
            return k._previousMapState = {
                center: j.getCenter(),
                zoom: j.getZoom()
            }, j.setEngineType(f.Map.EngineType.PANORAMA), n = !0, k._getPromisedTransitionEnd();
        });
    }, k.exitStreetLevel = function() {
        j.addEventListener("mapviewchangeend", function a() {
            n = !1, j.removeEventListener("mapviewchangeend", a);
        }), j.setEngineType(f.Map.EngineType.P2D), j.setCenter(k._previousMapState.center), 
        j.setZoom(k._previousMapState.zoom);
    }, k.initializeStreetLevel = function() {
        m = !0, h.service.configure(f.map.render.panorama.RenderEngine), l.resolve(k.map), 
        k._useSpecialCursors(k.map);
    }, k.loadStreetLevel = function(b) {
        return k.map = b, j = b, o || m || (o = !0, i.loadJS(a.here.lazy.sli, k.initializeStreetLevel)), 
        k.isReady;
    }, k.isStreetLevelActive = function() {
        return n;
    }, k.isStreetLevelLoaded = function() {
        return m;
    }, k.showReportImageForm = function() {
        e.$broadcast("popover", {
            templateUrl: "features/reportImage/reportImage.html"
        });
    }, k.lookAt = function(a, b, c) {
        var d = j.getViewModel(), e = d.getCameraData();
        e.yaw = b, e.pitch = a, e.animate = c, d.setCameraData(e);
    }, k._useSpecialCursors = function(a) {
        function b() {
            d.add("mousedown");
        }
        function c() {
            d.remove("mousedown");
        }
        var d = p.classList;
        a.addEventListener("enginechange", function(d) {
            d.newValue === f.Map.EngineType.PANORAMA ? (a.addEventListener("pointerdown", b), 
            a.addEventListener("pointerup", c)) : (a.removeEventListener("pointerdown", b), 
            a.removeEventListener("pointerup", c));
        });
    }, k._getPromisedTransitionEnd = function() {
        var a = c.defer();
        return j.addEventListener("enginechange", function b() {
            a.resolve(j), j.removeEventListener("enginechange", b);
        }), d(function() {
            a.resolve(j);
        }, 8e3), a.promise;
    }, k;
} ]), angular.module("hereApp.service").factory("supportedFormInputs", [ "$document", function(a) {
    var b = a[0].createElement("input"), c = [ "search", "email", "url", "tel", "number", "range", "date", "month", "week", "time", "datetime", "datetime-local", "color" ], d = {};
    return c.forEach(function(a) {
        b.setAttribute("type", a), d[a] = "text" !== b.type;
    }), d;
} ]), angular.module("hereApp.service").config([ "$httpProvider", function(a) {
    a.interceptors.push([ "trackingIDService", function(a) {
        return {
            request: function(b) {
                return a.extendURLParamsWithTracking(b.url, b.method, b.params), b;
            }
        };
    } ]);
} ]), angular.module("hereApp.service").factory("trackingIDService", [ "$window", "Features", "utilityService", function(a, b, c) {
    var d = {
        extendURLParamsWithTracking: function(a, c, e) {
            var f = /^(http|\/\/)/;
            if (e = e || {}, b.APITrackingID && f.test(a) && ("GET" === c || "JSONP" === c) && !e.noAPITrackingID) {
                var g = d._getParam();
                angular.extend(e, g);
            }
            e && e.noAPITrackingID && delete e.noAPITrackingID;
        },
        _isFromFacebook: function() {
            return a.here && a.here.externalPartners && "facebook" === a.here.externalPartners.eVar58;
        },
        _getParam: function() {
            var a = c.generateUUID(), b = d._isFromFacebook() ? "FB-" : "";
            return {
                "X-NLP-TID": b + a
            };
        }
    };
    return d;
} ]), angular.module("hereApp.service").factory("trafficFlow", [ "$http", "$q", "PBAPI", "Config", "User", "trafficIncidents", "unitsStorage", function(a, b, c, d, e, f, g) {
    var h = {}, i = {
        app_id: d.appId,
        app_code: d.appCode,
        jsoncallback: "JSON_CALLBACK",
        i18n: !0,
        lg: e.locale.language
    };
    return h._transformResponse = function(a) {
        var b = [], c = a.data.RWS, d = a.data.UNITS, e = a.data.CREATED_TIMESTAMP;
        if (c) return c.forEach(function(a) {
            "TMC" === a.TY && a.RW.forEach(function(a) {
                a.FIS.forEach(function(c) {
                    c.FI.forEach(function(c) {
                        c.CF.forEach(function(f) {
                            f.JF >= 4 && b.push({
                                roadName: a.DE || c.TMC.DE,
                                roadEnd: c.TMC.DE,
                                roadTMC: c.TMC.PC,
                                roadDirection: c.TMC.QD,
                                roadLength: Math.round(100 * c.TMC.LE) / 100,
                                jamFactor: Math.floor(f.JF),
                                trafficSpeed: f.SP,
                                speedFreeFlow: f.FF,
                                shapeData: c.SHP,
                                units: d,
                                timestamp: e,
                                delay: Math.ceil(60 * (c.TMC.LE / f.SP - c.TMC.LE / f.FF))
                            });
                        });
                    });
                });
            });
        }), b;
    }, h.getDataForCorridor = function(b) {
        var c = angular.extend({
            corridor: f._getCorridorForShape(b.shape),
            minjamfactor: 7,
            responseattributes: "simplifiedShape",
            maxfunctionalclass: 5
        }, i);
        return a({
            method: "JSONP",
            url: d.traffic.url + "flow.json",
            params: c
        }).then(h._transformResponse, function() {
            return "error";
        });
    }, h.getDataForMap = function(b) {
        var c = b.getViewBounds(), e = b.getZoom(), f = angular.extend({
            bbox: c.getTopLeft().lat + "," + c.getTopLeft().lng + ";" + c.getBottomRight().lat + "," + c.getBottomRight().lng,
            minjamfactor: 12 > e ? 7 : 4,
            responseattributes: "simplifiedShape",
            maxfunctionalclass: 10 > e ? 1 : 2,
            units: "kilometers" === g.getUnits().distance ? "metric" : "imperial"
        }, i);
        return a({
            method: "JSONP",
            url: d.traffic.url + "flow.json",
            params: f
        }).then(h._transformResponse, function() {
            return "error";
        });
    }, h.checkCoverage = function(c) {
        var e = b.defer(), f = c.getViewBounds(), g = c.getZoom(), h = angular.extend({
            mapview: f.getTopLeft().lat + "," + f.getTopLeft().lng + ";" + f.getBottomRight().lat + "," + f.getBottomRight().lng,
            zoom: Math.floor(g)
        }, i);
        return a({
            method: "JSONP",
            url: d.traffic.url + "flowavailability.json",
            params: h
        }).then(function(a) {
            a.data && a.data.Response && a.data.Response.Region ? e.resolve("covered") : e.reject("nocoverage");
        }, function() {
            e.reject("error");
        }), e.promise;
    }, h.getInitialTrafficLocation = function(a) {
        var d = b.defer();
        if (a.trafficCountry && a.trafficCity) {
            var e = {
                size: 1,
                q: a.trafficCity + "," + a.trafficCountry
            };
            "usa" === a.trafficCountry.toLowerCase() ? e.viewBounds = "-124.6746,25.1966,-70.6704,48.9816" : e.center = {
                lat: 0,
                lng: 0
            }, c.search(e).then(function(a) {
                var b = a.data.items[0];
                d.resolve(b ? {
                    lat: b.position.lat,
                    lng: b.position.lng,
                    zoom: -1 !== b.vicinity.indexOf("USA") ? 9 : 11,
                    type: b.category.id
                } : {
                    type: "NOT-city-town-village"
                });
            }, function() {
                d.reject();
            });
        } else d.resolve(null);
        return d.promise;
    }, h;
} ]), angular.module("hereApp.service").factory("trafficIncidents", [ "$http", "Config", "User", "mapsjs", function(a, b, c, d) {
    var e = {
        _MAX_CORRIDOR_LENGTH: 5500
    }, f = {
        app_id: b.appId,
        app_code: b.appCode,
        jsoncallback: "JSON_CALLBACK",
        i18n: !0,
        lg: c.locale.language,
        localtime: !0
    };
    return e._getShapePoints = function(a) {
        var b, c = [], d = a.length;
        for (b = 0; d > b; b += 2) c.push([ a[b], a[b + 1] ]);
        return c;
    }, e._findPerpendicularDistance = function(a, b, c) {
        var d, e, f = a[0], g = a[1], h = b[0], i = b[1], j = c[0], k = c[1];
        return h === j ? Math.abs(f - h) : (d = (k - i) / (j - h), e = i - d * h, Math.abs(d * f - g + e) / Math.sqrt(Math.pow(d, 2) + 1));
    }, e._simplifyShape = function(a, b) {
        var c, d, f, g, h, i, j, k = a[0], l = a[a.length - 1], m = -1, n = 0;
        if (a.length < 3) return a;
        for (c = 1, d = a.length; d - 1 > c; c++) f = e._findPerpendicularDistance(a[c], k, l), 
        f > n && (n = f, m = c);
        return n > b ? (g = a.slice(0, m + 1), h = a.slice(m), i = e._simplifyShape(g, b), 
        j = e._simplifyShape(h, b), i.slice(0, i.length - 1).concat(j)) : [ k, l ];
    }, e._getCorridorForShape = function(a, b) {
        function c(a) {
            return a.toFixed(4).replace(/\.?0+$/, "");
        }
        function d(a) {
            return c(a[0]) + "," + c(a[1]);
        }
        var f, g = e._getShapePoints(a), h = 3e-4, i = "";
        do f = e._simplifyShape(g, h), i = f.map(d).join(";") + ";;" + (b || 0 === b ? b : "50"), 
        h *= 2; while (i.length > e._MAX_CORRIDOR_LENGTH);
        return i;
    }, e._parseDateTime = function(a) {
        var b = a.match(/^(\d\d)\/(\d\d)\/(\d\d\d\d) (\d\d):(\d\d):(\d\d)/);
        return new Date(b[3], parseInt(b[1], 10) - 1, b[2], b[4], b[5], b[6]);
    }, e._transformResponse = function(a) {
        var b = a.data.TRAFFIC_ITEMS;
        if (b) return b = b.TRAFFIC_ITEM, b.forEach(function(a) {
            var b = a.LOCATION.GEOLOC, c = b.ORIGIN;
            b.ORIGIN = new d.geo.Point(c.LATITUDE, c.LONGITUDE), a.START_TIME = e._parseDateTime(a.START_TIME), 
            a.END_TIME = e._parseDateTime(a.END_TIME);
        }), b;
    }, e.getIncidentsForMap = function(c) {
        var d = c.getViewBounds(), g = angular.extend({
            bbox: d.getTop() + "," + d.getLeft() + ";" + d.getBottom() + "," + d.getRight()
        }, f);
        return a({
            method: "JSONP",
            url: b.traffic.url + "incidents.json",
            params: g
        }).then(e._transformResponse);
    }, e.getIncidentsForShape = function(c, d) {
        var g = angular.extend({
            corridor: e._getCorridorForShape(c, d)
        }, f);
        return a({
            method: "JSONP",
            url: b.traffic.url + "incidents.json",
            params: g
        }).then(e._transformResponse);
    }, e;
} ]), angular.module("hereApp.service").factory("unitsStorage", [ "$window", "$rootScope", "Features", function(a, b, c) {
    var d, e = {}, f = "HERE_UNITS", g = {
        distance: "kilometers",
        distanceSystemUnit: "metric",
        temperature: "celsius"
    }, h = {
        distance: "miles",
        distanceSystemUnit: "imperialUS",
        temperature: "fahrenheit"
    }, i = {
        distance: "miles",
        distanceSystemUnit: "imperialGB",
        temperature: "celsius"
    }, j = {
        distance: "miles",
        distanceSystemUnit: "imperialUS",
        temperature: "fahrenheit"
    };
    return e.getUnits = function() {
        var b = a.here.user.locale.tag;
        try {
            d = JSON.parse(a.localStorage.getItem(f));
        } catch (e) {}
        if (!d || !d.distanceSystemUnit) if (c.imperialUSUK) switch (b) {
          case "en-us":
            d = j;
            break;

          case "en-gb":
            d = i;
            break;

          default:
            d = g;
        } else d = angular.copy("en-us" !== b ? g : h);
        return angular.copy(d);
    }, e._saveUnits = function(b) {
        try {
            a.localStorage.setItem(f, JSON.stringify(b));
        } catch (c) {}
    }, e.saveDistanceUnit = function(a) {
        var c = e.getUnits();
        c.distance = a, e._saveUnits(c), b.distanceUnit = a;
    }, e.saveDistanceSystemUnit = function(a) {
        var c = e.getUnits();
        c.distanceSystemUnit = a, e._saveUnits(c), b.distanceSystemUnit = a;
    }, e.saveTemperatureUnit = function(a) {
        var c = e.getUnits();
        c.temperature = a, e._saveUnits(c), b.temperatureUnit = a;
    }, e.initialize = function() {
        var a = e.getUnits();
        b.distanceUnit = a.distance, b.distanceSystemUnit = a.distanceSystemUnit, b.temperatureUnit = a.temperature;
    }, e;
} ]), angular.module("hereApp.service").factory("utilityService", [ "$window", "$timeout", "$location", "wheelEvent", "mapsjs", "Config", function(a, b, c, d, e, f) {
    var g = a.parseInt, h = a.parseFloat, i = a.isNaN, j = Math.round, k = Math.pow, l = null;
    return {
        getTransformPositionsForElement: function(b) {
            var c, d, e = a.getComputedStyle(b, null), f = e.getPropertyValue("transform") || e.getPropertyValue("-moz-transform") || e.getPropertyValue("-webkit-transform") || e.getPropertyValue("-ms-transform") || e.getPropertyValue("-o-transform"), h = f.split(",");
            return c = g(h[4], 10), d = g(h[5], 10), {
                x: c,
                y: d
            };
        },
        replaceSpecialChars: function(a, b) {
            return a ? (b = b || "-", a.replace(/[\?\(\)\[\]\{\}=%&'":\*#\u0300\u0301\u0302\u0303\u0308\u002f]+/gi, "").replace(/[\s\$\\\+\-]+/gi, b)) : "";
        },
        removeDiacritics: function(a) {
            if (!a) return "";
            var b = {
                a: /[ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/gi,
                aa: /[ꜳ]/gi,
                ae: /[æǽǣ]/gi,
                ao: /[ꜵ]/gi,
                au: /[ꜷ]/gi,
                av: /[ꜹꜻ]/gi,
                ay: /[ꜽ]/gi,
                b: /[ⓑｂḃḅḇƀƃɓ]/gi,
                c: /[ⓒｃćĉċčçḉƈȼꜿↄ]/gi,
                d: /[ⓓｄḋďḍḑḓḏđƌɖɗꝺ]/gi,
                dz: /[ǳǆ]/gi,
                e: /[ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/gi,
                f: /[ⓕｆḟƒꝼ]/gi,
                g: /[ⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/gi,
                h: /[ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/gi,
                hv: /[ƕ]/gi,
                i: /[ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı]/gi,
                j: /[ⓙｊĵǰɉ]/gi,
                k: /[ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/gi,
                l: /[ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ]/gi,
                lj: /[ǉ]/gi,
                m: /[ⓜｍḿṁṃɱɯ]/gi,
                n: /[ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/gi,
                nj: /[ǌ]/gi,
                o: /[ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ]/gi,
                oi: /[ƣ]/gi,
                oo: /[ꝏ]/gi,
                ou: /[ȣ]/gi,
                p: /[ⓟｐṕṗƥᵽꝑꝓꝕ]/gi,
                q: /[ⓠｑɋꝗꝙ]/gi,
                r: /[ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/gi,
                s: /[ⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ]/gi,
                t: /[ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/gi,
                tz: /[ꜩ]/gi,
                u: /[ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/gi,
                v: /[ⓥｖṽṿʋꝟʌ]/gi,
                vy: /[ꝡ]/gi,
                w: /[ⓦｗẁẃŵẇẅẘẉⱳ]/gi,
                x: /[ⓧｘẋẍ]/gi,
                y: /[ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/gi,
                z: /[ⓩｚźẑżžẓẕƶȥɀⱬꝣ]/gi
            };
            for (var c in b) b.hasOwnProperty(c) && (a = a.replace(b[c], c));
            return a;
        },
        escapeTags: function(a) {
            return a ? a.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
        },
        unescapeTags: function(a) {
            return a ? a.replace(/&lt;/g, "<").replace(/&gt;/g, ">") : "";
        },
        debounce: function(a, c, d) {
            var e;
            return function() {
                function f() {
                    d || a.apply(g, h), e = null;
                }
                var g = this, h = arguments;
                e ? b.cancel(e) : d && a.apply(g, h), e = b(f, c || 100);
            };
        },
        convertMapInfoToQueryFormat: function(a) {
            return a && void 0 !== a.latitude && void 0 !== a.longitude && void 0 !== a.zoomLevel ? [ h(a.latitude.toFixed(5)), h(a.longitude.toFixed(5)), g(a.zoomLevel, 10), a.type ].join(",") : "";
        },
        getProperQueryMapModeName: function(a) {
            switch (a = (a || "").toLowerCase()) {
              case "normal":
              case "terrain":
              case "traffic":
              case "public_transport":
              case "pedestrian":
              case "gray":
              case "satellite":
              case "satellite_traffic":
              case "satellite_public_transport":
                break;

              case "public transit map.day":
                a = "public_transport";
                break;

              case "terrain.day":
                a = "terrain";
                break;

              case "traffic map.day":
              case "traffic.day":
                a = "traffic";
                break;

              case "hybrid.day":
              case "3d.day":
              case "satellite.day":
                a = "satellite";
                break;

              default:
                a = e.mapUtils.getDesiredMapName(c.path()) || "normal";
            }
            return a;
        },
        convertQueryFormatToMapInfo: function(a) {
            var b = (a || "").split(",");
            return b.length < 2 ? null : {
                latitude: h(b[0]),
                longitude: h(b[1]),
                zoomLevel: b.length > 2 ? g(b[2], 10) : 10,
                mapType: this.getProperQueryMapModeName(b[3])
            };
        },
        roundCoordinate: function(a, b) {
            if (this.isObjectEmpty(a) || i(b)) return a;
            var c = a.lat || a.latitude, d = a.lng || a.longitude, e = c ? h(c.toFixed(b)) : 0, f = d ? h(d.toFixed(b)) : 0;
            return {
                lat: e,
                lng: f,
                latitude: e,
                longitude: f
            };
        },
        isObjectEmpty: function(a) {
            var b = Object.prototype.hasOwnProperty;
            if (null === a || void 0 === a) return !0;
            if (a.length > 0) return !1;
            if (0 === a.length) return !0;
            for (var c in a) if (b.call(a, c)) return !1;
            return !0;
        },
        validation: {
            emailPattern: /\b[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\b/,
            passwordPattern: /^.{6,}$/,
            dateOfBirth: /\d{1,2}\/\d{1,2}\/\d{4}/g
        },
        hasParentWithClass: function(a, b) {
            var c = a && b ? angular.element(a).parent() : [];
            if (!c.length) return !1;
            var d = angular.element(c);
            return d.hasClass(b) || this.hasParentWithClass(c, b);
        },
        findParentByClass: function m(a, b) {
            return a ? a.classList.contains(b) ? a : m(a.parentNode, b) : null;
        },
        getOffsetTop: function(a) {
            a instanceof angular.element && (a = a[0]);
            for (var b = a.offsetTop; a.parentNode; ) a.parentNode.offsetTop && (b += a.parentNode.offsetTop), 
            a = a.parentNode;
            return b;
        },
        cssColorToNumbers: function(a) {
            return a.match(/^#?(\w\w)(\w\w)(\w\w)/).slice(1).map(function(a) {
                return g(a, 16);
            });
        },
        numbersToCssColor: function(a) {
            return "#" + a.map(function(a) {
                var b = j(a).toString(16);
                return b.length > 1 ? b : "0" + b;
            }).join("");
        },
        getColorBrightness: function(a) {
            return j(Math.sqrt(.241 * k(a[0], 2) + .691 * k(a[1], 2) + .068 * k(a[2], 2)));
        },
        forwardWheelToMap: function(b, c) {
            b.on(d, function(b) {
                var d = c.getViewPort().element, e = new a.MouseEvent(b.type);
                e.initMouseEvent(b.type, !0, !0, b.view, b.detail, b.screenX, b.screenY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, null), 
                e.wheelDelta = b.wheelDelta, e.deltaY = b.deltaY, d.dispatchEvent(e);
            });
        },
        buildAngularUrl: function(a, b) {
            var c = Object.keys(b);
            return c.sort(), b = c.map(function(a) {
                return encodeURIComponent(a) + "=" + encodeURIComponent(b[a]);
            }), a + "?" + b.join("&").replace(/%20/g, "+");
        },
        uniqueStrings: function(a) {
            var b = {};
            return a.forEach(function(a) {
                b[a] = !0;
            }), Object.keys(b);
        },
        setScrollContainer: function(a) {
            l = a;
        },
        scrollContainerToTop: function() {
            l && (l.scrollTop = 0, angular.element(l).triggerHandler("scroll"));
        },
        getDistanceBetweenPositionsInMeters: function(a, b) {
            var c = new e.geo.Point(a.latitude, a.longitude), d = new e.geo.Point(b.latitude, b.longitude);
            return c.distance(d);
        },
        getContentAge: function(a) {
            if (!a) return 0;
            var b = new Date().getTime(), c = new Date(a).getTime(), d = 864e5;
            return Math.round((b - c) / d);
        },
        isContentOld: function(a, b) {
            var c = b || f.oldContentAfterDays;
            return c && !i(c) && a ? this.getContentAge(a) > c : !1;
        },
        arraysBalance: function(a, b) {
            if (!a || a.length < 1 || !b || i(b)) return a;
            var c = a.reduce(function(a, b) {
                return a + b.length;
            }, 0);
            if (b >= c) return a;
            for (var d = angular.copy(a), e = 0, f = a.map(function() {
                return [];
            }); b > e; ) for (var g = 0; g < d.length; g++) if (d[g].length > 0 && b > e) {
                var h = d[g].shift();
                f[g].push(h), e++;
            }
            return f;
        },
        arrayGetLabels: function(a, b) {
            return a && a.map ? a.map(function(a) {
                return a[b] || a.title || a.label;
            }) : a;
        },
        isValidSearchQuery: function(a, b) {
            var c = a && a.trim ? a.trim() : null, d = !!(c && c.replace(/[^ \\\/.,()+='`"\-]/gi, "") !== c && c.length > 0), e = d && (!b || i(b) || c.length >= b);
            return e;
        },
        generateUUID: function() {
            var a = function() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
            };
            return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a();
        }
    };
} ]), angular.module("hereApp.service").factory("weather", [ "$http", "$q", "unitsStorage", function(a, b, c) {
    var d, e, f = "/api/weather", g = {};
    return e = {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0"
    }, d = {
        cache: !0,
        headers: e,
        method: "GET",
        params: {},
        responseType: "json",
        url: f + "/forLocation"
    }, g.get = function(e) {
        var f, g = b.defer(), h = angular.copy(d);
        return h.params.metric = "celsius" === c.getUnits().temperature, angular.extend(h.params, e), 
        h.timeout = g.promise, f = a(h), f.abort = function() {
            h.canceled = !0, g.resolve();
        }, f;
    }, g;
} ]), angular.module("hereApp.service").factory("wheelEvent", [ "$document", function(a) {
    var b = "DOMMouseScroll";
    return "onwheel" in a[0] ? b = "wheel" : void 0 !== a[0].onmousewheel && (b = "mousewheel"), 
    b;
} ]), angular.module("hereApp.templates").run([ "$templateCache", function(a) {
    a.put("directives/account/log-in.html", '<section class=here_login><div class=not_logged data-ng-show=!login.isLoggedIn><button type=button data-here-svg="{ path: \'/directives/menu/sign_in.svg\', color:\'#fff\' }" data-ng-click=logIn() class="btn_simple menu_button">Sign in</button></div><div class=logged data-ng-show=login.isLoggedIn><a class=account_link data-ng-href="{{ login.hereAccountSettingsURL }}" data-here-click-tracker=Menu:HEREaccount:click target=_blank><div class=avatar></div><div class=names data-ng-if=accountLabel>{{ accountLabel }}</div></a></div></section>'), 
    a.put("directives/collections/description-widget.html", '<div data-ng-class="{ ready: state.ready, has_description: refObj.description, edit: state.editDescription }" class=description_container><div class="description box"><div class=quote_icon data-here-svg="{ path: \'/img/quote.svg\', color: \'#00c9ff\' }"></div><button data-ng-click=showEditor() data-here-svg="{ path: \'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor: \'#fff\' }" class="btn btn_light btn_small btn_icon btn_icon_notext btn_edit right">Edit</button><p data-ng-bind=refObj.description class=text></p></div><div class="editor box"><form name=descriptionForm data-ng-submit=addDescription() data-ng-init="LIMIT_DESCRIPTION=250"><div data-show-notification=state.errorDescription data-notification-type=error data-notification-box="">The text wasn\'t saved. Try again.</div><textarea name=description data-ng-model=updateObj.description data-ng-required=hasNoDescription data-ng-maxlength={{LIMIT_DESCRIPTION}} data-here-autofocus=state.editDescription data-ng-attr-placeholder={{placeholder}}></textarea><div class=actions><button data-here-ios-touch-to-click type=submit data-ng-disabled=descriptionForm.$invalid class="btn btn_full btn_small right">Save</button> <button data-here-ios-touch-to-click type=button data-ng-click=hideEditor() class="btn btn_light btn_small right">Not now</button> <span data-ng-hide=descriptionForm.description.$error.maxlength class=char_count>Characters left: {{LIMIT_DESCRIPTION - updateObj.description.length}}</span> <span data-ng-show=descriptionForm.description.$error.maxlength class=error>This can be up to 250 characters long.</span></div></form><div data-ng-show=state.submitted data-here-spinner=small class="spinner blocker centered"></div></div><button data-ng-click=showEditor() class="btn btn_description btn_full btn_delete">+&nbsp;&nbsp;&nbsp;&nbsp;Add description</button></div>'), 
    a.put("directives/collectionsRouteCard/collections-route-card.html", '<div class=route_card><h4 class=title><a data-ng-href={{directionsUrl}}><span data-ng-bind=favorite.name></span></a></h4><div class=item_waypoint><p>From</p><p class=address data-ng-bind=waypoints[0].text></p></div><div class=mode_icon data-ng-if=transportModeIcon data-here-svg="{path: transportModeIcon}" data-width=46 data-height=46></div><div class=item_waypoint><p>To</p><p class=address data-ng-bind=waypoints[waypoints.length-1].text></p></div></div>'), 
    a.put("directives/contextualMenu/contextual-menu.html", '<div id=contextualMenu data-ng-show=menu.isVisible data-ng-style=menu.position><a href="{{ menu.url.pdc }}" class="menu-element indicator header">{{ menu.header }}</a> <a href="{{ menu.url.fromHere }}" class="menu-element start_point" data-ng-mouseover="directionsFromHovered = true; directionsToHovered = false" data-ng-mouseout="directionsFromHovered = false; directionsToHovered = false" data-ng-class="{inactive : directionsToHovered}">Set as destination</a> <a href="{{ menu.url.toHere }}" class="menu-element end_point" data-ng-mouseover="directionsFromHovered = false; directionsToHovered = true" data-ng-mouseout="directionsFromHovered = false; directionsToHovered = false" data-ng-class="{inactive : directionsFromHovered}">Set as starting point</a></div>'), 
    a.put("directives/dateSpanSelector/dateSpanSelector.html", '<div class=selector><div class=preferences_divider></div><div class=container data-ng-class="{expanded: isExpanded}"><button class=date_span_tab data-here-svg="{path:\'/img/pdc/clock.svg\', color:\'#00b4e5\'}" data-ng-class="{active: isExpanded}" data-ng-click="toggleTab(\'timeDate\');" data-here-click-tracker=routing:futureRoute:click><span>{{header}}</span> <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button> <span class=line_cover></span><div class=date_options><div class=options_box><div class=calendars><span class=title>Depart:</span><br><quick-datepicker name=date_start data-ng-model=startDate data-time-format={{timeFormat}} data-date-format={{dateFormat}} date-filter=onlyFutureDates disable-timepicker=true data-on-change="resetDepartNow(timeSelector, routeDate);" required state=closed></quick-datepicker></div><div class="calendars return"><span class=title>Return:</span><br><quick-datepicker name=date_end data-ng-model=endDate data-time-format={{timeFormat}} data-date-format={{dateFormat}} date-filter=onlyFutureDates disable-timepicker=true data-on-change="resetDepartNow(timeSelector, routeDate);" required state=closed></quick-datepicker></div><div style=clear:both><button class="btn btn_full save" data-ng-click="save(routeDate, timeSelector);" data-here-click-tracker=routing:futureRoute:save:click>Save</button> <button class="btn btn_light cancel" data-ng-click=cancel();>Cancel</button></div></div></div></div></div>'), 
    a.put("directives/hereHeader/hereHeader.html", '<header class=new_header data-ng-class="{text_only: !headerImageUrl}"><div data-header-image=headerImageUrl data-use-previous-image=options.smoothImageRotation data-header-attribution=headerAttribution data-header-origin=options.origin class=header_image></div><div data-ng-transclude></div><h1><span data-here-align-headline class=header_headline data-ng-class="{use_available_space: !weather && !hasContextMenu}" data-title={{title}} data-title-container=.header_title><span data-here-category-icon data-ng-if=category data-category={{category}} data-width=22 data-height=22 class=category_icon></span> <span class=header_title itemprop=name></span></span><div data-ng-if=weather class=weather><span data-ng-click=toggleWeatherUnits() here-click-tracker=discover:Temperature:click>{{weather.localConditions.temperature | temperature:temperatureUnit}}&deg;{{temperatureUnit === \'celsius\' ? "C" : "F"}}</span><div data-weather-icon data-icon-name={{weather.localConditions.iconName}} data-daylight={{weather.localConditions.daylight}} class=weather_img></div></div></h1></header>'), 
    a.put("directives/imageAttribution/short.html", '<div ng-transclude=""></div><div data-ng-if=image class=here_image_attribution_short><div class=here_image_attribution_content_wrapper><p class=here_image_attribution_content><img class=here_image_attribution_logo data-ng-src="{{image.supplier.icon | ensureHTTPS}}" data-ng-class="{\'here_image_attribution_logo_alt_background\': image.supplier.id === \'foursquare\'}"> <span data-ng-click=onClick($event) data-ng-bind-html=content data-track-anchor-clicks="{{origin + \':AttributionLink:click\'}}"></span></p></div></div>'), 
    a.put("directives/infoIcon/infoIcon.html", "<div class=info_icon_container><div class=info_icon><span data-ng-include=\"'/directives/infoIcon/icon_info.svg'\"></span></div><div class=info_message_container data-ng-show=infoIcon.showMessage><div class=knife><div></div></div><div class=info_message data-ng-transclude></div></div></div>"), 
    a.put("directives/mapControls/feedbackButton.html", '<span><button id=feedback_trigger class="btn_simple feedback_link" data-ng-class="{light: light}" data-ng-click=showFeedbackForm()><span data-ng-include="\'/img/icons/icon_feedback.svg\'" class=feedback_icon></span> Feedback</button></span>'), 
    a.put("directives/mapControls/location-control.html", '<button class=map_control_location><div class="floating_message error_message"><div>{{ message }}</div></div><span data-ng-include="\'/directives/mapControls/location.svg\'"></span></button>'), 
    a.put("directives/mapControls/map-imprint.html", '<span class=imprint here-expose-services=User data-ng-init=hereMapImprint.initialize()><a target=_blank href="https://legal.here.com/{{ User.locale.language }}/terms/serviceterms/{{ User.country }}/" class=label_block>Terms</a> <a target=_blank href="https://legal.here.com/{{ User.locale.language }}/privacy/policy/{{ User.country }}/" class=label_block>Privacy & Cookies</a> <span data-here-report-image data-here-street-level-expose data-ng-if=isStreetLevelActive()></span> <span class="copyright_string label_block">© {{ hereMapImprint.copyright }}</span></span>'), 
    a.put("directives/mapControls/map-mode-switcher.html", '<section class=map_switcher data-ng-class="{ active_labels: activeLabels }"><section data-ng-show=isMapSwitcherVisible class=map_types><div class="map_type terrain" data-here-click-tracker=map:mapSwitcher:terrain:click data-ng-click="isTerrain = !isTerrain; isPt = false; isSatellite = false; isTraffic = false"><div class=map_label>Terrain</div><div class=map_border data-ng-class="{ selected : isTerrain }"></div></div><div class="map_type satellite" data-here-click-tracker=map:mapSwitcher:satellite:click data-ng-click="isSatellite = !isSatellite; isTerrain = false;"><div class=map_label>Satellite</div><div class=map_border data-ng-class="{ selected : isSatellite }"></div></div><div class="map_type pt" data-here-click-tracker=map:mapSwitcher:pt:click data-ng-click="isPt = !isPt; isTraffic = false; isTerrain = false;"><div class=map_label>Transit</div><div class=map_border data-ng-class="{ selected : isPt }"></div></div><div data-ng-mouseover="showTrafficLabel = false" class="map_type traffic" data-here-click-tracker=map:mapSwitcher:traffic:click data-ng-click="isTraffic = !isTraffic; isPt = false; isTerrain = false;"><div class=map_label data-ng-class="{ show_label : showTrafficLabel }">Traffic</div><div class=map_border data-ng-class="{ selected : isTraffic }"></div></div></section><button class=map_control_type data-ng-mouseover=activateLabels() data-ng-click=showSwitcher() data-here-click-tracker=map:mapSwitcher:entryPoint:click><div class=map_content><div class=map_label>Map view</div><div class=map_border></div></div></button></section>'), 
    a.put("directives/mapControls/map-scale.html", "<div data-ng-show=\"ruler.width > 0 && !isStreetLevelActive()\" class=map_scale data-ng-style=\"{ left: ((ruler.width / 10) + 1.2) * -1 + 'rem', width: (ruler.width / 10) + 'rem' }\"><div class=scale_left_corner></div><div class=scale_right_corner></div><div class=scale_ruler></div><div class=scale_text_area><span class=scale_text data-ng-class=ruler.unit>{{ruler.distance}} {{ruler.unit}}</span></div></div>"), 
    a.put("directives/mapControls/zoom-controls.html", "<div class=map_control_zoom><button class=map_control_zoom_in data-here-svg=\"{path: '/directives/mapControls/zoom-in.svg', color: '#666', activeColor: '#124191'}\" data-ng-mouseleave=mouseup($event) data-here-prevent-ie-touch-context-menu data-here-click-tracker=map:control:zoomin:click name=zoom_in></button> <button class=map_control_zoom_out data-here-svg=\"{path: '/directives/mapControls/zoom-out.svg', color: '#666', activeColor: '#124191'}\" data-ng-mouseleave=mouseup($event) data-here-prevent-ie-touch-context-menu data-here-click-tracker=map:control:zoomout:click name=zoom_out></button></div>"), 
    a.put("directives/markerFlag/marker-flag-incident.html", '<div class=marker_flag_incident><section class="marker_flag_body top left" data-ng-class="{not_expanded : !expanded, improveInfo : improveInfo}"><h3 class=title>{{ title }}</h3><button data-ng-show=!expanded data-ng-click="expanded=true" class=expand_button><svg height=6 width=10><polygon points="0,0 10,0 5,5"/></svg></button> <button class="expand_button close" data-ng-show="expanded && !improveInfo" data-ng-click=closeInstantly() data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'#fff\'}"></button> <button class="expand_button close" data-ng-show="expanded && improveInfo" data-ng-click=closeInstantly() data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'#00c9ff\'}"></button><div data-ng-show=expanded><div class=description>{{ description }}</div><div class=time><div><span>Start time:</span> <time>{{ startTime|date:dateTimeFormat }}</time></div><div><span>Estimated end time:</span> <time>{{ endTime|date:dateTimeFormat }}</time></div></div></div></section><section class=marker_icon_cover data-ng-style="{ \'background-image\': \'url(\' + data.icons.active.url + \')\' }" data-ng-click="expanded=true"></section></div>'), 
    a.put("directives/markerFlag/marker-flag-jam-factor.html", '<div id=marker_flag_jam_factor data-ng-if=current data-ng-style=flagStyling data-ng-class="{improveInfo : improveInfo}"><div class="marker_flag_body flow_segment"><div class=jamfactor data-ng-show=!improveInfo><div class="factor factor_{{current.jamFactor}}">{{ current.jamFactor }}</div><div class="description small_font">{{jamfactorDescriptions[current.jamFactor]}}</div></div><section><div class=close_btn data-ng-show=!improveInfo data-ng-click="$parent.current = false">×</div><button class="expand_button close" data-ng-show=improveInfo data-ng-click="$parent.current = false" data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'#00c9ff\'}"></button><div class=jam_indicator data-ng-if=improveInfo><div class="factor factor_{{current.jamFactor}}"></div><div class="description small_font">{{jamfactorDescriptions[current.jamFactor]}}</div></div><h3 class=roadname>{{ current.roadName }}</h3><div class="direction secondary">{{result.direction}} towards {{result.roadEnd}} {{ current.roadEnd }}</div><div data-ng-if="current.jamFactor < 10" class=delay><span class=label>Delay</span> <span class=value>{{current.delay}} min</span></div><div class="speed small_font"><span class=label data-ng-if=!improveInfo>Avg. speed right now</span> <span class=label data-ng-if=improveInfo>Current speed:</span> <span data-ng-if="current.trafficSpeed >= 0" class=value>{{current.trafficSpeed | speed:current.units}}</span> <span data-ng-if="current.trafficSpeed < 0" class=value>{{ 0 | speed:current.units}}</span></div></section></div></div>'), 
    a.put("directives/markerFlag/marker-flag-maneuver.html", '<div class=marker_flag_maneuver><div class=maneuver_flag_knife data-here-svg="{path:\'/services/markerIcons/knives/standard.svg\'}"></div><div class=maneuver_flag_action data-ng-bind-html=":: maneuverIcon"></div><div class=maneuver_flag_description data-ng-bind-html=":: description | breakSlashedWords"></div></div>'), 
    a.put("directives/markerFlag/marker-flag.html", '<div class=marker-flag><div class=marker-flag-body data-ng-click="isClickable || $event.preventDefault()"><a class="flag-secondary-button new_flag" data-ng-if="directionsUrl && !data.routing" data-ng-class="{route_flag: data.routing}" data-ng-href={{directionsUrl}} data-ng-click=trackAndClose() data-here-svg="{path:\'/img/directions.svg\'}"></a> <span class="flag-secondary-button new_flag" data-ng-if="!directionsUrl || data.routing" data-ng-class="{route_flag: data.routing}" data-here-svg="{path:\'/img/directions.svg\'}"></span> <a class=flag-title data-ng-if=pdcUrl data-ng-href={{pdcUrl}} data-ng-click=onClick($event) data-ng-class="{flag_on_pdc : isPDCPage()}">{{ title }}</a> <span class=flag-title data-ng-if=!pdcUrl data-ng-click=onClick($event)>{{ title }}</span></div></div>'), 
    a.put("directives/menu/menu.html", '<div data-ng-hide="isStreetLevelActive() || isModalDialogActive()" data-ng-class="{visible: isMenuVisible}" class=menu><section class=map_controls data-ng-hide=isStreetLevelActive()><button class=menu_access_btn data-ng-click=changeMenuVisibility(); data-ng-class="{active: isMenuVisible}" data-here-svg="{path: \'/directives/menu/menu.svg\', color: \'#666\', activeColor: \'#fff\'}"></button><div class=menu_about_link_container><a href="https://company.here.com/" target=_blank data-ng-class="{collapsed: isMenuVisible}" data-here-click-tracker=AboutHERE:button:click class=link>About HERE</a></div></section><div class=scrollable><div class="content menu_scrollable_area" data-ng-class="{ is_logged: isLoggedIn }"><section class=menu_elements><div data-here-log-in></div><div id=menu_entry_points><a data-ng-href=/directions/drive class="btn_simple menu_button option_directions" data-ng-click="trackClick(\'directions\')" data-here-svg="{path:\'/img/directions.svg\', color: \'#00c9ff\'}">Routes</a> <a data-ng-href=/traffic/explore class="btn_simple menu_button option_traffic" data-ng-click="trackClick(\'traffic\')" data-here-svg="{ path: \'/img/traffic.svg\', color:\'#5cea00\' }">Traffic</a> <a data-ng-href=/collections class="btn_simple menu_button" data-ng-click="trackClick(\'collections\')" data-here-svg="{ path: \'/img/collections/collections.svg\', color:\'#fffb00\' }">Collections</a> <a data-ng-href=/discover class="btn_simple menu_button" data-ng-click="trackClick(\'places\')" data-here-svg="{ path: \'/img/discover.svg\', color:\'#ff3154\' }">Places</a></div><div data-ng-if=Features.menu.downloadApp class=download_app><p class=teaser>Download the HERE app</p><a href="https://play.google.com/store/apps/details?id=com.here.app.maps" data-ng-click="trackAppDownload(\'google play\')" class="download_app_icon google_play" target=_blank></a> <a href=https://itunes.apple.com/app/id955837609 data-ng-click="trackAppDownload(\'iOS\')" class="download_app_icon app_store" target=_blank></a> <a class=app_link data-ng-click=trackAppDownload() href="https://www.here.com/app/?cid=heremarketing-fw-internal-na-acq-na-externalsource-g0-19-2" target=_blank>Learn more</a></div></section><section class=menu_more><a target=_blank href="https://company.here.com/" data-here-click-tracker=Menu:AboutHERE:click>About HERE</a> <a target=_self href=/traffic data-here-click-tracker=Menu:Traffic:click>Cities with traffic info</a> <a target=_blank href="http://mapcreator.here.com/mapcreator/{{ mapPositionCreatorURLParams }}" data-here-click-tracker=Menu:MapCreator:click>HERE Map Creator</a> <a target=_blank href="https://developer.here.com/" data-here-click-tracker=Menu:Developers:click>For developers</a> <a target=_blank href="https://help.here.com/" data-here-click-tracker=Menu:Help:click>Help</a></section></div></div><section class=menu_bottom><button type=button data-ng-show=isLoggedIn class="btn_simple menu_button btn_sign_out" data-ng-click=logOut() data-here-svg="{ path: \'/directives/menu/sign_out.svg\', color:\'#fff\' }">Sign out</button> <button type=button class="btn_simple menu_button settings" data-here-svg="{ path: \'/img/gear.svg\', color:\'#fff\' }" data-ng-click=showSettings() data-here-click-tracker=Menu:Settings:click>Settings</button></section></div>'), 
    a.put("directives/panelHandle/panelHandle.html", "<div class=collapse_button><button type=button class=collapse title=\"Hide details\" data-ng-show=!panelsService.isMinimized data-ng-click=togglePanel() data-here-svg=\"{path:'/img/collapse_panel.svg', color:'#124191'}\">Hide details</button> <button class=expand type=button title=\"Show details\" data-ng-show=panelsService.isMinimized data-ng-click=togglePanel() data-here-svg=\"{path:'/img/expand_panel.svg', color:'#666666'}\">Show details</button></div>"), 
    a.put("directives/placeCard/place-card.html", '<a data-ng-href=/p/{{options.result.id}} class=place_card itemscope itemtype=http://schema.org/Place data-here-scroll-into-view={{options.result.shouldBeVisible}} data-here-scroll-into-view-margin=5 data-ng-mouseover=boxOver(options.index) data-ng-mouseout=boxOut(options.index) data-here-expose-services=splitTesting data-ng-click="goToPlace($event, options.origin)" data-ng-class="{ hover: options.result.highlight, imageLoaded: imageLoaded }"><div class=image_box data-ng-class="imageLoaded ? \'has_image\' : \'no_image\'"><div class=box_image data-ng-style=getImageAnimationStyle() data-ng-show=imageLoaded data-here-image=options.result.image data-here-image-attribution=""></div><div data-here-category-icon data-category={{options.result.category.id}} data-color=#FFF data-width=18 data-height=18 class=category_icon></div></div><div class=title_box><div class=rating data-ng-show=options.result.averageRating data-here-review-rate-icon data-here-rating="{{ options.result.averageRating }}"><meta itemprop=rating content="{{ options.result.averageRating }}"></div><h3 class=title data-ng-bind-html="options.result.title | truncate: 100"></h3><p class="subtitle cuisine" data-ng-if=options.result.cuisine>{{options.result.cuisine}}</p><p class="subtitle address" data-ng-bind="options.result.vicinity | withoutBRs" itemprop=address itemscope itemtype=http://schema.org/PostalAddress></p></div><div class=tips data-ng-if=options.result.matches.reasons.length><hr><ul><li data-ng-repeat="tip in options.result.matches.reasons" data-here-svg="{path:\'/img/checkmark.svg\', color: \'#00c9ff\'}" data-width=12 data-height=9 data-ng-if="tip.sentiment === \'positive\'">{{tip.text}}<ul data-ng-if=tip.details><li data-ng-repeat="detail in tip.details" data-here-svg="{path:\'/img/checkmark.svg\', color: \'#00c9ff\'}" data-width=12 data-height=9>{{detail.text}}</li></ul></li><li data-ng-repeat="tip in options.result.matches.reasons" data-here-svg="{path:\'/img/close.svg\', color: \'#FF0000\'}" data-width=12 data-height=9 data-ng-if="tip.sentiment === \'negative\'">{{tip.text}}<ul data-ng-if=tip.details><li data-ng-repeat="detail in tip.details" data-here-svg="{path:\'/img/close.svg\', color: \'#00c9ff\'}" data-width=12 data-height=9>{{detail.text}}</li></ul></li></ul></div></a>'), 
    a.put("directives/readMore/read-more.html", '<span class=here_read_more_preview data-ng-class={here_read_more_truncated:truncated} data-ng-bind-html=preview></span> <span class=here_read_more_rest data-ng-if=rest data-ng-hide=truncated data-ng-bind-html=rest></span> <button class="here_read_more_button btn_simple" data-ng-if=rest data-ng-click=toggle() data-here-scroll-to=scrollTo>{{buttonContent}}</button>'), 
    a.put("directives/reportForm/reportForm.html", '<div class=report_form><div data-notification-box data-notification-type=error data-show-notification=showErrorMessage>{{errorMessage}}</div><div data-here-spinner=small data-ng-if=loading class="spinner centered"></div><form name=reportForm novalidate data-ng-init="fieldsetOpened = false" data-ng-if=formData data-ng-submit=processData(results)><div class=form_line data-ng-repeat="reason in formData.labels.reason.values"><fieldset data-ng-if=reason.title data-ng-class="fieldsetOpened ? \'opened\' : \'closed\' "><button type=button data-ng-show=!fieldsetOpened data-here-svg="{ path: \'/img/core_down.svg\', color:\'#000\' }" data-ng-click="fieldsetOpened = true">{{reason.title}}</button> <button type=button data-ng-show=fieldsetOpened data-here-svg="{ path: \'/img/core_up.svg\', color:\'#000\' }" data-ng-click="fieldsetOpened = false">{{reason.title}}</button><div class=form_line data-ng-repeat="otherReason in reason.labels.reason.values"><input type=radio name=reason id=reason_{{reason.id}}_{{otherReason.value}} data-ng-value="reason.id + \'_\' + otherReason.value" data-ng-change="results.url = reason.href; results.comment =\'\'" data-ng-model=results.reason><label for=reason_{{reason.id}}_{{otherReason.value}}>{{otherReason.label}}</label><div data-ng-if="results.reason === reason.id + \'_\' + otherReason.value"><textarea name=comment cols=30 rows=3 data-ng-minlength={{otherReason.comment.minlength}} data-ng-maxlength={{otherReason.comment.maxlength}} data-ng-required=otherReason.comment.required data-ng-model=results.comment>\n                        </textarea><span class=textarea_required data-ng-if=otherReason.comment.required>required</span> <span class=textarea_minlength data-ng-if=otherReason.comment.minlength>min char: {{ otherReason.comment.minlength }}</span> <span class=separator data-ng-if="otherReason.comment.minlength && otherReason.comment.maxlength">/</span> <span class=textarea_counter data-ng-if=otherReason.comment.maxlength>char left: {{ otherReason.comment.maxlength - reportForm.comment.$viewValue.length }}</span></div></div></fieldset><input type=radio name=reason id=reason_{{formData.id}}_{{reason.value}} data-ng-value="formData.id + \'_\' + reason.value" data-ng-change="results.url = formData.href; results.comment =\'\'" data-ng-model=results.reason data-ng-if=!reason.title><label data-ng-if=!reason.title for=reason_{{formData.id}}_{{reason.value}}>{{reason.label}}</label><div data-ng-if="!reason.title && results.reason === formData.id+ \'_\' + reason.value"><textarea name=comment cols=30 rows=3 data-ng-minlength={{reason.comment.minlength}} data-ng-maxlength={{reason.comment.maxlength}} data-ng-required=reason.comment.required data-ng-model=results.comment>\n                </textarea><span class=textarea_required data-ng-if=reason.comment.required>required</span> <span class=textarea_minlength data-ng-if=reason.comment.minlength>min char: {{ reason.comment.minlength }}</span> <span class=separator data-ng-if="reason.comment.minlength && reason.comment.maxlength">/</span> <span class=textarea_counter data-ng-if=reason.comment.maxlength>char left: {{ reason.comment.maxlength - reportForm.comment.$viewValue.length }}</span></div></div><footer><button type=button data-ng-click=onAbort() class="btn btn_light" data-ng-disabled=processing>Cancel</button> <input class="btn btn_full" type=submit value="Send" data-ng-disabled="reportForm.$invalid || reportForm.$pristine || processing"> <span data-ng-show=processing data-here-spinner=small></span></footer></form></div>'), 
    a.put("directives/serviceSwitcher/serviceSwitcher.html", '<nav id=service_switcher data-ng-init="showSubs = false" data-ng-class="{initialized: initialized}"><ul data-ng-click="showSubs = false;"><li class=herelogo data-here-svg="{path:\'/img/logo.svg\', color: \'#FFFFFF\'}"><a data-ng-href="/" onclick=this.blur() data-ng-click="trackClick(\'logo\')">HERE</a></li><li id=ss_places class=menuitem><a data-ng-href=/discover data-ng-click="trackClick(\'places\')">Places</a></li><li id=ss_collections class=menuitem><a data-ng-href="/collections/" data-ng-click="trackClick(\'collections\')">Collections</a></li><li id=ss_traffic class=menuitem><a data-ng-href={{trafficUrl}} data-ng-click="trackClick(\'traffic\')">Traffic</a></li></ul><span class=active_indicator></span></nav>'), 
    a.put("directives/spinner/spinner.html", '<section class=here-spinner><div class="spinner-image {{type}}"></div><div data-ng-if=caption class=spinner-caption><p>{{caption}}</p><div class=spinner-caption-underline></div></div></section>'), 
    a.put("directives/streetLevel/streetLevelClose.html", "<button class=close_button data-ng-click=closeStreetlevel() data-ng-include=\"'/directives/mapControls/zoom-in.svg'\"></button>"), 
    a.put("directives/streetLevel/streetLevelCompass.html", "<div class=compass data-ng-include=\"'/directives/streetLevel/compass.svg'\" data-ng-style=\"{webkitTransform: 'rotate(' + heading + 'deg)', transform: 'rotate(' + heading + 'deg)'}\"></div>"), 
    a.put("directives/streetLevel/streetLevelMinimap.html", "<div class=streetlevel_minimap><div class=map_content></div><div class=viewport data-ng-include=\"'/directives/streetLevel/viewport.svg'\"></div></div>"), 
    a.put("directives/tips/tip.html", '<div class=tip data-ng-if="tipContent.header && tipContent.description" data-ng-style=position data-ng-class="[arrowClass, state]"><div class=tip_arrow></div><div class=tip_wrapper><button class=tip_close data-ng-click=onCloseButtonClick()><span class=tip_close_icon></span></button><div class=tip_content><div class=info_icon data-ng-include="\'/img/icons/icon_info.svg\'"></div><span class=tip_header>{{tipContent.header}}</span> <span class=tip_description>{{tipContent.description}}</span></div><div class=tip_next_controls data-ng-if=tipsPaginator><div class=tip_paging data-ng-if=showDots><div class=dot data-ng-repeat="tip in tipsPaginator"><div data-ng-if=tip.active data-here-svg="{path:\'/img/dot_blue.svg\'}"></div><div data-ng-if=!tip.active data-here-svg="{path:\'/img/circle_grey.svg\'}"></div></div></div><button class="btn btn_full full_width" data-ng-click=onNextButtonClick() data-ng-switch on=okButtonType><span ng-switch-when=next>Next</span> <span ng-switch-when=done>Done</span> <span ng-switch-default>OK</span></button></div></div></div>'), 
    a.put("features/collections/collection-card.html", "<li data-ng-click=options.toggleCollection(options.collection.id) data-ng-class=\"{active: (options.selectedCollections.indexOf(options.collection.id) !== -1), selectable: options.selectable, cover: options.collection.landscapeImageUrl}\" data-ng-style=\"{'background-image': options.collection.landscapeImageUrl ? 'url(' + options.collection.landscapeImageUrl + ')' : null}\"><div class=card_overlay></div><div class=card_content><div class=total_coll><span class=fav_icon data-here-svg=\"{color: (!options.selectable && options.collection.id == 'unsorted') ? '#bfbfbf': '#FFF', path: '/features/collections/img/coll_star.svg'}\"></span> <span>{{options.collection.total}}</span></div><hr><div class=inner_box>{{options.collection.name}}</div><span data-ng-if=\"(!options.selectable && options.collection.id == 'unsorted')\" class=note>Please add to a collection, not 'All other items'.</span> <span class=coll_icon data-here-svg=\"{color: '#00c9ff', path: '/features/collections/img/coll_active.svg'}\" data-ng-if=\"(options.selectedCollections.indexOf(options.collection.id) !== -1)\"></span></div></li>"), 
    a.put("features/collections/collections.html", '<div data-ng-controller=CollectionsOverviewCtrl><div class="header_collections collapsible header_content" data-ng-show="!state.loading && state.loaded && !emptyCollections"><header class="new_header text_only"><h1><span data-here-align-headline class=header_headline data-title="All collections" data-title-container=.header_title><span class=header_title itemprop=name></span> <span data-ng-bind="collections.length + ((unsortedVirtualCollection) ? 1 : 0)" data-here-svg="{ path: \'/img/collections/collections.svg\' }" class=count></span></span></h1></header><nav class=bar><ul><li><button data-ng-click=toggleEditMode() data-ng-show=!state.editMode data-here-svg="{ path: \'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" class=btn_edit>Edit</button> <button data-ng-click=toggleEditMode() data-ng-show=state.editMode data-here-svg="{ path: \'/img/core_checkmark.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\' }" class=btn_done>Done</button></li><li><button data-ng-click=createCollection() data-here-svg="{ path: \'/img/collections/add_collection.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\' }" class=btn_create>New collection</button></li></ul></nav><nav class=collapsed_bar><ul><li><button data-ng-click=toggleEditMode() data-ng-show=!state.editMode data-here-svg="{ path: \'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" class=btn_edit title="Edit"></button> <button data-ng-click=toggleEditMode() data-ng-show=state.editMode data-here-svg="{ path: \'/img/core_checkmark.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\' }" class=btn_done title="Done"></button></li><li><button data-ng-click=createCollection() data-here-svg="{ path: \'/img/collections/add_collection.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\' }" class=btn_create title="New collection"></button></li></ul></nav></div><div class="header_collections collapsible header_content" data-ng-show="!state.loading && state.loaded && emptyCollections"><header class="new_header text_only"><h1 data-ng-show=!landingPage><span data-here-align-headline class=header_headline data-title="All collections" data-title-container=.header_title><span class=header_title itemprop=name></span> <span data-ng-bind=0 data-here-svg="{ path: \'/img/collections/collections.svg\' }" class=count></span></span></h1><h1 data-ng-show=landingPage><span class=header_headline>Collect great places</span></h1></header></div><div class="scrollable_content scrollable_collections" data-here-scrollable data-here-collapsed-element=.panel data-ng-if=state.loaded><div class=collections_rows data-ng-if=!emptyCollections><div data-ng-repeat="collection in collections | orderBy: \'-createdTime\' track by collection.id" class="collection_box list_box"><div data-ng-if=collection.landscapeImageUrl data-header-image=collection.landscapeImageUrl data-use-previous-image=false class=cover_image></div><cite class=attribution data-ng-bind-html="collection._photo.attribution | linksInNewTab" data-ng-show=collection._photo.attribution></cite><div data-ng-show="state.confirmDelete == collection || state.deleteProgress == collection" class=delete_overlay><span data-here-svg="{ path: \'/img/exclamation_mark.svg\' }" class=attention_icon></span><p>Are you sure you want to delete this collection?</p><button data-ng-click="state.confirmDelete = null" class="btn btn_full btn_small">No</button> <button data-ng-click=deleteCollection(collection) class="btn btn_light btn_small">Yes</button><div data-ng-show="state.deleteProgress == collection" data-here-spinner=small class=blocker></div></div><h4 class=title><a href="" data-ng-click=showDetails(collection) data-ng-bind=collection.name></a></h4><span data-ng-bind=collection.total data-here-svg="{ path: \'/img/collections/favorite.svg\', color:\'#ffffff\' }" class=count></span><div class=description><div data-ng-show=collection.description><div class=quote_icon data-here-svg="{ path: \'/img/quote.svg\', color: \'#00c9ff\' }"></div><div data-ng-bind=collection.description class=text></div></div><div data-ng-hide=collection.description>What\'s this collection about?<br><a href="" data-ng-href=/collections/{{collection.id}}?edit>Add a description</a></div></div><button data-ng-click=confirmDelete(collection) data-ng-show=state.editMode data-here-svg="{ path: \'/img/core_trash.svg\', color:\'#00b4e5\', hoverColor:\'#ffffff\' }" class="btn btn_light btn_small btn_icon btn_delete">Delete</button></div><div data-ng-if="unsortedVirtualCollection.total > 0" class="collection_box list_box"><span data-ng-bind=unsortedVirtualCollection.total data-here-svg="{ path: \'/img/collections/favorite.svg\', color:\'#ffffff\' }" class=count></span><h4 class=title><a href="" data-ng-href=/collections/{{unsortedVirtualCollection.id}} data-ng-click=showDetails(unsortedVirtualCollection) data-ng-bind=unsortedVirtualCollection.name></a></h4></div></div><div class=empty_notice data-ng-if="emptyCollections && !landingPage"><h2>Start collecting</h2><div class=fav_icon data-here-svg="{ path: \'/img/collections/collections.svg\', color: \'#BFBFBF\' }"></div><p>A good collection is made up of places you love or want to remember, whether it\'s food, parks or even petrol stations. The possibilities are endless.</p><button data-ng-if="isLoggedIn || !landingPage" type=button class="btn btn_full btn_add_collection" data-ng-click=createCollection()>Start a collection</button></div><div class="empty_notice landing_page" data-ng-if="emptyCollections && landingPage"><div class=fav_icon data-here-svg="{ path: \'/img/collections/landing_page.svg\' }"></div><p>Collect and save all the places you love and want to remember.\nYou can even collect new places to try out later.</p><button data-ng-if=!isLoggedIn type=button class="btn btn_full btn_sign_in" data-ng-click=signIn()>Get started</button> <button data-ng-if=isLoggedIn type=button class="btn btn_full btn_add_collection" data-ng-click=createCollection()>Start a collection</button></div></div><div class="spinner centered" data-here-spinner=big data-ng-if="!panelsService.isMinimized && state.loading"></div></div>'), 
    a.put("features/collections/cover.html", '<div data-ng-controller=CoverCtrl data-ng-class="{ extend: coverError }" class=cover_overlay><div class="top container"><button type=button data-ng-click=updateCover() class="btn btn_full btn_done right">Done</button><h1 class=heading>Choose a cover image</h1><p data-ng-bind=collection.name></p><div data-notification-box data-notification-type=error data-show-notification=coverError>Sorry. There\'s a problem at our end. Please try again later.</div></div><div class=collections_grid><div data-ng-repeat="gallery in galleries" class=gallery><h3 data-ng-bind=gallery.name class=title></h3><ul class=collections_list><li data-ng-repeat="image in gallery.items | limitTo: gallery.limit" data-ng-click=selectCover(image) data-ng-class="{ selected: selectedImage == image }" data-ng-style="{ \'background-image\': \'url(\' + (image.src || \'\') + \')\' }"><span class=check_icon data-here-svg="{color: \'#FFF\', path: \'/features/collections/img/coll_active.svg\'}"></span></li></ul><a href="" data-ng-if="gallery.items.length > gallery.limit" data-ng-click=toggleAll(gallery) class=right>See all</a> <a href="" data-ng-if="gallery.limit > limitImages" data-ng-click=toggleAll(gallery) class=right>See less</a></div></div></div>'), 
    a.put("features/collections/create.html", '<div class=collections_overlay data-ng-controller=CreateCollectionCtrl data-ng-init="place = modals[0].context"><div class=top><h1>New collection</h1></div><div class=create_collection><div data-notification-box data-notification-type=error data-show-notification=errors.backend.unSpecified>Sorry. There\'s a problem at our end. Please try again later.</div><form name=hereCreateCollection data-ng-submit=createCollection() novalidate><fieldset class=center><label for=collection_name>Collection title <input id=collection_name name=collection_name autofocus data-ng-model=collection.title data-ng-required=true tabindex=1 maxlength={{COLLECTION_NAME_SIZE}} placeholder={{COLLECTION_NAME_PLACEHOLDER}}></label></fieldset><fieldset class=center><button type=button class="btn btn_light" data-ng-click=onExit() tabindex=2>Cancel</button> <button type=submit class="btn btn_full" data-ng-disabled="hereCreateCollection.$invalid || buttonBusy" tabindex=3>Create</button></fieldset></form></div></div>'), 
    a.put("features/collections/detail.html", '<div data-ng-controller=CollectionDetailCtrl data-ng-class="{ header_text_only: !collection.landscapeImageUrl}"><div class="header_collections collapsible header_content"><header class=new_header data-ng-class="{ text_only: !collection.landscapeImageUrl}" data-ng-show=!loadingDetail><div data-header-image=collection.landscapeImageUrl data-header-attribution=collection._photo.attribution data-use-previous-image=false class=header_image></div><h1><span data-here-align-headline class="header_headline use_available_space" data-ng-show="!(state.editMode && collection.id !== \'unsorted\')" data-title="{{ collection.name }}" data-title-container=.header_title><span class=header_title itemprop=name></span> <span data-ng-bind=collection.total data-here-svg="{ path: \'/img/collections/favorite.svg\' }" class=count></span></span> <span data-here-align-headline class="header_headline use_available_space edit_collection_name" data-ng-show="(state.editMode && collection.id !== \'unsorted\')" data-title="{{ collection.name }}" data-title-container=.header_title><input class="editable_input left" data-ng-model="collection.name"> <span class="text-counter hidden left" data-ng-bind="(COLLECTION_NAME_SIZE - collection.name.length)" data-ng-show="(collection.id !== \'unsorted\')" data-ng-class="{\'error\': (collection.name.length > COLLECTION_NAME_SIZE), \'hidden\': !state.editMode}"></span></span></h1></header><div data-notification-box data-notification-type=error data-show-notification=showUpdateErrorNotification>There was a problem and the changes to your collection couldn\'t be saved. Try again?</div><nav class=bar data-ng-show=!loadingDetail><ul><li data-ng-class="{ empty: collections.length == 0 }"><button data-here-ios-touch-to-click data-ng-click=toggleEditMode() data-here-svg="{ path: \'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" class=btn_edit data-ng-show=!state.editMode>Edit</button> <button data-here-ios-touch-to-click data-ng-click=toggleEditMode() data-here-svg="{ path: \'/img/core_checkmark.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\' }" data-ng-show=state.editMode data-ng-disabled="(collection.name.length === 0 || collection.name.length > COLLECTION_NAME_SIZE)" class=btn_done>Done</button></li><li data-ng-if="collection.id != \'unsorted\' && imagesAvailable.length"><button data-here-svg="{ path: \'/img/add_picture.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" data-ng-click=chooseCover()>Change image</button></li></ul></nav><nav class=collapsed_bar data-ng-show=!loadingDetail><ul><li data-ng-class="{ empty: collections.length == 0}"><button data-ng-click=toggleEditMode() data-here-svg="{ path: \'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" class=btn_edit title="Edit" data-ng-show=!state.editMode></button> <button data-ng-click=toggleEditMode() data-here-svg="{ path: \'/img/core_checkmark.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" data-ng-disabled="(collection.name.length === 0 || collection.name.length > COLLECTION_NAME_SIZE)" class=btn_done title="Done" data-ng-show=state.editMode></button></li><li data-ng-if="collection.id != \'unsorted\' && imagesAvailable.length"><button data-here-svg="{ path: \'/img/add_picture.svg\', color: \'#00c9ff\', hoverColor: \'#00b4e5\'}" data-ng-click=chooseCover() title="Change image"></button></li></ul></nav></div><div class="scrollable_content scrollable_collections" data-ng-show=!loadingFavorites data-here-scrollable data-here-collapsed-element=.panel><div data-ng-if=!isVirtual data-here-description-widget=collection data-is-open=editMode></div><div data-ng-show=!emptyFavorites class=collections_rows><div data-ng-repeat="favorite in favorites | orderBy: \'-createdTime\' track by favorite.id" data-ng-class="{ highlight: highlighted == favorite, favorite_box: favorite.type === \'favoritePlace\', route_box: favorite.type === \'favoriteRoute\', city_box: (isCity(favorite) && Features.collections.descriptionLinkNotForCities) }" data-ng-mouseover=doHighlight(favorite) data-ng-mouseout=removeHighlight(favorite) class=list_box><div data-ng-show="state.confirmDelete == favorite || state.deleteProgress == favorite" class=delete_overlay><span data-here-svg="{ path: \'/img/exclamation_mark.svg\', color: \'#FFF\' }" class=attention_icon></span><p>Are you sure you want to remove this favourite?</p><button data-ng-click="state.confirmDelete = null" class="btn btn_full btn_small">No</button> <button data-ng-click=deleteFavorite(favorite) class="btn btn_light btn_small">Yes</button><div data-ng-show="state.deleteProgress == favorite" data-here-spinner=small class=blocker></div></div><div data-ng-class="{ imageLoaded: images[favorite.placesId].loaded }" class=favorite_image data-ng-show="favorite.type === \'favoritePlace\' && !(state.confirmDelete == favorite) "><div data-ng-style=getImageStyles(favorite) class=box_image></div></div><div data-here-category-icon data-category={{favorite.category}} data-color=#fff data-width=20 data-height=20 class=info_cat_icon data-ng-if="favorite.type === \'favoritePlace\'"></div><div class=info data-ng-if="favorite.type === \'favoritePlace\'"><h4 class=title><a href="" data-ng-click=showDetails(favorite)><span data-ng-bind=favorite.name></span></a></h4><p data-ng-bind="favorite.location.address.text | withoutBRs" class=address></p><div data-ng-if=" ( !isCity(favorite) && Features.collections.descriptionLinkNotForCities) || (!Features.collections.descriptionLinkNotForCities && favorite.type == \'favoritePlace\') " class=description><div data-ng-show=favorite.description><div class=quote_icon data-here-svg="{ path: \'/img/quote.svg\', color: \'#00c9ff\' }"></div><div data-ng-bind=favorite.description class=text></div></div><div data-ng-hide=favorite.description class=empty_description><a href="" data-ng-click="showDetails(favorite, true)">Add a description for this place</a></div></div></div><div data-here-collection-route-card=favorite class=info data-ng-if="favorite.type === \'favoriteRoute\'"></div><button data-ng-click=confirmDelete(favorite) data-ng-show=state.editMode data-here-svg="{ path: \'/img/core_trash.svg\', color:\'#00b4e5\', hoverColor:\'#ffffff\' }" class="btn btn_light btn_small btn_icon btn_delete">Delete</button></div></div><div class=empty_notice data-ng-if=emptyFavorites><div class=star_icon data-here-svg="{ path: \'/img/collections/favorite.svg\', color: \'#BFBFBF\' }"></div><h3>A collection needs collectibles. Find some now.</h3><p><button data-ng-click="startDiscover(true)" class="btn_simple">Search</button> to collect or <button data-ng-click="startDiscover(false)" class="btn_simple">discover</button> new places around you.</p></div></div><div class="spinner centered" data-ng-show="!panelsService.isMinimized && (loadingDetail || loadingFavorites)" data-here-spinner=big></div></div>'), 
    a.put("features/collections/manage.html", '<div class="collections_overlay manage" data-ng-controller=ManageFavoriteCtrl><div class=top><h1 data-ng-if="(getState() === \'empty\')" data-ng-hide=showTitle>Start collecting</h1><h1 data-ng-if="(getState() === \'save\')" data-ng-hide=showTitle>Collect place</h1><h1 data-ng-if="(getState() === \'manage\')" data-ng-hide=showTitle>Manage place</h1><p data-ng-if="(getState() === \'save\' || getState() === \'manage\')">Choose the collections you want to save this place in.</p></div><div data-ng-if="(getState() === \'save\' || getState() === \'manage\')" class=collections_grid><button type=button class="btn btn_light" data-ng-click=goToNewCollection()>New collection</button> <button type=button class="btn btn_full" data-ng-click=mainCallToAction() data-ng-disabled="((selectedCollections.length === 0 && getState() === \'save\') || buttonBusy)" style=margin-right:2.5rem>Done</button><div data-notification-box data-notification-type=error data-show-notification=errors.backend.unSpecified>Sorry. There\'s a problem at our end. Please try again later.</div><div data-notification-box data-notification-type=info data-show-notification=errors.frontend.deleteWarning data-svg-color=#00aad9>If you remove this place from this collection, it\'ll no longer be found in any of your collections.</div><ul class=collections_list data-ng-style="{\'height\': ((getAvailableHeight()-125)/10) + \'rem\'}"><li data-collection-card="{collection: collection, toggleCollection: toggleCollection, selectedCollections: selectedCollections, selectable: true}" data-ng-repeat="collection in collections | orderBy: \'-createdTime\' track by collection.id"></li><li data-collection-card="{collection: unsortedVirtualCollection, toggleCollection: toggleCollection, selectedCollections: selectedCollections, selectable: isUnsortedItem}" data-ng-if="unsortedVirtualCollection.total > 0" class=unsorted></li></ul></div><div data-ng-if="(getState() === \'empty\')" class=collections_empty><div class=fav_icon data-here-svg="{color: \'#BFBFBF\', path: \'/img/collections/collections.svg\'}"></div><p>A good collection is made up of places you love or want to remember, whether it\'s food, parks or even petrol stations. The possibilities are endless.</p><button type=button class="btn btn_full" data-ng-click=goToNewCollection()>Start a collection</button></div></div>'), 
    a.put("features/cookieNotice/cookieNotice.html", '<div data-ng-if=cookieNotice.shown data-here-expose-services=User data-notification-box data-notification-type=cookie data-show-notification=cookieNotice.shown data-notification-callback=cookieNotice.onClose() data-svg-color=#00C9FB><span class=light>WE USE COOKIES</span> <span class=light>|</span> <span>HERE uses cookies from our websites to bring you services and info that matters more to you, including advertising from our partners.</span> <span class=light>By using this website, you consent to the use of cookies.</span> <a href="https://legal.here.com/{{ User.locale.language }}/privacy/cookies/{{ User.country }}/" target=_blank>Find out more</a></div>'), 
    a.put("features/directions/commutes/recent-commutes.html", '<h2>Stored journeys</h2><ul><li data-ng-repeat="commute in recentCommutes"><div class=commute_card data-ng-click=setCommuteOnClick($index) title="Click to see this journey"><div class="icon {{commute.storedRoute.mode[0]}}" data-here-svg="{path: commute.storedRoute.icon, color:\'#e7e7e7\'}"></div><span data-ng-if=commute.storedRoute.name class=name>{{commute.storedRoute.name}}</span> <span data-ng-if=!commute.storedRoute.name class=name>{{commute.storedRoute.itineraryItems[0].name | substring}} - {{commute.storedRoute.itineraryItems[commute.storedRoute.itineraryItems.length - 1].name | substring}}</span> <span data-ng-if="commute.storedRoute.itineraryItems.length > 2" class=via>via {{ commute.storedRoute.itineraryItems[1].name | substring }}</span> <button data-ng-click=handleCommuteConfirm($index);$event.stopPropagation(); data-here-svg="{ path: \'/img/core_trash.svg\', color:\'#00b4e5\', hoverColor:\'#ffffff\'}" class="btn btn_light btn_small btn_icon btn_delete"></button></div><div class=commute_card_confirmation data-ng-show="commuteCardConfirm === $index"><div class=commute_name>Remove this journey?</div><div class=form_buttons><button class="btn btn_small btn_full cancel" data-ng-click=handleCommuteConfirm();>No</button> <button class="btn btn_small btn_light delete" data-ng-click=handleCommuteConfirm();removeCommute($index);>Yes</button></div></div></li></ul>'), 
    a.put("features/directions/directions.html", '<div data-ng-controller=DirectionsCtrl class=directions_controller data-ng-class="{no_select: noSelect, featureC2AOverhaul: featureC2AOverhaul}"><div id=service_switcher class=directions><ul><li class=herelogo data-here-svg="{path:\'/img/logo.svg\', color:\'white\'}"><a data-ng-href="/" data-ng-click=trackDiscoverOpen() onclick=this.blur()>HERE</a></li><li class=menuitem data-ng-repeat="mode in transportModes"><a class=mode_{{mode.type}} title={{mode.label}} data-ng-class="{active: mode.active}" data-ng-href="{{ getUrlForMode(mode) }}" data-here-click-tracker="{{ \'routing:modeswitch:\' + mode.type + \':click\' }}" data-here-svg="{path: mode.icon, color:\'#d9d9d9\', hoverColor:\'white\', activeColor:\'white\'}"></a><div data-ng-if=$first class=menu_indicator data-ng-style="{left: indicatorPos + \'%\'}"></div></li><li class=spacer></li><li id=close_container><a class=btn_close data-ng-href="/?x=ep" data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'white\', hoverColor:\'#00b4e5\'}"></a></li></ul></div><section id=itinerary_bar data-ng-class="{new_style: itineraryOverhaul}"><section id=itinerary_view><ul id=itinerary_items_container><li data-ng-repeat="item in itineraryItems"><div class=itinerary_item data-ng-class="{\n                            with_waypoints: itineraryItems.length > 2,\n                            location:       item.geolocationModel || item.isMyLocation,\n                            location_error: item.locationError,\n                            via:            !$first && !$last\n                        }"><span data-ng-if=$first data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class="itinerary_item_icon from"></span> <span data-ng-if="!$first && !$last" data-ng-include="\'/features/directions/img/itineraryItems/to.svg\'" class="itinerary_item_icon to"></span> <span data-ng-if=$last data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class="itinerary_item_icon to"></span><form data-ng-submit=selectFromSearchList() data-ng-class="{focused : itineraryItemFocused && itineraryItemIndex === $index || \'\'}"><input id=itinerary_item_input_{{$index}} tabindex="{{$index + 1}}" placeholder={{item.label}} data-ng-class="{location: item.geolocationModel || item.isMyLocation}" data-ng-model=item.query data-ng-keydown=navigateSearchList($event) data-ng-change="resetAndShowItems(item, $index)" data-ng-focus="showItems(item, $index)" data-ng-blur="blurItineraryItem(item, $index)" data-here-autoselect><div class=itinerary_border></div></form><button data-ng-if="((itineraryItemIndex === $index && itineraryItemFocused) || item.isMyLocation) && !locationInRoute && (!item.query || item.query.length < 3)" data-ng-click=setMyLocation() class="btn btn_small btn_light btn_use_location" data-here-ios-touch-to-click>Use your current location</button> <button id=add_waypoint_btn data-ng-if="(itineraryOverhaul && $last && itineraryItems.length < MAX_ITINERARY_ITEMS) ||\n                                            ($last && itineraryItems.length < MAX_ITINERARY_ITEMS &&\n                                             (itineraryItems[itineraryItems.length - 2].title !== null || itineraryItems.length === 2)&&\n                                             (!itineraryItemFocused || (itineraryItemIndex !== $index && itineraryItemIndex !== $index - 1)))" title="Add a waypoint" data-ng-click=addWaypoint() data-here-svg="{path:\'/features/directions/img/itineraryItems/add_icon.svg\', color: \'#97A1AD\', hoverColor:\'#00b4e5\'}"></button> <button class=remove_waypoint_btn data-ng-if="!$last &&\n                                        !$first" title="Remove waypoint" data-ng-click=removeWaypoint($index) data-here-svg="{path:\'/features/directions/img/itineraryItems/remove_icon.svg\', color: \'#97A1AD\', hoverColor:\'#00b4e5\'}"></button></div><div data-ng-if="(itineraryItemIndex == $index) && !!((results && results.items) || recentSearchResults)" data-ng-style="{zIndex: 102 + (recentSearchResults && recentSearchResults.length || 0) + (results.items && results.items.length || 0)}" class=dropdown_list data-here-ios-touch-to-click><section data-ng-if=recentSearchResults><h5>Recent</h5><div class="dropdown_list_item recents" data-ng-repeat="recent in recentSearchResults" data-ng-class="{hovered: hoveredResultIndex == ($index - recentSearchResults.length)}" data-ng-mouseenter="hoverSearchElement($index - recentSearchResults.length)" data-ng-mouseleave=leaveSearchElement() data-ng-click="selectSearchElement(recent.data, \'recent\')"><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-ng-if=recent.data data-category={{recent.data.category}} data-color=#BFBFBF data-width=18 data-height=18></span> <span data-ng-bind-html="recent.data.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-if=recent.data.description data-ng-bind-html="recent.data.description | withoutBRs | markSubString:item.query"></span></div></section><section data-ng-if=results.items><h5>Suggestions</h5><div data-ng-repeat="result in results.items" class=dropdown_list_item data-ng-class="{hovered: hoveredResultIndex == $index}" data-ng-mouseenter=hoverSearchElement($index) data-ng-mouseleave=leaveSearchElement() data-ng-click="selectSearchElement(result, \'suggestion\')"><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-category={{result.category.id}} data-color=#BFBFBF data-width=14 data-height=14></span> <span data-ng-bind-html="result.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-bind-html="result.vicinity | withoutBRs | markSubString:item.query"></span></div></section></div></li></ul><button id=reverse_route_btn title="Reverse route" data-ng-if="itineraryOverhaul || (itineraryItems.length === 2 && !itineraryItemFocused)" data-ng-click=reverseRoute() data-here-svg="{path:\'/features/directions/img/itineraryItems/reverse_icon.svg\', color: \'#98A2AE\', hoverColor:\'#00b4e5\'}"></button></section></section><section id=preferences data-ng-if="(requestPending || routeError || currentRoute.leg.length) && !featureC2AOverhaul" data-ng-include="\'features/directions/route-preferences.html\'"></section><section id=preferences data-ng-if="(requestPending || routeError || currentRoute.leg.length) && featureC2AOverhaul" data-ng-include="\'features/directions/route-settings.html\'" class=featureC2AOverhaul></section><div class=scrollable_content><div data-ng-show="requestPending || routeError || currentRoute.leg.length || flights.length || (featureCommute && recentCommutes.length && recentCommutesShow)" id=directions_container class="waypoint{{itineraryItems.length - 2}}" data-here-node-dimensions=setContainerBottomRightGetter(getter) data-ng-class="{pending: (requestPending)}"><section id=recent_commutes data-ng-if="featureCommute && recentCommutes.length && recentCommutesShow && !requestPending" data-ng-include="\'features/directions/commutes/recent-commutes.html\'"></section><div id=route_view data-ng-class="{route_error: routeError}"><section id=routes_list><ul data-ng-if=availableRoutes.length data-ng-class="{ \'many_labels\': availableRoutes[currentRouteIndex].publicTransportLine.length > 2, \'two_lines\': availableRoutes[currentRouteIndex].publicTransportLine.length > 4 }" class=for_{{availableRoutes.length}}><li data-ng-repeat="route in availableRoutes" data-here-route-card></li></ul><ul data-ng-if="flights.length && !showSelectedFlight" class=flights><li data-ng-repeat="flight in flights" data-ng-click=selectFlight(flight)><span><b>{{flight.departureDate.format(\'{Dow} {Mon} {dd}\')}}</b>&nbsp;<b>{{flight.origin.Name}}</b> to <b>{{flight.destination.Name}}</b> - {{flight.direct ? "Nonstop" : "with Transfers"}}</span><br><span class=carrier>{{flight.carrier.Name}}</span><span class=price>From {{flight.currencies.Symbol}}{{flight.price}}</span></li></ul><section data-ng-if=showSelectedFlight class=selectedFlight><div class=header><div class=time><time data-ng-init="value = selectedFlight.leg.Duration" title=duration class=duration datetime="{{ value | hereIsoDuration }}" data-ng-bind-html="value | readableTimeSpan:true">{{value}}</time><br><span class=label>Arrival at</span>&nbsp;<time datetime="{{ selectedFlight.segment.ArrivalDateTime.toISOString() }}" class=label>{{ selectedFlight.segment.ArrivalDateTime | localizedTime }}</time></div><div class=price><span class=label>Best Price</span><br><span class=value>{{selectedFlight.flight.currencies.Symbol}}{{selectedFlight.itinerary.PricingOptions[0].Price}}</span></div></div><div class=content><table class=tg><tr><th class=tg-031e colspan=4>Flight Details<tr><td class=tg-031e><b>Outbound</b><td class=tg-031e colspan=2>{{selectedFlight.flight.departureDate.format(\'{Dow} {Mon} {dd}\')}}&nbsp;<b>{{selectedFlight.flight.origin.Name}}</b> to <b>{{selectedFlight.flight.destination.Name}}</b> - {{selectedFlight.flight.direct ? "Nonstop" : "with Transfers"}}<td class="tg-031e duration"><time data-ng-init="value = selectedFlight.leg.Duration" title=duration class=duration datetime="{{ value | hereIsoDuration }}" data-ng-bind-html="value | readableTimeSpan:true"></time><tr><td class=tg-031e><img src={{selectedFlight.carrier.ImageUrl}} height="40"><td class=tg-031e><td class=tg-031e><td class=tg-031e><tr class=info><td class=tg-031e>{{selectedFlight.carrier.Name}}<td class=tg-031e>Depart&nbsp; <time datetime="{{ selectedFlight.segment.DepartureDateTime.toISOString() }}">{{ selectedFlight.segment.DepartureDateTime | localizedTime }}</time><td class=tg-031e colspan=2>{{selectedFlight.flight.origin.IataCode}}&nbsp;{{selectedFlight.flight.origin.CityName}}&nbsp;{{selectedFlight.flight.origin.Name}}<tr class=info><td class=tg-031e>Flight&nbsp;{{selectedFlight.leg.FlightNumbers[0].FlightNumber}}<td class=tg-031e>Arrive&nbsp; <time datetime="{{ selectedFlight.segment.ArrivalDateTime.toISOString() }}">{{ selectedFlight.segment.ArrivalDateTime | localizedTime }}</time><td class=tg-031e colspan=2>{{selectedFlight.flight.destination.IataCode}}&nbsp;{{selectedFlight.flight.destination.CityName}}&nbsp;{{selectedFlight.flight.destination.Name}}<tr><td class=tg-031e><button type=button data-ng-click=backFlight() class=btn_back title="Back" data-here-svg="{path:\'/img/back-button.svg\', color:\'#273142\', hoverColor:\'#00c9ff\'}"></button><td class=tg-031e><td class=tg-031e colspan=2 style=text-align:right>{{selectedFlight.flight.currencies.Symbol}}{{selectedFlight.itinerary.PricingOptions[0].Price}} &nbsp; <a data-ng-href={{selectedFlight.itinerary.PricingOptions[0].DeeplinkUrl}} target=_blank>Book</a></table></div></section><section data-ng-if="(requestPending || gettingRecentRoutes) && !panelsService.isMinimized && !routeError" class=route_spinner data-here-spinner=big data-here-inside-spinner-image=route data-here-spinner-caption="Getting directions"></section><section data-ng-if="(requestPending || gettingRecentRoutes) && panelsService.isMinimized && !routeError" class=route_spinner_small data-here-spinner=small></section><section data-ng-if=routeError data-ng-class="{collapsed : panelsService.isMinimized}" data-ng-switch=routeError class=route_error><section data-ng-switch-when=geoLocationNotGranted><h2>{{locationSharingNotAllowed}}</h2></section><section data-ng-switch-when=noRouteFound><h2>Couldn\'t find a route for that journey.</h2><p>Try another one?</p></section><section data-ng-switch-when=networkProblems><h2>Sorry. There\'s a problem at our end that needs fixing.</h2><p>We\'ll be helping you find your way again very soon.</p></section><section data-ng-switch-when=noArrivalSupported><h2>Couldn\'t find a route for that journey.</h2><p>Can\'t give you the arrival time for this route.</p></section><section data-ng-switch-when=wrongParameters><h2>Couldn\'t find a route for that journey.</h2><p>Please check what you typed.</p></section><section data-ng-switch-when=givenStartNotFound><h2>Couldn\'t find it</h2><p>Please set your starting point.</p></section><section data-ng-switch-when=givenDestinationNotFound><h2>Couldn\'t find it</h2><p>Please set your destination.</p></section><section data-ng-switch-when=givenBothNotFound><h2>Couldn\'t find it</h2><p>Please set your starting point and destination.</p></section></section><section data-ng-if="\n                            !requestPending &&\n                            !routeError &&\n                            availableRoutes.length === 0 &&\n                            (recentRoutes.length === 0 || panelsService.isMinimized) &&\n                            desiredMapType === \'TRAFFIC\'"><div data-here-route-legend></div></section></section><section data-ng-if=currentRoute.leg.length data-ng-class="{ minimzed: panelsService.isMinimized }" class=maneuvers_container><div data-notification-box data-notification-type=info data-show-notification=disclaimer.show data-svg-color=#00aad9>{{ disclaimer.text }}</div><div class=header_container><h2 class=float-left>Route details</h2><div class=clear></div><div class=clear></div><button class="btn btn_simple send_to_car" id=directions_send_to_car data-ng-if="Features.sendRouteToCar && getActiveTransportModes()[0].type === \'car\'" data-ng-click=sendRouteToCar() data-here-svg="{ path: \'/img/pdc/send-to-car.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}">Send to car</button><div class=vertical_divider data-ng-show="Features.sendRouteToCar && getActiveTransportModes()[0].type === \'car\'"></div><button class="btn btn_simple print top" data-ng-click=printRoute() data-here-svg="{ path: \'/features/directions/img/printer.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-show=showPrint>Print</button><div class=clear></div><div class=clear></div><div data-ng-if="currentRoute.mode.transportModes[0] === \'car\'" data-ng-include="\'features/directions/route-legend.html\'"></div></div><section data-ng-if="getActiveTransportModes()[0].type === \'car\' || getActiveTransportModes()[0].type === \'pedestrian\'" data-ng-include="\'features/directions/maneuvers/car_pedestrian.html\'"></section><section data-ng-if="getActiveTransportModes()[0].type === \'publicTransportTimeTable\'" data-ng-include="\'features/directions/maneuvers/pt.html\'"></section><button class="btn btn_simple print bottom" data-ng-click=printRoute() data-here-svg="{ path: \'/features/directions/img/printer.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-show=showPrint>Print</button></section></div></div></div><div data-here-panel-handle data-ng-show="requestPending || routeError || currentRoute.leg.length"></div></div>'), 
    a.put("features/directions/directions_new.html", '<div data-ng-controller=DirectionsCtrl class=directions_controller data-ng-class="{no_select: noSelect, flights_enabled: flightsEnabled, featureC2AOverhaul: featureC2AOverhaul}"><div id=service_switcher class=directions><ul><li class=herelogo data-here-svg="{path:\'/img/logo.svg\', color:\'white\'}"><a data-ng-href="/" data-ng-click=trackDiscoverOpen() onclick=this.blur()>HERE</a></li><li class=menuitem data-ng-repeat="mode in transportModes"><a class=mode_{{mode.type}} title={{mode.label}} data-ng-class="{active: mode.active}" data-ng-href="{{ getUrlForMode(mode) }}" data-here-click-tracker="{{ \'routing:modeswitch:\' + mode.type + \':click\' }}" data-here-svg="{path: mode.icon, color:\'#d9d9d9\', hoverColor:\'white\', activeColor:\'white\'}"></a><div data-ng-if=$first class=menu_indicator data-ng-style="{left: indicatorPos + \'%\'}"></div></li><li class=spacer></li><li id=close_container><a class=btn_close data-ng-href="/?x=ep" data-here-svg="{path:\'/features/directions/img/close.svg\', color: \'white\', hoverColor:\'#00b4e5\'}"></a></li></ul></div><div data-here-itinerary-bar=itineraryItems data-max-itinerary-items=MAX_ITINERARY_ITEMS data-max-recents=MAX_RECENTS_PER_ITINIRARY data-itinerary-add=addWaypoint() data-itinerary-remove=removeWaypoint(index) data-itinerary-set-my-location=setMyLocation(index) data-on-itinerary-removed=removeItinerary(item) data-itinerary-item-populate="setItineraryItem(index, model)" data-itineraries-reverse=reverseRoute() data-on-expand-stopovers=scrollPanelToTop() data-has-location-in-route=locationInRoute></div><div class=scrollable_content data-here-scrollable data-here-collapsed-element=.panel data-ng-class="{expanded: !panelsService.isMinimized}"><div here-date-span-selector=flightSettings date-span-selector-on-changed=flightSettingsChanged(settings) data-ng-show="getActiveTransportModes()[0].type === \'flight\'"></div><section id=preferences data-ng-if="getActiveTransportModes()[0].type !== \'flight\' && (requestPending || routeError || currentRoute.leg.length) && !featureC2AOverhaul" data-ng-include="\'features/directions/route-preferences.html\'"></section><section id=preferences data-ng-if="getActiveTransportModes()[0].type !== \'flight\' && (requestPending || routeError || currentRoute.leg.length) && featureC2AOverhaul" data-ng-include="\'features/directions/route-settings.html\'" class=featureC2AOverhaul></section><div data-ng-show="requestPending || routeError || currentRoute.leg.length || flights.length || (featureCommute && recentCommutes.length && recentCommutesShow)" id=directions_container class="waypoint{{itineraryItems.length - 2}}" data-here-node-dimensions=setContainerBottomRightGetter(getter) data-ng-class="{pending: requestPending}"><section id=recent_commutes data-ng-if="featureCommute && recentCommutes.length && recentCommutesShow && !requestPending" data-ng-include="\'features/directions/commutes/recent-commutes.html\'"></section><div id=route_view data-ng-class="{route_error: routeError}"><section id=routes_list><ul data-ng-if=availableRoutes.length data-ng-class="{ \'many_labels\': availableRoutes[currentRouteIndex].publicTransportLine.length > 2, \'two_lines\': availableRoutes[currentRouteIndex].publicTransportLine.length > 4 }" class=for_{{availableRoutes.length}}><li data-ng-repeat="route in availableRoutes" data-here-route-card></li></ul><div data-here-flight-directive></div><section data-ng-if="(requestPending || gettingRecentRoutes) && !panelsService.isMinimized && !routeError" class=route_spinner data-here-spinner=big data-here-inside-spinner-image=route data-here-spinner-caption="Getting directions"></section><section data-ng-if="(requestPending || gettingRecentRoutes) && panelsService.isMinimized && !routeError" class=route_spinner_small data-here-spinner=small></section><section data-ng-if=routeError data-ng-class="{collapsed : panelsService.isMinimized}" data-ng-switch=routeError class=route_error><section data-ng-switch-when=noRouteFound><h2>Couldn\'t find a route for that journey.</h2><p>Try another one?</p></section><section data-ng-switch-when=networkProblems><h2>Sorry. There\'s a problem at our end that needs fixing.</h2><p>We\'ll be helping you find your way again very soon.</p></section><section data-ng-switch-when=noArrivalSupported><h2>Couldn\'t find a route for that journey.</h2><p>Can\'t give you the arrival time for this route.</p></section><section data-ng-switch-when=wrongParameters><h2>Couldn\'t find a route for that journey.</h2><p>Please check what you typed.</p></section><section data-ng-switch-when=givenStartNotFound><h2>Couldn\'t find it</h2><p>Please set your starting point.</p></section><section data-ng-switch-when=givenDestinationNotFound><h2>Couldn\'t find it</h2><p>Please set your destination.</p></section><section data-ng-switch-when=givenBothNotFound><h2>Couldn\'t find it</h2><p>Please set your starting point and destination.</p></section></section><section data-ng-if="\n                            !requestPending &&\n                            !routeError &&\n                            availableRoutes.length === 0 &&\n                            (recentRoutes.length === 0 || panelsService.isMinimized) &&\n                            desiredMapType === \'TRAFFIC\'"><div data-here-route-legend></div></section></section><section data-ng-if=currentRoute.leg.length data-ng-class="{ minimzed: panelsService.isMinimized }" class=maneuvers_container><div data-notification-box data-notification-type=info data-show-notification=disclaimer.show data-svg-color=#00aad9>{{ disclaimer.text }}</div><div class=header_container><h2 data-ng-show=!featureC2AOverhaul class=float-left>Route details</h2><div class=clear></div><div class=clear></div><button class="btn btn_simple send_to_car" id=directions_send_to_car data-ng-if="Features.sendRouteToCar && getActiveTransportModes()[0].type === \'car\'" data-ng-click=sendRouteToCar() data-here-svg="{ path: \'/img/pdc/send-to-car.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}">Send to car</button><div class=vertical_divider data-ng-show="Features.sendRouteToCar && getActiveTransportModes()[0].type === \'car\'"></div><button class="btn btn_simple print top" data-ng-click=printRoute() data-here-svg="{ path: \'/features/directions/img/printer.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-show="showPrint && !(featureC2AOverhaul && featureCommute)">Print</button><div class=clear></div><div class=clear></div><div data-ng-if="currentRoute.mode.transportModes[0] === \'car\'" data-ng-include="\'features/directions/route-legend.html\'"></div></div><section data-ng-if="getActiveTransportModes()[0].type === \'car\' || getActiveTransportModes()[0].type === \'pedestrian\'" data-ng-include="\'features/directions/maneuvers/car_pedestrian.html\'"></section><section data-ng-if="getActiveTransportModes()[0].type === \'publicTransportTimeTable\'" data-ng-include="\'features/directions/maneuvers/pt.html\'"></section><button class="btn btn_simple print bottom" data-ng-click=printRoute() data-here-svg="{ path: \'/features/directions/img/printer.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-show="showPrint && !featureC2AOverhaul">Print</button></section></div></div></div><div data-here-panel-handle data-ng-show="requestPending || routeError || currentRoute.leg.length"></div></div>'), 
    a.put("features/directions/flight-preferences.html", '<div class=preferences_divider></div><div class=flight_options data-ng-class="{expanded: isOptionsExpanded}"></div><div class=flight_dates></div>'), 
    a.put("features/directions/flights/flights.html", '<section id=flights><ul data-ng-if=flights.length class=flight_list><li data-ng-repeat="flight in flights" data-ng-click="selectFlight($event, flight, $index)" data-ng-class="{expand: (selectedFlightIndex===$index && !requestingFlights)}"><div class=list_price><div><span><b>{{flight.origin.Name}}</b></span> <span data-here-svg="{ path: \'/features/directions/img/modes/plane.svg\', color:\'#00c9ff\'}" class=little_plane></span> <span data-ng-if=!flight.direct data-ng-include="\'/features/directions/img/flights/empty_circle.svg\'" class=circle></span> <span data-ng-include="\'/features/directions/img/flights/filled_circle.svg\'" class=circle></span> <span><b>{{flight.destination.Name}}</b></span></div><hr><div><span class=carrier>{{flight.carrier.Name}} - {{flight.direct ? "direct flight" : "indirect flight"}}</span></div><span class=price data-ng-if="selectedFlightIndex !== $index" data-ng-bind-html=getPriceString(flight)></span> <span class="price live" data-ng-if="selectedFlightIndex === $index && !requestingFlights" data-ng-bind-html=getLivePriceString(flight)></span><div data-ng-if="selectedFlightIndex === $index && requestingFlights" class="route_spinner_small requesting" data-here-spinner=small></div></div><section data-ng-if="selectedFlightIndex === $index && !requestingFlights" data-ng-include="\'features/directions/flights/livePrice.html\'" class=selected_flight></section></li></ul><a data-ng-if="flights.length && !selectedFlight" class=sky_scanner_logo href=http://www.skyscanner.net target=_blank>Powered by&nbsp;<span data-ng-include="\'/features/directions/img/flights/Skyscanner-Logo-Original.svg\'"></span></a></section>'), 
    a.put("features/directions/flights/livePrice.html", '<div class=header><span class=label>Flight details</span><div class=booking_details></div></div><div class=error data-ng-if=errorMessage><span class=label>Oops! Seems that the tickets have been already sold...</span></div><div data-ng-if=!errorMessage class=content><section class=departure><div>Outbound &#10142; {{selectedFlight.outboundLeg.segments[0].DepartureDateTime.format(\'{Dow} {Mon} {dd}\')}}</div><br><table data-ng-repeat="segment in selectedFlight.outboundLeg.segments"><tr><td class=time><time datetime="{{ segment.DepartureDateTime.toISOString() }}">{{ segment.DepartureDateTime | localizedTime }}</time><td><span data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class=itinerary_item_icon></span><td class=airport data-ng-bind-html=getDepartureAirport(segment.OriginStation)><tr><td><td><div class=blue_line></div><td class=carrier><img data-ng-src="{{getCarrierLogo(segment.OperatingCarrier, selectedFlight.outboundLeg)}}" height="40"><tr><td class=time><time datetime="{{ segment.ArrivalDateTime.toISOString() }}">{{ segment.ArrivalDateTime | localizedTime }}</time><td><span data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class=itinerary_item_icon></span><td class=airport data-ng-bind-html=getArrivalAirport(segment.DestinationStation)></table></section><section class=return><div>Inbound &#10142; {{selectedFlight.inboundLeg.segments[0].DepartureDateTime.format(\'{Dow} {Mon} {dd}\')}}</div><br><table data-ng-repeat="segment in selectedFlight.inboundLeg.segments"><tr><td class=time><time datetime="{{ segment.DepartureDateTime.toISOString() }}">{{ segment.DepartureDateTime | localizedTime }}</time><td><span data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class=itinerary_item_icon></span><td class=airport data-ng-bind-html=getDepartureAirport(segment.OriginStation)><tr><td><td><div class=blue_line></div><td class=carrier><img data-ng-src="{{getCarrierLogo(segment.OperatingCarrier, selectedFlight.inboundLeg)}}" height="40"><tr><td class=time><time datetime="{{ segment.ArrivalDateTime.toISOString() }}">{{ segment.ArrivalDateTime | localizedTime }}</time><td><span data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class=itinerary_item_icon></span><td class=airport data-ng-bind-html=getArrivalAirport(segment.DestinationStation)></table></section><a data-ng-href={{selectedFlight.itinerary.PricingOptions[0].DeeplinkUrl}} target=_blank id=book_button_{{$index}} class=book_button>Book</a><br><br><br><a data-ng-if=flights.length class=sky_scanner_logo href=http://www.skyscanner.net target=_blank>Powered by&nbsp;<span data-ng-include="\'/features/directions/img/flights/Skyscanner-Logo-Original.svg\'"></span></a></div>'), 
    a.put("features/directions/itineraryBar/itineraryBar.html", '<section id=itinerary_bar data-ng-class="{new_style: itineraryOverhaul}" class=header_content><section id=itinerary_view><ul id=itinerary_items_container data-ng-class="{collapse: waypointsCollapsed}" data-here-droppable="{list: itineraryItems, dropCallback: dropCallback}"><li data-ng-repeat="item in itineraryItems" data-ng-class="{\n                    stopover: !$first && !$last,\n                    with_selection: (itineraryItemIndex == $index) && ((suggestions &&\n                    suggestions.items && suggestions.items.length) || (recents && recents.length))\n                }" data-here-draggable="{item: item, index: $index, callback: dragCallback, validator: dragValidator}"><div class=itinerary_item data-ng-class="{\n                                with_waypoints: itineraryItems.length > 2,\n                                location:       item.geolocationModel || item.isMyLocation,\n                                location_error: item.locationError,\n                                via:            !$first && !$last\n                            }"><span data-ng-if=$first data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class="itinerary_item_icon from"></span> <span data-ng-if="!$first && !$last" data-ng-include="\'/features/directions/img/itineraryItems/to.svg\'" class="itinerary_item_icon to"></span> <span data-ng-if=$last data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class="itinerary_item_icon to"></span><form data-ng-submit=selectFromSearchList() data-ng-class="{focused : itineraryItemFocused && itineraryItemIndex === $index || \'\'}"><input id=itinerary_item_input_{{$index}} tabindex="{{$index + 1}}" placeholder={{item.label}} data-ng-class="{location: item.geolocationModel || item.isMyLocation}" data-ng-model=item.query data-ng-keydown=navigateSearchList($event) data-ng-change=cleanAndTriggerSuggestionList($index) data-ng-focus=triggerSuggestionsList($index) data-ng-blur="blurItineraryItem(item, $index)" data-here-autoselect><div class=itinerary_border></div></form><button data-ng-if="((itineraryItemIndex === $index && itineraryItemFocused) || item.isMyLocation) && !locationInRoute && (!item.query || item.query.length < 3)" data-ng-click=prepareSetMyLocation(itineraryItemIndex) class="btn btn_small btn_light btn_use_location" data-here-ios-touch-to-click>Use your current location</button> <button id=add_waypoint_btn data-ng-if="(itineraryOverhaul && $last && itineraryItems.length < maxItineraryItems) ||\n                                                ($last && itineraryItems.length < maxItineraryItems &&\n                                                 (itineraryItems[itineraryItems.length - 2].title !== null || itineraryItems.length === 2)&&\n                                                 (!itineraryItemFocused || (itineraryItemIndex !== $index && itineraryItemIndex !== $index - 1)))" title="Add a waypoint" data-ng-click=addWaypoint();expandStopovers(); data-here-svg="{path:\'/features/directions/img/itineraryItems/add_icon.svg\', color: \'#97A1AD\', hoverColor:\'#00b4e5\'}"></button> <button class=remove_waypoint_btn data-ng-if="!$last && !$first" title="Remove waypoint" data-ng-click="removeWaypoint({index: $index});" data-here-svg="{path:\'/features/directions/img/itineraryItems/remove_icon.svg\', color: \'#97A1AD\', hoverColor:\'#00b4e5\'}"></button></div><div data-ng-if="(itineraryItemIndex == $index) && !!((suggestions && suggestions.items) || (recents && recents.length))" data-ng-style="{zIndex: 102 + (recents && recents.length || 0) + (suggestions.items && suggestions.items.length || 0)}" class="dropdown_list flying_style" data-here-ios-touch-to-click><section data-ng-if="recents && recents.length"><h5>Recent</h5><div class="dropdown_list_item recents" data-ng-repeat="recent in recents" data-ng-class="{hovered: hoveredResultIndex == ($index - recents.length)}" data-ng-click="selectSearchElement(recent.data, \'recent\', itineraryItemIndex)" data-ng-mouseenter="hoverSuggestion($index - recents.length)"><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-ng-if=recent.data data-category={{recent.data.category}} data-color=#BFBFBF data-width=18 data-height=18></span> <span data-ng-bind-html="recent.data.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-if=recent.data.description data-ng-bind-html="recent.data.description | withoutBRs | markSubString:item.query"></span></div></section><section data-ng-if=suggestions.items><h5>Are you looking for...</h5><div data-ng-repeat="suggestion in suggestions.items" class="dropdown_list_item suggestion" data-ng-class="{hovered: hoveredResultIndex == $index}" data-ng-click="selectSearchElement(suggestion, \'suggestion\', itineraryItemIndex)" data-ng-mouseenter=hoverSuggestion($index)><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-category={{suggestion.category.id}} data-color=#BFBFBF data-width=14 data-height=14></span> <span data-ng-bind-html="suggestion.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-bind-html="suggestion.vicinity | withoutBRs | markSubString:item.query"></span></div></section></div></li></ul><button id=reverse_route_btn title="Reverse route" data-ng-if="itineraryOverhaul || (itineraryItems.length === 2 && !itineraryItemFocused)" data-ng-click=reverseRoute() data-here-svg="{path:\'/features/directions/img/itineraryItems/reverse_icon.svg\', color: \'#98A2AE\', hoverColor:\'#00b4e5\'}"></button><div data-ng-if="itineraryItems.length > 2" class=stopovers_summary data-ng-click="expandStopovers(); trackExpandStopoversClick();">Waypoints : {{itineraryItems.length - 2}}</div></section></section>'), 
    a.put("features/directions/maneuvers/car_pedestrian.html", '<section data-ng-controller=ManeuverPreviewCtrl><div data-ng-repeat="(legId, leg) in currentRoute.leg" class=car_pedestrian_container><div data-ng-repeat="(maneuverId, maneuver) in leg.maneuver" class=maneuver data-ng-class="{direction: !($first || $last), fixed: maneuver.id === fixatedManeuver, hover: maneuver.id === hoverManeuver }" data-ng-if="!(legId > 0 && maneuverId === 0)" data-ng-mouseenter=showRouteStepMarker(maneuver) data-ng-mouseleave=hideRouteStepMarker(maneuver) data-ng-click="maneuverDetails(maneuver); $event.stopPropagation()" data-ng-init="\n                 isFirstManeuver = ($first && legId === 0);\n                 isLastManeuver = ($last && legId === currentRoute.leg.length - 1);\n                 action = maneuver.action;\n                 isArrive = (action === \'arrive\');\n                 isDepart = (action === \'depart\');\n                 mode = currentRoute.mode.transportModes[0];\n                 isPedestrian = (mode === \'pedestrian\');\n                 time = (isPedestrian || isFirstManeuver) ? maneuver.time : (isArrive ? getDriveLegArriveTimeInclTraffic(currentRoute, legId) : \'\');\n                 iconAction = (action === \'rightRoundaboutPass\' || action === \'leftRoundaboutPass\' || action === \'nameChange\') ? \'continue\' : action"><time datetime="{{:: time.toISOString()}}">{{:: time | localizedTime }}</time><section class=line_icon><div data-ng-if=":: isFirstManeuver" class=depart data-here-svg="{path:\'/features/directions/img/itineraryItems/start_icon.svg\'}"></div><div data-ng-if=":: !isArrive && !isFirstManeuver && !isLastManeuver" class="midpoint {{:: mode}}"></div><div data-ng-if=":: isArrive && !isLastManeuver" class=way_point>{{:: legId + 1}}</div><div data-ng-if=":: isLastManeuver" class=arrive data-here-svg="{path:\'/features/directions/img/itineraryItems/destination_icon.svg\'}"></div></section><div data-ng-if=":: !isArrive && !isDepart" data-ng-bind-html=":: maneuverIcon(action)" class="maneuver_icon {{:: mode}}"></div><div class=instruction><div data-ng-if=":: isLastManeuver" class=line_cover style=background-color:#1584e2></div><div data-ng-if=":: !($last && !isLastManeuver)" data-ng-bind-html=":: maneuver.instruction | breakSlashedWords"></div><div data-ng-if=":: ($last && !isLastManeuver)"><span data-ng-bind-html=":: maneuver.instruction | breakSlashedWords"></span><br><span data-ng-bind-html=":: currentRoute.leg[legId + 1].maneuver[0].instruction | breakSlashedWords"></span></div></div></div></div></section>'), 
    a.put("features/directions/maneuvers/pt.html", "<section data-ng-controller=ptCtrl class=pt_container><div data-ng-repeat=\"maneuver in routeManeuvers\" class=maneuver data-ng-class=\"{'change_PT' : maneuver.action === 'change_PT'}\" data-ng-show=\"!maneuver.container || maneuver.container.expanded === true\"><time datetime=\"{{ maneuver.time.toISOString() }}\" data-ng-class=\"{'change_PT' : maneuver.action === 'change_PT'}\">{{ maneuver.time | localizedTime }}</time><section class=line_icon><div data-ng-if=$first class=depart data-here-svg=\"{path:'/features/directions/img/itineraryItems/start_icon.svg'}\"></div><div data-ng-if=\"\n                    maneuver.lineName === ''\n                    && !$first && !$last\n                    && maneuver.action !== 'arrive'\n                    && maneuver.action !== 'enter'\n                    && maneuver.previousAction !== 'enter'\n                    && maneuver.previousAction !== 'change_PT'\" class=midpoint></div><div data-ng-if=\"maneuver.action === 'change_PT'\" class=midpoint data-ng-style=\"{backgroundColor: maneuver.lineColor, outlineColor: '#f5f5f5'}\"></div><div data-ng-if=\"\n                       (maneuver.lineName !== '' && maneuver.previousAction !== 'enter'     && maneuver.previousAction !== 'change_PT' && maneuver.action === 'enter')\n                    || (maneuver.lineName === '' && maneuver.previousAction === 'enter'     && maneuver.action === 'continue')\n                    || (maneuver.lineName === '' && maneuver.previousAction === 'change_PT' && maneuver.action === 'continue')\" class=midpoint_pt data-ng-style=\"{borderColor: maneuver.lineColor}\"></div><div data-ng-if=\"maneuver.action === 'arrive' && maneuver.legId < currentRoute.leg.length - 1\" class=way_point>{{ maneuver.legId + 1 }}</div><div data-ng-if=\"maneuver.action === 'enter' && (maneuver.previousAction === 'enter' || maneuver.previousAction === 'change_PT')\" data-here-svg=\"{path:'/features/directions/img/maneuversList/change.svg'}\" class=change></div><div data-ng-if=$last class=arrive data-here-svg=\"{path:'/features/directions/img/itineraryItems/destination_icon.svg'}\"></div></section><div class=instruction data-ng-style=\"{borderColor: maneuver.action === 'continue' && ptWalkSegmentColor || maneuver.lineColor}\"><div data-ng-if=\"!$first && !maneuver.container\" class=line_cover data-ng-style=\"{backgroundColor: (maneuver.action === 'arrive' || maneuver.previousAction === 'continue') && ptWalkSegmentColor || maneuver.previousLineColor}\"></div><div data-ng-if=maneuver.instructionPrefix data-ng-bind-html=maneuver.instructionPrefix data-ng-style=\"{color: maneuver.lineColor}\"></div><div data-ng-bind-html=maneuver.instruction data-ng-style=\"{color: maneuver.container && maneuver.lineColor || 'inherit'}\"></div></div><section data-ng-if=\"maneuver.middlePointsData.points.length > 1\" class=middle_points_summary data-ng-click=\"maneuver.expanded = !maneuver.expanded\"><div class=\"instruction middle_points\" data-ng-style=\"{borderColor: maneuver.lineColor, color: maneuver.lineColor}\"><div data-here-click-tracker=routing:ptSegment:click><button data-ng-if=maneuver.expanded class=show_hide_middle_points_button data-ng-include=\"'/features/directions/img/maneuversList/collapse.svg'\" data-here-click-tracker=directions:panel:ptSegments:click></button> <button data-ng-if=!maneuver.expanded class=show_hide_middle_points_button data-ng-include=\"'/features/directions/img/maneuversList/expand.svg'\" data-here-click-tracker=directions:panel:ptSegments:click></button></div><div class=icon data-ng-include=maneuver.middlePointsData.iconPath data-ng-style=\"{fill: maneuver.lineColor}\"></div><div class=description><div data-ng-bind=maneuver.middlePointsData.lineName></div><span data-ng-bind-html=\"maneuver.middlePointsData.baseTime | readableTimeSpan\"></span></div></div></section></div></section><div class=attribution_text><span data-ng-if=currentRoute.publicTransportAttribution data-ng-bind-html=\"currentRoute.publicTransportAttribution.attribution | linksInNewTab\"></span><div data-ng-if=\"currentRoute.publicTransportAttribution.supplier && currentRoute.publicTransportAttribution.supplier.length > 0\" data-ng-repeat=\"supplier in currentRoute.publicTransportAttribution.supplier\"><div data-ng-if=\"supplier.note && supplier.note.length > 0\" data-ng-repeat=\"note in supplier.note\"><span data-ng-bind-html=\"note.text | linksInNewTab\"></span></div></div><span data-ng-if=\"!currentRoute.publicTransportAttribution && operators !== ''\">Public transport info provided by {{operators}}.<br/>All information is presented without warranty of any kind.</span></div>"), 
    a.put("features/directions/print.html", '<div class=print_controller><section class=print_header><img class=logo src=/img/blue_logo.svg height=50 width="50"> <img class=transport_mode_icon src={{transportIcon}} height=26 width="26"><div id=summary><div class=route_description><span>{{itinerary[0].title}} -</span><br><span>{{itinerary[itinerary.length - 1].title}}</span></div><div class=route_segments><ul data-ng-if="currentRoute.mode.transportModes[0] === \'car\'"><li data-ng-show="segments.length > 0"><span class="segment via">via</span> <span class="segment car" data-ng-class="{car_wide: !segments[0].nextRoadNumber && segments[0].nextRoadName}" title="{{ !segments[0].nextRoadNumber && segments[0].nextRoadName || \'\' }}">{{ segments[0].nextRoadNumber || segments[0].nextRoadName }}</span> <span data-ng-if="segments[1] && segments[1].nextRoadNumber" class=bullet>•</span> <span data-ng-if="segments[1] && segments[1].nextRoadNumber" class="segment car">{{ segments[1].nextRoadNumber }}</span></li></ul><ul data-ng-if="currentRoute.mode.transportModes[0] === \'pedestrian\'"><li><span data-ng-if=!weather class="segment weather spinner" data-here-spinner=small></span> <span data-ng-if=weather class="segment weather" data-weather-icon data-icon-name="{{ weather.localConditions.iconName }}" data-daylight="{{ weather.localConditions.daylight }}">{{ weatherString }}</span></li></ul><ul data-ng-if="currentRoute.mode.transportModes[0].indexOf(\'publicTransport\') === 0"><li data-ng-repeat="segment in segments track by $index"><span data-ng-if="segment.type === \'pedestrian\'" class="segment {{segment.type}}" data-here-svg="{path: segment.icon, color:\'#000000\'}">&nbsp;</span><span data-ng-if="segment.type !== \'pedestrian\'" class="segment {{segment.type}}" title={{segment.title}} data-ng-style="{backgroundColor: segment.color || \'black\', border: \'1px solid \' + segment.color}">{{segment.title}}</span><span data-ng-if=!$last class=bullet>•</span></li></ul></div><div class=route_stats><time data-ng-init="value = (currentRoute.summary.trafficTime || currentRoute.summary.baseTime)" title=duration class=duration datetime="{{ value | hereIsoDuration }}" data-ng-bind-html="value | readableTimeSpan:true"></time> | <span class=distance>{{currentRoute.summary.distance | distance:distanceUnit:1}}</span></div></div><button class="btn btn_simple print" data-ng-click=print() data-here-svg="{ path: \'/features/directions/img/printer.svg\', color:\'#00c9ff\', hoverColor:\'#00b4e5\'}">Print</button></section><section class=maneuvers_container><section data-ng-if="transportMode !== \'publicTransportTimeTable\'" data-ng-include="\'features/directions/maneuvers/car_pedestrian.html\'"></section><section data-ng-if="transportMode === \'publicTransportTimeTable\'" data-ng-include="\'features/directions/maneuvers/pt.html\'"></section></section></div>'), 
    a.put("features/directions/route-legend.html", "<div class=traffic_legend><span class=title>Traffic:</span> <span><span class=light></span>Light</span> <span><span class=medium></span>Moderate</span> <span><span class=heavy></span>Heavy</span> <span><span class=stopped></span>Stopped</span></div>"), 
    a.put("features/directions/route-preferences.html", '<div class=preferences_divider></div><div class=route_options data-ng-class="{expanded: isOptionsExpanded}"><button class=options_tab data-here-svg="{path:\'/img/gear.svg\', color:\'#00b4e5\'}" data-ng-class="{active: isOptionsExpanded}" data-ng-click="resetRouteOptions(); toggleTab(\'options\');" data-here-click-tracker=routing:options:click><span>Options</span> <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button> <span class=line_cover></span><div class=options><ul><li data-ng-repeat="option in routeOptions" data-ng-if="option.mode.indexOf(getActiveTransportModes()[0].type) !== -1"><label data-ng-class="{active: option.checked}"><span data-here-category-icon data-category="{{ option.icon }}"></span> <input id="{{ option.icon }}" type=checkbox data-ng-model=option.checked> {{ option.label }}</label></li></ul><div class=scale data-ng-class="{ \'imperial_uk_us\': isImperialUKUS }"><span data-ng-if=!isImperialUKUS class=title>Units:</span><div data-ng-if=isImperialUKUS class="scale_controls imperial_uk_us"><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="metric"> <span class=unit>Metric <span class=unit_desc>Metres, Kilometres</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="imperialGB"> <span class=unit>Imperial UK <span class=unit_desc>Yards, Miles</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="imperialUS"> <span class=unit>Imperial US <span class=unit_desc>Feet, Miles</span></span></label></div><div data-ng-if=!isImperialUKUS class=scale_controls><label><input type=radio name=scale value=miles data-ng-model=conf.routeUnits> Miles</label><br class=only_for_small_screens><label><input type=radio name=scale value=kilometers data-ng-model=conf.routeUnits> Kilometres</label></div></div><div class=form_buttons data-ng-class="{ \'imperial_uk_us\': isImperialUKUS }"><button class="btn btn_full" data-ng-click="saveRouteOptions(); toggleTab(\'options\');" data-here-click-tracker=routing:options:save:click>Save</button> <button class="btn btn_light" data-ng-click="resetRouteOptions(); toggleTab(\'options\');">Cancel</button></div></div></div><div class=future_route data-ng-class="{expanded: isTimeDateExpanded}"><button class=time_date_tab data-here-svg="{path:\'/img/pdc/clock.svg\', color:\'#00b4e5\'}" data-ng-class="{active: isTimeDateExpanded}" data-ng-click="preserveOrRestoreDateTimeOptions(); toggleTab(\'timeDate\');" data-here-click-tracker=routing:futureRoute:click><span>Time and date</span> <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button> <span class=line_cover></span><div class=options><section class=time><span class=title>Time:</span> <input data-ng-model=$parent.$parent.routeDateTime class=time-input data-filter-time-value data-ng-change="$parent.$parent.preferencesOnTimeChange()"><br><label data-ng-repeat="selector in timeSelectors" data-ng-hide="selector.value === \'arriveBy\' && getActiveTransportModes()[0].type !== \'publicTransportTimeTable\'"><input type=radio name=timeSelector value="{{ selector.value }}" data-ng-model="$parent.$parent.timeSelector"> {{ selector.label }}</label></section><section><span class=title>Date:</span><quick-datepicker name=date data-ng-model=$parent.$parent.routeDate data-time-format={{timeFormat}} data-date-format={{dateFormat}} date-filter=onlyFutureDates disable-timepicker=true data-on-change="resetDepartNow(timeSelector, routeDate);" required></quick-datepicker></section><section><button class="btn btn_full" data-ng-click="saveDateTimeOptions(routeDate, timeSelector); toggleTab(\'timeDate\')" data-here-click-tracker=routing:futureRoute:save:click>Save</button> <button class="btn btn_light" data-ng-click="restoreDateTimeOptions(); toggleTab(\'timeDate\')">Cancel</button></section></div></div>'), 
    a.put("features/directions/route-settings.html", '<section class=c2a><button data-here-svg="{path:\'/img/pdc/clock.svg\', color:\'#00b4e5\'}" data-ng-class="{active: isTimeDateExpanded}" data-ng-click="preserveOrRestoreDateTimeOptions(); toggleTab(\'timeDate\');" data-here-click-tracker=routing:futureRoute:click class="time_date_tab reset_defaults icon"><span>Time and date</span> <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button> <button data-here-svg="{path:\'/img/gear.svg\', color:\'#00b4e5\'}" data-ng-class="{active: isOptionsExpanded}" data-ng-click="resetRouteOptions(); toggleTab(\'options\');" data-here-click-tracker=routing:options:click class="options_tab reset_defaults icon"><span>Options</span> <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button></section><section data-ng-if=featureCommute class=route_details_c2a><h2>Route details</h2><button data-ng-class="{active: isCommuteExpanded && !confirmSaveShow, disabled: confirmSaveShow}" data-ng-click="toggleTab(\'commute\');" class="commute_tab reset_defaults">Store journey <span class=arrow_down data-ng-include="\'/img/core_down.svg\'"></span></button> <button data-ng-click=printRoute() class="reset_defaults print">Print</button></section><div class=commute_options data-ng-class="{expanded: isCommuteExpanded}"><div class=options data-ng-show="!confirmSaveShow && (recentCommutes.length <= 4)"><div class=commuteName><input id=commuteName placeholder="e.g., \'Work to home\'" name=commuteName ng-model="commuteName"></div><div class=commute_card><div class=icon data-ng-class="{active: mode.active, car: mode.type==\'car\', pt: mode.type==\'publicTransportTimeTable\', pedestrian: mode.type==\'pedestrian\', flight: mode.type==\'flight\'}" data-ng-repeat="mode in transportModes" data-here-svg="{path: mode.icon, color:\'#e7e7e7\'}"></div><span data-ng-if="!commute.storedRoute.name && !commuteName" class=name>{{itineraryItems[0].query | substring}} - {{itineraryItems[itineraryItems.length - 1].query | substring}}</span> <span data-ng-if=commute.storedRoute.name class=name>{{commute.storedRoute.name}}</span> <span data-ng-if=commuteName class=name>{{commuteName}}</span></div><div class=form_buttons><button class="btn btn_light cancel" data-ng-click="resetCommute(); toggleTab(\'commute\');">Cancel</button> <button class="btn btn_full done" data-ng-click=saveCommute(commuteName);>Done</button></div></div><div class=options data-ng-show="recentCommutes.length >= 5"><h3>{{ msgLimitReached }}</h3></div><div data-ng-show=confirmSaveShow class="confirmation save_commute"><div><div>Select \'Routes\' to see your stored journeys</div><a class=btn_directions data-here-svg="{path:\'/img/directions.svg\', color: \'#273142\', hoverColor:\'#00c9ff\'}" href="/directions/?x=ep">Routes</a></div></div></div><div class=route_options data-ng-class="{expanded: isOptionsExpanded}"><div class=options><ul><li data-ng-repeat="option in routeOptions" data-ng-if="option.mode.indexOf(getActiveTransportModes()[0].type) !== -1"><label data-ng-class="{active: option.checked}"><span data-here-category-icon data-category="{{ option.icon }}"></span> <input id="{{ option.icon }}" type=checkbox data-ng-model=option.checked> {{ option.label }}</label></li></ul><div class=scale data-ng-class="{ \'imperial_uk_us\': isImperialUKUS }"><span data-ng-if=!isImperialUKUS class=title>Units:</span><div data-ng-if=isImperialUKUS class="scale_controls imperial_uk_us"><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="metric"> <span class=unit>Metric <span class=unit_desc>Metres, Kilometres</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="imperialGB"> <span class=unit>Imperial UK <span class=unit_desc>Yards, Miles</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=conf.routeUnits value="imperialUS"> <span class=unit>Imperial US <span class=unit_desc>Feet, Miles</span></span></label></div><div data-ng-if=!isImperialUKUS class=scale_controls><label><input type=radio name=scale value=miles data-ng-model=conf.routeUnits> Miles</label><br class=only_for_small_screens><label><input type=radio name=scale value=kilometers data-ng-model=conf.routeUnits> Kilometres</label></div></div><div class=form_buttons data-ng-class="{ \'imperial_uk_us\': isImperialUKUS }"><button class="btn btn_full" data-ng-click="saveRouteOptions(); toggleTab(\'options\');" data-here-click-tracker=routing:options:save:click>Save</button> <button class="btn btn_light" data-ng-click="resetRouteOptions(); toggleTab(\'options\');">Cancel</button></div></div></div><div class=future_route data-ng-class="{expanded: isTimeDateExpanded}"><div class=options><section class=time><span class=title>Time:</span> <input data-ng-model=$parent.routeDateTime class=time-input data-filter-time-value data-ng-change="$parent.preferencesOnTimeChange()"><br><label data-ng-repeat="selector in timeSelectors" data-ng-hide="selector.value === \'arriveBy\' && getActiveTransportModes()[0].type !== \'publicTransportTimeTable\'"><input type=radio name=timeSelector value="{{ selector.value }}" data-ng-model="$parent.$parent.timeSelector"> {{ selector.label }}</label></section><section><span class=title>Date:</span><quick-datepicker name=date data-ng-model=$parent.routeDate data-time-format={{timeFormat}} data-date-format={{dateFormat}} date-filter=onlyFutureDates disable-timepicker=true data-on-change="resetDepartNow(timeSelector, routeDate);" required></quick-datepicker></section><section><button class="btn btn_full" data-ng-click="saveDateTimeOptions(routeDate, timeSelector); toggleTab(\'timeDate\')" data-here-click-tracker=routing:futureRoute:save:click>Save</button> <button class="btn btn_light" data-ng-click="restoreDateTimeOptions(); toggleTab(\'timeDate\')">Cancel</button></section></div></div>'), 
    a.put("features/directions/routeCard/route-card.html", '<li data-ng-click=setRouteOnClick($index) data-ng-mouseenter=hoverRouteAlternative($index) data-ng-mouseleave=leaveRouteAlternative() data-ng-class="{\n        new_route_card: true,\n        \'{{route.mode.transportModes[0]}}\': true,\n        current: currentRouteIndex == $index,\n        incidents: availableRoutesTrafficIncidents[$index],\n        no_segments: segments.length === 0}" data-here-click-tracker=routing:routecard:click><div class=route_type><span class=route_type_drive data-ng-include="\'/features/directions/img/routeCard/route_type_drive.svg\'"></span> <span class=route_type_walk data-ng-include="\'/features/directions/img/routeCard/route_type_walk.svg\'"></span> <span class=route_type_pt data-ng-include="\'/features/directions/img/routeCard/route_type_pt.svg\'"></span></div><div class=incident_mark data-ng-include="\'/services/markerIcons/containers/route-incident.svg\'"></div><div class=best_route>Best</div><time data-ng-init="value = (route.summary.trafficTime || route.summary.baseTime)" title=duration class=duration datetime="{{ value | hereIsoDuration }}" data-ng-bind-html="value | readableTimeSpan:true"></time> <time class=delay data-ng-bind-html=getCarRouteDelayTimeString(route)></time><div class=changes><span data-ng-include="\'/features/directions/img/routeCard/changes.svg\'"></span> <span>{{route.publicTransportLine.length - 1 | atLeast:0}}</span></div><div class=time_span><time datetime="{{ getDepartTime(route).toISOString() }}">{{ getDepartTime(route) | localizedTime }}</time> <span class=bullets>•&thinsp;•</span> <time datetime="{{ getArriveTime(route).toISOString() }}">{{ getArriveTime(route) | localizedTime }}</time></div><div class=distance>{{route.summary.distance | distance:distanceUnit:1}}</div><div class=triangle></div><div class=route_segments><ul data-ng-if="route.mode.transportModes[0] === \'car\'"><li data-ng-show="segments.length > 0"><span class="segment via">via</span> <span class="segment car" data-ng-class="{car_wide: !segments[0].nextRoadNumber && segments[0].nextRoadName}" title="{{ !segments[0].nextRoadNumber && segments[0].nextRoadName || \'\' }}">{{ segments[0].nextRoadNumber || segments[0].nextRoadName }}</span> <span data-ng-if="segments[1] && segments[1].nextRoadNumber" class=bullet>•</span> <span data-ng-if="segments[1] && segments[1].nextRoadNumber" class="segment car">{{ segments[1].nextRoadNumber }}</span></li></ul><ul data-ng-if="route.mode.transportModes[0] === \'pedestrian\'"><li><span data-ng-if=!weather class="segment weather spinner" data-here-spinner=small></span> <span data-ng-if=weather class="segment weather" data-weather-icon data-icon-name="{{ weather.localConditions.iconName }}" data-daylight="{{ weather.localConditions.daylight }}">{{ weatherString }}</span></li></ul><ul data-ng-if="route.mode.transportModes[0].indexOf(\'publicTransport\') === 0"><li data-ng-repeat="segment in segments track by $index"><span data-ng-if="segment.type === \'pedestrian\'" class="segment {{segment.type}}" data-here-svg="{path: segment.icon, color:\'#000000\'}">&nbsp;</span><span data-ng-if="segment.type !== \'pedestrian\'" class="segment {{segment.type}}" title={{segment.title}} data-ng-style="{backgroundColor: segment.color || \'black\', border: \'1px solid \' + segment.color}">{{segment.title}}</span><span data-ng-if=!$last class=bullet>•</span></li></ul></div></li>'), 
    a.put("features/discover/discover.html", '<div data-ng-controller=DiscoverCtrl><header class=header_content data-here-header="{weather: true, currentLocation: true, smoothImageRotation: true, origin: &quot;discover&quot;}" data-temperature-unit=temperatureUnit></header><section class=scrollable_content data-here-scrollable data-here-collapsed-element=.panel id=discoverGrid><section class=results data-ng-if=exploreResults><div data-explore-results=exploreResults data-here-discover-grid="{ boxOver: boxOver, boxOut: boxOut, boxClick: boxClick }"></div></section></section></div>'), 
    a.put("features/feedback/feedbackForm.html", "<div class=feedback_form data-ng-controller=FeedbackCtrl><h2>Feedback</h2><div class=line></div><button class=\"btn_simple user_voice\" type=button data-ng-click=showUserVoice() data-here-svg=\"{ path: '/img/icons/message.svg', color:'#00aad9', hoverColor:'#00b4e5' }\" data-here-click-tracker=feedback:uservoice:click>Send feedback</button> <button class=\"btn_simple nps\" type=button data-ng-disabled=NPS.npsBtnDisabled data-ng-class=\"{active: !NPS.npsBtnDisabled}\" data-ng-click=showNPS() data-here-svg=\"{ path: '/img/icons/feedback.svg', color:'#d6d6d6', hoverColor:'#00b4e5' , activeColor: '#00aad9'}\" data-here-click-tracker=feedback:NPS:click>Give us a score</button> <button class=\"btn_simple report_problem\" type=button data-ng-if=isReportProblemEnabled data-ng-click=showReportMapProblem() data-here-svg=\"{ path: '/img/icons/report_problem.svg', color:'#00aad9', hoverColor:'#00b4e5' }\" data-here-click-tracker=feedback:mapfeedback:click>Report a map problem</button></div>"), 
    a.put("features/landingPage/landingPage.html", '<div data-ng-controller=LandingPageCtrl data-here-scrollable data-here-collapsed-element=.panel><header class=header_content data-here-header="{weather: true, currentLocation: true, photo: false, origin: &quot;home&quot;}" data-temperature-unit=temperatureUnit></header></div>'), 
    a.put("features/nps/nps.html", '<div class=nps data-ng-controller=NPSCtrl data-ng-show=nps.show id=npssurvey><h2>Give feedback</h2><p class=secondary>How likely are you to recommend here.com to a friend or colleague?</p><div class="here-nps nps-vote"><div class=nsp-rating-no><p class=value data-ng-bind="(score !== \'\' ? score : \'&nbsp;\' )"></p><p class=left>0</p><p class=right>10</p></div><div class=nps-bar><div data-nps-bar></div></div><div class=nsp-rating><p class=left>Not at all likely</p><p class=right>Extremely likely</p></div></div><div class=line></div><div class="here-nps info"><label>Why did you give that score?</label><form id=nps-comment-form data-ng-submit=validateFrom() method=post class=nps-form><fieldset><div><textarea rows=4 data-ng-model=comment tabindex=1 placeholder="Your comments (optional)">\n                        \n                    </textarea></div><div class="form_group clearfix"><input type=checkbox name=nps-check-email tabindex=2 value=true id=nps-check-email data-ng-model="checked"><label for=nps-check-email>Tick the box if we may contact you to follow up.</label></div><div class=form_group data-ng-show=checked><input data-ng-model=email class=email placeholder="Your email (to contact you)" tabindex=3 name=nps-email data-ng-disabled="!checked"></div></fieldset><button class="btn btn_full full_width" tabindex=4 data-ng-disabled=isSubmitDisabled type=submit>Send</button></form><p class=nps-terms-link>Your information will be processed according to our <a href="http://www.here.com/privacy/privacy-policy/" data-ng-href="http://www.here.com/privacy/privacy-policy/{{langParams}}" target="_blank" class="highlight">Privacy Policy</a>.</p></div></div>'), 
    a.put("features/nps/npsConfirm.html", '<div class="nps nps_confirm" data-here-expose-services=$location,User><h2>Thanks</h2><p class=secondary>Your feedback was sent.</p><p class="secondary message">Your opinion of here.com means a lot to us.</p><div data-ng-if="popup.score >= 7 && User.locale.language === \'en\'"><p class="secondary message">You can share your love on Facebook:</p><p class="secondary message facebook"><iframe class=fb-like data-here-facebook-like-src="\'https://www.facebook.com/here\'" scrolling=no frameborder=0 allowtransparency=true seamless></iframe><span class=fb-share-button data-here-facebook-href="\'https://www.here.com/?map=\' + $location.search().map" data-layout=button></span></p></div><button class="btn btn_full full_width" data-ng-click=closePopover()>OK</button></div>'), 
    a.put("features/photoGallery/container.html", '<div class=photo_gallery data-ng-class="{photo_gallery_single: currentPhoto}" data-ng-controller=PhotoGalleryCtrl><header><div class=photo_gallery_header><div></div><div class=photo_gallery_headline><h1>{{ place.name }}</h1></div><div><button class="btn btn_full btn_icon_notext btn_gallery_grid" data-ng-disabled=isGridBtnDisabled() data-ng-click=showAllPhotos() data-here-click-tracker=photoGallery:gridButton:click data-here-svg="{path:\'/img/pdc/gallery-grid.svg\', color:\'#fff\', hoverColor:\'#fff\', activeColor: \'#fff\', disabledColor: \'#000\'}">Photo gallery</button></div></div><div class=photo_gallery_subline><span data-ng-if=currentPhoto>{{ currentIndex }} of {{ photosCount }}</span> <span data-ng-if="allPhotos && !currentPhoto">Photos: {{ photosCount }}</span><div data-ng-if="allPhotos && !currentPhoto" class=progress data-ng-class="{finished: loadedPhotos/photosCount === 1}"><div data-ng-style="{width: (loadedPhotos/photosCount*100) + \'%\'}"></div></div></div></header><div class=notifications_container data-ng-show=currentPhoto><div data-notification-box data-notification-type=info data-show-notification=reportSuccess data-svg-color=#00AAD9 data-notification-hide-after=5000>Thanks for letting us know. We\'ll get right on it.</div></div><div class=photo_grid data-ng-include="\'features/photoGallery/grid.html\'" data-ng-if="allPhotos && !currentPhoto"></div><div class=single_photo data-ng-include="\'features/photoGallery/singlePhoto.html\'" data-ng-show=currentPhoto data-ng-class="{report_photo: reportDisplay}"></div></div>'), 
    a.put("features/photoGallery/grid.html", '<ul><li ng-repeat="photo in allPhotos" data-ng-style="{\'background-image\': \'url(\'+ (photo.dimensions[photoThumbDim] | ensureHTTPS) +\')\'}" data-here-image=photo data-here-image-attribution="" data-ng-class="photo.isAvailable ? \'photo_gallery_grid photo_\' + ($index + 1) + \' show_attribution\' : \'photo_gallery_grid photo_\' + ($index + 1)"><button data-ng-click=showPhoto($index) class="btn_simple ghost_image"><img data-ng-src="{{photo.dimensions[photoThumbDim] | ensureHTTPS}}" data-here-onload=onloadPhoto($index) data-here-onerror="onerrorPhoto($index)"></button></li></ul>'), 
    a.put("features/photoGallery/photo.html", '<div><div class=photo data-ng-if=photo data-ng-class="{show_photo: imageWasLoaded}" data-here-image-attribution=full data-here-image=photo><img data-ng-src={{photoSrc}} alt=""></div><div data-ng-if="imageHasReportLink && imageWasLoaded" class=report_link_container><button class="btn_simple report_link" data-ng-click=onReportLinkClick()>Report this image</button></div></div>'), 
    a.put("features/photoGallery/singlePhoto.html", "<aside class=\"arrow_button left\"><button data-ng-click=showPreviousPhoto() data-ng-if=isPreviousBtnVisible() data-here-svg=\"{path:'/img/arrow.svg', color:'#00b4e5'}\">previous</button></aside><div class=container><div data-ng-show=!reportDisplay data-here-svg=\"{path:'/img/photoGallery/image-placeholder.svg', color:'#D0D0D0'}\"><div data-photo=currentPhoto></div></div><section data-ng-show=reportDisplay data-report-form=reportLink data-error-message=\"Your report wasn't sent. Please try again.\" data-on-abort=onReportPhotoCancelled() data-on-success=onReportPhotoSuccess()></section></div><aside class=\"arrow_button right\"><button data-ng-click=showNextPhoto() data-ng-if=isNextBtnVisible() data-here-svg=\"{path:'/img/arrow.svg', color:'#00b4e5'}\">next</button></aside>"), 
    a.put("features/places/pdcModules/pdcModuleAbout/pdcModuleAbout.html", '<section data-ng-if="(place.extended || place.location) && editorials.length" class=pdc_about id=pdc_about><h2>{{title}}</h2><article ng-repeat="edito in editorials" data-ng-class="{only_child: editorials.length === 1}"><p data-here-read-more={{edito.description}} data-here-read-more-max=500 data-here-read-less-scroll-to="{container: \'.pdc_content_container\', threshold:10, margin:-120, selectorToScroll:\'#pdc_about\'}"></p><div class=provider data-ng-style="{ \'background-image\': \'url(\' + (edito.supplier.icon | ensureHTTPS) + \')\' }" data-ng-bind-html="edito.attribution | linksInNewTab" data-track-anchor-clicks=pdc:AttributionLink:click></div></article></section>'), 
    a.put("features/places/pdcModules/pdcModuleAdditionalResources/pdcModuleAdditionalResources.html", '<section data-ng-if=place.media.links.length id=pdc_additional_resources><h2>More info</h2><div class=pdc_section_content><ul><li data-ng-repeat="link in place.media.links.imaginary"><a href="{{ link.url }}" target=_blank><img src="{{ link.supplier.icon }}">{{ link.supplier.title }}</a></li></ul></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleAmenities/pdcModuleAmenities.html", '<section data-ng-if=amenities.length id=pdc_amenities><h2>Facts & features</h2><dl class=clearfix data-ng-repeat="amenity in amenities | limitTo: limit"><dt>{{amenity.label}}:<dd>{{amenity.text | withoutBRs}}</dl><div data-ng-if=isMoreToDisplay() class=action_wrapper><button class="btn btn_small btn_light btn_icon_notext" data-ng-class="{flip_vertical: isEverythingDisplayed()}" data-ng-click=toggleDisplay() data-here-svg="{ path: \'/img/core_down.svg\', color:\'#00b4e5\', hoverColor:\'#fff\' }">{{isEverythingDisplayed() ? "See less" : "See more"}}</button></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleArticles/pdcModuleArticles.html", '<section id=pdc_articles data-ng-if=place.media.articles.filteredItems.length class="pdc_articles section_full_width" data-ng-class={short_data:shortData()}><h2>From the press</h2><div class=section_wrapper><article class=pdc_article itemscope itemtype=http://schema.org/Article data-ng-repeat="article in place.media.articles.filteredItems | limitTo:displayCount"><div class=pdc_article_supplier data-ng-if=article.supplier.title>{{ article.supplier.title }}</div><h3 data-ng-if=article.title data-ng-bind-html=article.title></h3><p class=pdc_article_description itemprop=description><span data-ng-bind-html=article.description></span> <a class=pdc_article_link_full href="{{ article.via.href }}" target=_blank>Read full article</a></p></article></div><div class=action_wrapper data-ng-if=!shortData()><button class="btn btn_small btn_light btn_icon_notext" data-ng-class="{flip_vertical: isEverythingDisplayed()}" data-ng-click=toggleDisplay() data-here-svg="{ path: \'/img/core_down.svg\', color:\'#00b4e5\', hoverColor:\'#fff\' }">{{isEverythingDisplayed() ? "See less" : "See more"}}</button></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleFacebook/pdcModuleFacebook.html", '<section data-ng-if="fbLikeButtonEnabled && (facebookUrl || place.view)" id=pdc_facebook class="pdc_facebook alternate_section"><div class=fb-facepile data-ng-if=facebookUrl data-here-facebook-href=facebookUrl data-max-rows=1 data-colorscheme=dark data-size=small data-show-count=true></div><iframe class="fb-like {{locale}}" data-ng-if=facebookUrl data-here-facebook-like-src=facebookUrl scrolling=no frameborder=0 allowtransparency=true seamless></iframe><div class=fb-share-button data-here-facebook-href=place.view data-layout=button></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleInfo/pdcModuleInfo.html", '<section data-ng-if="place.extended || address" class=pdc_extended_information id=pdc_extended_information data-here-expose-services=Features,splitTesting><h2>Information</h2><div class=information_section><dl class="fluid_block category_block" data-ng-repeat="array in infoArrays"><dt>{{ array.label }}<dd>{{ array.items }}</dl><dl class="fluid_block rating_block" data-ng-if=rating><dt>Rating<dd itemprop=aggregateRating itemscope itemtype=http://schema.org/AggregateRating><div class=rating data-here-review-rate-icon data-here-rating="{{ rating.average }}"><meta itemprop=ratingValue content="{{ rating.average }}"></div><span class=rating_count>(Ratings: <span itemprop=ratingCount>{{rating.count}}</span>)</span></dl><dl class="fluid_block opening_times" data-ng-if=place.extended.openingHours><dt>Opening hours<dd>{{place.extended.openingHours.text | htmlToPlaintext:\', \' }}</dl><dl class="fluid_block prices" data-ng-if="place.extended.price || bookHotelLink"><dt>Price<dd><span data-ng-if=place.extended.price>{{place.extended.price.text | htmlToPlaintext:\', \' }} <span data-ng-if=place.extended.price.starsOff class=price_range_off>{{ place.extended.price.starsOff }}</span></span> <span data-ng-if=bookHotelLink><br data-ng-if=place.extended.price><a target=_blank data-here-action-tracker="{page: \'pdc\', action: \'See current prices and book\'}" data-ng-href="{{ bookHotelLink }}">See current prices and book</a></span></dl><dl class="fluid_block address" data-ng-if=address><dt>Address<dd data-ng-bind-html=address></dl><dl class="fluid_block phone" data-ng-if=place.contacts.phone.length><dt>Phone<dd data-ng-repeat="phone in place.contacts.phone" itemprop=telephone><div>{{phone.value | htmlToPlaintext:\', \' }}</div></dl><dl class="fluid_block website" data-ng-if=place.contacts.website.length><dt>Website<dd class=website data-ng-repeat="website in place.contacts.website" itemprop=url><a data-ng-href={{website.value}} target=_blank data-here-click-tracker=pdc:WebsiteLink:click>{{website.value | htmlToPlaintext:\', \' }}</a></dl><dl class="fluid_block email" data-ng-if=place.contacts.email.length><dt>Email<dd data-ng-repeat="email in place.contacts.email" itemprop=email><div><a data-ng-href=mailto:{{email.value}} target=_top>{{email.value | htmlToPlaintext:\', \' }}</a></div></dl><dl data-ng-if=ptStations.length class="fluid_block pt public_transport fadein"><dt>Transport nearby<dd><div data-ng-if=!ptStations data-here-spinner=small class=pdc_spinner></div><div data-ng-repeat="station in ptStations" ng-show="$index === 0 || showAllPT"><div class=vicinity>{{station.vicinity}} <button class="btn_simple walk_time" data-ng-click=showPTRoute(station) data-here-click-tracker=pdc:MinutesWalkLink:click>{{station.walkTime}}</button></div><div><span data-ng-if=ptImprovements data-ng-repeat="line in station.stationsExtended | limitTo:6" class=pt_station data-ng-style=line.style>{{line.name}}</span> <span data-ng-if=!ptImprovements data-ng-repeat="line in station.stations | limitTo:6" class=pt_station>{{line}}</span></div></div><button class=btn_simple data-ng-if="ptStations.length > 1" data-ng-click=switchShowAllPT(); data-ng-class="showAllPT ? \'see_less\' : \'see_more\' "><span data-ng-if=showAllPT data-here-scroll-to="{container: \'.pdc_content_container\', threshold:10, margin:0, selectorToScroll: \'#pdc_extended_information\'}">See less</span> <span data-ng-if=!showAllPT>See more</span></button></dl><div class=report_place data-ng-if=reportingEnabled><button class="btn_simple poi" data-ng-click=openReportPlace(place) data-ng-if=place.report.href data-here-click-tracker=pdc:ReportPlace:click>{{place.report.title}}</button> <button class="btn_simple location" data-ng-click=openReportPlace(place) data-ng-if=isLocation data-here-click-tracker=pdc:mapfeedback:click>Report a map problem</button></div></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleLatest/pdcModuleLatest.html", '<section id=pdc_latest class=pdc_latest data-ng-if=latest.isAvailable><h2>The latest...</h2><div class=pdc_section_content><div class=pdc_latest_wrapper><article itemscope itemtype=http://data-vocabulary.org/Review class=pdc_latest_review data-ng-if=latest.review><h3 data-ng-if=latest.review.title>{{latest.review.title}}</h3><header data-ng-class=latest.supplier.id data-ng-style="{ \'background-image\': \'url(\' + (latest.supplier.icon | ensureHTTPS) + \')\' }"><meta itemprop=rating content="{{ latest.review.rating }}"><span class=rating data-here-review-rate-icon data-here-rating="{{ latest.review.rating }}" data-here-rating-provider="{{ latest.supplier.id }}" data-here-rated-element-color=#5A9632 data-here-empty-element-color=rgba(255,255,255,0) data-ng-class="{{ latest.supplier.id }}"><meta itemprop=rating content="{{ latest.review.rating }}"></span></header><p class=pdc_review_description data-ng-if=!latest.supplier.isInternal itemprop=description><span data-ng-bind-html=latest.review.description></span></p><p class=pdc_review_description data-ng-if=latest.supplier.isInternal data-here-read-more={{latest.review.description}} data-here-read-more-max=500 itemprop=description></p><div class=pdc_latest_review_attribution><div class=pdc_review_date><time itemprop=dtreviewed datetime="{{ latest.review.date }}">{{ latest.review.date|date:"shortDate" }}</time></div><span class=pdc_review_attribution ng-class="{pdc_review_attribution_internal: latest.supplier.isInternal}" data-ng-bind-html="latest.review.attribution | linksInNewTab" data-track-anchor-clicks=pdc:AttributionLink:click></span></div></article><div class=pdc_latest_image data-ng-style="{\'background-image\': \'url(\' + ( latest.image.srcRequested | ensureHTTPS ) + \')\'}" data-ng-if=latest.image data-here-image-attribution=full data-here-image=latest.image data-ng-click=openPhoto()></div></div></div></section>'), 
    a.put("features/places/pdcModules/pdcModulePhotos/pdcModulePhotos.html", "<section id=pdc_pictures data-ng-show=galleryItems.length class=section_full_width><div class=pdc_pictures data-ng-if=place.media.images.items.length><h2>Photos</h2><div class=pdc_section_content><div class=section_wrapper><ul data-ng-class=\"'pdc_images pdc_images_'+ (galleryItems.length > 5 ? 5 : galleryItems.length)\"><li data-ng-repeat=\"image in galleryItems | limitTo:5\" data-ng-class=\"'pdc_image pdc_image_' + ($index+1) + ' ' + (isImageSmall($index, galleryItems.length) ? 'small_image' : '')\" data-ng-style=\"{'background-image': 'url(' + ( image.srcRequested | ensureHTTPS ) + ')'}\" data-here-image-attribution=\"\" data-here-image=image data-ng-click=openPhoto(image.index) data-ng-mouseenter=\"setHoverGrid(true, $index, galleryItems.length)\" data-ng-mouseleave=setHoverGrid(false)></li></ul><div class=pdc_images_counter_container data-ng-hide=isGridHover><span data-ng-include=\"'/img/pdc/pictures.svg'\"></span> <span class=pdc_images_counter>Photos: {{place.media.images.available}}</span></div></div><div class=action_wrapper data-ng-if=\"galleryItems.length > 5\"><button class=\"btn btn_light\" data-ng-click=openPhotoGallery()>Photo gallery</button></div></div></div></section>"), 
    a.put("features/places/pdcModules/pdcModulePlacesNearby/pdcModulePlacesNearby.html", '<section id=pdc_places_nearby data-ng-if=recommendedItems.length class="pdc_places_nearby fadein"><h2>Places nearby</h2><div class=section_wrapper><div data-explore-results=recommendedItems data-here-discover-grid="{ origin: \'nearbyPlaces\' }"></div></div><div class=action_wrapper data-ng-if="recommendedItemsLength > 4"><button class="btn btn_light" data-ng-click=showMoreNearbyPlaces() data-ng-class="{ show_more: nearbyModuleShowMore, show_less: !nearbyModuleShowMore }">{{nearbyModuleShowMore ? "See more" : "See less"}}</button></div></section>'), 
    a.put("features/places/pdcModules/pdcModulePrivateCollections/pdcModulePrivateCollections.html", '<section class="fadein pdc_collections" data-ng-if=isAvailable() id=pdc_collections><div class=collected_in><h2>Collected in</h2><div class="pdc_section_content collection clearfix"><div data-ng-repeat="collection in collections" data-ng-click=goToCollection(collection.id) class=clickable>{{collection.name}}</div></div></div><hr><div data-here-description-widget="" data-place=place data-is-open=editMode></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleReviews/pdcModuleReviews.html", '<section id=pdc_reviews data-ng-if=place.media.reviews.available class=pdc_reviews><h2>Reviews</h2><ul data-ng-if=place.media.reviews.available><li data-ng-repeat="supplier in place.media.reviews.suppliers.items" class="pdc_reviews_group {{ supplier.id }}"><div class="supplier_title provider" data-ng-style="{ \'background-image\': \'url(\' + (supplier.icon | ensureHTTPS) + \')\' }">{{ supplier.title }}</div><div class=pdc_reviews_group_content><article data-ng-repeat="review in supplier.items" class=pdc_review itemscope itemtype=http://data-vocabulary.org/Review><header data-ng-if="review.title || review.rating"><h3 data-ng-if=review.title>{{ review.title }}</h3><div class=rating data-here-review-rate-icon data-here-rating="{{ review.rating }}" data-here-rating-provider="{{ supplier.id }}" data-here-rated-element-color=#5A9632 data-here-empty-element-color=rgba(255,255,255,0)><meta itemprop=rating content="{{ review.rating }}"></div></header><p class=pdc_review_description data-ng-if="!supplier.isInternal && review.description" itemprop=description><span data-ng-bind-html=review.description></span> <a class=pdc_review_link_full href="{{ review.via.href }}" data-ng-if=!supplier.isInternal target=_blank data-here-click-tracker=pdc:FullReview:click>See full review on {{supplier.title}}</a></p><p class=pdc_review_description data-ng-if="supplier.isInternal && review.description" data-here-read-more={{review.description}} itemprop=description></p><div class=pdc_attribution_container data-ng-if=review.attribution><span class=pdc_review_attribution data-ng-bind-html="review.attribution | linksInNewTab" data-ng-if=!supplier.isInternal data-track-anchor-clicks=pdc:AttributionLink:click></span> <span class=pdc_review_attribution ng-class="{pdc_review_attribution_internal: supplier.isInternal}" data-ng-bind="review.attribution | htmlToPlaintext" data-ng-if=supplier.isInternal data-track-anchor-clicks=pdc:AttributionLink:click></span> &nbsp;on&nbsp; <span class=pdc_review_date><time itemprop=dtreviewed datetime="{{ review.date }}">{{ review.date|date:"shortDate" }}</time></span></div></article></div></li></ul></section>'), 
    a.put("features/places/pdcModules/pdcModuleShare/pdcModuleShare.html", '<section id=pdc_share data-ng-class="{\'visible\': showShare}" class=alternate_section><div class=input_button><label><input readonly class=selectable data-ng-click=selectUrl($event) data-ng-model=shareUrl placeholder="Generating URL..." data-here-autofocus="showShare && shareUrl"><span data-ng-class="{\'visible\': sharedLink}">copied</span></label><button data-clip-copy=shareUrl data-clip-click=trackCopy() data-ng-if=flashAvailable class="btn btn_full">Copy</button></div><p data-ng-if=!flashAvailable class=flash_unavailable>Click on the input field above and copy the URL to your clipboard.</p></section>'), 
    a.put("features/places/pdcModules/pdcModuleStreetLevel/pdcModuleStreetLevel.html", '<section id=pdc_street_level data-ng-show=streetLevelData class="pdc_street_level fadein section_full_width"><h2>Street level</h2><div class=pdc_section_content><div class=section_wrapper><img data-ng-src="{{ streetLevelData.url|ensureHTTPS }}" data-ng-click="openStreetLevel(\'street level pdc image\')" class=clickable alt=""><div class=action_wrapper><button class="btn btn_light btn_icon" data-ng-click="openStreetLevel(\'street level pdc button\')" data-here-svg="{path:\'/img/pdc/street-level.svg\', color:\'#00b4e5\', hoverColor:\'#ffffff\', activeColor: \'#ffffff\'}">Street level</button></div></div></div></section>'), 
    a.put("features/places/pdcModules/pdcModuleTips/pdcModuleTips.html", '<section class=pdc_tips data-ng-if=items.length><h2>{{ title }}</h2><ul data-ng-class="{ loading: isLoading }"><li data-ng-repeat="item in items"><span data-here-svg="{ path:\'/img/check_positive.svg\', color: \'#00c9ff\' }" data-ng-bind-html="item.text | markSubString:item.subText:true"></li></ul></section>'), 
    a.put("features/places/pdcModules/pdcModuleWhatReviewersSay/pdcModuleWhatReviewersSay.html", "<section data-ng-if=place.whatReviewersSay.length id=pdc_what_reviewers_say class=pdc_tips><h2>What reviewers say</h2><ul><li data-ng-repeat=\"opinion in place.whatReviewersSay | limitTo: 4\"><span data-ng-if=\"opinion.sentiment === 'positive'\" data-here-svg=\"{path:'/img/check_positive.svg', color: '#00C9FF'}\">{{opinion.text}}</span> <span data-ng-if=\"opinion.sentiment !== 'positive'\" data-here-svg=\"{path:'/img/check_negative.svg', color: '#FF0000'}\" class=negative>{{opinion.text}}</span></li></ul></section>"), 
    a.put("features/places/places.html", "<div data-ng-controller=PlacesCtrl itemscope itemtype=http://schema.org/Place><div class=pdc_geo itemprop=geo><span class=pdc_geo_coordinates itemscope itemtype=http://schema.org/GeoCoordinates><span property=latitude content={{place.location.position.lat}}></span> <span property=longitude content={{place.location.position.lng}}></span></span></div><div data-ng-show=\"!loading && !notFound\" class=\"collapsible header_content\"><div data-notification-box data-notification-type=info data-show-notification=notificationInfoMessage data-svg-color=#00AAD9 data-notification-hide-after=5000>{{notificationInfoMessage}}</div><header data-here-header=\"{weather: false, currentLocation: false, smoothImageRotation: false, origin: &quot;pdc&quot;, hasContextMenu: true}\" data-here-header-title=place.name data-here-header-category=place.mainCategory data-here-header-image=headerImage></header><nav class=bar><ul><li><button class=get_directions data-ng-click=goToDirections() data-here-svg=\"{ path: '/img/directions.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\">Get directions</button></li><li><button class=send_to_car data-ng-click=sendToCar() data-here-svg=\"{ path: '/img/pdc/send-to-car.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\">Send to car</button></li><li><div data-here-save-place-inline=place></div></li><li data-ng-if=Features.pdc.copyUrl><button class=share data-ng-click=shareModule() data-here-svg=\"{ path: '/img/pdc/copy-link.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\">Copy link</button></li></ul></nav><nav class=collapsed_bar><ul><li><button class=get_directions data-ng-click=goToDirections() data-here-svg=\"{ path: '/img/directions.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\"></button></li><li><button class=send_to_car data-ng-click=sendToCar() data-here-svg=\"{ path: '/img/pdc/send-to-car.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\"></button></li><li><div data-here-save-place-inline=place></div></li><li data-ng-if=Features.pdc.copyUrl><button class=share data-ng-click=shareModule() data-here-svg=\"{ path: '/img/pdc/copy-link.svg', color:'#00c9ff', hoverColor:'#00b4e5'}\"></button></li></ul></nav><section data-pdc-module-share data-place=place data-ng-if=Features.pdc.copyUrl></section></div><div data-ng-show=\"!loading && !notFound\" id=pdc_content_container class=\"pdc_content_container scrollable_content\" data-here-scrollable data-here-collapsed-element=.panel><div class=pdc_content><section data-pdc-module-facebook data-place=place></section><section data-pdc-module-private-collections data-place=place></section><section data-pdc-module-info data-place=place data-marker=wrappedMarker></section><section data-pdc-module-about data-place=place></section><section data-pdc-module-latest data-place=place></section><section data-pdc-module-amenities data-place=place></section><section data-pdc-module-photos data-place=place></section><section data-pdc-module-reviews data-place=place></section><section data-pdc-module-street-level data-place=place data-marker=wrappedMarker></section><section data-pdc-module-articles data-place=place></section><section data-pdc-module-places-nearby data-place=place></section></div></div><div class=\"spinner_container scrollable_content\" data-ng-show=loading><div class=\"spinner centered\" data-here-spinner=big></div></div><div data-ng-if=notFound class=\"pdc_not_found scrollable_content\"><header data-here-header=\"{weather: false, currentLocation: false, smoothImageRotation: false, origin: &quot;pdc&quot;}\" data-here-header-title=\"'Search, but ye shall not find.'\"></header><div class=search_no_results><div class=magnifier data-here-svg=\"{path: '/img/search.svg', color: '#124191'}\"></div><h4>Unfortunately, the page you're looking for doesn't seem to exist (anymore).</h4></div></div></div>"), 
    a.put("features/places/report.html", '<div class=report_place ng-controller=ReportCtrl><header><h1>What\'s the problem?</h1><p>Place reporting on: <strong>{{place.name}}</strong>, <span data-ng-bind-html="place.location.address.text | withoutBRs"></span></p></header><section data-report-form=place.report.href data-error-message="Your report wasn\'t sent. Please try again." data-on-abort=onAbort() data-on-success=onSuccess()></section></div>'), 
    a.put("features/reportImage/reportImage.html", '<div class=report_image data-ng-controller=ReportImageCtrl><form name=reportImageForm data-ng-submit=submitReport();><div data-ng-show=!step1Completed><h2>What would you like to report?</h2><div class=line></div><p class=secondary>Move the street scene until the image you want to report is in the red frame.  Then choose what you\'d like to do next.</p><ul><li><label><input type=radio name=reason value=requestBlurring data-ng-model=reason autofocus tabindex="1">Request blurring</label></li><li><label><input type=radio name=reason value=imageQuality data-ng-model=reason tabindex="2">Report image quality</label></li></ul><br><button class="btn btn_full full_width" type=button data-ng-disabled=!reason data-ng-click="step1Completed = true" tabindex=3>Next</button></div><div data-ng-show="step1Completed && !step2Completed"><ul data-ng-show="reason==\'requestBlurring\'"><li><h2>What should be blurred?</h2><div class=line></div></li><li><label><input type=radio name=privacy value="Car number plate" data-ng-model=kind tabindex="4">Car number plate</label></li><li><label><input type=radio name=privacy value="Someone\'s face" data-ng-model=kind tabindex=5>An image of someone</label></li><li data-ng-if=isReportSLIHomeNumber><label><input type=radio name=privacy value="Your home" data-ng-model=$parent.kind tabindex=6>Your home</label></li><li><label><input type=radio name=privacy value="Something else" data-ng-model=kind tabindex=7>Something else</label></li></ul><ul data-ng-show="reason==\'imageQuality\'"><li><h2>Report image quality</h2><div class=line></div></li><li><label><input type=radio name=quality value="Image and map don\'t match" data-ng-model=kind tabindex=8>Image and map don\'t match</label></li><li><label><input type=radio name=quality value="View is obstructed" data-ng-model=kind tabindex=9>View is blocked</label></li><li><label><input type=radio name=quality value="Image quality is poor" data-ng-model=kind tabindex=10>Image quality is poor</label></li></ul><br><label data-ng-show="kind!==\'Your home\'" class=email><input type=checkbox name=report-image-check-email data-ng-model=checked data-ng-change="email = \'\'" tabindex="11"> Tick the box to receive an email to tell you when the problem is fixed.</label><div data-ng-show="checked && kind!==\'Your home\'"><input data-ng-model=email type=email placeholder="Your email (to contact you)" name=email data-ng-pattern=validation.emailPattern data-ng-disabled=!checked data-ng-required=checked data-ng-focus="emailBlur=false" data-ng-blur="emailBlur=true;" data-ng-change="invalid = (reportImageForm.email.$invalid && reportImageForm.email.$viewValue.length) || (reportImageForm.email.$error.required)" data-ng-class="{invalid: invalid && emailBlur}" tabindex="12"> <span class=error data-ng-if="(reportImageForm.email.$error.required && emailBlur)">Please include an email address.</span> <span class=error data-ng-if="(reportImageForm.email.$invalid && reportImageForm.email.$viewValue.length && emailBlur)">Please check the email address.</span></div><br><button class="btn btn_full full_width" type=button data-ng-show="kind==\'Your home\' || kind==\'Something else\'" data-ng-disabled=!kind data-ng-click="step2Completed = true;" tabindex=14>Next</button> <button class="btn btn_full full_width" type=submit data-ng-show="kind!==\'Your home\' && kind!==\'Something else\'" data-ng-disabled="!kind || (checked && invalid) || sending" tabindex=15>Send</button> <button class="btn btn_light full_width" type=button data-ng-click="step1Completed = false; kind = \'\'; checked = false" tabindex=13>Back</button><p class=privacy_policy_link>All info you share with us will be handled according to our <a href="http://here.com/privacy/privacy-policy/?lang=%5binsert" target="_blank" class="highlight">Privacy Policy</a></p></div><div data-ng-show="step2Completed && !step3Completed"><div data-ng-show="kind==\'Your home\'"><h2>Your home</h2><div class=line></div><p class=secondary>Please describe the house or building that should be blurred so we know it\'s the right one. Be sure to include the street address.</p><textarea rows=4 maxlength=1000 data-ng-model=description placeholder="Your comments (optional)" tabindex=16></textarea><label class=home_email><input type=checkbox name=report-image-check-email data-ng-model=homeChecked data-ng-change="homeEmail = \'\'" tabindex="17"> Tick the box to receive an email to tell you when new photographs of your street will be added to HERE Maps in the future.</label><div data-ng-show=homeChecked><input data-ng-model=email type=email placeholder="Your email (to contact you)" name=homeEmail data-ng-disabled=!homeChecked data-ng-required=homeChecked data-ng-focus="emailBlur=false" data-ng-blur="emailBlur=true;" data-ng-change="invalid = (reportImageForm.homeEmail.$invalid && reportImageForm.homeEmail.$viewValue.length) || (reportImageForm.homeEmail.$error.required)" data-ng-class="{invalid: invalid && emailBlur}" tabindex="18"> <span class=error data-ng-if="(reportImageForm.homeEmail.$error.required && emailBlur)">Please include an email address.</span> <span class=error data-ng-if="(reportImageForm.homeEmail.$invalid && reportImageForm.homeEmail.$viewValue.length && emailBlur)">Please check the email address.</span></div><br></div><div data-ng-show="kind==\'Something else\'"><h2>Something else</h2><div class=line></div><p class=secondary>Please explain why the image should be blurred. For example, something offensive or inappropriate can be seen.</p><textarea rows=4 maxlength=1000 data-ng-model=description placeholder="Your comments (optional)" tabindex=19></textarea></div><button class="btn btn_full full_width" type=submit data-ng-disabled="(homeChecked && invalid) || sending" tabindex=21>Send</button> <button class="btn btn_light full_width" type=button data-ng-click="step2Completed = false; description = \'\';" tabindex=20>Back</button><p class=privacy_policy_link>All info you share with us will be handled according to our <a href="http://here.com/privacy/privacy-policy/?lang=%5binsert" target="_blank" class="highlight">Privacy Policy</a></p></div></form></div>'), 
    a.put("features/reportImage/reportImageConfirm.html", '<div class="report_image report_confirm"><h2>Thanks</h2><div class=line></div><p class=secondary>We\'ve received your feedback and will look into the problem.</p><button class="btn btn_full full_width" data-ng-click=closePopover()>OK</button></div>'), 
    a.put("features/reportMapProblem/reportMapProblem.html", '<div class=report_problem data-ng-controller=ReportMapProblemCtrl><iframe width=540 height={{height}} frameborder=0 data-ng-if=url data-ng-src={{url}} data-ng-if=useMapReportWidget></iframe><div data-ng-if=!useMapReportWidget><h2>Report a map problem</h2><div class=line></div><form name=reportMapProblemForm data-ng-submit=submitReport();><textarea rows=4 maxlength=1000 data-ng-model=details placeholder="Briefly describe the problem."></textarea><button class="btn btn_full full_width" type=submit data-ng-disabled=!details>Send</button></form></div></div>'), 
    a.put("features/reportMapProblem/reportMapProblemConfirm.html", '<div class="report_problem report_confirm"><h2>Thanks</h2><div class=line></div><p class=secondary>We\'ve received your feedback and will look into the problem.</p><button class="btn btn_full full_width" data-ng-click=closePopover()>OK</button></div>'), 
    a.put("features/search/search.html", '<div data-ng-controller=SearchCtrl class="discover search_container"><header class="header_content new_header text_only"><h1><span class=header_title>Results</span></h1></header><section class=scrollable_content data-here-scrollable data-here-collapsed-element=.panel id=discoverGrid><section class=search_results data-ng-if="results && !searching"><div data-explore-results=results data-here-discover-grid="{ boxOver: boxOver, boxOut: boxOut, boxClick: boxClick }"></div><div data-ng-show="resultsNext && !searchingMore" class=search_more_placeholder><button data-ng-click=searchMore() class="btn btn_light">Show more results</button></div></section><div data-ng-if="searching || searchingMore" data-here-spinner=small class="spinner centered"></div><section class=search_no_results data-ng-show="results && !results.length"><div class=magnifier data-here-svg="{ path: \'/img/search.svg\', color: \'#124191\' }"></div><h2>Didn\'t find anything</h2><p>Try including a city or street, and do a quick spelling check.</p></section></section></div>'), 
    a.put("features/sendToCar/dialog.html", '<form class=send_to_car name=form data-ng-submit="send(manufacturer, carId, context)" data-ng-controller=SendToCarCtrl><header><h1>Send to car</h1><p data-ng-if=!isContextRoute>Set as driving destination</p><p data-ng-if=isContextRoute>Set as driving route</p></header><section class=place_info data-ng-if=!isContextRoute><div data-here-category-icon data-category={{context.categories[0].id}} data-color=#999></div><h3>{{context.name}}</h3><div class=place_address data-ng-bind-html=context.location.address.text></div></section><section class=directions_info data-ng-if=isContextRoute><div class=narrow><section id=itinerary_view_send_route_to_car><ul id=itinerary_items_container_send_route_to_car><li data-ng-repeat="item in context.itineraryItems" class=itinenary_list_item data-ng-class="{focused : itineraryItemFocused || \'\'}"><div class=itinerary_item_border data-ng-if=!$last>&nbsp;</div><div class=itinerary_item data-ng-class="{\n                            with_waypoints: context.length > 2,\n                            location: item.geolocationModel || item.isMyLocation,\n                            location_error: item.locationError,\n                            via: !$first && !$last }"><span data-ng-if=$first data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class="itinerary_item_icon from"></span> <span data-ng-if="!$first && !$last" data-ng-include="\'/features/directions/img/itineraryItems/to.svg\'" class="itinerary_item_icon to"></span> <span data-ng-if=$last data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class="itinerary_item_icon to"></span><div class=itinerary_item_title id=send_route_to_car_itinerary_item_title_{{$index}} data-ng-class="{ first_child: $index === 0 }">{{item.title}}</div><div class=clear></div></div></li></ul></section></div></section><div data-notification-box data-notification-type=error data-show-notification=showErrorNotification>Sorry. There\'s a problem at our end. Please try again later.</div><section data-ng-hide=success class=first_step><fieldset class="narrow car_info"><label>Choose car<select name=manufacturer tabindex=1 data-here-fix-android-select data-ng-model=manufacturer data-ng-options="id as label for (id, label) in manufacturers"></select></label><label class=error_support>Car ID <input name=carId tabindex=2 data-here-show-on-focus=send_to_car data-ng-model=carId data-ng-class="{invalid: error && error.data.wrongID}"> <span class=error data-ng-show="error && error.data.wrongID">Didn\'t recognise that car ID. Please check it.</span></label></fieldset><div class="narrow vin_info">Email or VIN (provided by the car maker).</div><div class="narrow remember_car"><label><input type=checkbox tabindex=3 data-ng-model=rememberCarId>Remember this car</label></div><section class=buttons><button class="btn btn_light" type=button data-ng-click=closeDialog() tabindex=5>Cancel</button> <button class="btn btn_full" type=submit tabindex=4 data-ng-click="sendingToCar = true" data-ng-disabled=!carId>Send</button></section><div class=send_to_car_spinner data-ng-show=sendingToCar>&nbsp;</div></section><section data-ng-show=success class="buttons no_border_top"><button class="btn btn_full" data-ng-click=closeDialog()>Done</button></section></form>'), 
    a.put("features/settings/settings.html", '<form class="settings_dialog scrollable" data-here-scrollable name=settings data-ng-controller=SettingsCtrl data-ng-submit=submit()><header><h1>Settings</h1></header><div data-notification-box data-notification-type=error data-show-notification="clearRecentsStatus === actionStatus.error">There\'s a problem of some sort. Please try later.</div><section class=language><h2>Language</h2><label>Choose language<select name=language data-here-fix-android-select data-ng-model=language data-ng-options="language.label for language in languages | orderBy: \'label\'"></select></label></section><section class=units><h2>Units</h2><section data-ng-if=isImperialUKUS class=imperialUKUS><label><input type=radio name=distanceSystemUnit data-ng-model=$parent.distanceSystemUnit value="metric"> <span class=unit>Metric <span class=unit_desc>Metres, Kilometres</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=$parent.distanceSystemUnit value="imperialGB"> <span class=unit>Imperial UK <span class=unit_desc>Yards, Miles</span></span></label><label><input type=radio name=distanceSystemUnit data-ng-model=$parent.distanceSystemUnit value="imperialUS"> <span class=unit>Imperial US <span class=unit_desc>Feet, Miles</span></span></label></section><section data-ng-if=!isImperialUKUS><label><input type=radio name=distance data-ng-model=$parent.distance value="kilometers"> Kilometres</label><label><input type=radio name=distance data-ng-model=$parent.distance value="miles"> Miles</label></section><section class=temperature><label><input type=radio name=temperature data-ng-model=temperature value="celsius"> Celsius</label><label><input type=radio name=temperature data-ng-model=temperature value="fahrenheit"> Fahrenheit</label></section></section><section class=clear_recents><h2>Search history</h2><span class=recents_enabled data-ng-if=clearRecentsEnabled>Clear the list of all your previous searches and the destinations.</span> <span class=recents_disabled data-ng-if="clearRecentsStatus === actionStatus.disabled">No searches yet</span> <span class=recents_done data-ng-if="clearRecentsStatus === actionStatus.completed">Your search history was cleared.</span> <span class=recents_progress_text data-ng-if="clearRecentsStatus === actionStatus.inProgress">&nbsp;</span><div class=recents_actions><button type=button class="btn btn_light" data-ng-click=clearRecents() data-ng-disabled=!clearRecentsEnabled>Clear history</button><div class=recents_progress data-ng-show="clearRecentsStatus === actionStatus.inProgress" data-here-spinner=small></div></div></section><section class=submit><button class="btn btn_full" type=submit>Done</button></section></form>'), 
    a.put("features/traffic/commute.html", '<div data-ng-controller=CommuteCtrl class=traffic_controller><header data-ng-if="showWidget && !improveInfo && !improveC2A" class=header_content><h1 data-ng-if=!location>Traffic</h1><h1 data-ng-if=location>Current traffic in {{location}}</h1></header><header data-ng-if="improveInfo || improveC2A" class="header_content improveInfo"><h1 data-ng-if=!showWidget>Current traffic for {{ commuteOrigin }} - {{ commuteDestination }}</h1><h1 data-ng-if="showWidget && !location">Traffic</h1><h1 data-ng-if="showWidget && location">Current traffic in {{location}}</h1><div class=realtime data-ng-class="{hide : state === 4 || !trafficTime}"><span>Last updated:</span> <span class=time>{{ trafficTime | date:\'shortTime\' }}</span></div></header><section data-ng-if=!improveC2A class=call_2_action><p>See all traffic on the map</p><button class="btn btn_light show_traffic" data-ng-click=activateTraffic() data-here-click-tracker=traffic:showTraffic:click>Show</button></section><section data-ng-show="routeSelectable && !routeError && !improveC2A" id=collapse_state><span class=itinerary_item_query title="{{ itineraryItems[0].query }}">{{ itineraryItems[0].query }}</span> <span class=itinerary_item_query title="{{ itineraryItems[itineraryItems.length - 1].query }}">&nbsp;- {{ itineraryItems[itineraryItems.length - 1].query }}</span> <span class="btn btn_reverse" title="Reverse route" data-ng-click=reverseRoute() data-here-svg="{ path:\'/features/directions/img/itineraryItems/reverse_icon.svg\', color: \'#98A2AE\', hoverColor:\'#00b4e5\' }" data-here-click-tracker=traffic:reverseCommute:click></span> <button class="btn btn_edit_route" data-ng-click="trackCommuteEdit(); routeSelectable = false; currentRoute = null; showWidget = true; panelsService.isMinimized = false;" title="Edit" data-here-svg="{ path:\'/img/core_edit.svg\', color: \'#98A2AE\', hoverColor: \'#00b4e5\' }" data-here-click-tracker=traffic:editCommute:click></button></section><section data-ng-show=improveC2A class="call_2_action commute improveC2A"><button class=reverse_route data-here-svg="{ path:\'/features/directions/img/itineraryItems/reverse_h_icon.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-click=reverseRoute() data-here-click-tracker=traffic:showTraffic:click>Reverse route</button> <button class=edit_route data-here-svg="{ path:\'/img/core_edit.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-click="trackCommuteEdit(); routeSelectable = false; currentRoute = null; showWidget = true; panelsService.isMinimized = false;" data-here-click-tracker=traffic:editCommute:click>Edit route</button> <button class=show_traffic data-here-svg="{ path:\'/features/traffic/img/map-icon.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}" data-ng-click=activateTraffic() data-here-click-tracker=traffic:showTraffic:click>See all traffic</button></section><div data-ng-if="requestPending && !showWidget" class=spinner data-here-spinner=small></div><section data-ng-show="showWidget || routeError" id=commute_widget><h2>Get traffic info for your regular route</h2><p>See the traffic situation for the drive you do most often before you head out. Just set your usual starting point and destination.</p><section data-notification-box data-notification-type=error data-show-notification=routeError><p>Couldn\'t find a route for that journey. Check the addresses.</p></section><section id=itinerary_view data-here-mobile-input><ul id=itinerary_items_container><li data-ng-repeat="item in itineraryItems" data-ng-class="{focused : itineraryItemFocused || \'\'}" data-ng-show="$first || $last"><div class=itinerary_item><span data-ng-if=$first data-ng-include="\'/features/directions/img/itineraryItems/start_icon.svg\'" class="itinerary_item_icon from"></span> <span data-ng-if=$last data-ng-include="\'/features/directions/img/itineraryItems/destination_icon.svg\'" class="itinerary_item_icon to"></span><form data-ng-submit=selectFromSearchList() data-ng-class="{focused : itineraryItemFocused && itineraryItemIndex === $index || \'\'}"><input id=itinerary_item_input_{{$index}} tabindex="{{$index + 1}}" placeholder={{item.label}} data-ng-model=item.query data-ng-keydown=navigateSearchList($event) data-ng-change="resetAndShowItems(item, $index)" data-ng-focus="showItems(item, $index)" data-ng-blur="blurItineraryItem(item, $index)" data-here-autoselect><div class=itinerary_border></div></form></div><div data-ng-if="(itineraryItemIndex == $index) && !!((results && results.items) || recentSearchResults)" data-ng-style="{zIndex: 102 + (recentSearchResults && recentSearchResults.length || 0) + (results.items && results.items.length || 0)}" class=dropdown_list data-here-ios-touch-to-click><section data-ng-if="recentSearchResults && recentSearchResults.length > 0"><h5>Recent</h5><div class="dropdown_list_item recents" data-ng-repeat="recent in recentSearchResults" data-ng-class="{hovered: hoveredResultIndex == ($index - recentSearchResults.length)}" data-ng-mouseenter="hoverSearchElement($index - recentSearchResults.length)" data-ng-mouseleave=leaveSearchElement() data-ng-click="selectSearchElement(recent.data, \'recent\')"><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-ng-if=recent.data data-category={{recent.data.category}} data-color=#BFBFBF data-width=18 data-height=18></span> <span data-ng-bind-html="recent.data.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-if=recent.data.description data-ng-bind-html="recent.data.description | withoutBRs | markSubString:item.query"></span></div></section><section data-ng-if=results.items><h5>Suggestions</h5><div data-ng-repeat="result in results.items" class=dropdown_list_item data-ng-class="{hovered: hoveredResultIndex == $index}" data-ng-mouseenter=hoverSearchElement($index) data-ng-mouseleave=leaveSearchElement() data-ng-click="selectSearchElement(result, \'suggestion\')"><span class=dropdown_list_item_title><span class="dropdown_list_item_icon result_category" data-here-category-icon data-category={{result.category.id}} data-color=#BFBFBF data-width=14 data-height=14></span> <span data-ng-bind-html="result.title | withoutBRs | markSubString:item.query"></span></span> <span class=dropdown_list_item_description data-ng-bind-html="result.vicinity | withoutBRs | markSubString:item.query"></span></div></section></div></li></ul><button id=reverse_route_btn title="Reverse route" data-ng-if="itineraryItems.length === 2 && !itineraryItemFocused" data-ng-click=reverseRoute() data-here-svg="{ path:\'/features/directions/img/itineraryItems/reverse_icon.svg\', color: \'#98A2AE\', hoverColor:\'#00b4e5\' }" data-here-click-tracker=traffic:reverseRoute:click></button></section><div data-ng-if=requestPending data-here-spinner=small class=spinner></div><section class=buttons_container><button class="btn btn_light full_width btn_delete" type=button data-ng-if=commuteRoutes.length data-ng-click=deleteCommute() data-here-click-tracker=traffic:deleteCommute:click>Delete</button> <button class="btn btn_full full_width" type=submit data-ng-disabled=!availableRoutes.length data-ng-click=saveCommute(); data-here-click-tracker=traffic:saveCommute:click>Done</button> <button class="btn btn_light full_width" type=button data-ng-click=activateTraffic() data-here-click-tracker=traffic:skipCommute:click>Not now</button></section></section><div data-ng-show=!requestPending id=traffic class="traffic_container content_for_collapsible scrollable_content commute" data-ng-class="{improveInfo : improveInfo}" data-here-collapsed-element=.panel><section id=routes_list data-ng-show="availableRoutes && !showWidget"><ul data-ng-if=availableRoutes.length data-ng-class="{ \'many_labels\': availableRoutes[currentRouteIndex].publicTransportLine.length > 2, \'two_lines\': availableRoutes[currentRouteIndex].publicTransportLine.length > 4 }" class="for_{{availableRoutes.length}} route_cards"><li data-ng-repeat="route in availableRoutes" data-ng-click=setRouteOnClick($index) data-ng-mouseenter=hoverRouteAlternative($index) data-ng-mouseleave=leaveRouteAlternative() data-ng-class="{\n                            current: currentRouteIndex == $index,\n                            incidents: availableRoutesTrafficIncidents[$index],\n                            no_segments: segments.length === 0}" data-here-click-tracker=routing:routecard:click class=route_card><div class=route_segments><ul><li data-ng-show="route.segments.length > 0"><span class=via>via</span> <span class=car data-ng-class="{car_wide: !route.segments[0].nextRoadNumber && route.segments[0].nextRoadName}" title="{{ !route.segments[0].nextRoadNumber && route.segments[0].nextRoadName || \'\' }}">{{ route.segments[0].nextRoadNumber || route.segments[0].nextRoadName }}</span> <span data-ng-if="route.segments[1] && route.segments[1].nextRoadNumber" class=bullet>•</span> <span data-ng-if="route.segments[1] && route.segments[1].nextRoadNumber" class=car>{{ route.segments[1].nextRoadNumber }}</span></li></ul></div><div class=distance>{{route.summary.distance | distance:distanceUnit:1}}</div><div data-ng-bind-html="(route.summary.trafficTime || route.summary.baseTime) | readableTimeSpan" class=time_span></div><div data-ng-switch="(route.summary.trafficTime - route.summary.baseTime) > 60"><span data-ng-switch-when=true data-ng-bind-html=getCarRouteDelayTimeString(route) class=delay></span> <span data-ng-switch-default class=no_delay>No delays</span></div><div class=incident_box><span data-ng-include="\'/services/markerIcons/containers/route-incident.svg\'" class=incident_icon></span> {{ availableRoutesTrafficIncidents[$index].length || \'0\' }} Incidents</div></li></ul></section><section data-ng-include="\'features/traffic/flow.html\'"></section></div><div data-here-marker-flag-jam-factor></div></div>'), 
    a.put("features/traffic/flow.html", '<div data-ng-show="(currentRoute && routeSelectable && !panelsService.isMinimized) || exploreMode" data-ng-class="{improveInfo : improveInfo}"><div data-ng-show=!improveInfo class=infobox><span class=title data-ng-click="expanded = { true: \'jam\', false: false }[expanded !== \'jam\']">{{ jamFactorLabel }} <span class=info_icon data-ng-include="\'/img/icons/icon_info.svg\'"></span></span></div><div data-ng-show="improveInfo && state!==1 && state!==2 && state!==4" class=infobox><span class=title>{{ jamFactorLabel }}</span></div><div data-ng-show="improveInfo && state!==1 && state!==2 && state!==4" data-ng-include="\'features/directions/route-legend.html\'"></div><section data-ng-show="expanded === \'jam\'" class=jam_dropdown><p class=secondary>{{ jamFactorDescription }}</p><ul class=traffic_legend><li><span class="light colorcode"></span><span class=value>0-3</span><span class=legend>Light: Free flow of traffic</span></li><li><span class="medium colorcode"></span><span class=value>4-7</span><span class=legend>Moderate: Start-stop flow of traffic</span></li><li><span class="heavy colorcode"></span><span class=value>8-9</span><span class=legend>Heavy: Slow flow of traffic</span></li><li><span class="blocked colorcode"></span><span class=value>10</span><span class=legend>Stopped: Traffic stopped or road closed</span></li></ul></section><ul class=traffic_segments><li data-ng-repeat="result in flows" class=flow_segment data-ng-mouseenter=panelFlowHighlight(result) data-ng-mouseleave=panelFlowHighlight() data-ng-click=panelFlowClick(result) data-ng-class="{highlight: result.highlight}" data-ng-if="result.roadName || result.roadNumber"><div data-ng-show=!improveInfo class=jamfactor><div class="factor factor_{{result.jamFactor}}">{{result.jamFactor}}</div><div class="description small_font">{{jamfactorDescriptions[result.jamFactor]}}</div></div><div data-ng-if=improveInfo class=jam_indicator><div class="factor factor_{{result.jamFactor}}"></div><div class="description small_font">{{jamfactorDescriptions[result.jamFactor]}}</div></div><h3 class=roadname>{{result.roadName || result.roadNumber}}</h3><div data-ng-show=result.roadEnd class="direction secondary"><span>{{result.direction}} towards {{result.roadEnd}}</span></div><div data-ng-if="result.jamFactor < 10 && result.delay" class=delay><span class=label>Delay:</span> <span class=value>{{result.delay}} min</span></div><div class="speed small_font"><span data-ng-if=!improveInfo class=label>Avg. speed right now</span> <span data-ng-if=improveInfo>Current speed:</span> <span data-ng-if="result.trafficSpeed >= 0 && result.delay" class=value>{{result.trafficSpeed | speed:result.units}}</span> <span data-ng-if="result.trafficSpeed >= 0 && !result.delay" class=value>{{((result.units === "metric") ? result.trafficSpeed*3.6 : result.trafficSpeed*2.23694 )| speed:result.units}}</span> <span data-ng-if="result.trafficSpeed < 0" class=value>{{ 0 | speed:result.units}}</span></div></li><li data-ng-if="state === 0" class="flow_segment status loading"><div class=jamfactor data-here-spinner=big></div><h3 class=roadname>getting traffic info</h3></li><li data-ng-if="state === 2" class="flow_segment status error"><div class=jamfactor><div class=factor data-ng-include="\'/img/traffic.svg\'"></div></div><h3 class=roadname>Traffic not available</h3><div class="description small_font">We don\'t have traffic info for this area yet. But we\'re always adding more areas.</div></li><li data-ng-if="state === 3" class="flow_segment status error"><div class=jamfactor><div class=factor data-ng-include="\'/img/traffic.svg\'"></div></div><h3 class=roadname>Couldn\'t search</h3><div class="description small_font">Sorry. Seems there\'s a problem on our end. Please try searching later.</div></li><li data-ng-if="state === 4" class="flow_segment status all_clear"><div class=jamfactor><div class=factor data-ng-include="\'/img/traffic.svg\'"></div></div><h3 class=roadname>Cars are dots from here</h3><div class="description small_font">Please zoom in to see road traffic info.</div></li></ul></div>'), 
    a.put("features/traffic/traffic.html", '<div data-ng-controller=TrafficCtrl class=traffic_controller><header class=header_content><h1 data-ng-if="!location && (state !== 2 && state !== 4)">Traffic</h1><h1 data-ng-if="location && (!state || (state !== 4) && (state !== 2))">Current traffic in {{location}}</h1><h1 data-ng-if="state === 2">Traffic not available</h1><h1 data-ng-if="state === 4">Cars are dots from here</h1><div class=realtime data-ng-if="state === 4"><span>Please zoom in to see road traffic info.</span></div><div class=realtime data-ng-if="state !== 4 && state !== 2 && trafficTime"><span>Last updated:</span> <span class=time>{{ trafficTime | date:\'shortTime\' }}</span></div></header><section data-ng-if="!commuteRoutes.length && !improveC2A" class=call_2_action><p>Get traffic info for your regular route</p><button class="btn btn_light create_commute" data-here-click-tracker=traffic:setUpCommute:click data-ng-click="trackCommuteSetup(); deactivateTraffic();">Set up</button></section><section data-ng-if="!commuteRoutes.length && improveC2A" class="call_2_action improveC2A"><button class=create_commute data-here-click-tracker=traffic:setUpCommute:click data-ng-click="trackCommuteSetup(); deactivateTraffic();" data-here-svg="{ path:\'/features/traffic/img/route-view-icon.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}">Get traffic info for your regular route</button></section><section data-ng-if="commuteRoutes.length && !improveC2A" class=call_2_action><p>{{ featureCommute ? "Stored journeys" : "See traffic along your regular route"}}</p><button class="btn btn_light show_commute" data-ng-click=deactivateTraffic();improveTrafficC2AConversion(); data-here-click-tracker=traffic:showCommute:click>Show</button></section><section data-ng-if="commuteRoutes.length && improveC2A && !featureCommute" class="call_2_action improveC2A"><button class=show_commute data-ng-click=deactivateTraffic();improveTrafficC2AConversion(); data-here-click-tracker=traffic:showCommute:click data-here-svg="{ path:\'/features/traffic/img/route-view-icon.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}">Show commute for {{ commuteOrigin }} - {{ commuteDestination }}</button></section><section data-ng-if="commuteRoutes.length && improveC2A && featureCommute" class="call_2_action improveC2A"><button class=show_commute data-ng-click=deactivateTraffic();improveTrafficC2AConversion(); data-here-click-tracker=traffic:showCommute:click data-here-svg="{ path:\'/features/traffic/img/route-view-icon.svg\', color: \'#00c9ff\', hoverColor:\'#00b4e5\'}">Stored journeys</button></section><div data-ng-if="requestPending && !showWidget" data-here-spinner=small class=spinner></div><div data-ng-show=!requestPending id=traffic class="traffic_container content_for_collapsible scrollable_content" data-here-collapsed-element=.panel><section data-ng-include="\'features/traffic/flow.html\'"></section></div><div data-here-marker-flag-jam-factor></div></div>'), 
    a.put("features/welcome/message.html", '<div class=welcome_message data-ng-cloak="" data-ng-controller=WelcomeMessageCtrl><div data-ng-if=showDownloadApp><h2>Maps to go</h2><p>Get the HERE mobile app and take all your recent searches and favourite places with you everywhere you go.</p><div class=action_buttons><a href="https://play.google.com/store/apps/details?id=com.here.app.maps" data-ng-click="trackAppDownload(\'google play\')" class="download_app_icon google_play" target=_blank></a> <a href=https://itunes.apple.com/app/id955837609 data-ng-click="trackAppDownload(\'iOS\')" class="download_app_icon app_store" target=_blank></a></div></div></div>');
} ]);