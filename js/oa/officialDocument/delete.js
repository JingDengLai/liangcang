$(function() {
	//初始化列表
	initTable();
	
	//删除
	$("#del").click(function(){
		var row = $("#table").bootstrapTable("getSelections");
		var ids = [];
		$.each(ids,function(index,items){
			ids.push(items.id);
		});
		if(row.length > 0){
			confirm("确认要删除该数据吗？",function(){
			});
		}else{
			alert("请选择要删除的记录!","warning");
		}
	});
	
});


//列表
function initTable(){
	$("#table").bootstrapTable({
		url: "oa/officialDocument/deleteList", // 后台请求的url
		method : 'get', // 请求方式（*）
		height: getHeight(),// 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		columns: [{
			title: "详情",
			formatter: formatDetail
		},{
			title: "类型",
			field: "type",
		},{
			title: "文号",
			field: "officialNo",
			formatter: formatSubstring
		},{
			title: "标题",
			field: "title",
			formatter: formatSubstring
		},{
			title: "密级",
			field: "securityDegreeName"
		},{
			title: "缓急",
			field: "urgencyDegreeName"
		},{
			title: "拟稿单位",
			field: "department",
			formatter: formatSubstring
		},{
			title: "删除时间",
			field: "updateTime"
		},{
			title: "操作",
			formatter: formatRecovery
		}]
	});
}


function formatSubstring(value,row,index){
	if(value){
		if(value.length>=10){
			return "<div title='" + value + "'><span>" + value.substring(0,8) + "..." + "</span></div>";
			//return value.substring(0,15)+"...";
		}else{
			return value;
		}
	}else{
		return "";
	}
}


//行高
function getHeight() {
    return $(window).height() - $('.header').outerHeight(true)- $('.wrap-top').outerHeight(true) - $('.pageForm').outerHeight(true);
}

//草稿箱的恢复功能
function formatRecovery(value,row,index){
	return '<a class="details" onclick="recovery(\''+row.id+'\',\''+row.officialDocumentId+"'\,"+ row.typeValue+')"><span>还原</span></a>';
}

                     
function recovery(id,officialDocumentId,typeValue){
	if (id == "") {
		return;
	}else{
		if(null == officialDocumentId){
			officialDocumentId = 0;
		}
	}
	$.ajax({
		url : 'oa/officialDocument/officialDocumentRecovery/' + id + '/'+officialDocumentId+ '/'+typeValue,
		type : 'PUT',
	}).done(function(data) {
		$('#table').bootstrapTable('refresh');
		getStatusNum();
		if(data<1){
			alert("恢复失败!","warning");
		    return;
		}
	}).fail(function() {
		alert("恢复失败!","warning");
		return;
	});
}




