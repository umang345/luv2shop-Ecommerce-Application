import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    //Check if we already have the item in the cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //Find the item in the cart based on id

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id==theCartItem.id);
     
      //Check if we found it
      alreadyExistInCart = (existingCartItem != undefined);
    }

    if (alreadyExistInCart) {

      //Increment the quaintity
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    //Compute total price and total quantity
    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let tempCartItem of this.cartItems)
    {
          totalPriceValue+=(tempCartItem.unitPrice*tempCartItem.quantity);
          totalQuantityValue+=tempCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue,totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log(`Contents of the Cart : `);
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, 
                  unitPrice=${tempCartItem.unitPrice}, subTotal=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity==0)
    {
         this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(cartItem : CartItem){
    const itemIndex:number = this.cartItems.findIndex(
                          tempCartItem => tempCartItem.id==cartItem.id);
     if(itemIndex>-1){
       this.cartItems.splice(itemIndex,1);

       this.computeCartTotals();
     }
     
  }
}
