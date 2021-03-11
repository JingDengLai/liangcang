$(function() {
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	var beginDate = $("#beginDate").val();
	var endDate = $("#endDate").val();
	 
	 getCharts(groupId,warehouseId,beginDate,endDate);
	// hove();
	 
	 $("#checkAll").click(function(){
			if($(this).prop("checked")){
				$(".modal-body-input input[name='warehouse']").prop("checked","checked");
			}else{
				$(".modal-body-input input[name='warehouse']").prop("checked", "");
			}
		})
});


function createChart1 (warehouseCode,day,ph3,o2,co2) {
	//粮食品类统计
	var myChart = echarts.init(document.getElementById('chart4'));
	window.addEventListener("resize", function () {
	    myChart.resize();
	});
var option = {
    color: ['#69cff5','#e8c73e', '#ff68e1'],
    title: {
        text: warehouseCode+'仓气体含量变化态势图',
        x: 'center',
    },
    legend:{
    	data: ['PH3（ppm）', 'O2（%）', 'CO2（ppm）'],
    	top: 50
    },
    grid: {
    	top: "25%",
    	bottom: "5%"
    },
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            data: day,
            name:'时间'
        }
    ],
    yAxis: [
        {
            type: 'value',
            name:'PH3/O2/CO2'
        }
    ],
    series: [
        {
            name: 'PH3（ppm）',
            type: 'line',
            symbolSize: 10,
            
            data: ph3,
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            }
        },
		{
            name: 'O2（%）',
            type: 'line',
            symbolSize: 10,
             
            data: o2,
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            }
        },
		{
            name: 'CO2（ppm）',
            type: 'line',
            symbolSize: 10,
             
            data: co2,
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            }
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
	var beginDate = $("#beginDate").val();
	var endDate = $("#endDate").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！");
		return;
	}
	if(beginDate==''||beginDate==undefined){
		alert("起始时间不能为空！");
		return;
	}
	if(endDate==''||endDate==undefined){
		alert("结束时间不能为空！");
		return;
	}
	getCharts(groupId,warehouseId,beginDate,endDate);
}); 

function getCharts(groupId,warehouseId,beginDate,endDate){
	//查询图表
	$.ajax({
		url : "gas/main/echarts",
		type : 'GET',
		async: false,
		dataType : "json",
		data:{'groupId':groupId,'warehouseId':warehouseId,'beginDate':beginDate,'endDate':endDate}
	}).done(function(data) {
		if(data){
			$("#current_co2").html(data.co2);
			$("#current_o2").html(data.o2);
			$("#current_ph3").html(data.ph3);
			var echarts = data.echarts;
			console.log(echarts);
			var warehouseCode = data.warehouseCode;
			var day = [];
			var ph3 = [];
			var o2 = [];
			var co2 = [];
			$.each(echarts,function(index,item){
				day.push(index);
				for(var i in item){
					 if(i=='1'){
						ph3.push(item[i]);
					 }
					 if(i=='2'){
						o2.push(item[i]);
					 }
					if(i=='3'){
						co2.push(item[i]);
					}
				}
			});
			createChart1 (warehouseCode,day,ph3,o2,co2);
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
}
$("#handCollect").bind("click",function(){
	$("#approver").modal("show");
	var groupId = $("#groupId").val();
	 getWarehouseList(groupId);
	 
	 getAlertPestCang(groupId);
}); 
//查询虫害正在采集的仓间
function getAlertPestCang(groupId){
	$.ajax({
		url : "gas/main/getAlertPestCang",
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
			msg +="号仓正在采集虫害，虫害和气体不能同时采集！"
			alert(msg,"","", 4000);
			/*confirm(msg,function(){
				alert("11111");
			});*/
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
}
function getWarehouseList(groupId){
	$.ajax({
		url : "gas/main/getWarehouseByHasGasEquip",
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
	});
	
	var ids = names.join(",");
	$.ajax({
		url : "gas/main/collectGas?equipStatusIds="+ids,
		type : 'POST'
		//data:{'equipStatusIds':names.join(",")}
	}).done(function(data) {
		if(data){
			if(data.status=='200'){
				if($(".collecting").html()==undefined||$(".collecting").html()==''){
					$(".collecting").css('display','block');
					var html = '<span class="collecting"> 正在采集... <img class="collecting-slider" src="images/collect-slider.png" /><div class="collecting-info" style="width: 200px" id="collect_info"><h3>采集检测</h3></div></span>';
					$("#handCollect").after(html);
					hove();
				};
				$("#approver").modal("hide");
				alert("请求成功，正在采集");
			}
			else if(data.status=='401'){
				alert("设备异常，请检查硬件设备及网络！");
			}
			else{
				alert("请求失败！","warning");
			}
		}
	}).fail(function() {
		alert("请求失败！","warning");
	});
})

function hove(){
	$(".collecting").hover(function(){
		var groupId = $("#groupId").val();
		  //作业详情
			$.ajax({
				url : "gas/main/gasCollectStatus",
				type : 'GET',
				async: false,
				dataType : "json",
				data:{"groupId":groupId+""}
			}).done(function(data) {
				if(data){
					var collect_status = data.gasCollectStatus;
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