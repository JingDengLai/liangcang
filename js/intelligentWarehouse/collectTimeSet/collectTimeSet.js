var boxHeight, videoHeight, videoWidth, $table = $('#table');

//定时任务url
var scheduleUrl = task_manager_api;

$(function() {
	initTable();
});


function onchangeGroup(groupId){
	console.log(1);
	$("#table").bootstrapTable("refresh");
}

// 列表查询
function initTable() {
	console.log(0);
	$("#table")
			.bootstrapTable(
					{
						url : scheduleUrl+"?type=0",
						method : 'get', // 请求方式（*）
						columns : [
								{
									title : "库区",
									field : "groupName"
								},
								{
									title : "设备类型",
									field : "name"
								},
								{
									title : "采集时间",
									field : "cronExpression",
									formatter : function(value, row, index) {
										if (null != value) {
											var cronExp = value.split(' ');
											var every = /\*\/\d/;
											var number = /\d/;
											var last = /L/;
											// 每几分钟
											if (every.test(cronExp[1])) {
												var minExp = cronExp[1]
														.split('/');
												return '每 <div class="form-group form-group-display form-group-num">'
												+ '<input type="text" name="time" onclick="$(this).val(\'\')" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'m\',minDate:\'00:1:00\'})" value="'
												+ minExp[1]
												+ '" /></div> '
												+ '<div class="form-group form-group-display"><select class="inorout" name="timeType" onchange="selectHourDayWeek(this)">'
												+ '<option value="1" selected>分钟</option><option value="2" >小时</option><option value="3">天</option><option  value="4" >周</option></select></div>';
											}
											// 每几小时
											else if (every.test(cronExp[2])) {
												var hourExp = cronExp[2]
														.split('/');
												return '每 <div class="form-group form-group-display form-group-num">'
														+ '<input type="text" name="time"  class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'H\',minDate:\'1:00:00\'})" value="'
														+ hourExp[1]
														+ '" /></div> '
														+ '<div class="form-group form-group-display"><select class="inorout" name="timeType" onchange="selectHourDayWeek(this)">'
														+ '<option value="1">分钟</option><option value="2" selected>小时</option><option value="3">天</option><option  value="4" >周</option></select></div>';
											}
											// 每周几
											else if (number.test(cronExp[5])) {
												var week = '每 <div class="form-group form-group-display"><select name="timeType" class="inorout"  onchange="selectHourDayWeek(this)"><option value="1">分钟</option><option value="2">小时</option><option value="3">天</option><option  value="4" selected>周</option></select></div>';
												switch (cronExp[5]) {
												case '1':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" selected="selected">周日</option><option value="2">周一</option>'
															+ '<option value="3">周二</option><option value="4">周三</option><option value="5">周四</option><option value="4">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';
													break;
												case '2':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" selected="selected">周一</option>'
															+ '<option value="3">周二</option><option value="4">周三</option><option value="5">周四</option><option value="4">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time"  class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';
													break;
												case '3':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" >周一</option>'
															+ '<option value="3" selected="selected">周二</option><option value="4">周三</option><option value="5">周四</option><option value="4">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';

													break;
												case '4':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" >周一</option>'
															+ '<option value="3" >周二</option><option value="4" selected="selected">周三</option><option value="5">周四</option><option value="4">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';

													break;
												case '5':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" >周一</option>'
															+ '<option value="3" >周二</option><option value="4" >周三</option><option value="5" selected="selected">周四</option><option value="4">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';

													break;
												case '6':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" >周一</option>'
															+ '<option value="3" >周二</option><option value="4" >周三</option><option value="5" >周四</option><option value="4" selected="selected">周五</option><option value="5">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';

													break;
												case '7':
													return week
															+ '<div class="form-group form-group-display form-group-time">'
															+ '<select class="inorout" name="weekTime">'
															+ '<option value="1" >周日</option><option value="2" >周一</option>'
															+ '<option value="3" >周二</option><option value="4" >周三</option><option value="5" >周四</option><option value="4" >周五</option><option value="5" selected="selected">周六</option></select></div>'
															+ '<div class="form-group form-group-display"><input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
															+ cronExp[2] + ':'
															+ cronExp[1]
															+ '"/></div>';

													break;
												}
											}
											// 每月第几天
											else if (number.test(cronExp[3])
													|| last.test(cronExp[3])) {
												if (cronExp[3] == 'L') {
													return '每月最后一天 '
															+ cronExp[2] + '时'
															+ cronExp[1] + '分';
												} else {
													return '每月第' + cronExp[3]
															+ '天 ' + cronExp[2]
															+ '时' + cronExp[1]
															+ '分';
												}
											}

											// 每天
											else {
												return '每 <div class="form-group form-group-display"> <select class="inorout" name="timeType" onchange="selectHourDayWeek(this)"><option value="1">分钟</option><option value="2">小时</option><option value="3" selected>天</option><option value="4">周</option></select></div><div class="form-group form-group-display">'
														+ '<input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value="'
														+ cronExp[2]
														+ ':'
														+ cronExp[1]
														+ '" /></div>';
											}
										} else {
											return null;
										}
									}
								}, {
									title : "状态",
									field : "status",
									formatter: function(value, row, index){
										if ('1' == value) {
											return "正在运行";
										} else if('0' == value){
											return "停止";
										}else{
											return "";
										}
							        }
								},{
									title : "操作",
									field : "id",
									formatter : formatDetail
								} ]
					});
}

function formatDetail(value, row, index) {
	var stopOrOpenStatusButton = "";
	var stopOrOpenStatus = "";
	if(row.status=='1'){
		stopOrOpenStatusButton = "停止";
		stopOrOpenStatus = '0';
	}else{
		stopOrOpenStatusButton = "启动";
		stopOrOpenStatus = '1';
	}
	return '<button  class="btn btn-search" onclick="set(' + value
			+ ',this)">保存</button><button  class="btn btn-search" onclick="stopOrOpen('+value+','+stopOrOpenStatus+',this)">'+stopOrOpenStatusButton+'</button>';
}
function getHeight() {
	return $(window).height() - $('.header').outerHeight(true);
}
// 重置表格
/*function resetView() {
	$table.bootstrapTable('resetView');
}

$(window).resize(function() {
	resetView();
});*/

function selectHourDayWeek(x) {
	var htmlWeek = '每  '
			+'<div class="form-group form-group-display">'
				+'<select class="inorout"  name="timeType" onchange="selectHourDayWeek(this)">'
					+'<option value="1">分钟</option><option value="2">小时</option>'
					+'<option value="3">天</option>'
					+'<option  value="4" selected>周</option>'
					+'</select>'
			+'</div>'
			+'<div class="form-group form-group-display form-group-time">'
				+ '<select class="inorout" name="weekTime">'
					+ '<option value="1" selected="selected">周日</option>'
					+'<option value="2">周一</option>'
					+ '<option value="3">周二</option>'
					+'<option value="4">周三</option>'
					+'<option value="5">周四</option>'
					+'<option value="4">周五</option>'
					+'<option value="5">周六</option>'
				+'</select>'
			+'</div>'
			+'<div class="form-group form-group-display">'
				+'<input type="text" name="time"  class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value=""/>'
			+'</div>';
	var htmlDay = '每  '
			+'<div class="form-group form-group-display">'
				+'<select class="inorout" name="timeType" onchange="selectHourDayWeek(this)">'
					+'<option value="1">分钟</option><option  value="2">小时</option>'
					+'<option value="3" selected>天</option>'
					+'<option value="4">周</option>'
				+'</select>'
			+'</div>'
			+'<div class="form-group form-group-display">'
				+'<input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'HH:mm\'})" value=""/>'
			+'</div>';
	var htmlHour = '每  '
			+'<div class="form-group form-group-display form-group-num">'
				+ '<input type="text" name="time" class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'H\',minDate:\'1:00:00\'})" value="" />'
			+'</div> '
			+ '<div class="form-group form-group-display">'
				+'<select class="inorout" name="timeType" onchange="selectHourDayWeek(this)">'
					+ '<option value="1">分钟</option><option value="2" selected>小时</option>'
					+'<option value="3">天</option>'
					+'<option  value="4" >周</option>'
				+'</select>'
			+'</div>';
	var htmlMin = '每  '
		+'<div class="form-group form-group-display form-group-num">'
			+ '<input type="text" name="time" onclick="$(this).val(\'\')"  class="form_datetime Wdate" onFocus="WdatePicker({dateFmt:\'m\',minDate:\'00:1:00\'})" value="" />'
		+'</div> '
		+ '<div class="form-group form-group-display">'
			+'<select class="inorout" name="timeType" onchange="selectHourDayWeek(this)">'
				+ '<option value="1" selected>分钟</option><option value="2" >小时</option>'
				+'<option value="3">天</option>'
				+'<option  value="4" >周</option>'
			+'</select>'
		+'</div>';
	switch (x.value) {
		case "1":
			$(x).parents("td").html(htmlMin);
			break;
		case "2":
			$(x).parents("td").html(htmlHour);
			break;
		case "3":
			$(x).parents("td").html(htmlDay);
			break;
		case "4":
			$(x).parents("td").html(htmlWeek);
			break;
		default:
			break;
	}
}
//保存按钮
function set(id, x) {
	var time = $(x).parents("tr").find("input[name='time']").val();
	var timeType = $(x).parents('tr').find("select[name='timeType']").val();
	var weekTime = $(x).parents('tr').find("select[name='weekTime']").val();
	if(time==''||time==undefined){
		alert("时间不能为空！");
		return ;
	}
	if(time=='0'){
		alert("时间不能为0！");
		return ;
	}
	confirm("保存后，将按照新的采集时间运行，是否确认保存？", function (){
		var cronExpression = cronExpression1(timeType, time, weekTime);
		var date = {
				'id' : id+"",
				"cronExpression" : cronExpression
			};
		$.ajax({
			url : scheduleUrl+"/updateTask",
			type : 'PUT',
			dataType : "json",
			data : JSON.stringify(date)
		}).done(function(data) {
			// 提示成功
			$('#table').bootstrapTable('refresh');
			alert("保存成功！");
		}).fail(function(err) {
			alert("保存失败！","warning");
		});

	});
}

//启动或停止

function stopOrOpen(id,status,x){
	var text = "";
	if(status=='0'){
		text = "是否确认停止？";
	}else{
		text = "启动后，将按照新的采集时间运行，是否确认启动？";
	}
	var alertText = "";
	if(status=='0'){
		alertText = "停止";
	}else{
		alertText = "启动";
	}
	var time = $(x).parents("tr").find("input[name='time']").val();
	var timeType = $(x).parents('tr').find("select[name='timeType']").val();
	var weekTime = $(x).parents('tr').find("select[name='weekTime']").val();
	if(time==''||time==undefined){
		alert("时间不能为空！");
		return ;
	}
	if(time=='0'){
		alert("时间不能为0！");
		return ;
	}
	
	confirm(text, function (){
		$.ajax({
			url : scheduleUrl+"/changeStatus?task_id="+id,
			type : 'GET'
		}).done(function(data) {
			// 提示成功
			$('#table').bootstrapTable('refresh');
			alert(alertText+"成功！");
		}).fail(function(err) {
			alert(alertText+"失败！","warning");
		});
	});
	
}
//拼接时间表达式
function cronExpression1(timeType, time, weekTime) {
	var cronExpression = "";
	switch (timeType) {
	case '1':
		cronExpression = '0 */' + time + ' * * * ?';
		break;
	case '2':
		cronExpression = '0 0 */' + time + ' * * ?';
		break;
	case '3':
		var hour_min = time.split(':');
		cronExpression = '0 ' + hour_min[1] + ' ' + hour_min[0] + ' * * ?';
		break;
	case '4':
		var day_of_week = weekTime;
		var hour_min = time.split(':');
		cronExpression = '0 ' + hour_min[1] + ' ' + hour_min[0] + ' ? * '
				+ day_of_week;
		break;
	case '5':
		var day_of_month = $("#sltDay").val();
		var hour_min = $("#execTime").val().split(':');
		cronExpression = '0 ' + hour_min[1] + ' ' + hour_min[0] + ' '
				+ day_of_month + ' * ?';
		break;
	}
	return cronExpression;
}

