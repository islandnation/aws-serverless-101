import { Injectable } from '@angular/core';
import { IProduct, StoreService } from './store';

export interface ICartItem {
    product: IProduct,
    quantity: number
}

export interface IOrder {
    orderId: string;
}

@Injectable()
export class CartService {
    public contents: ICartItem[] = [];

    constructor(
        private storeService: StoreService) {}

    add(product: IProduct) {
        var item = this.contents.find(p => p.product === product);
        if (item) {
            item.quantity++;
            return;
        }

        this.contents.push(<ICartItem>{
            product: product,
            quantity: 1
        });
    }

    clear() {
        this.contents.length = 0;
    }

    remove(product: IProduct) {
        var index = this.contents.findIndex(p => p.product === product);
        if (index !== -1) {
            this.contents.splice(index, 1);
        }
    }

    purchase(customer: any): Promise<any> {
        if (this.contents.length === 0) {
            alert('No items in cart to purchase');
            return Promise.reject(new Error('No items in cart to purchase'));
        }
        return this.storeService.purchase({
            products: this.contents.map(p => {
                return {
                    sku: p.product.sku,
                    quantity: p.quantity
                };
            }),
            customer: customer
        });
    }

}