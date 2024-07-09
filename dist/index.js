const pluginHtml = require("prettier/plugins/html");
const { doc } = require("prettier");

// prettier-plugin-html-inline-force-semi

module.exports = {
  options: {
    ...pluginHtml.options,
    htmlForceSemiOn: {
      category: "HTML",
      type: "choice",
      default: "style",
      description: "When to force semicolon in html attributes.",
      choices: [
        {
          value: "style",
          description: "Force semicolon at the end of style attributes.",
        },
        {
          value: "angularEvent",
          description: "Force semicolon at the end of inline angular events attributes.",
        },
        {
          value: "all",
          description: "Force semicolon at the end of every attribute that is supported.",
        },
        {
          value: "never",
          description: "Turn off."
        }
      ],
    }
  },
  languages: {
    ...pluginHtml.languages,
  },
  parsers: {
    ...pluginHtml.parsers,
    "angular": {
      ...pluginHtml.parsers.angular,
      astFormat: "inline-style-force-semi-ast"
    },
    "html": {
      ...pluginHtml.parsers.html,
      astFormat: "inline-style-force-semi-ast"
    },
  },
  printers: {
    "inline-style-force-semi-ast": {
      ...pluginHtml.printers.html,
      print: (path, options, print, args) => {
        // const { node } = path;
        // __onHtmlBindingRoot
        // __onHtmlRoot
        const printed = pluginHtml.printers.html.print(path, options, print, args);

        if (options.htmlForceSemiOn === "never") {
          return printed;
        }

        const forceOn = {
          style: options.htmlForceSemiOn === "all" || options.htmlForceSemiOn === "style",
          angularEvent: options.htmlForceSemiOn === "all" || options.htmlForceSemiOn === "angularEvent"
        };

        const checks = {
          isGroup: (node) => {
            return typeof node === "object" && node.type === "group";
          },
          first: (docNode) => {
            return docNode && Array.isArray(docNode) && typeof docNode[0] === "string" && checks.isGroup(docNode[2]);
          },
          second: (docNode) => {
            const a = docNode[2].contents[0];
            return a.type === "indent" && Array.isArray(a.contents);
          }
        };

        return doc.utils.mapDoc(printed, (docNode) => {
          if (checks.first(docNode)) {
            if (forceOn.angularEvent &&docNode[0].startsWith("(") && docNode[0].endsWith(")")) {
              const a = docNode[2].contents[0];
              if (checks.second(docNode) && checks.isGroup(a.contents[1])) {
                // if (a.contents[1].contents.endsWith(")")) {
                if (!a.contents[1].contents.endsWith(";")) {
                  a.contents[1].contents += ";";
                }
              }
            }
            if (forceOn.style && docNode[0] === "style") {
              const a = docNode[2].contents[0];
              if (checks.second(docNode) && Array.isArray(a.contents[1])) {
                const lastIndex = a.contents[1].length - 1;
                const lastBreak = a.contents[1][lastIndex];
                if (lastBreak.type === "if-break") {
                  lastBreak.flatContents = ";";
                }
              }
            }
          }
          return docNode;
        });
      }
    }
  }
};

// function traverseAndModify(node) {
//   if (node.type === "element") {
//     if (node.attrs) {
//       node.attrs = node.attrs.map((attr) => {
//         if (attr.name === "style" && attr.value) {
//           console.log(attr.value);
//           const lines = attr.value.split("\n");
//           const lastLine = lines[lines.length - 1].trim();
//           if (!lastLine.endsWith(";") && lastLine.length > 0) {
//             lines[lines.length - 1] = lastLine + ";";
//             attr.value = lines.join("\n");
//           }
//         }
//         return attr;
//       });
//     }
//   }
//   if (node.children) {
//     node.children = node.children.map(traverseAndModify);
//   }
//   return node;
// }