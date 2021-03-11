var tab = $('#table');

//按钮点击上传文件框
function btnClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
}

$(function(){
	//初始化列表
	initTable();
	
	//列表查询
	$("#submit_search").click(function(){
		var plateNumber = $.trim($('#searchform #plateNumber').val());
		$('#searchform #plateNumber').val(plateNumber);
		$("#table").bootstrapTable("refresh");
	});
	
	//查询重置
	$("#submit_reset").click(function(){
		$("#searchform")[0].reset();
	});
	
	//费用申报
	$("#add").click(function(){
		$("#updateform").reset();
		$("#myModalLabel").html("费用申报");
		$("#operation").val("add");
		//样式设置
		$("#updateform select[name=vehicleApplyId]").attr("disabled",false);
		$("#updateform #vehicleApplyId").css({"cursor":"allowed", "background":"initail"});
		$("#updateform select[name=groupId]").attr("disabled",false);
		$("#updateform select[name=groupId]").css({"cursor":"allowed"});
		//添加时 根据未申报费用状态获取申请信息
		getVehicleApplyInfo();
		$("#myModal").modal("show");
		$("#button_addfee").show();//添加按钮显示
	});
	//消除验证
	$('#myModal').on('hide.bs.modal', function() {
		$("#myModal form").each(function() {
			$(this).reset();
		});
		var divLength = $("#updateform .form-group-third");
		for(var i = 1;i<divLength.length;i++){
			divLength.eq(i).remove();
		}
		$(".fileInfo").empty();
	})
	//修改
	$("#edit").click(function(){
		$("#myModalLabel").html("费用申报修改");
		$("#operation").val("edit");
		var row = $("#table").bootstrapTable("getSelections");
		if(row.length == 0){
			alert("请选择要修改的记录!","warning");
			return;
		}else if(row.length > 1){
			alert("请选择一条要修改的记录!","warning");
			return;
		}else{
			$("#button_addfee").hide();//添加按钮隐藏
			updateDepartment(row[0].departmentId);//初始化人员option,然后给option赋值,ajax同步
			$("#updateform select[name='applicant']").val(row[0].applicant);
			//样式设置
			$("#updateform select[name=vehicleApplyId]").attr("disabled","disabled");
			$("#updateform #vehicleApplyId").css({"cursor":"not-allowed", "background":"none"});
			$("#updateform select[name=groupId]").attr("disabled","disabled");
			$("#updateform select[name=groupId]").css({"cursor":"not-allowed"});
			//$("#updateform #vehicleApplyId").attr("unselectable",'on');
			
			$("#operation").val("edit");
			$.each(row, function(i, o) {
				getDetail(o.id);
			})
		}
	});
	
	//删除
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteObject);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
	$('.add-fee').click(function(){
		
		var newFeeDetail = $("#addfee #feeDetail").clone(true);
		newFeeDetail.attr("id","feeAdd-" + $("#addfee").length);
		$(newFeeDetail).find("img").show();//删除按钮显示
		$(newFeeDetail).find("input,select,textarea").val("");//清空数据
		$(newFeeDetail).find('.fileInfo').empty();
		newFeeDetail.show();
		$("#addfee").append(newFeeDetail);
		$("#updateform").data('bootstrapValidator').destroy();
	    $('#updateform').data('bootstrapValidator', null);
	    addOredit();
	})
	
	$('#addfee').on('click','.form-group-third img',function(){
		/*if(confirm("是否确认删除？", delFeeDetail)){
			
		}*/
		$(this).parent().remove();
	})
	//添加或修改
	addOredit();	
});
	
//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/vehicle/fee/vehicleFeeList",
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetail
		},/*{
			title: "库点",
			field: 'groupName'
		},*/{
			title: "申报人",
			field: "applicantName"
		},{
			title: "用车申请时间",
			field: "applyTime"
		},{
			title: "车牌号码",
			field: "plateNumber"
		},{
			title: "总金额(元)",
			field: "totalMoney"
		},{
			title: "备注",
			field: "remark"
		}]
	});
}

//新增或修改
function addOredit(){
	$("#updateform").bootstrapValidator({
		fields:{
			vehicleApplyId:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			departmentId:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			applicant:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			type:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			amount:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:8,message:"长度不能超过8个字符"},
					regexp:{
						regexp:/^\d+(\.\d{1,2})?$/,
						message:"只能填写数字，小数点后不能超过2位"
					}
				}
			},
			remark:{
				validators:{
					stringLength:{max:64,message:"长度不能超过64个字符"},
				}
			}/*,
			attachment:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			}*/
		}
	}).on("success.form.bv",function(e){
		e.preventDefault();//防止表单提交
		
		var operation = $("#operation").val();
    				
    				var dataInfo =  $('#updateform').serializeObject();
    				var vehicleFeeDetail = new Array();
					$("#updateform .form-group-third").each(function(){
						var Info = {
								id:$(this).find("input[name=feeDetailId]").val(),
								type:$(this).find("select[name=type]").val(),
								amount:$(this).find("input[name=amount]").val(),
								attachments:$(this).find("input[name=attachments]").val()
							}
						vehicleFeeDetail.push(Info);
					});
					dataInfo.vehicleFeeDetails = vehicleFeeDetail;
					
					if("add" == operation){
						//添加ajax
						$.ajax({
							type:"POST",
							url:"oa/vehicle/fee/addVehicleFee",
							data:JSON.stringify(dataInfo)
						}).done(function(data){
							$("#myModal").modal("hide");
							if(data.flag == true){
								alert("添加成功！");
							}else{
								alert("添加失败！");
							}
						}).fail(function(err){
							alert("提交失败！","warning");
						}).always(function(){
							$("#table").bootstrapTable("refresh");
							$("#updateform").reset();
						});
					}else if("edit" == operation){
						//修改
						$.ajax({
							type:"PUT",
							url:"oa/vehicle/fee/updateVehicleFee",
							data:JSON.stringify(dataInfo)
						}).done(function(data){
							$("#myModal").modal("hide");
							if(data.flag == true){
								alert("修改成功！");
							}else{
								alert("修改失败！");
							}
						}).fail(function(err){
							alert("提交失败！","warning");
						}).always(function(){
							$("#table").bootstrapTable("refresh");
							$("#updateform").reset();
						});
					}
					
	});
}

//根据id获取详情
function getDetail(id) {
	$.ajax({
		url : 'oa/vehicle/fee/getVehicleFee/' + id ,
		type : 'GET'
	}).done(function(data) {
		if (null != data.vehicleFee) {
			var vehicleFee = data.vehicleFee;
			var vehicleFeeDetail = data.vehicleFeeDetail;
			setEidtPage(vehicleFee,vehicleFeeDetail);
		}
	}).fail(function() {
		alert('获取信息失败!',"warning");
	});
	
}

function setEidtPage(vehicleFee,vehicleFeeDetail){
	$("#updateform #id").val(vehicleFee.id);
	$("#updateform #groupId").val(vehicleFee.groupId);
	$("#updateform #departmentId").val(vehicleFee.departmentId);
	//去查询用车申请的信息，包括费用已报销的信息
	getAllVehicleApplyInfo();
	$("#updateform #vehicleApplyId").val(vehicleFee.vehicleApplyId);
	$("#updateform #applicant").val(vehicleFee.applicant);
	$("#updateform #remark").val(vehicleFee.remark);
	
	if(vehicleFeeDetail.length>0){
		
		//赋值第一个原有的框
		$("#addfee #feeDetail").find("input[name=feeDetailId]").val(vehicleFeeDetail[0].id);
		$("#addfee #feeDetail").find("select[name=type]").val(vehicleFeeDetail[0].type);
		$("#addfee #feeDetail").find("input[name=amount]").val(vehicleFeeDetail[0].amount);
		//$("#addfee #feeDetail").find("input[name=attachment]").val(vehicleFeeDetail[0].attachment);
		setDoucumentUrl(vehicleFeeDetail[0].feeDetailAttachments,$("#addfee #feeDetail"));
		for(var i=1;i<vehicleFeeDetail.length;i++){//从1开始，然后克隆,id不能一样
			var dynamicHtml = $("#addfee #feeDetail").clone(true);
			dynamicHtml.attr("id","feeAdd-" + i);
			$(dynamicHtml).find("input,select,textarea").val("");//清空数据
			$(dynamicHtml).find('.fileInfo').empty();
			$("#addfee").append(dynamicHtml);
			$("#addfee #feeAdd-"+i).find("input[name=feeDetailId]").val(vehicleFeeDetail[i].id);
			$("#addfee #feeAdd-"+i).find("select[name=type]").val(vehicleFeeDetail[i].type);
			$("#addfee #feeAdd-"+i).find("input[name=amount]").val(vehicleFeeDetail[i].amount);
			setDoucumentUrl(vehicleFeeDetail[i].feeDetailAttachments,$("#addfee #feeAdd-"+i));
			//$("#addfee #feeAdd-"+i).find("input[name=attachment]").val(vehicleFeeDetail[i].attachment);
		}
		
	}
	$("#myModal").modal("show");
}

function delFeeDetail(detailFeeId){
	if (detailFeeId == "") {
		return;
	}
	$.ajax({
		url : 'oa/vehicle/fee/delDetailFee/'+detailFeeId,
		type : 'DELETE',
	}).done(function(data) {
		$('#table').bootstrapTable('refresh');
		if (data.flag=true)
			alert("删除成功!");
		return;

	}).fail(function() {
		alert("删除失败!","warning");
		return;
	});
}
//删除
function deleteObject() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(i, o) {
		deleteById(o.id);
	});
	// 提示成功
	$('#table').bootstrapTable('refresh');
	alert("删除成功!");
}
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'oa/vehicle/fee/delVehicleFee/'+id,
		type : 'DELETE',
	}).done(function(data) {
		$('#table').bootstrapTable('refresh');
		if (data.flag=false)
			alert("删除失败!","warning");
		return;

	}).fail(function() {
		alert("删除失败!","warning");
		return;
	});
}
function searchDetails(id){
	var row = $("#table").bootstrapTable("getData")[id];
	initTable2();
	$("#detial").modal("show");
	$.ajax({
		url : 'oa/vehicle/fee/getVehicleFee/' + row.id ,
		type : 'GET'
	}).done(function(data) {
		if (null != data.vehicleFee) {
			var vehicleFee = data.vehicleFee;
			var vehicleFeeDetail = data.vehicleFeeDetail;
			if(vehicleFeeDetail){
				var tr_html = "";
				$("#detial #fee_Info").empty();
				var iPAndPort = $("#iPAndPort").val();
				for(var i = 0;i<vehicleFeeDetail.length;i++){
					if(vehicleFeeDetail[i].feeDetailAttachments==null || vehicleFeeDetail[i].feeDetailAttachments.length==0){
						tr_html += "<tr><td>"+vehicleFeeDetail[i].typeName+"</td>"+
						"<td>"+vehicleFeeDetail[i].amount+"</td>"+
				        "<td><a href='javascript:void(0)'>无</a></td></tr>";
					}else{
						tr_html += "<tr><td>"+vehicleFeeDetail[i].typeName+"</td>"+
						"<td>"+vehicleFeeDetail[i].amount+"</td>";
						
						var attachments = vehicleFeeDetail[i].feeDetailAttachments;
						var tt = "<td>";
						for(var j = 0;j<attachments.length;j++){
							tt+= "<a target='_blank' href="+iPAndPort+attachments[j].attachmentUrl+">"+attachments[j].attachmentName+"</a>&emsp;"
						}
						tt+="</td></tr>";
						
						tr_html+= tt;
					}
				}
				$("#detial #fee_Info").append(tr_html);
			}
		}
	}).fail(function() {
		alert('获取信息失败!',"warning");
	});
	$("#detial").modal("show");
	var row = $("#table").bootstrapTable("getData")[id];
	$.each(row,function(index,value){
		if(value==null || value =="null"){
			value = "";
		}
		$("#detial span[id='"+index+"']").text(value);
		$("#detial span[id='"+index+"']").attr("title",value);
	});
}
function formatDetail(value,row,index){
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}
function printFee(value,row,index){
 	return '<a>打印</a>';
 }
//菜单切换
$(".content-head-top a").click(function(){
	$(".content-head-top a").removeClass("active");
	$(this).addClass("active");
})

//根据部门查询人员
function updateDepartment(dId){
	if(dId){
		var departmentId = dId;
	}else{
		var departmentId=$("#updateform #departmentId").val();
	}
$.ajax({
	url : 'common/department/'+departmentId,
	type : 'GET',
	async: false
}).done(function(data) {
	$("#updateform #applicant").html("");
	$("#updateform #applicant").append("<option value=''>请选择</option>");
	$.each(data.staff,function(index,items){
		$("#applicant").append("<option value='"+items.id+"'>"+items.realName+"</option>");
	});
	$("#applicant").append();
	
}).fail(function(err) {
	
}).always(function() {
	
});
}
//添加时 根据未申报费用状态获取申请信息
function getVehicleApplyInfo(){
	var groupId = $("#updateform #groupId").val();
	$.ajax({
		url : 'oa/vehicle/fee/getVehicleApplyInfo?groupId='+groupId,
		type : 'GET'
	}).done(function(data) {
		if (data.vehicleApplys) {
			vehicleApplys = data.vehicleApplys;
			$("#updateform #vehicleApplyId").empty();
			var html = "<option value=''>请选择</option>";
			for(var i =0;i<vehicleApplys.length;i++){
				html += "<option value="+vehicleApplys[i].id+">"+vehicleApplys[i].applyInfo+"</option>";
			}
			$("#updateform #vehicleApplyId").append(html);
		}
	}).fail(function() {
		alert('获取信息失败!',"warning");
	});
}
//修改时获取所有用车申请信息
function getAllVehicleApplyInfo(){
	var groupId = $("#updateform #groupId").val();
	$.ajax({
		url : 'oa/vehicle/fee/getAllVehicleApplyInfo?groupId='+groupId,
		type : 'GET',
		async: false
	}).done(function(data) {
		if (data.allvehicleApplyInfo) {
			allvehicleApplyInfo = data.allvehicleApplyInfo;
			$("#updateform #vehicleApplyId").empty();
			for(var i =0;i<allvehicleApplyInfo.length;i++){
				var html="<option value="+allvehicleApplyInfo[i].id+">"+allvehicleApplyInfo[i].applyInfo+"</option>";
				$("#updateform #vehicleApplyId").append(html);
			}
			
		}
	}).fail(function() {
		alert('获取信息失败!',"warning");
	});
}
//导出
function exportExcel(){
	var groupId = $("#searchform #groupId").val();
	var varietyId = $.trim($("#searchform #varietyId").val());
	var customerName = $.trim($("#searchform #customerName").val());
	if(varietyId==''){
		varietyId='';
	}
	if(customerName == ''){
		customerName = '';
	}
	window.location.href = "purchase/buy/exportExcel?groupId="  + groupId + "&varietyId=" + varietyId  + "&customerName=" + customerName;
}
//费用表格
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
//上传附件事件
$(".fileInfo ").css({"margin-left":"20%"})
function getFileName(obj){
		var imgFile = $(obj)[0].files;
		
		//先判断文件大小
		var sizeMb = imgFile[0].size / (1024*1024);
		if(sizeMb>10){
			alert("上传附件过大,请重新上传","warning");
			return;
		}
		
		var names = $(obj).parent().find("input[name=attachments]").val();
		if(names!==null&&names!=""){
			var fileNameArray_out = names.split(",");
			for(var i=0;i<fileNameArray_out.length; i++){
				var index = fileNameArray_out[i].lastIndexOf("/");
				var fname = fileNameArray_out[i].substring(index+1);
				if(imgFile[0].name == fname){
					alert("文件不可重复添加!","warning");
					return;
				}
			}
		}
		
		for (var i = 0; i < imgFile.length; i++) {
//			每一个选择的文件
			var fileContainer = $("<div></div>");
			$(obj).siblings(".fileInfo").append(fileContainer);
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
			
			uploadFile_loss("oa/vehicle/fee/upload",imgFile[i],obj);
			
		}
		
		$(obj).val("");//上传之后不管成功与否都将input的值设为空 使同一个文件对onchange事件支持
		
		
		//删除事件
		
		$(".fileDelete").click(function  () {
			$(this).parent().hide();
			var fileName = $(this).parent().find("span:first").html();
			var douumentUrl = $(obj).parent().find("input[name='attachments']").val()
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
			$(obj).parent().find("input[name='attachments']").val(douumentUrl);
			$(this).val('');
		})
		
}


function uploadFile_loss(url,files,obj){
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
				$(obj).siblings(".fileInfo").append(fileProgress);
				
				var percentRandom = Math.random()*80 + 10;
				fileProgressBody.animate({width: percentRandom + "%"});
		    }
		})
	}).done(function(data) {
		if(data){
			var douumentUrl = $(obj).parent().find("input[name='attachments']").val();
			if(douumentUrl!=""){
				douumentUrl=douumentUrl+","+data[0].path;
			}else{
				douumentUrl = data[0].path;
			}
			$(obj).parent().find("input[name='attachments']").val(douumentUrl);
			$(".fileProgressBody").animate({width:"100%"},{
				complete: function  () {
					$(this).parent().hide();
		        }
			});
		}else{
			alert("文件上传失败!请重试!", "warning");
		}
		
	}).fail(function() {
		alert("文件上传失败!请重试!", "warning");
	});
	
}

//修改
function setDoucumentUrl(attachments,obj){
	if(attachments){
		var arrPath = [];
		var arrName = [];
		for (var i = 0; i < attachments.length; i++) {
			arrPath.push(attachments[i].attachmentUrl);
			arrName.push(attachments[i].attachmentName);
		}
		if(obj){
			var douumentUrl = arrPath.join(",");
			obj.find("input[name=attachments]").val(douumentUrl);
		}
		if(obj.find('.fileInfo')){
			for (var j = 0; j < arrName.length; j++) {
				var fileContainer = $("<div></div>");
				obj.find('.fileInfo').append(fileContainer);
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
				var douumentUrl = obj.find("input[name=attachments]").val();
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
				obj.find("input[name=attachments]").val(douumentUrl);
				obj.find("input[name=files]").val('');
			})
		}
	}
	
}