import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],

})
export class RecipesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
//delete recipeService in recipeComponent providers, place in app.module so that
// all the time available to the whole app
