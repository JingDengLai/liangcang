var approvers = undefined;
$(function() {
	addOfficialDocument2();
	
	// 重置按钮
	$("#submitBtn3_up").click(function() {
		$("#addForm2")[0].reset();
		$("#addForm2 input[name='textId']").val("");
		$("#addForm2 button[name='text-btn']").text("添加正文");
		//初始化表单
		resetCustomerForm2();
		//清空主送抄送
		$("#mainReceiver_up").val("");
		$("#copyReceiver_up").val("");
		resetFileReceiver2();
		//附件重置
		$("#addForm2 .fileInfo").empty();
		$("#douumentUrl_up").val("");
		fileNameArray_up.splice(0,fileNameArray_up.length);
	});

	//上行文-正文
	$("#addForm2 button[name='text-btn']").click(function() {
		if(isIE()){
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var param = {
				title: $("#addForm2 button[name='text-btn']").text(),
				view: "text",
				edit : true, //是否可编辑
				toolbars : { //右侧工具栏
					show: true, //是否显示office工具栏
					menu : ["textHeader","file"], // 右侧工具栏功能 [套红,文件(打印,下载)]
				},
				textId: $("#addForm2 input[name='textId']").val()
			};
			var result = window.showModalDialog("office", param, option);
			if(result){
				var obj = JSON.parse(result);
				if(obj){
					$("#addForm2 input[name='textId']").val(obj.textId);
					$("#addForm2 button[name='text-btn']").text("修改正文");
				}
			}
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	//上行文-预览
	$("#addForm2 button[name='preview-btn']").click(function() {
		if(isIE()){
			var formData = $("#addForm2").serializeObject();
			formData.urgencyDegreeName = $("#addForm2 select[name='urgencyDegree'] option[value='"+formData.urgencyDegree+"']").text();
			formData.securityDegreeName = $("#addForm2 select[name='securityDegree'] option[value='"+formData.securityDegree+"']").text();
			formData.textId = $("#addForm2 input[name='textId']").val();
			var fileList = new Array();
			$("#addForm2 div.fileInfo .fileName").each(function(i, k){
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
					officialDocumentType: 2,
					textId: $("#addForm2 input[name='textId']").val(),
					formData: formData
			}
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var result = window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	//添加主送&&抄送
	initTree2();
});

function addOfficialDocument2(){
	$("#addForm2").bootstrapValidator({
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
		var data = $("#addForm2").serializeObject();
		data.nextApprovers = $("#approverDiv_up").staffView('getVal');
		if ("submitBtn1_up" == operation) {
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
					emptyParameter2();
					alert("申请成功!", resetCustomerForm2);
				} else {
					emptyParameter2();
					alert("申请失败！","warning", resetCustomerForm2);
				}
			}).fail(function(err) {
				emptyParameter2();
				alert("申请失败!", "warning",resetCustomerForm2);
			});
		} else if ("submitBtn2_up" == operation) {
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
					getStatusNum();
					emptyParameter2();
					alert("已保存到草稿箱!", resetCustomerForm2);
				} else {
					emptyParameter2();
					alert("保存草稿箱失败！","warning", resetCustomerForm2);
				}
			}).fail(function(err) {
				emptyParameter2();
				alert("保存草稿箱失败!", "warning",resetCustomerForm2);
			});
		} 
	});
}

function emptyParameter2(){
	$(".fileInfo").empty();
	fileNameArray_up = [];
	fileNumber_up = 0;
	resetFileReceiver2();//主送，抄送清空
}

//初始化表单
function resetCustomerForm2() {
	$("#addForm2").reset();
	$("#addForm2").data('bootstrapValidator').resetForm();
	$("#approverDiv_up").staffView('setVal',approvers);
}

//取消添加人员插件在添加了人的情况下，“不能为空”的非空验证提示语(不加提示语还在)
function signingDatePick(){
	$("#addForm2").data('bootstrapValidator')
	.updateStatus('receiveFilePerson1', 'NOT_VALIDATED', null)
	.validateField('receiveFilePerson1');
}

//按钮点击上传文件框
function btnClickFile2(obj){
	$(obj).parent().find("input[name=files]").click();
}

//input点击上传文件框
function inputClickFile2(obj){
	$(obj).parent().find("input[name=files]").click();
	
}

//上传附件事件
var fileNames = "";
function getFileName2(obj){
	$(obj).parent().find("input[name=upload_file_tmp]").val(obj.value);
}

function initTree2() {
	$("#mainReceiver_up").departmentTreeView({title: "选择主送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
		    }
			$("#mainReceiver_up").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson1_up").val(names.substring(0,names.length-1));
			departmentPick2();
		}
	});
	$("#copyReceiver_up").departmentTreeView({title: "选择抄送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
	    	}
			$("#copyReceiver_up").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson2_up").val(names.substring(0,names.length-1));
		}
	});
}
//添加主送人
function show1_up() {
	if($("#mainReceiver_up").val()!="" && $("#mainReceiver_up").val()!=null){
		var mainReceiver_up = $("#mainReceiver_up").val().split(",");
		$("#mainReceiver_up").departmentTreeView("setVal",mainReceiver_up);
	}
	$("#mainReceiver_up").departmentTreeView("show");
}
//添加抄送人
function show2_up(){
	if($("#copyReceiver_up").val()!="" && $("#copyReceiver_up").val()!=null){
		var copyReceiver_up = $("#copyReceiver_up").val().split(",");
		$("#copyReceiver_up").departmentTreeView("setVal",copyReceiver_up);
	}
	$("#copyReceiver_up").departmentTreeView("show");
}

function resetFileReceiver2(){
	$("#mainReceiver_up").departmentTreeView("setVal",[]);
	$("#copyReceiver_up").departmentTreeView("setVal",[]);
}

//消除“不能为空”的非空验证提示语(不加提示语还在)
function departmentPick2(){
	$("#addForm2").data('bootstrapValidator')
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

//文件上传
var fileNameArray_up = [];
var fileNumber_up = 0;
var maxLength = 52428800;
function fileInput_up(fileId,url){
	var files = document.querySelector('#'+fileId);
	var fileCount = 0;
	files.onchange = function() {
		var imgFile = files.files;
		fileNumber_up++;
		if(fileNumber_up>1){
			for(var i=0; i<fileNameArray_up.length; i++){
				if(imgFile[0].name == fileNameArray_up[i]){
					alert("文件不可重复!","warning");
					return;
				}
			}
		}
		fileNameArray_up.push(imgFile[0].name);
		fileCount += imgFile.length;
		for (var i = 0; i < imgFile.length; i++) {
			if(imgFile[i].size > maxLength){
				alert("文件大小不能超过50M！");
				return
			} else{
//			每一个选择的文件
				var fileContainer = $("<div></div>");
				$("#"+fileId).siblings(".fileInfo").append(fileContainer);
				fileContainer.addClass("fileContainer");
//			文件名
				var fileName= $("<span></span>");
				fileContainer.append(fileName);
				fileName.addClass("fileName");
				fileName.text(imgFile[i].name);
//			文件大小 
				var fileSize= $("<span></span>");
				fileContainer.append(fileSize);
				var fileSizeKb = imgFile[i].size / 1024;
				fileSize.addClass("fileSize");
				fileSize.text("(" + fileSizeKb.toFixed(2) + "KB)");
				
//			删除按钮
				var fileDelete = $("<span></span>");
				fileContainer.append(fileDelete);
				fileDelete.addClass("fileDelete");
				fileDelete.text("删除");
				
				uploadFile_up(url,imgFile[i]);
			}
		}
		//删除事件
		$(".fileDelete").click(function  () {
			$(this).parent().hide();
			var fileName = $(this).parent().find("span:first").html();
			for(var i=0; i<fileNameArray_up.length; i++){
				if(fileName == fileNameArray_up[i]){
					fileNameArray_up.splice(i,1);
				}
			}
			var douumentUrl_up = $("#douumentUrl_up").val();
			var str = douumentUrl_up.split(",");
			for(var i=0;i<str.length;i++){
				if(str[i].indexOf(fileName)>=0){
					str.splice(i,1);
				}
			}
			
			if(str){
				if(str.length>0){
					
					douumentUrl_up = str.join(",");
				}else{
					douumentUrl_up = str[0];
				}
			}else{
				douumentUrl_up = "";
			}
			$("#douumentUrl_up").val(douumentUrl_up);
			$('#'+fileId).val('');
		})
		
	}
}

function uploadFile_up(url,files){
	var xhrOnProgress=function(fun) {
		  xhrOnProgress.onprogress = fun; //绑定监听
		  //使用闭包实现监听绑
		  return function() {
		    //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
		    var xhr = $.ajaxSettings.xhr();
		    //判断监听函数是否为函数
		    if (typeof xhrOnProgress.onprogress !== 'function')
		      return xhr;
		    //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
		    if (xhrOnProgress.onprogress && xhr.upload) {
		      xhr.upload.onprogress = xhrOnProgress.onprogress;
		    }
		    return xhr;
		  }
	}
	var formData = new FormData();
	formData.append("files", files);
	$.ajax({
		url : url,
		type : 'POST',
		dataType : "json",
		data : formData,
		processData: false,
		timeout: 180000,
		contentType: false,
		xhr: xhrOnProgress(function(e){
		    var percent = e.loaded / e.total;//计算百分比
		    console.log(e);
	    	if (percent == 1) {
//				上传进度条
				var fileProgress= $("<span></span>");
				fileProgress.addClass("fileProgress");
				var fileProgressBody = $("<span></span>");
				fileProgress.append(fileProgressBody);
				fileProgressBody.addClass("fileProgressBody")
				$(".fileInfo").append(fileProgress);
				
				var percentRandom = Math.random()*80 + 10;
				console.log(percentRandom);
				fileProgressBody.animate({width: percentRandom + "%"});
		    }
		})
	}).done(function(data) {
		var douumentUrl_up = $("#douumentUrl_up").val();
		if(douumentUrl_up!=""){
			douumentUrl_up=douumentUrl_up+","+data[0].path;
		}else{
			douumentUrl_up = data[0].path;
		}
		$("#douumentUrl_up").val(douumentUrl_up);
		$(".fileProgressBody").animate({width:"100%"},{
			complete: function  () {
				$(this).parent().hide();
	        }
		});
	}).fail(function() {
		alert("文件上传失败!请重试!", "warning");
	});
	
}

