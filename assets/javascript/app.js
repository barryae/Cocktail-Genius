//Image upload

//Vision AI API request:
//filter JSON response for meaningful keywords
//(use a list of liquor types to look for?
//use a list of all ingredients?)

function chooseFile() {
    $("#fileInput").click();
}

    var urlSearchVar ='';


$("#search-button").on("click", function(){
    urlSearchVar = $("#UriSearch").val();
    console.log(urlSearchVar);
    

function textDetection() {
    body = {
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

    var settings3 = {
        "url": "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDtQXAjtldc8mxTZIGCPDDGYuBkg8hpzBE",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(body3),
       
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
        type: 'GET',
        type2: 'GET',
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

