$(function() {
	var groupId = $("select[name='groupId']").val();
	var warehouseId = $("select[name='wearehouseId']").val();
	initLatestResult(groupId,warehouseId);
	
});

//库区change事件
function changeGroup(obj){
	$(".energy-content").html("");
	var groupId = $(obj).val();
	$("select[name=wearehouseId]").empty();
	if(groupId){
		$.ajax({
			url : "energy/main/warehouseList?groupId="+groupId,
			type : 'GET',
			dataType : "json"
		}).done(function(data) {
			if(data){
				$.each(data,function(index,item){
					$("select[name=wearehouseId]").append("<option value='"+item.warehouseId+"'>"+item.code+"</option>");
				});
				//切换库区的时候，初始化第一个仓的数据
				if(data[0]){
					initLatestResult(groupId,data[0].warehouseId);
				}
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}
}

//仓间号change事件
function changeWarehouse(obj){
	$(".energy-content").html("");
	var groupId = $("select[name='groupId']").val();
	var warehouseId = $(obj).val();
	initLatestResult(groupId,warehouseId);
}

//初始化数据
function initLatestResult(groupId,warehouseId){
	$.ajax({
		url : "energy/main/latestResults",
		type : 'GET',
		dataType : "json",
		data : {groupId:groupId,warehouseId:warehouseId}
	}).done(function(data) {
		var res = data.result;
		if(res){
			var divHtml = "";
			$.each(res,function(index,item){
				divHtml += "<div class='energy-box'>" +
								"<div class='energy-top'>" +
									"<img src='images/energy/energy-bg.png' />" +
									"<div class='energy-top-border'>" +
										"<p class='energy-title'>"+item.name+"</p>" +
										"<div class='energy-data'>" +
											"<p class='energy-data-title'>电流</p>"+
											"<p>"+
												"<span class='energy-data-num orange'>"+item.current+"</span>" +
												"<span class='energy-data-unit orange'>A</span>" +
											"</p>" +
										"</div>" +
										"<div class='energy-data'>" +
											"<p class='energy-data-title'>电压</p>" +
											"<p>" +
												"<span class='energy-data-num blue'>"+item.voltage+"</span>" +
												"<span class='energy-data-unit blue'>V</span>" +
											"</p>" +
										"</div>" +
										"<div class='energy-data'>" +
											"<p class='energy-data-title'>功率</p>" +
											"<p>" +
												"<span class='energy-data-num red'>"+item.power+"</span>" +
												"<span class='energy-data-unit red'>KW</span>" +
											"</p>" +
										"</div>" +
										"<div class='energy-data'>" +
											"<p class='energy-data-title'>电量</p>" +
											"<p>" +
												"<span class='energy-data-num green'>"+item.electriCity+"</span>" +
												"<span class='energy-data-unit green'>kW·h</span>" +
											"</p>" +
										"</div>" +
									"</div>" +
								"</div>" +
								"<div class='energy-time'>" +
									"<div class='middle-align'>" +
										"<span>"+item.monitorTime+"</span>" +
									"</div>" +
								"</div>" +
							"</div>";
			});
			$(".energy-content").html(divHtml);
		}
	}).fail(function() {
		console.log("请求失败！");
	});
}

//采集
function getherEnergy(){
	var groupId = $("select[name='groupId']").val();
	var warehouseId = $("select[name='wearehouseId']").val();
	if(warehouseId){
		$(".collecting").show();
		$.ajax({
			url : "energy/main/gatherEnergy",
			type : 'GET',
			dataType : "json",
			data : {groupId:groupId,warehouseId:warehouseId}
		}).done(function(data) {
			console.log(data);
			if(data){
				if(data.status1 == 401 && data.status2 == 401 && data.status3 == 401 && data.status4 == 401){
					alert("设备异常，请检查硬件设备及网络！","warning");
					return;
				}
				/*if(data.status1 == 401){
					alert("北山墙动力电表，设备异常，请检查硬件设备及网络！","warning");
				}else if(data.status2 == 401){
					alert("南山墙动力电表，设备异常，请检查硬件设备及网络！","warning");
				}else if(data.status3 == 401){
					alert("风机电表，设备异常，请检查硬件设备及网络！","warning");
				}else if(data.status4 == 401){
					alert("照明电表，设备异常，请检查硬件设备及网络！","warning");
				}*/
				//采集成功，刷新数据
				setTimeout(refreshData,1000,groupId,warehouseId);
			}
		}).fail(function() {
			console.log("请求失败！");
		});
	}else{
		alert("没有可操作的仓间！","warning");
	}
	
}
function refreshData(groupId,warehouseId){
	initLatestResult(groupId,warehouseId);
	$(".collecting").hide();
}
