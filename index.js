const searchForm = document.querySelector('#search-form')
const resultsDiv = document.querySelector('#drink-results')
const drinkDiv = document.querySelector("#selected-drink")
const sortField = document.querySelector('#sort-by')

sortField.disabled = true
sortField.selectedIndex = 0

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sortField.disabled = false
    sortField.selectedIndex = 0
    resultsDiv.innerHTML = ''
    search(e.target['search-option'], e.target['search-bar'].value)
})

sortField.addEventListener('change', sortCards)

function search(searchOption, searchValue){
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
        byIngredientAmount = document.createElement('option')
        byIngredientAmount.value = "byIngredient"
        byIngredientAmount.id = 'sortByIngredients'
        byIngredientAmount.textContent = "Least Ingredients"
        document.querySelector('#sort-by').append(byIngredientAmount)
        return 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
    }else{
        try{
            document.querySelector('#sortByIngredients').remove()
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
    drinkImg.width = 100
    drinkImg.height = 100
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

        // click drink img to see info
    if(!drink.strCategory){
        drinkId = drink.idDrink
        drinkImg.addEventListener("click", e=>{
            fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+drinkId)
            .then(r=> r.json())
            .then(response =>{
            const newDrink = response.drinks[0]
            setDetails(newDrink)
            populateDetails(e)})
        })
    }else{
        setDetails(drink)
        drinkImg.addEventListener("click", populateDetails)
    }
    
    function setDetails(drink){
        category = drink.strCategory
        glass = drink.strGlass 
        drinkInstructions = drink.strInstructions
        if (drink.strAlcoholic === "Alcoholic") {
            alcoholic = "Yes"
        } else {
            alcoholic = "No"
        }
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

    function populateDetails(event){
        drinkDiv.innerHTML = `
            <h2>${drinkName.textContent}</h1>
            <img src="${drinkImg.src}">
            <p>Category: ${category}</p>
            <p>Alcoholic: ${alcoholic}</p>
            <p>Glass: ${glass}</p>
            <h3>Ingredients: ${numIngredients}</h3>
            <p>${ingredient}</p>
            <h3>Instructions</h3>
            <p>${drinkInstructions}</p>
        `
    }
}

function sortCards(sortEvent){

    const drinkCards = Array.from(document.querySelectorAll('.drink-card'))
    let sortedDrinkCards = []
    if (sortEvent.target.value === 'a-to-z'){
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
        })
    }else if (sortEvent.target.value === "z-to-a"){
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
        }).reverse()
    }else{
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            return a.classList[1][0].localeCompare(b.classList[1][0])
        })
    }
    for (card of sortedDrinkCards){
        resultsDiv.append(card)
    }
}

