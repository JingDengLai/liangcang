$(function () {
    initTable();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$('#table').bootstrapTable('refresh', {url : 'basic/variety/varieties'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	
	// 添加按钮
	$("#add").click(function() {
		$("#code").removeAttr("readonly"); 
		$("#code").removeAttr("unselectable"); 
		$("#code").css({"cursor": ""});
		$("#dataForm").reset();
		$("#addModalLabel").html("新建巡检路线");
		$("#operation").val("add");
		$('#addModal').modal('show');
		// 添加leaflet地图
		setTimeout(function(){
			initMap();
		},500)
	});
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	});
	
	//选择巡检点模态框显示
	$('#selectPoint').click(function(){
		$('#selectModal').modal('show');
	});
	
	// 多个模态框逻辑问题
	$(document).on('show.bs.modal', '.modal', function() {
		var zIndex = 1040 + (10 * $('.modal:visible').length);
		$(this).css('z-index', zIndex);
		setTimeout(function() {
			$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		}, 0);
	});
});

function initTable() {
    $('#table').bootstrapTable({
        url: '../js/safe/data1.json',
        method: 'get',
        columns: [ 
			{
				title: '全选',
				field: '全选',
				checkbox: true
			}, 
			{
				field: 'code',
				title: '编号'
			}, 
			{
				field: 'name',
				title: '巡检路线名称'
			},
			{
				field: 'desc',
				title: '说明'
			},

		],
		
    })
}