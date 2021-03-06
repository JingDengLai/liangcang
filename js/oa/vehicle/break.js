var tab = $('#table');

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
	
	//添加
	$("#add").click(function(){
		$("#updateform").reset();
		$("#updateform").data('bootstrapValidator').resetForm();
		$("#myModalLabel").html("添加违章信息");
		$("#operation").val("add");
		//查询车牌列表
		getVehicleList();
		$("#myModal").modal("show");
	});
	//消除验证
	$('#myModal').on('hide.bs.modal', function() {
		$("#myModal form").each(function() {
			$(this).reset();
		});
	})
	//修改
	$("#edit").click(function(){
		$("#myModalLabel").html("修改违章信息");
		$("#operation").val("edit");
		var row = $("#table").bootstrapTable("getSelections");
		if(row.length == 0){
			alert("请选择要修改的记录!","warning");
			return;
		}else if(row.length > 1){
			alert("请选择一条要修改的记录!","warning");
			return;
		}
		
		$.each(row[0],function(index,value){
			if(index=='vehicleId'){
				//查询车牌列表,groupId在这之前已经先赋值了
				getVehicleList();
			}
			$("#myModal #updateform input[name='"+index+"'],#myModal #updateform select[name='"+index+"']").val(value);
		});
		
		$("#myModal").modal("show");
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
	//添加或修改
	addOredit();
});
	
//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/vehicle/break/list",
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
			title: "车牌号码",
			field: "plateNumber"
		},{
			title: "车辆违章时间",
			field: "violationDate"
		},{
			title: "车辆违章性质",
			field: "violationNature",
			formatter: formatSubstring
		},{
			title: "扣分(分)",
			field: "violationPoint"
		},{
			title: "罚款金额(元)",
			field: "violationFee"
		},{
			title: "驾驶员",
			field: "driver"
		}]
	});
}

//新增或修改
function addOredit(){
	$("#updateform").bootstrapValidator({
		fields:{
			vehicleId:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			violationDate:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			violationNature:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:32,message:"长度不能超过32个字符"}
				}
			},
			violationPoint:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:2,message:"长度不能超过2个字符"},
					regexp:{
						regexp:/^[0-9]*[0-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			},
			violationFee:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:6,message:"长度不能超过6个字符"},
					regexp:{
						regexp:/^[0-9]*[0-9][0-9]*$/,
						message:"只能填写数字"
					}
				}
			},
			driverId:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			}
		}
	}).on("success.form.bv",function(e){
		e.preventDefault();//防止表单提交
		
		var operation = $("#operation").val();
		if("add" == operation){
			var url = "oa/vehicle/break/add";
			var type = "POST";
		}else if("edit" == operation){
			var url = "oa/vehicle/break/update";
			var type = "PUT";
		}
		
		$.ajax({
			type:type,
			url:url,
			data:$("#updateform").serializeJson()
		}).done(function(data){
			$("#myModal").modal("hide");
			if(data.flag == true){
				alert(data.msg);
			}else{
				alert("提交失败！");
			}
		}).fail(function(err){
			alert("提交失败！","warning");
		}).always(function(){
			$("#table").bootstrapTable("refresh");
			$("#updateform").reset();
		});
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
		url : 'oa/vehicle/break/del/'+id,
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
//菜单切换
$(".content-head-top a").click(function(){
	$(".content-head-top a").removeClass("active");
	$(this).addClass("active");
})

//导出
function exportExcel(){
	var groupId = $("#searchform #groupId").val();
	var plateNumber = $.trim($("#searchform #plateNumber").val());
	var beginTime = $.trim($("#searchform #beginTime").val());
	var endTime = $.trim($("#searchform #endTime").val());

	window.location.href = getRootPath_dc()+"/oa/vehicle/break/exportExcel?groupId="  + groupId + "&plateNumber=" + plateNumber  + "&beginTime=" + beginTime+"&endTime="+endTime;
}
//时间校验
function violationDatePick(){
	$("#updateform").data('bootstrapValidator')
	.updateStatus('violationDate', 'NOT_VALIDATED', null)
	.validateField('violationDate');
}
function formatSubstring(value,row,index){
	if(value){
		if(value.length>=10){
			return "<div title='" + value + "'><span>" + value.substring(0,10) + "..." + "</span></div>";
			//return value.substring(0,15)+"...";
		}else{
			return value;
		}
	}
}