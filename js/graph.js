import * as config from "./config.js";

const contentElementId = "content";
const descriptionElementId = "content-desc";
const graphElementId = "content-graph";
const tooltipElementId = "content-tooltip";

function getClientRect() {
  const w =
    document.getElementById(descriptionElementId).clientWidth -
    config.gap.width;
  const h =
    document.getElementById(contentElementId).clientHeight -
    document.getElementById(descriptionElementId).clientHeight -
    config.gap.height;

  return { width: w, height: h };
}

function createSvg(width, height) {
  const svg = d3
    .select(`#${graphElementId}`)
    .attr("width", width)
    .attr("height", height);

  return svg;
}

function createScales(x, y, width, height) {
  const xScale = d3
    .scaleLinear()
    .domain(x)
    .range([0, width - (config.margin.left + config.margin.right)]);

  const yScale = d3
    .scaleLinear()
    .domain(y)
    .range([height - (config.margin.top + config.margin.bottom), 0]);

  return { xScale: xScale, yScale: yScale };
}

function appendTitle(svg, title) {
  const x = config.margin.left;
  const y = config.margin.top * 0.6;
  svg
    .append("g")
    .attr("transform", `translate(${x}, ${y})`)
    .append("text")
    .attr("style", "font: 1.2rem;font-weight:bold;fill:darkblue;")
    .text(title);
}

function appendAxis(svg, height, x, y) {
  const xLeft = config.margin.left;
  const xTop = height - config.margin.bottom;
  svg
    .append("g")
    .attr("transform", `translate(${xLeft},${xTop})`)
    .call(
      d3
        .axisBottom(x.scale)
        .tickValues(x.step)
        .tickFormat((_, i) => x.value[i])
    );

  const yLeft = config.margin.left;
  const yTop = config.margin.top;
  svg
    .append("g")
    .attr("transform", `translate(${yLeft}, ${yTop})`)
    .call(
      d3
        .axisLeft(y.scale)
        .tickValues(y.step)
        .tickFormat((_, i) => y.value[i])
    );
}

function appendAnnotations(svg, annotations) {
  const makeAnnotations = d3
    .annotation()
    .type(d3.annotationLabel)
    .annotations(annotations);

  svg.append("g").call(makeAnnotations);
}

function displayTooltip(display) {
  d3.select(`#${tooltipElementId}`).style("display", display);
}

function locateTooltip(x, y) {
  d3.select(`#${tooltipElementId}`)
    .style("left", `${x}px`)
    .style("top", `${y}px`);
}

function updateTooltip(html) {
  d3.select(`#${tooltipElementId}`).html(html);
}

function gatherDataPerYear(data, year) {
  const dataPerYear = [];
  data.forEach((d) => {
    const val = d.values.find((v) => {
      return v.year === year ? true : false;
    });
    dataPerYear.push(val);
  });
  return dataPerYear;
}

function createTooltipText(data, unit) {
  const { year, emission } = data;

  let text =
    unit === "bt"
      ? `<b>${year}</b><br/>unit: billion ton<br/><br/>`
      : `<b>${year}</b><br/>unit: ton<br/><br/>`;

  emission.forEach((c) => {
    const val = unit === "bt" ? (c.count / 1e9).toFixed(2) : c.count.toFixed(2);
    text = text + `${c.name}: ${val}<br/>`;
  });
  return text;
}

function clearGraphs() {
  const elements = d3.select(`#${graphElementId}`).selectAll("g");
  elements.remove();
}

export {
  getClientRect,
  createSvg,
  createScales,
  appendTitle,
  appendAxis,
  appendAnnotations,
  displayTooltip,
  locateTooltip,
  updateTooltip,
  gatherDataPerYear,
  createTooltipText,
  clearGraphs,
};
