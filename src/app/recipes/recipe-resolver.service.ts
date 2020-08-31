import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";

@Injectable({
  providedIn: 'root'
})

export class RecipeResolverService implements Resolve<Recipe[]>{

  constructor(private dataStorageService: DataStorageService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.dataStorageService.fetchrecipes();
  }


}

//resolver is code that run b4 route is loaded
