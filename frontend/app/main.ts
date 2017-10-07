import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

//Views & Components
import { ShellComponent } from './views/shell/shell';
import { HomeComponent } from './views/home/home';
import { CheckoutComponent } from './views/checkout/checkout';
import { CartComponent } from './views/cart/cart';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

//Services
import { StoreService } from './services/store';
import { CartService } from './services/cart';

export const ROUTES = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    }
];

@NgModule({
   declarations: [
       ShellComponent,
       HomeComponent,
       CheckoutComponent,
       CartComponent,
       HeaderComponent,
       FooterComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(ROUTES)
   ],
   providers: [
       StoreService,
       CartService
   ],
   bootstrap: [
      ShellComponent
   ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);