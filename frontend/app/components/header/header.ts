import { Component } from '@angular/core';
import { CartService, ICartItem } from './../../services/cart';

@Component({
    selector: 'app-header',
    templateUrl: 'header.html'
})
export class HeaderComponent {
    constructor(
        public cartService: CartService) {}

    calculateTotalQuantity(): number {
        return this.cartService.contents.map(p => p.quantity).reduce((a, b) => a + b, 0);
    }
}
