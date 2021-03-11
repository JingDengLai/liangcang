var approvers = undefined;
$(function() {
	addOfficialDocument();
	
	// 重置按钮
	$("#submitBtn3").click(function() {
		$("#addForm")[0].reset();
		$("#addForm input[name='textId']").val("");
		$("#addForm button[name='text-btn']").text("添加正文");
		//初始化表单
		resetCustomerForm();
		//清空主送抄送
		$("#mainReceiver").val("");
		$("#copyReceiver").val("");
		resetFileReceiver();
		//附件重置
		$("#addForm .fileInfo").empty();
		$("#douumentUrl").val("");
		fileNameArray.splice(0,fileNameArray.length);
	});
	
	//内部发文-正文
	$("#addForm button[name='text-btn']").click(function() {
		if(isIE()){
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var param = {
				title: $("#addForm button[name='text-btn']").text(),
				view: "text",
				edit : true, //是否可编辑
				toolbars : { //右侧工具栏
					show: true, //是否显示office工具栏
					menu : ["textHeader","file"], // 右侧工具栏功能 [套红,文件(打印,下载)]
				},
				textId: $("#addForm input[name='textId']").val()
			};
			var result = window.showModalDialog("office", param, option);
			if(result){
				var obj = JSON.parse(result);
				if(obj){
					$("#addForm input[name='textId']").val(obj.textId);
					$("#addForm button[name='text-btn']").text("修改正文");
				}
			}
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	//内部发文-预览
	$("#addForm button[name='preview-btn']").click(function() {
		if(isIE()){
			var formData = $("#addForm").serializeObject();
			formData.typeValue="1";
			formData.urgencyDegreeName = $("#addForm select[name='urgencyDegree'] option[value='"+formData.urgencyDegree+"']").text();
			formData.securityDegreeName = $("#addForm select[name='securityDegree'] option[value='"+formData.securityDegree+"']").text();
			formData.textId = $("#addForm input[name='textId']").val();
			var fileList = new Array();
			$("#addForm div.fileInfo .fileName").each(function(i, k){
				fileList.push($(k).text());
			});
			formData.attachement = fileList;

			var param = {
					title: "公文预览",
					view: "form",
					edit: false,
					save: false,
					toolbars : { //右侧工具栏
						show: true, //是否显示office工具栏
						menu : ["file"], // 右侧工具栏功能 [文件(打印,下载)]
					},
					officialDocumentType: 1,
					textId: $("#addForm input[name='textId']").val(),
					formData: formData
			}
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var result = window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	//添加主送&&抄送
	initTree();
	
});

function addOfficialDocument(){
	$("#addForm").bootstrapValidator({
		group:".form-group,.receiveFile",
		fields:{
			officialNo : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
						min: 1,
						max: 12,
						message: '字符必须在1到12位之间'
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
		var operation = $("#operation").val();
		var data = $("#addForm").serializeObject();
		data.nextApprovers = $("#approverDiv").staffView('getVal');
		if ("submitBtn1" == operation) {
			var sentFileType = $("input[name='sentFileType'][checked]").val();//发文类型
			data.type = sentFileType;
			data.status ="2";
			$("#status").val("2");//待审批
			$.ajax({
				type : 'POST',
				url : "oa/officialDocument/sentOfficialDocument",
				data : JSON.stringify(data),
			}).done(function(data) {
				if (data.flag == true) {
					getStatusNum();
					emptyParameter();
					alert("申请成功!", resetCustomerForm);
					$("#addForm button[name='text-btn']").text("添加正文");
				} else {
					emptyParameter();
					alert("申请失败！","warning", resetCustomerForm);
				}
			}).fail(function(err) {
				emptyParameter();
				alert("申请失败!", "warning",resetCustomerForm);
			});
		} else if ("submitBtn2" == operation) {
			var sentFileType = $("input[name='sentFileType'][checked]").val();//发文类型
			data.type = sentFileType;
			data.status ="1";
			$("#status").val("1");//草稿箱
			$.ajax({
				type : 'POST',
				url : "oa/officialDocument/sentOfficialDocument",
				data : JSON.stringify(data)
			}).done(function(data) {
				if (data.flag == true) {
					emptyParameter();
					alert("已保存到草稿箱!", resetCustomerForm);
					$("#addForm button[name='text-btn']").text("添加正文");
					getStatusNum();
				} else {
					emptyParameter();
					alert("保存草稿箱失败！","warning", resetCustomerForm);
				}
			}).fail(function(err) {
				emptyParameter();
				alert("保存草稿箱失败!", "warning",resetCustomerForm);
			});
		} 
	});
}

function emptyParameter(){
	$(".fileInfo").empty();
	fileNameArray = [];//清空存放附件名称的数组(fileNameArray在common.js中定义)
	fileNumber = 0;//(fileNumber在common.js中定义)
	resetFileReceiver();//主送，抄送清空
}

//初始化表单
function resetCustomerForm() {
	$("#addForm").reset();
	$("#addForm").data('bootstrapValidator').resetForm();
	$("#approverDiv").staffView('setVal',approvers);

}

//取消添加人员插件在添加了人的情况下，“不能为空”的非空验证提示语(不加提示语还在)
function signingDatePick(){
	$("#addForm").data('bootstrapValidator')
	.updateStatus('receiveFilePerson1', 'NOT_VALIDATED', null)
	.validateField('receiveFilePerson1');
}

//按钮点击上传文件框
function btnClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
}

//上传附件事件
var fileNames = "";
function getFileName(obj){
	$(obj).parent().find("input[name=upload_file_tmp]").val(obj.value);
}

//input点击上传文件框
function inputClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
	
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

function resetFileReceiver(){
	$("#mainReceiver").departmentTreeView("setVal",[]);
	$("#copyReceiver").departmentTreeView("setVal",[]);
}


//消除“不能为空”的非空验证提示语(不加提示语还在)
function departmentPick(){
	$("#addForm").data('bootstrapValidator')
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
