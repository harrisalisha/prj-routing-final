import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
//import { Recipe } from "../recipes/recipe.model";

@Injectable({
  providedIn: 'root'
})//we inject recipeService n http service
export class DataStorageService {

  constructor(private http: HttpClient,
    private recipeService: RecipeService){}

  //storeRecipes(recipes: Recipe[]){}
  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://ngcourse-recipebook-ef7ea.firebaseio.com/recipes.json',
      recipes
    )
    .subscribe( response => {
      console.log( response);
    });
  }// u can do return n subscribe in component, or delete return subscribe() in service


}
//need to import Httpclientmodule in app module
//PUT is writing data in Firebase same like post or over writing
// subcribe() can done in service or component
