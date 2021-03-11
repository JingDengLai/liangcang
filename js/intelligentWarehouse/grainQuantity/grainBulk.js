$(function () {
	initStyle();
	grainInfo();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var groupId = $("#groupId").val();
		var warehouseId = $("#warehouseId").val();
		if(warehouseId==''||warehouseId==undefined){
			alert("请选择仓间号！","warning");
			return;
		}
		var isshow = $("#isshow").val();
		if(isshow=="1"){
			window.location.href=getRootPath_dc()+"/grainQuantity/grainBulk?groupId="+groupId+"&warehouseId="+warehouseId+"&isshow=1";
		}else{
			window.location.href=getRootPath_dc()+"/grainQuantity/grainBulk?groupId="+groupId+"&warehouseId="+warehouseId;
		}
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
});
//看插件是否安装
function initStyle(){
	var a = grainTempocx.object;
	if (a != null) {
		$("#grainTempocx").hide();
		$(".download").show();
		$("#download").hide();
		$("#loading").show();
	} else {
		$("#grainTempocx").hide();
		$(".download").show();
		$("#loading").hide();
		$("#download").show();
	}
}
//初始化三维粮堆
function init3d(data) {
		var width = $("#ocx").width();
		var height = $("#ocx").height();
		setTimeout(function() {
			$("#grainTempocx").width(width);
			$("#grainTempocx").height(height);
			var porities = data.grainBulkVo.varietyName+";"+data.grainBulkVo.currentStock+"kg;"+data.grainBulkVo.grainHeight+"m;"+data.grainBulkVo.length+"m;"+data.grainBulkVo.width+"m;"+data.grainBulkVo.height+"m;";
			grainTempocx.initGrainNum(width, height,data.HumitureData.warehouseType,porities,""); 
			 
   			/* graintestocx.setGrainNum("小麦;5000吨;6.02米;20米;30米;40米;");
   			graintestocx.initGrainNum(width, height,"小麦;4098吨;6.02米;20米;30米;40米;");
   			// int changeTempData( minTemp, maxTemp,int layernum,int rownum,int linenum,QString data); */
			/* grainTempocx.initGrainNum(width, height,"玉米;3445吨;45米");	 */
			$("#grainTempocx").show();
			$(".download").hide();
		}, 1);
}
//监测数量
function grainInfo(){
	initStyle();
	var grainInfoData;
	$.ajax({
		type: 'get',
		url: 'grainQuantity/grainBulk/info',
	    data:{groupId: $("#groupId").val(),warehouseId: $("#warehouseId").val()},
	}).done(function(data){
		if(data.grainBulkVo.type==="2"){
			$("#circularDiameterDiv").show();
			$("#circularHeightDiv").show();
			$("#lengthDiv").hide();
			$("#widthDiv").hide();
			$("#heightDiv").hide();
		}
		if(data.grainBulkVo.measureCount){
			$("#measureCountDiv").show();
		}
		$.each(data.grainBulkVo,function(index,value){
			
			if(index=='length' && value==null){
				$("#grainInfo #in_length").text("");
			}
			if(index=='width' && value==null){
				$("#grainInfo #in_width").text("");
			}
			if(index=='height' && value==null){
				$("#grainInfo #in_height").text("");
			}
			
			if(index=='grainHeight' && value==null){
				$("#grainInfo #in_grainHeight").text("");
			}
			if(index=='currentStock' && value==null){
				$("#grainInfo #in_currentStock").text("");
			}
			if(index=='volume' && value==null){
				$("#grainInfo #in_volume").text("");
			}
			if(index=='deductVolume' && value==null){
				$("#grainInfo #in_deductVolume").text("");
			}if(index=='actualVolume' && value==null){
				$("#grainInfo #in_actualVolume").text("");
			}
			if(index=='measureCount' && value==null){
				$("#grainInfo #in_measureCount").text("");
			}
			
			var values = value==null?"无":value;
			$("#grainInfo span[id='"+index+"']").text(values);
			$("#grainInfo span[id='"+index+"']").attr("title",values);
		});
		init3d(data);
	}).fail(function(err){
		alert("获取信息失败！","warning");
	}).always(function(){
		
	});	
	
};
