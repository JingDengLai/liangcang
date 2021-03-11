var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
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
		$table.bootstrapTable('refresh', {url : 'oa/materials/send/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
});	
//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/send/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [  {
			title : '详情',
			field : 'detail',
			align : 'center',
			valign : 'middle',
			formatter : formatDetail,
			width : 100
		}, {
			title : '部门',
			field : 'departmentName',
			align : 'center',
			width : 250
		}, {
			title : '领用人',
			field : 'acceptancePersonName',
			align : 'center',
			width : 100
		}, {
			title : '领用时间',
			field : 'receiveTime',
			align : 'center',
			width : 200
		}, {
			title : '状态',
			field : 'inGroupStatus',
			align : 'center',
			width : 100
		}, {
			title : '操作',
			field : 'Status',
			align : 'center',
			formatter : formatOperation,
			width : 100
		}]
	});

};
//发出确认
function btnclick(index){
	var row = $("#table").bootstrapTable("getData")[index];
	console.log(row);
	confirm("是否确认进行发出操作!",function(){
		$.ajax({
			url : 'oa/materials/send/' + row.materialId + '/acceptances/' + row.id,
			type : 'PUT'
		}).done(function(data) {
			alert("发出成功!");
		}).fail(function(err) {
			alert("发出失败!","warning");
		}).always(function() {
			$table.bootstrapTable('refresh');
		});
	});
	
}
//发出按钮点击事件
function formatOperation(value,row,index){
	if("1" === row.inGroupBut||"1"===row.materialStatus){
		return "<button class='btn-print but-grey' onclick='btnclick("+index+")' disabled='disabled'>发出确认</button>";
	}else{
		return "<button class='btn-print' onclick='btnclick("+index+")'>发出确认</button>";
	}
}
//查看详情点击事件
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
	console.log(row);
	$("#detial #equipment_Info").empty();
	for(var i = 0;i<row.name.length;i++){
		var specification="";
		var model="";
		var code="";
		if(row.specification[i]!=null&&row.specification[i]!=""){
			specification="/"+row.specification[i];
		}
		if(row.model[i]!=null&&row.model[i]!=""){
			model="/"+row.model[i];
		}
		if(row.code[i]!=null&&row.code[i]!=""){
			code="/"+row.code[i];
		}
		tr_html += "<tr><td>"+row.name[i]+specification+model+code+"</td></tr>";
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
//查看详情 领用信息初始化table
function initTable2() {
    $("#table2").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'}]
    });
}
//初始化 审批记录table
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