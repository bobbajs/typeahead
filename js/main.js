import Typeahead from "./Typeahead.js";

const typeaheadContainer = document.getElementById('typeaheadContainer');
const url = 'http://twitter.github.io/typeahead.js/data/countries.json';

const init = async() => {
    const response = await fetch(url);
    const countries = await response.json();

    const typeahead = new Typeahead(typeaheadContainer, countries);
}

init();