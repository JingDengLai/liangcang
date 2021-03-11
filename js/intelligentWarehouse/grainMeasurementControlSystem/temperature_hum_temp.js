$(function () {
	//加载
	initChart();
	//查询按钮事件
    $('#submit_search').click(function(){
    	initChart();
    })
});

function initChart(){
	
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}

	//默认显示
	oneChart.setOption(setFloorOption(0));
	twoChart.setOption(setFloorOption(0));
	threeChart.setOption(setFloorOption(0));
	fourChart.setOption(setFloorOption(0));
	
	data[0].valueData = 0;
	data[1].valueData = 0;
	data[2].valueData = 0;
	data[3].valueData = 0;
	data[4].valueData = 0;
	data[5].valueData = 0;
	$("#maxWaterValue").text("");
	$("#minWaterValue").text("");
	
	$.ajax({
		type: 'get',
		url: 'temperature/temperatureHumidityShow/detail',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId},
		success: function(content){
			if(content==null){
				return
			}else{
				if(content.averageWaterValue){//水分
					data[0].valueData = content.averageWaterValue;
				}
				if(content.humValue){//仓湿
					data[1].valueData = content.humValue;
				}
				if(content.outHumValue){//外湿
					data[2].valueData = content.outHumValue;
				}
				if(content.averageTemp){//粮温
					data[3].valueData = content.averageTemp;
				}
				if(content.tempValue){//仓温
					data[4].valueData = content.tempValue;
				}
				if(content.outTempValue){//外温
					data[5].valueData = content.outTempValue;
				}
				//右侧的上下部分图表
				waterChart.setOption(setOptionChartHumi(data[0]));
				sevenChart.setOption(setOptionChartHumi(data[1]));
				eightChart.setOption(setOptionChartHumi(data[2]));
				//左侧的温度上下图表
				leseChart.setOption(setOptionChartTemp(data[3]));
				//左下图表
				fiveChart.setOption(setOptionChartTemp(data[4]));
				sixChart.setOption(setOptionChartTemp(data[5]));
				
				//一二三四层图表
				if(content.oneFloortempValue){//一
					oneChart.setOption(setFloorOption(content.oneFloortempValue));
				}
				if(content.twoFloortempValue){//二
					twoChart.setOption(setFloorOption(content.twoFloortempValue));
				}
				if(content.threeFloortempValue){//三
					threeChart.setOption(setFloorOption(content.threeFloortempValue));
				}
				if(content.fourFloortempValue){//四
					fourChart.setOption(setFloorOption(content.fourFloortempValue));
				}
				
				//最高最低水分
				if(content.maxWaterValue){//最高
					$("#maxWaterValue").text(content.maxWaterValue+"%");
				}
				if(content.minWaterValue){//最低
					$("#minWaterValue").text(content.minWaterValue+"%");
				}
			}
	    }		
   });
};

//温度的(℃)
function setOptionChartTemp (data) {
	return {
		title:{
			text: data.titleData,
			x: "center",
			y: "35%",
			textStyle: {
				fontSize: 20
			}
		},
		tooltip : { 
	    	formatter: "{a}: {c}℃"
   		},
	    series: [
	        {
	            name: data.seriesData,
	            type: 'gauge',
	            axisLine: {
	                show: false,
	                lineStyle: {
	                    color: [
	                        [0.2, '#1ed19d'],
	                        [0.8, '#0081e5'],
	                        [1, '#ff5e43']
	
	                    ],
	                    width: data.widthData
	                }
	            },
	            splitNumber: 5,
	            splitLine: {
	                length: 10,
	            },
	            radius: '90%',
	            center:['50%', '60%'],
	            axisLabel: {
	                show: 'false',
	                distance: data.widthData - 10,
	            },
	            pointer: {
	            	width: data.pointerData
	            },
	            detail: {
	                show:true,
	                formatter: '{value}℃',
	                textStyle: {
	                    color: '#00b898',
	                    fontSize: 24,
	                },
	                offsetCenter: [0, '60%'],
	                detail: {formatter:'{value}℃'}
	            },
	            data: [{
	            	"value":data.valueData
	            }]
	        }
	    ]
	}
}
//湿度的(%)
function setOptionChartHumi (data) {
	return {
		title:{
			text: data.titleData,
			x: "center",
			y: "35%",
			textStyle: {
				fontSize: 20
			}
		},
		tooltip : { 
	    	formatter: "{a}: {c}%"
   		},
	    series: [
	        {
	            name: data.seriesData,
	            type: 'gauge',
	            axisLine: {
	                show: false,
	                lineStyle: {
	                    color: [
	                        [0.2, '#1ed19d'],
	                        [0.8, '#0081e5'],
	                        [1, '#ff5e43']
	
	                    ],
	                    width: data.widthData
	                }
	            },
	            splitNumber: 5,
	            splitLine: {
	                length: 10,
	            },
	            radius: '90%',
	            center:['50%', '60%'],
	            axisLabel: {
	                show: 'false',
	                distance: data.widthData - 10,
	            },
	            pointer: {
	            	width: data.pointerData
	            },
	            detail: {
	                show:true,
	                formatter: '{value}%',
	                textStyle: {
	                    color: '#00b898',
	                    fontSize: 24,
	                },
	                offsetCenter: [0, '60%'],
	                detail: {formatter:'{value}%'}
	            },
	            data: [{
	            	"value":data.valueData
	            }]
	        }
	    ]
	}
}
//一二三四层option
function setFloorOption(json){
	return{
		tooltip : {
	        formatter: "{a}: {c}℃"
	    },
	    series: [
	        {
	            name: '粮温',
	            type: 'gauge',
	            axisLine: {
	                show: false,
	                lineStyle: {
	                    color: [
	                        [0.2, '#1ed19d'],
	                        [0.8, '#0081e5'],
	                        [1, '#ff5e43']
	
	                    ],
	                    width: 12
	                }
	            },
	            splitNumber: 5,
	            splitLine: {
	                length: 5,
	            },
	            radius: '90%',
	            center:['50%', '60%'],
	            axisLabel: {
	                show: 'false',
	                textStyle: {
	                    fontSize: 8
	                }
	            },
	            pointer: {
	            	width: 2
	            },
	            detail: {
	                show:true,
	                formatter: '{value}℃',
	                textStyle: {
	                    color: '#00b898',
	                    fontSize: 18,
	                },
	                offsetCenter: [0, '60%'],
	                detail: {formatter:'{value}℃'}
	            },
	            data: [{
	            	"value":json
	            }]
	        }
	    ]
	};
}