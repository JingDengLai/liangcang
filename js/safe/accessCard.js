var base_url = "http://10.125.52.65:8080";

$(function() {

	dataInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		$('#table').bootstrapTable('refresh', {url : '/sgmp-portal-web/inspect/plan/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
		
		
	$('#name').click(function() {
		$('#workerList').modal('show');
		workerInit();
	});
	
	// 添加员工	
	$('.btn_add_worker').click(function(){
		var selections = $("#workerTable").bootstrapTable("getSelections");
		if (selections.length == 0) {
			alert("请选择要一个员工!","warning");
			return;
		}else if(selections.length > 1){
			alert("只能选择一个员工!","warning");
			return;
		}
		addWorker(selections[0]);
		$('#workerList').modal('hide');
	})
	
	// 模态框关闭
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	});

	// 多个模态框逻辑问题
	$(document).on('show.bs.modal', '.modal', function() {
		var zIndex = 1040 + (10 * $('.modal:visible').length);
		$(this).css('z-index', zIndex);
		setTimeout(function() {
			$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		}, 0);
	});
	
	
	//员工列表查询按钮
	$('#worker-search-submit-btn').click(function() {
		$('#workerTable').bootstrapTable('refresh', {url : base_url+'/api/getWorkerList'});
	});
	// 重置按钮
	$("#worker-search-reset-btn").click(function() {
		$("#workerSearchform").reset();
	});
	
	$('#workerList').on('hide.bs.modal', function() {
		$("#workerSearchform").reset();
	});
	
	
	// 销卡
	$('#batch-delete-btn').click(function(){
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认销卡？", deleVariety);
		} else {
			alert("请选择需要销的卡!","warning");
		}
	});
	
	
	// 导出
	$('#export-btn').click(function(){
		var url = "water/export?";
		var data = $('#searchform').serializeObject();
		if(data.name){
			url = url+"name="+data.groupId+'&';
		}
		
		if(data.no){
			url = url+"no="+data.groupId;
		}
		
		window.location.href=url;
		let link= document.createElement('a');
			link.setAttribute("href", url);
			link.setAttribute("download");
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
	})
	
});

// 初始化表格
function dataInit() {
	$('#table').bootstrapTable({
		url: base_url+'/api/getCardList',
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
		},
		responseHandler: function (res) {
			return {
				"rows":eval(res.data),
				"total": res.total
			}
		},
	});

	$('#addForm').bootstrapValidator({
		fields: {
			cardNo:{
				validators : {
					notEmpty : {
						 message: '不能为空'
					},
					stringLength: {
				      
				     }
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $('#addForm').serializeObject();
		$.ajax({
			type: 'POST',
			url: base_url+'/api/insertWorker',
			data: JSON.stringify(data)
		}).done(function(data) {
			alert("添加成功!");
			$('#table').bootstrapTable('refresh');
			$('#addModal').modal('hide');
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {
			
		});

	});
}


// 初始化员工表格
function workerInit() {
	$('#workerTable').bootstrapTable({
		url: base_url+'/api/getWorkerList',
		method: 'get',
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
		responseHandler: function (res) {
			return {
				"rows":eval(res.data),
				"total": res.total
			}
		},
		queryParams : function(params) {
			var p = $("#workerSearchform").serializeObject();
			var page = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				limit : params.limit, // 页面大小
				offset : params.offset, // 页码
			};
			p = $.extend(p, page);
			return p;
		},// 传递参数（*）
	})
}


// 添加员工赋值
function addWorker(item){
	$('#name').val(item.realName);
	$('#no').val(item.no);
	$('#departmentId').val(item.departmentName);
	$('#position').val(item.position);
}

function deleVariety(){
	var selRow = $("#table").bootstrapTable('getSelections');
}