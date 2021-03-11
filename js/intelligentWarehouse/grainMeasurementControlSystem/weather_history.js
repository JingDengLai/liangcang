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
		url: "weather/history/weatherHistoryPages",
		method : 'get', // 请求方式（*）
		columns: [
		{
			title: "监测时间",
			field: "monitorTime"
		},{
			title: "温度（℃）",
			field: "temperatureValue"
		},{
			title: "湿度（%）",
			field: "humidityValue"
		}, {
			title: "降水（mm/min）",
			field: "rainfall"
		},{
			title: "风速（m/s）",
			field: "windSpeed"
		}]
	});
}
