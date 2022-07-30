const navTitle = "Annual CO2 emissions";

const navItems = [
  {
    text: "Introduction",
    to: "index.html",
    icon: "../styles/icons/bar-chart.svg",
  },
  {
    text: "Global CO2 emissions",
    to: "page1.html",
    icon: "../styles/icons/one.svg",
  },
  {
    text: "CO2 per country",
    to: "page2.html",
    icon: "../styles/icons/two.svg",
  },
  {
    text: "CO2 per capita",
    to: "page3.html",
    icon: "../styles/icons/three.svg",
  },
];

const personInfo = {
  name: "Sung Woo Park",
  icon: "../styles/icons/person.svg",
};

const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 120,
};

const gap = { width: 20, height: 60 };

const badgeColor = "#E8336D";

export { navTitle, navItems, personInfo, margin, gap, badgeColor };
