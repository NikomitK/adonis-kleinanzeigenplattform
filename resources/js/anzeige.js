//import '../scss/anzeige.scss'

import * as bootstrap from 'bootstrap'

const shipping = document.getElementById("shipping")
const shippingPrice = document.getElementById("shipping_price")

if (shipping) {
    shippingPrice.disabled = !shipping.checked;
}

window.disableShippingPrice = function disableShippingPrice() {
    shippingPrice.disabled = !shipping.checked;
}
