var boxHeight, videoHeight, videoWidth, $table = $('#table');

$(function() {
	initTable();
	 $(".content-wrapper").mCustomScrollbar();
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
		url: "pest/history/pestHistoryPages",
		method : 'get', // 请求方式（*）
		columns: [{
			title: "仓间号",
			field: "warehouseCode"
		},{
			title: "监测时间",
			field: "measureTime"
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
			title: "9区",
			field: "value_9"
		},{
			title: "10区",
			field: "value_10"
		},{
			title: "11区",
			field: "value_11"
		},{
			title: "12区",
			field: "value_12"
		},{
			title: "13区",
			field: "value_13"
		},{
			title: "14区",
			field: "value_14"
		},{
			title: "15区",
			field: "value_15"
		},{
			title: "总和",
			field: "sum_value"
		}]
	});
}

