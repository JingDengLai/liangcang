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
function initTable(status){
	$("#table").bootstrapTable({
		url: "oa/officialDocument/approvalList", // 后台请求的url
		method : 'get', // 请求方式（*）
		height: getHeight(),// 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		columns: [{
			title: "详情",
			formatter: formatDetail
		},{
			title: "类型",
			field: "type"
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
			title: "拟稿",
			field: "drafter",
			formatter: formatSubstring
		},{
			title: "核稿",
			field: "reviewer",
			formatter: formatSubstring
		},{
			title: "校对",
			field: "verifier",
			formatter: formatSubstring
		},{
			title: "拟稿单位",
			field: "department",
			formatter: formatSubstring
		},{
			title: "发文时间",
			field: "sendTime"
		}]
	});
}

//行高
function getHeight() {
    return $(window).height() - $('.header').outerHeight(true)- $('.wrap-top').outerHeight(true) - $('.title').outerHeight(true) - 16;
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
