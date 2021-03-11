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
		$table.bootstrapTable('refresh', {url : 'oa/materials/materialPurchase/list'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	// 申请按钮
	$("#add").click(function() {
		modalInit();
		getName();
		initTree();
		$(".equipmentAddApply").remove();
		$("#addModalLabel").html("购入申请");
		
		//禁用disable按钮
		$("#dataForm select[name=groupId]").attr("disabled","disabled");
		$("#dataForm select[name=applicantDepartmentId]").attr("disabled","disabled");
		$("#dataForm select[name=purchasePerson]").attr("disabled","disabled");
		
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
		$("#addModalLabel").html("修改购入申请");
		$(".equipmentAddApply").remove();
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
			getEquipmentPurchaseDetail(o.id);
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
	//新增物料器材
	$('.equitment-apply-but').click(function(){
		$('#addEquipment').modal('show');
	})
	$('#addEquipment').on('hide.bs.modal', function() {
		$("#addEquipment form").each(function() {
			$(this).reset();
		});
	})
	// 新增保存、编辑保存
	addOreditEquipment();
	//addEquipment();
	modalInit();
});

//初始化申请页面
function modalInit() {
	$("#equipmentAdd-0 input[name='checkbox']").change(function(){
		var $this = $(this);
		if($this.is(':checked')){
			$this.parents(".add-equipment").find("#purchaseMaterial").show();
			$this.parents(".add-equipment").find("#purchaseName").hide();
			$this.parents(".add-equipment").find("#purchaseSpecification").hide();
			$this.parents(".add-equipment").find("#purchaseModel").hide();
			$this.parents(".add-equipment").find("input[name=isWhether]").val("0");//0追加1不追加
		}else{
			$this.parents(".add-equipment").find("#purchaseMaterial").hide();
			$this.parents(".add-equipment").find("#purchaseName").show();
			$this.parents(".add-equipment").find("#purchaseSpecification").show();
			$this.parents(".add-equipment").find("#purchaseModel").show();
			$this.parents(".add-equipment").find("input[name=isWhether]").val("1");//0追加1不追加
		}
	});
	$("#dataForm #purchaseMaterial").hide();
	$("#dataForm #purchaseName").show();
	$("#dataForm #purchaseSpecification").show();
	$("#dataForm #purchaseModel").show();
	$(".dynamicHtml-del").hide();
	$.ajax({
		url : 'oa/materials/materialPurchase/getMaterial',
		type : 'GET'
	}).done(function(data) {
		$("#materialInformationIds").empty();
		$("#materialInformationIds").append("<option value=''>请选择</option>");
		$.each(data.materialInformation,function(index,items){
			var specification="";
			var model="";
			if(items.specification!=null&&items.specification!=""){
			
				specification="/"+items.specification;
			}
			if(items.model!=null&&items.model!=""){
				model="/"+items.model;
			}
			$("#materialInformationIds").append("<option value='"+items.id+"'>"+items.name+specification+model+"</option>");
		});
	}).fail(function(err) {
	}).always(function() {
	});
	$("#equipmentAdd-0 select[name='materialInformationIds']").change(function(){
		var $this = $(this);
		$(".add-equipment select[name='materialInformationIds']").each(function(i,n){
			if($this.val() == $(n).val() && $this.parents(".add-equipment").attr("id") != $(n).parents(".add-equipment").attr("id")){
				alert("不能重复选择同一个物料器材，请您选择其它物料器材。","warning",function(){
					$this.val("");
				});
				return;
			}
		});
	});
}
//申请中添加一条设备信息按钮点击事件
$('#addEquipmentBtn').click(function(){
	var newEquipment = $("#equipmentAdd-0").clone(true);
	newEquipment.attr("id","equipmentAdd-" + $(".add-equipment").length);
	newEquipment.find(".dynamicHtml-del").show();
	newEquipment.addClass("equipmentAddApply");
	newEquipment.find("input,select,textarea").val("");
	newEquipment.show();
	$(".add-equipment:last").after(newEquipment);
	$("#dataForm").data('bootstrapValidator').destroy();
    $('#dataForm').data('bootstrapValidator', null);
    addOreditEquipment();
});

//动态删除事件
function delHtml(obj){
	var $this = $(obj);
	$this.parents(".add-equipment").remove();
}

//列表查询（分页）
function tableInit() {
	$table.bootstrapTable({
		url : 'oa/materials/materialPurchase/list', // 请求后台的URL（*）
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
		}/*, {
			title : '库点',
			field : 'groupName',
			align : 'center',
			valign : 'middle',
			width : 100
		}*/, {
			title : '总金额(元)',
			field : 'totalMoney',
			align : 'center',
			width : 100
		}, {
			title : '部门',
			field : 'departmentName',
			align : 'center',
			width : 250
		}, {
			title : '申请人',
			field : 'purchasePersonName',
			align : 'center',
			width : 100
		}, {
			title : '申请时间',
			field : 'purchaseTime',
			align : 'center',
			width : 200
		}, {
			title : '状态',
			field : 'status',
			align : 'center',
			width : 100
		}]
	});

};
//根据id获取详情
function getEquipmentPurchaseDetail(id) {
	$.ajax({
		url : 'oa/materials/materialPurchase/' + id + '',
		type : 'GET'
	}).done(function(data) {
		if (null != data.materialPurchase) {
			var materialPurchase = data.materialPurchase;
			setEidtPage(materialPurchase);
		}
		
	}).fail(function(err) {
		alert("购入 信息获取失败!","warning");
	});
}
//组织编辑页面
function setEidtPage(materialPurchase) {
	$("#dataForm #id").val(materialPurchase.id);
	$("#dataForm #groupId").val(materialPurchase.groupId);
	$("#dataForm #totalMoney").val(materialPurchase.totalMoney);
	$("#dataForm #applicantDepartmentId").val(materialPurchase.applicantDepartmentId);
	updateDepartment(materialPurchase.applicantDepartmentId,materialPurchase.purchasePerson);
	$("#dataForm #purchasePerson").val(materialPurchase.purchasePerson);
	$("#dataForm #purchaseTime").val(materialPurchase.purchaseTime);
	$("#approverDiv").staffView('setVal',materialPurchase.nextApprovers);
	//放设备数据
	var info=materialPurchase.purchaseRelation;
	for(var i=0;i<materialPurchase.purchaseRelation.length;i++){
		var newEquipment = $("#equipmentAdd-0").clone(true);
		$(newEquipment).find("input[name=isWhether]").val("0");//0追加1不追加
		newEquipment.attr("id","equipmentAdd-" + $(".add-equipment").length);
		$(newEquipment).find("input[name='checkbox']").attr("checked",'true');
		$(newEquipment).find("select[name='materialInformationIds']").val(info[i].materialInformationId);
		$(newEquipment).find("input[name='materialPurchaseRelationId']").val(info[i].materialPurchaseRelationId);
		$(newEquipment).find("input[name='prices']").val(info[i].price);
		$(newEquipment).find("input[name='amounts']").val(info[i].amount);
		newEquipment.show();
		newEquipment.addClass("equipmentAddApply");
		$(".add-equipment:last").after(newEquipment);
		$("#dataForm #purchaseMaterial").show();
		$("#dataForm #purchaseName").hide();
		$("#dataForm #purchaseSpecification").hide();
		$("#dataForm #purchaseModel").hide();
		$("#dataForm #equipmentAdd-0").hide();
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
	.updateStatus('purchaseTime', 'NOT_VALIDATED', null)
	.validateField('purchaseTime');
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
			materialInformationIds : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},
			names : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message:"不能超过32个字符"
	                }
				}
			},
			specifications : {
				validators : {
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message:"不能超过32个字符"
	                }
				}
			},
			models : {
				validators : {
					stringLength: {
	                     min: 1,
	                     max: 32,
	                     message:"不能超过32个字符"
	                }
				}
			},
			prices : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 6,
	                     message:"不能超过6个数字"
	                },
	                regexp:{
						regexp:/^\d+(\.\d{1,2})?$/,
						message:"只能填写数字，小数点后不能超过2位"
					}
	                 
				}
			},amounts : {
				validators : {
					notEmpty : {
						message: '不能为空'
					},
					stringLength: {
	                     min: 1,
	                     max: 8,
	                     message: '不能大于8个数字'
	                 },
	                 regexp:{
							regexp:/^[0-9]*[1-9][0-9]*$/,
							message:"只能填写数字，不能为0"
						}
				}
			},applicantDepartmentId : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},purchasePerson : {
				validators : {
					notEmpty : {
						message: '不能为空'
					}
				}
			},purchaseTime : {
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
		$("#dataForm select[name=purchasePerson]").attr("disabled",false);
		
		if ("add" == operation) {
			var mydata =  $('#dataForm').serializeObject();
			var data = {};
			data.nextApprovers = $("#approverDiv").staffView('getVal');
			data.groupId = mydata.groupId;
			data.totalMoney = mydata.totalMoney;
			data.purchasePerson = mydata.purchasePerson;
			data.purchaseTime = mydata.purchaseTime;
			data.purchaseRelation = new Array();
			$("#dataForm .add-equipment").each(function(){
				var info = {
						price:$(this).find("input[name=prices]").val(),
						amount:$(this).find("input[name=amounts]").val(),
					}
				if($(this).find("input[name=names]").val()!=null && $(this).find("input[name=names]").val()!=""){
					info.names = $(this).find("input[name=names]").val();
					info.specifications = $(this).find("input[name=specifications]").val();
					info.models = $(this).find("input[name=models]").val();
					info.isWhether = "1";//不追加
				}
				if($(this).find("select[name=materialInformationIds]").val()!=null && $(this).find("select[name=materialInformationIds]").val()!=""){
					info.materialInformationIds = $(this).find("select[name=materialInformationIds]").val();
					info.isWhether = "0";//追加
				}
				data.purchaseRelation.push(info);
			});
			$.ajax({
				type : 'POST',
				url : "oa/materials/materialPurchase",
				data : JSON.stringify(data)
			}).done(function(data) {
				console.log(data);
				$('#addModal').modal('hide');
				alert("添加成功!");
			}).fail(function(err) {
				alert("添加失败!","warning");
			}).always(function() {
				$("#dataForm").reset();
				$('#table').bootstrapTable('refresh');
			});
		} else if ("edit" == operation) {
			var mydata =  $('#dataForm').serializeObject();
			var data = {};
			console.log(mydata);
			data.nextApprovers = $("#approverDiv").staffView('getVal');
			data.id = mydata.id;
			data.groupId = mydata.groupId;
			data.totalMoney = mydata.totalMoney;
			data.purchasePerson = mydata.purchasePerson;
			data.purchaseTime = mydata.purchaseTime;
			data.purchaseRelation = new Array();
			var arr = mydata.isWhether;
			data.isWhether = arr.splice(1,arr.length);
			
			if(mydata.prices instanceof Array){
				for(var i=0;i<mydata.prices.length;i++){
					if(data.isWhether[i]== 1){
						if(mydata.names instanceof Array){
							var info = {
									names : mydata.names[i],
									specifications : mydata.specifications[i],
									models : mydata.models[i],
									price : mydata.prices[i],
									amount : mydata.amounts[i],
									isWhether : data.isWhether[i]
								}
								data.purchaseRelation.push(info);
						}else{
							var info = {
									names : mydata.names,
									specifications : mydata.specifications,
									models : mydata.models,
									price : mydata.prices[i],
									amount : mydata.amounts[i],
									isWhether : data.isWhether[i]
								}
								data.purchaseRelation.push(info);
						}
						
					}else{
						if(mydata.materialInformationIds instanceof Array){
							var info = {
									materialPurchaseRelationId : mydata.materialPurchaseRelationId[i],
									materialInformationIds : mydata.materialInformationIds[i],
									price : mydata.prices[i],
									amount : mydata.amounts[i],
									isWhether : data.isWhether[i]
								}
								data.purchaseRelation.push(info);
						}else{
							var info = {
									materialPurchaseRelationId : mydata.materialPurchaseRelationId,
									materialInformationIds : mydata.materialInformationIds,
									price : mydata.prices[i],
									amount : mydata.amounts[i],
									isWhether : data.isWhether[i]
								}
								data.purchaseRelation.push(info);
						}
						
					}
				}
			}else{
				var v = data.isWhether[0];
				if(mydata.names){
					var info = {
							names : mydata.names,
							specifications : mydata.specifications,
							models : mydata.models,
							price : mydata.prices,
							amount : mydata.amounts,
							isWhether : v
						}
						data.purchaseRelation.push(info);
				}else{
					var info = {
							materialPurchaseRelationId : mydata.materialPurchaseRelationId,
							materialInformationIds : mydata.materialInformationIds,
							price : mydata.prices,
							amount : mydata.amounts,
							isWhether : v
						}
						data.purchaseRelation.push(info);
				}
				
			}
			$.ajax({
				type : 'PUT',
				url : "oa/materials/materialPurchase",
				data : JSON.stringify(data)
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
					url : 'oa/materials/materialPurchase/' + o.id,
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
		    $table.bootstrapTable('refresh', {url : 'oa/materials/materialPurchase/list'});
			alert("删除成功!");
    });
	
	$("#dataForm").reset();
}
//查询设备信息
function getName(){
	$.ajax({
		url : 'oa/materials/materialPurchase/materialInformation',
		type : 'GET'
	}).done(function(data) {
		$("#materialInformationIds").empty();
		$("#materialInformationIds").append("<option value=''>请选择</option>");
		$.each(data.materialInformation,function(index,items){
			var specification="";
			var model="";
			if(items.specification!=null&&items.specification!=""){
			
				specification="/"+items.specification;
			}
			if(items.model!=null&&items.model!=""){
				model="/"+items.model;
			}
			$("#materialInformationIds").append("<option value='"+items.id+"'>"+items.name+specification+model+"</option>");
		});
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
/*//改变设备类别重新查询设备信息
function updateName(){
	$.ajax({
		url : 'oa/materials/'+$("#dataForm #materialId").val(),
		type : 'GET'
	}).done(function(data) {
		$('#dataForm #specification').val(data.material.specification);
		$('#dataForm #model').val(data.material.model);
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}
*/
//改变部门重新获取人员信息
function updateDepartment(applicantDepartment,purchasePerson){
	var applicantDepartmentId=null;
	if(applicantDepartment!=null){
		applicantDepartmentId=applicantDepartment;
	}else{
		applicantDepartmentId=$("#applicantDepartmentId").val();
	}
	$.ajax({
		url : 'oa/materials/materialPurchase/department/'+applicantDepartmentId,
		type : 'GET'
	}).done(function(data) {
		$("#purchasePerson").html("");
		$("#purchasePerson").append("<option value=''>请选择</option>");
		$.each(data.staff,function(index,items){
			$("#purchasePerson").append("<option value='"+items.id+"'>"+items.realName+"</option>");
		});
		$("#purchasePerson").append();
		$("#purchasePerson").val(purchasePerson);
	}).fail(function(err) {
		
	}).always(function() {
		
	});
}

//计算总金额
function calculateAmount(){
	var divlength = $(".add-equipment").length - 1;
	var total = 0;
	for(var i=0;i<=divlength;i++){
		var d_price = $("#equipmentAdd-"+i+" input[name=prices]").val();
		var d_amount = $("#equipmentAdd-"+i+" input[name=amounts]").val();
		if(d_price==null||d_price==""){
			d_price = 0;
		}
		if(d_amount==null||d_amount==""){
			d_amount = 0;
		}
		total = accAdd(total,d_price * 10000 * d_amount / 10000)
	}
	
	$("#dataForm input[name=totalMoney]").val(total);
}

//js加法计算
function accAdd(arg1,arg2){
	var r1,r2,m;
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
	m=Math.pow(10,Math.max(r1,r2))
	return (arg1*m+arg2*m)/m
}
function formatDetail(value, row,index) {
	return '<a class="details" onclick="searchDetails('+index+')"><span class="eye"></span></a>';
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
	
	
	
	initTable2();
	var tr_html = "";
	$("#detial #equipment_Info").empty();
	var info = row.purchaseRelation;
	for(var i = 0;i<info.length;i++){
		var specification="";
		var model="";
		if(info[i].specifications!=null&&info[i].specifications!=""){
			specification="/"+info[i].specifications;
		}
		if(info[i].models!=null&&info[i].models!=""){
			model="/"+info[i].models;
		}
		tr_html += "<tr><td>"+info[i].names+specification+model+"</td>"+
			        "<td>"+info[i].price+"</td>"+
			        "<td>"+info[i].amount+"</td></tr>";
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

//初始化设备详情 table
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

//初始化审批人 table
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