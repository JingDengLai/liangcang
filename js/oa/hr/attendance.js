var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//初始化列表
	initTable();
	
	// 添加请假天数
	addOnLeaveDays();
	// 添加加班
	addOvertimeDays();
	// 添加出差
	addTravelDays();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var theme = $.trim($('#searchform #name').val());
		var lecturer = $.trim($('#searchform #time').val());
		$('#searchform #name').val(theme);
		$('#searchform #time').val(lecturer);
		$table.bootstrapTable('refresh', {url: "oa/hr/attendance/attendanceList"});
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	//添加计划考勤天, 表单非空验证...
	$('#editModal').on('hide.bs.modal', function() {
		$("#editModal form").each(function() {
			$(this).reset();
		});
	})
	//导入考勤记录, 表单非空验证...
	$('#inModal').on('hide.bs.modal', function() {
		$("#inModal form").each(function() {
			$(this).reset();
		});
	})
	
	// 导入按钮
	$("#important").click(function() {
		$('#inModal').modal('show');
	});
	// 导入方法
	importExcel();
	
	// 添加计划考勤天数按钮
	$("#editDays").click(function() {
		$('#editModal').modal('show');
	});
	addPlanAttendanceDays();
	
});   


//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/hr/attendance/attendanceList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "姓名",
			field: "name"
		},{
			title: "时间",
			field: "time"
		},{
			title: "计划出勤(天)",
			field: "planAttendance"
		},{
			title: "请假(天)",
			field: "onLeave"
		},{
			title: "加班(天)",
			field: "overtime"
		},{
			title: "出差(天)",
			field: "travel"
		},{
			title: "实际出勤(天)",
			field: "actualAttendance"
		},{
			title: "出勤率(%)",
			field: "attendanceRate",
		}/*,{
			title: "备注",
			field: "remark"
		}*/,{
			title: "操作",
			formatter: operateFormatter
		}]
	});
}

function attendanceRate(value, row, index){
	var attendanceRate = value*100;
	return attendanceRate;
	//return (value*10000)*(100/10000)+"%";
}

//添加请假方法
function addOnLeaveDays() {
	$('#onLeaveForm').bootstrapValidator({
		fields : {
			onLeave_days: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:2, message:"不能超过2位"},
					regexp:{regexp:/^[1-9]*[1-9][0-9]*$/,message:"只能填写整数且不能以0开头"}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $(".operation_name").val();
		var onLeave_days = $("#onLeave_days").val();
		
		if ("onLeave" == operation) {
			$.ajax({
				type : 'PUT',
				url : "oa/hr/attendance/updateAttendance",
				data : $("#onLeaveForm").serializeJson(),
			}).done(function(data) {
				$('#onLeaveModal').modal('hide');
				if (data.flag == true) {
					alert("修改成功!");
				} else {
					alert("修改失败！", "warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#onLeaveForm").reset();
			});
		} else {
			confirm("未定义的操作" + operation);
		}
	});
}

//添加加班方法
function addOvertimeDays() {
	$('#overtimeForm').bootstrapValidator({
		fields : {
	       overtime_days: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:2, message:"不能超过2位"},
					regexp:{regexp:/^[1-9]*[1-9][0-9]*$/,message:"只能填写整数且不能以0开头"}
			    }
	        }
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $(".operation_name").val();
		if ("overtime" == operation) {
			$.ajax({
				type : 'PUT',
				url : "oa/hr/attendance/updateAttendance",
				data : $("#overtimeForm").serializeJson(),
			}).done(function(data) {
				console.log(data.flag);
				$('#overtimeModal').modal('hide');
				if (data.flag == true) {
					alert("修改成功!");
				} else {
					alert("修改失败！", "warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#overtimeForm").reset();
			});
		} else {
			confirm("未定义的操作" + operation);
		}
	});
}

//添加出差方法
function addTravelDays() {
	$('#travelForm').bootstrapValidator({
		fields : {
	        travel_days: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:2, message:"不能超过2位"},
					regexp:{regexp:/^[1-9]*[1-9][0-9]*$/,message:"只能填写整数且不能以0开头"}
			    }
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $(".operation_name").val();
		if ("travel" == operation) {
			$.ajax({
				type : 'PUT',
				url : "oa/hr/attendance/updateAttendance",
				data : $("#travelForm").serializeJson(),
			}).done(function(data) {
				console.log(data.flag);
				$('#travelModal').modal('hide');
				if (data.flag == true) {
					alert("修改成功!");
				} else {
					alert("修改失败！", "warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#travelForm").reset();
			});
		} else {
			confirm("未定义的操作" + operation);
		}
	});
}
var plan; 
function getOnLeaveName(index){
	//样式设置
	$("#onLeave_name").attr("disabled","disabled");
	$("#onLeave_name").css({"cursor":"not-allowed", "background":"none"});
	
	var row = $("#table").bootstrapTable("getData")[index];
	$(".operation_name").val("onLeave");
	$("#onLeaveForm input[name=leaveDays]").val(row.onLeave);
	getAttendanceDetail(row.id);
	plan = row.planAttendance;
}
function getOvertimeName(index){
	//样式设置
	$("#overtime_name").attr("disabled","disabled");
	$("#overtime_name").css({"cursor":"not-allowed", "background":"none"});
	
	var row = $("#table").bootstrapTable("getData")[index];
	$(".operation_name").val("overtime");
	$("#overtimeForm input[name=overtimeDays]").val(row.overtime);
	getAttendanceDetail(row.id);
}
function getTravelName(index){
	//样式设置
	$("#travel_name").attr("disabled","disabled");
	$("#travel_name").css({"cursor":"not-allowed", "background":"none"});
	
	var row = $("#table").bootstrapTable("getData")[index];
	$(".operation_name").val("travel");
	$("#travelForm input[name=travelDays]").val(row.travel);
	getAttendanceDetail(row.id);
}

function onleaveKeyup(val){
	var leaveDays = $("#onLeaveForm input[name=leaveDays]").val();
	console.log(plan);
	if(parseInt(val)>plan){
		alert("请假天数不能大于计划出勤天数！","warning");
		$("#onLeaveForm input[name=onLeave_days]").val(leaveDays);
	}
}

function overtimeKeyup(val){
	var overtimeDays = $("#overtimeForm input[name=overtimeDays]").val();
	if(parseInt(val)>31){
		alert("加班天数不能大于31天！","warning");
		console.log(overtimeDays);
		$("#overtimeForm input[name=overtime_days]").val(overtimeDays);
	}
}

function travelKeyup(val){
	var travelDays = $("#travelForm input[name=travelDays]").val();
	if(parseInt(val)>31){
		alert("出差天数不能大于31天！","warning");
		$("#travelForm input[name=travel_days]").val(travelDays);
	}
}

//根据id获取详情
function getAttendanceDetail(id) {
	$.ajax({
		url : 'oa/hr/attendance/getAttendance/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		if (null != data.attendance) {
			var attendance = data.attendance;
			setEidtPage(attendance);
		}
	}).fail(function() {
		alert('操作失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(attendance) {
	var operation = $(".operation_name").val();
    if("onLeave" == operation){
    	$("#onLeaveForm #id").val(attendance.id);
    	$("#onLeave_name").val(attendance.name);	
    	$("#onLeave_days").val(attendance.onLeave);
	}else if ("overtime" == operation){
		$("#overtimeForm #id").val(attendance.id);
    	$("#overtime_name").val(attendance.name);
    	$("#overtime_days").val(attendance.overtime);
	}else{
		$("#travelForm #id").val(attendance.id);
    	$("#travel_name").val(attendance.name);
    	$("#travel_days").val(attendance.travel);
	}
}

function operateFormatter(value, row, index) {
    return '<button class="fumigation-button" data-toggle="modal" data-target="#onLeaveModal" onclick="getOnLeaveName('+index+')">请假</button>'+
           '<button class="fumigation-button" data-toggle="modal" data-target="#overtimeModal" onclick="getOvertimeName('+index+')">加班</button>'+
           '<button class="fumigation-button" data-toggle="modal" data-target="#travelModal" onclick="getTravelName('+index+')">出差</button>';
}

//添加计划考勤天数方法
function addPlanAttendanceDays() {
	$('#insertPlanAttendanceDaysForm').bootstrapValidator({
		fields : {
			month: {
				validators: {
					notEmpty: {message: "不能为空"},
			    }
	        },
	        planAttendanceDays: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:2, message:"不能超过2位"},
					regexp:{regexp:/^([12][0-9]|30|[1-9])$/,message:"天数必须是正整数，且大于0，小于30"}
			    }                  
	        }
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
			$.ajax({
				type : 'POST',
				url : "oa/hr/attendance/insertPlanAttendanceDays",
				data : $("#insertPlanAttendanceDaysForm").serializeJson(),
			}).done(function(data) {
				$('#editModal').modal('hide');
				if (data.flag == true) {
					alert("添加计划考勤天数成功!");
				} else {
					alert("添加计划考勤天数失败！", "warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("添加计划考勤天数失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#insertPlanAttendanceDaysForm").reset();
			});
	});
}

//添加计划考勤月份验证
function monthPick(){
	$("#insertPlanAttendanceDaysForm").data('bootstrapValidator')
	.updateStatus('month', 'NOT_VALIDATED', null)
	.validateField('month');
}

//导入
function importExcel() {
	$('#inModal').bootstrapValidator({
		fields : {
			url : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var file = $.trim($("#file").val());
		var filepath = $("#filepath").val();
		$("#importantForm").ajaxSubmit({
	        url: "oa/hr/attendance/exportExcelInAttendance", //请求url 
			type:"POST",
			data:{'filepath':file},
	        success: function (data) { //提交成功的回调函数 
		        $('#inModal').modal('hide');
		        $("#importantForm").reset();
				alert("考勤记录导入成功!");
				$("button[type=submit]").removeAttr("disabled");
				$('#table').bootstrapTable('refresh');
		    },
			error: function (){
				$("button[type=submit]").removeAttr("disabled");
				$("#importantForm").reset();
				alert("导入的excel模板不正确!");
			}
		});
	});
}






