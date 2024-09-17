import {getRangeByNodeLocation} from "../utils/range_functions.js";

function Variable({name, location, type}) {
    if (name && typeof name === 'object' && name.name && name.loc) {
        this.name = this.setName(name.name, name.loc);
    } else {
        this.name = undefined;
    }
    this.location = location ? this.setLocation(location) : undefined;
    this.type = this.setType(type);
}

Variable.prototype.setName = function(name, loc) {
    return {name, location: getRangeByNodeLocation(loc)};
}

Variable.prototype.setLocation = function(location) {
    return getRangeByNodeLocation(location);
}

Variable.prototype.setType = function(type) {
    if (type === 'const' || type === 'let' || type === 'var') return type;
}

export {Variable};