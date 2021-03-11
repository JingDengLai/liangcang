
//本月
var option = {
	title: {
		text:"",
		x:"center",
		top: 30
	},
    tooltip: {
        trigger: 'axis'
    },
    grid: {
    	top: "20%"
    },
    xAxis: [
        {
            type: 'category',
            name: '时间',
            boundaryGap: false,
            data: [/*'9/11', '9/17', '9/25', '10/1'*/]
        }
    ],
    yAxis: [
        {
            name: '温度(℃)',
            type: 'value'
        }
    ],
    series: [
        {
            name: '本月粮食温度',
            type: 'line',
            tooltip: {
                trigger: 'axis'
            },
            smooth: true,
            itemStyle: {
                normal: {
//	                        lineStyle: {
//	                            color: '#ff5553'
//	                        },
                    areaStyle: {
                    	color: new echarts.graphic.LinearGradient(
					            0, 0, 0, 1,
					            [
					                {offset: 0, color: 'rgb(251, 226, 182)'},
					                {offset: 1, color: '#e72d59'}
					            ]
					    )
                    }
                }
            },
            data: [/*12.5, 12, 21, 17.5*/]
        }
    ]
};
//下月预测
var option1 = {
		title: {
			text:"",
			x:"center",
			top: 30
		},
		 color: ['#2873d9'],
	    tooltip: {
            trigger: 'axis'
        },
        grid: {
        	top: "20%"
        },
        xAxis: [
            {
                type: 'category',
                name: '时间',
                boundaryGap: false,
               data: [/*'10/8', '10/15', '10/21', '10/27'*/]
            }
        ],
        yAxis: [
            {
                name: '温度(℃)',
                type: 'value'
            }
        ],
        series: [
            {
                name: '预测粮食温度',
                type: 'line',
                tooltip: {
                    trigger: 'axis'
                },
                smooth: true,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#17b4db'
                        },
                        areaStyle: {
                        	color: new echarts.graphic.LinearGradient(
						            0, 0, 0, 1,
						            [
						                {offset: 0, color: 'rgb(229, 156, 245)'},
						                {offset: 1, color: '#5632ef'}
						            ]
						    )
                        }
                    }
                },
                data: [/*12, 14, 16.8, 17.5*/]
            }
        ]
	};
var nowyear;
var nowMonth;
var nowYearMonth;
var nextYearMonth;
var nextYear;
var nextMonth;
$(function () {
	 	var now = new Date();
	   	nowyear = now.getFullYear();   //年
	   	nowMonth = now.getMonth()+1;
	   	
	   	nextYear = nowyear;
	   	nextMonth = nowMonth+1;
	   	nextMonth = (nextMonth<10?"0"+nextMonth : nextMonth);
	   	
	   	nowMonth = (nowMonth<10?"0"+nowMonth : nowMonth);
	   	if(nowMonth==12){
	   		nextMonth = "01";
	   		nextYear = nowyear+1;
	   	}
	   	nowYearMonth = (nowyear+"-"+nowMonth);//今年本月
	   	nextYearMonth = ((nowyear-1)+"-"+nextMonth);//去年本月的下一个月
	//加载
	initChart(nowYearMonth,nextYearMonth);
	//查询按钮事件
    $('#submit_search').click(function(){
    	initChart(nowYearMonth,nextYearMonth);
    })
	
});


function initChart(nowYearMonth,nextYearMonth){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	
	$.ajax({
		type: 'get',
		url: 'temperature/tempPredictionShow/getTendencyByDate',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId,"nowYearMonth":nowYearMonth,"nextYearMonth":nextYearMonth},
		success: function(content){
			if(content==null){
				return
			}
			var xList = content.xList;
			var dataList = content.dataList;
			var xNextList = content.xNextList;
			var dataNextList = content.dataNextList;
			if(dataList){
				option.series[0].data=dataList;
			}
			if(xList){
				option.xAxis[0].data=xList;
			}
			option.title.text=nowyear+"年"+nowMonth+"月粮食温度趋势图";
			myChart.setOption(option);
			if(dataNextList){
				option1.series.data=dataNextList;
			}
			if(xNextList){
				option1.xAxis.data=xNextList;
			}
			option1.title.text=nextYear+"年"+nextMonth+"月粮食温度预测趋势图";
			myChart1.setOption(option1);
	    }		
   });
}
