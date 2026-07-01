(function () {
  "use strict";

  var stores = [];
  var activeGenre = "all";
  var searchTerm = "";
  var visibleShopCount = 4;
  var SHOP_PAGE_SIZE = 4;
  var LOCATION_DISMISS_KEY = "senkyoLocationSortDismissed";
  var userLocation = null;
  var locationSortActive = false;
  var locationSortAvailable = true;
  var shopCarouselTimers = [];

  var genreIcons = {
    "カフェ": "icon-cafe.svg",
    "ベーカリー": "icon-bakery.svg",
    "本屋": "icon-books.svg",
    "雑貨": "icon-zakka.svg",
    "飲食店": "icon-meal.svg",
    "ラーメン": "icon-meal.svg",
    "古着": "icon-clothes.svg"
  };

  function genreIconUrl(genre) {
    return "assets/" + (genreIcons[genre] || "icon-shop.svg");
  }

  function mapUrl(store) {
    var query = store.mapQuery || (store.name + " 稲毛");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function storageAvailable() {
    try {
      var key = "__senkyo_test__";
      window.sessionStorage.setItem(key, key);
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getStoreDistanceKm(store) {
    if (!userLocation || !store.location) return null;

    var lat = Number(store.location.lat);
    var lng = Number(store.location.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    var earthRadiusKm = 6371;
    var lat1 = userLocation.lat * Math.PI / 180;
    var lat2 = lat * Math.PI / 180;
    var deltaLat = (lat - userLocation.lat) * Math.PI / 180;
    var deltaLng = (lng - userLocation.lng) * Math.PI / 180;
    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  function formatCurrentDistance(distanceKm) {
    if (distanceKm === null) return "";
    if (distanceKm < 1) {
      return "現在地から約" + Math.max(50, Math.round(distanceKm * 1000 / 50) * 50) + "m";
    }
    return "現在地から約" + distanceKm.toFixed(1) + "km";
  }

  function sortStoresForDisplay(storeList) {
    if (!locationSortActive || !userLocation) return storeList;

    return storeList.slice().sort(function (a, b) {
      var distanceA = getStoreDistanceKm(a);
      var distanceB = getStoreDistanceKm(b);
      if (distanceA === null && distanceB === null) return 0;
      if (distanceA === null) return 1;
      if (distanceB === null) return -1;
      return distanceA - distanceB;
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function getStoreById(id) {
    return stores.find(function (store) {
      return store.id === id;
    });
  }

  function getShopGalleryImages(store) {
    var images = [];
    var seen = {};

    function addImage(src) {
      if (!src || seen[src]) return;
      seen[src] = true;
      images.push(src);
    }

    (store.galleryImages || []).forEach(addImage);
    (store.products || []).forEach(function (product) {
      addImage(product.image);
    });

    return images;
  }

  function storeMatches(store) {
    var haystack = [
      store.name,
      store.genre,
      store.area,
      store.catch,
      store.summary,
      store.conditions,
      (store.tags || []).join(" "),
      (store.products || []).map(function (product) {
        return product.name + " " + product.benefit + " " + product.condition;
      }).join(" ")
    ].join(" ").toLowerCase();

    var genreOk = activeGenre === "all" || store.genre === activeGenre;
    var searchOk = !searchTerm || haystack.indexOf(searchTerm.toLowerCase()) !== -1;
    return genreOk && searchOk;
  }

  function renderGenreFilters() {
    var root = document.getElementById("genreFilters");
    if (!root) return;

    var genres = ["all"].concat(Array.from(new Set(stores.map(function (store) {
      return store.genre;
    }))));

    root.innerHTML = genres.map(function (genre) {
      var label = genre === "all" ? "すべて" : genre;
      var active = genre === activeGenre ? " is-active" : "";
      return '<button class="chip' + active + '" type="button" data-genre="' + escapeHtml(genre) + '">' + escapeHtml(label) + "</button>";
    }).join("");

    root.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () {
        activeGenre = button.dataset.genre;
        visibleShopCount = SHOP_PAGE_SIZE;
        renderShopList();
        renderGenreFilters();
      });
    });
  }

  function renderShopList() {
    var root = document.getElementById("shopList");
    if (!root) return;

    clearShopCarouselTimers();

    var visibleStores = sortStoresForDisplay(stores.filter(storeMatches));
    var count = document.getElementById("resultCount");
    var moreButton = document.getElementById("showMoreShops");
    var renderedStores = visibleStores.slice(0, visibleShopCount);
    var hasMoreStores = visibleStores.length > renderedStores.length;

    if (count) count.textContent = visibleStores.length;
    if (moreButton) {
      moreButton.hidden = !hasMoreStores;
    }

    if (!renderedStores.length) {
      root.innerHTML = '<p class="empty-state">条件に合う店舗が見つかりませんでした。</p>';
      return;
    }

    root.innerHTML = renderedStores.map(function (store) {
      var currentDistance = locationSortActive ? formatCurrentDistance(getStoreDistanceKm(store)) : "";
      var meta = escapeHtml(store.area) + " / " + escapeHtml(store.distance);
      var galleryImages = getShopGalleryImages(store);
      var galleryHtml = galleryImages.map(function (image, index) {
        return [
          '<figure class="shop-card__gallery-slide" data-carousel-slide>',
          '  <img src="' + escapeHtml(image) + '" alt="" width="768" height="768" loading="' + (index === 0 ? "eager" : "lazy") + '">',
          "</figure>"
        ].join("");
      }).join("");
      var galleryDots = galleryImages.map(function (_, index) {
        return '<span class="shop-card__gallery-dot' + (index === 0 ? " is-active" : "") + '"></span>';
      }).join("");
      if (currentDistance) meta += " / " + escapeHtml(currentDistance);

      return [
        '<article class="shop-card">',
        galleryHtml ? [
          '  <div class="shop-card__gallery" data-shop-carousel aria-label="対象商品の画像">',
          '    <div class="shop-card__gallery-track">' + galleryHtml + "</div>",
          galleryImages.length > 1 ? '    <div class="shop-card__gallery-dots" aria-hidden="true">' + galleryDots + "</div>" : "",
          '    <span class="shop-card__gallery-badge" aria-hidden="true"><img src="' + genreIconUrl(store.genre) + '" alt="" width="26" height="26" loading="lazy"></span>',
          "  </div>"
        ].join("") : "",
        '  <div class="shop-card__top">',
        '    <span class="genre-icon"><img src="' + genreIconUrl(store.genre) + '" alt="" width="26" height="26" loading="lazy"></span>',
        '    <span class="shop-card__genre">' + escapeHtml(store.genre) + "</span>",
        store.sample ? '    <span class="sample-label">サンプル</span>' : "",
        "  </div>",
        "  <h3>" + escapeHtml(store.name) + "</h3>",
        '  <p class="shop-card__meta">' + meta + "</p>",
        '  <a class="shop-card__map-link" href="' + mapUrl(store) + '" target="_blank" rel="noopener noreferrer">',
        '    <img src="assets/icon-map-pin.svg" alt="" width="16" height="16" loading="lazy">',
        "    <span>Googleマップ</span>",
        "  </a>",
        '  <div class="shop-card__actions">',
        '    <a class="button button--primary" href="shop.html?id=' + encodeURIComponent(store.id) + '">詳細を見る</a>',
        "  </div>",
        "</article>"
      ].join("");
    }).join("");

    initShopCarousels(root);
  }

  function clearShopCarouselTimers() {
    shopCarouselTimers.forEach(function (timer) {
      window.clearInterval(timer);
    });
    shopCarouselTimers = [];
  }

  function initShopCarousels(root) {
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.querySelectorAll("[data-shop-carousel]").forEach(function (carousel) {
      var track = carousel.querySelector(".shop-card__gallery-track");
      var slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
      var dots = Array.from(carousel.querySelectorAll(".shop-card__gallery-dot"));
      if (!track || slides.length < 2) return;

      var activeIndex = 0;

      function updateDots(index) {
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function scrollToSlide(index, behavior) {
        activeIndex = index;
        track.scrollTo({
          left: slides[index].offsetLeft,
          behavior: behavior || "smooth"
        });
        updateDots(index);
      }

      track.addEventListener("scroll", function () {
        var nearestIndex = slides.reduce(function (nearest, slide, index) {
          var currentDistance = Math.abs(slide.offsetLeft - track.scrollLeft);
          var nearestDistance = Math.abs(slides[nearest].offsetLeft - track.scrollLeft);
          return currentDistance < nearestDistance ? index : nearest;
        }, activeIndex);

        if (nearestIndex !== activeIndex) {
          activeIndex = nearestIndex;
          updateDots(activeIndex);
        }
      }, { passive: true });

      if (reduceMotion) return;

      shopCarouselTimers.push(window.setInterval(function () {
        if (document.hidden) return;
        scrollToSlide((activeIndex + 1) % slides.length);
      }, 3600));
    });
  }

  function setLocationStatus(message) {
    var status = document.getElementById("locationSortStatus");
    if (status) status.textContent = message;
  }

  function updateLocationPanel() {
    var panel = document.getElementById("locationSortPanel");
    var useButton = document.getElementById("useCurrentLocation");
    var dismissButton = document.getElementById("dismissLocationSort");
    if (!panel || !useButton || !dismissButton) return;

    panel.classList.toggle("is-active", locationSortActive);
    useButton.disabled = locationSortActive || !locationSortAvailable;
    useButton.textContent = locationSortActive ? "近い順で表示中" : "現在地で近い順にする";
    dismissButton.textContent = locationSortActive ? "通常順に戻す" : "今は使わない";
    updateLocationChipLabel();
  }

  function updateLocationChipLabel() {
    var label = document.getElementById("locationSortChipLabel");
    if (!label) return;
    if (!locationSortAvailable) {
      label.textContent = "通常順で表示中";
    } else if (locationSortActive) {
      label.textContent = "近い順で表示中";
    } else {
      label.textContent = "位置情報を使う";
    }
  }

  function collapseLocationPanel() {
    var panel = document.getElementById("locationSortPanel");
    var chip = document.getElementById("locationSortChip");
    if (!panel || !chip) return;
    panel.classList.add("is-compact");
    chip.hidden = false;
    updateLocationChipLabel();
    if (storageAvailable()) {
      window.sessionStorage.setItem(LOCATION_DISMISS_KEY, "1");
    }
  }

  function expandLocationPanel() {
    var panel = document.getElementById("locationSortPanel");
    var chip = document.getElementById("locationSortChip");
    if (!panel || !chip) return;
    panel.classList.remove("is-compact");
    chip.hidden = true;
    if (storageAvailable()) {
      window.sessionStorage.removeItem(LOCATION_DISMISS_KEY);
    }
  }

  function initLocationSort() {
    var panel = document.getElementById("locationSortPanel");
    var useButton = document.getElementById("useCurrentLocation");
    var dismissButton = document.getElementById("dismissLocationSort");
    var chip = document.getElementById("locationSortChip");
    if (!panel || !useButton || !dismissButton) return;

    if (!("geolocation" in navigator)) {
      locationSortAvailable = false;
      setLocationStatus("この環境では現在地を取得できません。通常順で表示しています。");
    }

    useButton.addEventListener("click", function () {
      if (!("geolocation" in navigator)) return;

      useButton.disabled = true;
      setLocationStatus("現在地を確認しています。ブラウザの確認画面で許可してください。");

      navigator.geolocation.getCurrentPosition(function (position) {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        locationSortActive = true;
        visibleShopCount = SHOP_PAGE_SIZE;
        setLocationStatus("近い対象店舗から順に表示しています。");
        updateLocationPanel();
        renderShopList();
        collapseLocationPanel();
      }, function () {
        useButton.disabled = false;
        locationSortActive = false;
        setLocationStatus("現在地を取得できませんでした。通常順で表示しています。");
        updateLocationPanel();
      }, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 600000
      });
    });

    dismissButton.addEventListener("click", function () {
      if (locationSortActive) {
        locationSortActive = false;
        userLocation = null;
        visibleShopCount = SHOP_PAGE_SIZE;
        setLocationStatus("通常順で表示しています。位置情報を使う場合はもう一度選択できます。");
        updateLocationPanel();
        renderShopList();
      }
      collapseLocationPanel();
    });

    if (chip) {
      chip.addEventListener("click", expandLocationPanel);
    }

    if (storageAvailable() && window.sessionStorage.getItem(LOCATION_DISMISS_KEY) === "1") {
      collapseLocationPanel();
    }

    updateLocationPanel();
  }

  function initShopsPage() {
    var searchInput = document.getElementById("shopSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchTerm = searchInput.value.trim();
        visibleShopCount = SHOP_PAGE_SIZE;
        renderShopList();
      });
    }

    var moreButton = document.getElementById("showMoreShops");
    if (moreButton) {
      moreButton.addEventListener("click", function () {
        visibleShopCount += SHOP_PAGE_SIZE;
        renderShopList();
      });
    }

    renderGenreFilters();
    initLocationSort();

    document.querySelectorAll('[data-action="expand-location"]').forEach(function (el) {
      el.addEventListener("click", function () {
        expandLocationPanel();
      });
    });

    renderShopList();
  }

  function renderShopDetail() {
    var root = document.getElementById("shopDetail");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var store = getStoreById(params.get("id"));

    if (!store) {
      root.innerHTML = [
        '<section class="page-hero compact">',
        '  <div class="container">',
        '    <p class="eyebrow">Not Found</p>',
        "    <h1>店舗が見つかりません</h1>",
        "    <p>店舗一覧からもう一度選んでください。</p>",
        '    <a class="button button--primary" href="index.html">店舗一覧へ戻る</a>',
        "  </div>",
        "</section>"
      ].join("");
      return;
    }

    document.title = store.name + " | いなげ地域応援スポット";

    var detailImage = store.cardImage || store.image;
    var productHtml = (store.products || []).map(function (product) {
      return [
        '<article class="product-card">',
        product.image ? '  <figure class="product-card__image"><img src="' + escapeHtml(product.image) + '" alt="" width="1536" height="1024" loading="lazy"></figure>' : "",
        "  <h3>" + escapeHtml(product.name || "") + "</h3>",
        '  <p class="product-card__benefit">' + escapeHtml(product.benefit || "") + "</p>",
        product.condition ? '  <p class="product-card__condition">' + escapeHtml(product.condition) + "</p>" : "",
        "</article>"
      ].join("");
    }).join("");

    var tags = (store.tags || []).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + "</span>";
    }).join("");

    if (!productHtml) {
      productHtml = '<p class="empty-state">対象商品は調整中です。</p>';
    }

    root.innerHTML = [
      '<section class="page-hero compact shop-detail-hero">',
      '  <div class="container">',
      '    <span class="genre-icon genre-icon--lg"><img src="' + genreIconUrl(store.genre) + '" alt="" width="34" height="34"></span>',
      '    <p class="eyebrow">' + escapeHtml(store.genre) + "</p>",
      "    <h1>" + escapeHtml(store.name) + "</h1>",
      '    <p class="shop-detail-lead">' + escapeHtml(store.catch || "") + "</p>",
      '    <div class="tag-row">' + tags + "</div>",
      '    <div class="detail-actions">',
      '      <a class="button button--primary" href="' + mapUrl(store) + '" target="_blank" rel="noopener noreferrer">地図を開く</a>',
      '      <a class="button button--outline" href="index.html">一覧へ戻る</a>',
      "    </div>",
      "  </div>",
      "</section>",
      '<section class="section">',
      '  <div class="container detail-layout">',
      '    <aside class="detail-panel">',
      detailImage ? '      <figure class="detail-panel__image"><img src="' + escapeHtml(detailImage) + '" alt="" width="1536" height="1024"></figure>' : "",
      "      <h2>店舗情報</h2>",
      store.summary ? '      <p class="detail-panel__summary">' + escapeHtml(store.summary) + "</p>" : "",
      "      <dl>",
      "        <div><dt>エリア</dt><dd>" + escapeHtml(store.area || "") + "</dd></div>",
      "        <div><dt>目安</dt><dd>" + escapeHtml(store.distance || "") + "</dd></div>",
      "        <div><dt>条件</dt><dd>" + escapeHtml(store.conditions || "") + "</dd></div>",
      "      </dl>",
      store.sample ? '      <p class="notice compact-notice">この店舗情報はサンプルです。</p>' : "",
      "    </aside>",
      '    <div class="product-area">',
      "      <h2>対象商品</h2>",
      '      <div class="product-grid">' + productHtml + "</div>",
      "    </div>",
      "  </div>",
      "</section>"
    ].join("");
  }

  function loadStores() {
    return fetch("stores.json")
      .then(function (response) {
        if (!response.ok) throw new Error("stores.json could not be loaded");
        return response.json();
      })
      .then(function (data) {
        stores = data;
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.dataset.page;
    if (!page) return;

    loadStores()
      .then(function () {
        if (page === "shops") initShopsPage();
        if (page === "shop-detail") renderShopDetail();
      })
      .catch(function () {
        var shopDetail = document.getElementById("shopDetail");
        var shopList = document.getElementById("shopList");
        if (shopDetail) {
          shopDetail.innerHTML = '<p class="empty-state">店舗データを読み込めませんでした。時間をおいて再読み込みしてください。</p>';
        }
        if (shopList) {
          shopList.innerHTML = '<p class="empty-state">店舗データを読み込めませんでした。時間をおいて再読み込みしてください。</p>';
        }
      });
  });
})();
