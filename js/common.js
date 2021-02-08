


document.write("<script language=javascript src='../components/socket/stomp.min.js'></script>");
document.write("<script language=javascript src='../components/socket/sockjs.min.js'></script>");
document.write("<script language=javascript src='../components/bootstrapValidator/bootstrapValidator.js'></script>");
document.write("<script language=javascript src='../components/bootstrapValidator/bootstrapValidator.language.zh_CN.js.js'></script>");
document.write("<script language=javascript src='../js/config/config.js'></script>");
$(function() {

	/* scrollBarInit(); */

	ajaxInit();

	serializeJsonInit();

	formResetInit();

	alertAjaxErrorInit();

	clockInit();

	modalOpenInit();

	windowResizeInit();

	bootstrapTableInit();

	// connect();

	getPendingCount();

	getMyOfficerCount();

	getWaringCount();

	initMyPending();

	initPasswordForm();

	alertInit();

	confirmInit();

	getLastlyWeather();


});

function bootstrapTableInit() {
	var setttings = {
		toolbar : '#toolbar',
		method : 'get', // 请求方式（*）
		striped : true, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : true, // 是否显示分页（*）
		paginationLoop: false,
		sortable : true, // 是否启用排序
		sortOrder : "desc", // 排序方式
		searchTimeOut: 10000,
		queryParams : function(params) {
			var p = $("#searchform").serializeObject();
			var page = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				limit : params.limit, // 页面大小
				offset : params.offset, // 页码
			};
			p = $.extend(p, page);
			return p;
		},// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		pageList : [ 10, 20 ], // 可供选择的每页的行数（*）
		strictSearch : false, // 搜索模式false 模糊搜索
		clickToSelect : true, // 是否启用点击选中行
		height : $(window).height() - $('.header').outerHeight(true)
				- $('#header').outerHeight(true), // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "id", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false,
		onLoadError:function(status){
			switch (status) {
			case (401):
				alert("用户未登录",function(){
					window.location.href = getRootPath_dc() + "/login";
						});
				break;
			case (403):
				alert("用户无权限执行此操作",function(){
					window.history.go(-1);
					});
				break;
			case (408):
				alert("请求超时");
				break;
			case (500):
				alert("服务器系统内部错误");
				break;
			}
		}
	// 是否显示父子表
	};
	try {
		$.extend($.fn.bootstrapTable.defaults, setttings);
	} catch (e) {
	}
}

function modalOpenInit() {

	$(".modal").each(function() {

		$(this).on('show.bs.modal', function() {
			try {
				$(this).draggable({
			        handle: ".modal-header",
			        cursor: "move"
			    });
				$("#table").bootstrapTable(
						'resetView');
			} catch (e) {
			}
		});

		$(this).on('hidden.bs.modal', function() {
			try {
				$("#table").bootstrapTable(
						'resetView');
			} catch (e) {
			}
		});
	});
}
function windowResizeInit() {
	$(window).resize(
			function() {
				try {
					$("#table").bootstrapTable(
							'resetView',
							{
								height : $(window).height()
										- $('.header').outerHeight(true)
										- $('#header').outerHeight(true)
							});
				} catch (e) {
				}
			});
}
/*
 * function scrollBarInit() { try { $(".content-wrapper").mCustomScrollbar(); }
 * catch (e) { } }
 */

function ajaxInit() {
	$.ajaxSetup({
		contentType : "application/json",
		cache : false,
		timeout : 10000,
		beforeSend : function() {
		},
		complete : function() {
		},
		error : function(jqXHR, textStatus, errorMsg) {
			console.log("error", jqXHR);
			switch (jqXHR.status) {
			case (401):
				alert("用户未登录",function(){
					window.location.href = getRootPath_dc() + "/login";
						});
				break;
			case (403):
				alert("用户无权限执行此操作",function(){
					window.history.go(-1);
					});
				break;
			case (408):
				alert("请求超时");
				break;
			case (500):
				alert("服务器系统内部错误");
				break;
			}
		}
	});
}

function serializeJsonInit() {
	$.fn.serializeObject = function() {
		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(array).each(
				function() {
					if (this.value) {
						if (serializeObj[this.name]) {
							if ($.isArray(serializeObj[this.name])) {
								serializeObj[this.name].push(this.value.trim());
							} else {
								serializeObj[this.name] = [
										serializeObj[this.name], this.value.trim() ];
							}
						} else {
							serializeObj[this.name] = this.value.trim();
						}
					}
				});
		return serializeObj;
	};
	$.fn.serializeJson = function() {
		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(array).each(
				function() {
					if (serializeObj[this.name]) {
						if ($.isArray(serializeObj[this.name])) {
							serializeObj[this.name].push(this.value);
						} else {
							serializeObj[this.name] = [
									serializeObj[this.name], this.value ];
						}
					} else {
						serializeObj[this.name] = this.value;
					}
				});
		return JSON.stringify(serializeObj);
	};
}

function formResetInit() {
	$.fn.reset = function() {
		if ($(this).length > 0) {
			$(this)[0].reset();
			$(this).find('input[type="hidden"]').each(function(i, input) {
				$(input).removeAttr("value");
			});
			try {
				$(this).data('bootstrapValidator').resetForm();
			} catch (e) {
			}
		}
	};
}

function alertInit() {
	var alertHtml = '<div class="alert-controller"><div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog alert-modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
			+ '<h4 class="modal-title">提示</h4></div><div class="modal-body"><div class="zcqr_body"><i></i><span class="alertMsg"></span></div>'
			+ '</div><div class="modal-footer">'
			+ '</div></div></div></div></div>';
	$("body").append(alertHtml);
	window.alert = function(msg, param1, param2, timer) {
		var _callback,_type;
		timer = timer?timer:2000;

		if(typeof param1 === 'function'){
			_callback = param1;
		}else if(typeof param2 === 'function'){
			_callback = param2;
		}

		if(typeof param1 === 'string'){
			_type = param1;
		}else if(typeof param2 === 'string'){
			_type = param2;
		}

		if(_type && _type === "warning"){
			$("#alertModal div.zcqr_body").removeClass("success").addClass("warning");
		}else{
			$("#alertModal div.zcqr_body").removeClass("warning").addClass("success");
		}
		$("#alertModal .alertMsg").text(msg);
		$("#alertModal").modal('show');

		if (_callback) {
			$('#alertModal').unbind("hide.bs.modal").bind("hide.bs.modal",
					function() {
						_callback();
					});
		}

		setTimeout(function() {
			$("#alertModal").modal('hide');
		}, timer);
	}
}

function confirmInit() {
	var confirmHtml = '<div class="alert-controller"><div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog confirm-modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
			+ '<h4 class="modal-title">提示</h4></div><div class="modal-body"><div class="zcqr_body warnning"><i></i><span class="confirmMsg"></span></div>'
			+ '</div><div class="modal-footer"><button type="button" id="confirmBtn" class="btn btn-default zcqrisok" data-dismiss="modal">确认</button>'
			+ '<button type="button" data-dismiss="modal" class="btn cancle" aria-hidden="true">取消</button></div></div></div></div></div>';
	$("body").append(confirmHtml);
	window.confirm = function(msg, callback) {
		$("#confirmModal .confirmMsg").text(msg);
		$("#confirmModal #confirmBtn").unbind("click").bind("click",
				function() {
					$("#confirmModal").modal('hide');
					callback();
				})
		$("#confirmModal").modal('show');
	}
}

function alertAjaxErrorInit() {
	window.alertAjaxError = function(xhr) {
		if (xhr && xhr.responseText) {
			var json = $.parseJSON(xhr.responseText);
			if (json && json.errors) {
				alert(json.errors.detail);
			}
		}
	}
}

function clockInit() {
	var clientTime = new Date();
	var serverTime = null;
	try {
		serverTime = new Date($("#server-time").val());
	} catch (e) {
		serverTime = new Date();
	}

	var flag = false;
	setInterval(function() {
		var nowWeek;
		var nowDate;
		var nowTime;

		var now = new Date(serverTime.getTime() + (new Date() - clientTime));

		var year = now.getFullYear(); // 年
		var month = now.getMonth() + 1; // 月
		var day = now.getDate(); // 日
		var week = now.getDay();

		var hh = now.getHours(); // 时
		var mm = now.getMinutes(); // 分
		var ss = now.getSeconds(); // 秒

		nowDate = year + "年";

		if (month < 10)
			nowDate += "0";

		nowDate += month + "月";

		if (day < 10)
			nowDate += "0";

		nowDate += day + "日";

		var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
		nowWeek = " 星期" + Week[week] + " ";

		if (hh < 10) {
			nowTime = "0" + hh + (flag ? ":" : " ");
		} else {
			nowTime = hh + (flag ? ":" : " ");
		}

		if (mm < 10)
			nowTime += '0';
		nowTime += mm;

		flag = !flag;

		var currentTime = nowDate + " " + nowWeek + " &nbsp;&nbsp;&nbsp;&nbsp;"
				+ nowTime;

		$("#nowWeek").html(nowWeek);
		$("#nowDate").html(nowDate);
		$("#nowTime").html(nowTime);
	}, 500);
}


function getPendingCount(){
	$.ajax({
		url : "pending/getPendingCount",
		type : 'GET',
		dataType : "json",
		async:true
	}).done(function(data) {
		$("#pendingCount").text(data.content);
		if($("#myPendingCount")){
			$("#myPendingCount").text(data.content);
		}
		return;

	}).fail(function() {
		console.log("审批个数请求失败！");
		return;
	});
}

function getMyOfficerCount(){
	$.ajax({
		url : "oa/getMyOfficerCount",
		type : 'GET',
		dataType : "json",
		async:true
	}).done(function(data) {

		$("#myOfficerCount").text(data.content);
		getMyInfoCount();
		return;

	}).fail(function() {
		console.log("公文个数请求失败！");
		return;
	});
}

function getWaringCount(){
	$.ajax({
		url : "warning/getWaringCount",
		type : 'GET',
		dataType : "json",
		async:true
	}).done(function(data) {

		$("#waringCount").text(data.content);
		getMyInfoCount();
		return;

	}).fail(function() {
		console.log("预警个数请求失败！");
		return;
	});
}

function getLastlyWeather(){
	$.ajax({
		url : "common/getLastlyWeather",
		type : 'GET',
		dataType : 'json',
		asyn:true
	}).done(function(data){
		if(data.record){
			var record = data.record;
			if(record.temperatureValue!=null){
				$("#myLastlyTemp").text(record.temperatureValue+"℃");
			}
			if(record.humidityValue!=null){
				$("#myLastlyHumity").text(record.humidityValue+"%");
			}
		}
	}).fail(function(){
		console.log("获取天气失败！");
		return;
	});
}

function getMyInfoCount(){
	var myOfficerCount = $("#myOfficerCount").text();
	var waringCount = $("#waringCount").text();
	var count = parseInt(waringCount)+parseInt(myOfficerCount);
	$("#myInfoCount").text(count);
}

var stompClient = null;

function connect() {
	disconnect();

	var socket = new SockJS(sgmp_websocket+'/sgmp-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function (frame) {
		stompClient.subscribe('/topic/pending', function (msg) {
			var headStaffId = $("#headStaffId").val();
			var contentType = JSON.parse(msg.body).contentType;
			var pendingStaffId = JSON.parse(msg.body).pendingStaffId;
			if(contentType === "1"){

					if(pendingStaffId.length >0){
						for (var i = 0; i < pendingStaffId.length; i++) {
							if(pendingStaffId[i]===parseInt(headStaffId)){
								getPendingCount();
							}
						}
					}



			}
			if(contentType === "2"){

				if(pendingStaffId.length >0){
					for (var i = 0; i < pendingStaffId.length; i++) {
						if(pendingStaffId[i]===parseInt(headStaffId)){
							getMyOfficerCount();
						}
					}
				}
			}

			if(contentType === "3"){

				if(pendingStaffId.length >0){
					for (var i = 0; i < pendingStaffId.length; i++) {
						if(pendingStaffId[i]===parseInt(headStaffId)){
							getWaringCount();
						}
					}
				}
			}
			if(contentType === "4"){

				if(pendingStaffId.length >0){
					for (var i = 0; i < pendingStaffId.length; i++) {
						if(pendingStaffId[i]===parseInt(headStaffId)){
							window.location.href="logout";
						}
					}
				}
			}

		});

	},function(error){
		console.log(error);
	});

}

function disconnect() {
	if (stompClient != null) {
		stompClient.disconnect();
	}
}
function doCompare(){
    var beginTime = $("#searchform #beginTime").val();
	var endTime = $("#searchform #endTime").val();
	var result = compareDate(beginTime,endTime);
	if ( result>0 ) {
	 alert("开始时间晚于结束时间,请检查!","warning");
	 return false;
	}else{
		return true;
	}
}
/** 日期比较 **/
function compareDate(strDate1,strDate2){
var date1 = new Date(strDate1.replace(/\-/g, "\/"));
var date2 = new Date(strDate2.replace(/\-/g, "\/"));
return date1-date2;
}

/*搜索框库点change事件*/
function getWarehouseByGroupId(){
	$("#searchform select[name=warehouseId]").empty();
	var groupId = $("#searchform select[name=groupId]").val();
	if(groupId){
		$.ajax({
			url : "common/warehouseList?groupId="+groupId,
			type : 'GET',
			dataType : "json"
		}).done(function(data) {
			$("#searchform select[name=warehouseId]").append("<option value=''>全部</option>");
			if(data){
				$.each(data,function(index,item){
					$("#searchform select[name=warehouseId]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
	/*$("#searchform select[name=groupId]").change(function(){
		var $this = $(this);

	});*/
}

/*添加表单中的，库点change事件*/
function getFormWarehouseByGroupId(formId,warehouseId,groupId){
	$("#"+formId+" select[name="+warehouseId+"]").empty();
	var groupId = $("#"+formId+" select[name="+groupId+"]").val();
	if(groupId){
		$.ajax({
			url : "common/warehouseList?groupId="+groupId,
			type : 'GET',
			dataType : "json",
			async: false
		}).done(function(data) {
			$("#"+formId+" select[name="+warehouseId+"]").append("<option value=''>请选择</option>");
			if(data){
				$.each(data,function(index,item){
					$("#"+formId+" select[name="+warehouseId+"]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
}



//文件上传
var fileNameArray = [];
var fileNumber = 0;
var maxLength = 52428800;
function fileInput(fileId,url){
	var files = document.querySelector('#'+fileId);
	var fileCount = 0;
	files.onchange = function() {
		var imgFile = files.files;
		fileNumber++;
		if(fileNumber>1){
			for(var i=0; i<fileNameArray.length; i++){
				if(imgFile[0].name == fileNameArray[i]){
					alert("文件不可重复!","warning");
					return;
				}
			}
		}
		fileNameArray.push(imgFile[0].name);
		fileCount += imgFile.length;
		for (var i = 0; i < imgFile.length; i++) {
			if(imgFile[i].size > maxLength){
				alert("文件大小不能超过50M！");
				return
			} else{
//				每一个选择的文件
				var fileContainer = $("<div></div>");
				$("#"+fileId).siblings(".fileInfo").append(fileContainer);
				fileContainer.addClass("fileContainer");
//				文件名
				var fileName= $("<span></span>");
				fileContainer.append(fileName);
				fileName.addClass("fileName");
				fileName.text(imgFile[i].name);
//				文件大小
				var fileSize= $("<span></span>");
				fileContainer.append(fileSize);
				var fileSizeKb = imgFile[i].size / 1024;
				fileSize.addClass("fileSize");
				fileSize.text("(" + fileSizeKb.toFixed(2) + "KB)");

//				删除按钮
				var fileDelete = $("<span></span>");
				fileContainer.append(fileDelete);
				fileDelete.addClass("fileDelete");
				fileDelete.text("删除");

				uploadFile(url,imgFile[i]);
			}
		}

		//删除事件

		$(".fileDelete").click(function  () {
			$(this).parent().hide();
			var fileName = $(this).parent().find("span:first").html();
			for(var i=0; i<fileNameArray.length; i++){
				if(fileName == fileNameArray[i]){
					fileNameArray.splice(i,1);
				}
			}
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
			$('#'+fileId).val('');
		})

	}
}



function uploadFile(url,files){
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
		var douumentUrl = $("#douumentUrl").val();
		if(douumentUrl!=""){
			douumentUrl=douumentUrl+","+data[0].path;
		}else{
			douumentUrl = data[0].path;
		}
		$("#douumentUrl").val(douumentUrl);
		$(".fileProgressBody").animate({width:"100%"},{
			complete: function  () {
				$(this).parent().hide();
	        }
		});
	}).fail(function(xhr,status,e) {
		alert("文件上传失败!", "warning");fileContainer
		$(".fileProgress").hide();
		$(".fileContainer").hide();
	});

}

//查询空闲车牌列表
function getVehicleList() {
	var groupId = $("#updateform select[name='groupId']").val();
	$("#updateform #vehicleId").empty();
	if(groupId){
		$.ajax({
			url : 'common/getVehicleListByGroupId?groupId='+groupId,
			type : 'GET',
			async: false
		}).done(function(data) {
			$("#updateform #vehicleId").append("<option value=''>请选择</option>");
			if(data){
				$.each(data,function(index,item){
					$("#updateform #vehicleId").append("<option value='"+item.id+"'>"+item.plateNumber+"</option>");
				});
			}

		}).fail(function() {
			console.log("请求失败！");
		});
	}
}

function initMyPending(){
	$("#myPendingUrl").click(function() {
		var basePath = getRootPath_dc();
		window.location.href=basePath+"/pending/index";
	});
	$("#myOfficeUrl").click(function() {
		var basePath = getRootPath_dc();
		window.location.href=basePath+"/oa/officialDocument/notRead";
	});
	$("#myWarningUrl").click(function() {
		var basePath = getRootPath_dc();
		window.location.href=basePath+"/warning";
	});
}

//获取项目绝对路径
function getRootPath_dc() {
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    }
    else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}

/*库点change事件,获取有设备的仓间信息*/
function getEquipWarehouseByGroupId(category,type){
	$("#searchform select[name=warehouseId]").empty();
	var groupId = $("#searchform select[name=groupId]").val();
	if(groupId){
		$.ajax({
			url : "common/getEquipWarehouseList?groupId="+groupId+"&category="+category+"&type="+type,
			type : 'GET',
			dataType : "json"
		}).done(function(data) {
			$("#searchform select[name=warehouseId]").append("<option value=''>全部</option>");
			if(data){
				$.each(data,function(index,item){
					$("#searchform select[name=warehouseId]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
}

function initPasswordForm(){
	var passwordHtml = 	'<div class="modal fade" id="passwordModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="true">' +
	'	<div class="modal-dialog">' +
	'		<div class="modal-content">' +
	'			<div class="modal-header">' +
	'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
	'				<h4 class="modal-title" id="addModalLabel">修改密码</h4>' +
	'			</div>' +
	'			<div class="modal-body">' +
	'				<form id="passwordForm" class="updateform password-form">' +
	'					<div class="wicket_body">' +
	'						<div class="updateform">' +
	'							<div class="clearfix">' +
	'								<div class="form-group">' +
	'									<label>原始密码:</label><input type="password" name="old_password" maxlength="32"></input>' +
	'								</div>' +
	'								<div class="form-group">' +
	'									<label>新密码:</label><input type="password" name="new_password" maxlength="32"></input>' +
	'								</div>' +
	'								<div class="form-group">' +
	'									<label>重复密码:</label><input type="password" name="confirm_password" maxlength="32"></input>' +
	'								</div>' +
	'							</div>' +
	'						</div>' +
	'					</div>' +
	'					<div class="btn-footer">' +
	'						<button type="submit" class="btn btn-primary btn_add btn-common">确认</button>' +
	'						<button type="button" class="btn btn-default btn-common" data-dismiss="modal">取消</button>' +
	'					</div>' +
	'				</form>' +
	'			</div>' +
	'		</div>' +
	'	</div>' +
	'</div>';
	$("body").append(passwordHtml);

	$("div.top-head span.admin-name1").click(function(){
		$('#passwordForm')[0].reset();
		$('#passwordModal').modal("show");
	});

	$('#passwordForm').bootstrapValidator({
		fields : {
			old_password : {
				validators : {
					notEmpty : {}
				}
			},
			new_password : {
				validators : {
					notEmpty : {}
				}
			},
			confirm_password : {
				validators : {
					notEmpty : {},
					identical : {
						field : 'new_password',
						message : '两次输入密码不一致'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();

		$.ajax({
			type : 'PUT',
			url : "password",
			data : $('#passwordForm').serializeJson()
		}).done(function(data) {
			alert("密码修改成功",function(){
				$("#passwordForm")[0].reset();
				$("#passwordModal").modal("hide");
				window.location.href = getRootPath_dc() + "/logout";
			});
		}).fail(function(err) {
			alertAjaxError(err);
		}).always(function() {
		});
	});
}
