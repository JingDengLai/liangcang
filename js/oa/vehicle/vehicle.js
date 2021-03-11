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
		$("#addOrupdateVehicleForm").reset();
		$("#addOrupdateVehicleForm").data('bootstrapValidator').resetForm();
		$("#myModalLabel").html("添加车辆");
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
		$("#myModalLabel").html("修改车辆");
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
			$("#myModal #addOrupdateVehicleForm input[name='"+index+"'],#myModal #addOrupdateVehicleForm select[name='"+index+"']").val(value);
		});
		
		$("#myModal").modal("show");
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
				if(row[i].status==1||row[i].status==2){
					alert("该车辆在使用中或维修中不能删除！","warning");
					return;
				}
			}
			
			confirm("是否确认删除？",function(){
				$.ajax({
					url:"oa/vehicle/vehicle/delVehicle/"+ids,
					type:"DELETE"
				}).done(function(data){
					if(data.flag == true){
						alert("删除成功！");
					}
					if(data.flag == false){
						alert("删除失败！","warning");
					}
					/*if(data.msg){
						alert(data.msg,"warning");
					}*/
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
		url: "oa/vehicle/vehicle/vehicleList",
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
			title: "品牌",
			field: "brand",
			formatter: formatSubstring
		},{
			title: "车辆类型",
			field: "type",
			formatter: formatSubstring
		},{
			title: "车型号",
			field: "model",
			formatter: formatSubstring
		},{
			title: "车架号",
			field: "vin",
			formatter: formatSubstring
		},{
			title: "车牌号码",
			field: "plateNumber"
		},{
			title: "颜色",
			field: "color",
			formatter: formatSubstring
		},{
			title: "状态",
			field: "statusName"
		},{
			title: "购买时间",
			field: "buyDate"
		}]
	});
}

//新增或修改
function addOredit(){
	$("#addOrupdateVehicleForm").bootstrapValidator({
		fields:{
			brand:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{min:1,max:32,message:"长度不能超过32个字符"}
				}
			},
			type:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{min:1,max:32,message:"长度不能超过32个字符"}
				}
			},
			model:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{min:1,max:32,message:"长度不能超过32个字符"}
				}
			},
			vin:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{min:1,max:20,message:"长度不能超过20个字符"}
				}
			},
			plateNumber:{
				validators:{
					notEmpty : {
						message: '不能为空'
					},
					 regexp: {
                         regexp:/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
                         message: '车牌号码格式错误'
                     }
				}
			},
			color:{
				validators:{
					notEmpty:{message:"不能为空"},
					stringLength:{min:1,max:32,message:"长度不能超过32个字符"}
				}
			},
			status:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			},
			buyDate:{
				validators:{
					notEmpty:{message:"不能为空"}
				}
			}
		}
	}).on("success.form.bv",function(e){
		e.preventDefault();//防止表单提交
		
		var operation = $("#operation").val();
		if("add" == operation){
			var url = "oa/vehicle/vehicle/addVehicle";
			var type = "POST";
		}else if("edit" == operation){
			var url = "oa/vehicle/vehicle/updateVehicle";
			var type = "PUT";
		}
		
		$.ajax({
			type:type,
			url:url,
			data:$("#addOrupdateVehicleForm").serializeJson()
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
			$("#addOrupdateVehicleForm").reset();
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
}
function formatDetail(value,row,index){
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}
//菜单切换
$(".content-head-top a").click(function(){
	$(".content-head-top a").removeClass("active");
	$(this).addClass("active");
})

//时间校验
function buyDatePick(){
	$("#addOrupdateVehicleForm").data('bootstrapValidator')
	.updateStatus('buyDate', 'NOT_VALIDATED', null)
	.validateField('buyDate');
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