var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	tableInit();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $.trim($('#searchform #groupId').val());
		var name = $.trim($('#searchform #name').val());
		var status = $.trim($('#searchform #status').val());
		var beganTime = $.trim($('#searchform #beganTime').val());
		var endTime = $.trim($('#searchform #endTime').val());
		$('#searchform #groupId').val(groupId);
		$('#searchform #name').val(name);
		$('#searchform #status').val(status);
		$('#searchform #beganTime').val(beganTime);
		$('#searchform #endTime').val(endTime);
		$table.bootstrapTable('refresh', {url : 'oa/materials/materialAcceptance/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	// 申请按钮
	$("#add").click(function() {
		initTree();
		$(".equipmentAddApply").remove();
		$("#addModalLabel").html("领用申请");
		
		//禁用disable按钮
		$("#dataForm select[name=groupId]").attr("disabled","disabled");
		$("#dataForm select[name=applicantDepartmentId]").attr("disabled","disabled");
		$("#dataForm select[name=acceptancePerson]").attr("disabled","disabled");
		
		
		$("#operation").val("add");
		$('#addModal').modal('show');
	});
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
	// 编辑按钮
	$("#edit").click(function() {
		$("#addModalLabel").html("修改领用申请");
		$(".add-material-but").remove();
		$(".dynamicHtml-del").remove();
		var selections =  $table .bootstrapTable("getSelections");
		if (selections.length == 0) {
			alert("请选择要修改的记录!","warning");
			$("#dataForm").reset();
			return;
		}else if(selections.length > 1){
			alert("请选择一条要修改的记录!","warning");
			$("#dataForm").reset();
			return;
		}
		$("#operation").val("edit");
		$.each(selections, function(i, o) {
			getEquipmentAcceptanceDetail(o.id);
		})
	});
	// 删除
	$('#com_delete').click(function() {
		var selRow = $table.bootstrapTable('getSelections');
		if (selRow.length > 0) {
			deleteEquipment();
		} else {
			alert("请选择要删除的记录!","warning");
		}
	})
	// 新增保存、编辑保存
	addOreditEquipment();
	modalInit();
});

//申请页面初始化
function modalInit() {
	$(".dynamicHtml-del").hide();
	$.ajax({
		url : 'oa/materials/materialAcceptance/'+$("#groupId").val()+'/getMaterial',
		type : 'GET'
	}).done(function(data) {
		$("#materialId").empty();
		$("#materialId").append("<option value=''>请选择</option>");
		$.each(data.material,function(index,items){
			var specification="";
			var model="";
			var code="";
			var isLeisure="";
			if(items.specification!=null&&items.specification!=""){
				specification="/"+items.specification;
			}
			if(items.model!=null&&items.model!=""){
				model="/"+items.model;
			}
			if(items.code!=null&&items.code!=""){
				code="/"+items.code;
			}
			if(items.isLeisure!=null&&items.isLeisure!=""){
				isLeisure="/"+items.isLeisure;
			}
			$("#materialId").append("<option value='"+items.id+"'>"+items.name+specification+model+code+isLeisure+"</option>");
		});
	}).fail(function(err) {
	}).always(function() {
	});
	$("#equipmentAddTemplate select[name='materialId']").change(function(){
		var $this = $(this);
		$(".add-equipment select[name='materialId']").each(function(i,n){
			if($this.val() == $(n).val() && $this.parents(".add-equipment").attr("id") != $(n).parents(".add-equipment").attr("id")){
				alert("不能重复选择同一个物料器材，请您选择其它物料器材。","warning",function(){
					$this.val("");
				});
				return;
			}
		});
	});
	$('#addEquipmentBtn').click(function(){
		var newEquipment = $("#equipmentAddTemplate").clone(true);
		newEquipment.attr("id","equipmentAdd-" + $(".add-equipment").length);
		newEquipment.find(".dynamicHtml-del").show();
		newEquipment.addClass("equipmentAddApply");
		newEquipment.find("input,select,textarea").val("");
		newEquipment.find("select[name='types']").empty();
		newEquipment.find("select[name='equipmentInformationIds']").empty();
		newEquipment.show();
		$(".add-equipment:last").after(newEquipment);
		$("#dataForm").data('bootstrapValidator').destroy();
        $('#dataForm').data('bootstrapValidator', null);
        addOreditEquipment();
	});
	
	
}
//动态删除事件
function delHtml(obj){
	var $this = $(obj);
	$this.parents(".add-equipment").remove();
}
//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/materialAcceptance/list', // 请求后台的URL（*）
		method : 'get', // 请求方式（*）
		columns : [ {
			title : '全部',
			field : 'checkAll',
			align : 'center',
			valign : 'middle',
			checkbox : true
		}, {
			title : '详情',
			field : 'detail',
			align : 'center',
			valign : 'middle',
			formatter : formatDetail,
			width : 100
		},/*{
			title : '库点',
			field : 'groupName',
			align : 'center',
			valign : 'middle',
			width : 100
		},*/ {
			title : '部门',
			field : 'departmentName',
			align : 'center',
			width : 250
		}, {
			title : '领用人',
			field : 'acceptancePersonName',
			align : 'center',
			width : 100
		}, {
			title : '领用时间',
			field : 'receiveTime',
			align : 'center',
			width : 200
		}, {
			title : '状态',
			field : 'statusName',
			align : 'center',
			width : 100
		}]
	});

};
//根据id获取详情
function getEquipmentAcceptanceDetail(id) {
	$.ajax({
		url : 'oa/materials/materialAcceptance/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.materialPurchase) {
			var materialPurchase = data.materialPurchase;
			setEidtPage(materialPurchase);
		}
		
	}).fail(function(err) {
		alert("领用信息获取失败!","warning");
	});
}
//组织编辑页面
function setEidtPage(materialPurchase) {
	$("#dataForm #id").val(materialPurchase.id);
	$("#dataForm #groupId").val(materialPurchase.groupId);
	$("#dataForm #equipmentId").val(materialPurchase.materialId);
	$("#dataForm #amount").val(materialPurchase.amount);
	$("#dataForm #applicantDepartmentId").val(materialPurchase.applicantDepartmentId);
	updateDepartment(materialPurchase.applicantDepartmentId,materialPurchase.acceptancePerson);
	$("#dataForm #applicant").val(materialPurchase.acceptancePerson);
	$("#dataForm #receiveTime").val(materialPurchase.receiveTime);
	$("#approverDiv").staffView('setVal',materialPurchase.nextApprovers);
	//放物料器材数据
	for(var i=0;i<materialPurchase.materialId.length;i++){
		var newEquipment = $("#equipmentAddTemplate").clone(true);
		newEquipment.attr("id","equipmentAdd-" + $(".add-equipment").length);
		$(newEquipment).find("select[name='materialId']").val(materialPurchase.materialId[i]);
		$(newEquipment).find("input[name='materialAcceptanceRelationId']").val(materialPurchase.materialAcceptanceRelationId[i]);
     	console.log(materialPurchase.materialAcceptanceRelationId[i])
		newEquipment.show();
		$(".add-equipment:last").after(newEquipment);
	}
	if(materialPurchase.statusValue==0){
		$('#addModal').modal('show');
	}else{
		alert("正在进行申请流程中，不能进行修改。","warning");
	}
	
}

//申请时间验证
function applyTimeDatePick(){
	$("#dataForm").data('bootstrapValidator')
	.updateStatus('receiveTime', 'NOT_VALIDATED', null)
	.validateField('receiveTime');
}

//新增OR修改
function addOreditEquipment() {
	$('#dataForm').bootstrapValidator({
		fields : {
			groupId : {
				validators : {
					notEmpty : {
						 message: '不能为空'
					}
				}
			},
			materialId : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},amount : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 38,
	                     message: '长度必须在1到38位之间'
	                 },
	                 regexp:{
							regexp:/^[0-9]*[1-9][0-9]*$/,
							message:"请输入数字"
						}
				}
			},applicantDepartmentId : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},acceptancePerson : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},receiveTime : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		var operation = $("#operation").val();
		
		//消除禁用disable按钮
		$("#dataForm select[name=groupId]").attr("disabled",false);
		$("#dataForm select[name=applicantDepartmentId]").attr("disabled",false);
		$("#dataForm select[name=acceptancePerson]").attr("disabled",false);
		
		if ("add" == operation) {
			var data =  $('#dataForm').serializeObject();
			data.nextApprovers = $("#approverDiv").staffView('getVal');
			if(!(data.materialId instanceof Array)){
				var materialIds=[];
				materialIds[0]=data.materialId;
				data.materialId=materialIds;
			}
			$.ajax({
				type : 'POST',
				url : "oa/materials/materialAcceptance",
				data : JSON.stringify(data)
			}).done(function(data) {
				console.log(1);
				$('#addModal').modal('hide');
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			var data =  $('#dataForm').serializeObject();
			data.nextApprovers = $("#approverDiv").staffView('getVal');
			if(!(data.materialId instanceof Array)){
				var materialIds=[];
				materialIds[0]=data.materialId;
				data.materialId=materialIds;
			}
			if(!(data.materialAcceptanceRelationId instanceof Array)){
				var materialAcceptanceRelationIds=[];
				materialAcceptanceRelationIds[0]=data.materialAcceptanceRelationId;
				data.materialAcceptanceRelationId=materialAcceptanceRelationIds;
			}
			console.log(data);
			$.ajax({
				type : 'PUT',
				url : "oa/materials/materialAcceptance",
				data :JSON.stringify(data)
			}).done(function(data) {
				$('#addModal').modal('hide');
				alert("修改成功");
			}).fail(function(err) {
				alert("修改失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else {
			alert("未定义的操作!","warning");
			$("#dataForm").reset();
		}
	});
}
//删除
function deleteEquipment() {
	var selections = $("#table").bootstrapTable("getSelections");
	for(var i = 0;i < selections.length;i++){
		if(selections[i].statusValue==1||selections[i].statusValue==2){
			alert("记录中有已审批通过或正在审批中不能操作!","warning");
			return;
		}
	}
	confirm("是否确认删除？",function(){
		$.each(selections,function(i,o){
				if (o.id == "") {
					return;
				}
				$.ajax({
					url : 'oa/materials/materialAcceptance/' + o.id,
					type : 'DELETE'
				}).done(function(data) {
					alert("删除成功!");
				}).fail(function(err) {
					alert("删除失败!","warning");
				}).always(function() {
					$table.bootstrapTable('refresh');
					$("#dataForm").reset();
				});
			});
			// 提示成功
			$table.bootstrapTable('refresh', {url : 'oa/materials/materialAcceptance/list'});
			alert("删除成功!");
    });
	$("#dataForm").reset();
}
//修改部门重新获取人员
function updateDepartment(applicantDepartment,applicant){
	var applicantDepartmentId=null;
	if(applicantDepartment!=null){
		applicantDepartmentId=applicantDepartment;
	}else{
		applicantDepartmentId=$("#applicantDepartmentId").val();
	}
	$.ajax({
		url : 'oa/materials/materialAcceptance/department/'+applicantDepartmentId,
		type : 'GET'
	}).done(function(data) {
		$("#acceptancePerson").html("");
		$("#acceptancePerson").append("<option value=''>请选择</option>");
		$.each(data.staff,function(index,items){
			$("#acceptancePerson").append("<option value='"+items.id+"'>"+items.realName+"</option>");
		});
		$("#acceptancePerson").append();
		$("#acceptancePerson").val(applicant);
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
//查看详情点击
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
}

//查看物料器材是否已经被申请了
function whetherReceive(){
	$.ajax({
		url : 'oa/materials/materialAcceptance/whetherReceive/' + $("#materialId").val(),
        type: 'GET'
	}).done(function(data) {
		if(data.size>0){
			alert("该物料器材已经有人申请了，您确定是否继续!","warning");
		}
	}).fail(function(err) {
		alert("查询信息失败!","warning");
	}).always(function() {
	});
}

//详情
function searchDetails(id){
	$("#detial").modal("show");
	var row = $("#table").bootstrapTable("getData")[id];
	$.each(row,function(index,value){
		var values = value==null?"":value;
		$("#detial span[id='"+index+"']").text(values);
		$("#detial span[id='"+index+"']").attr("title",values);
	});
	
	console.log(row);
	initTable2();
	var tr_html = "";
	console.log(row);
	$("#detial #equipment_Info").empty();
	for(var i = 0;i<row.name.length;i++){
		var specification="";
		var model="";
		var code="";
		if(row.specification[i]!=null&&row.specification[i]!=""){
			specification="/"+row.specification[i];
		}
		if(row.model[i]!=null&&row.model[i]!=""){
			model="/"+row.model[i];
		}
		if(row.code[i]!=null&&row.code[i]!=""){
			code="/"+row.code[i];
		}
		tr_html += "<tr><td>"+row.name[i]+specification+model+code+"</td></tr>";
	}
	$("#detial #equipment_Info").append(tr_html);
	initTable3();
	var approve_html = "";
	$("#detial #approve_opinion").empty();
	var info = row.approvalProcessHistory;
	for(var i = 0;i<info.length;i++){
		var result=null;
		if(info[i].result==="1"){
			result='通过';
		}else if(info[i].result==="0"){
			result='驳回';
		}
		var comment = info[i].comment==null?"无":info[i].comment;
		approve_html += "<tr><td>"+info[i].approverName+"</td>"+
			        "<td>"+info[i].time+"</td>"+
			        "<td>"+comment+"</td>"+
			        "<td>"+result+"</td></tr>";
	}
	$("#detial #approve_opinion").append(approve_html);
	
}
//初始化申请详细信息table
function initTable2() {
    $("#table2").bootstrapTable({
    	toolbar: "",
		height: 0,
        sortable: true,
        sortOrder: 'desc',
        sortName: 'f1',
        pagination: false,
		icons:{detailOpen: '',detailClose: ''},
        columns: [{field: 'f1'}]
    });
}
//初始化审批记录table
function initTable3() {
    $("#table3").bootstrapTable({
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
//修改设备信息重新获取库存
function updateName(){
	$.ajax({
		url : 'oa/materials/materialAcceptance/stock/'+$("#dataForm #materialId").val(),
		type : 'GET'
	}).done(function(data) {
		$('#dataForm #stock').html(data.materialStock.currentStock);
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}

//判断是否库存充足
function calculateAmount(){
	var amount=$("#dataForm #amount").val();
	var stock=$('#dataForm #stock').text();
	if(amount>stock){
		alert("库存不足","warning");
	}
}