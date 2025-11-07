import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// const projects = await fetchJSON('../lib/projects.json');
let projects = await fetchJSON('../lib/projects.json'); //fetch your project data

const projectsContainer = document.querySelector('.projects');
let selectedIndex = -1 // indicates no index
let Colors = d3.scaleOrdinal(d3.schemeTableau10);
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

const h1 = document.querySelector('.projects-title');
h1.textContent = `${projects.length} Projects`;

function renderPieChart(projectsGiven) {
    let RolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let Data = RolledData.map(([year, count]) => {
        return { value: count, label: year };
    });


    let SliceGenerator = d3.pie().value((d) => d.value);
    let ArcData = SliceGenerator(Data);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let Arcs = ArcData.map((d) => arcGenerator(d));

    // clearing up paths and legends
    let currSVG = d3.select('svg');
    currSVG.selectAll('path').remove();
    let currLegend = d3.select('.legend');
    currLegend.selectAll('li').remove()



    Arcs.forEach((arc, idx) => {
        d3.select('svg').append('path').attr('d', arc)
        .attr('fill', Colors(idx))   // changing to (idx) from [idx] since colors is now a func()
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            currSVG
            .selectAll('path')
            .attr('class', (_, idx) => (
            // 'selected' is the CSS class applied to the selected pie slice for highlighting.
            idx === selectedIndex ? 'selected' : null
            ));

            currLegend
            .selectAll('li')
            .attr('class', (_, idx) => (
            // 'selected' is the CSS class that highlights the currently selected legend item (and pie slice) by index.
            // using '' instead of null since '.legend-item null' is not a class
            // 
            // idx === selectedIndex ? 'selected' : ''
            `legend-item${idx === selectedIndex ? ' selected' : ''}`
            ));

            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
              } else {
                // TODO: filter projects and project them onto webpage
                // Hint: `.label` might be useful
                const selectedYear = Data[selectedIndex].label;
                const filtered = projects.filter(p => p.year === selectedYear);
                renderProjects(filtered, projectsContainer, 'h2');
              }
          });
    });

    // adding a legend
    Data.forEach((d, idx) => {
    currLegend
        .append('li')
        .attr('class', 'legend-item')
        .html(
        `<span class="swatch" style="background:${Colors(idx)}"></span> ${d.label} <em>(${d.value})</em>`
        );
    });
}


let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});