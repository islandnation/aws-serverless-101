import { Component, OnInit } from '@angular/core';
import { StoreService, IProduct } from './../../services/store';
import { CartService } from './../../services/cart';

@Component({
    templateUrl: 'home.html'
})
export class HomeComponent implements OnInit {
    private products: IProduct[];
    private productsLoading = true;
    private productsError = false;

    constructor(
        private storeService: StoreService,
        private cartService: CartService) {}
    
    ngOnInit(): void {
        this.storeService.getProducts().then(res => {
            this.products = res;
            this.productsLoading = false;
        }, err => {
            this.productsLoading = false;
            this.productsError = true;
        });
    }

    addToCart(product: IProduct) {
        this.cartService.add(product);
        alert(`${product.name} added to cart`);
    }
}
