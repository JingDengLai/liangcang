$(function() {
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	var year = $("#year").val();
	 getCharts(groupId,warehouseId,year);
	 //hove();
});


function createChart1 (warehouseCode,pestValue) {
	//粮食品类统计
	var myChart = echarts.init(document.getElementById('chart2'));
	window.addEventListener("resize", function () {
	    myChart.resize();
	});
var option = {
		title:{
			text: warehouseCode+"仓粮食虫害监测",
			 x: 'center'
		}, 
	    tooltip : {
	        trigger: 'axis'
	    },
	    
	    calculable : true,
	    xAxis : [
	        {
	           type : 'category',
	           data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			   name: '时间'
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
				name: '粮虫数量/个'
	        }
	    ],
		 color: ['#60CAF2'],
		        tooltip: {
		            trigger: 'item',
		        },
	    series : [
	        {
	            name:'粮虫数量',
	            type:'bar',
	            data:pestValue
	        }
	    ]
};
myChart.setOption(option);
}


function unique(array){
    var n = [];//临时数组
    for(var i = 0;i < array.length; i++){
        if(n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
}

$("#searchGas").bind("click",function(){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	var year = $("#year").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！");
		return;
	}
	if(year==''||year==undefined){
		alert("时间不能为空！");
		return;
	}
	getCharts(groupId,warehouseId,year);
}); 

function getCharts(groupId,warehouseId,year){
	//查询图表
	$.ajax({
		url : "pest/main/echarts",
		type : 'GET',
		async: false,
		dataType : "json",
		data:{'groupId':groupId,'warehouseId':warehouseId,'year':year}
	}).done(function(data) {
		if(data){
			var echarts = data.echarts;
			var warehouseCode = data.warehouseCode;
			var pestMap = {};
			$.each(echarts,function(index,item){
				pestMap[item.month]=item.pestCount;
			});
			var map = [];
			for(var i=1;i<13;i++){
				var cc = pestMap[i];
				if(cc==undefined){
					map.push(0);
				}else{
					map.push(cc);
				}
			}
			createChart1 (warehouseCode,map);
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
}

function getWarehouseList(groupId){
	$.ajax({
		url : "pest/main/getWarehouseByHasPestEquip",
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

$("#collectBtn").click(function() {
	var len = $("input:checkbox[name=warehouse]:checked").length; 
	if(len==0){
		alert("请选择仓间");
		return;
	};
	var names = [];
	$('input:checkbox[name=warehouse]:checked').each(function(){
		names.push($(this).val());
	})
	
	var ids = names.join(",");
	$.ajax({
		url : "pest/main/collectPest?equipStatusIds="+ids,
		type : 'POST'
		//data:{'equipStatusIds':names.join(",")}
	}).done(function(data) {
		if(data){
			if(data.status=='200'){
				if($(".collecting").html()==undefined||$(".collecting").html()==''){
					$(".collecting").css('display','block');
					var html = '<span class="collecting"> 正在采集... <img class="collecting-slider" src="images/collect-slider.png" /><div class="collecting-info" style="width: 200px" id="collect_info"><h3>采集检测</h3></div></span>';
					$("#collectData").after(html);
					hove();
				};
				$("#approver").modal("hide");
				alert("请求成功，正在采集");
			}
			else if(data.status=='401'){
				alert("设备异常，请检查硬件设备及网络！");
			}else{
				alert("请求失败！","warning");
			}
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
})

$("#collectData").click(function() {
	$('#approver').modal('show');
	var groupId = $("#groupId").val();
	getWarehouseList(groupId);
	
	getAlertPestCang(groupId);
})

//查询气体正在采集的仓间
function getAlertPestCang(groupId){
	$.ajax({
		url : "pest/main/getAlertPestCang",
		type : 'GET',
		async: false,
		dataType : "json",
		data:{'groupId':groupId}
	}).done(function(data) {
		if(data && data.length>0){
			var msg = "";
			$.each(data,function(index,item){
				if(index==data.length-1){
					msg +=item.warehouseCode
				}else{
					msg +=item.warehouseCode+','
				}
			});
			msg +="号仓正在采集气体，气体和虫害不能同时采集！"
			alert(msg,"","", 4000);
			/*confirm(msg,function(){
				alert("11111");
			});*/
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
}

function hove(){
	$(".collecting").hover(function(){
		var groupId = $("#groupId").val();
		  //作业详情
			$.ajax({
				url : "pest/main/pestCollectStatus",
				type : 'GET',
				async: false,
				dataType : "json",
				data:{"groupId":groupId+""}
			}).done(function(data) {
				if(data){
					var collect_status = data.pestCollectStatus;
					var html = "";
					$.each(collect_status,function(index,item){
						html += '<div class="process-group"><span>'+collect_status[index]+'正在采集</span></div>';
					});
					$("#collect_info").html(html);
				}
			}).fail(function() {
				alert("请求失败！","warning");
			});
		},function(){
			$("#collect_info").html("");
		});
}