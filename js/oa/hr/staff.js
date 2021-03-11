var base_url = "oa/hr/staff/staff";

$(function() {

	dataInit();

	uiInit();

});

// 初始化表格
function dataInit() {
	$('#table').bootstrapTable({
		url : base_url,
		method : 'get',
		columns : [ {
			title : '全选',
			field : '全选',
			checkbox : true
		}, {
			title : '序号',
			field : 'sort',
			width : '35px',
			formatter: function (value, row, index) {return index+1; }
		}, {
			title : '姓名',
			field : 'realName'
		}, {
			title : '编号',
			field : 'no'
		}, {
			title : '部门',
			field : 'departmentId',
			formatter: function (value, row, index) {return row.departmentName; }
		}, {
			title : '性别',
			field : 'gender',
			width : '60px',
			formatter: function (value, row, index) {return row.genderName; }
		}, {
			title : '岗位',
			field : 'position',
			formatter: function (value, row, index) {return row.positionName; }
		}, {
			title : '岗位级别',
			field : 'level',
			formatter: function (value, row, index) {return row.levelName; }
		}, {
			title : '入职时间',
			field : 'dateOfEmployment',
			width : '100px'
		}, {
			title : '修改时间',
			field : 'updateTime',
			width : '150px'
		}, {
			title : '操作',
			field : 'id',
			width : '210px',
			formatter : formatDetail
		} ],
		onLoadSuccess:function(){
			$('[data-toggle="tooltip"]').tooltip()
		}
	});

	$('#addForm').bootstrapValidator({
		//group : "tr",
		fields : {
			realName : {
				validators : {
					notEmpty : {}
				}
			},
			departmentId : {
				validators : {
					notEmpty : {}
				}
			},
			no : {
				validators : {
					notEmpty : {}
				}
			},
			phone : {
				validators : {
					regexp: {
						regexp: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
					}
				}
			},
			email : {
				validators : {
					regexp: {
                        regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                    }
				}
			},
			idNo : {
				validators : {
					regexp: {
                        regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                    }
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $('#addForm').serializeObject();
		data.certificateIds = $('#addForm select[name="certificateIds"]').multipleSelect("getSelects");
		$.ajax({
			type : 'POST',
			url : base_url,
			data : JSON.stringify(data)
		}).done(function(data) {
			alert("添加成功!");
			$('#table').bootstrapTable('refresh');
			$('#addModal').modal('hide');
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {
		});

	});
	
	$('#editForm').bootstrapValidator({
		//group : "tr",
		fields : {
			realName : {
				validators : {
					notEmpty : {}
				}
			},
			departmentId : {
				validators : {
					notEmpty : {}
				}
			},
			no : {
				validators : {
					notEmpty : {}
				}
			},
			phone : {
				validators : {
					regexp: {
						regexp: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
					}
				}
			},
			email : {
				validators : {
					regexp: {
                        regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                    }
				}
			},
			idNo : {
				validators : {
					regexp: {
                        regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                    }
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $('#editForm').serializeObject();
		data.certificateIds = $('#editForm select[name="certificateIds"]').multipleSelect("getSelects");
		$.ajax({
			type : 'PUT',
			url : base_url + "/" + $('#editForm input[name="id"]').val(),
			data : JSON.stringify(data)
		}).done(function(data) {
			alert("修改成功!");
			$('#table').bootstrapTable('refresh');
			$('#editModal').modal('hide');
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {
		});

	});
}

function uiInit() {
	// 查询按钮事件
	$('#search-submit-btn').click(function() {
		$('#table').bootstrapTable('refresh', {
			url : base_url
		});
	});
	// 重置按钮
	$("#search-reset-btn").click(function() {
		$("#toolbar form").reset();
		$('#table').bootstrapTable('refresh', {
			url : base_url
		});
	});
	// 批量删除按钮
	$("#batch-delete-btn").click(function() {
		showBatchDeleteModal();
	});
	// 导出按钮
	$("#export-btn").click(function() {
		window.location.href= base_url + "/export";
	});
	//添加窗口重置
	$('#addModal').on('shown.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
	$('#editModal').on('hide.bs.modal', function() {
		$("#editModal form").each(function() {
			$(this).reset();
		});
	})
	$("select[multiple='multiple']").each(function(){
	    $(this).multipleSelect();
	});
}

function formatDetail(val, row) {
	var span = $("<span></span>");

	var detailBtn = $('<a onclick="showDetailModal(\'' + row.id + '\')"></a>').addClass("operation").html('<i class="operation-icon detail"></i>查看').appendTo(span);
	var editBtn = $('<a onclick="showEditModal(\'' + row.id + '\')"></a>').addClass("operation").html('<i class="operation-icon edit"></i>修改').appendTo(span);
	var deleteBtn = $('<a onclick="showDeleteModal(\'' + row.id + '\')"></a>').addClass("operation").html('<i class="operation-icon delete"></i>删除').appendTo(span);
	return $(span).html();
}

function showEditModal(id) {
	var row = $("#table").bootstrapTable("getRowByUniqueId", id);
	if (row) {
		$.each(row, function(name, value) {
			$('#editForm input[type!="radio"][name="'+name+'"],#editForm select[name="'+name+'"],#editForm textarea[name="'+name+'"]').val(value);
		});
		$('#editForm input[type="radio"][name="gender"][value="' + row.gender + '"]').prop("checked", true);
		$('#editForm select[name="certificateIds"]').multipleSelect("setSelects", row.certificateIds);
		$('#editModal').modal('show');
	}
}

function showDetailModal(id) {
	var row = $("#table").bootstrapTable("getRowByUniqueId", id);
	if (row) {
		$.each(row, function(name, value) {
			if(value){
				$('#detailModal span[name="'+name+'"]').html(value);
				$("#detailModal span[name='"+name+"']").attr("title",value);
			}else{
				$('#detailModal span[name="'+name+'"]').html("-");
			}
		});
		if(row.certificateNames && row.certificateNames.length > 0 ){
			$('#detailModal span[name="certificateNames"]').html(row.certificateNames.join("，"));
		}else{
			$('#detailModal span[name="certificateNames"]').html("-");
		}
		$('#detailModal').modal('show');
	}
}

function showDeleteModal(id) {
	confirm("确认删除该记录?",function(){
		$.ajax({
			type : 'DELETE',
			url : base_url + "/" + id
		}).done(function(data) {
			alert("删除成功!");
			$('#table').bootstrapTable('refresh');
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {
		});
	});
}

function showBatchDeleteModal() {
	var selections = $("#table").bootstrapTable("getSelections");
	if (selections.length == 0) {
		alert("请选择要删除的记录!","warning");
	}else{
		var ids = selections.map(function(i) {
			return i.id;
		});
		//confirm("确认删除选中的共" + selections.length + "条记录?",function(){
		confirm("是否确认删除？",function(){
			$.ajax({
				type : 'DELETE',
				url : base_url,
				data : JSON.stringify(ids)
			}).done(function(data) {
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alertAjaxError(err);
			}).always(function() {
			});
		});
	}
}