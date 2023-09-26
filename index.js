const searchForm = document.querySelector('#search-form')

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e.target['search-option'].value)
    console.log(e.target['search-bar'].value)
    search(e.target['search-option'], e.target['search-bar'].value)

    e.target.reset
})

function search(searchOption, searchValue){
    const searchValueWithPlus = searchValue.replace(/ /g, "+")
    console.log(searchValueWithPlus)
    const searchUrl = urlIdentifier(searchOption) + searchValueWithPlus 
    console.log(searchUrl)

}

function urlIdentifier(searchOption){
    if(searchOption === 'drinkName'){
        return 'www.thecocktaildb.com/api/json/v1/1/search.php?s='
    }else{
        return 'www.thecocktaildb.com/api/json/v1/1/filter.php?i='
    }
}