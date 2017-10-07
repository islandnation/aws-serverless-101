import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

export interface IProduct {
    sku: string,
    name: string,
    price: number,
    image: string
}

export interface IOrder {
    orderId: string,
    total: number
}

@Injectable()
export class StoreService {
    private productPromise: Promise<IProduct[]>;

    constructor(
        private http: Http
    ) { }

    getProducts(): Promise<IProduct[]> {
        if (this.productPromise)
            return this.productPromise;

        this.productPromise = new Promise((resolve, reject) => {
            this.http.get(`/api/products`)
                .subscribe((response) => {
                    return resolve(response.json().products);
                }, (response) => {
                    return reject(response);
                });
        });
        return this.productPromise;
    }

    purchase(data: any): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            this.http.post(`/api/purchase`, data)
                .subscribe((response) => {
                    return resolve(response.json());
                }, (response) => {
                    return reject(response);
                });
        });
    }
}