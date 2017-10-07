import { Component } from '@angular/core';
import { StoreService, IProduct, IOrder } from './../../services/store';
import { CartService, ICartItem } from './../../services/cart';

interface ICheckoutForm {
    email: string;
    firstName: string;
    lastName: string;
}

@Component({
    templateUrl: 'checkout.html'
})
export class CheckoutComponent {
    private form: ICheckoutForm = <ICheckoutForm>{};
    order: IOrder;
    processing = false;
    error = false;

    constructor(
        private storeService: StoreService,
        public cartService: CartService) {}

    purchase() {
        this.error = false;
        this.processing = true;

        this.cartService.purchase(this.form).then(order => {
            this.processing = false;
            this.order = order;
            this.cartService.clear();
        }, err => {
            this.processing = false;
            this.error = true;
        });
    }

    calculateTotalPrice(): number {
        return this.cartService.contents.map(p => p.quantity * p.product.price).reduce((a, b) => a + b, 0);
    }
}
