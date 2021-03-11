var base_url = "oa/hr/staff/staff";

$(function() {

	dataInit();

	$('#name').click(function() {
		$('#workerList').modal('show');
		workerInit();
	});


	// 多个模态框逻辑问题
	$(document).on('show.bs.modal', '.modal', function() {
		var zIndex = 1040 + (10 * $('.modal:visible').length);
		$(this).css('z-index', zIndex);
		setTimeout(function() {
			$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		}, 0);
	});

});

// 初始化表格
function dataInit() {
	$('#table').bootstrapTable({
		url: base_url,
		method: 'get',
		columns: [{
			title: '全选',
			field: '全选',
			checkbox: true
		}, {
			title: '序号',
			field: 'sort',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			title: '姓名',
			field: 'realName'
		}, {
			title: '编号',
			field: 'no'
		}, {
			title: '部门',
			field: 'departmentId',
			formatter: function(value, row, index) {
				return row.departmentName;
			}
		}, {
			title: '岗位',
			field: 'position',
		}, {
			title: '卡号',
			field: 'cardNo',
		}, {
			title: '状态',
			field: 'status',
		}],
		onLoadSuccess: function() {
			$('[data-toggle="tooltip"]').tooltip()
		}
	});

	$('#addForm').bootstrapValidator({
		fields: {

		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $('#addForm').serializeObject();
		data.certificateIds = $('#addForm select[name="certificateIds"]').multipleSelect("getSelects");
		$.ajax({
			type: 'POST',
			url: base_url,
			data: JSON.stringify(data)
		}).done(function(data) {
			alert("添加成功!");
			$('#table').bootstrapTable('refresh');
			$('#addModal').modal('hide');
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {});

	});
}


function workerInit() {
	$('#workerTable').bootstrapTable({
		columns: [{
			title: '全选',
			field: '全选',
			checkbox: true
		}, {
			title: '姓名',
			field: 'realName'
		}, {
			title: '部门',
			field: 'departmentId',
			formatter: function(value, row, index) {
				return row.departmentName;
			}
		}, {
			title: '岗位',
			field: 'position',
		}],
		toolbar: '',
		height: 500,
		width: '100%',
		data: [{
			'realName': 'sss',
			'departmentName': 'fff',
			'position': 'aaa'
		}],
	})
}
