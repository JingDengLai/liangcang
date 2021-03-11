var boxHeight, videoHeight, videoWidth, $table = $('#table');

$(function() {
	initTable();
	 $(".content-wrapper").mCustomScrollbar();
	 addOreditPest() ;
	 $('#myModal').on('hide.bs.modal', function() {
			$("#myModal form").each(function() {
				$(this).reset();
			});
		})
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
		url: "pest/collect/pestHistoryPages",
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			checkbox: true
		},{
			title: "仓间号",
			field: "warehouseCode"
		},{
			title: "测量时间",
			field: "measureTime"
		}, {
			title: "虫害数量",
			field: "pestCount"
		},{
			title: "采集人",
			field: "measurePerson"
		}]
	});
}

//添加按钮
$("#add").click(function() {
	$("#myModalLabel").html("虫害数量添加");
	resetPestForm();
	$("#operation").val("add");
	$('#myModal').modal('show');
});


//初始化表单
function resetPestForm() {
	$("#updateform").reset();
	$("#updateform").data('bootstrapValidator').resetForm();
}

//编辑按钮
$("#edit").click(function() {
	var selRow = $table.bootstrapTable('getSelections');
	if (selRow.length == 0) {
		alert("请选择要修改的记录!","warning");
		return;
	}else if (selRow.length > 1) {
		alert("请选择一条要修改的记录!","warning");
		return;
	}else{
		$("#myModalLabel").html("虫害修改");
		$("#operation").val("edit");
		$.each(selRow, function(i, o) {
			getPestDetail(o.pestId);
		})
	}
	
});

//根据id获取详情
function getPestDetail(id) {
	$.ajax({
		url : 'pest/collect/getPestById/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.pestPersonRecord) {
			var pestPersonRecord = data.pestPersonRecord;
			console.log(pestPersonRecord);
			$.each(pestPersonRecord,function(index,value){
				var values = value==null?"":value;
				$('#updateform #'+index).val(values);
			});
			$('#myModal').modal('show');
		}
	}).fail(function(err) {
		alert("虫害信息获取失败!","warning");
	});
}


// 删除
$('#com_delete').click(function() {
	var selRow = $("#table").bootstrapTable('getSelections');
	if (selRow.length > 0) {
		confirm("是否确认删除？", deleteVehicle);
	} else {
		alert("请选择要删除的数据","warning");
	}
})

//删除
function deleteVehicle() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(i, o) {
		deleteById(o.pestId);
	});
	// 提示成功
	$('#table').bootstrapTable('refresh');
//	alert("删除成功!");
}
//删除
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'pest/collect/del/' + id,
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



var form = $('#updateform');
function addOreditPest() {
	form.bootstrapValidator({
		fields : {
			groupId : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			warehouseId : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			pestCount : {
				validators : {
					notEmpty : {message: '不能为空'},
					stringLength:{max:8,message:"长度不能超过8个字符"},
					regexp:{
						regexp:/^[0-9]*[1-9][0-9]*$/,
						message:"请输入数字"
					}
				}
			},
			measureTime : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
		}
	});
}
$("#submitBtn").click(function() {
	//addOreditPest();
	// 进行表单验证
	var bv = form.data('bootstrapValidator');
	bv.validate();
	if (bv.isValid()) {
		var operation = $("#operation").val();
		if ("add" == operation) {
			$.ajax({
				type : 'POST',
				url : "pest/collect/add",
				data : form.serializeJson()
			}).done(function(data) {
				if (data.flag == true) {
					$('#myModal').modal('hide');
					alert("添加成功!", resetPestForm);
				} else {
					alert("添加失败！","warning", resetPestForm);
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("添加失败!", "warning",resetPestForm);
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#updateform").reset();

			});
		} else if ("edit" == operation) {
			$.ajax({
				type : 'PUT',
				url : "pest/collect/edit",
				data : form.serializeJson()
			}).done(function(data) {
				$('#myModal').modal('hide');
				if (data.flag == true) {
					alert("修改成功!", resetPestForm);
				} else {
					alert("修改失败！", "warning",resetPestForm);
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("修改失败!","warning", resetPestForm);
			}).always(function() {
				$('#table').bootstrapTable('refresh');
				$("#updateform").reset();

			});
		} else {
			confirm("未定义的操作" + operation);
		}
	}
});

//申请时间验证
function measureTimePick(){
	$('#updateform').data('bootstrapValidator').updateStatus('measureTime', 'NOT_VALIDATED', null).validateField('measureTime');
}