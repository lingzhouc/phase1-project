const searchForm = document.querySelector('#search-form')
const resultsDiv = document.querySelector('#drink-results')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    resultsDiv.innerHTML = ''
    console.log(e.target['search-option'].value)
    console.log(e.target['search-bar'].value)
    search(e.target['search-option'], e.target['search-bar'].value)

    e.target.reset
})

function search(searchOption, searchValue){
    const searchValueWithPlus = searchValue.replace(/ /g, "+")
    const searchUrl = urlIdentifier(searchOption) + searchValueWithPlus 
    console.log(searchUrl)
    fetch(searchUrl)
    .then(r => {
        if(r.ok) {
            return r.json()
        } else {
            throw r.statusText
        }
    })
    .then(result => { console.log(result)
        const drinksArr = result.drinks
        console.log(drinksArr)
        if (drinksArr !== null){
            drinksArr.forEach(createDrinkCard)
        }else{
            resultsDiv.textContent = 'No drinks found. Try again!'
        }
    }).catch(error => resultsDiv.textContent = 'No drinks found. Try again!')
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
    console.log(drinkImg)
    drinkImg.src = drink.strDrinkThumb
    drinkCard.append(drinkImg, drinkName)
    resultsDiv.append(drinkCard)
}