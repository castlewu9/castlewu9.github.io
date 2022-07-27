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
    .attr("style", "font-size:large;font-weight:bold;fill:darkblue;")
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

function appendBadge(svg, tag, htmlText) {
  const badge = [
    {
      type: d3.annotationBadge,
      x: tag.x,
      y: tag.y,
      subject: {
        text: "?",
        radius: 10,
        x: tag.dir === "left" || tag.dir === "right" ? tag.dir : null,
        y: tag.dir === "top" || tag.dir === "bottom" ? tag.dir : null,
      },
      color: ["#E8336D"],
    },
  ];

  const w = getClientRect().width;
  const h = getClientRect().height;

  svg
    .append("g")
    .call(d3.annotation().annotations(badge))
    .on("mouseover", () =>
      d3.select(`#${tooltipElementId}`).style("display", null)
    )
    .on("mouseout", () =>
      d3.select(`#${tooltipElementId}`).style("display", "none")
    )
    .on("mousemove", () => {
      let x = w * 0.5 + config.margin.left;
      const y = h * 0.4;

      if (x < d3.event.pageX && x + 420 >= d3.event.pageX) {
        x = d3.event.pageX + 10;
      }
      d3.select(`#${tooltipElementId}`)
        .style("left", `${x}px`)
        .style("top", `${y}px`);
      d3.select(`#${tooltipElementId}`).style("display", "block");
      d3.select(`#${tooltipElementId}`).html(htmlText);
    });
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

  emission.sort((d1, d2) => {
    const a = d1.count === "" ? 0 : parseFloat(d1.count);
    const b = d2.count === "" ? 0 : parseFloat(d2.count);
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  });

  emission.forEach((c) => {
    const val =
      unit === "bt"
        ? (c.count / 1e9).toFixed(2)
        : parseFloat(c.count).toFixed(2);
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
  appendBadge,
  displayTooltip,
  locateTooltip,
  updateTooltip,
  gatherDataPerYear,
  createTooltipText,
  clearGraphs,
};
