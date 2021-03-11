$(function() {
	//初始化表格
	initTable();
});

//查询按钮事件
$("#submit_search").click(function(){
	$("#table").bootstrapTable("refresh");
});
// 重置按钮
$("#submit_reset").click(function() {
	$("#searchform")[0].reset();
});

//列表查询
function initTable(){
	$("#table").bootstrapTable({
		url: "water/history/waterHistoryPages",
		method : 'get', // 请求方式（*）
		columns: [
		{
			title: "仓间号",
			field: "warehouseCode"
		},{
			title: "监测时间",
			field: "monitorTime"
		},{
			title: "品种",
			field: "varietyName"
		}, {
			title: "1区",
			field: "value_1"
		},{
			title: "2区",
			field: "value_2"
		},{
			title: "3区",
			field: "value_3"
		},{
			title: "4区",
			field: "value_4"
		},{
			title: "5区",
			field: "value_5"
		},{
			title: "6区",
			field: "value_6"
		},{
			title: "7区",
			field: "value_7"
		},{
			title: "8区",
			field: "value_8"
		},{
			title: "平均水分",
			field: "avg_value",
			
		}]
	});
}
