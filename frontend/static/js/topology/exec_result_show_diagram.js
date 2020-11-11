layui.define(['DiagramSuper'], function (exports) {
    class ExecResultShowDiagram extends layui.DiagramSuper {

        //设置结点样式
        get_node_template() {
            //生成画布
            var GO = go.GraphObject.make;  // for conciseness in defining templates
            let that = this;
            // define the Node templates
            //控制边框的背景颜色
            let shape_fill_color = that.shape_fill_color;
            let border_color = that.border_color;
            let border_width = that.border_width;
            let text_style = that.text_style;
            let node_style = {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center,
                // dropping on a Node is the same as dropping on its containing Group, even if it's top-level
                mouseDrop: function (e, nod) {
                    // that.finishDrop(e, nod.containingGroup);
                }
            };

            // this is shown by the mouseHover event handler
            let node_hover_adornment =
                GO(go.Adornment, "Spot",
                    {
                        // Instead of the default animation, use a custom fade-down
                        // "animationManager.initialAnimationStyle": go.AnimationManager.None,
                        // "InitialAnimationStarting": animate_fade_down, // Instead, animate with this function
                        background: "transparent",
                        // hide the Adornment when the mouse leaves it
                        mouseLeave: function (e, obj) {
                            var ad = obj.part;
                            that.hover_node = null;
                            ad.adornedPart.removeAdornment("mouseHover");
                        }
                    },
                    GO(go.Placeholder,
                        {
                            background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                            isActionable: true,  // needed because this is in a temporary Layer
                            click: function (e, obj) {
                                var node = obj.part.adornedPart;
                                node.diagram.select(node);
                            }
                        }),
                    GO("Button",
                        {
                            alignment: new go.Spot(1, 0.2, 0, 0),
                            alignmentFocus: go.Spot.Left,
                            "ButtonBorder.fill": shape_fill_color,
                            // "ButtonBorder.stroke": "#007bff",
                            // "_buttonFillOver": "#007bff",
                            // "_buttonStrokeOver": "#007bff",
                            "_buttonFillPressed": '#3A8EE6',
                            "_buttonStrokePressed": '#3A8EE6',
                            cursor: "pointer",
                            // width: 80,
                            // padding: go.Margin.parse('30 0 0 5')
                        },
                        {
                            click: function (e, obj) {
                                let node = that.hover_node;
                                if (node === null) {
                                    console.error("悬浮节点为空, 出现bug");
                                }
                                //任务配置
                                that.task_config_hover_click(node, node.diagram);
                            }
                        },
                        hover_button_text_style("任务配置")
                    ),
                    GO("Button",
                        {
                            alignment: new go.Spot(1, 0.8, 0, 0),
                            alignmentFocus: go.Spot.Left,
                            "ButtonBorder.fill": shape_fill_color,
                            // "ButtonBorder.stroke": "#007bff",
                            // "_buttonFillOver": "#007bff",
                            // "_buttonStrokeOver": "#007bff",
                            "_buttonFillPressed": '#3A8EE6',
                            "_buttonStrokePressed": '#3A8EE6',
                            cursor: "pointer"
                            // width: 80,
                            // padding: go.Margin.parse('30 0 0 5')
                        },
                        {
                            click: function (e, obj) {
                                let node = that.hover_node;
                                if (node === null) {
                                    console.error("悬浮节点为空, 出现bug");
                                }
                                //模板配置

                            }
                        },
                        hover_button_text_style("模板配置")
                    )
                );

            //调色板从上到下调色
            // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
            // function animate_fade_down(e, obj) {
            //     var adnornment = obj.part.adnornments;
            //     var animation = new go.Animation();
            //     animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
            //     animation.easing = go.Animation.EaseOutExpo;
            //     animation.duration = 900;
            //     // Fade "down", in other words, fade in from above
            //     animation.add(adnornment, 'position', adnornment.position.copy().offset(0, 200), adnornment.position);
            //     animation.add(adnornment, 'opacity', 0, 1);
            //     animation.start();
            // }

            function hover_button_text_style(text) {
                return GO(go.TextBlock, text_style,
                    {
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: false
                    },
                    text);
            }

            function get_node_map() {
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                return GO(go.Panel, "Auto",
                    GO(go.Shape, "RoundedRectangle",
                        {
                            fill: shape_fill_color,
                            stroke: border_color,
                            strokeWidth: border_width,
                        },
                        new go.Binding("figure", "figure"),
                        new go.Binding("fill").makeTwoWay()),
                    GO(go.TextBlock, text_style,
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: false
                        },
                        new go.Binding("text").makeTwoWay(),
                        new go.Binding("stroke").makeTwoWay())
                );

            }

            that.myDiagram.nodeTemplateMap.add("template",
                GO(go.Node, "Table", node_style, get_node_map(), {
                        mouseHover: function (e, obj) {
                            var node = obj.part;
                            node_hover_adornment.adornedObject = node;
                            console.log("node", node);
                            that.hover_node = node;
                            node.addAdornment("mouseHover", node_hover_adornment);
                        }
                    }
                ));

            that.myDiagram.nodeTemplateMap.add("topology",
                GO(go.Node, "Table", node_style, get_node_map(), {
                        mouseHover: function (e, obj) {
                            var node = obj.part;
                            node_hover_adornment.adornedObject = node;
                            that.hover_node = node;
                            node.addAdornment("mouseHover", node_hover_adornment);
                        }
                    }
                ));

        }

        //finishDrop和highlightDrop用于将模板/子拓朴放到拓扑中, 拖拽调色板中的结点放到嵌套的拓扑中, 据说目前不是必须的, 就直接禁用掉即可
        // Upon a drop onto a Group, we try to add the selection as members of the Group.
        // Upon a drop onto the background, or onto a top-level Node, make selection top-level.
        // If this is OK, we're done; otherwise we cancel the operation to rollback everything.
        finishDrop(e, grp) {
            var ok = (grp !== null
                ? grp.addMembers(grp.diagram.selection, true)
                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
            if (!ok) e.diagram.currentTool.doCancel();

            if (grp !== null) {
                //获得从调色板拖拽到组群的节点
                grp.diagram.selection.each(function (node) {
                    console.log(node.data.group);
                    let shape_fill_color = this.color.white;
                    node = grp.diagram.model.findNodeDataForKey(node.data.key);//首先拿到这个节点的对象
                    grp.diagram.model.setDataProperty(node, 'fill', shape_fill_color);//然后对这个对象的属性进行更改
                })
            }
        }

        // this function is used to highlight a Group that the selection may be dropped into
        highlightGroup(e, grp, show) {
            if (!grp) return;
            e.handled = true;
            if (show) {
                // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
                // instead depend on the DraggingTool.draggedParts or .copiedParts
                var tool = grp.diagram.toolManager.draggingTool;
                var map = tool.draggedParts || tool.copiedParts;  // this is a Map
                // now we can check to see if the Group will accept membership of the dragged Parts
                if (grp.canAddMembers(map.toKeySet())) {
                    grp.isHighlighted = true;
                    return;
                }
            }
            grp.isHighlighted = false;
        }

        get_group_template() {
            //生成画布
            var GO = go.GraphObject.make;  // for conciseness in defining templates
            let that = this;

            that.myDiagram.groupTemplate =
                GO(go.Group, "Auto",
                    {
                        background: "transparent",
                        // highlight when dragging into the Group
                        mouseDragEnter: function (e, grp, prev) {
                            // that.highlightGroup(e, grp, true);
                        },
                        mouseDragLeave: function (e, grp, next) {
                            // that.highlightGroup(e, grp, false);
                        },
                        computesBoundsAfterDrag: true,
                        // when the selection is dropped into a Group, add the selected Parts into that Group;
                        // if it fails, cancel the tool, rolling back any changes
                        //目前禁用拖拽到检查点
                        // mouseDrop: that.finishDrop,
                        handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
                        layout: GO(go.LayeredDigraphLayout,
                            {direction: 0, columnSpacing: 10}),
                        isSubGraphExpanded: false,
                    },

                    GO(go.Shape, "RoundedRectangle", // surrounds everything
                        {
                            // parameter1: 10, fill: shape_fill_color,
                            // fill: shape_fill_color,
                            stroke: that.border_color,
                            strokeWidth: that.border_width,
                        },
                        // new go.Binding("fill", "isHighlighted", function (h) {
                        //     return h ? "rgba(255,0,0,0.2)" : shape_fill_color;
                        // }).ofObject(),
                        new go.Binding("fill").makeTwoWay()
                    ),
                    GO(go.Panel, "Vertical",  // position header above the subgraph
                        {defaultAlignment: go.Spot.Left},
                        GO(go.Panel, "Horizontal",  // the header
                            {defaultAlignment: go.Spot.Top},
                            GO("SubGraphExpanderButton"),  // this Panel acts as a Button
                            GO(go.TextBlock,     // group title near top, next to button
                                {
                                    font: "14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif",
                                    stroke: "#4e91fa",
                                    margin: 8,
                                    maxSize: new go.Size(160, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: false
                                },
                                new go.Binding("text").makeTwoWay(),
                                new go.Binding("stroke").makeTwoWay())
                        ),
                        GO(go.Placeholder,     // represents area for all member parts
                            {padding: new go.Margin(0, 10)},
                            //用于控制拓扑内部框的颜色
                            new go.Binding("background", "fill"))
                    )
                );
        }
    }

    exports('ExecResultShowDiagram', ExecResultShowDiagram);
});