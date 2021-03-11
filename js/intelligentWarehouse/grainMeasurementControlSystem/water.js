var option1 = {
				color: ['#69cff5', '#e8c73e', '#ff68e1'],
				title: {
					text: '',
					x: 'center',
					top: '30'
				},
				legend: {
					data: ['玉米', '小麦', '稻谷'],
					y: 'top',
					top: '80'
				},
				grid: {
					top: "25%",
					bottom: "5%"
				},
				tooltip: {
					trigger: 'axis'
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					data: [/*'7/01', '7/02', '7/03', '7/04', '7/05', '7/06', '7/07', '7/08', '7/09', '7/10', '7/11', '7/12'*/],
					name: '时间'
				}],
				yAxis: [{
					type: 'value',
					name: '水分值'
				}],
				series: [{
					name: '水分值(%)',
					type: 'line',
					symbolSize: 10,
					data: [/*17, 18, 19, 18.6, 19, 20, 17, 18, 19, 20, 17.8, 18*/],
					markPoint: {
		                data: [
		                    {type: 'max', name: '最大值'},
		                    {type: 'min', name: '最小值'}
		                ]
		            }
				}]
			};

$(function() {
	  //初始化
	 initChart();
	//查询按钮事件
    $('#submit_search').click(function(){
    	initChart();
    })
    //hove();
});

function initChart(){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	var beginDate = $("#beginDate").val();
	var endDate = $("#endDate").val();
	var warehouseCode= $("#warehouseId option:selected").html();
	
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	if(beginDate==''||beginDate==undefined){
		alert("起始时间不能为空！","warning");
		return;
	}
	if(endDate==''||endDate==undefined){
		alert("结束时间不能为空！","warning");
		return;
	}
	$.ajax({
		type:'get',
		url:'water/main/getWaterValueByDate',
		dataType:'json',
		data:{'groupId':groupId,'warehouseId':warehouseId,'beginDate':beginDate,'endDate':endDate},
		success:function(content){
			if(content==null){
				return
			}
			var xData = content.xData;
			var seriesData = content.seriesData;
			var averageWaterValue = content.averageWaterValue;//当前水分
			if(xData){
				option1.xAxis[0].data=xData;
			}
			if(seriesData){
				option1.series[0].data=seriesData;
			}
			option1.title.text=warehouseCode+'号仓水分变化态势图';
			myChart1.setOption(option1);
			if(averageWaterValue){
				$("#current_water").html(averageWaterValue+"%");
			}else{
				$("#current_water").html("");
			}
		}
	});
	
}
function hove(){
	$(".collecting").hover(function(){
	    $("#collecting").css('display','block');
	    var groupId = $("#groupId").val();
	  //作业详情
		$.ajax({
			url : "water/main/getCollectStatus?groupId="+groupId,
			type : 'GET',
			async: false,
			dataType : "json"
		}).done(function(data) {
			if(data){
				var collect_status = data.collectStatus;
				var html = "<h3>采集检测</h3>";
				$.each(collect_status,function(index,item){
					html += '<div class="process-group"><span>'+collect_status[index]+'正在采集</span></div>';
				});
				$("#collect_info").append(html);
			}
		}).fail(function() {
			alert("请求失败！","warning");
		});
	},function(){
		//$("#collecting").css('display','none');
		$("#collect_info").html("");
	});
}			

$("#handCollect").bind('click',function(){
	$("#approver").modal("show");
	var groupId = $("#groupId").val();
	 getWarehouseList(groupId);
});
//获取未采集的仓间
function getWarehouseList(groupId){
	$.ajax({
		url : "water/main/waterCollectList",
		type : 'GET',
		async: false,
		dataType : "json",
		data:{'groupId':groupId}
	}).done(function(data) {
		if(data){
			var html = "";
			$.each(data,function(index,item){
				if(item.equipStatus=='1'){
					html +=  '<div><input type="checkbox" checked  disabled="disabled" id="'+item.warehouseCode+'" value="'+item.equipStatusId+'" />' + 
					'<label for="'+item.warehouseCode+'">' + item.warehouseCode + '</label></div>';
				}else if(item.equipStatus=='0'){
					html +=  '<div><input type="checkbox"  name="warehouse" id="'+item.warehouseCode+'" value="'+item.equipStatusId+'" />' + 
					'<label for="'+item.warehouseCode+'">' + item.warehouseCode + '</label></div>';
				}
			});
			$(".modal-body-input").html(html);
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
}
//采集按钮事件
$("#collectBtn").click(function() {
	var len = $("input:checkbox[name=warehouse]:checked").length; 
	if(len==0){
		alert("请选择仓间","warning");
		return;
	};
	var names = [];
	$('input:checkbox[name=warehouse]:checked').each(function(){
		names.push($(this).val());
	})
	var ids = names.join(",");
	$.ajax({
		url : "water/main/collectWater?equipStatusIds="+ids,
		type : 'POST'
	}).done(function(data) {
			if(data.status=='200'){
				if($(".collecting").html()==undefined||$(".collecting").html()==''){
					$(".collecting").css('display','block');
					var html = '<span class="collecting"> 正在采集... <img class="collecting-slider" src="images/collect-slider.png" /><div class="collecting-info" style="width: 200px" id="collect_info"><h3>采集检测</h3></div></span>';
					$("#handCollect").after(html);
					hove();
				};
				alert("请求成功，正在采集");
			}else if(data.status=='401'){
				alert("设备异常，请检查硬件设备及网络！","warning");
			}else{
				alert("请求失败！","warning");
			}
	}).fail(function() {
		alert("请求失败！","warning");
	});
})
