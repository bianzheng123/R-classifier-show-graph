layui.define([], function (exports) {

    class DiagramSuper {
        constructor() {
            this.color = {
                white: '#ffffff',
                grey: '#dae6ed',
                red: '#FF5722',
                blue: "#4e91fa",
                green: "#5FB878",
                yellow: "#FFB800"
            };
            this.shape_fill_color = "#dae6ed";
            this.border_color = "#4e91fa";
            this.border_width = 1;
            this.text_style = {
                font: "14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif",
                stroke: "#4e91fa"
            };
        }

        //表示图表渲染优先级
        //作用：鼠标点击线即可知道该线是单向还是双向
        get_link_layer() {
            let that = this;
            var GO = go.GraphObject.make;  // for conciseness in defining templates
            let layer = new go.Layer();
            layer.name = "foreground";
            that.myDiagram.addLayer(layer);
            that.myDiagram.addLayerBefore(GO(go.Layer, {name: "background"}), layer);
        }

        /*
        获取link的模板, 渲染link样式
         */
        get_link_template_map() {
            //生成画布
            let that = this;
            var GO = go.GraphObject.make;  // for conciseness in defining templates
            // replace the default Link template in the linkTemplateMap
            that.myDiagram.linkTemplateMap.add("single",
                GO(go.Link,  // the whole link panel
                    new go.Binding("points").makeTwoWay(),
                    new go.Binding("layerName"),
                    {
                        routing: go.Link.AvoidsNodes,
                        corner: 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) {
                            link.findObject("HIGHLIGHT_OUTLINE").stroke = "rgba(30,144,255,0.2)";
                            link.findObject("HIGHLIGHT_ARROW").fill = "rgba(255,0,0,1)";
                        },
                        mouseLeave: function (e, link) {
                            link.findObject("HIGHLIGHT_OUTLINE").stroke = "transparent";
                            link.findObject("HIGHLIGHT_ARROW").fill = "gray";
                        },
                        selectionChanged: function (link) {
                            link.layerName = (link.isSelected ? "foreground" : "background");
                        },
                        layerName: "background",
                        selectionAdorned: false
                    },
                    GO(go.Shape,  // the highlight shape, normally transparent
                        {isPanelMain: true, strokeWidth: 4, stroke: "transparent", name: "HIGHLIGHT_OUTLINE"}),
                    GO(go.Shape,  // the link path shape
                        {isPanelMain: true, stroke: "gray", strokeWidth: 2},
                        new go.Binding("stroke", "isSelected", function (sel) {
                            return sel ? "dodgerblue" : "gray";
                        }).ofObject()),
                    GO(go.Shape,  // the arrowhead
                        {toArrow: "standard", strokeWidth: 0, fill: "gray", name: "HIGHLIGHT_ARROW"}),
                ));

            // replace the default Link template in the linkTemplateMap
            that.myDiagram.linkTemplateMap.add("double",
                GO(go.Link,  // the whole link panel
                    new go.Binding("points").makeTwoWay(),
                    new go.Binding("layerName"),
                    {
                        routing: go.Link.AvoidsNodes,
                        corner: 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) {
                            link.findObject("HIGHLIGHT_OUTLINE").stroke = "rgba(30,144,255,0.2)";
                            link.findObject("HIGHLIGHT_ARROW_HEAD").fill = "rgba(255,0,0,1)";
                            link.findObject("HIGHLIGHT_ARROW_TAIL").fill = "rgba(255,0,0,1)";
                        },
                        mouseLeave: function (e, link) {
                            link.findObject("HIGHLIGHT_OUTLINE").stroke = "transparent";
                            link.findObject("HIGHLIGHT_ARROW_HEAD").fill = "gray";
                            link.findObject("HIGHLIGHT_ARROW_TAIL").fill = "gray";
                        },
                        selectionChanged: function (link) {
                            link.layerName = (link.isSelected ? "foreground" : "background");
                        },
                        layerName: "background",
                        selectionAdorned: false
                    },
                    GO(go.Shape,  // the highlight shape, normally transparent
                        {isPanelMain: true, strokeWidth: 4, stroke: "transparent", name: "HIGHLIGHT_OUTLINE"}),
                    GO(go.Shape,  // the link path shape
                        {isPanelMain: true, stroke: "gray", strokeWidth: 2},
                        new go.Binding("stroke", "isSelected", function (sel) {
                            return sel ? "dodgerblue" : "gray";
                        }).ofObject()),
                    GO(go.Shape,  // the arrowhead
                        {toArrow: "standard", strokeWidth: 0, fill: "gray", name: "HIGHLIGHT_ARROW_HEAD"}),
                    GO(go.Shape,  // the arrowtail
                        {fromArrow: "Backward", strokeWidth: 0, fill: "gray", name: "HIGHLIGHT_ARROW_TAIL"})
                ));
        }

    }

    exports('DiagramSuper', DiagramSuper);

});