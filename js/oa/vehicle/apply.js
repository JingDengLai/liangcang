var tab = $('#table');
﻿var approvers = undefined;
$(function(){
	//初始化列表
	initTable();
	//列表查询
	$("#submit_search").click(function(){
		$("#table").bootstrapTable("refresh");
	});
	
	//查询重置
	$("#submit_reset").click(function(){
		$("#searchform")[0].reset();
	});
	//添加
	$("#add").click(function(){
		$("#updateform").reset();
		$("#myModalLabel").html("用车申请");
		//禁用disable按钮
		$("#updateform select[name=groupId]").attr("disabled","disabled");
		$("#updateform select[name=departmentId]").attr("disabled","disabled");
		$("#updateform select[name=applicant]").attr("disabled","disabled");
		
		$("#approverDiv").staffView('setVal',approvers);
		$("#operation").val("add");
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
		$("#myModalLabel").html("修改用车申请");
		$("#operation").val("edit");
		var row = $("#table").bootstrapTable("getSelections");
		if(row.length == 0){
			alert("请选择要修改的记录!","warning");
			return;
		}else if(row.length > 1){
			alert("请选择一条要修改的记录!","warning");
			return;
		}else{
			if(row[0].approvalStatusValue==1||row[0].approvalStatusValue==2){
				alert("该记录已审批通过或正在审批中不能操作!","warning");
				return;
			}
			$.each(row[0],function(index,value){
				$("#myModal #updateform input[name='"+index+"'],#myModal #updateform select[name='"+index+"'],#myModal #updateform textarea[name='"+index+"']").val(value);
			});
			$("#approverDiv").staffView('setVal',row[0].nextApprovers);
			
			updateDepartment(row[0].departmentId);//初始化人员option,然后给option赋值,ajax同步
			$("#updateform select[name='applicant']").val(row[0].applicant);
			$("#myModal").modal("show");
		}
	});
	
	//删除
	$("#com_delete").click(function(){
		var row = $("#table").bootstrapTable("getSelections");
		var nums = [];
		$.each(row,function(index,items){
			nums.push(items.id);
		});
		var ids = nums.join(",");
		if(row.length > 0){
			for(var i = 0;i < row.length;i++){
				if(row[i].approvalStatusValue==1||row[i].approvalStatusValue==2){
					alert("记录中有已审批通过或正在审批中不能操作!","warning");
					return;
				}
			}
			confirm("是否确认删除？",function(){
				$.ajax({
					url:"oa/vehicle/delVehicleApply/"+ids,
					type:"DELETE"
				}).done(function(data){
					if(data.flag == true){
						alert("删除成功！");
					}else{
						alert("删除失败！","warning");
					}
				}).fail(function(err){
					alert("删除失败！","warning");
				}).always(function(){
					$('#table').bootstrapTable('refresh');
				});
			});
		}else{
			alert("请选择要删除的记录!","warning");
		}
	});
	//添加或修改
	addOredit();
});
	
//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/vehicle/applyList",
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
			title: "申请人",
			field: "applyPerson"
		},{
			title: "申请部门",
			field: "applyDept"
		},{
			title: "事由",
			field: "reason",
			formatter: formatSubstring
		},{
			title: "申请时间",
			field: "applyTime"
		},{
			title: "开始时间",
			field: "startDate"
		},{
			title: "结束时间",
			field: "endDate"
		},{
			title: "状态",
			field: "approvalStatus"
		}]
	});
}

//新增或修改
function addOredit(){
	$("#updateform").bootstrapValidator({
		fields:{
			departmentId:{
				validators:{
					notEmpty:{message:"不能为空"},
				}
			},
			applicant:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			startDate:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			endDate:{
				validators:{
					notEmpty:{message:"不能为空"},
				}
			},
			applyTime:{
				validators:{
					notEmpty:{message:"不能为空"},
				}
			},
			reason:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{max:64,message:"长度不能超过64个字符"}
				}
			},
			remark:{
				validators:{
					stringLength:{max:64,message:"长度不能超过64个字符"}
				}
			}
		}
	}).on("success.form.bv",function(e){
		e.preventDefault();//防止表单提交
		
		//消除禁用disable按钮
		$("#updateform select[name=groupId]").attr("disabled",false);
		$("#updateform select[name=departmentId]").attr("disabled",false);
		$("#updateform select[name=applicant]").attr("disabled",false);
		
		var operation = $("#operation").val();
		if("add" == operation){
			var url = "oa/vehicle/addVehicleApply";
			var type = "POST";
			var data =  $('#updateform').serializeObject();
			data.nextApprovers = $("#approverDiv").staffView('getVal');
		}else if("edit" == operation){
			var url = "oa/vehicle/updateVehicleApply";
			var type = "PUT";
			var data =  $('#updateform').serializeObject();
		}
		
		$.ajax({
			type:type,
			url:url,
			data : JSON.stringify(data)
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
	//审批历史
	initTable2();
	var approvalProcessHistory = row.approvalProcessHistory
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
function formatDetail(value,row,index){
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}


//获取值：
function getVal() {
	alert($("#approverDiv").staffView('getVal'));

}
//设置值：
function setVal() {
	var a = [2,3,4];
	$("#approverDiv").staffView('setVal',a);

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

//时间校验
function endDatePick(){
	$("#updateform").data('bootstrapValidator')
	.updateStatus('endDate', 'NOT_VALIDATED', null)
	.validateField('endDate');
}
function startDatePick(){
	$("#updateform").data('bootstrapValidator')
	.updateStatus('startDate', 'NOT_VALIDATED', null)
	.validateField('startDate');
}
function applyTimePick(){
	$("#updateform").data('bootstrapValidator')
	.updateStatus('applyTime', 'NOT_VALIDATED', null)
	.validateField('applyTime');
}

//判断起始时间不能大于结束时间
function checkTime(){
	var start = $("#updateform #startDate").val();
	var end = $("#updateform #endDate").val();
	if(start>end){
		alert("开始时间不能大于结束时间！","warning");
		$("#updateform #startDate").val("");
		$("#updateform #endDate").val("");
	}
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