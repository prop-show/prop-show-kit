export default function groupComponentSources() {
  return (tree) => groupChildren(tree);
}

function groupChildren(parent) {
  if (!Array.isArray(parent.children)) return;

  for (const child of parent.children) {
    if (child.tagName !== "code-group") groupChildren(child);
  }

  for (let index = 0; index < parent.children.length; index++) {
    if (!isComponentSource(parent.children[index])) continue;

    let cursor = index + 1;
    let lastSource = index;
    while (cursor < parent.children.length) {
      while (isWhitespace(parent.children[cursor])) cursor++;
      if (!isComponentSource(parent.children[cursor])) break;
      lastSource = cursor++;
    }
    if (lastSource === index) continue;

    const children = parent.children
      .slice(index, lastSource + 1)
      .filter(isComponentSource)
      .map((node) => ({
        ...node,
        properties: {
          ...node.properties,
          filename: node.properties.path.split("/").at(-1),
        },
      }));
    parent.children.splice(index, lastSource - index + 1, {
      type: "element",
      tagName: "code-group",
      properties: {},
      children,
    });
  }
}

function isComponentSource(node) {
  return node?.type === "element" && node.tagName === "component-source";
}

function isWhitespace(node) {
  return node?.type === "text" && !node.value.trim();
}
