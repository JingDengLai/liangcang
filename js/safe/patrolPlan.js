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
		$("#addModalLabel").html("新建巡检计划");
		$("#operation").val("add");
		$('#addModal').modal('show');
	});
	
	
	// 选择计划
	$('.plan-cycle-2-2-1>span').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		let box = $(this).data('box');
		$('.'+box+'-content').css('display','unset').siblings().css('display','none');
	});
	
	// 选择每周日期
	$('.week-content-1 .list span').click(function(){
		$(this).toggleClass('active');
	});
	
	// 选择每月日期
	$('.month-content-1 .list span').click(function(){
		$(this).toggleClass('active');
	});
	
	//选择巡检员
	$('#addstaff').click(function(){
		$("#peopleLabel").html("巡检员列表");
		$('#addPeople').modal('show');
		initStaffTable();
	});
	
	//选择管理员
	$('#addManager').click(function(){
		$("#peopleLabel").html("管理员列表");
		$('#addPeople').modal('show');
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
		dataField:"data"
    })
}

function initStaffTable(){
	$('.people-content-table table tr:not(:first)').empty();
	$('.people-content-table table').append(`<tr>
		<td><input type="checkbox"></td>
		<td>R2058</td>
		<td>哈哈哈</td>
		<td>3666666</td>
	</tr>`)
}