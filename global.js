console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// '''
// // collection of all nav links
// let navLinks = $$("nav a");

// // getting current link
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );
// // assigning class=current to current link automatically
// // ?. is an operator which prevents an error and assigns undefined in case currentLink is null or undefined
// currentLink?.classList.add('current');
// '''

// Client-side JS is not the best way to handle site-wide templating, but it’s good as a temporary fix, and as a learning exercise.

// Creating a navbar for all pages using JavaScript
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/Dhrutube', title: 'GitHub'}
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name

// 
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    // Create link and add it to nav
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
    if (a.host !== location.host && a.pathname !== location.pathname) {
        a.target = '_blank';
    }
  }

document.body.insertAdjacentHTML(
'afterbegin',
`
    <label class="color-scheme">
        Theme:
        <select>
            <option value='light dark'>OS</option>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
        </select>
    </label>`,
);

let select = document.querySelector('.color-scheme select')
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
  });

if ("colorScheme" in localStorage) {
    let scheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', scheme);
    select.value = scheme;
}

let form = document.querySelector('form');
form?.addEventListener('submit', function(event) {
  event.preventDefault();
  let data = new FormData(form);

  // to build URL
  let params = [];
  for (let [name, value] of data) {
    // TODO build URL parameters here
    params.push(`${name}=${encodeURIComponent(value)}`);
    console.log(name, encodeURIComponent(value));
  }
  let url = form.action + '?' + params.join('&');
  location.href = url;
});