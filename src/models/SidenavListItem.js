export default class SidenavListItem{
     id;
     name;
     link;
     icon;
     children = [];

    constructor(id, name, link, icon, children){
        this.id = id;
        this.name = name;
        this.link = link;
        this.icon = icon;
        this.children = children;
    }
}