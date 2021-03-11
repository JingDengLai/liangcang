var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//初始化列表
	initTable();
	
	// 添加&编辑方法
	addOrEditSalary();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$table.bootstrapTable('refresh', {url: "oa/hr/salary/salaryList"});
		//$("#table").bootstrapTable("refresh");
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	// 添加按钮
	$("#add").click(function() {
		$("#myModalLabel").html("添加");
		$("#operation").val("add");
		$('#myModal').modal('show');
	});	
	
	//添加人员插件
	initTree();
	
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
			$("#myModalLabel").html("修改");
			$("#operation").val("edit");
			$.each(row, function(index, items) {
				getSalaryDetail(items.salaryId);
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
		url: "oa/hr/salary/salaryList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
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
			title: "绩效工资(元)",
			field: "performanceSalary"
		},{
			title: "其他福利(元)",
			field: "welfare"
		},{
			title: "个人保险(元)",
			field: "insurance"
		},{
			title: "个人公积金(元)",
			field: "housingFund"
		},{
			title: "交通补助(元)",
			field: "trafficAllowance"
		},{
			title: "创建时间",
			field: "createTime"
		},{
			title: "修改时间",
			field: "updateTime"
		}]
	});
}

function addOrEditSalary() {
	$('#dataForm').bootstrapValidator({
		fields : {
			staffName : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			basicSalary: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			positionSalary: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:8, message:"不能超过8个字符"},
					regexp:{regexp:/^\d{1,5}(?:\.\d{1,2})?$/,message:"只能填写数字,小数点最多前5位后2位"}
				}
			},
			performanceSalary: {
				validators: {
					notEmpty: {message: "不能为空"},
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
					url : "oa/hr/salary/addSalary",
					data : $("#dataForm").serializeJson(),
				}).done(function(data) {
					if (data.flag == true) {
						alert("添加成功!");
						$('#myModal').modal('hide');
					}else if(data.flag == 2){
						alert("该人员薪酬记录已存在，不可重复添加！","warning");
						$("#myModal").modal('hide');
					}else {
						alert("添加失败！","warning");
						$("#myModal").modal('hide');
					}
					$('#table').bootstrapTable('refresh');
				}).fail(function(err) {
					alert("添加失败!", "warning");
					$("#myModal").modal('hide');
				}).always(function() {
					$('#table').bootstrapTable('refresh');
					$("#dataForm").reset();

				});
			} else if ("edit" == operation) {
				$.ajax({
					type : 'PUT',
					url : "oa/hr/salary/updateSalary",
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
					$("#myModal").hide();
				});
			} else {
				confirm("未定义的操作" + operation);
				$("#myModal").modal('hide');
			}
	});
}
//根据id获取详情
function getSalaryDetail(id) {
	$.ajax({
		url : 'oa/hr/salary/hrSalary/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(salary) {
		//alert(111);
		if (null != salary) {
			setEidtPage(salary);
		}
	}).fail(function() {
		alert('薪酬记录获取失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(salary) {
	$("#dataForm #salaryId").val(salary.salaryId);
	$("#staffId").val(salary.staffId);
	$("#staffName").val(salary.staffName);
	$("#basicSalary").val(salary.basicSalary);
	$("#positionSalary").val(salary.positionSalary);
	$("#performanceSalary").val(salary.performanceSalary);
	$("#welfare").val(salary.welfare);
	$("#insurance").val(salary.insurance);
	$("#housingFund").val(salary.housingFund);
	$("#trafficAllowance").val(salary.trafficAllowance);
	$('#myModal').modal('show');
}

//删除
function deleteSalary() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(i, o) {
		deleteById(o.salaryId);
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
		url : 'oa/hr/salary/hrSalary/' + id,
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
//设置详情页面
function editDetail(id){
	var eid = id;
	$.ajax({
		url : 'oa/hr/salary/hrTrain/'+id,
		type : 'GET',
		timeout : 10000,
		cache : false
	}).done(function(data) {
		if (null != data.trainingVo) {
			var trainingVo = data.trainingVo;
			setDetailPage(trainingVo);
		}
	}).fail(function() {
		alert('客户信息获取失败!',"warning");
	});
}
function setDetailPage(trainingVo){
	$("#name_detali").text(customer.name);
	$("#level_detali").text(customer.level);
	$("#accountBank_detali").text(customer.accountBank);
	$("#accountNo_detali").text(customer.accountNo);
	$("#accountName_detali").text(customer.accountName);
	$("#legalPerson_detali").text(customer.legalPerson);
	$("#contactPhone_detali").text(customer.contactPhone);
	$("#contactPerson_detali").text(customer.contactPerson);
	$("#address_detali").text(customer.address);
	$("#postcode_detali").text(customer.postcode);
	$("#remark_detali").text(customer.remark);
}

//取消添加人员插件在添加了人的情况下，“不能为空”的非空验证提示语(不加提示语还在)
function staffPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('staffName', 'NOT_VALIDATED', null)
	.validateField('staffName');
}

function initTree() {
	$("#staffId").staffTreeView({title: "选择人员",multiSelect:false,
		onSave:function(data){
			$("#staffId").val(data[0].id);
			$("#staffName").val(data[0].name);
			staffPick();
		}
	});
}
//选择人员
function show() {
	if($("#operation").val() == "add"){
		$("#staffId").staffTreeView("setVal",[]);
	}
	if($("#staffId").val()!="" && $("#staffId").val()!=null){
		var staffId = $("#staffId").val().split(",");
		$("#staffId").staffTreeView("setVal",staffId);
	}
	$("#staffId").staffTreeView("show");
}
