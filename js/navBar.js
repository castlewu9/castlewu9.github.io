import * as config from "./config.js";

function addNavItem(select, text, to, icon) {
  const itemList = document.createElement("li");
  const itemTo = document.createElement("a");
  itemTo.href = to;
  itemTo.className = select === true ? "nav-item-select" : "nav-item-default";

  const image = document.createElement("img");
  image.src = icon;
  image.className = "nav-icon";
  image.alt = "nav-icon";
  image.width = "18";
  image.height = "18";

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

function addSidebar(selectIndex) {
  const sidebar = document.getElementById("sidebar");

  const title = document.createElement("div");
  title.className = "nav-title";
  title.innerHTML = config.navTitle;
  sidebar.appendChild(title);

  sidebar.appendChild(addDivider());

  const navFrame = document.createElement("ul");
  navFrame.className = "nav-items";

  config.navItems.forEach((val, idx) => {
    const item = addNavItem(
      idx === selectIndex ? true : false,
      val.text,
      val.to,
      val.icon
    );
    navFrame.appendChild(item);
  });

  sidebar.appendChild(navFrame);
  sidebar.append(addDivider());
  sidebar.append(
    addPerson(
      config.personInfo.name,
      config.personInfo.icon,
      config.personInfo.link
    )
  );
}

export default addSidebar;
