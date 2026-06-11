(function () {
  "use strict";

  var stores = [];
  var activeGenre = "all";
  var searchTerm = "";
  var visibleShopCount = 4;
  var SHOP_PAGE_SIZE = 4;

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

    var visibleStores = stores.filter(storeMatches);
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
      var cardImage = store.cardImage || store.image;
      var productHtml = (store.products || []).map(function (product) {
        return [
          "<li>",
          "  <strong>" + escapeHtml(product.name || "") + "</strong>",
          "  <span>" + escapeHtml(product.benefit || "") + "</span>",
          product.condition ? "  <small>" + escapeHtml(product.condition) + "</small>" : "",
          "</li>"
        ].join("");
      }).join("");
      var tags = (store.tags || []).map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + "</span>";
      }).join("");
      var condition = store.conditions || "利用条件は店舗で確認してください。";

      if (!productHtml) {
        productHtml = "<li><span>対象商品は調整中です。</span></li>";
      }

      return [
        '<article class="shop-card">',
        cardImage ? '  <figure class="shop-card__image"><img src="' + escapeHtml(cardImage) + '" alt="" width="1536" height="1024" loading="lazy"></figure>' : "",
        '  <div class="shop-card__top">',
        '    <span class="genre-icon"><img src="' + genreIconUrl(store.genre) + '" alt="" width="26" height="26" loading="lazy"></span>',
        '    <span class="shop-card__genre">' + escapeHtml(store.genre) + "</span>",
        store.sample ? '    <span class="sample-label">サンプル</span>' : "",
        "  </div>",
        "  <h3>" + escapeHtml(store.name) + "</h3>",
        '  <p class="shop-card__catch">' + escapeHtml(store.catch) + "</p>",
        '  <div class="shop-card__products">',
        '    <p class="shop-card__label">対象商品と特典</p>',
        "    <ul>" + productHtml + "</ul>",
        "  </div>",
        '  <p class="shop-card__conditions"><strong>利用条件</strong><span>' + escapeHtml(condition) + "</span></p>",
        '  <p class="shop-card__meta">' + escapeHtml(store.area) + " / " + escapeHtml(store.distance) + "</p>",
        '  <div class="tag-row">' + tags + "</div>",
        '  <div class="shop-card__actions">',
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
    renderShopList();
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
      })
      .catch(function () {
        var shopList = document.getElementById("shopList");
        if (shopList) {
          shopList.innerHTML = '<p class="empty-state">店舗データを読み込めませんでした。時間をおいて再読み込みしてください。</p>';
        }
      });
  });
})();
