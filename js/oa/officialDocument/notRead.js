$(function() {
	//初始化列表
	initTable(0);
	
	//外部转发"处理"操作
	//addOfficialDocumentOut();
	
	//添加主送&&抄送
	initTree();
	
	//删除
	$("#del").click(function(){
		var row = $("#table").bootstrapTable("getSelections");
		var ids = [];
		$.each(ids,function(index,items){
			ids.push(items.id);
		});
		if(row.length > 0){
			confirm("确认要删除该数据吗？",function(){
			});
		}else{
			alert("请选择要删除的记录!","warning");
		}
	});
});


//列表
function initTable(status){
	$("#table").bootstrapTable({
		url: "oa/officialDocument/readOrNotReadList?status="+status, // 后台请求的url
		method : 'get', // 请求方式（*）
		height: getHeight(),// 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetailNotRead
		},{
			title: "类型",
			field: "type",
		},{
			title: "文号",
			field: "officialNo",
			formatter: formatSubstring
		},{
			title: "标题",
			field: "title",
			formatter: formatSubstring
		},{
			title: "密级",
			field: "securityDegreeName"
		},{
			title: "缓急",
			field: "urgencyDegreeName"
		},{
			title: "拟稿单位",
			field: "department",
			formatter: formatSubstring
		},{
			title: "发文时间",
			field: "sendTime"
		}/*,{
			title: "收文时间",
			field: "receiveTime"
		}*/]
	});
}

function formatSubstring(value,row,index){
	if(value){
		if(value.length>=10){
			return "<div title='" + value + "'><span>" + value.substring(0,8) + "..." + "</span></div>";
			//return value.substring(0,15)+"...";
		}else{
			return value;
		}
	}else{
		return "";
	}
}


//行高
function getHeight() {
    return $(window).height() - $('.header').outerHeight(true)- $('.wrap-top').outerHeight(true) - $('.toolbar1').outerHeight(true);
}
     
function formatDetailNotRead(value,row,index){
	return '<a class="details" onclick="editNotReadDetail(\''+row.id+'\','+row.typeValue+','+row.sendFileStatus+')"><span class="eye"></span></a>';
}

//查看详情
function editNotReadDetail(id,typeValue,sendFileStatus){
	if(id == null){
		receiverTableId = 0;
	}
	$.ajax({
		url : 'oa/officialDocument/officialDocumentNotRead/'+id+'/'+typeValue+'/'+sendFileStatus,
		type : 'GET',
		timeout : 10000,
		cache : false
	}).done(function(data) {
		if (null != data.officialDocumentVo) {
			var officialDocumentVo = data.officialDocumentVo;
			var attachments = data.attachments;
			setNotReadDetailPage(officialDocumentVo,attachments);
			getStatusNum();
			$('#table').bootstrapTable('refresh');
			//getMyOfficerCount();
		}
	}).fail(function() {
		alert('文件详情获取失败!',"warning");
	});
}
function setNotReadDetailPage(officialDocumentVo,attachments){
	if("3" == officialDocumentVo.typeValue){
		outForwardDetail(officialDocumentVo,attachments);
	}else{
		var iPAndPort = $("#iPAndPort").val();
		$("#officialNo_detali").text(officialDocumentVo.officialNo);$("#officialNo_detali").attr("title",officialDocumentVo.officialNo);
		$("#title_detali").text(officialDocumentVo.title);$("#title_detali").attr("title",officialDocumentVo.title);
		$("#securityDegree_detali").text(officialDocumentVo.securityDegreeName);
		$("#urgencyDegree_detali").text(officialDocumentVo.urgencyDegreeName);
		$("#mainReceiver_detali").text(officialDocumentVo.receiveFilePerson1);$("#mainReceiver_detali").attr("title",officialDocumentVo.receiveFilePerson1);
		$("#copyReceiver_detali").text(officialDocumentVo.receiveFilePerson2);$("#copyReceiver_detali").attr("title",officialDocumentVo.receiveFilePerson2);
		$("#department_detali").text(officialDocumentVo.department);$("#department_detali").attr("title",officialDocumentVo.department);
		$("#drafter_detali").text(officialDocumentVo.drafter);$("#drafter_detali").attr("title",officialDocumentVo.drafter);
		$("#reviewer_detali").text(officialDocumentVo.reviewer);$("#reviewer_detali").attr("title",officialDocumentVo.reviewer);
		$("#printingDepartment_detali").text(officialDocumentVo.printingDepartment);$("#printingDepartment_detali").attr("title",officialDocumentVo.printingDepartment);
		$("#verifier_detali").text(officialDocumentVo.verifier);$("#verifier_detali").attr("title",officialDocumentVo.verifier);
		$("#count_detali").text(officialDocumentVo.count);
		$("#createTime_detali").text(officialDocumentVo.createTime);//+
		$("#createPersonName_detali").text(officialDocumentVo.createPersonName);
		$("#sendTime_detali").text(officialDocumentVo.sendTime==null?"":officialDocumentVo.sendTime);
		//$("#receiveTime_detali").text(officialDocumentVo.receiveTime);//+
		
		$("#text-preview-btn").click(function(){
			if(attachments){
				officialDocumentVo.attachement = $.map(attachments, function(n){return n.attachmentName});
			}
			
			if(isIE()){
				var param = {
						title: "公文预览",
						view: "form",
						edit: false,
						toolbars : { //右侧工具栏
							show: true, //是否显示office工具栏
							menu : ["trace","file"], // 右侧工具栏功能 [文件(打印,下载)]
						},
						officialDocumentId: officialDocumentVo.id,
						officialDocumentType: officialDocumentVo.typeValue,
						textId: officialDocumentVo.textId,
						formData: officialDocumentVo
				}
				var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
				window.showModalDialog("office", param, option);
			}else{
				alert("请在IE浏览器下打开");
			}
		});
		
		initTable1(); 
		if(attachments!=null){
			var tr_html = "";
			$("#detial #attachments_Info").empty();
			for(var i = 0;i<attachments.length;i++){
				tr_html += "<tr><td>"+attachments[i].attachmentName+"</td>"+
					        "<td><a href="+iPAndPort+attachments[i].attachmentUrl+" download target='_blank'>下载</a></td></tr>";
			}
			$("#detial #attachments_Info").append(tr_html);
		}
		
		//审批历史
		initTable2();
		var approvalProcessHistory = officialDocumentVo.approvalProcessHistory
		if(approvalProcessHistory){
			var tr_html = "";
			$("#detial #approval_Info").empty();
			for(var i = 0;i<approvalProcessHistory.length;i++){
				if(approvalProcessHistory[i].comment==null ){
					approvalProcessHistory[i].comment='无';
				}
				if(approvalProcessHistory[i].result==1 ){
					approvalProcessHistory[i].result='通过';
				}
				if(approvalProcessHistory[i].result==0 ){
					approvalProcessHistory[i].result='驳回';
				}
				tr_html += "<tr><td>"+approvalProcessHistory[i].approverName+"</td>"+
					        "<td>"+approvalProcessHistory[i].time+"</td>"+
					        "<td>"+approvalProcessHistory[i].comment +"</td>"+
					        "<td>"+approvalProcessHistory[i].result+"</td></tr>";
			}
			$("#detial #approval_Info").append(tr_html);
		}
		$("#detial").modal("show");
	  }
}

function outForwardDetail(officialDocumentVo,attachments){
	var outIPAndPort = $("#iPAndPort").val();
	$("#id_detailOut").val(officialDocumentVo.id);//为页面隐藏域取值
	$("#officialDocumentId_detailOut").val(officialDocumentVo.officialDocumentId);//为页面隐藏域取值
	$("#officialNo_detaliOut").text(officialDocumentVo.officialNo);$("#officialNo_detaliOut").attr("title",officialDocumentVo.officialNo);
	$("#title_detaliOut").text(officialDocumentVo.title);$("#title_detaliOut").attr("title",officialDocumentVo.title);
	$("#sn_detaliOut").text(officialDocumentVo.sn);$("#sn_detaliOut").attr("title",officialDocumentVo.sn);
	$("#securityDegree_detaliOut").text(officialDocumentVo.securityDegreeName);
	$("#mainReceiver_detaliOut").text(officialDocumentVo.receiveFilePerson1);
	$("#mainReceiver_detaliOut").attr("title",officialDocumentVo.receiveFilePerson1);
	$("#copyReceiver_detaliOut").text(officialDocumentVo.receiveFilePerson2);
	$("#copyReceiver_detaliOut").attr("title",officialDocumentVo.receiveFilePerson2);
	$("#department_detaliOut").text(officialDocumentVo.department);$("#department_detaliOut").attr("title",officialDocumentVo.department);
	$("#count_detaliOut").text(officialDocumentVo.count);
	$("#createTime_detaliOut").text(officialDocumentVo.createTime);//+
	$("#createPersonName_detaliOut").text(officialDocumentVo.createPersonName);
	$("#sendTime_detaliOut").text(officialDocumentVo.sendTime);//+
	//$("#receiveTime_detaliOut").text(officialDocumentVo.receiveTime);//+
	
	$("#receive-preview-btn").click(officialDocumentVo, function(e){
		if(isIE()){
			var param = {
					title: "阅办单详情",
					view: "form",
					edit: false,
					toolbars : { //右侧工具栏
						show: true, //是否显示office工具栏
						menu : ["file"], // 右侧工具栏功能 [文件(打印,下载)]
					},
					officialDocumentId: officialDocumentVo.id,
					officialDocumentType: officialDocumentVo.typeValue,
					textId: officialDocumentVo.textId,
					formData: officialDocumentVo
			}
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	initTable3(); 
	if(attachments!=null){
		var tr_html = "";
		$("#outDetial #outAttachments_Info").empty();
		for(var i = 0;i<attachments.length;i++){
			tr_html += "<tr><td>"+attachments[i].attachmentName+"</td>"+
			"<td><a href="+outIPAndPort+attachments[i].attachmentUrl+" download target='_blank'>下载</a></td></tr>";
		}
		$("#outDetial #outAttachments_Info").append(tr_html);
	}
	//反馈意见
	initTable4();
	var conmentList = officialDocumentVo.conmentList
	if(conmentList){
		var tr_html = "";
		$("#outDetial #comment_Info").empty();
		for(var i = 0;i<conmentList.length;i++){
			tr_html += "<tr><td>"+conmentList[i].receiveName+"</td>"+
			"<td>"+conmentList[i].comment+"</td></tr>";
		}
		$("#outDetial #comment_Info").append(tr_html);
	}
	$("#outDetial").modal("show");
}




//外部转发"处理"操作
var forwardId;
var forwardOfficialDocumentId;
function dealWith(){
	forwardId = $("#id_detailOut").val();
	forwardOfficialDocumentId = $("#officialDocumentId_detailOut").val();
	$("#dealWithform").reset();
	$("#dealWithModal").modal("show");
}
//消除页面验证
$('#dealWithModal').on('hide.bs.modal', function() {
	$("#dealWithModal form").each(function() {
		$(this).reset();
	});
})
/*function addOfficialDocumentOut(){
	$("#dealWithform").bootstrapValidator({
		group:".form-group,.receiveFile",
		fields:{
		    comment:{
		    	validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:64, message:"不能超过64个字符"},
				}
		    }
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var data = $("#dealWithform").serializeObject();
		$.ajax({
			type : 'POST',
			url : 'oa/officialDocument/forward?forwardId=' + forwardId + "&officialDocumentId="+forwardOfficialDocumentId,
			data : JSON.stringify(data),
		}).done(function(data) {
			if (data.flag == true) {
				getStatusNum();
				resetFileReceiver4();//主送，抄送清空
				alert("发送成功!", resetCustomerForm4);
				$('#dealWithModal').modal('hide');
			}else if(data.flag == 2){
				resetFileReceiver4();//主送，抄送清空
				alert("保存成功!", resetCustomerForm4);
				$('#dealWithModal').modal('hide');
			} else {
				resetFileReceiver4();//主送，抄送清空
				alert("发送失败！","warning", resetCustomerForm4);
			}
		}).fail(function(err) {
			resetFileReceiver4();//主送，抄送清空
			alert("发送失败!", "warning",resetCustomerForm4);
		}).always(function() {
			$('#table').bootstrapTable('refresh');
			$("#dealWithform").reset();
		});
	});
}*/
//初始化表单
function resetCustomerForm4() {
	$("#dealWithform").reset();
	$("#dealWithform").data('bootstrapValidator').resetForm();
}

function resetFileReceiver4(){
	$("#mainReceiver").departmentTreeView("setVal",[]);
	$("#copyReceiver").departmentTreeView("setVal",[]);
}

function initTree() {
	$("#mainReceiver").departmentTreeView({title: "选择主送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
		    }
			$("#mainReceiver").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson1").val(names.substring(0,names.length-1));
			//mainReceiverPick();
		}
	});
	$("#copyReceiver").departmentTreeView({title: "选择抄送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
	    	}
			$("#copyReceiver").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson2").val(names.substring(0,names.length-1));
		}
	});
}
//添加主送人
function show1_dealWith() {
	if($("#mainReceiver").val()!="" && $("#mainReceiver").val()!=null){
		var mainReceiver = $("#mainReceiver").val().split(",");
		$("#mainReceiver").departmentTreeView("setVal",mainReceiver);
	}
	$("#mainReceiver").departmentTreeView("show");
}
//添加抄送人
function show2_dealWith(){
	if($("#copyReceiver").val()!="" && $("#copyReceiver").val()!=null){
		var copyReceiver = $("#copyReceiver").val().split(",");
		$("#copyReceiver").departmentTreeView("setVal",copyReceiver);
	}
	$("#copyReceiver").departmentTreeView("show");
}





//"外部转发"附件表格表格
function initTable3() {
    $("#table3").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'},{field: 'f2'}]
    });
}
//反馈意见表格
function initTable4() {
    $("#table4").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'},{field: 'f2'}]
    });
}

//附件表格表格
function initTable1() {
    $("#table1").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'},{field: 'f2'}]
    });
}

//审批历史表格
function initTable2() {
    $("#table2").bootstrapTable({
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