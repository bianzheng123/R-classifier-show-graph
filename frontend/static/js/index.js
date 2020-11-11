// 蓝鲸布局用到的js
$(".king-menu-submenu-title").click(function(){
    $(this).parent().toggleClass("show-items");
    $(this).next().slideToggle();
})

$(".king-menu-item").click(function(){
    $(".king-menu-item").removeClass("king-menu-item-selected");
    $(this).addClass("king-menu-item-selected");
})

// 因为用到了挺多layui, js模块化就顺便用layui做了
// 加载layui的模块
layui.config({
    base: '../'
}).extend({
    DiagramSuper: 'js/topology/diagram_super',
    ExecResultShowDiagram: 'js/topology/exec_result_show_diagram',
    ExecTopologyDiagram: 'js/topology/exec_topology_diagram',
});