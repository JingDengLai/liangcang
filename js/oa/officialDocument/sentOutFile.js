var approvers = undefined;
$(function() {
	addOfficialDocument3();
	
	// 发送按钮
	$("#submitBtn1_out").click(function() {
		$("#operation").val("submitBtn1_out");
	});
	// 重置按钮
	$("#submitBtn3_out").click(function() {
		$("#addForm3")[0].reset();
		//初始化表单
		resetCustomerForm3();
		//清空主送抄送
		$("#mainReceiver_out").val("");
		$("#copyReceiver_out").val("");
		resetFileReceiver3();
		//附件重置
		$("#addForm3 .fileInfo").empty();
		$("#douumentUrl_out").val("");
		fileNameArray_out.splice(0,fileNameArray_out.length);
	});

	//外部转发-预览
	$("#addForm3 button[name='preview-btn']").click(function() {
		if(isIE()){
			var formData = $("#addForm3").serializeObject();
			formData.urgencyDegreeName = $("#addForm3 select[name='urgencyDegree'] option[value='"+formData.urgencyDegree+"']").text();
			formData.securityDegreeName = $("#addForm3 select[name='securityDegree'] option[value='"+formData.securityDegree+"']").text();
			formData.textId = $("#addForm3 input[name='textId']").val();
			var fileList = new Array();
			$("#addForm3 div.fileInfo .fileName").each(function(i, k){
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
					officialDocumentType: 3,
					textId: $("#addForm3 input[name='textId']").val(),
					formData: formData
			}
			var option = "dialogHeight:" + screen.height + "px;dialogWidth:" + screen.width + "px;status:no;scroll:no;resizable:no;center:yes";
			var result = window.showModalDialog("office", param, option);
		}else{
			alert("请在IE浏览器下打开");
		}
	});
	
	//添加主送&&抄送
	initTree3();
});


function addOfficialDocument3(){
	$("#addForm3").bootstrapValidator({
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
			sn : {
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
			receiveDate : {
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
		var data = $("#addForm3").serializeObject();
		if ("submitBtn1_out" == operation) {
			data.status ="2";
			$.ajax({
				type : 'POST',
				url : "oa/officialDocument/sentOutOfficialDocument",
				data : JSON.stringify(data),
			}).done(function(data) {
				if (data.flag == true) {
					getStatusNum();
					emptyParameter3();
					alert("发送成功!", resetCustomerForm3);
				} else {
					emptyParameter3();
					alert("发送失败！","warning", resetCustomerForm3);
				}
			}).fail(function(err) {
				emptyParameter3();
				alert("发送失败!", "warning",resetCustomerForm3);
			});
		} 
	});
}

function emptyParameter3(){
	$(".fileInfo").empty();
	fileNameArray_out = [];
	fileNumber_out = 0;
	resetFileReceiver3();//主送，抄送清空
}

//初始化表单
function resetCustomerForm3() {
	$("#addForm3").reset();
	$("#addForm3").data('bootstrapValidator').resetForm();
}

//按钮点击上传文件框
function btnClickFile3(obj){
	$(obj).parent().find("input[name=files]").click();
}

//input点击上传文件框
function inputClickFile3(obj){
	$(obj).parent().find("input[name=files]").click();
	
}

//上传附件事件
var fileNames = "";
function getFileName3(obj){
	$(obj).parent().find("input[name=upload_file_tmp]").val(obj.value);
}

function initTree3() {
	$("#mainReceiver_out").departmentTreeView({title: "选择主送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
		    }
			$("#mainReceiver_out").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson1_out").val(names.substring(0,names.length-1));
			departmentPick3();
		}
	});
	$("#copyReceiver_out").departmentTreeView({title: "选择抄送",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
	    	}
			$("#copyReceiver_out").val(ids.substring(0,ids.length-1));
			$("#receiveFilePerson2_out").val(names.substring(0,names.length-1));
		}
	});
}
//添加主送人
function show1_out() {
	if($("#mainReceiver_out").val()!="" && $("#mainReceiver_out").val()!=null){
		var mainReceiver_out = $("#mainReceiver_out").val().split(",");
		$("#mainReceiver_out").departmentTreeView("setVal",mainReceiver_out);
	}
	$("#mainReceiver_out").departmentTreeView("show");
}
//添加抄送人
function show2_out(){
	if($("#copyReceiver_out").val()!="" && $("#copyReceiver_out").val()!=null){
		var copyReceiver_out = $("#copyReceiver_out").val().split(",");
		$("#copyReceiver_out").departmentTreeView("setVal",copyReceiver_out);
	}
	$("#copyReceiver_out").departmentTreeView("show");
}

function resetFileReceiver3(){
	$("#mainReceiver_out").departmentTreeView("setVal",[]);
	$("#copyReceiver_out").departmentTreeView("setVal",[]);
}


//消除“不能为空”的非空验证提示语(不加提示语还在)
function departmentPick3(){
	$("#addForm3").data('bootstrapValidator')
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

//来文时间验证
function receiveDatePick(){
	$("#addForm3").data('bootstrapValidator')
	.updateStatus('receiveDate', 'NOT_VALIDATED', null)
	.validateField('receiveDate');
}

//文件上传
var fileNameArray_out = [];
var fileNumber_out = 0;
var maxLength = 52428800;
function fileInput_out(fileId,url){
	var files = document.querySelector('#'+fileId);
	var fileCount = 0;
	files.onchange = function() {
		var imgFile = files.files;
		fileNumber_out++;
		if(fileNumber_out>1){
			for(var i=0; i<fileNameArray_out.length; i++){
				if(imgFile[0].name == fileNameArray_out[i]){
					alert("文件不可重复!","warning");
					return;
				}
			}
		}
		fileNameArray_out.push(imgFile[0].name);
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
				
				uploadFile_out(url,imgFile[i]);
			}
		}
		//删除事件
		$(".fileDelete").click(function  () {
			$(this).parent().hide();
			var fileName = $(this).parent().find("span:first").html();
			for(var i=0; i<fileNameArray_out.length; i++){
				if(fileName == fileNameArray_out[i]){
					fileNameArray_out.splice(i,1);
				}
			}
			var douumentUrl_out = $("#douumentUrl_out").val();
			var str = douumentUrl_out.split(",");
			for(var i=0;i<str.length;i++){
				if(str[i].indexOf(fileName)>=0){
					str.splice(i,1);
				}
			}
			
			if(str){
				if(str.length>0){
					
					douumentUrl_out = str.join(",");
				}else{
					douumentUrl_out = str[0];
				}
			}else{
				douumentUrl_out = "";
			}
			$("#douumentUrl_out").val(douumentUrl_out);
			$('#'+fileId).val('');
		})
		
	}
}

function uploadFile_out(url,files){
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
		timeout : 180000,
		contentType: false,
		xhr: xhrOnProgress(function(e){
		    var percent = e.loaded / e.total;//计算百分比
	    	if (percent == 1) {
//				上传进度条
				var fileProgress= $("<span></span>");
				fileProgress.addClass("fileProgress");
				var fileProgressBody = $("<span></span>");
				fileProgress.append(fileProgressBody);
				fileProgressBody.addClass("fileProgressBody")
				$(".fileInfo").append(fileProgress);
				
				var percentRandom = Math.random()*80 + 10;
				fileProgressBody.animate({width: percentRandom + "%"});
		    }
		})
	}).done(function(data) {
		var douumentUrl_out = $("#douumentUrl_out").val();
		if(douumentUrl_out!=""){
			douumentUrl_out=douumentUrl_out+","+data[0].path;
		}else{
			douumentUrl_out = data[0].path;
		}
		$("#douumentUrl_out").val(douumentUrl_out);
		$(".fileProgressBody").animate({width:"100%"},{
			complete: function  () {
				$(this).parent().hide();
	        }
		});
	}).fail(function() {
		alert("文件上传失败!请重试!", "warning");
	});
	
}


























