$(function() {
	//获取各个状态的个数
	getStatusNum();
	
	//外部转发"处理"操作
	addOfficialDocumentOut();
	
	//添加主送&&抄送
	initTree();
	
	var copyReceverIdArray;
	
	//页面问候语
	showTimePort();
	
	// 发文申请按钮
	$("#submitBtn1").click(function() {
		$("#operation").val("submitBtn1");
	});
	$("#submitBtn1_up").click(function() {
		$("#operation").val("submitBtn1_up");
	});
	// 保存按钮
	$("#submitBtn2").click(function() {
		$("#operation").val("submitBtn2");
	});
	$("#submitBtn2_up").click(function() {
		$("#operation").val("submitBtn2_up");
	});
	//删除
	$("#del").click(function(){
		var row = $("#table").bootstrapTable("getSelections");
		if(row.length > 0){
			confirm("确认要删除该数据吗？",deleteDrafts);
		}else{
			alert("请选择要删除的记录!","warning");
		}
	});
});	


function getStatusNum() {
	$.ajax({
		type : 'GET',
		url : "oa/officialDocument/getStatusNum",
		dataType : "json",
	}).done(function(data) {
		if (null != data) {
			textData(".receiveFile_num", data.receiveFileNum);
			textData(".drafts_num", data.draftsNum);
			textData(".sent_num", data.sentNum);
			textData(".reject_num", data.rejectNum);
			textData(".approval_num", data.approvalNum);
			textData(".notApproval_num", data.notApprovalNum);
			textData(".read_num", data.readNum);
			textData(".notRead_num", data.notReadNum);
			textData(".delete_num", data.deleteNum);
			$("#countTodayReceiveFile").text(data.countTodayReceiveFile == 0 ? 0 : '( '+ data.countTodayReceiveFile +' )');
			$("#countTodayNotRead").text(data.countTodayNotRead == 0 ? 0 : '( '+ data.countTodayNotRead +' )');
			titleNum(data);
			//getWaringCount();//消息推送公文未读数量
		}
	}).fail(function() {
		alert('文件个数获取失败!',"warning");
	});
}
function textData(str, num){
	if(num == 0 ){
		$(str).hide();
	}else{
		$(str).text('('+num+')');
		$(str).show();
	}
}
	
//页面列表标题数量统计
function titleNum(data){
	$(".title_receiveFile_num").text(data.receiveFileNum ==0 ? 0 : data.receiveFileNum);
	$(".title_drafts_num").text(data.draftsNum == 0 ? 0 : data.draftsNum);
	$(".title_sent_num").text(data.sentNum == 0 ? 0 : data.sentNum);
	$(".title_reject_num").text(data.rejectNum == 0 ? 0 : data.rejectNum);
	$(".title_approval_num").text(data.approvalNum == 0 ? 0 : data.approvalNum);
	$(".title_notApproval_num").text(data.notApprovalNum == 0 ? 0 : data.notApprovalNum);
	$(".title_read_num").text(data.readNum == 0 ? 0 : data.readNum);
	$(".title_notRead_num").text(data.notReadNum == 0 ? 0 : data.notReadNum);
	$(".title_delete_num").text(data.deleteNum == 0 ? 0 : data.deleteNum);
}


//删除
function deleteDrafts() {
	var row = $("#table").bootstrapTable("getSelections");
	$.each(row, function(index, items) {
		deleteById(items.id, items.officialDocumentId, items.typeValue);
	});
}

//删除
function deleteById(id, officialDocumentId, typeValue) {
	if (id == "") {
		return;
	}else{
		if(null == officialDocumentId){
			officialDocumentId = 0;
		}
	}
	$.ajax({
		url : 'oa/officialDocument/' + id + '/' + officialDocumentId + '/' + typeValue,
		type : 'DELETE'
	}).done(function(data) {
		if(data.flag){
			alert("删除成功!");
			getStatusNum();
			$('#table').bootstrapTable('refresh');
		}else{
			alert("删除失败!","warning");
		}
	}).fail(function() {
		alert("删除失败!","warning");
		return;
	});
}

function formatDetail(value,row,index){
	return '<a class="details" onclick="editDetail(\''+row.id+'\','+row.typeValue+','+row.sendFileStatus+')"><span class="eye"></span></a>';
}

//查看详情
function editDetail(id,typeValue,sendFileStatus){
	if(typeValue == null){
		typeValue = 0;
	}
	var url;
	if($("#receiveFile").hasClass("active")){
		url = 'oa/officialDocument/officialDocumentNotRead/'+id+'/'+typeValue+'/'+sendFileStatus;
	}else{
		url = 'oa/officialDocument/'+id+'/'+typeValue;
	}
	$.ajax({
		url : url,
		type : 'GET',
		timeout : 10000,
		cache : false
	}).done(function(data) {
		if (null != data.officialDocumentVo) {
			var officialDocumentVo = data.officialDocumentVo;
			var attachments = data.attachments;
			setDetailPage(officialDocumentVo,attachments);
			getStatusNum();
			$('#table').bootstrapTable('refresh');
			//getMyOfficerCount();
		}
	}).fail(function() {
		alert('文件详情获取失败!',"warning");
	});
}

function setDetailPage(officialDocumentVo,attachments){
	if("3" == officialDocumentVo.typeValue){
		outForwardDetail(officialDocumentVo,attachments);
	}else{
		var iPAndPort = $("#iPAndPort").val();
		$("#officialNo_detali").text(officialDocumentVo.officialNo);$("#officialNo_detali").attr("title",officialDocumentVo.officialNo);
		$("#title_detali").text(officialDocumentVo.title);$("#title_detali").attr("title",officialDocumentVo.title);
		$("#securityDegree_detali").text(officialDocumentVo.securityDegreeName);
		$("#urgencyDegree_detali").text(officialDocumentVo.urgencyDegreeName);
		$("#mainReceiver_detali").text(officialDocumentVo.receiveFilePerson1);
		$("#mainReceiver_detali").attr("title",officialDocumentVo.receiveFilePerson1);
		$("#copyReceiver_detali").text(officialDocumentVo.receiveFilePerson2);
		$("#copyReceiver_detali").attr("title",officialDocumentVo.receiveFilePerson2);
		$("#department_detali").text(officialDocumentVo.department);$("#department_detali").attr("title",officialDocumentVo.department);
		$("#drafter_detali").text(officialDocumentVo.drafter);$("#drafter_detali").attr("title",officialDocumentVo.drafter);
		$("#reviewer_detali").text(officialDocumentVo.reviewer);$("#reviewer_detali").attr("title",officialDocumentVo.reviewer);
		$("#printingDepartment_detali").text(officialDocumentVo.printingDepartment);$("#printingDepartment_detali").attr("title",officialDocumentVo.printingDepartment);
		$("#verifier_detali").text(officialDocumentVo.verifier);$("#verifier_detali").attr("title",officialDocumentVo.verifier);
		$("#count_detali").text(officialDocumentVo.count);
		$("#createTime_detali").text(officialDocumentVo.createTime);//+
		$("#createPersonName_detali").text(officialDocumentVo.createPersonName);
		$("#sendTime_detali").text(officialDocumentVo.sendTime==null?"":officialDocumentVo.sendTime);
		$("#receiveTime_detali").text(officialDocumentVo.receiveTime);//+
		if($("#delete").hasClass("active")){
			$("#updateTime_detali").text(officialDocumentVo.updateTime);//+
		}
		if(attachments){
			officialDocumentVo.attachement = $.map(attachments, function(n){return n.attachmentName});
		}
		$("#text-preview-btn").unbind("click").bind("click", officialDocumentVo, function(e){
			if(isIE()){
				var param = {
						title: "公文预览",
						view: "form",
						edit: false,
						toolbars : { //右侧工具栏
							show: true, //是否显示office工具栏
							menu : ["trace","file"], // 右侧工具栏功能 [文件(打印,下载)]
						},
						officialDocumentId: e.data.id,
						officialDocumentType: e.data.typeValue,
						textId: e.data.textId,
						formData: e.data
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
	$("#id_detailOut").val(officialDocumentVo.id);//为页面隐藏域"公文阅办单ID"取值
	$("#officialDocumentId_detailOut").val(officialDocumentVo.officialDocumentId);//为页面隐藏域"公文阅办单收件人表主键ID"取值
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
	$("#receiveTime_detaliOut").text(officialDocumentVo.receiveTime);//+
	if($("#delete").hasClass("active")){
		$("#updateTime_detaliOut").text(officialDocumentVo.updateTime);//+
	}
	//$("#receiveDate_detaliOut").text(officialDocumentVo.receiveDate);

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
	var commentList = officialDocumentVo.commentList
	if(commentList){
		var tr_html = "";
		$("#outDetial #comment_Info").empty();
		for(var i = 0;i<commentList.length;i++){
			tr_html += "<tr><td>"+commentList[i].receiveName+"</td>"+
			"<td>"+commentList[i].comment+"</td></tr>";
		}
		$("#outDetial #comment_Info").append(tr_html);
		if(attachments){
			officialDocumentVo.attachement = $.map(attachments, function(n){return n.attachmentName});
		}
	}
	if(officialDocumentVo.forwardNumber >0){
		$("#deal-with-btn").text('修改意见')
	}
	
	$("#receive-preview-btn").unbind("click").bind("click", officialDocumentVo, function(e){
		if(isIE()){
			var param = {
					title: "阅办单详情",
					view: "form",
					edit: false,
					toolbars : { //右侧工具栏
						show: true, //是否显示office工具栏
						menu : ["file"], // 右侧工具栏功能 [文件(打印,下载)]
					},
					officialDocumentId: e.data.id,
					officialDocumentType: e.data.typeValue,
					textId: e.data.textId,
					formData: e.data
			}
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	$("#outDetial").modal("show");
}



//外部转发"处理"操作
var forwardId;
var forwardOfficialDocumentId;
function dealWith(){
	forwardId = $("#id_detailOut").val();//公文阅办单ID
	forwardOfficialDocumentId = $("#officialDocumentId_detailOut").val();//公文阅办单收件人表主键ID
	$("#dealWithform").reset();
	$("#dealWithModal").modal("show");
}
//消除页面验证
$('#dealWithModal').on('hide.bs.modal', function() {
	$("#dealWithModal form").each(function() {
		$(this).reset();
	});
})
function addOfficialDocumentOut(){
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
			url : 'oa/officialDocument/forward?forwardId=' + forwardOfficialDocumentId + "&officialDocumentId="+forwardId,
			data : JSON.stringify(data),
		}).done(function(data) {
			if (data.flag == true) {
				getStatusNum();
				resetFileReceiver4();//主送，抄送清空
				alert("发送成功!", resetCustomerForm4);
				$('#dealWithModal').modal('hide');
				$('#outDetial').modal('hide');
			}else if(data.flag == 2){
				resetFileReceiver4();//主送，抄送清空
				alert("保存成功!", resetCustomerForm4);
				$('#dealWithModal').modal('hide');
				$('#outDetial').modal('hide');
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
}
//初始化表单
function resetCustomerForm4() {
	$("#dealWithform").reset();
	$("#dealWithform").data('bootstrapValidator').resetForm();
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

function resetFileReceiver4(){
	$("#mainReceiver").departmentTreeView("setVal",[]);
	$("#copyReceiver").departmentTreeView("setVal",[]);
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

//显示页面问候语
var now = new Date();
var hour = now.getHours();
function showTimePort(){
	if(hour < 6){
		$("#pageTimePoit").text(",凌晨好！");
	} else if (hour < 9){
		$("#pageTimePoit").text(",早上好！！");
	} else if (hour < 12){
		$("#pageTimePoit").text(",上午好！");
	} else if (hour < 14){
		$("#pageTimePoit").text(",中午好！");
	} else if (hour < 17){
		$("#pageTimePoit").text(",下午好！");
	} else if (hour < 19){
		$("#pageTimePoit").text(",傍晚好");
	} else if (hour < 22){
		$("#pageTimePoit").text(",晚上好！");
	} else {
		$("#pageTimePoit").text(",夜里好！");
	} 
}

function isIE() {
    if (window.ActiveXObject || "ActiveXObject" in window){
        return true;
     }else{
         return false;
     }
}







