var boxHeight, videoHeight, videoWidth, $table = $('#table'), $detial_table = $('#detial_table');
$(function() {
	
	// 初始化列表——方案
	initTable();
	
	// 添加&编辑方法——方案
	addOrEditPlan();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var name = $.trim($('#searchform #search_name').val());
		$('#searchform #search_name').val(name);
		$table.bootstrapTable('refresh', {url: "oa/check/plan/appraisalPlanList"});
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	// 添加按钮——方案
	$("#add").click(function() {
		$("#myModalLabel").html("添加方案");
		$("#operation").val("add");
		$("#form-group-templateId").show();//选择模板
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
	
	// 修改按钮——方案
	$("#edit").click(function() {
		var row = $("#table").bootstrapTable("getSelections");
		if (row.length == 0) {
			alert("请选择要修改的记录!","warning");
			return;
		}else if (row.length > 1) {
			alert("请选择一条要修改的记录!","warning");
			return;
		}else{
			$("#myModalLabel").html("修改方案");
			$("#operation").val("edit");
			updateDepartment(row[0].departmentId);//初始化人员option,然后给option赋值,ajax同步
			$.each(row, function(index, items) {
				getAppraisalPlanDetail(items.planId);
			})
		}
	});
	
	// 删除按钮——方案
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteAppraisalPlan);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
	
});  


//列表——方案
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/check/plan/appraisalPlanList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetail1
		},{
			title: "模板名称",
			field: "templateName",
			formatter: formatSubstring
		},{
			title: "方案名称",
			field: "name",
			formatter: formatSubstring
		},{
			title: "考核类型",
			field: "type"
		},{
			title: "开始时间",
			field: "startTime"
		},{
			title: "结束时间",
			field: "endTime"
		},{
			title: "负责人",
			field: "responsiblePersonName"
		},{
			title: "状态",
			field: "statusName"
		},{
			title: "备注",
			field: "remark",
			formatter: formatSubstring
		}]
	});
}

function formatDetail1(value,row,index){
	return '<a class="details" onclick="appraisalStaffDetail(\''+row.planId+'\')"><span class="eye"></span></a>';
}

function formatSubstring(value,row,index){
	if(value){
		if(value.length>=10){
			return "<div title='" + value + "'><span>" + value.substring(0,10) + "..." + "</span></div>";
			//return value.substring(0,15)+"...";
		}else{
			return value;
		}
	}else{
		return "";
	}
}

//查看详情1	
function appraisalStaffDetail(planId){
	$("#detial1Modal").modal("show");
	$("#detial1_table").bootstrapTable('destroy');
	
	// 初始化列表——考核指标
	detial1InitTable(planId);
	
}
//列表——方案详情
function detial1InitTable(planId){
	$("#detial1_table").bootstrapTable({
		url: "oa/check/plan/getAppraisalStaffDetailList?planId="+planId, // 后台请求的url
		toolbar : false,
		method : 'get', // 请求方式（*）
		height: 400,
		pagination : false, // 是否显示分页（*）
		columns: [{
			title: "详情",
			formatter: formatDetail2
		},{
			title: "考核人员",
			field: "staffName"
		}]
	});
}

function formatDetail2(value,row,index){
	return '<a class="details" onclick="checkItemDetail(\''+row.id+'\')"><span class="eye"></span></a>';
}

//查看详情2	
function checkItemDetail(id){
	$("#detial2Modal").modal("show");
	$("#detial2_table").bootstrapTable('destroy');
	
	// 初始化列表——考核指标
	detial2InitTable(id);
	
}

//列表——方案详情(考核人员)——考核人员详情(考核指标)
function detial2InitTable(id){
	$("#detial2_table").bootstrapTable({
		url: "oa/check/plan/getCheckItemDetailList?id="+id, // 后台请求的url
		toolbar : false,
		method : 'get', // 请求方式（*）
		pagination : false, // 是否显示分页（*）
		height: 400,
		columns: [{
			title: "指标项",
			field: "item"
		},{
			title: "权重",
			field: "weight"
		},{
			title: "满分",
			field: "point"
		}]
	});
}

//添加&编辑方法——方案
function addOrEditPlan() {
	$('#dataForm').bootstrapValidator({
		fields : {
			name : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			templateId : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			startTime : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			endTime : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			staffNames : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			departmentId : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			responsiblePerson : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			remark : {
				validators : {
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $("#operation").val();
		if ("add" == operation) {
				$.ajax({
					type : 'POST',
					url : "oa/check/plan/addAppraisalPlan",
					data : $("#dataForm").serializeJson(),
				}).done(function(data) {
					if (data.flag == true) {
						alert("添加成功!");
						$('#myModal').modal('hide');
					} else {
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
				console.log($("#dataForm").serializeJson());
				$.ajax({
					type : 'PUT',
					url : "oa/check/plan/updateAppraisalPlan",
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
function getAppraisalPlanDetail(planId) {
	$.ajax({
		url : 'oa/check/plan/checkAppraisalPlan/' + planId ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		if (null != data.appraisalPlan) {
			var appraisalPlan = data.appraisalPlan;
			setEidtPage(appraisalPlan);
		}
	}).fail(function() {
		alert('模板详情获取失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(appraisalPlan) {
	$("#id").val(appraisalPlan.planId);
	$("#name").val(appraisalPlan.name);
	$("#templateId").val(appraisalPlan.templateId);
	$("#check_type").val(appraisalPlan.type);
	$("#startTime").val(appraisalPlan.startTime);
	$("#endTime").val(appraisalPlan.endTime);
	$("#staffIds").val(appraisalPlan.staffIds);
	$("#staffNames").val(appraisalPlan.staffNames);
	$("#departmentId").val(appraisalPlan.departmentId);
	$("#responsiblePerson").val(appraisalPlan.responsiblePerson);
	$("#status").val(appraisalPlan.status);
	$("#remark").val(appraisalPlan.remark);
	$("#form-group-templateId").hide();//阻止修改模板
	$('#myModal').modal('show');
}

//通过部门选人员
function updateDepartment(departmentId){
	if(departmentId){
		var departmentId = departmentId;
	}else{
		var departmentId=$("#departmentId").val();
	}
	$.ajax({
		/*url : 'oa/check/plan/department/'+departmentId,*/
		url : 'common/department/'+departmentId,
		type : 'GET',
		async: false	
	}).done(function(data) {
		console.log(data);
		$("#responsiblePerson").html("");
		$("#responsiblePerson").append("<option value=''>请选择</option>");
		$.each(data.staff,function(index,items){
			$("#responsiblePerson").append("<option value='"+items.id+"'>"+items.realName+"</option>");
		});
		$("#responsiblePerson").append();
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}


//删除——方案
function deleteAppraisalPlan() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(index, items) {
		deleteAppraisalPlanById(items.planId);
	});
	// 提示成功
	$('#table').bootstrapTable('refresh');
	alert("删除成功!");
}

//删除——方案
function deleteAppraisalPlanById(planId) {
	if (planId == "") {
		return;
	}
	$.ajax({
		url : 'oa/check/plan/checkAppraisalPlan/' + planId,
		type : 'DELETE',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		$('#table').bootstrapTable('refresh');
		if (data.flag==2){
			alert("该方案已被评分绑定使用，无法删除!","warning");
		}
		if (!data.flag){
			alert("删除失败!","warning");
		}
	}).fail(function() {
		alert("删除失败!","warning");
	}).always(function() {
		$table.bootstrapTable('refresh');
	});
}

//添加培训开始时间验证
function startTimePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('startTime', 'NOT_VALIDATED', null)
	.validateField('startTime');
}

//添加培训结束时间验证
function endTimePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('endTime', 'NOT_VALIDATED', null)
	.validateField('endTime');
}

//取消添加人员插件在添加了人的情况下，“不能为空”的非空验证提示语(不加提示语还在)
function staffPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('staffNames', 'NOT_VALIDATED', null)
	.validateField('staffNames');
}

function initTree() {
	$("#staffIds").staffTreeView({title: "选择考核人员",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
		}
			$("#staffIds").val(ids.substring(0,ids.length-1));
			$("#staffNames").val(names.substring(0,names.length-1));
			staffPick();
		}
	});
}
//选择考核人员
function show() {
	if($("#operation").val() == "add"){
		$("#staffIds").staffTreeView("setVal",[]);
	}
	if($("#staffIds").val()!="" && $("#staffIds").val()!=null){
		var staffIds = $("#staffIds").val().split(",");
		staffIds.splice(staffIds.length-1,staffIds.length-1);
		$("#staffIds").staffTreeView("setVal",staffIds);
	}
	$("#staffIds").staffTreeView("show");
}


