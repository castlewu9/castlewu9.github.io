import * as config from "./config.js";
import * as graph from "./graph.js";

const dataSource = "../data/co2-03-prod.csv";

async function productionCo2PerCapita() {
  const data = await d3.csv(dataSource);
  const n = data.length;

  const capitaData = data.columns.slice(1, 7).map((id) => {
    return {
      id: id,
      values: data.map((v) => {
        return { name: id, year: v.year, count: v[id] };
      }),
    };
  });

  const clientRect = graph.getClientRect();
  console.log(clientRect);
  const width = clientRect.width;
  const height = clientRect.height;

  const svg = graph.createSvg(width, height);

  const scales = graph.createScales([1800, 2020], [0, 22], width, height);
  const xScale = scales.xScale;
  const yScale = scales.yScale;

  const z = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(capitaData.map((v) => v.id));

  const X = {
    step: [1800, 1850, 1900, 1950, 2000, 2020],
    value: ["1800", "1850", "1900", "1950", "2000", "2020"],
    scale: xScale,
  };
  const Y = {
    step: [0, 5, 10, 15, 20, 22],
    value: ["0 t", "5 t", "10 t", "15 t", "20 t", "22 t"],
    scale: yScale,
  };

  graph.appendAxis(svg, height, X, Y);
  graph.appendTitle(svg, "Production-based CO2 emissions per capita");

  const draw = svg
    .selectAll(".graphs")
    .data(capitaData)
    .enter()
    .append("g")
    .attr("transform", `translate(${config.margin.left},${config.margin.top})`);

  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.count));

  draw
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .style("stroke", (d) => z(d.id));

  graph.displayTooltip("display", "none");

  draw
    .selectAll(".circle")
    .data((d) => d.values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.count))
    .attr("r", 2)
    .style("fill", (d) => z(d.name))
    .on("mouseover", () => graph.displayTooltip(null))
    .on("mouseout", () => graph.displayTooltip("none"))
    .on("mousemove", (d) => {
      const emissions = graph.gatherDataPerYear(capitaData, d.year);
      graph.locateTooltip(d3.event.pageX + 10, d3.event.pageY - 10);
      graph.displayTooltip("block");
      graph.updateTooltip(
        graph.createTooltipText({ year: d.year, emission: emissions }, "t")
      );
    });

  const annotations = [
    {
      note: {
        label: `The production-based, also called "territorial basis", is usually measured
         based on the amount of C02 emissions produced in each country.
         This method is calculated based on the emissions reported by each country and
         used as a national and international metric.`,
        wrap: 360,
        padding: 3,
      },
      x: xScale(1845) + config.margin.left,
      y: yScale(21) + config.margin.bottom,
    },
    {
      type: d3.annotationCallout,
      note: {
        title: `US`,
        label: `As of 2020, Qatar ranks first in CO2 emission per capita (37.02 tons).
         Compared to the US (14.24 tons), it is about 2.6 times, but considering
         the population and geolocation factors, it was excluded.`,
        wrap: 280,
        padding: 3,
      },
      x: xScale(1881) + config.margin.left,
      y: yScale(5) + config.margin.bottom,
      dx: -10,
      dy: -10,
      connector: {
        end: "dot",
      },
    },
    {
      note: {
        label: "US",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(14.3) + config.margin.bottom - 10,
      color: z("US"),
    },
    {
      note: {
        label: "Russia",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(10.8) + config.margin.bottom - 10,
      color: z("Russia"),
    },
    {
      note: {
        label: "Japan",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(8.5) + config.margin.bottom - 10,
      color: z("Japan"),
    },
    {
      note: {
        label: "China",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(7.3) + config.margin.bottom - 10,
      color: z("China"),
    },
    {
      note: {
        label: "World",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(4.5) + config.margin.bottom - 10,
      color: z("World"),
    },
    {
      note: {
        label: "India",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(1.8) + config.margin.bottom - 10,
      color: z("India"),
    },
  ];

  graph.appendAnnotations(svg, annotations);
}

export default productionCo2PerCapita;
