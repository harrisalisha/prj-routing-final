import { AuthService } from "./../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable({
  providedIn: "root",
}) //we inject recipeService n http service
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  //storeRecipes(recipes: Recipe[]){}
  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://ngcourse-recipebook-ef7ea.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchrecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Recipe[]>(
          "https://ngcourse-recipebook-ef7ea.firebaseio.com/recipes.json",
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}

//need to import Httpclientmodule in app module
//PUT is writing data in Firebase same like post or over writing
// subcribe() can done in service or component
// u can do return n subscribe in component, or delete return subscribe() in service

// pipe line32 we transformdata using map rxjs n map it in js the ingredients n set to empty arry
// just incase that dont have ingredients
//tap() allow execute code without ordering data that fannel from operators
