var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var selectedNodes = figma.currentPage.selection;
        if (selectedNodes.length == 0) {
            selectedNodes = figma.currentPage.children.filter(node => node.type === "FRAME");
        }
        for (let selectedNode of selectedNodes) {
            if (selectedNode.type === 'FRAME') {
                var nodes = selectedNode.findAll(node => node.type === "TEXT");
                for (let node of nodes) {
                    // Load text fonts
                    if (typeof node.fontName === 'symbol') {
                        // Text uses multiple fonts
                        let len = node.characters.length;
                        for (let i = 0; i < len; i++) {
                            yield figma.loadFontAsync(node.getRangeFontName(i, i + 1));
                        }
                    }
                    else {
                        // Text uses a single font
                        yield figma.loadFontAsync(node.fontName);
                    }
                    // Set new font size
                    node.fontSize = Math.round(node.fontSize);
                }
            }
        }
        return 'Finished';
    });
}
main().then((message) => {
    figma.closePlugin(message);
});
