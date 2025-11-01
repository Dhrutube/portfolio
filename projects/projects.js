import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// const projects = await fetchJSON('../lib/projects.json');
let projects = await fetchJSON('../lib/projects.json'); //fetch your project data

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

const h1 = document.querySelector('.projects-title');
h1.textContent = `${projects.length} Projects`;

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });


    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    // let selectedIndex = -1   // convention for no index
    // let svg = d3.select('svg');
    // let legend = d3.select('.legend')
    // svg.selectAll('path').remove();
    // newArcs.forEach((arc, i) => {
    // svg
    //     .append('path')
    //     .attr('d', arc)
    //     .attr('fill', colors(i))
    //     .on('click', () => {
    //         selectedIndex = selectedIndex === i ? -1 : i;
    //     });

    //     svg
    //     .selectAll('path')
    //     .attr('class', (_, idx) => (
    //     // TODO: filter idx to find correct pie slice and apply CSS from above
    //     idx === selectedIndex ? 'selected' : null
    //     ));

    //     legend
    //     .selectAll('li')
    //     .attr('class', (_, idx) => (
    //     // TODO: filter idx to find correct legend and apply CSS from above
    //     idx === selectedIndex ? 'selected' : null
    //     ));
    // });

    // if (selectedIndex === -1) {
    //     renderProjects(projects, projectsContainer, 'h2');
    //   } else {
    //     // TODO: filter projects and project them onto webpage
    //     // Hint: `.label` might be useful
    //     let selectedLabel = newData[selectedIndex].label;  // newData should be in scope
    //     let filteredProjects = projects.filter(p => p.year === selectedLabel);
    //     renderProjects(filteredProjects, projectsContainer, 'h2');
    //   }

    // clearing up paths and legends
    let currSVG = d3.select('svg');
    currSVG.selectAll('path').remove();
    let currLegend = d3.select('.legend');
    currLegend.selectAll('li').remove()

    let newColors = d3.scaleOrdinal(d3.schemeTableau10);
    newArcs.forEach((arc, idx) => {
        d3.select('svg').append('path').attr('d', arc)
        // .attr('fill', colors[idx]);
        .attr('fill', newColors(idx));   // changing to (idx) from [idx] since colors is now a func()
    });

    // adding a legend
    let newLegend = d3.select('.legend');
    newData.forEach((d, idx) => {
    newLegend
        .append('li')
        .attr('class', 'legend-item')
        .html(
        `<span class="swatch" style="background:${newColors(idx)}"></span> ${d.label} <em>(${d.value})</em>`
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
