var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	//初始化列表
	initTable();
	
	// 添加&编辑方法
	addOrEditTraining();
	
	//添加培训,发起人&&参与人员插件
	initTree();
	
	// 查询按钮
	$("#submit_search").click(function(){
		var theme = $.trim($('#searchform #search_theme').val());
		var lecturer = $.trim($('#searchform #search_lecturer').val());
		$('#searchform #search_theme').val(theme);
		$('#searchform #search_lecturer').val(lecturer);
		$table.bootstrapTable('refresh', {url: "oa/hr/train/trainList"});
	});
	
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	
	// 添加按钮
	$("#add").click(function() {
		$(".fileInfo").empty();
		fileNameArray = [];//清空存放附件名称的数组(fileNameArray在common.js中定义)
		fileNumber = 0//(fileNumber在common.js中定义)
		fileInput("file1","oa/officialDocument/upload/files");
		$("#myModalLabel").html("添加培训");
		$("#operation").val("add");
		$('#myModal').modal('show');
	});	
	//表单非空验证...
	$('#myModal').on('hide.bs.modal', function() {
		$("#myModal form").each(function() {
			$(this).reset();
		});
	})
	
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
			$("#myModalLabel").html("修改培训");
			$("#operation").val("edit");
			$.each(row, function(index, items) {
				getTrainDetail(items.id);
			})
		}
	});
	
	// 删除按钮
	$('#com_delete').click(function() {
		var selRow = $("#table").bootstrapTable('getSelections');
		if (selRow.length > 0) {
			confirm("是否确认删除？", deleteTrain);
		} else {
			alert("请选择要删除的数据","warning");
		}
	})
});   




//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/hr/train/trainList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "全选",
			field: "全选",
			checkbox : true
		},{
			title: "详情",
			formatter: formatDetail
		},{
			title: "主题",
			field: "theme",
			formatter: formatSubstring
		},{
			title: "发起人",
			field: "initiatorName"
		},{
			title: "培训人",
			field: "lecturer",
			formatter: formatSubstring
		},{
			title: "开始时间",
			field: "startTime"
		},{
			title: "结束时间",
			field: "endTime"
		}]
	});
}

function formatSubstring(value,row,index){
	if(value){
		if(value.length>=10){
			return "<div title='" + value + "'><span>" + value.substring(0,10) + "..." + "</span></div>";
			//return value.substring(0,15)+"...";
		}else{
			return value;
		}
	}else{
		return "";
	}
}

function addOrEditTraining() {
	$('#dataForm').bootstrapValidator({
		fields : {
			theme: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:64, message:"不能超过64个字符"},
				}
			},
			initiatorName : {
				validators : {
				notEmpty : {message: '不能为空'}
				}
			},
			lecturer: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:20, message:"不能超过20个字符"},
				}
			},
			address: {
				validators: {
					notEmpty: {message: "不能为空"},
					stringLength: {max:32, message:"不能超过32个字符"},
				}
			},
			startTime : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			endTime : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			attachment : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			staffPersonName : {
				validators : {
					notEmpty : {message: '不能为空'}
				}
			},
			summary: {
				validators: {
					stringLength: {max:256, message:"不能超过256个字符"},
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $("#operation").val();
		if ("add" == operation) {
				$.ajax({
					type : 'POST',
					url : "oa/hr/train/addTraining",
					data : $("#dataForm").serializeJson(),
				}).done(function(data) {
					if (data.flag == true) {
						alert("添加成功!");
						$(".fileInfo").empty();
						$('#myModal').modal('hide');
					} else {
						alert("添加失败！","warning");
					}
					$('#table').bootstrapTable('refresh');
				}).fail(function(err) {
					alert("添加失败!", "warning");
				}).always(function() {
					$('#table').bootstrapTable('refresh');
					$("#dataForm").reset();

				});
			} else if ("edit" == operation) {
				$.ajax({
					type : 'PUT',
					url : "oa/hr/train/updateTraining",
					data : $("#dataForm").serializeJson(),
				}).done(function(data) {
					$('#myModal').modal('hide');
					if (data.flag == true) {
						alert("修改成功!");
						$(".fileInfo").empty();
					} else {
						alert("修改失败！", "warning");
					}
					$('#table').bootstrapTable('refresh');
				}).fail(function(err) {
					alert("修改失败!","warning");
				}).always(function() {
					$('#table').bootstrapTable('refresh');
					$("#dataForm").reset();

				});
			} else {
				confirm("未定义的操作" + operation);
			}
	});
}
//根据id获取详情
function getTrainDetail(id) {
	$.ajax({
		url : 'oa/hr/train/hrTrain/' + id ,
		type : 'GET',
		timeout : 10000,
		dataType : "json",
		cache : false
	}).done(function(data) {
		if (null != data.trainingVo) {
			var trainingVo = data.trainingVo;
			setEidtPage(trainingVo);
			var attachments = data.attachments;
			$(".fileInfo").empty();
			setDoucumentUrl(attachments);
		}
	}).fail(function() {
		alert('培训记录获取失败!',"warning");
	});
}
//编辑页面控制
function setEidtPage(trainingVo) {
	$("#dataForm #id").val(trainingVo.id);
	$("#theme").val(trainingVo.theme);
	$("#initiator").val(trainingVo.initiator);
	$("#initiatorName").val(trainingVo.initiatorName);
	$("#lecturer").val(trainingVo.lecturer);
	$("#address").val(trainingVo.address);
	$("#startTime").val(trainingVo.startTime);
	$("#endTime").val(trainingVo.endTime);
	$("#staffPersonId").val(trainingVo.staffPersonId);
	$("#staffPersonName").val(trainingVo.staffPersonName);
	$("#summary").val(trainingVo.summary);
	$('#myModal').modal('show');
}

//删除
function deleteTrain() {
	var selections = $("#table").bootstrapTable("getSelections");
	$.each(selections, function(i, o) {
		deleteById(o.id);
	});
	// 提示成功
	$('#table').bootstrapTable('refresh');
	alert("删除成功!");
}
//删除
function deleteById(id) {
	if (id == "") {
		return;
	}
	$.ajax({
		url : 'oa/hr/train/hrTrain/' + id,
		type : 'DELETE',
		timeout : 10000,
		dataType : "json",
		cache : false
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
//设置详情页面
function editDetail(id){
	var eid = id;
	$.ajax({
		url : 'oa/hr/train/hrTrain/'+id,
		type : 'GET',
		timeout : 10000,
		cache : false
	}).done(function(data) {
		if (null != data.trainingVo) {
			var trainingVo = data.trainingVo;
			var attachments = data.attachments;
			setDetailPage(trainingVo,attachments);
		}
	}).fail(function() {
		alert('客户信息获取失败!',"warning");
	});
}
function setDetailPage(trainingVo,attachments){
	var iPAndPort = $("#iPAndPort").val();
	$("#initiatorName_detali").text(trainingVo.initiatorName);
	$("#startTime_detali").text(trainingVo.startTime);
	$("#endTime_detali").text(trainingVo.endTime);
	$("#lecturer_detali").text(trainingVo.lecturer);$("#lecturer_detali").attr("title",trainingVo.lecturer);
	$("#address_detali").text(trainingVo.address);$("#address_detali").attr("title",trainingVo.address);
	$("#theme_detali").text(trainingVo.theme);$("#theme_detali").attr("title",trainingVo.theme);
	$("#staffPersonName_detali").text(trainingVo.staffPersonName);$("#staffPersonName_detali").attr("title",trainingVo.staffPersonName);
	$("#summary_detali").text(trainingVo.summary);$("#summary_detali").attr("title",trainingVo.summary);
	initTable2(); 
	attachmentsInfo(attachments,iPAndPort);
	$("#detial").modal("show");
}

//详情附件信息展示
function attachmentsInfo(attachments,iPAndPort){
	if(attachments!=null){
		var tr_html = "";
		$("#detial #attachments_Info").empty();
		for(var i = 0;i<attachments.length;i++){
			tr_html += "<tr><td>"+attachments[i].attachmentName+"</td>"+
				        "<td><a href="+iPAndPort+attachments[i].attachmentPath+" download target='_blank'>下载</a></td></tr>";
		}
		$("#detial #attachments_Info").append(tr_html);
	}
}

//附件表格表格
function initTable2() {
    $("#table2").bootstrapTable({
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


function formatDetail(value,row,index){
	return '<a class="details" onclick="editDetail(\''+row.id+'\')"><span class="eye"></span></a>';
}

//添加培训开始时间验证
function startTimePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('startTime', 'NOT_VALIDATED', null)
	.validateField('startTime');
}

//添加培训结束时间验证
function endTimePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('endTime', 'NOT_VALIDATED', null)
	.validateField('endTime');
}

//取消添加人员插件在添加了人的情况下，“不能为空”的非空验证提示语(不加提示语还在)
function staffPick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('initiatorName', 'NOT_VALIDATED', null)
	.validateField('initiatorName');
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('staffPersonName', 'NOT_VALIDATED', null)
	.validateField('staffPersonName');
}


//input点击上传文件框
function inputClickFile(obj){
	$(obj).parent().find("input[name=files]").click();
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

function setDoucumentUrl(attachments){
	if(attachments){
		var arrPath = [];
		var arrName = [];
		for (var i = 0; i < attachments.length; i++) {
			arrPath.push(attachments[i].attachmentPath);
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
	$("#initiator").staffTreeView({title: "选择发起人",multiSelect:false,
		onSave:function(data){
			$("#initiator").val(data[0].id);
			$("#initiatorName").val(data[0].name);
			staffPick();
		}
	});
	$("#staffPersonId").staffTreeView({title: "选择参与人员",multiSelect:true,
		onSave:function(data){
			var ids = "";
			var names = "";
			for(var i=0; i<data.length; i++){
				ids = data[i].id+","+ids;
				names = data[i].name+","+names;
		}
			$("#staffPersonId").val(ids.substring(0,ids.length-1));
			$("#staffPersonName").val(names.substring(0,names.length-1));
			staffPick();
		}
	});
}
//添加发起人
function show1() {
	if($("#operation").val() == "add"){
		$("#initiator").staffTreeView("setVal",[]);
	}
	if($("#initiator").val()!="" && $("#initiator").val()!=null){
		var initiator = $("#initiator").val().split(",");
		$("#initiator").staffTreeView("setVal",initiator);
	}
	$("#initiator").staffTreeView("show");
}
//添加参与人员
function show2() {
	if($("#operation").val() == "add"){
		$("#staffPersonId").staffTreeView("setVal",[]);
	}
	if($("#staffPersonId").val()!="" && $("#staffPersonId").val()!=null){
		var staffPersonId = $("#staffPersonId").val().split(",");
		staffPersonId.splice(staffPersonId.length-1,staffPersonId.length-1);
		$("#staffPersonId").staffTreeView("setVal",staffPersonId);
	}
	$("#staffPersonId").staffTreeView("show");
}





