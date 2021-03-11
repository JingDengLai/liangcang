var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	tableInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var name = $.trim($('#searchform #name').val());
		var beganTime = $.trim($('#searchform #beganTime').val());
		var endTime = $.trim($('#searchform #endTime').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #name').val(name);
		$('#searchform #beganTime').val(beganTime);
		$('#searchform #endTime').val(endTime);
		$table.bootstrapTable('refresh', {url : 'oa/materials/materialStock/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
});
//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/materialStock/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [ 
	            [{
					title : '时间',
					field : 'purchaseTime',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 2
						
				},/* {
					title : '库点',
					field : 'groupName',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 2
				},*/ {
					title : '物料器材名称',
					field : 'name',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 2
				}, {
					title : '规格',
					field : 'specification',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 2
				}, {
					title : '型号',
					field : 'model',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 2
				}
				, {
					title : '上期库存',
					valign:"middle",
					align:"center",
					colspan: 2,
				    rowspan: 1
				}, {
					title : '购入',
					valign:"middle",
					align:"center",
					colspan: 2,
				    rowspan: 1
				}, {
					title : '发出',
					valign:"middle",
					align:"center",
					colspan: 2,
				    rowspan: 1
				}, {
					title : '本期库存',
					valign:"middle",
					align:"center",
					colspan: 2,
				    rowspan: 1
				}
				
             ],  
             [	{
					title : '数量',
					field : 'lastStock',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
             	},{
					title : '金额（元）',
					field : 'lastStockMoney',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
				},{
					title : '数量',
					field : 'purchaseAmount',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
             	},{
					title : '金额（元）',
					field : 'purchaseMoney',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
				},{
					title : '数量',
					field : 'sendAmount',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
             	},{
					title : '金额（元）',
					field : 'sendMoney',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
				},{
					title : '数量',
					field : 'currentStock',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
             	},{
					title : '金额（元）',
					field : 'currentStockMoney',
					valign:"middle",
					align:"center",
					colspan: 1,
				    rowspan: 1
				}
			 ]
		    ],
	});

};
//查看详情点击事件
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}

//详情
function searchDetails(id){
	$("#detial").modal("show");
	var row = $("#table").bootstrapTable("getData")[id];
	$.each(row,function(index,value){
		var values = value==null?"":value;
		$("#detial span[id='"+index+"']").text(values);
		$("#detial span[id='"+index+"']").attr("title",values);
	});
	
	
}