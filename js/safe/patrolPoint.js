$(function () {
    initTable();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$('#table').bootstrapTable('refresh', {url : 'basic/variety/varieties'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	
	// 添加按钮
	$("#add").click(function() {
		$("#code").removeAttr("readonly"); 
		$("#code").removeAttr("unselectable"); 
		$("#code").css({"cursor": ""});
		$("#dataForm").reset();
		$("#addModalLabel").html("新增巡检点");
		$("#operation").val("add");
		$('#addModal').modal('show');
		// 添加leaflet地图
		setTimeout(function(){
			initMap();
		},500)
	});
	
	// 编辑按钮
	$('#edit').click(function(){
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
	});
	
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
	
	// 新增保存、编辑保存
	addOreditVariety();
	
});

function initTable() {
    $('#table').bootstrapTable({
        url: '../js/safe/data1.json',
        method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '编号'
        }, {
            field: 'name',
            title: '巡检点名称'
        }, {
            field: 'equip',
            title: '设备ID'
        },{
            field: 'desc',
            title: '说明'
        },
		// {
  //           field: 'operate',
  //           title: '操作',
  //           formatter: operateFormatter //自定义方法，添加操作按钮
  //       },
		],
		
    })
}


// 新增OR修改
function addOreditVariety() {
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
	                     message: '品种名称长度必须在1到32位之间'
	                 }
				}
			},
			desc : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 5,
	                     message: '品种编码长度必须在1到5位之间'
	                 }
				}
			},
			equip : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 2,
	                     message: '优先级长度必须在1到2位之间'
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
				url : "basic/variety/varieties",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert(data.msg);
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			$.ajax({
				type : 'PUT',
				url : "basic/variety/varieties",
				data : $('#dataForm').serializeJson()
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert(data.msg);
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

// 根据id获取详情
function getVarietyDetail(id) {
	$.ajax({
		url : 'basic/variety/varieties/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.variety) {
			var variety = data.variety;
			setEidtPage(variety);
		}
	}).fail(function(err) {
		alert("品种信息获取失败!","warning");
	});
}

// 组织编辑页面
function setEidtPage(variety) {
	$("#dataForm #name").val(variety.name);
	$("#dataForm #desc").val(variety.desc);
	$("#equip").val(variety.equipID);
	$("#referImg").val(variety.referImg);
	$('#addModal').modal('show');
}


// 删除
function deleVariety() {
	var selections = $("#table").bootstrapTable("getSelections");
    $.each(selections,function(i,o){
        deleteById(o.id);
    });
	// 提示成功
	$('#table').bootstrapTable('refresh', {url : 'basic/variety/varieties'});
	alert("删除成功!");
	$("#dataForm").reset();
}
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'basic/variety/varieties/' + id,
		type : 'DELETE'
	}).done(function(data) {
		if (data.flag != 1){
			if (data.flag == 2){
				alert("品种已被绑定使用，无法删除!","warning");
			}else{
				alert("删除失败!","warning");
			}
		}
	}).fail(function(err) {
		alert("删除失败!","warning");
	}).always(function() {
		$('#table').bootstrapTable('refresh');
		$("#dataForm").reset();
	});
}

// function operateFormatter(value, row, index) {//赋予的参数
//     return [
//         '<button class="btn activ" id="openfile">编辑</button>',
//         '<button class="btn activ" id="openfile">删除</button>'
//     ].join('');
// }



