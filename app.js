(function () {
  "use strict";

  var stores = [];
  var activeGenre = "all";
  var searchTerm = "";

  var genreIcons = {
    "カフェ": "icon-cafe.svg",
    "ベーカリー": "icon-bakery.svg",
    "本屋": "icon-books.svg",
    "雑貨": "icon-zakka.svg",
    "飲食店": "icon-meal.svg",
    "古着": "icon-clothes.svg"
  };

  function genreIconUrl(genre) {
    return "assets/" + (genreIcons[genre] || "icon-shop.svg");
  }

  function mapUrl(store) {
    var query = store.mapQuery || (store.name + " 稲毛");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
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

  function storeMatches(store) {
    var haystack = [
      store.name,
      store.genre,
      store.area,
      store.catch,
      store.summary,
      (store.tags || []).join(" "),
      (store.products || []).map(function (product) {
        return product.name + " " + product.benefit;
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
        renderShopList();
        renderGenreFilters();
      });
    });
  }

  function renderShopList() {
    var root = document.getElementById("shopList");
    if (!root) return;

    var visibleStores = stores.filter(storeMatches);
    var count = document.getElementById("resultCount");
    var empty = document.getElementById("emptyState");

    if (count) count.textContent = visibleStores.length;
    if (empty) empty.hidden = visibleStores.length !== 0;

    root.innerHTML = visibleStores.map(function (store) {
      var firstProduct = (store.products && store.products[0]) ? store.products[0] : null;
      var productLabel = firstProduct ? firstProduct.name + " / " + firstProduct.benefit : "対象商品は店舗詳細で確認";
      var tags = (store.tags || []).map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + "</span>";
      }).join("");

      return [
        '<article class="shop-card">',
        store.image ? '  <figure class="shop-card__image"><img src="' + escapeHtml(store.image) + '" alt="" width="400" height="250" loading="lazy"></figure>' : "",
        '  <div class="shop-card__top">',
        '    <span class="genre-icon"><img src="' + genreIconUrl(store.genre) + '" alt="" width="26" height="26" loading="lazy"></span>',
        '    <span class="shop-card__genre">' + escapeHtml(store.genre) + "</span>",
        store.sample ? '    <span class="sample-label">サンプル</span>' : "",
        "  </div>",
        "  <h3>" + escapeHtml(store.name) + "</h3>",
        '  <p class="shop-card__catch">' + escapeHtml(store.catch) + "</p>",
        '  <p class="shop-card__benefit">' + escapeHtml(productLabel) + "</p>",
        '  <p class="shop-card__meta">' + escapeHtml(store.area) + " / " + escapeHtml(store.distance) + "</p>",
        '  <div class="tag-row">' + tags + "</div>",
        '  <div class="shop-card__actions">',
        '    <a class="button button--primary" href="shop.html?id=' + encodeURIComponent(store.id) + '">詳細を見る</a>',
        '    <a class="button button--outline" href="' + mapUrl(store) + '" target="_blank" rel="noopener noreferrer">地図を開く</a>',
        "  </div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function initShopsPage() {
    var searchInput = document.getElementById("shopSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchTerm = searchInput.value.trim();
        renderShopList();
      });
    }
    renderGenreFilters();
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
        '    <a class="button button--primary" href="shops.html">店舗一覧へ戻る</a>',
        "  </div>",
        "</section>"
      ].join("");
      return;
    }

    document.title = store.name + " | いなげ地域応援スポット";

    var productHtml = (store.products || []).map(function (product) {
      return [
        '<article class="product-card">',
        product.image ? '  <figure class="product-card__image"><img src="' + escapeHtml(product.image) + '" alt="" width="200" height="150" loading="lazy"></figure>' : "",
        "  <h3>" + escapeHtml(product.name) + "</h3>",
        '  <p class="product-card__benefit">' + escapeHtml(product.benefit) + "</p>",
        '  <p class="product-card__condition">' + escapeHtml(product.condition) + "</p>",
        "</article>"
      ].join("");
    }).join("");

    var tags = (store.tags || []).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + "</span>";
    }).join("");

    root.innerHTML = [
      '<section class="page-hero compact shop-detail-hero">',
      '  <div class="container">',
      '    <span class="genre-icon genre-icon--lg"><img src="' + genreIconUrl(store.genre) + '" alt="" width="34" height="34"></span>',
      '    <p class="eyebrow">' + escapeHtml(store.genre) + "</p>",
      "    <h1>" + escapeHtml(store.name) + "</h1>",
      '    <p class="shop-detail-lead">' + escapeHtml(store.catch) + "</p>",
      '    <div class="tag-row">' + tags + "</div>",
      '    <div class="detail-actions">',
      '      <a class="button button--primary" href="' + mapUrl(store) + '" target="_blank" rel="noopener noreferrer">地図を開く</a>',
      '      <a class="button button--outline" href="shops.html">一覧へ戻る</a>',
      "    </div>",
      "  </div>",
      "</section>",
      '<section class="section">',
      '  <div class="container detail-layout">',
      '    <aside class="detail-panel">',
      store.image ? '      <figure class="detail-panel__image"><img src="' + escapeHtml(store.image) + '" alt="" width="400" height="250"></figure>' : "",
      "      <h2>店舗情報</h2>",
      "      <dl>",
      "        <div><dt>エリア</dt><dd>" + escapeHtml(store.area) + "</dd></div>",
      "        <div><dt>目安</dt><dd>" + escapeHtml(store.distance) + "</dd></div>",
      "        <div><dt>条件</dt><dd>" + escapeHtml(store.conditions) + "</dd></div>",
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

  function initHomePage() {
    var bottomCta = document.getElementById("bottomCta");
    if (!bottomCta) return;

    var inlineCtas = document.querySelectorAll(".hero__cta, .final-cta .button");
    if (!inlineCtas.length || !("IntersectionObserver" in window)) {
      bottomCta.classList.add("is-visible");
      return;
    }

    var visibleCtas = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleCtas.add(entry.target);
        } else {
          visibleCtas.delete(entry.target);
        }
      });
      bottomCta.classList.toggle("is-visible", visibleCtas.size === 0);
    }, { threshold: 0.5 });

    inlineCtas.forEach(function (cta) {
      observer.observe(cta);
    });
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

    if (page === "home") {
      initHomePage();
      return;
    }

    loadStores()
      .then(function () {
        if (page === "shops") initShopsPage();
        if (page === "shop-detail") renderShopDetail();
      })
      .catch(function () {
        var target = document.getElementById("shopList") || document.getElementById("shopDetail");
        if (target) {
          target.innerHTML = '<p class="empty-state">店舗データを読み込めませんでした。時間をおいて再読み込みしてください。</p>';
        }
      });
  });
})();
