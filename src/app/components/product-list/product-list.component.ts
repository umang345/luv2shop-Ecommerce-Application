import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //New properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword:string = null;


  constructor(private productService: ProductService
    , private cartService:CartService
    , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }



  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }


  }

  handleSearchProducts() {

    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    //If we have a different keyword than before
    //Then we set the pageNumber to 1
    if(this.previousKeyword != theKeyword){
       this.thePageNumber=1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, Page Number=${this.thePageNumber}`);


    //Now search for the product using keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1
                                                ,this.thePageSize
                                                ,theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {

    //check if id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the id param string. Convert the string to number using the + symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category than previous
    //

    //If we have a different category id then set the pagination number back to 1

    if (this.previousCategoryId != this.currentCategoryId) {

      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`CurrentCategoryId=${this.currentCategoryId}, Page number=${this.thePageNumber}`);

    //Nowe get the products for this given product category id
    this.productService.getProductListPaginate(this.thePageNumber - 1
      , this.thePageSize
      , this.currentCategoryId
    ).subscribe(this.processResult());
  }

  processResult() {
       return data => {
              this.products = data._embedded.products;
              this.thePageNumber = data.page.number+1;
              this.thePageSize = data.page.size;
              this.theTotalElements = data.page.totalElements;

       }
  }

  updatePageSize(pageSize:number) {
    this.thePageSize = pageSize;
    this.thePageNumber=1;
    this.listProducts();

  }

  addToCart(theProduct:Product){

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const cartItem = new CartItem(theProduct);

    this.cartService.addToCart(cartItem);

  }
}
