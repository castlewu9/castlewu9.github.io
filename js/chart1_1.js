import * as config from "./config.js";
import * as graph from "./graph.js";

const dataSource = "../data/co2-01-world.csv";

function showParisAgreement() {
  return `<b>The Paris Agreement</b><br/>The agreement was adopted in 2015 in
     consultation with 196 parties to mitigate climate change.<br/>
     <img src="./styles/images/COP21_2015.jpg" alt="2015" style="margin:5px;"/><br/>
     "Photo from the Wikipedia: 2015 UN Climate Change Conference in Paris"`;
}

function showCovidPandemic() {
  return `As the COVID-19 pandemic curbs economic and social activity across the world,
     global carbon dioxide emissions in 2020 fell by approximately 6% year-over-year.`;
}

async function globalCo2Emissions() {
  const data = await d3.csv(dataSource);
  const n = data.length;

  const clientRect = graph.getClientRect();
  console.log(clientRect);
  const width = clientRect.width;
  const height = clientRect.height;

  const svg = graph.createSvg(width, height);

  const scales = graph.createScales([0, n - 1], [0, 36e9], width, height);
  const xScale = scales.xScale;
  const yScale = scales.yScale;

  const X = {
    step: [0, 49, 99, 149, n - 1],
    value: [1850, 1900, 1950, 2000, 2020],
    scale: xScale,
  };
  const Y = {
    step: [0, 10e9, 20e9, 30e9, 36e9],
    value: ["0 t", "10b t", "20b t", "30b t", "36b t"],
    scale: yScale,
  };

  graph.appendAxis(svg, height, X, Y);
  graph.appendTitle(svg, "Global CO2 emissions");

  const draw = svg
    .append("g")
    .attr("transform", `translate(${config.margin.left},${config.margin.top})`);

  const line = d3
    .line()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d.count));

  draw.append("path").datum(data).attr("class", "line").attr("d", line);

  graph.displayTooltip("display", "none");

  draw
    .selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", (d) =>
      d.year === "2015" || d.year === "2020" ? "pointdot" : "dot"
    )
    .attr("cx", (_, i) => xScale(i))
    .attr("cy", (d) => yScale(d.count))
    .attr("r", 2)
    .on("mouseover", () => graph.displayTooltip(null))
    .on("mouseout", () => graph.displayTooltip("none"))
    .on("mousemove", (d) => {
      graph.locateTooltip(d3.event.pageX + 10, d3.event.pageY - 10);
      graph.displayTooltip("block");
      const emission = (d.count / 1e9).toFixed(2);
      graph.updateTooltip(
        `<b>CO2 emissions</b><br/>Year: ${d.year}<br/>${emission} billion ton`
      );
    });

  const description = [
    {
      type: d3.annotationLabel,
      note: {
        title: "1850 - 1900",
        label: `With the onset of the Industrial Revolution, the use of fossil
           fuels increased and CO2 emissions began to increase slightly.`,
        wrap: 200,
        padding: 3,
      },
      x: xScale(48) + config.margin.left,
      y: yScale(3.2e9) + config.margin.bottom,
      dy: -90,
      dx: -80,
      align: "left",
      connector: {
        end: "dot",
      },
    },
    {
      type: d3.annotationCalloutElbow,
      note: {
        title: "1940 - 2000",
        label: `Since the 1940s, as the use of oil increased and industrialization accelerated,
             CO2 emissions began to rise rapidly.`,
        wrap: 200,
        padding: 3,
      },
      x: xScale(120) + config.margin.left,
      y: yScale(16e9) + config.margin.bottom,
      dx: -40,
      dy: -40,
      align: "left",
      connector: {
        end: "dot",
      },
    },
    {
      type: d3.annotationCalloutElbow,
      note: {
        title: "2000 -",
        label: "World CO2 emissions speed up since 2000",
      },
      x: xScale(152) + config.margin.left,
      y: yScale(24e9) + config.margin.bottom,
      dx: 15,
      dy: 40,
      connector: {
        end: "dot",
      },
    },
  ];

  svg.append("g").call(d3.annotation().annotations(description));

  const tag1 = {
    label: {
      text: "Paris Agreement",
      x: xScale(164.8) + config.margin.left - 83,
      y: yScale(36.2e9) + config.margin.bottom - 24,
    },
    x: xScale(164.8) + config.margin.left,
    y: yScale(36.2e9) + config.margin.bottom,
    dir: "top",
  };
  graph.appendBadge(svg, tag1, showParisAgreement());

  const tag2 = {
    label: {
      text: "COVID-19 pandemic dip",
      x: xScale(170) + config.margin.left + 15,
      y: yScale(34e9) + config.margin.bottom + 30,
    },
    x: xScale(170) + config.margin.left,
    y: yScale(34e9) + config.margin.bottom,
    dir: "bottom",
  };

  graph.appendBadge(svg, tag1, showParisAgreement());
  graph.appendBadge(svg, tag2, showCovidPandemic());
}

export default globalCo2Emissions;
