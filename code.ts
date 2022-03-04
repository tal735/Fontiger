async function main(): Promise<string | undefined> {
  var selectedNodes = figma.currentPage.selection;

  if (selectedNodes.length == 0) {
    selectedNodes = figma.currentPage.children.filter(node => node.type === "FRAME");
  }

  for (let selectedNode of selectedNodes) {
    if (selectedNode.type === 'TEXT') {
      await handleTextNode(selectedNode);
    } 
    else if (selectedNode.type === 'FRAME' || selectedNode.type === 'INSTANCE') {
      const nodes : SceneNode[] = selectedNode.findAll(node => node.type === "TEXT");
      for (let node of nodes) {
        await handleTextNode(node);
      }
    }    

  }

  return 'Finished';
}

async function handleTextNode(textNode: SceneNode) {
        // Load text fonts
        if (typeof textNode.fontName === 'symbol') {
          // Text uses multiple fonts
          let len = textNode.characters.length;
          for (let i = 0; i < len; i++) {
            await figma.loadFontAsync(textNode.getRangeFontName(i, i+1));
          }
        } else {
          // Text uses a single font
          await figma.loadFontAsync(textNode.fontName);
        }

        // Set new font size
        textNode.fontSize = Math.round(textNode.fontSize);
}

main().then((message: string | undefined) => {
  figma.closePlugin(message)
})