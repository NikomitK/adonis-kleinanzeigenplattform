//import '../scss/anzeige.scss'

import * as bootstrap from 'bootstrap'

const shipping = document.getElementById("shipping")

if (shipping) {
    var shippingPrice = document.getElementById("shipping_price");
    shippingPrice.disabled = !shipping.checked;
}

window.disableShippingPrice = function disableShippingPrice() {
    shippingPrice.disabled = !shipping.checked;
}
