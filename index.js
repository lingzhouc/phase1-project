const searchForm = document.querySelector('#search-form')
const resultsDiv = document.querySelector('#drink-results')
const drinkDiv = document.querySelector("#selected-drink")
const sortField = document.querySelector('#sort-by')
const randomBtn = document.querySelector("#random")

let favoritesArray = []
let favoritesIds = []

//Get favorites and store them in an Array
fetch('http://localhost:3000/favorites')
    .then(r => r.json())
    .then(response => {
        favoritesArray = Array.from(response)
        favoritesArray.forEach(drink => {
            favoritesIds.push(drink.id)
        })
        setFavoritesButton()
        sortField.disabled = true
        sortField.selectedIndex = 0
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            sortField.disabled = false
            sortField.selectedIndex = 0
            document.querySelector("#showing-results").textContent = `Showing results for: "${e.target["search-bar"].value}"`
            resultsDiv.innerHTML = ""
            drinkDiv.innerHTML = ""
            search(e.target['search-option'], e.target['search-bar'].value)
        })
        sortField.addEventListener('change', sortCards)

        randomBtn.addEventListener("click", renderRandom)
        function renderRandom () {
            document.querySelector("#showing-results").textContent = "Here's your surprise! A random drink!"
            resultsDiv.innerHTML = ""
        
            fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php") 
                .then(r => r.json())
                .then(drink => {
                    createDrinkCard(drink.drinks[0])
                })
            }

        function search(searchOption, searchValue){
            drinkDiv.setAttribute("style", "border: none")
            const searchValueWithPlus = searchValue.replace(/ /g, "+")
            const searchUrl = urlIdentifier(searchOption) + searchValueWithPlus 
            fetch(searchUrl)
            .then(r => {
                if(r.ok) {
                    return r.json()
                } else {
                    throw r.statusText
                }
            })
            .then(result => {
                const drinksArr = result.drinks
                if (drinksArr !== null){
                    drinksArr.forEach(createDrinkCard) 
                }else{
                    throw('none')
                }
            }).catch(error => {
                sortField.disabled = true
                resultsDiv.textContent = 'No drinks found. Try again!'
            })
        }

        function urlIdentifier(searchOption){
            if(searchOption.value === 'drinkName'){
                if(document.querySelector('#sortByIngredients') === null && document.querySelector('#sortByIngredientsReverse') === null) {
                    byIngredientAmount = document.createElement('option')
                    byIngredientAmount.value = "byIngredient"
                    byIngredientAmount.id = 'sortByIngredients'
                    byIngredientAmount.textContent = "Least Ingredients"

                    byIngredientAmountReverse = document.createElement("option")
                    byIngredientAmountReverse.value = "byIngredientReverse"
                    byIngredientAmountReverse.id = "sortByIngredientsReverse"
                    byIngredientAmountReverse.textContent = "Most Ingredients"

                    document.querySelector('#sort-by').append(byIngredientAmount, byIngredientAmountReverse)
                    
                    return 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
                } else {
                    return 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
                }
            }else{
                try{
                    document.querySelector('#sortByIngredients').remove()
                    document.querySelector('#sortByIngredientsReverse').remove()
                }catch{}
                return 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='
            }
        }

        function createDrinkCard(drink){
            const drinkCard = document.createElement('div')
            drinkCard.className = 'drink-card'
            const drinkName = document.createElement('p')
            drinkName.className = 'drink-name'
            drinkName.textContent = drink.strDrink
            const drinkImg = document.createElement('img')
            drinkImg.className = 'drink-image'
            drinkImg.src = drink.strDrinkThumb
            drinkImg.alt = drink.strDrink
            drinkCard.append(drinkImg, drinkName)
            resultsDiv.append(drinkCard)
            let category = ''
            let glass = ''
            let drinkInstructions = ''
            let alcoholic = ''
            let ingredient = ''
            let numIngredients = ''
            let drinkId = ''
            addClickForDetails(drink)

            // click drink img to see info
            function addClickForDetails(drink){
                if(!drink.strCategory){
                    drinkId = parseInt(drink.idDrink)
                    drinkImg.addEventListener("click", e=>{
                        fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+drinkId)
                        .then(r=> r.json())
                        .then(response =>{
                        const newDrink = response.drinks[0]
                        setDetails(newDrink)
                        populateDetails(e)})
                    })
                }else{
                    drinkId = parseInt(drink.idDrink)
                    setDetails(drink)
                    drinkImg.addEventListener("click", populateDetails)
                }
            }
            
            function setDetails(drink){
                ingredient = ''
                category = drink.strCategory
                glass = drink.strGlass 
                drinkInstructions = drink.strInstructions
                setAlchoholic(drink)
                setIngredients(drink)
            }

            function setIngredients(drink){
                for (let i = 1; i < 16; i++) {
                    if (!drink["strIngredient"+ i]){
                        numIngredients = i-1
                        drinkCard.classList.add(numIngredients + '-ingredients')
                        break
                    };
                    if (drink["strMeasure"+ i] !== null){
                        ingredient += `${drink["strMeasure"+ i]} ${drink["strIngredient"+ i]} <br>`;
                    }else{
                        ingredient += `${drink["strIngredient"+ i]} <br>`;
                    }
                }
            }

            function setAlchoholic(drink){
                if (drink.strAlcoholic === "Alcoholic") {
                    alcoholic = "Yes"
                } else {
                    alcoholic = "No"
                }
            }

            function populateDetails(event){
                drinkDiv.setAttribute("style", "border: double")
                drinkDiv.innerHTML = `
                    <h2 id="selected-name">${drinkName.textContent}</h1>
                    <img id="selected-image" src="${drinkImg.src}">
                <div id="selected-details">
                        <p>Category: ${category}</p>
                        <p>Alcoholic: ${alcoholic}</p>
                        <p>Glass: ${glass}</p>
                </div>
                    <h3 class="selected-titling">Ingredients: ${numIngredients}</h3>
                    <p id="selected-ingredients">${ingredient}</p>
                    <h3 class="selected-titling">Instructions</h3>
                    <p id="selected-instructions">${drinkInstructions}</p>
                `
                createAddFavoritesButton()
            }

            function createAddFavoritesButton(){
                addFavoritesButton = document.createElement('button')
                if (favoritesIds.includes(drinkId)){
                    addFavoritesButton.textContent = "Remove from Favorites"
                    addFavoritesButton.id = 'favorites-button'
                    addFavoritesButton.addEventListener('click', deleteFavorite)
                    drinkDiv.append(addFavoritesButton)
                }else{
                    addFavoritesButton.textContent = "Add to Favorites"
                    addFavoritesButton.id = 'favorites-button'
                    addFavoritesButton.addEventListener('click', postFavorite)
                    drinkDiv.append(addFavoritesButton)
                }
            }

            function postFavorite(e){
                fetch('http://localhost:3000/favorites',{
                    method : 'POST',
                    headers : {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({id : parseInt(drinkId), strDrinkThumb : drinkImg.src, strDrink : drinkName.textContent})
                }).then(r => r.json())
                .then(response => {
                    addFavoritesButton.textContent = 'Remove from Favorites'
                    addFavoritesButton.removeEventListener('click', postFavorite)
                    addFavoritesButton.addEventListener('click', deleteFavorite)
                    favoritesArray.push(response)
                    favoritesIds.push(response.id)
                })
            }
            
            function deleteFavorite(e){
                fetch('http://localhost:3000/favorites/'+drinkId,{
                    method : 'DELETE',
                    headers : {
                        "Content-Type": "application/json",
                    }
                }).then(r => r.json())
                .then(response => {
                    addFavoritesButton.textContent = 'Add to Favorites'
                    addFavoritesButton.removeEventListener('click', deleteFavorite)
                    addFavoritesButton.addEventListener('click', postFavorite)
                    const newFavorites = favoritesArray.filter(fave => fave.id !== drinkId)
                    favoritesArray = newFavorites
                    const newFavoritesIds = favoritesIds.filter(id => id !== drinkId)
                    favoritesIds = newFavoritesIds
                })
            }
        }

        function sortCards(sortEvent){

            const drinkCards = Array.from(document.querySelectorAll('.drink-card'))
            let sortedDrinkCards = []
            if (sortEvent.target.value == "a-to-z"){
                sortedDrinkCards = drinkCards.sort((a,b)=>{
                    return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
                })
            }else if (sortEvent.target.value == "z-to-a"){
                sortedDrinkCards = drinkCards.sort((a,b)=>{
                    return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
                }).reverse()
            } else if (sortEvent.target.value == "byIngredient") {
                sortedDrinkCards = drinkCards.sort((a,b)=>{
                    return a.classList[1][0].localeCompare(b.classList[1][0])
                })
            } else if (sortEvent.target.value == "byIngredientReverse") {
                sortedDrinkCards = drinkCards.sort((a,b)=>{
                    return a.classList[1][0].localeCompare(b.classList[1][0])
                }).reverse()     
            }
            for(card of sortedDrinkCards){
                resultsDiv.append(card)
            }
        }

        function setFavoritesButton(){
            const favoritesButton = document.querySelector('#favorites')
            favoritesButton.textContent = 'Favorites'
            favoritesButton.addEventListener('click',e=>{
                drinkDiv.setAttribute("style", "border: none")
                sortField.selectedIndex = 0
                sortField.disabled = false
                try{
                    document.querySelector('#sortByIngredients').remove()
                }catch{}
                if (favoritesArray.length !== 0){
                    resultsDiv.innerHTML = ''
                    drinkDiv.innerHTML = ""
                    favoritesArray.forEach(drink=>{
                        drink.idDrink = drink.id
                        createDrinkCard(drink)
                    }) 
                }else{
                    resultsDiv.textContent = 'No favorites set. Try searching!'
                }
            })
            searchForm.parentNode.append(favoritesButton)
        }

        
    



    
    
    })
