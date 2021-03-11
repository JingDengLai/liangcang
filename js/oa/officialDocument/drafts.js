$(function() {
	//初始化列表
	initTable(1);
	//初始化发文申请
	approvalOfficialDocument();
	
	//添加主送&&抄送
	initTree();
	
	// 修改按钮
	$("#edit").click(function() {
		fileInput("file1","oa/officialDocument/upload/files");
		var row = $("#table").bootstrapTable("getSelections");
		if (row.length == 0) {
			alert("请选择要修改的记录!","warning");
			return;
		}else if (row.length > 1) {
			alert("请选择一条要修改的记录!","warning");
			return;
		}else{
			$("#myModalLabel").html("编辑");
			$.each(row, function(index, items) {
				getOfficialDocumentDetail(items.id, items.typeValue);
			})
		}
	});
	
});


//列表
function initTable(status){
	$("#table").bootstrapTable({
		url: "oa/officialDocument/draftsList?status="+status, // 后台请求的url
		method : 'get', // 请求方式（*）
		height: getHeight(),// 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetail
		},{
			title: "类型",
			field: "type"
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
			title: "拟稿",
			field: "drafter",
			formatter: formatSubstring
		},{
			title: "核稿",
			field: "reviewer",
			formatter: formatSubstring
		},{
			title: "校对",
			field: "verifier",
			formatter: formatSubstring
		},{
			title: "拟稿单位",
			field: "department",
			formatter: formatSubstring
		},{
			title: "创建时间",
			field: "createTime"
		}]
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
     
//根据id获取详情
function getOfficialDocumentDetail(id,typeValue) {
	$.ajax({
		url : 'oa/officialDocument/' + id +'/' + typeValue,
		type : 'GET',
	}).done(function(data) {
		if (null != data.officialDocumentVo) {
			var officialDocumentVo = data.officialDocumentVo;
			setEidtPage(officialDocumentVo);
			var attachments = data.attachments;
			$(".fileInfo").empty();
			setDoucumentUrl(attachments);
		}
	}).fail(function() {
		alert('草稿箱信息获取失败!',"warning");
	});
}
//编辑页面
function setEidtPage(officialDocumentVo) {
	$("#editOfficialDocumentForm #id").val(officialDocumentVo.id);
	$("#officialNo").val(officialDocumentVo.officialNo);
	$("#title").val(officialDocumentVo.title);
	$("#securityDegree").val(officialDocumentVo.securityDegree);
	$("#urgencyDegree").val(officialDocumentVo.urgencyDegree);
	$("#mainReceiver").val(officialDocumentVo.mainReceiver);
	$("#receiveFilePerson1").val(officialDocumentVo.receiveFilePerson1);
	$("#copyReceiver").val(officialDocumentVo.copyReceiver);
	$("#receiveFilePerson2").val(officialDocumentVo.receiveFilePerson2);
	$("#department").val(officialDocumentVo.department);
	$("#drafter").val(officialDocumentVo.drafter);
	$("#reviewer").val(officialDocumentVo.reviewer);
	$("#verifier").val(officialDocumentVo.verifier);
	$("#printingDepartment").val(officialDocumentVo.printingDepartment);
	$("#count").val(officialDocumentVo.count);
	$("#sendTime").val(officialDocumentVo.sendTime);
	$("#status").val(officialDocumentVo.status);
	
	$("#editOfficialDocumentForm button[name='text-btn']").unbind("click").bind("click", function(e) {
		if(isIE()){
			var formData = $("#editOfficialDocumentForm").serializeObject();
			formData.typeValue="1";
			formData.urgencyDegreeName = $("#editOfficialDocumentForm select[name='urgencyDegree'] option[value='"+formData.urgencyDegree+"']").text();
			formData.securityDegreeName = $("#editOfficialDocumentForm select[name='securityDegree'] option[value='"+formData.securityDegree+"']").text();
			formData.textId = $("#editOfficialDocumentForm input[name='textId']").val();
			var fileList = new Array();
			$("#editOfficialDocumentForm div.fileInfo .fileName").each(function(i, k){
				fileList.push($(k).text());
			});
			formData.attachement = fileList;
			
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var param = {
				title: "公文正文编辑",
				view: "text",
				edit : true, //是否可编辑
				toolbars : { //右侧工具栏
					show: true, //是否显示office工具栏
					menu : ["textHeader","file"], // 右侧工具栏功能 [套红,文件(打印,下载)]
				},
				officialDocumentId: formData.id,
				textId: formData.textId
			};
			window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	$('#previewBtn').unbind("click").bind("click", function(e) {
		if(isIE()){
			
			var formData = $("#editOfficialDocumentForm").serializeObject();
			formData.typeValue="1";
			formData.urgencyDegreeName = $("#editOfficialDocumentForm select[name='urgencyDegree'] option[value='"+formData.urgencyDegree+"']").text();
			formData.securityDegreeName = $("#editOfficialDocumentForm select[name='securityDegree'] option[value='"+formData.securityDegree+"']").text();
			formData.textId = $("#editOfficialDocumentForm input[name='textId']").val();
			var fileList = new Array();
			$("#editOfficialDocumentForm div.fileInfo .fileName").each(function(i, k){
				fileList.push($(k).text());
			});
			formData.attachement = fileList;
			
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var param = {
				title: "公文预览",
				view: "form",
				edit : false, //是否可编辑
				toolbars : { //右侧工具栏
					show: true, //是否显示office工具栏
					menu : ["file"], // 右侧工具栏功能 [套红,文件(打印,下载)]
				},
				officialDocumentId: formData.id,
				textId: formData.textId,
				formData: formData
			};
			window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	$('#myModel').modal('show');
}

$('#saveBtn').click(function() {
	$.ajax({
		type : 'PUT',
		url : "oa/officialDocument",
		data : $('#editOfficialDocumentForm').serializeJson()
	}).done(function(data) {
		$('#myModel').modal('hide');
		if (data.flag == true) {
			alert("修改成功!");
		} else {
			alert("修改失败！", "warning");
		}
		$('#table').bootstrapTable('refresh');
	}).fail(function(err) {
		alert("修改失败!","warning");
	}).always(function() {
		$('#table').bootstrapTable('refresh');
		$("#editOfficialDocumentForm").reset();
	});
});

function approvalOfficialDocument(){
	$("#editOfficialDocumentForm").bootstrapValidator({
		group:".form-group,.receiveFile",
		fields:{
			officialNo : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			urgencyDegree:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			securityDegree:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			receiveFilePerson1:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			title : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 64,
						message: '字符必须在1到64位之间'
					}
				}
			},
			department:{
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			drafter:{
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			reviewer:{
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
			},
			verifier:{
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
		    },
		    printingDepartment:{
		    	validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 32,
						message: '字符必须在1到32位之间'
					}
				}
		    },
		    count:{
		    	validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:5, message:"不能超过5个字符"},
					regexp:{regexp:/^\+?[1-9][0-9]*$/,message:"只能填写数字"}
				}
		    }
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
			$("#status").val("2");//待审批
			$.ajax({
				type : 'PUT',
				url : "oa/officialDocument",
				data : $("#editOfficialDocumentForm").serializeJson(),
			}).done(function(data) {
				$('#myModel').modal('hide');
				if (data.flag == true) {
					getStatusNum();
					alert("申请成功!");
				} else {
					alert("申请失败！","warning");
				}
				$('#table').bootstrapTable('refresh');
			}).fail(function(err) {
				alert("申请失败!", "warning");
			});
	});
}


//按钮点击上传文件框
function btnClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
}

//input点击上传文件框
function inputClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
	
}

//上传附件事件
var fileNames = "";
function getFileName(obj){
	$(obj).parent().find("input[name=upload_file_tmp]").val(obj.value);
}

function setDoucumentUrl( attachments ){
	if(attachments){
		var arrPath = [];
		var arrName = [];
		for (var i = 0; i < attachments.length; i++) {
			arrPath.push(attachments[i].attachmentUrl);
			arrName.push(attachments[i].attachmentName);
		}
		if($("#douumentUrl")){
			var douumentUrl = arrPath.join(",");
			$("#douumentUrl").val(douumentUrl);
		}
		if($(".fileInfo")){
			for (var j = 0; j < arrName.length; j++) {
				var fileContainer = $("<div></div>");
				$(".fileInfo").append(fileContainer);
				fileContainer.addClass("fileContainer");
//				文件名
				var fileName= $("<span></span>");
				fileContainer.append(fileName);
				fileName.addClass("fileName");
				fileName.text(arrName[j]);
				var fileDelete = $("<span></span>");
				fileContainer.append(fileDelete);
				fileDelete.addClass("fileDelete");
				fileDelete.text("删除");
			}
			
			$(".fileDelete").click(function  () {
				$(this).parent().hide();
				var fileName = $(this).parent().find("span:first").html();
				var douumentUrl = $("#douumentUrl").val();
				var str = douumentUrl.split(",");
				for(var i=0;i<str.length;i++){
					if(str[i].indexOf(fileName)>=0){
						str.splice(i,1);
					}
				}
				
				if(str){
					if(str.length>0){
						
						douumentUrl = str.join(",");
					}else{
						douumentUrl = str[0];
					}
				}else{
					douumentUrl = "";
				}
				$("#douumentUrl").val(douumentUrl);
				$('#file1').val('');
			})
		}
	}
	
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
			departmentPick();
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
function show1() {
	if($("#mainReceiver").val()!="" && $("#mainReceiver").val()!=null){
		var mainReceiver = $("#mainReceiver").val().split(",");
		$("#mainReceiver").departmentTreeView("setVal",mainReceiver);
	}
	$("#mainReceiver").departmentTreeView("show");
}
//添加抄送人
function show2(){
	if($("#copyReceiver").val()!="" && $("#copyReceiver").val()!=null){
		var copyReceiver = $("#copyReceiver").val().split(",");
		$("#copyReceiver").departmentTreeView("setVal",copyReceiver);
	}
	$("#copyReceiver").departmentTreeView("show");
}


//消除“不能为空”的非空验证提示语(不加提示语还在)
function departmentPick(){
	$("#editOfficialDocumentForm").data('bootstrapValidator')
	.updateStatus('receiveFilePerson1', 'NOT_VALIDATED', null)
	.validateField('receiveFilePerson1');
}

function isIE() {
    if (window.ActiveXObject || "ActiveXObject" in window){
        return true;
     }else{
         return false;
     }
}

