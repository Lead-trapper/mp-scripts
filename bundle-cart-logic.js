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
  var discountContent = document.querySelector('.discount-content');
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
      '<div class="mp-bundle-img" style="width:72px;height:90px;background:#111;flex-shrink:0;border:1px soli
