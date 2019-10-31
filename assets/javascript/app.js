<<<<<<< Updated upstream
=======
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
                    imageUri: "https://bargainbriana.com/wp-content/uploads/Ocean-Breeze-EX-Cocktail-Ingredients.jpg"

                }
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

$.ajax(settings).then(function (response) {
    console.log(response);
});

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

//Cocktail DB request:
//params based on keywords from Vision AI
//tries out different parameter permutations
//looks up each of those recipes by id , dumps JSON info for each
//filters those recipes to those with 5 or less 
//ingredients (or a number determined by max 
// number of ingredients)

let params = 'gin,lime'
let ids = []

function initialCocktailDBQuery() {
    cocktailQuery = 'https://www.thecocktaildb.com/api/json/v2/8673533/filter.php?i=' + params
    $.ajax({
        url: cocktailQuery,
        type: 'GET'
    }).then(function (response) {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            id = response[i].idDrink
            ids.push(id)
        }
        IdQuery()
    })
}

function initialCocktailDBQuery() {

}

//format 
// Title of Cocktail
// Image
// Ingredients + amounts
// instructions
// glass?

>>>>>>> Stashed changes
