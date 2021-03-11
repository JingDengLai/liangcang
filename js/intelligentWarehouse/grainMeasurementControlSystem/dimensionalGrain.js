$(function () {
	initStyle();
	//初始化加载
	initWarehouse();
});

function initWarehouse(){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	
	//梯度值
	$("#maxGradValue").text("");
	$("#minGradValue").text("");
	$("#avgGradValue").text("");
	
	$.ajax({
		type: 'get',
		url: 'temperature/threeDimensionShow/getRowFloorTempValue',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId},
		success: function(content){
			if(content==null){
				return
			}
			var dataList = content.dataList;
			if(dataList){
				$("#threeDimension").empty();
				$.each(dataList, function (i, item){
					var html=
						"<li>"+
						"<i id='"+item.row+"' onclick='switchOnOff(this)' class='body-state on'></i>"+
						"<div class='body-info'>"+
							"<p>第"+item.row+"层</p>"+
							"<p class='body-info-second'>"+
							"<span>最高</span>"+
							"<span>"+item.maxTempValue+"℃</span>"+
							"<span>平均</span>"+
							"<span>"+item.avgTempValue+"℃</span>"+
							"<span>最低</span>"+
							"<span>"+item.minTempValue+"℃</span>"+
							"</p>"+
							"</div>"+
							"</li>";
					$("#threeDimension").append(html);
					//grainTempocx.horizontalShow();
					
				});
				
				//去掉最后一个的竖线
				$("#threeDimension").find("li:last").find("i").addClass("body-state-last");
				
				//梯度值
				$("#maxGradValue").text((Math.abs(dataList[dataList.length-1].maxTempValue - dataList[0].maxTempValue)/5.4).toFixed(2));
				$("#minGradValue").text((Math.abs(dataList[dataList.length-1].minTempValue - dataList[0].minTempValue)/5.4).toFixed(2));
				$("#avgGradValue").text((Math.abs(dataList[dataList.length-1].avgTempValue - dataList[0].avgTempValue)/5.4).toFixed(2));
			}
	    }		
   });
	$.ajax({
		type: 'get',
		url: 'temperature/threeDimensionShow/getWarehouse3DModel',
		dataType: 'json',
		timeout : 20000,
		data:{"groupId": groupId,"warehouseId":warehouseId},
		success: function(content){
			if(content==null){
				return
			}
			var dataList = content.dataList;
			var HumitureData = content.HumitureData;
			if(HumitureData){//初始化模型
				init3d(HumitureData);
			}
		}		
	});
};

function initRowChart(){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	
	//梯度值
	$("#maxGradValue").text("");
	$("#minGradValue").text("");
	$("#avgGradValue").text("");
	
	$.ajax({
		type: 'get',
		url: 'temperature/threeDimensionShow/getRowFloorTempValue',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId},
		success: function(content){
			if(content==null){
				return
			}
			var dataList = content.dataList;
			if(dataList){
				$("#threeDimension").empty();
				$.each(dataList, function (i, item){
					var html=
						"<li>"+
						"<i id='"+item.row+"' onclick='switchOnOff(this)' class='body-state on'></i>"+
						"<div class='body-info'>"+
							"<p>第"+item.row+"层</p>"+
							"<p class='body-info-second'>"+
							"<span>最高</span>"+
							"<span>"+item.maxTempValue+"℃</span>"+
							"<span>平均</span>"+
							"<span>"+item.avgTempValue+"℃</span>"+
							"<span>最低</span>"+
							"<span>"+item.minTempValue+"℃</span>"+
							"</p>"+
							"</div>"+
							"</li>";
					$("#threeDimension").append(html);
					setTimeout(function() {
						grainTempocx.horizontalShow();
					}, 100);					
					
				});
				
				//去掉最后一个的竖线
				$("#threeDimension").find("li:last").find("i").addClass("body-state-last");
				
				//梯度值
				$("#maxGradValue").text((Math.abs(dataList[dataList.length-1].maxTempValue - dataList[0].maxTempValue)/5.4).toFixed(2));
				$("#minGradValue").text((Math.abs(dataList[dataList.length-1].minTempValue - dataList[0].minTempValue)/5.4).toFixed(2));
				$("#avgGradValue").text((Math.abs(dataList[dataList.length-1].avgTempValue - dataList[0].avgTempValue)/5.4).toFixed(2));
			}
	    }		
   });
};

//纵向查看
function initColumnChart(){
	
	//梯度值
	$("#maxGradValue").text("");
	$("#minGradValue").text("");
	$("#avgGradValue").text("");
	
	$.ajax({
		type: 'get',
		url: 'temperature/threeDimensionShow/getColumnFloorTempValue',
		dataType: 'json',
	    data:{"groupId": $("#groupId").val(),"warehouseId":$("#warehouseId").val()},
		success: function(content){
			if(content==null){
				return
			}
			var dataList = content.dataList;
			if(dataList){
				$("#threeDimension").empty();
				$.each(dataList, function (i, item){
					var html=
						"<li>"+
						"<i id='"+item.column+"' onclick='switchOnOff(this)' class='body-state on'></i>"+
						"<div class='body-info'>"+
							"<p>第"+item.column+"列</p>"+
							"<p class='body-info-second'>"+
							"<span>最高</span>"+
							"<span>"+item.maxTempValue+"℃</span>"+
							"<span>平均</span>"+
							"<span>"+item.avgTempValue+"℃</span>"+
							"<span>最低</span>"+
							"<span>"+item.minTempValue+"℃</span>"+
							"</p>"+
							"</div>"+
							"</li>";
					$("#threeDimension").append(html);
					setTimeout(function() {
						grainTempocx.verticalShow();
					}, 100);					
				});
				
				//去掉最后一个的竖线
				$("#threeDimension").find("li:last").find("i").addClass("body-state-last");
				
				//梯度值
				$("#maxGradValue").text((Math.abs(dataList[dataList.length-1].maxTempValue - dataList[0].maxTempValue)/5.4).toFixed(2));
				$("#minGradValue").text((Math.abs(dataList[dataList.length-1].minTempValue - dataList[0].minTempValue)/5.4).toFixed(2));
				$("#avgGradValue").text((Math.abs(dataList[dataList.length-1].avgTempValue - dataList[0].avgTempValue)/5.4).toFixed(2));
			}
	    }		
   });
}
//获取梯度值(暂时没用)
function getGradValue(){
	
	$.ajax({
		type: 'get',
		url: 'temperature/threeDimensionShow/getGradValue',
		dataType: 'json',
	    data:{"groupId": $("#groupId").val(),"warehouseId":$("#warehouseId").val()},
		success: function(content){
			if(content==null){
				return
			}
			if(content){
				$("#threeDimension").empty();
				$.each(content, function (i, item){
					var html=
						"<div class='details-footer-info-common'>"+
							"<p>最高</p>"+
							"<p>23℃</p>"+
							"</div>"+
							"<div class='details-footer-info-common'>"+
							"<p>平均</p>"+
							"<p>23℃</p>"+
							"</div>"+
							"<div class='details-footer-info-common'>"+
							"<p>最低</p>"+
							"<p>23℃</p>"+
							"</div>"
					$("#gradShow").append(html);
				});
			}
	    }		
   });
};

/*搜索框库点change事件*/
function getWarehouseByMyGroupId(category,type){
	$("#searchform select[name=warehouseId]").empty();
	var groupId = $("#searchform select[name=groupId]").val();
	if(groupId){
		$.ajax({
			url : "common/getEquipWarehouseList?groupId="+groupId+"&category="+category+"&type="+type,
			type : 'GET',
			dataType : "json",
			async: false
		}).done(function(data) {
			if(data){
				$.each(data,function(index,item){
					$("#searchform select[name=warehouseId]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
}

function onGroupChange(groupId){
	var groupId = $("#groupId").val();
	var isshow = $("#isshow").val();
	if(isshow=="1"){
		window.location.href=getRootPath_dc()+"/temperature/threeDimensionShow?groupId="+groupId+"&isshow=1";
	}else{
		window.location.href=getRootPath_dc()+"/temperature/threeDimensionShow?groupId="+groupId;
	}
}

function onWarehouseChange() {
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	var isshow = $("#isshow").val();
	if(isshow=="1"){
		window.location.href=getRootPath_dc()+"/temperature/threeDimensionShow?groupId="+groupId+"&warehouseId="+warehouseId+"&isshow=1";
	}else{
		window.location.href=getRootPath_dc()+"/temperature/threeDimensionShow?groupId="+groupId+"&warehouseId="+warehouseId;
	}
}
