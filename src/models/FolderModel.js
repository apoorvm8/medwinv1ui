export default class FolderModel {
    id;
    name;
    isOpen = false;
    parentId;
    marginLeft = '0px';
    type;
    
    constructor(id, name, isOpen, parentId, marginLeft, type) {
        this.id = id;
        this.name = name;
        this.isOpen = isOpen;
        this.parentId = parentId;
        this.marginLeft = marginLeft;
        this.type = type;
    }
}