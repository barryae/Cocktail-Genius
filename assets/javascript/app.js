//Image upload

//Vision AI API request:
//filter JSON response for meaningful keywords
//(use a list of liquor types to look for?
//use a list of all ingredients?)

function chooseFile() {
    $("#fileInput").click();
}

const body = {
    requests: [
        {
            image: {
                source: {
                    //Figure out how to put our photo here:
                    imageUri: "https://cloud.google.com/vision/docs/images/bicycle_example.png"

                }
            },
            features: [
                {
                    maxResults: 10,
                    //Want to use text as well
                    type: "OBJECT_LOCALIZATION"
                }
            ]
        }
    ]
}
var settings = {
    "url": "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDtQXAjtldc8mxTZIGCPDDGYuBkg8hpzBE",
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
    },
    "data": JSON.stringify(body)
}

// $.ajax(settings).done(function (response) {
//     console.log(response);
// });

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

customBtn.addEventListener("click", function () {
    realFileBtn.click();
});

realFileBtn.addEventListener("change", function () {
    if (realFileBtn.value) {
        customTxt.innerHTML = realFileBtn.value.match(
            /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];
    } else {
        customTxt.innerHTML = "No file chosen, yet.";
    }
});



//Here starts cocktails DB code:

//keywords from Vision AI image analysis

//list of ingredients taken from CocktailsDB


//partial Url query for the multiingredients search (needs ingredients
//seperated by commas)
const multiIngredientQueryUrl = 'https://www.thecocktaildb.com/api/json/v2/8673533/filter.php?i='

//partial Url query for search by ID
//needs ID string
const recipeIdQueryUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='

//function to test functions specific to Cocktail DB
//(add to main() later)
let visionAIKeywords = ['lime', 'vodka', 'sugar']
let recipes = [];
function cocktailDBTest() {
    const ingredientsList = getIngredientsList();
    console.log(ingredientsList);
    ingredientsFilter(ingredientsList);
    console.log(filteredIngredientKeywords);
}

function ingredientsFilter(ingredientsList, arr) {
    let filteredIngredientKeywords = [];
    for (let i = 0; i < arr.length; i++) {
        let keyword = arr[i];
        if (ingredientsList.includes(keyword)) {
            filteredIngredientKeywords.push(keyword);
        }
    }
    queryStringMaker(filteredIngredientKeywords)
}

function queryStringMaker(arr) {
    let queryStrings = []
    for (let i = 0; i < arr.length; i++) {
        queryStrings.push(arr[i])
        for (let n = i + 1; n < arr.length; n++) {
            let string = arr[i] + "," + arr[n]
            queryStrings.push(string)
            for (let x = n + 1; x < arr.length; x++) {
                let stringX = arr[i] + "," + arr[n] + "," + arr[x]
                queryStrings.push(stringX)
                for (let z = x + 1; z < arr.length; z++) {
                    let stringZ = arr[i] + "," + arr[n] + "," + arr[x] + "," + arr[z]
                    queryStrings.push(stringZ)
                }
            }
        }
    }
    getIds(queryStrings)
        .then(function (ids) {
            ids = ids.flat()
            const recipeReq = ids.map(function (id) {
                return checkId(id);
            });
            return Promise.all(recipeReq);
        })
        .then(function (recipes) {
            const filteredRecipes = {};
            for (let i = 0; i < recipes.length; i++) {
                const drink = recipes[i];
                const drinkId = drink.idDrink;
                const ingrNum = drink["strIngredient" + (visionAIKeywords.length + 1)];
                if (!filteredRecipes[drinkId] && ingrNum === null && drink.strAlcoholic == "Alcoholic" && drink.strCategory === "Ordinary Drink") {
                    let count = 0
                    for (let k in drink) {
                        const prop = drink[k]
                        for (let i = 0; i < visionAIKeywords.length; i++) {
                            if (prop !== null) {
                                if (k.includes('strIngredient') && prop.toLowerCase().includes(visionAIKeywords[i])) {
                                    count += 1
                                }
                            }
                        }
                    }
                    console.log(count)
                    if (count == visionAIKeywords.length - 1) {
                        filteredRecipes[drinkId] = drink;
                    }
                }
            }

            return Object.values(filteredRecipes);
        })
        .then(function (filteredRecipes) {
            console.log(filteredRecipes)
        })

}


function getIds(arr) {
    const postReqs = arr.map(function (ingr) {
        return makeIds(ingr);
    });
    return Promise.all(postReqs);
}


function makeIds(ingr) {
    return $.ajax({
        url: multiIngredientQueryUrl + ingr,
        method: 'GET'
    }).then(function (response) {
        if (!Array.isArray(response.drinks)) {
            return [];
        }
        return response.drinks.map(function (drink) {
            return drink.idDrink;
        });
    });
}

function checkId(id) {
    return $.ajax({
        url: recipeIdQueryUrl + id,
        method: 'GET'
    }).then(function (response) {
        return response.drinks[0];
    })
}



function getIngredientsList() {
    const ingredientsQueryUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
    $.ajax({
        url: ingredientsQueryUrl,
        method: 'GET'
    }).then(function (response) {
        const ingredientsList = [];
        let drinksArr = response.drinks;
        for (let i = 0; i < drinksArr.length; i++) {
            let ingredient = drinksArr[i].strIngredient1.toLowerCase();
            ingredientsList.push(ingredient);
        }
        ingredientsFilter(ingredientsList, visionAIKeywords)
    })
}

getIngredientsList();


//format 
// Title of Cocktail
// Image
// Ingredients + amounts
// instructions
// glass?

