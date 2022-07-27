import * as config from "./config.js";
import * as graph from "./graph.js";

const dataSource = "../data/co2-01-fuel.csv";

function showOilCrisis() {
  return `<b>1973 & 1979 Oil Crises</b><br/>The first oil shock began in October 1973 to
   target nations supported Israel during the Yom Kippur War.
   In March 1974, the price of oil had risen nearly 300%, and caused an oil crisis.<br/>
   <img src="./styles/images/Crude_oil_prices_since_1861.png" alt="oil" style="margin:5px;"/><br/>
   Oil prices in USD, 1861–2015.<br/>Red, adjusted for inflation. Blue, not adjusted.<br/>
   The above graph shows that oil prices rocketed since 1973. "Ref.: the Wikipedia".
   <br/><br/>After two oil shocks, countries have tried to reduce their use of oil,
   and oil consumption has been gradually slowing down since 1979.<br/>
   `;
}

function showOthers() {
  return `<b>Cement</b><br/>
   To produce 1kg of cement, it is known that 0.9kg of CO2 is generated.</br></br>
   <b>Flaring</b><br/>
   Flaring is part of standard safety engineering for oil extraction. It generated 440 million tons of CO2 in 2020.<br></br>
   <b>Other Industry</b><br/>
   Other industry emits approximately 300 million ton in 2020.
   `;
}

async function fuelCo2Emissions() {
  const data = await d3.csv(dataSource);
  const n = data.length;

  const fuelData = data.columns.slice(1).map((id) => {
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

  const scales = graph.createScales([1850, 2020], [0, 15e9], width, height);
  const xScale = scales.xScale;
  const yScale = scales.yScale;

  const z = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(fuelData.map((v) => v.id));

  const X = {
    step: [1850, 1875, 1900, 1925, 1950, 1975, 2000, 2020],
    value: ["1850", "1875", "1900", "1925", "1950", "1975", "2000", "2020"],
    scale: xScale,
  };
  const Y = {
    step: [0, 3e9, 6e9, 9e9, 12e9, 15e9],
    value: ["0 t", "3b t", "6b t", "9b t", "12b t", "15b t"],
    scale: yScale,
  };

  graph.appendAxis(svg, height, X, Y);
  graph.appendTitle(svg, "CO2 emissions by fuel type");

  const draw = svg
    .selectAll(".graphs")
    .data(fuelData)
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
      const emissions = graph.gatherDataPerYear(fuelData, d.year);
      graph.locateTooltip(d3.event.pageX + 10, d3.event.pageY - 10);
      graph.displayTooltip("block");
      graph.updateTooltip(
        graph.createTooltipText({ year: d.year, emission: emissions }, "bt")
      );
    });

  const description = [
    {
      type: d3.annotationCalloutElbow,
      note: {
        title: "Coal",
        label: `Since the beginning of the Industrial Revolution, 
         coal has replaced wood and other energy resources and is the most used of all fuel types.
         Coal is now cited as one of the major factors of CO2 emissions 
         and the world is trying to reduce its use.`,
        wrap: 300,
        padding: 3,
      },
      x: xScale(1929) + config.margin.left,
      y: yScale(4e9) + config.margin.bottom,
      dy: -50,
      dx: -120,
      align: "left",
      connector: {
        end: "dot",
      },
    },
    {
      type: d3.annotationCallout,
      note: {
        label:
          "Oil, coal, and gas account for the majority of total CO2 emissions.",
        wrap: 180,
        padding: 3,
      },
      x: xScale(2005) + config.margin.left,
      y: yScale(13e9) + config.margin.bottom,
      dx: -70,
      dy: -20,
      align: "left",
      connector: {
        end: "dot",
      },
    },
  ];

  const legend = [
    {
      note: {
        label: "Coal",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(14e9) + config.margin.bottom - 10,
      color: z("Coal"),
      align: "left",
    },
    {
      note: {
        label: "Oil",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(11e9) + config.margin.bottom - 10,
      color: z("Oil"),
      align: "left",
    },
    {
      note: {
        label: "Gas",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(7.4e9) + config.margin.bottom - 10,
      color: z("Gas"),
      align: "left",
    },
    {
      note: {
        label: "Cement",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(1.6e9) + config.margin.bottom - 25,
      color: z("Cement"),
      align: "left",
    },
    {
      note: {
        label: "Flaring",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(0.4e9) + config.margin.bottom - 20,
      color: z("Flaring"),
      align: "left",
    },
    {
      note: {
        label: "Other",
      },
      x: xScale(2020) + config.margin.left + 30,
      y: yScale(0) + config.margin.bottom - 10,
      color: z("Other"),
      align: "left",
    },
  ];

  svg.append("g").call(d3.annotation().annotations(description));
  svg
    .append("g")
    .call(d3.annotation().type(d3.annotationLabel).annotations(legend));

  const tag1 = {
    x: xScale(1970) + config.margin.left,
    y: yScale(8.3e9) + config.margin.bottom,
    dir: "left",
  };
  graph.appendBadge(svg, tag1, showOilCrisis());

  const tag2 = {
    x: xScale(2020) + config.margin.left,
    y: yScale(2.4e9) + config.margin.bottom,
    w: width,
    h: height,
    dir: "top",
  };
  graph.appendBadge(svg, tag2, showOthers());
}

export default fuelCo2Emissions;
