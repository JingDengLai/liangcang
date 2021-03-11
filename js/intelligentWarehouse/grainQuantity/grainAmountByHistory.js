var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	tableInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var warehouseId = $.trim($('#searchform #warehouseId').val());
		var beginTime = $.trim($('#searchform #beginTime').val());
		var endTime = $.trim($('#searchform #endTime').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #warehouseId').val(warehouseId);
		$('#searchform #beginTime').val(beginTime);
		$('#searchform #endTime').val(endTime);
		$table.bootstrapTable('refresh', {url : 'grainQuantity/grainAmountByHistory/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
});

//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'grainQuantity/grainAmountByHistory/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		singleSelect: true,
		columns : [ {
			title : '',
			field : 'checkAll',
			align : 'center',
			valign : 'middle',
			checkbox : true
		}, {
			title : '详情',
			field : 'detail',
			align : 'center',
			valign : 'middle',
			formatter : formatDetail,
			width : 100
		},  {
			title : '仓间号',
			field : 'warehouseName',
			align : 'center',
			valign : 'middle',
			width : 100
		},{
			title : '监测状态',
			field : 'collectStatus',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '监测时间',
			field : 'monitorTime',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮堆长',
			field : 'inLenth',
			align : 'center',
			valign : 'middle',
			width : 200
		}, {
			title : '粮堆宽',
			field : 'inWidth',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮堆高',
			field : 'grainHeight',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '测量体积(m³)',
			field : 'volume',
			align : 'center',
			valign : 'middle',
			width : 200
		}, {
			title : '扣除体积（m³）',
			field : 'deductVolume',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '实际体积（m³）',
			field : 'actualVolume',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮食容重(g/L)',
			field : 'volumeWeight',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '校正后修正系数',
			field : 'ratio',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '入仓方式',
			field : 'transportWay',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '储存方式',
			field : 'storageMethod',
			align : 'center',
			valign : 'middle',
			width : 100
		} ]
	});

};
//查看详情点击事件
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}

//详情
function searchDetails(id){
	var row = $("#table").bootstrapTable("getData")[id];
	$.ajax({
		type: 'get',
		url : "grainQuantity/grainAmountByHistory/detail/grainAmount?groupId="+row.groupId+"&warehouseId="+row.warehouseId+"&id="+row.quantityId,
	}).done(function(data) {
		console.log(data)
		$.each(data,function(index,value){
			var values = value==null?"":value;
			$("#detial #"+index).html(values);
			$("#detial #"+index).attr("title",values);
		});
		$("#detial").modal("show");
	}).fail(function(err) {
	});
	
}

//打印
function printInit(){
	var selections =  $table .bootstrapTable("getSelections");
	if (selections.length == 0) {
		alert("请选择要导出的记录!","warning");
		$("#dataForm").reset();
		return;
	}else if(selections.length > 1){
		alert("请选择一条要导出的记录!","warning");
		$("#dataForm").reset();
		return;
	}
	$.each(selections, function(i, row) {
		window.open ("grainQuantity/grainAmountByPerson/print/grainAmount?groupId="+row.groupId+"&warehouseId="+row.warehouseId+"&id="+row.quantityId);
	})
		
}