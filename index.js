const searchForm = document.querySelector('#search-form')
const resultsDiv = document.querySelector('#drink-results')
const sortField = document.querySelector('#sort-by')

sortField.disabled = true

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sortField.disabled = false
    sortField.selectedIndex = 0
    resultsDiv.innerHTML = ''
    search(e.target['search-option'], e.target['search-bar'].value)

    e.target.reset
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
    drinkCard.append(drinkImg, drinkName)
    resultsDiv.append(drinkCard)
}

function sortCards(sortEvent){
    const drinkCards = Array.from(document.querySelectorAll('.drink-card'))
    let sortedDrinkCards = []
    if (sortEvent.target.value === 'alphabetical'){
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            const compareValue = a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
            return compareValue
        })
    }else{
        sortedDrinkCards = drinkCards.sort((a,b)=>{
            const compareValue = a.querySelector('p').textContent.localeCompare(b.querySelector('p').textContent)
            return compareValue
        }).reverse()
    }
    for (card of sortedDrinkCards){
        resultsDiv.append(card)
    }
}
