var MP_BUNDLES = {
  "propaganda-beanie": {
    bundleWith: "twilight-crux-necklace",
    bundleProductSlug: "propaganda-beanie-twilight-crux-bundle",
    originalTotal: 66,
    bundlePrice: 58,
    savings: 8,
    partnerName: "Twilight Crux Necklace",
    partnerPrice: 30,
    partnerImage: "",
    partnerDescription: "Twilight Crux Necklace — $38"
  }
};

function getCart() {
  return fetch('/api/bag')
    .then(function(r) { return r.json(); })
    .catch(function() { return null; });
}

function isInCart(cart, slug) {
  if (!cart || !cart.items) return false;
  return cart.items.some(function(item) {
    return item.product && (item.product.slug === slug || item.slug === slug);
  });
}

function getCurrentPageSlug() {
  var path = window.location.pathname;
  var parts = path.split('/');
  return parts[parts.length - 1] || parts[parts.length - 2];
}

function addToCart(slug, quantity) {
  return fetch('/api/bag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: slug, count: quantity || 1 })
  }).then(function(r) { return r.json(); });
}

function buildBundleCard(bundleConfig, cartHasBeanie) {
  var discountContent = document.querySelector('.detail-content.discount-open');
  if (!discountContent) {
    var allDetailContents = document.querySelectorAll('.detail-content');
    discountContent = allDetailContents[allDetailContents.length - 1];
  }
  if (!discountContent) return;

  var existingCard = discountContent.querySelector('.mp-bundle-card');
  if (existingCard) existingCard.remove();

  var buttonText = cartHasBeanie
    ? 'ADD NECKLACE — $' + bundleConfig.partnerPrice
    : 'ADD BOTH TO CART — $' + bundleConfig.bundlePrice;

  var savingsText = cartHasBeanie
    ? ''
    : '<p class="mp-bundle-savings" style="color:#c41e1e;font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">YOU SAVE $' + bundleConfig.savings + '</p>';

  var card = document.createElement('div');
  card.className = 'mp-bundle-card';
  card.style.cssText = 'padding:16px 0;border-bottom:1px solid #1e1e1e;margin-bottom:12px;';
  card.innerHTML =
    '<span style="color:#f5f2ed;font-size:9px;letter-spacing:4px;text-transform:uppercase;display:block;margin-bottom:12px;">BUNDLE & SAVE</span>' +
    '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:12px;">' +
      '<div class="mp-bundle-img" style="width:72px;height:90px;background:#111;flex-shrink:0;border:1px solid #1e1e1e;overflow:hidden;">' +
        '<img src="' + (bundleConfig.partnerImage || '') + '" style="width:100%;height:100%;object-fit:cover;display:' + (bundleConfig.partnerImage ? 'block' : 'none') + ';">' +
      '</div>' +
      '<div style="flex:1;">' +
        '<span style="color:#555;font-size:9px;letter-spacing:3px;text-transform:uppercase;display:block;margin-bottom:4px;">ALSO AVAILABLE</span>' +
        '<p style="color:#f5f2ed;font-size:12px;letter-spacing:1px;margin-bottom:4px;text-transform:uppercase;">' + bundleConfig.partnerName + '</p>' +
        '<p style="color:#888;font-size:11px;">$' + bundleConfig.partnerPrice + '</p>' +
        savingsText +
        '<p style="color:#555;font-size:10px;letter-spacing:1px;line-height:1.7;margin-top:8px;">Add this item to your cart' + (!cartHasBeanie ? ' along with the beanie' : '') + ' and get both for $' + bundleConfig.bundlePrice + ' total — saving $' + bundleConfig.savings + '.</p>' +
      '</div>' +
    '</div>' +
    '<button class="mp-bundle-btn" style="width:100%;background:#f5f2ed;color:#0a0a0a;border:none;padding:14px;font-size:10px;letter-spacing:4px;text-transform:uppercase;cursor:pointer;font-family:Space Mono,monospace;transition:all 0.2s ease;">' + buttonText + '</button>';

  var discountBlock = discountContent.querySelector('.discount-block');
  if (discountBlock) {
    discountContent.insertBefore(card, discountBlock);
  } else {
    discountContent.appendChild(card);
  }

  var btn = card.querySelector('.mp-bundle-btn');
  btn.addEventListener('mouseenter', function() {
    this.style.background = '#c41e1e';
    this.style.color = '#f5f2ed';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.background = '#f5f2ed';
    this.style.color = '#0a0a0a';
  });
  btn.addEventListener('click', function() {
    var self = this;
    self.textContent = 'ADDING...';
    self.style.background = '#333';
    self.disabled = true;

    if (cartHasBeanie) {
      addToCart(MP_BUNDLES['propaganda-beanie'].bundleWith, 1)
        .then(function() {
          self.textContent = 'ADDED!';
          self.style.background = '#1a1a1a';
          setTimeout(function() {
            self.textContent = 'ADD NECKLACE — $' + bundleConfig.partnerPrice;
            self.style.background = '#f5f2ed';
            self.style.color = '#0a0a0a';
            self.disabled = false;
          }, 2000);
        })
        .catch(function() {
          self.textContent = 'TRY AGAIN';
          self.style.background = '#c41e1e';
          self.disabled = false;
        });
    } else {
      addToCart(MP_BUNDLES['propaganda-beanie'].bundleProductSlug, 1)
        .then(function() {
          self.textContent = 'ADDED!';
          self.style.background = '#1a1a1a';
          setTimeout(function() {
            self.textContent = 'ADD BOTH TO CART — $' + bundleConfig.bundlePrice;
            self.style.background = '#f5f2ed';
            self.style.color = '#0a0a0a';
            self.disabled = false;
            initBundleLogic();
          }, 2000);
        })
        .catch(function() {
          self.textContent = 'TRY AGAIN';
          self.style.background = '#c41e1e';
          self.disabled = false;
        });
    }
  });
}

function initBundleLogic() {
  var pageSlug = getCurrentPageSlug();
  var bundleConfig = MP_BUNDLES[pageSlug];
  if (!bundleConfig) return;

  var allDetailRows = document.querySelectorAll('.detail-row');
  var discountRow = allDetailRows[allDetailRows.length - 1];
  var allDetailContents = document.querySelectorAll('.detail-content');
  var discountContent = allDetailContents[allDetailContents.length - 1];

  if (!discountRow || !discountContent) return;

  discountRow.style.display = 'flex';

  getCart().then(function(cart) {
    var cartHasBeanie = isInCart(cart, 'propaganda-beanie');
    buildBundleCard(bundleConfig, cartHasBeanie);
  });
}

document.addEventListener('DOMContentLoaded', initBundleLogic);
