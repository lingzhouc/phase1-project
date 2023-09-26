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
        return 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
    }else{
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

    // click drink img to see info
    const category = drink.strCategory
    const glass = drink.strGlass 
    const drinkInstructions = drink.strInstructions

    drinkImg.addEventListener("click", () => {
        let alcoholic
        if (drink.strAlcoholic === "Alcoholic") {
            alcoholic = "Yes"
        } else {
            alcoholic = "No"
        }
       
        let ingredient = "";
        for (let i = 1; i < 16; i++) {
        if (!drink["strIngredient"+ i]) break;
        ingredient += `${drink["strMeasure"+ i]} ${drink["strIngredient"+ i]} <br>`;
        }

        drinkDiv.innerHTML = `
        <h2>${drinkName.textContent}</h1>
        <img src="${drinkImg.src}">
        <p>Category: ${category}</p>
        <p>Alcoholic: ${alcoholic}</p>
        <p>Glass: ${glass}</p>
        <h3>Ingredients</h3>
        <p>${ingredient}</p>
        <h3>Instructions</h3>
        <p>${drinkInstructions}</p>
        `
    })
}

function sortCards(sortEvent){

    const drinkCards = Array.from(document.querySelectorAll('.drink-card'))
    let sortedDrinkCards = []
    if (sortEvent.target.value === 'a-to-z'){
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
        })
    }else if (sortEvent.target.value === 'z-to-a'){
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            return a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
        }).reverse()
    } else {
        
    }
    for (card of sortedDrinkCards){
        resultsDiv.append(card)
    }
}

