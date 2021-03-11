var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//列表查询（分页）
	tableInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var name = $.trim($('#searchform #name').val());
		var beganTime = $.trim($('#searchform #beganTime').val());
		var endTime = $.trim($('#searchform #endTime').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #name').val(name);
		$('#searchform #beganTime').val(beganTime);
		$('#searchform #endTime').val(endTime);
		$table.bootstrapTable('refresh', {url : 'oa/materials/inCheck/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
});
//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/inCheck/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [  {
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
			title : '总金额(元)',
			field : 'totalMoney',
			align : 'center',
			width : 100
		}, {
			title : '部门',
			field : 'departmentName',
			align : 'center',
			width : 250
		}, {
			title : '申请人',
			field : 'purchasePersonName',
			align : 'center',
			width : 100
		}, {
			title : '申请时间',
			field : 'purchaseTime',
			align : 'center',
			width : 200
		}, {
			title : '状态',
			field : 'inGroupStatusName',
			align : 'center',
			width : 100
		}, {
			title : '操作',
			field : 'operator',
			align : 'center',
			formatter : formatOperation,
			width : 100
		}]
	});

};
//列表 操作点击
function formatOperation(value,row,index){
	if("1" === row.inGroupBut){
		return "<button class='btn-print but-grey' onclick='btnclick("+index+")' disabled='disabled'>入库确认</button>";
	}else{
		console.log(row);
		return "<button class='btn-print' onclick='btnclick("+index+")'>入库确认</button>";
	}
}

//入库确认
function btnclick(index){
	var row = $("#table").bootstrapTable("getData")[index];
	confirm("是否确认进行入库操作!",function(){
		$.ajax({
			url : 'oa/materials/inCheck/' + row.id,
			type : 'PUT'
		}).done(function(data) {
			alert("入库成功!");
		}).fail(function(err) {
			alert("入库失败!","warning");
		}).always(function() {
			$table.bootstrapTable('refresh');
		});
	});
	
}
//查看详情点击
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
	initTable2();
	var tr_html = "";
	$("#detial #equipment_Info").empty();
	var info = row.purchaseRelation;
	console.log(row);
	for(var i = 0;i<info.length;i++){
		var specification="";
		var model="";
		if(info[i].specifications!=null&&info[i].specifications!=""){
			specification="/"+info[i].specifications;
		}
		if(info[i].models!=null&&info[i].models!=""){
			model="/"+info[i].models;
		}
		tr_html += "<tr><td>"+info[i].names+specification+model+"</td>"+
			        "<td>"+info[i].price+"</td>"+
			        "<td>"+info[i].amount+"</td></tr>";
	}
	$("#detial #equipment_Info").append(tr_html);
	initTable3();
	var approve_html = "";
	$("#detial #approve_opinion").empty();
	var info = row.approvalProcessHistory;
	for(var i = 0;i<info.length;i++){
		var result=null;
		if(info[i].result==="1"){
			result='通过';
		}else if(info[i].result==="0"){
			result='驳回';
		}
		var comment = info[i].comment==null?"无":info[i].comment;
		approve_html += "<tr><td>"+info[i].approverName+"</td>"+
			        "<td>"+info[i].time+"</td>"+
			        "<td>"+comment+"</td>"+
			        "<td>"+result+"</td></tr>";
	}
	$("#detial #approve_opinion").append(approve_html);
	
}
//查看详情 详细信息table初始化
function initTable2() {
    $("#table2").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'},{field: 'f2'},{field: 'f3'}]
    });
}
//查看详情 审批记录table初始化
function initTable3() {
    $("#table3").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'},{field: 'f2'},{field: 'f3'},{field: 'f4'}]
    });
}