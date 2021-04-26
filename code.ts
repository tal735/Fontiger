async function main(): Promise<string | undefined> {
  var selectedNodes = figma.currentPage.selection;

  if (selectedNodes.length == 0) {
    selectedNodes = figma.currentPage.children.filter(node => node.type === "FRAME");
  }
  
  for (let selectedNode of selectedNodes) {
    if (selectedNode.type === 'FRAME') {
      var nodes : SceneNode[] = selectedNode.findAll(node => node.type === "TEXT");
      for (let node of nodes) {
        // Load text fonts
        if (typeof node.fontName === 'symbol') {
          // Text uses multiple fonts
          let len = node.characters.length;
          for (let i = 0; i < len; i++) {
            await figma.loadFontAsync(node.getRangeFontName(i, i+1));
          }
        } else {
          // Text uses a single font
          await figma.loadFontAsync(node.fontName);
        }

        // Set new font size
        node.fontSize = Math.round(node.fontSize);
      }
    }
  }

  return 'Finished';
}

main().then((message: string | undefined) => {
  figma.closePlugin(message)
})