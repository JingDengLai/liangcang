var boxHeight, videoHeight, videoWidth, $table = $('#table'), $detial_table = $('#detial_table');
$(function() {
	
	// 初始化列表——模板
	initTable();
	
	// 添加&编辑方法——模板
	addOrEditTemplate();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var name = $.trim($('#searchform #search_name').val());
		$('#searchform #search_name').val(name);
		$table.bootstrapTable('refresh', {url: "oa/check/template/templateList"});
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	// 添加按钮——模板
	$("#add").click(function() {
		$("#myModalLabel").html("添加模板");
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
			$("#myModalLabel").html("修改模板");
			$("#operation").val("edit");
			$.each(row, function(index, items) {
				getTemplateDetail(items.templateId);
			})
		}
	});
	
	// 删除按钮——模板
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteTemplate);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
	
	
	// 添加&编辑方法——考核指标
	addTemplateItem();
	
});  


//列表——模板
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/check/template/templateList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "考核项设置",
			formatter: formatDetail
		},{
			title: "模板名称",
			field: "name"
		},{
			title: "操作时间",
			field: "operationTime"
		},{
			title: "操作人员",
			field: "operatorName"
		},{
			title: "备注",
			field: "remark"
		}]
	});
}

function formatDetail(val, row) {                           
	return '<a class="details" onclick="templateItemDetail(\''+row.templateId+'\')"><img src="images/pointup.png"/></a>';
}

//查看详情	
function templateItemDetail(templateId){
	//消除表单非空验证...
	$('#addDetialModal').on('hide.bs.modal', function() {
		$("#addDetialModal form").each(function() {
			$(this).reset();
		});
	})
	$("#detialModal").modal("show");
	$("#detial_table").bootstrapTable('destroy');
	
	// 初始化列表——考核指标
	detialInitTable(templateId);
	
	//详情表单按钮样式
	$(".table-other .toolbar .sms-btn-group").css({"display":"none"});
    $(".table-other .fixed-table-toolbar").css({"background":"#f7f7f7"});
    
    // 添加按钮——考核指标
	$("#detial_add").click(function() {
		$("#detialForm").reset();
		$('#addDetialModal').modal('show');
	});	
	
	// 删除按钮——考核指标
	$('#detial_delete').click(function() {
		var selRow = $("#detial_table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteTemplateItem);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
	
	//获取考核指标列表中模板Id(templateId)
	$("#templateId").val(templateId);
	
}

//详情—列表
function detialInitTable(templateId){
	$('#detial_table').bootstrapTable({
		url: "oa/check/template/getTemplateDetailList?templateId="+templateId, // 后台请求的url
		toolbar : '#toolbar1',
		method : 'get', // 请求方式（*）
		height: 400,
		pagination : false, // 是否显示分页（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "指标项",
			field: "item"
		},{
			title: "权重",
			field: "weight"
		},{
			title: "总分",
			field: "point"
		}]
	});
}

//添加&编辑方法——模板
function addOrEditTemplate() {
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
					url : "oa/check/template/addTemplate",
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
				$.ajax({
					type : 'PUT',
					url : "oa/check/template/updateTemplate",
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
function getTemplateDetail(templateId) {
	console.log(templateId);
	$.ajax({
		url : 'oa/check/template/templateDetail/' + templateId ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		if (null != data.appraisalTemplate) {
			var appraisalTemplate = data.appraisalTemplate;
			setEidtPage(appraisalTemplate);
		}
	}).fail(function() {
		alert('模板详情获取失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(appraisalTemplate) {
	$("#dataForm #id").val(appraisalTemplate.templateId);
	$("#name").val(appraisalTemplate.name);
	$("#remark").val(appraisalTemplate.remark);
	$('#myModal').modal('show');
}

//删除——模板
function deleteTemplate() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(index, items) {
		deleteById(items.templateId);
	});
	// 提示成功
	//$('#table').bootstrapTable('refresh');
	//alert("删除成功!");
}

//删除——模板
function deleteById(templateId) {
	if (templateId == "") {
		return;
	}
	$.ajax({
		url : 'oa/check/template/checkTemplate/' + templateId,
		type : 'DELETE',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		console.log(data);
		
		if(data.flag == true){
			alert("删除成功!");
			$('#table').bootstrapTable('refresh');
		}else if(data.flag==2){
    		alert("模板已被方案绑定使用，无法删除!","warning");
    	}else{
    		alert("删除失败!","warning");
    	}
	}).fail(function() {
		alert("删除失败!","warning");
	}).always(function() {
		$('#table').bootstrapTable('refresh');
		$("#dataForm").reset();
	});
}



//添加&编辑方法——考核指标
function addTemplateItem() {
	$('#detialForm').bootstrapValidator({
		fields: {
			item: {
				validators: {
					notEmpty: {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			weight: {
				validators: {
					notEmpty: {
						message: "不能为空"
					},
					stringLength: {
						max:2,
						message:"不能超过2位"
					},
					regexp:{
						regexp:/^[0-9]*[1-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			},
			point: {
				validators: {
					notEmpty: {
						message: "不能为空"
					},
					stringLength: {
						max:2,
						message:"不能超过2位"
					},
					regexp:{
						regexp:/^[0-9]*[1-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $("#detialForm").serializeObject();
		data.templateId = $("#templateId").val();
		console.log("测试："+data.templateId);
			$.ajax({
				type : 'POST',
				url : "oa/check/template/addTemplateItem",// 后台请求的url
				data : JSON.stringify(data),
			}).done(function(data) {
				if (data.flag == true) {
					alert("添加成功!");
					$('#addDetialModal').modal('hide');
				}else if(data.flag == 2){
					alert("考核指标项重复，请重新添加！","warning");
				}else {
					alert("添加失败！","warning");
				}
				$('#detial_table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("添加失败!", "warning");
			}).always(function() {
				$('#detial_table').bootstrapTable('refresh');
				$("#detialForm").reset();

			});
	});
}

//删除——考核指标
function deleteTemplateItem() {
	var selections = $("#detial_table").bootstrapTable("getSelections");
	$.each(selections, function(index, items) {
		deleteTemplateItemById(items.id);
	});
	// 提示成功
	$('#detial_table').bootstrapTable('refresh');
	alert("删除成功!");
}

//删除——考核指标
function deleteTemplateItemById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'oa/check/template/deleteTemplateItem/' + id,
		type : 'DELETE',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		$('#detial_table').bootstrapTable('refresh');
		if (data.flag=false)
			alert("删除失败!","warning");
		return;

	}).fail(function() {
		alert("删除失败!","warning");
		return;
	});
}





