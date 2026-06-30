// 국가 검색
const COUNTRIES = [
  "Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "DR Congo", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russia", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
];

// group by first letter
const grouped = {};
COUNTRIES.forEach(c => {
  const k = normalize(c[0]).toUpperCase();
  if (!grouped[k]) grouped[k] = [];
  grouped[k].push(c);
});
const searchWrap = document.querySelector('#search--wrap');
const letters = Object.keys(grouped).sort();
const listWrap = document.getElementById('sc-list-wrap');
const minimap  = document.getElementById('minimap');
const input    = document.getElementById('search-input');
const btn      = document.getElementById('search-btn');
let triggerBtn;

// --show
function showCountries(el){
	searchWrap.style.display = 'flex';
	triggerBtn = el;
	minimap.classList.remove('hidden');
    renderFull();
}
function hideCountries(){
	listWrap.scrollTo({ top: 0});
	input.value = '';
	searchWrap.style.display = 'none';
}

// --- callback ---
function onCountrySelect(country) {
	// 콜백: 여기서 원하는 동작 구현
	console.log('selected:', country);
	triggerBtn.classList.add('on');
	triggerBtn.innerText = country;
	listWrap.scrollTo({ top: 0});
	searchWrap.style.display = 'none';
	uiCheckValid();
}

// --- render full grouped list ---
function renderFull() {
  listWrap.innerHTML = '';
  letters.forEach(l => {
    const anchor = document.createElement('div');
    anchor.id = 'group-' + l;

    const head = document.createElement('div');
    head.className = 'letter-head';
    head.textContent = l;
    anchor.appendChild(head);

    grouped[l].forEach(c => {
      const item = document.createElement('div');
      item.className = 'country-item';
      item.textContent = c;
      item.addEventListener('click', () => onCountrySelect(c));
      anchor.appendChild(item);
    });

    listWrap.appendChild(anchor);
  });
}

function normalize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// --- render search results ---
function renderSearch(q) {
  listWrap.innerHTML = '';
  const ql = q.toLowerCase();
  const matches = COUNTRIES.filter(c => normalize(c).startsWith(normalize(q)));

  if (matches.length === 0) {
    const el = document.createElement('div');
    el.id = 'no-result';
    el.textContent = 'No results found for "' + q + '"';
    listWrap.appendChild(el);
    return;
  }

  matches.forEach(c => {
    const item = document.createElement('div');
    item.className = 'country-item';
    const matched = c.slice(0, q.length);
    const rest    = c.slice(q.length);
    item.innerHTML = '<span class="highlight">' + matched + '</span>' + rest;
    item.addEventListener('click', () => onCountrySelect(c));
    listWrap.appendChild(item);
  });
}

// --- minimap ---
function renderMinimap() {
  minimap.innerHTML = '';
  letters.forEach(l => {
    const span = document.createElement('span');
    span.className = 'mm-letter';
    span.textContent = l;
    span.dataset.letter = l;
    span.addEventListener('click', () => scrollToLetter(l));
    minimap.appendChild(span);
  });
}

function scrollToLetter(l) {
  const el = document.getElementById('group-' + l);
  if (!el) return;
  listWrap.scrollTo({ top: el.offsetTop - 132, behavior: 'smooth' });
  document.querySelectorAll('.mm-letter').forEach(e => e.classList.remove('active'));
  const target = minimap.querySelector('[data-letter="' + l + '"]');
  if (target) target.classList.add('active');
}

function getLetterFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (el && el.classList.contains('mm-letter')) return el.dataset.letter;
  return null;
}
minimap.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  const l = getLetterFromPoint(t.clientX, t.clientY);
  if (l) scrollToLetter(l);
}, { passive: false });

minimap.addEventListener('touchend', e => {
  const t = e.changedTouches[0];
  const l = getLetterFromPoint(t.clientX, t.clientY);
  if (l) scrollToLetter(l);
});

// --- search logic ---
let lastQ = '';

function doSearch() {
  const q = input.value.trim();
  if (q === lastQ) return;
  lastQ = q;
  if (q === '') {
    minimap.classList.remove('hidden');
    renderFull();
  } else {
    minimap.classList.add('hidden');
    renderSearch(q);
  }
}

// 선택 여부를 체크하고 버튼 활성화
function uiCheckValid(){
	requestAnimationFrame(() => {
		const selectValues = document.querySelectorAll('.select-country');
		const allSelect = [...selectValues].every(el => el.classList.contains('on'));
		const btnNext = document.querySelector('.btn--submit');
		if (allSelect) {
			btnNext.removeAttribute('disabled');
		} else {
			btnNext.setAttribute('disabled', true);
		}
	});
}

$(document).on('click', '#search-bar .clear-btn', function (e) {
	minimap.classList.remove('hidden');
    renderFull();
});