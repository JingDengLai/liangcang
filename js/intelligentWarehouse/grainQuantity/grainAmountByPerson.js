var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	tableInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var warehouseId = $.trim($('#searchform #warehouseId').val());
		var beginTime = $.trim($('#searchform #beginTime').val());
		var endTime = $.trim($('#searchform #endTime').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #warehouseId').val(warehouseId);
		$('#searchform #beginTime').val(beginTime);
		$('#searchform #endTime').val(endTime);
		$table.bootstrapTable('refresh', {url : 'grainQuantity/grainAmountByPerson/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	// 添加按钮
	$("#add").click(function() {
		$("#inWidthDiv").show();
		$("#inLenthDiv").show();
		$("#circularDiameterDiv").hide();
		$("#addModalLabel").html("添加人工采集");
		$("#operation").val("add");
		$("#ratio").val("1");
		getWareHouse();
		$('#addModal').modal('show');
		$("#densityDiv").show();
	});
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
	
	// 编辑按钮
	$("#edit").click(function() {
		$("#operation").val("edit");
		$("#densityDiv").hide();
		$("#addModalLabel").html("修改人共采集")
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
		$.each(selections, function(i, o) {
			getGrainByPersonDetail(o.quantityId);
		})
	});
	// 删除
	$('#com_delete').click(function() {
		var selRow = $table.bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteGrianByPerson);
		} else {
			alert("请选择要删除的记录!","warning");
		}
	})
	addOreditGrianByPerson();
	
});

//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'grainQuantity/grainAmountByPerson/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [ {
			title : '全部',
			field : 'checkAll',
			align : 'center',
			valign : 'middle',
			checkbox : true
		}, {
			title : '详情',
			field : 'detail',
			align : 'center',
			valign : 'middle',
			formatter : formatDetail,
			width : 100
		}, {
			title : '仓间号',
			field : 'warehouseName',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '监测时间',
			field : 'monitorTime',
			align : 'center',
			valign : 'middle',
			width : 200
		}, {
			title : '粮堆长',
			field : 'inLenth',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮堆宽',
			field : 'inWidth',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮堆高',
			field : 'grainHeight',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '测量体积(m³)',
			field : 'volume',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '扣除体积（m³）',
			field : 'deductVolume',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '实际体积（m³）',
			field : 'actualVolume',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '粮食容重(g/l)',
			field : 'volumeWeight',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '校正后修正系数',
			field : 'ratio',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '入仓方式',
			field : 'transportWay',
			align : 'center',
			valign : 'middle',
			width : 100
		}, {
			title : '储存方式',
			field : 'storageMethod',
			align : 'center',
			valign : 'middle',
			width : 100
		}]
	});

};
//新增OR修改
function addOreditGrianByPerson() {
	$('#dataForm').bootstrapValidator({
		fields : {
			groupId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
					}
				}
			},
			warehouseId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
	                 }
				}
			},
			grainHeight : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 12,
	                     message:"不能超过12个字符"
	                 },
	                regexp:{
						regexp:/^\d+(\.\d{1,2})?$/,
						message:"只能填写数字，小数点后不能超过2位"
					}
				}
			},
			deductVolume : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 12,
	                     message:"不能超过12个字符"
	                 },
	                 regexp:{
							regexp:/^\d+(\.\d{1,2})?$/,
							message:"只能填写数字，小数点后不能超过2位"
						}
				}
			},
			volumeWeight : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			ratio : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 12,
	                     message:"不能超过12个字符"
	                 },
	                 regexp:{
							regexp:/^\d+(\.\d{1,2})?$/,
							message:"只能填写数字，小数点后不能超过2位"
						}
				}
			},
			transportWay : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			storageMethod : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			monitorTime : {
				validators : {
					notEmpty : {
						message: '不能为空'
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
				url : "grainQuantity/grainAmountByPerson/add",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				if(data){
					if(data.flag == true){
						alert("添加成功！");
					}else{
						alert("添加失败！","warning");
					}
				}
				$('#addModal').modal('hide');
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			
			$.ajax({
				type : 'PUT',
				url : "grainQuantity/grainAmountByPerson/update",
				data :$('#dataForm').serializeJson()
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
//根据仓间id获取仓间信息
function getWareHouse(){
	var warehouseId = $("#addModal #warehouseId").val();
	$.ajax({
		url : 'grainQuantity/grainAmountByPerson/warehouseId',
		type : 'GET',
		data:{groupId: $("#addModal #groupId").val(),warehouseId: $("#addModal #warehouseId").val()},
	}).done(function(data) {
		$("#deductVolume").val("");
		$("#ratio").val("1");
		$("#density").val("");
		$("#grainHeight").val("");
		$("#volume").val("");
		$("#actualVolume").val("");
		if(data.wareHouse.type==1){
			$("#inWidthDiv").show();
			$("#inLenthDiv").show();
			$("#circularDiameterDiv").hide();
			$("#circularHeightDiv").hide();
			$("#inWidth").val(data.wareHouse.width);
			$("#inLenth").val(data.wareHouse.length);
		}else if(data.wareHouse.type==2){
			$("#inWidthDiv").hide();
			$("#inLenthDiv").hide();
			$("#circularDiameterDiv").show();
			$("#circularHeightDiv").show();
			$("#circularDiameter").val(data.wareHouse.circularDiameter);
			$("#circularHeight").val(data.wareHouse.circularHeight);
		}
		$("#volumeWeight").val(data.actualVolumeWeigh);
		volumeWeightPick();
		if(data.actualVolumeWeigh==null){
			alert("此仓没有仓间检验记录","warning")
		}
		calculateDensity();
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
//查看详情点击时间
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}

//根据id获取详情
function getGrainByPersonDetail(id) {
	$.ajax({
		url : 'grainQuantity/grainAmountByPerson/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.grainQuantityRecord) {
			var grainQuantityRecord = data.grainQuantityRecord;
			setEidtPage(grainQuantityRecord);
		}
	}).fail(function(err) {
		alert("物料器材信息获取失败!","warning");
	});
}

//组织编辑页面
function setEidtPage(grainQuantityRecord) {
	$.each(grainQuantityRecord,function(index,value){
		var values = value==null?"":value;
		$('#dataForm #'+index).val(values);
	});
	$('#addModal').modal('show');
}

//删除
function deleteGrianByPerson() {
	var selections = $("#table").bootstrapTable("getSelections");
    $.each(selections,function(i,o){
        deleteById(o.quantityId);
    });
	// 提示成功
    $table.bootstrapTable('refresh', {url : 'grainQuantity/grainAmountByPerson/list'});
	alert("删除成功!");
	$("#dataForm").reset();
}
//根据Id删除单条
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'grainQuantity/grainAmountByPerson/' + id,
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

//详情
function searchDetails(id){
	var row = $("#table").bootstrapTable("getData")[id];
	$.ajax({
		type: 'get',
		url : "grainQuantity/grainAmountByHistory/detail/grainAmount?groupId="+row.groupId+"&warehouseId="+row.warehouseId+"&id="+row.quantityId,
	}).done(function(data) {
		$.each(data,function(index,value){
			var values = value==null?"":value;
			$("#detial #"+index).html(values);
			$("#detial #"+index).attr("title",values);
		});
		$("#detial").modal("show");
	}).fail(function(err) {
	});
}

//打印
function printInit(){
	var selections =  $table .bootstrapTable("getSelections");
	if (selections.length == 0) {
		alert("请选择要导出的记录!","warning");
		$("#dataForm").reset();
		return;
	}else if(selections.length > 1){
		alert("请选择一条要导出的记录!","warning");
		$("#dataForm").reset();
		return;
	}
	$.each(selections, function(i, row) {
		window.open ("grainQuantity/grainAmountByPerson/print/grainAmount?groupId="+row.groupId+"&warehouseId="+row.warehouseId+"&id="+row.quantityId);
	})
		
}


//计算测量体积
function calculateVolume(){
	var inLenth = $("#inLenth").val();
	var inWidth = $("#inWidth").val();
	var circularDiameter = $("#circularDiameter").val();
	var grainHeight = $("#grainHeight").val();
	if( $("#circularDiameterDiv").css("display")=='none' ) {
		$("#volume").val(Math.round(grainHeight*inLenth*inWidth*100/100));
	}else{
		$("#volume").val(Math.round(grainHeight*3.14*(circularDiameter/2)*(circularDiameter/2)*100/100));
	}
	
}


//计算密度
function calculateDensity(){
	var ratio = $("#ratio").val();
	var volumeWeight = $("#volumeWeight").val();
	$("#density").val(Math.round(ratio*volumeWeight*100/100));
}
//计算实际体积
function calculateDeductVolume(){
	var volume = $("#volume").val();
	var deductVolume = $("#deductVolume").val();
	$("#actualVolume").val(volume-deductVolume);
}

//申请时间验证
function applyTimeDatePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('monitorTime', 'NOT_VALIDATED', null)
	.validateField('monitorTime');
}

function volumeWeightPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('volumeWeight', 'NOT_VALIDATED', null)
	.validateField('volumeWeight');
}