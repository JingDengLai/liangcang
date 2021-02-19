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
	});
	
	
	$(".day-startTime").datetimepicker({
		format: 'hh:ii',//显示格式
		language: "zh-CN",
		startView: "hour",
		autoclose:true,
	})
	
	$(".day-startTime").datetimepicker("setDate", new Date() );
});

function initTable() {
    $('#table').bootstrapTable({
        // url: '../js/safe/data1.json',
        // method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '计划编号'
        }, {
            field: 'name',
            title: '计划名称'
        },{
			field: 'routename',
			title: '线路名称'
		},{
			field: 'startTime',
			title: '开始时间'
		},{
			field: 'endTime',
			title: '结束时间'
		},{
			field: 'status',
			title: '计划状态'
		}],
		data: [{
		    code: 1,
		    name: 'Item 1',
		    routename: '$1',
			startTime: '2020-01-01',
			endTime: '2020-01-02',
			status: '正常'
		}, {
		    code: 2,
		    name: 'Item 2',
		    routename: '$2',
		    startTime: '2020-01-01',
		    endTime: '2020-01-02',
		    status: '正常'
		}]
    })
}