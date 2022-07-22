const navItems = [
  {
    text: "page #1: World Total",
    to: "index.html",
    icon: "./styles/line-graph.svg",
  },
  {
    text: "page #2: Fuel",
    to: "p1-country.html",
    icon: "./styles/bar-chart.svg",
  },
  {
    text: "page #3: Per Capita",
    to: "p2-scatter.html",
    icon: "./styles/scatter-plot.svg",
  },
];

const personInfo = {
  name: "swpark5",
  link: "#",
  icon: "./styles/person.svg",
};

function addNavItem(select, text, to, icon) {
  const itemList = document.createElement("li");
  const itemTo = document.createElement("a");
  itemTo.href = to;
  itemTo.className = select === true ? "nav-item-select" : "nav-item-default";

  const image = document.createElement("img");
  image.src = icon;
  image.className = "nav-icon";
  image.alt = "nav-icon";
  image.width = "16";
  image.height = "16";

  itemTo.appendChild(image);
  itemTo.appendChild(document.createTextNode(text));

  itemList.appendChild(itemTo);
  return itemList;
}

function addDivider() {
  const divider = document.createElement("div");
  divider.innerHTML = "<hr>";
  return divider;
}

function addPerson(name, icon, link) {
  const person = document.createElement("div");
  const to = document.createElement("a");
  to.className = "nav-author";
  to.href = link;

  const image = document.createElement("img");
  image.src = icon;
  image.className = "nav-author-icon";
  image.alt = "person";
  image.width = "20";
  image.height = "20";

  to.appendChild(image);
  to.appendChild(document.createTextNode(name));
  person.appendChild(to);

  return person;
}

function addSidebar(subject, selectIndex) {
  const sidebar = document.getElementById("sidebar");

  const title = document.createElement("div");
  title.className = "nav-title";
  title.innerHTML = subject;
  sidebar.appendChild(title);

  sidebar.appendChild(addDivider());

  const navFrame = document.createElement("ul");
  navFrame.className = "nav-items";

  [0, 1, 2].forEach((idx) => {
    const item = addNavItem(
      idx === selectIndex ? true : false,
      navItems[idx].text,
      navItems[idx].to,
      navItems[idx].icon
    );
    navFrame.appendChild(item);
  });

  sidebar.appendChild(navFrame);
  sidebar.append(addDivider());
  sidebar.append(addPerson(personInfo.name, personInfo.icon, personInfo.link));
}

export default addSidebar;
