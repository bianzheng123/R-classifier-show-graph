layui.define(['ExecResultShowDiagram'], function (exports) {

    class ExecTopologyDiagram extends layui.ExecResultShowDiagram {
        constructor() {
            super();
            this.diagram_mount_point = 'myDiagramDiv';
        }

        init() {
            const GO = go.GraphObject.make; // for conciseness in defining templates

            const that = this;
            that.myDiagram = GO(go.Diagram, that.diagram_mount_point, // must be the ID or reference to div
                {
                    "undoManager.isEnabled": true,  // enable undo & redo
                    //用于屏幕自适应, 详见initial View
                    initialContentAlignment: go.Spot.Center,
                    initialAutoScale: go.Diagram.Uniform,
                    allowCopy: false,
                    allowDelete: false,
                    hoverDelay: 200,  // controls how long to wait motionless (msec) before showing Adornment
                    layout: GO(go.LayeredDigraphLayout, {
                        direction: 0,
                        layerSpacing: $('#' + that.diagram_mount_point).width() / 10,
                        packOption: 4,
                        columnSpacing: $('#' + that.diagram_mount_point).height() / 9,
                        isRealtime: false
                    })
                });

            that.get_group_template();

            that.get_node_template();

            that.get_link_layer();

            that.get_link_template_map();

            that.load();

        }

        //用于递归嵌套
        load() {
            //topology_id父亲节点的topo_id
            //layer当前的层数, 从1开始, 用于确认节点的颜色
            let that = this;

            let white = that.color.white;
            let grey = that.color.grey;
            let blue = that.color.blue;
            let red = that.color.red;

            let res_nodes = [
                {
                    "category": "template",
                    "key": 1,
                    "text": "start",
                    "fill": grey,
                    "stroke": blue
                }, {
                    "category": "topology",
                    "key": 2,
                    "text": "kmeans",
                    "fill": grey,
                    "stroke": blue,
                    "isGroup": true
                }, {
                    "category": "topology",
                    "key": 3,
                    "text": "learn on graph",
                    "fill": grey,
                    "stroke": blue,
                    "isGroup": true
                }, {
                    "category": "topology",
                    "key": 4,
                    "text": "Locality-Sensitive Hashing",
                    "fill": grey,
                    "stroke": red,
                    "isGroup": true
                }, {
                    "category": "topology",
                    "key": 5,
                    "text": "index for items",
                    "fill": grey,
                    "stroke": blue,
                    "isGroup": true
                }, {
                    "category": "template",
                    "key": 6,
                    "text": "count recall",
                    "fill": grey,
                    "stroke": blue
                }, {
                    "category": "template",
                    "key": 7,
                    "text": "single kmeans",
                    "fill": white,
                    "stroke": blue,
                    "group": 2
                }, {
                    "category": "template",
                    "key": 8,
                    "text": "multiple kmeans",
                    "fill": white,
                    "stroke": red,
                    "group": 2
                }, {
                    "category": "topology",
                    "key": 9,
                    "text": "build graph",
                    "fill": white,
                    "stroke": blue,
                    "isGroup": true,
                    "group": 3
                }, {
                    "category": "topology",
                    "key": 10,
                    "text": "partition",
                    "fill": white,
                    "stroke": blue,
                    "isGroup": true,
                    "group": 3
                }, {
                    "category": "topology",
                    "key": 11,
                    "text": "get label",
                    "fill": white,
                    "stroke": blue,
                    "isGroup": true,
                    "group": 3
                }, {
                    "category": "topology",
                    "key": 12,
                    "text": "classification",
                    "fill": white,
                    "stroke": blue,
                    "isGroup": true,
                    "group": 3
                }, {
                    "category": "template",
                    "key": 13,
                    "text": "intersection",
                    "fill": white,
                    "stroke": red,
                    "group": 5
                }, {
                    "category": "template",
                    "key": 14,
                    "text": "union",
                    "fill": white,
                    "stroke": blue,
                    "group": 5
                }, {
                    "category": "template",
                    "key": 15,
                    "text": "knn graph",
                    "fill": grey,
                    "stroke": blue,
                    "group": 9
                }, {
                    "category": "template",
                    "key": 16,
                    "text": "hnsw shuffle",
                    "fill": grey,
                    "stroke": red,
                    "group": 9
                }, {
                    "category": "template",
                    "key": 17,
                    "text": "nsw shuffle",
                    "fill": grey,
                    "stroke": red,
                    "group": 9
                }, {
                    "category": "template",
                    "key": 18,
                    "text": "kahip",
                    "fill": grey,
                    "stroke": blue,
                    "group": 10
                }, {
                    "category": "template",
                    "key": 19,
                    "text": "use neighbor",
                    "fill": grey,
                    "stroke": blue,
                    "group": 11
                }, {
                    "category": "template",
                    "key": 20,
                    "text": "use self",
                    "fill": grey,
                    "stroke": red,
                    "group": 11
                }, {
                    "category": "template",
                    "key": 21,
                    "text": "use weight",
                    "fill": grey,
                    "stroke": red,
                    "group": 11
                }, {
                    "category": "template",
                    "key": 22,
                    "text": "neural network",
                    "fill": grey,
                    "stroke": blue,
                    "group": 12
                }, {
                    "category": "template",
                    "key": 23,
                    "text": "support vector machine",
                    "fill": grey,
                    "stroke": red,
                    "group": 12
                }
            ];

            let res_links = [
                {
                    "from": 1,
                    "to": 2,
                    "category": "single"
                }, {
                    "from": 1,
                    "to": 3,
                    "category": "single"
                }, {
                    "from": 1,
                    "to": 4,
                    "category": "single"
                }, {
                    "from": 2,
                    "to": 5,
                    "category": "single"
                }, {
                    "from": 3,
                    "to": 5,
                    "category": "single"
                }, {
                    "from": 4,
                    "to": 5,
                    "category": "single"
                }, {
                    "from": 5,
                    "to": 6,
                    "category": "single"
                }, {
                    "from": 9,
                    "to": 10,
                    "category": "single"
                }, {
                    "from": 10,
                    "to": 11,
                    "category": "single"
                }, {
                    "from": 11,
                    "to": 12,
                    "category": "single"
                }
            ];

            console.log("res_nodes", res_nodes);
            console.log("res_links", res_links);

            // that.myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
            that.myDiagram.model = new go.GraphLinksModel(res_nodes, res_links);
        }


    }

    exports('ExecTopologyDiagram', ExecTopologyDiagram);
})