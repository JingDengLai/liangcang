$(function() {
	setDefault();
	$(".kind-grain-left li").click(function() {
		//获取当前库点
		var groupId = $("select[name=groupId]").val();
		
		$(".kind-grain-left li").removeClass("active");
		$(this).addClass("active");
		$(".kind-grain-left li i").removeClass("in-grain-active");
		$(this).children("i").addClass("in-grain-active");
		$(".kind-grain-right .grain-right-box").hide().eq($(this).index()).show();
		switch($(this).index()) {
			case 0:
				energyStatisticsByYear();
				energyStatisticsByMonth();
				energyStatisticsByDay();
				break;
			case 1:
				//grouping(groupId);
				warehouseChartByDiff('warehouseChart',groupId);
				break;
			case 2:
				$("#table").bootstrapTable('destroy');
				initTable(groupId);
				getwarehouses(groupId);
				break;
			case 3:
				//unitGrouping(groupId);
				warehouseUnitChartDiff('warehouseUnitChart',groupId);
				break;
			default:
				break;
		}
	});
	energyStatistics();
	
	
	//仓间能耗对比
	//重置
	$("#diffReset").click(function(){
		$("#diffEnergy").reset();
		$("#difbeginDate").val(monthFirst());
		$("#difendDate").val(getNowTiem());
	});
	//查询
	$("#diffSearch").click(function(){
		var groupId = $("select[name=groupId]").val();
		warehouseChartByDiff('warehouseChart',groupId);
	});
	
	//仓间单位能耗情况
	//重置
	$("#unitDiffReset").click(function(){
		$("#unitDiffEnergy").reset();
		$("#unitDifBeginDate").val(monthFirst());
		$("#unitDifEndDate").val(getNowTiem());
	});
	//查询
	$("#unitDiffSearch").click(function(){
		var groupId = $("select[name=groupId]").val();
		warehouseUnitChartDiff('warehouseUnitChart',groupId);
	});
	
});

//仓间能耗统计
function energyStatistics(){
	energyStatisticsByYear();
	energyStatisticsByMonth();
	energyStatisticsByDay();
}
/*----------------------年月日联动----------------------------------------------*/
var energyYearChart = echarts.init(document.getElementById('energyYearChart'));
energyYearChart.on('click',yearchartClick);
function  yearchartClick(params) {
	var energyyear = params.name;	
	if(params.name==null || params.name == ""){
		return;
	}
	energyStatisticsByMonth(energyyear);
}
var energyMonthChart = echarts.init(document.getElementById('energyMonthChart'));

energyMonthChart.on('click',monthchartClick);
function  monthchartClick(params) {
	if(params.name==null || params.name == ""){
		return;
	}
	var energymonth = params.name;	
	energyStatisticsByDay(energymonth);
}

/*--------------------------------------------------------------------*/
function energyStatisticsByYear(){
	var energyStatisticsData;
	var yearList = [0];
	var yearSumList = [0];
	$.ajax({
		url : "energy/energyTotal/energyStatisticsByYear",
		type : 'GET',
		dataType : "json",
		data:{groupId:$("select[name=groupId]").val(),warehouseId:$("select[name=statisticsWarehouseId]").val()}
	}).done(function(data) {
		energyStatisticsData=data;
		yearList = data.yearList;
		yearSumList = data.yearSumList;
		var energyYearChart = echarts.init(document.getElementById('energyYearChart'));
		window.addEventListener("resize", function() {
			energyYearChart.resize();
		});
		var energyYearChartOption = {
			title: {
				text: '年能耗统计',
				x: 'center',
				textStyle: {
					fontSize: 18
				}
			},
			grid: {
				top: '40%',
				bottom: '10%'
			},
			tooltip: {
				trigger: 'axis'
			},
			xAxis: [{
				type: 'category',
				name: '年份',
				data: yearList
			}],
			yAxis: [{
				name: 'KW',
				type: 'value'
			}],
			series: [{
				name: '年能耗统计',
				type: 'bar',
				barWidth: '30%',
				itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#29c0db'
						}, {
							offset: 1,
							color: '#0a9eb8'
						}])
					}
				},
				data: yearSumList
				/*markPoint: {
					symbol: 'pin',
					symbolSize: 50,
					label: {
						show: true
					},
					data: [{
						xAxis: 0,
						yAxis: 2
					}, {
						xAxis: 1,
						yAxis: 4
					}, {
						xAxis: 2,
						yAxis: 3
					}, {
						xAxis: 3,
						yAxis: 2000
					}]
				}*/
			}]
		}
		energyYearChart.setOption(energyYearChartOption);
	}).fail(function() {
		console.log("请求失败！");
	});
	
}


function energyStatisticsByMonth(nowyear){
	if(nowyear==null && nowyear==undefined){
		nowyear = new Date().getFullYear();
	}
	$.ajax({
		url : "energy/energyTotal/energyStatisticsByMonth",
		type : 'GET',
		dataType : "json",
		data:{groupId:$("select[name=groupId]").val(),warehouseId:$("select[name=statisticsWarehouseId]").val(),year:nowyear}
	}).done(function(data) {
		//console.log(data)
		var energyMonthChart = echarts.init(document.getElementById('energyMonthChart'));
		window.addEventListener("resize", function() {
			energyMonthChart.resize();
		});
		var energyMonthChartOption = {
			title: {
				text: '月能耗统计',
				x: 'center',
				textStyle: {
					fontSize: 18
				}
			},
			grid: {
				top: '40%',
				bottom: '10%'
			},
			tooltip: {
				trigger: 'axis'
			},
			xAxis: [{
				type: 'category',
				name: '月份',
				data: data.monthList
			}],
			yAxis: [{
				name: 'KW',
				type: 'value'
			}],
			series: [{
				name: '月能耗统计',
				type: 'bar',
				barWidth: '40%',
				itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#f9b030'
						}, {
							offset: 1,
							color: '#e08f01'
						}])
					}
				},
				data: data.monthSumList
				/*markPoint: {
					symbol: 'pin',
					symbolSize: 50,
					label: {
						show: true
					},
					data: [{
						xAxis: 0,
						yAxis: 2
					}, {
						xAxis: 1,
						yAxis: 4
					}, {
						xAxis: 2,
						yAxis: 3
					}, {
						xAxis: 3,
						yAxis: 4
					}, {
						xAxis: 4,
						yAxis: 2
					}, {
						xAxis: 5,
						yAxis: 4
					}, {
						xAxis: 6,
						yAxis: 3
					}, {
						xAxis: 7,
						yAxis: 4
					}, {
						xAxis: 8,
						yAxis: 2
					}, {
						xAxis: 9,
						yAxis: 4
					}, {
						xAxis: 10,
						yAxis: 3
					}, {
						xAxis: 11,
						yAxis: 80000
					}]
				}*/
			}]
		}
		energyMonthChart.setOption(energyMonthChartOption);
	}).fail(function() {
		console.log("请求失败！");
	});
	
}

function energyStatisticsByDay(yearAndMonth){
	if(yearAndMonth==null || yearAndMonth==undefined){
		var now = new Date();
	   	var nowyear = now.getFullYear();   //年
	   	var nowMonth = now.getMonth()+1;
	   	nowMonth = (nowMonth<10?"0"+nowMonth : nowMonth);
	   	yearAndMonth = (nowyear.toString()+"-"+nowMonth.toString());
	}
	$.ajax({
		url : "energy/energyTotal/energyStatisticsByDay",
		type : 'GET',
		dataType : "json",
		data:{groupId:$("select[name=groupId]").val(),warehouseId:$("select[name=statisticsWarehouseId]").val(),month:yearAndMonth}
	}).done(function(data) {
		//console.log(data)
		var energyDayChart = echarts.init(document.getElementById('energyDayChart'));
		window.addEventListener("resize", function() {
			energyDayChart.resize();
		});
		var energyDayChartOption = {
			title: {
				text: '日能耗统计',
				x: 'center',
				textStyle: {
					fontSize: 18
				}
			},
			grid: {
				top: '30%',
				bottom: '10%',
				left: '5%',
				right: '5%'
			},
			tooltip: {
				trigger: 'axis'
			},
			xAxis: [{
				type: 'category',
				name: '日期',
				data: data.dayList
			}],
			yAxis: [{
				name: 'KW',
				type: 'value'
			}],
			series: [{
				name: '日能耗统计',
				type: 'bar',
				barWidth: '40%',
				itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#8bdb73'
						}, {
							offset: 1,
							color: '#6db75c'
						}])
					}
				},
				data: data.daySumList
			}]
		}
		energyDayChart.setOption(energyDayChartOption);
	}).fail(function() {
		console.log("请求失败！");
	});
}

//仓间能耗列表
function initTable(groupId){
	//列表查询
	$("#formListSearch").click(function(){
		$("#table").bootstrapTable("refresh", {url : "energy/energyTotal/energyRecords?groupId="+groupId});
	});
	
	//查询重置
	$("#formListReset").click(function(){
		$("#searchform").reset();
		$("#beginTime").val(monthFirst());
		$("#endTime").val(getNowTiem());
	});
	
	
	$("#table").bootstrapTable({
		height: $(".kind-grain-right").height() - 50,
		url: "energy/energyTotal/energyRecords?groupId="+groupId,
		columns: [{
			title: "仓间号",
			field: "warehouseName"
		},{
			title: "电表名称",
			field: "name"
		},{
			title: "电流（A）",
			field: "current"
		},{
			title: "电压（V）",
			field: "voltage"
		},{
			title: "功率（KW）",
			field: "power"
		},{
			title: "电量（KW）",
			field: "electriCity"
		},{
			title: "时间",
			field: "monitorTime"
		}]
	});
}

//仓间号
function getwarehouses(groupId){
	$("#searchform select[name='warehouseId']").empty();
	$.ajax({
		url : "energy/energyTotal/warehouseList?groupId="+groupId,
		type : 'GET',
		dataType : "json"
	}).done(function(data) {
		if(data){
			$("#searchform select[name='warehouseId']").append("<option value=''>全部</option>");
			$.each(data,function(index,item){
				$("#searchform select[name='warehouseId']").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
			});
		}
	}).fail(function() {
		alert("信息获取失败!","warning");
	});
}

//仓间能耗对比---仓间号分组
function grouping(groupId){
	$.ajax({
		url : "energy/energyTotal/gruopWareHouse",
		type : 'GET',
		dataType : "json",
		data: {groupId:groupId},
		async:false
	}).done(function(data) {
		var res = data.waerhouseGroup;
		var radioHtml = "";
		if(res){
			$.each(res,function(index,obj){
				radioHtml += "<div class='energy-radio'>"+
									"<input id='"+ index +"' type='radio' name='radioDif' value='"+obj.ids+"' />"+
									"<label for='"+ index +"'>"+obj.title+"</label>" +
								"</div>";
			});
		}
		$("#energyDifference").html(radioHtml);
		$("#energyDifference input[name='radioDif']:eq(0)").attr("checked",'checked');
	}).fail(function() {
		alert("信息获取失败!","warning");
	});
}
//仓间能耗对比---初始化数据
function warehouseChartByDiff(obj,groupId) {
	var names = [0];
	var electriCity = [0];
	var beginTime = $("input[name='diff_beginTime']").val();
	var endTime = $("input[name='diff_endTime']").val();
	//var warehouseNames = $('input:radio[name="radioDif"]:checked').val();
	$.ajax({
		url : "energy/energyTotal/warehouseEnergyDiff",
		type : 'GET',
		dataType : "json",
		data: 
		{	groupId:groupId,
			beginTime:beginTime,
			endTime:endTime
			//warehouseNames:warehouseNames
		},
		async:false
	}).done(function(data) {
		names = data.nameList;
		electriCity = data.electriCityList;
	}).fail(function() {
		alert("信息获取失败!","warning");
	});
	
	var chartObj = echarts.init(document.getElementById(obj));
	window.addEventListener("resize", function() {
		chartObj.resize();
	});
	var warehouseChartOption = {
		grid: {
			bottom: '10%',
			left: "5%",
			right: "5%"
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: [{
			type: 'category',
			name: '仓间号',
			data: names
		}],
		yAxis: [{
			name: 'KW',
			type: 'value'
		}],
		series: [{
			name: '仓间能耗对比',
			type: 'bar',
			barWidth: '50%',
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#29c0db'
					}, {
						offset: 1,
						color: '#0a9eb8'
					}])
				}
			},
			data: electriCity
		}]
	}
	chartObj.setOption(warehouseChartOption);
}

//仓间单位能耗情况---仓间号分组
function unitGrouping(groupId){
	$.ajax({
		url : "energy/energyTotal/gruopWareHouse",
		type : 'GET',
		dataType : "json",
		data: {groupId:groupId},
		async:false
	}).done(function(data) {
		var res = data.waerhouseGroup;
		var radioHtml = "";
		if(res){
			$.each(res,function(index,obj){
				radioHtml += "<div class='energy-radio'>"+
									"<input id='" +'u'+ index +"' type='radio' name='uRadioDif' value='"+obj.ids+"' />"+
									"<label for='" +'u'+ index +"'>"+obj.title+"</label>" +
								"</div>";
			});
		}
		$("#unitEnergyDifference").html(radioHtml);
		$("#unitEnergyDifference input[name='uRadioDif']:eq(0)").attr("checked",'checked');
	}).fail(function() {
		alert("信息获取失败!","warning");
	});
}

//仓间单位能耗情况---初始化数据
function warehouseUnitChartDiff(obj,groupId){
	var names = [0];
	var unitEnergyConsumptions = [0];
	var beginTime = $("input[name='act_begin_time']").val();
	var endTime = $("input[name='act_end_time']").val();
	//var warehouseNames = $('input:radio[name="uRadioDif"]:checked').val();
	$.ajax({
		url : "energy/energyTotal/unitEnergyConsumption",
		type : 'GET',
		dataType : "json",
		data: 
		{	groupId:groupId,
			beginTime:beginTime,
			endTime:endTime
			//warehouseNames:warehouseNames
		},
		async:false
	}).done(function(data) {
		names = data.nameList;
		unitEnergyConsumptions = data.unitEnergyConsumptionList;
	}).fail(function() {
		alert("信息获取失败!","warning");
	});
	
	var chartObj = echarts.init(document.getElementById(obj));
	window.addEventListener("resize", function() {
		chartObj.resize();
	});
	var warehouseChartOption = {
		grid: {
			bottom: '10%',
			left: "5%",
			right: "5%"
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: [{
			type: 'category',
			name: '仓间号',
			data: names
			//data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		}],
		yAxis: [{
			name: 'KW-h/吨',
			type: 'value'
		}],
		series: [{
			name: '仓间单位能耗',
			type: 'bar',
			barWidth: '50%',
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#29c0db'
					}, {
						offset: 1,
						color: '#0a9eb8'
					}])
				}
			},
			data: unitEnergyConsumptions
			//data: [2, 4, 3, 4, 2, 4, 3, 4, 6, 3]
		}]
	}
	chartObj.setOption(warehouseChartOption);
}



//仓间能耗对比，设置默认时间
function setDefault(){
	//仓间能耗对比
	$("#difbeginDate").val(monthFirst());
	$("#difendDate").val(getNowTiem());
	//仓间列表
	$("#beginTime").val(monthFirst());
	$("#endTime").val(getNowTiem());
	//仓间单位能耗
	$("#unitDifBeginDate").val(monthFirst());
	$("#unitDifEndDate").val(getNowTiem());
}

//获取当前系统时间
function getNowTiem(){
	var nowDate;
	var now = new Date();
	var year = now.getFullYear(); // 年
	var month = now.getMonth() + 1; // 月
	var day = now.getDate(); // 日

	nowDate = year + "-";

	if (month < 10)
		nowDate += "0";

	nowDate += month + "-";

	if (day < 10)
		nowDate += "0";
	
	return nowDate+=day;
}
//获取当天系统本月第一天
function monthFirst(){
	var nowDate;
	var now = new Date();
	var year = now.getFullYear(); // 年
	var month = now.getMonth() + 1; // 月
	//var day = now.getDate(); // 日

	nowDate = year + "-";

	if (month < 10)
		nowDate += "0";

	nowDate += month + "-";

	/*if (day < 10)
		nowDate += "0";*/
	
	
	return nowDate+="01";
}