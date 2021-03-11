$(function() {
	  //初始化
	 initChart();
	//左边切换的点击事件
	$(".en-switch p").click(function(){
         $(".en-switch p").removeClass("active");
         $(this).addClass("active");
         $(".loop-chart").hide().eq($(this).index()).show();
         switch ($(this).index()){
         	case 0:
         		myChart1 = echarts.init(document.getElementById('chart1'));
        		myChart1.setOption(option1);
         		break;
     		case 1:
     			myChart2 = echarts.init(document.getElementById('chart2'));
        		myChart2.setOption(option2);
     			break;
     		case 2:
     			myChart3 = echarts.init(document.getElementById('chart3'));
        		myChart3.setOption(option3);
     			break;
     		case 3:
     			myChart4 = echarts.init(document.getElementById('chart4'));
        		myChart4.setOption(option4);
     			break;
         	default:
         		break;
         }
     });
});
//下拉框改变事件
function groupChange(){
	initChart();
}
function initChart(){
	var groupId = $("#groupId").val();

	$.ajax({
		type:'get',
		url:'weather/main/getWeatherData',
		dataType:'json',
		data:{'groupId':groupId},
		success:function(content){
			if(content==null){
				return
			}
			var xData = content.xData;
			var seriesData = content.seriesData;
			var humiData = content.humiData;
			var speedData = content.speedData;
			var rainData = content.rainData;
			var record = content.record;//当前最新天气记录
			if(xData){
				option1.xAxis[0].data=xData;
				option2.xAxis[0].data=xData;
				option3.xAxis[0].data=xData;
				option4.xAxis[0].data=xData;
			}
			if(seriesData){
				option1.series[0].data=seriesData;
			}
			if(humiData){
				option2.series[0].data=humiData;
			}
			if(speedData){
				option4.series[0].data=speedData;
			}
			if(rainData){
				option3.series[0].data=rainData;
			}
			myChart1.setOption(option1);
			
			//当前日期
			
			$("#weather_temp").html("");
			$("#weather_humi").html("");
			$("#weather_rain").html("");
			$("#weather_wind").html("");
			if(record){
				//当前日期
				/*$("#weather_time").html(initTime()+"&nbsp;&nbsp;(实时温度 : "+record.temperatureValue+"℃)");*/
				$("#weather_temp").html(record.temperatureValue+"℃");
				$("#weather_humi").html(record.humidityValue+"%");
				$("#weather_rain").html(record.rainfall+"<span class='en-unit'>mm/min</span>");
				$("#weather_wind").html(record.windSpeed+"m/s");
				/*$("#weather_press").html(record.pressure+"kpa");*/
				
			}
		}
	});
	
}
$("#handCollect").bind('click',function(){
	var groupId = $("#groupId").val();
	$.ajax({
		url : "weather/main/collectWeather?groupId="+groupId,
		type : 'get'
	}).done(function(data) {
			if(data.status=='200'){
				alert("请求成功，正在采集");
			}else if(data.status == '401'){
				alert("设备异常，请检查硬件设备及网络！","warning");
			}else if(data.status=='-1'){
				alert(data.msg,"warning");
			}else{
				if(data.msg){
					alert(data.msg,"warning");
				}else{
					alert("请求失败！","warning");
				}
			}
	}).fail(function() {
		alert("请求失败！");
	});
});
var option1 = {
   	color: ['#fff'],
   	grid: {
    	top: "10%",
    	bottom: "15%",
    	left:'5%',
    	right:'7%',
    },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [/*'0点','4点', '8点', '12点', '16点', '20点'*/],
                name:'时间（h）',
                axisLine:{
                	lineStyle:{
                		color:"rgba(0, 0, 0, 0.3)"
                	}
                },
                axisLabel:{
                	textStyle:{
                		color:"#333"
                	}
                },
                nameTextStyle:{
                	color:"#333"
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'温度（℃）',
                splitLine:{
                	lineStyle:{
                		color:"rgba(0, 0, 0, 0.3)"
                	}
                },
                axisLine:{
                	lineStyle:{
                		color:"rgba(0, 0, 0, 0.3)"
                	}
                },
                axisLabel:{
                	textStyle:{
                		color:"#333"
                	}
                },
                nameTextStyle:{
                	color:"#333"
                }
            }
        ],
        series: [
            {
                name: '温度',
                type: 'line',
                symbolSize: 10,
                symbol: 'circle',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top'
                        }
                    }
                },
                data: [/*17,18,19,18.6,19,20*/]
            }
        ]
    };

var option2 = {
	   	color: ['#fff'],
	   	grid: {
	    	top: "10%",
	    	bottom: "15%",
	    	left:'5%',
	    	right:'7%',
	    },
	        tooltip: {
	            trigger: 'axis'
	        },
	        xAxis: [
	            {
	                type: 'category',
	                boundaryGap: false,
	                data: [/*'0点','4点', '8点', '12点', '16点', '20点'*/],
	                name:'时间（h）',
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        yAxis: [
	            {
	                type: 'value',
	                name:'湿度（%）',
	                splitLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        series: [
	            {
	                name: '湿度',
	                type: 'line',
	                symbolSize: 10,
	                symbol: 'circle',
	                itemStyle: {
	                    normal: {
	                        label: {
	                            show: true,
	                            position: 'top'
	                        }
	                    }
	                },
	                data: [/*17,18,19,18.6,19,20*/]
	            }
	        ]
	    };
var option3 = {
	   	color: ['#fff'],
	   	grid: {
	    	top: "10%",
	    	bottom: "15%",
	    	left:'5%',
	    	right:'7%',
	    },
	        tooltip: {
	            trigger: 'axis'
	        },
	        xAxis: [
	            {
	                type: 'category',
	                boundaryGap: false,
	                data: [/*'0点','4点', '8点', '12点', '16点', '20点'*/],
	                name:'时间（h）',
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        yAxis: [
	            {
	                type: 'value',
	                name:'降水(mm/min)',
	                splitLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        series: [
	            {
	                name: '降水',
	                type: 'line',
	                symbolSize: 10,
	                symbol: 'circle',
	                itemStyle: {
	                    normal: {
	                        label: {
	                            show: true,
	                            position: 'top'
	                        }
	                    }
	                },
	                data: [/*17,18,19,18.6,19,20*/]
	            }
	        ]
	    };
var option4 = {
	   	color: ['#fff'],
	   	grid: {
	    	top: "10%",
	    	bottom: "15%",
	    	left:'5%',
	    	right:'7%',
	    },
	        tooltip: {
	            trigger: 'axis'
	        },
	        xAxis: [
	            {
	                type: 'category',
	                boundaryGap: false,
	                data: [/*'0点','4点', '8点', '12点', '16点', '20点'*/],
	                name:'时间（h）',
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        yAxis: [
	            {
	                type: 'value',
	                name:'风速（m/s）',
	                splitLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLine:{
	                	lineStyle:{
	                		color:"rgba(0, 0, 0, 0.3)"
	                	}
	                },
	                axisLabel:{
	                	textStyle:{
	                		color:"#333"
	                	}
	                },
	                nameTextStyle:{
	                	color:"#333"
	                }
	            }
	        ],
	        series: [
	            {
	                name: '风速',
	                type: 'line',
	                symbolSize: 10,
	                symbol: 'circle',
	                itemStyle: {
	                    normal: {
	                        label: {
	                            show: true,
	                            position: 'top'
	                        }
	                    }
	                },
	                data: [/*17,18,19,18.6,19,20*/]
	            }
	        ]
	    };
//当前时间函数
function initTime(){

		var nowWeek;
		var nowDate;
		var nowTime;

		var now = new Date();

		var year = now.getFullYear(); // 年
		var month = now.getMonth() + 1; // 月
		var day = now.getDate(); // 日
		var week = now.getDay();

		var hh = now.getHours(); // 时
		var mm = now.getMinutes(); // 分
		var ss = now.getSeconds(); // 秒

		nowDate = year + "年";

		if (month < 10)
			nowDate += "0";

		nowDate += month + "月";

		if (day < 10)
			nowDate += "0";

		nowDate += day + "日";

		var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
		nowWeek = " 星期" + Week[week] + " ";

		var currentTime = nowDate + " " + nowWeek;
		return currentTime;
}
