//Image upload

//Vision AI API request:
//filter JSON response for meaningful keywords
//(use a list of liquor types to look for?
//use a list of all ingredients?)

var urlSearchVar = '';
let uploadedImage


$("#search-button").on("click", function () {
    //urlSearchVar = $("#UriSearch").val();
    console.log(urlSearchVar);
    

    function textDetection() {
    body = {
        requests: [
            {
                image: {
                    content: `${urlSearchVar}`
                },
                features: [
                    {
                        maxResults: 10,
                        //Want to use text as well
                    
                        type: "TEXT_DETECTION", 
                       

                        
                    }
                ]
            }
        ]
    }
}

function labelDetection() {
    body2 = {
        requests: [
            {
                image: {
                    source: {
                        //Figure out how to put our photo here:
                        imageUri: `${urlSearchVar}`,
                       
                    }
                },
                features: [
                    {
                        maxResults: 10,
                        //Want to use text as well
                    
                        type: "LABEL_DETECTION", 
                       

                        
                    }
                ]
            }
        ]
    }
}

function objectLocal() {
    body3 = {
        requests: [
            {
                image: {
                    source: {
                        //Figure out how to put our photo here:
                        imageUri: `${urlSearchVar}`,
                       
                    }
                },
                features: [
                    {
                        maxResults: 10,
                        //Want to use text as well
                    
                        type: "OBJECT_LOCALIZATION", 
                       

                        
                    }
                ]
            }
        ]
    }
}



    textDetection();
    labelDetection();
    objectLocal();

    var settings = {
        "url": "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDtQXAjtldc8mxTZIGCPDDGYuBkg8hpzBE",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(body),
       
    }

    var settings2 = {
        "url": "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDtQXAjtldc8mxTZIGCPDDGYuBkg8hpzBE",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(body2),
       
    }


    $.ajax(settings).done(function (response) {

       console.log(response);
       var resultText;
       var arrayTextLabel = [];
        //TEXT DETECTION
        for (var i=0;i<response.responses[0].textAnnotations.length;i++) {
        resultText = response.responses[0].textAnnotations[i].description;
        console.log(response.responses[0].textAnnotations[i].description);
        arrayTextLabel.push(resultText)
        // var myJSON = JSON.stringify(resultText);
        // var resultText3 = response.responses[0].textAnnotations[0].description;
        
        }
        $.ajax(settings2).done(function (response2) {
            // WORKING CODE FOR LABEL_DETECTION
              var resultLabel;
              
             for (var i=0;i<response2.responses[0].labelAnnotations.length;i++){
             resultLabel = response2.responses[0].labelAnnotations[i].description;
             arrayTextLabel.push(resultLabel);
            
             // var myJSON = JSON.stringify(resultLabel);
             // var result3 = response2.responses[0].labelAnnotations[0].description;
            
       
         }
             
     })

       for (var i=0;i<arrayTextLabel.length;i++) {
        $(".cocktailResults").append(arrayTextLabel[i]+"<br>");
       }
        console.log(arrayTextLabel);

    })
    




        // var cocktail = {
        //     "url": "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+result3,
        //     "method": "GET",
        // }
                
        // $.ajax(cocktail).done(function (responseCocktail) {
        //     console.log(responseCocktail);
        //     for(let i=0;i<10;i++) {
        //     var result2 = responseCocktail.drinks[i].strDrink;
        //     var myJSON2 = JSON.stringify(result2);
        //     $(".results").append("<h1>"+myJSON2+"</h1>");
        //     }
        // })






});

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");


customBtn.addEventListener("click", function () {
    realFileBtn.click();
});

realFileBtn.addEventListener("change", function (event) {
    console.log(event.target.files[0])
    if (realFileBtn.value) {
        customTxt.innerHTML = realFileBtn.value.match(
            /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];
    } else {
        customTxt.innerHTML = "No file chosen, yet.";
    }
});




$("#real-file").change(function (event) {
    console.log(event.target.files)
    encodeImageFileAsURL(event.target);
});

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
     urlSearchVar = reader.result.split(',')[1]
    }
    reader.readAsDataURL(file);
  }

//Cocktail DB request:
//params based on keywords from Vision AI
//tries out different parameter permutations
//looks up each of those recipes by id , dumps JSON info for each
//filters those recipes to those with 5 or less 
//ingredients (or a number determined by max 
// number of ingredients)

let params = 'gin,lime'


let visionAIKeywords = [];


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

