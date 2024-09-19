function Node(loc, start, end) {
  this.range = this._convertLocToRange(loc);
  this.position = {start, end};
}

Node.prototype._convertLocToRange = getRangeByNodeLocation;

function ParrentNode(type, loc, start, end) {
  Node.call(this, loc, start, end);
  this.type = type;
}

ParrentNode.prototype = Object.create(Node.prototype)

const topLevelEntitie = {
      imports: {},
      variables: {},
      functions: {},
      classes: {}
    };

    walk.simple(ast, {
      Program: node => {
        node.body.forEach(child => {
          if (child.type === "VariableDeclaration") {
            const loc = child.loc;
            const kind = child.kind;

            walk.simple(child, {
              VariableDeclarator(node) {
                if (node.id.type === "Identifier") {
                  const identifier = {
                    name: node.id.name,
                    loc: node.id.loc
                  };
                variables[node.id.name] = new VairableModel({kind, loc, identifier});
                } else if ()
              }
            });
          }
        });
      },

      FunctionDeclaration: addTopLevelEntitie,
      VariableDeclaration: addTopLevelEntitie,
      ClassDeclaration: addTopLevelEntitie,
      ImportDeclaration: addTopLevelEntitie
    });