import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-ingredients',
  templateUrl: './select-ingredients.component.html',
  styleUrls: ['./select-ingredients.component.css']
})
export class SelectIngredientsComponent implements OnInit {

  listOfIngredients: String[] = [];
  selectedIngredients: String[] = [];
  selectedIngredient: String = "";
  listOfRecipes: any[] = [];
  listOfInstructions: { [id: number]: String[]; } = {};
  noRecipeFound = false;

  //move this somewhere later
  apiKey = "c361293b57294812883d0983c5a7c813";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getIngredients().then((file: Blob) => {

      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let csvData = reader.result;
        this.listOfIngredients = (<string>csvData).split(/\r\n|\n/);
        this.listOfIngredients.forEach(function (ingredient, index) {
          this[index] = <string>ingredient.split(";")[0]
            .toLowerCase()
            .split(' ')
            .map(function (word) {
              return word[0].toUpperCase() + word.substr(1);
            })
            .join(' ');;
        }, this.listOfIngredients);
      };

      reader.onerror = function () {
        console.log('Error is occured while reading file!');
      };
    }).catch(function (error) {
      console.log("Error downloading list of ingredients");
      console.log(error);
    })
  }

  async getIngredients(): Promise<Blob> {
    const file = await this.http.get<Blob>(
      "https://spoonacular.com/application/frontend/downloads/top-1k-ingredients.csv",
      { responseType: 'blob' as 'json' }).toPromise();
    return file;
  }

  addIngredient() {
    if (this.selectedIngredient != "" && !(this.selectedIngredients.includes(this.selectedIngredient))) {
      this.selectedIngredients.push(this.selectedIngredient);
    }
  }

  removeIngredient(ingredient: String) {
    this.selectedIngredients = this.selectedIngredients.filter(function (value, index, arr) {
      return value != ingredient;
    }, ingredient)
  }

  findRecipe() {
    let baseUrl = "https://api.spoonacular.com/recipes/findByIngredients";
    let ingString = this.selectedIngredients.join(",");
    this.getEntity(baseUrl + "?apiKey=" + this.apiKey + "&ingredients=" + ingString + "&ranking=2").then(recipes => {
      this.listOfRecipes = recipes.map(recipe => {
        let temp = [];
        recipe.missedIngredients.forEach(missedIng => {
          temp.push(missedIng.name);
        });
        recipe.missedIngredientsString = temp.join(", ");
        return recipe;
      });
      this.noRecipeFound = this.listOfRecipes.length == 0;
      // let idString = this.listOfRecipes.map(recipe => {
      //   return recipe.id;
      // }).join(",");
    });
  }

  async getEntity(url): Promise<any> {
    const recipes = await this.http.get(url).toPromise();
    return recipes;
  }

  viewRecipe(recipeId) {
    if (!(recipeId in this.listOfInstructions)) {
      let baseUrl = "https://api.spoonacular.com/recipes/" + recipeId + "/analyzedInstructions";
      this.getEntity(baseUrl + "?apiKey=" + this.apiKey).then(instructions => {
        if (instructions.length != 0) {
          this.listOfInstructions[recipeId] = instructions[0].steps.map(instruction => {
            return instruction.number + ". " + instruction.step;
          })
        }
        else {
          this.listOfInstructions[recipeId] = ["Oops! Unable to find instructions. Please try a different recipe!"]
        }
      });
    }
  }
}
