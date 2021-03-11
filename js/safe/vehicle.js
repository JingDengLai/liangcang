$(function(){
	initTable();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$('#table').bootstrapTable('refresh', {url : 'http://10.125.58.171:8080/api/getCarList'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	
	// 添加按钮
	$("#add").click(function() {
		$("#dataForm").reset();
		$("#addModalLabel").html("添加车辆信息");
		$("#operation").val("add");
		$('#addModal').modal('show');
	});
	
	// 编辑按钮
	$("#edit").click(function() {
		$("#dataForm").reset();
		$("#addModalLabel").html("修改车辆信息");
		var selections = $("#table").bootstrapTable("getSelections");
		console.log(selections)
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
			getVarietyDetail(o.id);
		})
		$('#addModal').modal('show');
	});
	
	// 开启时间设置
	$('#openSetting').change(function(){
		if ($(this).prop('checked')){
			$('#startTime').prop('disabled',false)
			$('#endTime').prop('disabled', false);
		}else{
			$('#startTime').prop('disabled', true);
			$('#startTime').val('');
			$('#endTime').prop('disabled', true);
			$('#endTime').val('');
		}
	})
	
	// 删除
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleVariety);
		} else {
			alert("请选择要删除的记录!","warning");
		}
	});
	
	
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	});
	
	addOreditVariety();
})


function initTable() {
    $('#table').bootstrapTable({
        url: 'http://10.125.54.60:8080/api/getCarList',
        method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '序号'
        }, {
            field: 'carCode',
            title: '车牌号码'
        },{
			field: 'listAttr',
			title: '名单属性'
		},{
			field: 'carType',
			title: '车牌类型'
		},{
			field: 'carColor',
			title: '车牌颜色'
		},{
			field: 'startTime',
			title: '有效开始期'
		},{
			field: 'endTime',
			title: '有效结束期'
		}],
		dataField:"data"
    })
}

// 新增OR修改
function addOreditVariety() {
	$('#dataForm').bootstrapValidator({
		fields : {
			carCode : {
				validators : {
					notEmpty : {
						 message: '不能为空'
					}
				}
			},
			cardCode : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		$('#dataForm').bootstrapValidator('disableSubmitButtons',false)		
		e.preventDefault();
		var operation = $("#operation").val();
		if ("add" == operation) {
			$.ajax({
				type : 'POST',
				url : "http://10.125.58.171:8080/api/addCar",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert(data.msg);
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			$.ajax({
				type : 'PUT',
				url : "http://10.125.58.171:8080/api/addCar",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert(data.msg);
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$('#table').bootstrapTable('refresh');
			});
		} else {
			alert("未定义的操作!","warning");
			$("#dataForm").reset();
		}
	});
}


// 根据id获取详情
function getVarietyDetail(id) {
	$.ajax({
		url : 'http://10.125.58.171:8080/api/getCarList/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.data) {
			var variety = data.data;
			setEidtPage(variety);
		}
	}).fail(function(err) {
		alert("车辆信息获取失败!","warning");
	});
}

// 组织编辑页面
function setEidtPage(variety) {
	$('#dataForm #carCode').val(variety.carCode);
	$('#dataForm #listAttr').val(variety.listAttr);
	$('#dataForm #carType').val(variety.carType);
	$('#dataForm #carColor').val(variety.carColor);
	$('#dataForm #cardCode').val(variety.cardCode);
	if (variety.openSetting){
		$('#dataForm #openSetting').prop('checked', true);
		$('#dataForm #startTime').val(variety.startTime);
		$('#dataForm #endTime').val(variety.endTime);
	}
}


// 删除
function deleVariety() {
	var selections = $("#table").bootstrapTable("getSelections");
	var ids=[];
    // $.each(selections,function(i,o){
    //     deleteById(o.id);
    // });
	$.each(selections,function(i,o){
		ids.push(o.id)
	});

	$.ajax({
		url : 'inspect/point/' + ids,
		type : 'DELETE'
	}).done(function(res) {
		if (res.code == 0){
			alert("删除成功");
		}
	}).fail(function(err) {
		alert("删除失败","warning");
	}).always(function() {
		$('#table').bootstrapTable('refresh');
	});

	// 提示成功
	$('#table').bootstrapTable('refresh', {url : 'api/getCarList'});
	$("#dataForm").reset();
}

