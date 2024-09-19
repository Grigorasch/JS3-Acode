function Import({range, position, source, identifier}) {
  this.range = range;
  this.position = position;
  this.source = source;
  this.identifier = identifier;
  this.type = 'import';
}

function Variable({range, position, kind, identifiers}) {
  this.range = range;
  this.position = position;
  this.kind = kind;
  this.type = 'variable';
}


export {Import, Variable};