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



    const body = {
        requests: [
            {
                image: {
                    content: `${urlSearchVar}`
                },
                features: [
                    {
                        maxResults: 10,
                        //Want to use text as well
                        type: "LABEL_DETECTION"
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

    $.ajax(settings).done(function (response) {
        console.log(response);
        var result = response.responses[0].labelAnnotations[0].description;
        console.log(result);
        var myJSON = JSON.stringify(result);
        $(".results").append("<h1>" + myJSON + "</h1>");
    })




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
let ingredientsList = [];
const ingredientsQueryUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'

const multiIngredientQueryUrl = 'https://www.thecocktaildb.com/api/json/v2/8673533/filter.php?i='
const recipeIdQueryUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='

let filteredIngredientKeywords = []
function ingredientsFilter() {


}

let ingredientQueries = []
function queryPermutations() {

    return ingredientQueries;
}


let ids = []
function getIds() {
    return ids;
}

let recipeResults = []
function queryIds() {
    return recipeResults;
}


function getIngredientsList() {
    $.ajax({
        url: ingredientsQueryUrl,
        method: 'GET'
    }).then(function (response) {
        let drinksArr = response.drinks;
        for (let i = 0; i < drinksArr.length; i++) {
            let ingredient = drinksArr[i].strIngredient1;
            ingredientsList.push(ingredient);
        }
        console.log(ingredientsList);
    })
}


//format 
// Title of Cocktail
// Image
// Ingredients + amounts
// instructions
// glass?

