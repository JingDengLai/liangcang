var boxHeight, videoHeight, videoWidth, $table = $('#table');
$(function() {
	
	// 初始化列表——方案
	initTable();
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform")[0].reset();
	});
	// 查询按钮
	$("#submit_search").click(function(){
		var name = $.trim($('#searchform #search_name').val());
		$('#searchform #search_name').val(name);
		$table.bootstrapTable('refresh', {url: "oa/check/plan/appraisalPlanList"});
	});
});  


//列表——方案
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/check/plan/appraisalPlanList", // 后台请求的url
		method : 'get', // 请求方式（*）
		columns: [{
			title: "方案名称",
			field: "name",
			formatter: formatSubstring
		},{
			title: "考核类型",
			field: "type"
		},{
			title: "开始时间",
			field: "startTime"
		},{
			title: "结束时间",
			field: "endTime"
		},{
			title: "负责人",
			field: "responsiblePersonName"
		},{
			title: "状态",
			field: "statusName"
		},{
			title: "备注",
			field: "remark",
			formatter: formatSubstring
		},{
			title: "操作",
			formatter: formatDetail1
		}]
	});
}

function formatDetail1(value,row,index){
	return '<a class="details" onclick="appraisalStaffDetail(\''+row.planId+'\')"><span>评分</span></a>';
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

//查看详情1	
function appraisalStaffDetail(planId){
	$("#detial1Modal").modal("show");
	$("#detial1_table").bootstrapTable('destroy');
	
	// 初始化列表——考核指标
	detial1InitTable(planId);
	
	//获取考核指标列表中模板Id(templateId)
	//$("#templateId").val(templateId);
	
}

//列表——方案详情
function detial1InitTable(planId){
	$("#detial1_table").bootstrapTable({
		url: "oa/check/plan/getAppraisalStaffDetailList?planId="+planId, // 后台请求的url
		toolbar : false,
		method : 'get', // 请求方式（*）
		height: 400,
		pagination : false, // 是否显示分页（*）
		columns: [{
			title: "考核人员",
			field: "staffName"
		},{
			title: "总分",
			field: "totalPoint"
		},{
			title: "操作",
			formatter: formatDetail2
		},]
	});
}

function formatDetail2(value,row,index){
	return '<a class="details" onclick="staffItemDetail(\''+row.id+'\')"><span>评分</span></a>';
}

//查看详情2	
function staffItemDetail(id){
	console.log(id);
	$("#dataForm").reset();
	$("#detial2Modal").modal("show");
	//$("#detial2_table").bootstrapTable('destroy');
	
	// 初始化列表——考核指标
	detial2InitTable(id);
}

//列表——方案详情(考核人员)——考核人员详情(考核指标)
function detial2InitTable(id){
	$("#detial2_table").bootstrapTable('destroy'); 
	$("#detial2_table").bootstrapTable({
		url: "oa/check/plan/getCheckItemDetailList?id="+id, // 后台请求的url
		toolbar : false,
		method : 'get', // 请求方式（*）
		height: 400,
		pagination : false, // 是否显示分页（*）
		columns: [{
			title: "指标项",
			field: "item"
		},{
			title: "权重",
			field: "weight"
		},{
			title: "满分",
			field: "point"
		},{
			title: "评分",
			field: "score",
			formatter: formatScore
		}],
		onLoadSuccess:function(){
			setScore();
			//给人员考核项评分
		}
	});
}



function formatScore(value,row,index){
	if(row.score == null){
		row.score = 0;
	}
	return '<div class="form-group"><input type="hidden" name="id" value=\''+row.id+'\'><input type="text" id="score'+row.id+'" class="form-control" name="score" value='+row.score+' style="width: 80px;" onkeyup="setScoreKeyup('+row.score+','+row.point+',\''+row.id+'\')"/></div>';
}

function setScoreKeyup(score,point,id){
	var value = $('#score'+id+'').val();
	if(value>point){
		alert("评分不能大于满分");
		$('#score'+id+'').val(score);
	}
}

$('#detial2Modal').on('hidden.bs.modal', function() {
    $("#dataForm").data('bootstrapValidator').destroy();
    $('#dataForm').data('bootstrapValidator', null);
});

//评分
function setScore() {
	$('#dataForm').bootstrapValidator({
		fields : {
			score: {
				validators: {
					notEmpty: {
						message: "不能为空"
					},
					stringLength: {
						max:2,
						message:"不能超过2位"
					},
					regexp:{
						regexp:/^[0-9]*[1-9][0-9]*$/,
						message:"只能填写正数字"
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		/*var datafrom = JSON.parse($("#dataForm").serializeJson());
		var id = new Array();
		var score = new Array();
		if(typeof datafrom.id == 'string' && typeof datafrom.score == 'string'){
			score[0]=datafrom.score;
		}*/
		var dataform = $("#dataForm").serializeObject();
		var id = new Array();
		var score = new Array();
		if(typeof dataform.id == 'string' && typeof dataform.score == 'string'){
			id[0]=dataform.id;
			dataform.id = id;
			score[0]=dataform.score;
			dataform.score = score;
		}
		console.log(JSON.stringify(dataform));
		e.preventDefault();
		$.ajax({
			type : 'POST',
			url : "oa/check/score/setScore",
			data : JSON.stringify(dataform),
		}).done(function(data) {
			if (data.flag == true || data.num>0) {
				alert("评分完成!");
				$('#detial2Modal').modal('hide');
				$('#table').bootstrapTable('refresh');
			} else {
				alert("评分失败！","warning");
			}
			$('#detial1_table').bootstrapTable('refresh');
		}).fail(function(err) {
			alert("评分失败!", "warning");
		}).always(function() {
			$('#detial1_table').bootstrapTable('refresh');
			$("#dataForm").reset();

		});
	});
}

