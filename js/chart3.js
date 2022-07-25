import * as config from "./config.js";
import * as graph from "./graph.js";

const dataSource = {
  prod: "../data/co2-03-prod.csv",
  consum: "../data/co2-03-consum.csv",
};

function createTooltipText(data) {
  const { year, emission } = data;

  var text = `<b>Year: ${year}</b><br/>`;
  emission.forEach((c) => {
    const val = (c.count / 1e9).toFixed(2);
    text = text + `${c.name}: ${val} billion ton<br/>`;
  });

  console.log(text);

  return text;
}

function gatherEmissions(data, year) {
  const emissionPerYear = [];
  data.forEach((d) => {
    const val = d.values.find((v) => {
      return v.year === year ? true : false;
    });
    emissionPerYear.push(val);
  });
  return emissionPerYear;
}

async function productionCo2PerCapita() {
  const data = await d3.csv(dataSource.prod);
  const n = data.length;

  const capitaData = data.columns.slice(1).map((id) => {
    return {
      id: id,
      values: data.map((v) => {
        return { name: id, year: v.year, count: v[id] };
      }),
    };
  });

  console.log(capitaData);

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
      const emissions = gatherEmissions(capitaData, d.year);
      graph.locateTooltip(d3.event.pageX + 10, d3.event.pageY - 10);
      graph.displayTooltip("block");
      graph.updateTooltip(
        createTooltipText({ year: d.year, emission: emissions })
      );
    });

  draw
    .append("text")
    .datum((d) => {
      return { id: d.id, obj: d.values[d.values.length - 1] };
    })
    .attr("transform", (d) => {
      const x = xScale(d.obj.year);
      const y = yScale(d.obj.count);
      return `translate(${x},${y})`;
    })
    .attr("style", (d) =>
      d.id === "China" ? "font-weight:bold;fill:red;" : "fill:black;"
    )
    .attr("x", 8)
    .attr("dy", "0.5em")
    .text((d) => d.id)
    .on("mouseover", () => graph.displayTooltip(null))
    .on("mouseout", () => graph.displayTooltip("none"))
    .on("mousemove", (d) => {
      if (d.id == "China") {
        graph.locateTooltip(
          width * 0.55 + config.margin.left,
          d3.event.pageY - 55
        );
        graph.displayTooltip("block");
        graph.updateTooltip(`<b>2000 - 2020 CO2 emission</b><br/>
        <img src="./styles/images/Total_CO2.png" alt="CO2" style="margin:5px;"/><br/>
        Since 2000, the CO2 emissions from China and the rest of the world have outpaced the combined emissions of the US and EU.
         The output of the US and EU continue to decline while the rest are steadily rising.<br/>
         "Ref.: the Wikipedia"`);
      }
    });

  const annotations = [
    {
      type: d3.annotationCalloutElbow,
      note: {
        title: "US",
        label: `Since the early 1900s, the United States' annual CO2 emissions were the highest in the world,
           but since the 2000s, it has been gradually decreasing.`,
        wrap: 250,
        padding: 3,
      },
      x: xScale(1950) + config.margin.left,
      y: yScale(3.5e9) + config.margin.bottom,
      dy: -50,
      dx: -120,
      align: "left",
      connector: {
        end: "dot",
      },
    },
    {
      note: {
        title: "China",
        label: "In the 2000s, China's annual CO2 emissions increased rapidly.",
        wrap: 200,
        padding: 3,
      },
      x: xScale(2004) + config.margin.left,
      y: yScale(6.4e9) + config.margin.bottom,
      dx: -80,
      dy: -30,
      align: "left",
      connector: {
        end: "dot",
      },
    },
  ];
  graph.appendAnnotations(svg, annotations);
}

async function consumptionCo2PerCapita() {
  const data = await d3.csv(dataSource.consum);
  const n = data.length;

  const capitaData = data.columns.slice(1).map((id) => {
    return {
      id: id,
      values: data.map((v) => {
        return { name: id, year: v.year, count: v[id] };
      }),
    };
  });

  console.log(capitaData);

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
      const emissions = gatherEmissions(capitaData, d.year);
      graph.locateTooltip(d3.event.pageX + 10, d3.event.pageY - 10);
      graph.displayTooltip("block");
      graph.updateTooltip(
        createTooltipText({ year: d.year, emission: emissions })
      );
    });

  draw
    .append("text")
    .datum((d) => {
      return { id: d.id, obj: d.values[d.values.length - 1] };
    })
    .attr("transform", (d) => {
      const x = xScale(d.obj.year);
      const y = yScale(d.obj.count);
      return `translate(${x},${y})`;
    })
    .attr("style", (d) =>
      d.id === "China" ? "font-weight:bold;fill:red;" : "fill:black;"
    )
    .attr("x", 8)
    .attr("dy", "0.5em")
    .text((d) => d.id)
    .on("mouseover", () => graph.displayTooltip(null))
    .on("mouseout", () => graph.displayTooltip("none"))
    .on("mousemove", (d) => {
      if (d.id == "China") {
        graph.locateTooltip(
          width * 0.55 + config.margin.left,
          d3.event.pageY - 55
        );
        graph.displayTooltip("block");
        graph.updateTooltip(`<b>2000 - 2020 CO2 emission</b><br/>
        <img src="./styles/images/Total_CO2.png" alt="CO2" style="margin:5px;"/><br/>
        Since 2000, the CO2 emissions from China and the rest of the world have outpaced the combined emissions of the US and EU.
         The output of the US and EU continue to decline while the rest are steadily rising.<br/>
         "Ref.: the Wikipedia"`);
      }
    });

  const annotations = [
    {
      type: d3.annotationCalloutElbow,
      note: {
        title: "US",
        label: `Since the early 1900s, the United States' annual CO2 emissions were the highest in the world,
           but since the 2000s, it has been gradually decreasing.`,
        wrap: 250,
        padding: 3,
      },
      x: xScale(1950) + config.margin.left,
      y: yScale(3.5e9) + config.margin.bottom,
      dy: -50,
      dx: -120,
      align: "left",
      connector: {
        end: "dot",
      },
    },
    {
      note: {
        title: "China",
        label: "In the 2000s, China's annual CO2 emissions increased rapidly.",
        wrap: 200,
        padding: 3,
      },
      x: xScale(2004) + config.margin.left,
      y: yScale(6.4e9) + config.margin.bottom,
      dx: -80,
      dy: -30,
      align: "left",
      connector: {
        end: "dot",
      },
    },
  ];
  graph.appendAnnotations(svg, annotations);
}

export { productionCo2PerCapita, consumptionCo2PerCapita };
