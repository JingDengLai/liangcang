$(function () {
	 	var now = new Date();
	   	var nowyear = now.getFullYear();   //年
		$("#yearInput").val(nowyear);
	//加载
	initChart();
	//查询按钮事件
    $('#submit_search').click(function(){
    	initChart();
    })
});

function initChart(){
	//默认显示
/*	oneChart.setOption(setFloorOption(0));
	
	data[0].valueData = 0;
	data[1].valueData = 0;
	data[2].valueData = 0;
	data[3].valueData = 0;
	data[4].valueData = 0;
	data[5].valueData = 0;
	
	$("#maxWaterValue").text("暂无");
	$("#minWaterValue").text("暂无");*/
	var groupId= $("#groupId").val();
	var warehouseId= $("#warehouseId").val();
	var year= $("#yearInput").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	if(year==''||year==undefined){
		alert("请选择年份！","warning");
		return;
	}
	var groupName = $("#groupId option:selected").html();
	var warehouseCode= $("#warehouseId option:selected").html();
	$.ajax({
		type: 'get',
		url: 'temperature/threeTempHumShow/getDataByDay',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId,"year":year},
		success: function(content){
			if(content==null){
				return
			}else{
				$("#h5title").html(groupName + warehouseCode +"号仓"+ year + "年三温三湿图");
				
				if(content.datelist){//x轴时间
					data.xAxisdata = content.datelist;
				}
				if(content.tempList){//外温
					data.seriesdata[0].data = content.tempList;
				}
				if(content.humidityList){//外湿
					data.seriesdata[1].data = content.humidityList;
				}
				if(content.warehouseTempList){//仓温
					data.seriesdata[2].data = content.warehouseTempList;
				}
				if(content.warehouseHumidityList){//仓湿
					data.seriesdata[3].data = content.warehouseHumidityList;
				}
				if(content.grainTempList){//粮温
					data.seriesdata[4].data = content.grainTempList;
				}
				if(content.grainWaterList){//水分
					data.seriesdata[5].data = content.grainWaterList;
				}
				
				myChart.setOption(dataOption_graininfo(data));
			}
	    }		
   });
};
function dataOption_graininfo(json) {
		        return {
		            color: ['#62c8f9', '#15be60', '#767676', '#e8e600', '#f56f6c', '#f7a02f'],
		            tooltip: {
		                trigger: 'axis'
		            },
		            legend: {
		                data: json.legenddata,
		                top: 10
		            },
		            smooth: true,
		            calculable: true,
		            xAxis: [
		                {
		                    type: 'category',
		                    boundaryGap: false,
		                    data: json.xAxisdata
		                }
		            ],
		            yAxis: [
		                {
		                    type: 'value',
		                    axisLabel: {
		                        formatter: '{value} °C'
		                    }
		                }, {
		                    type: 'value',
		                    axisLabel: {
		                        formatter: '{value} %'
		                    }
		                }
		            ],
		            series: json.seriesdata
		        };
		    };