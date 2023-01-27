import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let searchCountry = '';

inputSearch.addEventListener(
  'input',
  debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);

function onSearchCountryInput(e) {
  searchCountry = e.target.value.trim();
  if (searchCountry === '') {
    cleaner();
    return;
  } else
    fetchCountries(searchCountry)
      .then(countries => {
        if (countries.length === 1) {
          showCountryCard(countries);
          Notiflix.Notify.success('Here is your country');
        } else if (countries.length > 1 && countries.length < 10) {
          showCountryList(countries);
          Notiflix.Notify.success('Here is your countries');
        } else {
          cleaner();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        cleaner();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
}

function cleaner() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function showCountryCard(country) {
  const countryCard = country
    .map(
      ({ flags, name, capital, population, languages }) => `
  <div class = "country">
  <div class = "country-official">
  <img class = "country-flag" src = "${
    flags.svg
  }" alt = "country flag" width = "30">
  <h2 class = "country-name">${name.official}</h2>
  </div>
  <div class = "country-descr">
  <p><span class = "main-desc">Capital:</span>${capital}</p>
  <p><span class = "main-desc">Population:</span>${population}</p>
  <p><span class = "main-desc">Languages:</span>${Object.values(languages).join(
    ','
  )}</p>
  </div>
  </div>`
    )
    .join('');
  countryInfo.innerHTML = countryCard;
}

function showCountryList(countries) {
  const countryList = countries
    .map(
      ({ flags, name }) =>
        `
  <li class = "country-item">
   <img class = "country-flag" src = "${flags.svg}" alt = "country-flag" width = "40">
  <h2 class = "country-name">${name.official}</h2> 
  </li>`
    )
    .join('');
  countryInfo.innerHTML = countryList;
}
