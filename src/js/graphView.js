var GraphNum = {
    FIRST: 1,
    SECOND: 2
}

var Colors = {
    FIRST_GRAPH_SELECTED: "#FF0000",
    FIRST_GRAPH_NOT_SELECTED: "#00FF00",
    SECOND_GRAPH_SELECTED: "#00FF00",
    SECOND_GRAPH_NOT_SELECTED: "#FF0000",
}

function NodeData(idArg, graphNumArg){
    this.id = idArg;
    this.graphNum = graphNumArg;
    this.isSelected = false;

    this.select = function(){
        this.isSelected = true;
    }

    this.getColor = function(){
        if(this.graphNum == GraphNum.FIRST && !this.isSelected){
            return Colors.FIRST_GRAPH_NOT_SELECTED;
        }
        else if(this.graphNum == GraphNum.FIRST && this.isSelected){
            return Colors.FIRST_GRAPH_SELECTED;
        }
        else if(this.graphNum == GraphNum.SECOND && !this.isSelected)
        {
            return Colors.SECOND_GRAPH_NOT_SELECTED;
        }
        else if(this.graphNum == GraphNum.SECOND && this.isSelected){
            return Colors.SECOND_GRAPH_SELECTED;
        }
        else{
            console.log("Unsupported getColor state")
        }
    }

    this.updateUI = function(ui){
        ui.attr("fill", this.getColor());
    }
}

function addNodesAndEdges(graph){
    graph.addNode(1, new NodeData(1, GraphNum.FIRST));
    graph.addNode(2, new NodeData(2, GraphNum.FIRST));
    graph.addLink(1,2);

    graph.addNode(3, new NodeData(3, GraphNum.SECOND));
    graph.addNode(4, new NodeData(4, GraphNum.SECOND));
    graph.addLink(3,4);
    return graph;
}

function generateDefaultNodeUI(nodeData)
{
    NODE_WIDTH = 10;
    NODE_HEIGHT = 10;

    return Viva.Graph.svg("rect")
             .attr("width", 10)
             .attr("height", 10)
             .attr("fill", nodeData.getColor())
             .attr("nodeId", nodeData.id); 
}

function selectNode(graph, ui)
{
    graph.forEachNode(function(node) {
        if(node.id == ui.attr("nodeId")){
            node.data.select();
            node.data.updateUI(ui);
        }
    });
}

function generateGraphics(graph){
    var graphics = Viva.Graph.View.svgGraphics();

    var nodeSize = 20;
    graphics.node(function(node) {
        var ui = generateDefaultNodeUI(node.data);

        $(ui).click(function() {
            selectNode(graph, ui);
        });
        return ui;
    }).placeNode(function(nodeUI, pos) {
        nodeUI.attr('x', pos.x - nodeSize / 2).attr('y', pos.y - nodeSize / 2);
    });

    return graphics;
}

function renderGraph()
{
    var graph = addNodesAndEdges(Viva.Graph.graph());

    var layout = Viva.Graph.Layout.forceDirected(graph);
    var graphics = generateGraphics(graph);

    var renderer = Viva.Graph.View.renderer(graph, {
            layout     : layout,
            graphics   : graphics
        });

    renderer.run();
}