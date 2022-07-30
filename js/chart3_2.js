import * as config from "./config.js";
import * as graph from "./graph.js";

const dataSource = "../data/co2-03-consum.csv";

async function consumptionCo2PerCapita(worldChecked) {
  const data = await d3.csv(dataSource);
  const n = data.length;

  const columns = worldChecked
    ? data.columns.slice(1, 7)
    : data.columns.slice(1, 6);

  const capitaData = columns.map((id) => {
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

  const scales = graph.createScales([1990, 2020], [0, 24], width, height);
  const xScale = scales.xScale;
  const yScale = scales.yScale;

  const z = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(capitaData.map((v) => v.id));

  const X = {
    step: [1990, 2000, 2010, 2019],
    value: ["1990", "2000", "2010", "2019"],
    scale: xScale,
  };
  const Y = {
    step: [0, 5, 10, 15, 20, 24],
    value: ["0 t", "5 t", "10 t", "15 t", "20 t", "24 t"],
    scale: yScale,
  };

  graph.appendAxis(svg, height, X, Y);
  graph.appendTitle(svg, "Consumption-based CO2 emissions per capita");

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

  const description = [
    {
      type: d3.annotationCallout,
      note: {
        title: "Trend of consumption-based emissions",
        label: `CO2 emissions per capita slightly decline in the US and Japan while increasing in Russia and China.`,
        wrap: 320,
        padding: 3,
      },
      x: xScale(2010) + config.margin.left,
      y: yScale(12) + config.margin.bottom,
      dx: -50,
      dy: -35,
      connector: {
        end: "dot",
      },
    },
  ];

  const legend = [
    {
      note: {
        label: "US",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(17.1) + config.margin.bottom - 10,
      color: z("US"),
    },
    {
      note: {
        label: "Japan",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(11) + config.margin.bottom - 10,
      color: z("Japan"),
    },
    {
      note: {
        label: "Russia",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(9.5) + config.margin.bottom - 10,
      color: z("Russia"),
    },
    {
      note: {
        label: "China",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(6.6) + config.margin.bottom - 10,
      color: z("China"),
    },
    {
      note: {
        label: "India",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(1.8) + config.margin.bottom - 10,
      color: z("India"),
    },
  ];

  svg.append("g").call(d3.annotation().annotations(description));

  if (worldChecked) {
    legend.push({
      note: {
        label: "World",
      },
      x: xScale(2019) + config.margin.left + 30,
      y: yScale(4.76) + config.margin.bottom - 10,
      color: z("World"),
    });
  }

  svg
    .append("g")
    .call(d3.annotation().type(d3.annotationLabel).annotations(legend));

  const tag = {
    label: {
      text: "Consumption-based",
      x: xScale(1994.5) + config.margin.left,
      y: yScale(22.4) + config.margin.bottom,
    },
    x: xScale(1994.5) + config.margin.left,
    y: yScale(24) + config.margin.bottom,
    dir: "bottom",
  };
  graph.appendBadge(
    svg,
    tag,
    `The concept of "consumption-based" emissions is adjusted to account for cross-border trade.
    When importing or exporting products, all CO2 emissions resulting from the production of products are
    calculated by including or excluding.
    So, consumption-based emissions can reflect the lifestyle of citizens of each country.`
  );
}

export default consumptionCo2PerCapita;
