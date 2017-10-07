import { Component } from '@angular/core';
import { CartService, ICartItem } from './../../services/cart';

@Component({
    templateUrl: 'cart.html'
})
export class CartComponent {
    constructor(
        public cartService: CartService) {}

    removeItem(item: ICartItem) {
        this.cartService.remove(item.product);
    }

    calculateTotalPrice(): number {
        return this.cartService.contents.map(p => p.quantity * p.product.price).reduce((a, b) => a + b, 0);
    }

}
