var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//列表查询（分页）
	tableInit();
	
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var name = $.trim($('#searchform #name').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #name').val(name);
		$table.bootstrapTable('refresh', {url : 'oa/materials/material/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	// 添加按钮
	$("#add").click(function() {
		$("#addModalLabel").html("添加设备信息");
		$("#operation").val("add");
		$('#addModal').modal('show');
	});
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
	// 编辑按钮
	$("#edit").click(function() {
		$("#addModalLabel").html("修改品种信息")
		var selections =  $table .bootstrapTable("getSelections");
		if (selections.length == 0) {
			alert("请选择要修改的记录!","warning");
			$("#dataForm").reset();
			return;
		}else if(selections.length > 1){
			alert("请选择一条要修改的记录!","warning");
			$("#dataForm").reset();
			return;
		}
		$("#operation").val("edit");
		$.each(selections, function(i, o) {
			getEquipmentDetail(o.id);
		})
	});
	// 删除
	$('#com_delete').click(function() {
		var selRow = $table.bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteEquipment);
		} else {
			alert("请选择要删除的记录!","warning");
		}
	})
	// 新增保存、编辑保存
	addOreditEquipment();
});
//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/material/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [ {
			title : '详情',
			field : 'detail',
			align : 'center',
			valign : 'middle',
			formatter : formatDetail,
			width : 100
		}, /*{
			title : '库点',
			field : 'groupName',
			align : 'center',
			valign : 'middle',
			width : 100
		},*/ {
			title : '物料器材名称',
			field : 'name',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '规格',
			field : 'specification',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '型号',
			field : 'model',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '编号',
			field : 'code',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '创建时间',
			field : 'createTime',
			align : 'center',
			valign : 'middle',
			width : 150
		}, {
			title : '状态',
			field : 'isLeisure',
			align : 'center',
			valign : 'middle',
			width : 150
		} ]
	});

};
//根据id获取详情
function getEquipmentDetail(id) {
	$.ajax({
		url : 'oa/materials/material/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.material) {
			var material = data.material;
			setEidtPage(material);
		}
	}).fail(function(err) {
		alert("物料器材信息获取失败!","warning");
	});
}
//组织编辑页面
function setEidtPage(material) {
	$("#dataForm #id").val(material.id);
	$("#dataForm #groupId").val(material.groupId);
	$("#dataForm #name").val(material.name);
	$("#dataForm #specification").val(material.specification);
	$("#dataForm #model").val(material.model);
	$("#dataForm #unit").val(material.unit);
	$('#addModal').modal('show');
}
//新增OR修改
function addOreditEquipment() {
	$('#dataForm').bootstrapValidator({
		fields : {
			groupId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
					}
				}
			},
			name : {
				validators : {
					notEmpty : {
						message: '名称不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message: '长度必须在1到32位之间'
	                 }
				}
			},specification : {
				validators : {
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message: '长度必须在1到32位之间'
	                 }
				}
			},model : {
				validators : {
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message: '长度必须在1到32位之间'
	                 }
				}
			},unit : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message: '长度必须在1到32位之间'
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
				url : "oa/materials/material",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert("添加成功");
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			$.ajax({
				type : 'PUT',
				url : "oa/materials/material",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert("修改成功");
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else {
			alert("未定义的操作!","warning");
			$("#dataForm").reset();
		}
	});
}
//根据Id删除一条信息
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'oa/materials/material/' + id,
		type : 'DELETE'
	}).done(function(data) {
		alert("删除成功!");
	}).fail(function(err) {
		alert("删除失败!","warning");
	}).always(function() {
		$table.bootstrapTable('refresh');
		$("#dataForm").reset();
	});
}

//获取设备类别信息
function updateCategory(categoryValue,type){
	var category=null;
	if(categoryValue!=null){
		category=categoryValue;
	}else{
		category=$("#catedory").val();
	}
	console.log(category);
	$.ajax({
		url : 'equipmentPurchase/category/'+category,
		type : 'GET'
	}).done(function(data) {
		$("#type").html("");
		$("#type").append("<option value=''>请选择</option>");
		$.each(data.type,function(index,items){
			$("#type").append("<option value='"+items.value+"'>"+items.name+"</option>");
		});
		$("#type").append();
		$("#type").val(type);
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
//获取设备类型信息
function updateType(obj){
	$.ajax({
		url : 'equipmentPurchase/name/'+$("#type").val(),
		type : 'GET'
	}).done(function(data) {
		$("#dataForm #name").html("");
		$("#dataForm #name").append("<option value=''>请选择</option>");
		$.each(data.name,function(index,items){
			$("#dataForm #name").append("<option value='"+items.id+"'>"+items.name+"</option>");
		});
		$("#dataForm #name").append();
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
//查看详情 点击
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}

//详情
function searchDetails(id){
	$("#detial").modal("show");
	var row = $("#table").bootstrapTable("getData")[id];
	$.each(row,function(index,value){
		var values = value==null?"":value;
		$("#detial span[id='"+index+"']").text(values);
		$("#detial span[id='"+index+"']").attr("title",values);
	});
	
}