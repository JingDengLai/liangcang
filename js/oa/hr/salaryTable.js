var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//初始化列表
	initTable();
	
	// 添加&编辑方法
	addOrEditSalaryTable();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$table.bootstrapTable('refresh', {url: "oa/hr/salaryTable/salaryTableList"});
		//$("#table").bootstrapTable("refresh");
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	// 添加按钮
	$("#add").click(function() {
		//样式设置
		$("#basicSalary").attr("readonly","readonly");
		$("#basicSalary").css({"cursor":"not-allowed", "background":"none"});
		$("#positionSalary").attr("readonly","readonly");
		$("#positionSalary").css({"cursor":"not-allowed", "background":"none"});
		
		$("#myModalLabel").html("添加");
		$("#operation").val("add");
		$('#myModal').modal('show');
	});	
	//表单非空验证...
	$('#myModal').on('hide.bs.modal', function() {
		$("#myModal form").each(function() {
			$(this).reset();
		});
	})
	
	// 修改按钮
	$("#edit").click(function() {
		var row = $("#table").bootstrapTable("getSelections");
		if (row.length == 0) {
			alert("请选择要修改的记录!","warning");
			return;
		}else if (row.length > 1) {
			alert("请选择一条要修改的记录!","warning");
			return;
		}else{
			//样式设置
			$("#basicSalary").attr("readonly","readonly");
			$("#basicSalary").css({"cursor":"not-allowed", "background":"none"});
			$("#positionSalary").attr("readonly","readonly");
			$("#positionSalary").css({"cursor":"not-allowed", "background":"none"});
			
			$("#myModalLabel").html("修改");
			$("#operation").val("edit");
			$.each(row, function(index, items) {
				getSalaryTableDetail(items.id);
			})
		}
	});
	
	// 删除按钮
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteSalary);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
	
});   

//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/hr/salaryTable/salaryTableList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetail
		},{
			title: "工资月份",
			field: "month"
		},{
			title: "姓名",
			field: "staffName"
		},{
			title: "基本工资(元)",
			field: "basicSalary"
		},{
			title: "岗位工资(元)",
			field: "positionSalary"
		},{
			title: "应发工资(元)",
			field: "grossSalary"
		},{
			title: "税前工资(元)",
			field: "preTexSalary"
		},{
			title: "应缴纳税额(元)",
			field: "tex"
		},{
			title: "交通补助(元)",
			field: "trafficAllowance"
		},{
			title: "满勤奖(元)",
			field: "participationBonus"
		},{
			title: "考勤扣款(元)",
			field: "attendanceDeduct"
		},{
			title: "绩效奖金(元)",
			field: "performanceBonus"
		},{
			title: "实发工资(元)",
			field: "actualSalary"
		},{
			title: "创建时间",
			field: "createTime"
		},{
			title: "修改时间",
			field: "updateTime"
		}]
	});
}

function addOrEditSalaryTable() {
	$('#dataForm').bootstrapValidator({
		fields : {
			staffName : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			month: {
				validators: {
					notEmpty: {message: "不能为空"},
				}
			},
			performanceSalary: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
					
				}
			},
			participationBonus: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			grossSalary: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			preTexSalary: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			tex: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			attendanceDeduct: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			performanceBonus: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			actualSalary: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			welfare: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			insurance: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			housingFund: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			trafficAllowance: {
				validators: {
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $("#operation").val();
		if ("add" == operation) {
			$.ajax({
				type : 'POST',
				url : "oa/hr/salaryTable/addSalaryTable",
				data : $("#dataForm").serializeJson()
			}).done(function(data) {
				if (data.flag == true) {
					alert("添加成功!");
					$('#myModal').modal('hide');
				}else if(data.flag == 2){
					alert("该人员本月工资记录已存在!", "warning");
					$('#myModal').modal('hide');
				}else {
					alert("添加失败！","warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("添加失败!", "warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#dataForm").reset();

			});
		} else if ("edit" == operation) {
			$.ajax({
				type : 'PUT',
				url : "oa/hr/salaryTable/updateSalaryHistory",
				data : $("#dataForm").serializeJson(),
			}).done(function(data) {
				$('#myModal').modal('hide');
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
				$("#dataForm").reset();

			});
		} else {
			confirm("未定义的操作" + operation);
		}
	});
}
//根据id获取详情
function getSalaryTableDetail(id) {
	$.ajax({
		url : 'oa/hr/salaryTable/hrSalaryHistory/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(SalaryHistory) {
		console.log(SalaryHistory);
		if (null != SalaryHistory) {
			setEidtPage(SalaryHistory);
		}
	}).fail(function() {
		alert('工资表记录获取失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(SalaryHistory) {
	$("#dataForm #id").val(SalaryHistory.id);
	$("#salaryId").val(SalaryHistory.salaryId);
	$("#staffId").val(SalaryHistory.staffId);
	$("#staffName").val(SalaryHistory.salaryId);
	$("#basicSalary").val(SalaryHistory.basicSalary);
	$("#positionSalary").val(SalaryHistory.positionSalary);
	$("#performanceSalary").val(SalaryHistory.performanceSalary);
	$("#welfare").val(SalaryHistory.welfare);
	$("#insurance").val(SalaryHistory.insurance);
	$("#housingFund").val(SalaryHistory.housingFund);
	$("#grossSalary").val(SalaryHistory.grossSalary);
	$("#preTexSalary").val(SalaryHistory.preTexSalary);
	$("#tex").val(SalaryHistory.tex);
	$("#trafficAllowance").val(SalaryHistory.trafficAllowance);
	$("#participationBonus").val(SalaryHistory.participationBonus);
	$("#attendanceDeduct").val(SalaryHistory.attendanceDeduct);
	$("#performanceBonus").val(SalaryHistory.performanceBonus);
	$("#actualSalary").val(SalaryHistory.actualSalary);
	$("#month").val(SalaryHistory.month);
	$('#myModal').modal('show');
}
/*
//初始化表单
function resetTrainForm() {
	$("#dataForm").reset();
	$("#dataForm").data('bootstrapValidator').resetForm();

}*/
//删除
function deleteSalary() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(i, o) {
		deleteById(o.id);
	});
	// 提示成功
	$('#table').bootstrapTable('refresh');
	alert("删除成功!");
}
//删除
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'oa/hr/salaryTable/hrSalaryHistory/' + id,
		type : 'DELETE',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		$('#table').bootstrapTable('refresh');
		if (data.flag=false)
			alert("删除失败!","warning");
		return;

	}).fail(function() {
		alert("删除失败!","warning");
		return;
	});
}


function formatDetail(value,row,index){
	return '<a class="details"  onclick="getSalaryHistoryDetail(\''+row.id+'\')"><span class="eye"></span></a>';
}

function getSalaryHistoryDetail(id){
	$.ajax({
		url : 'oa/hr/salaryTable/hrSalaryHistory/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(SalaryHistory) {
		if (null != SalaryHistory) {
			detialsPage(SalaryHistory);
		}
	}).fail(function() {
		alert('工资表记录获取失败!',"warning");
	});
}
//编辑页面控制
function detialsPage(SalaryHistory) {
	$("#staffName_detali").text(SalaryHistory.staffName);
	$("#basicSalary_detali").text(SalaryHistory.basicSalary);
	$("#positionSalary_detali").text(SalaryHistory.positionSalary);
	$("#performanceSalary_detali").text(SalaryHistory.performanceSalary);
	$("#welfare_detali").text(SalaryHistory.welfare);
	$("#insurance_detali").text(SalaryHistory.insurance);
	$("#housingFund_detali").text(SalaryHistory.housingFund);
	$("#grossSalary_detali").text(SalaryHistory.grossSalary);
	$("#preTexSalary_detali").text(SalaryHistory.preTexSalary);
	$("#tex_detali").text(SalaryHistory.tex);
	$("#trafficAllowance_detali").text(SalaryHistory.trafficAllowance);
	$("#participationBonus_detali").text(SalaryHistory.participationBonus);
	$("#attendanceDeduct_detali").text(SalaryHistory.attendanceDeduct);
	$("#performanceBonus_detali").text(SalaryHistory.performanceBonus);
	$("#actualSalary_detali").text(SalaryHistory.actualSalary);
	$("#month_detali").text(SalaryHistory.month);
	$("#createTime_detali").text(SalaryHistory.createTime);
	$("#updateTime_detali").text(SalaryHistory.updateTime==null?"":SalaryHistory.updateTime);
	$('#detial').modal('show');
}


//通过选取人名活的薪酬数据
function getParam(id){
	$.ajax({
		url : 'oa/hr/salary/hrSalary/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(salary) {
		if (null != salary) {
			getParamPage(salary);
		}
		performanceSalaryPick();
	}).fail(function() {
		alert('工资表记录获取异常，请重新选择!',"warning");
	});
}

function getParamPage(salary){
	$("#salaryId").val(salary.salaryId);
	$("#staffId").val(salary.staffId);
	$("#staffNumber").val(salary.staffNumber);
	$("#basicSalary").val(salary.basicSalary);
	$("#positionSalary").val(salary.positionSalary);
	$("#performanceSalary").val(salary.performanceSalary);
	$("#welfare").val(salary.welfare);
	$("#insurance").val(salary.insurance);
	$("#housingFund").val(salary.housingFund);
	$("#trafficAllowance").val(salary.trafficAllowance);
}

//添加工资验证月份
function monthTimePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('month', 'NOT_VALIDATED', null)
	.validateField('month');
}
function performanceSalaryPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('performanceSalary', 'NOT_VALIDATED', null)
	.validateField('performanceSalary');
}

