//后端配置的仓间温度差值,默认为8摄氏度
var temperature_diffferential_optioned = 8;
var dataTime = [];
var nums = 10; //每页出现的数量
//下拉框改变事件
function groupChange(){
	initChart();
}
function warehouseChange(){
	initChart();
}
function timeChange(){
	initChart();
}

$(function () {
	 	var now = new Date();
	   	var nowyear = now.getFullYear();   //年
	   	var nowMonth = now.getMonth()+1;
	   	nowMonth = (nowMonth<10?"0"+nowMonth : nowMonth);
	   	var myDate = (nowyear.toString()+"-"+nowMonth.toString());
		$("#dateInput").val(myDate);
	//加载
	initChart();
	//查询按钮事件
    $('#submit_search').click(function(){
    	initChart();
    })
	
});	

//导出
function exportExcel(){
	var groupId= $("#groupId").val();
	var warehouseId= $("#warehouseId").val();
	var collectTime = $(".time-stage-info.active").find("span").html();
	if(collectTime==null ||collectTime==undefined){
		return
	}
	window.location.href = getRootPath_dc()+"/temperature/tempRecordShow/exportExcel?groupId="  + groupId + "&warehouseId=" + warehouseId  + "&collectTime=" + collectTime;
}

function initChart(){
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	var collectDate= $("#dateInput").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	if(collectDate==''||collectDate==undefined){
		alert("请选择时间！","warning");
		return;
	}
	var warehouseCode= $("#warehouseId option:selected").html();
	
	$.ajax({
		type: 'get',
		url: 'temperature/tempRecordShow/getCollectDateList',
		dataType: 'json',
	    data:{"groupId": groupId,"warehouseId":warehouseId,"collectDate":collectDate},
		success: function(content){
			if(content==null){
				return
			}
			if(content.dateList){//采集时间列表
				dataTime = content.dateList;
			}
			$("#h5title").html(warehouseCode +"号仓"+ (dataTime[0]==null?collectDate+"暂无":dataTime[0]) + "粮温明细");
			
			var pages = Math.ceil(dataTime.length/nums); //得到总页数
			var thisDate = function(curr){
			    //返回已经当前页已经分组好的数据
			    var str = '', last = curr*nums - 1;
			    last = last >= dataTime.length ? (dataTime.length-1) : last;
			    for(var i = (curr*nums - nums); i <= last; i++){
			        str += '<li><i class="time-stage"></i><div class="time-stage-info"><span class ="begin-time" onclick="onTimeChange(this)">' + dataTime[i]+'</span></div></li>';
			    }
			    return str;
			};
			//调用分页
			laypage({
			    cont: 'biuuu_city',
			    pages: pages,
			    jump: function(obj){
			        document.getElementById('biuuu_city_list').innerHTML = thisDate(obj.curr);
			        $(".time-stage-info").click(function() {
			        	$(".time-stage-info").removeClass("active");
			        	$(this).addClass("active");
			        })
			    }
			})
			$(".time-stage-info").eq(0).addClass("active");
			
			//画表格
			$("#grainTempList").html("");//清空表格
			if(content.detailList){
				setTable(content);
			}
	    }		
   });
}


//改变时间获取粮温记录
function onTimeChange(obj) {
	var groupId = $("#groupId").val();
	var warehouseId = $("#warehouseId").val();
	if(warehouseId==''||warehouseId==undefined){
		alert("请选择仓间号！","warning");
		return;
	}
	var collectTime= obj.innerHTML;
	var warehouseCode= $("#warehouseId option:selected").html();
		$.ajax({
			type: 'get',
			url: 'temperature/tempRecordShow/getTempValueByDetailTime',
			dataType: 'json',
		    data:{"groupId": groupId,"warehouseId":warehouseId,"collectTime":collectTime},
			success: function(content){
				if(content==null){
					return
				}
				$("#h5title").html(warehouseCode +"号仓"+ (collectTime==null?"暂无":collectTime) + "粮温明细");
				//画表格
				$("#grainTempList").html("");//清空表格
				if(content.detailList){
					setTable(content);
				}
		    }		
	   });
}


function setTable(content){
	$("#grainTempList").html("");//清空表格
	var layercount = content.layercount;
	var rowcount = content.rowcount;
	var columnCount = content.columnCount;
	var warehouseType = content.warehouseType;//仓房类型
	var index = 0;
	
	if(warehouseType==1){//平方仓
		if(content.detailList){
			var datalist = content.detailList;
			var html = "<tr><td></td><td></td>"
			for(var i=columnCount;i>0;i--){
				html +="<td>"+i+"区</td>"
			}
			if(columnCount==8){//如果是八区，那么每行后面补一个空格td
				html +="<td></td></tr>";
			}else{
				html +="</tr>";
			}
				
			for(var row=1;row<=rowcount;row++){
				for(var layer=1;layer<=layercount;layer++){
					html +="<tr>"
					if(layer==1){
						html+="<td rowspan='"+layercount+"' class='b-l'>"+row+"点</td>"
					}
					html+= "<td>"+layer+"层</td>";
					
					for(var k=index;k<(index+columnCount);k++){
						if(datalist[k]){
							var tempValue = datalist[k].tempValue;
							if(tempValue!=null){
								html +="<td>"+tempValue+"℃</td>";
							}else{
								html +="<td></td>";
							}
						}
					}
					index +=columnCount;
					
					if(columnCount==8){
						html +="<td></td></tr>";
					}else{
						html +="</tr>";
					}
					
				}
			}
		}
		
		html +="<tr><td></td><td></td><td colspan='3'>四周区</td><td colspan='3'>中央区</td><td colspan='3'>全仓区</td></tr>";
		html +="<tr><td></td><td></td><td>最高</td><td>最低</td><td>平均</td><td>最高</td><td>最低</td><td>平均</td><td>最高</td><td>最低</td><td>平均</td></tr>";
		var aroundList = content.aroundList;
		var centerList = content.centerList;
		var AllList = content.AllList;
		
		for(var layer=0;layer<layercount;layer++){
			var actualLayer = (layer+1);
			html +="<tr><td></td><td>" + actualLayer + "层</td>";
			//四周
			if(aroundList){
				var flag = false;
				for(var i=0;i<aroundList.length;i++){
					if(aroundList[i].layer==actualLayer){
						flag = true;
						var max = aroundList[i].mValue==null?"":aroundList[i].mValue;
						var min = aroundList[i].minValue==null?"":aroundList[i].minValue;
						var avg = aroundList[i].avgValue==null?"":aroundList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			//中央
			if(centerList){
				var flag = false;
				for(var i=0;i<centerList.length;i++){
					if(centerList[i].layer==actualLayer){
						flag = true;
						var max = centerList[i].mValue==null?"":centerList[i].mValue;
						var min = centerList[i].minValue==null?"":centerList[i].minValue;
						var avg = centerList[i].avgValue==null?"":centerList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			//全仓
			if(AllList){
				var flag = false;
				for(var i=0;i<AllList.length;i++){
					if(AllList[i].layer==actualLayer){
						flag = true;
						var max = AllList[i].mValue==null?"":AllList[i].mValue;
						var min = AllList[i].minValue==null?"":AllList[i].minValue;
						var avg = AllList[i].avgValue==null?"":AllList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			html += "</tr>";
		}
		
		var intempValue = content.intempValue;
		var inhumValue = content.inhumValue;
		var outTempValue = content.outTempValue;
		var outHumValue = content.outHumValue;
		var avgTempValue = content.avgTempValue;
		if(intempValue)
			intempValue +="℃";
		else
			intempValue ="-";
		
		if(inhumValue)
			inhumValue +="%";
		else
			inhumValue ="-";
		
		if(outTempValue)
			outTempValue +="℃";
		else
			outTempValue ="-";
		
		if(outHumValue)
			outHumValue +="%";
		else
			outHumValue ="-";
		
		if(avgTempValue)
			avgTempValue +="℃";
		else
			avgTempValue ="-";
		html += "<tr><td colspan='2'>仓温</td><td>" + intempValue + "</td>"
		+ "<td>仓湿</td><td>" + inhumValue + "</td>"
		+ "<td>外温</td><td>" + outTempValue + "</td>" + "<td>外湿</td><td>"
		+ outHumValue + "</td>" + "<td>平均粮温</td><td>" + avgTempValue
		+ "</td></tr>";
		$("#grainTempList").append($(html));
	}else if(warehouseType==2){//浅圆仓
		if(content.detailList){
			var datalist = content.detailList;
			var html = "<tr><td></td>"
			for(var i=1;i<=columnCount;i++){
				html +="<td>"+i+"区</td>"
			}
			html +="</tr>";
			
			for(var row=1;row<=rowcount;row++){
				for(var layer=1;layer<=layercount;layer++){
					html +="<tr>"
					/*if(layer==1){
						html+="<td rowspan='"+layercount+"' class='b-l'>"+row+"点</td>"
					}*/
					html+= "<td>"+layer+"层</td>";
					
					for(var k=index;k<(index+columnCount);k++){
						if(datalist[k]){
							var tempValue = datalist[k].tempValue;
							if(tempValue!=null){
								html +="<td>"+tempValue+"℃</td>";
							}else{
								html +="<td></td>";
							}
						}
					}
					index +=columnCount;
					
					html +="</tr>";
					
				}
			}
		}
		
		/*html +="<tr><td></td><td colspan='3'>四周区</td><td colspan='3'>中央区</td><td colspan='3'>全仓区</td></tr>";
		html +="<tr><td></td><td>最高</td><td>最低</td><td>平均</td><td>最高</td><td>最低</td><td>平均</td><td>最高</td><td>最低</td><td>平均</td></tr>";
		var aroundList = content.aroundList;
		var centerList = content.centerList;
		var AllList = content.AllList;
		
		for(var layer=0;layer<layercount;layer++){
			var actualLayer = (layer+1);
			html +="<tr><td>" + actualLayer + "层</td>";
			//四周
			if(aroundList){
				var flag = false;
				for(var i=0;i<aroundList.length;i++){
					if(aroundList[i].layer==actualLayer){
						flag = true;
						var max = aroundList[i].mValue==null?"":aroundList[i].mValue;
						var min = aroundList[i].minValue==null?"":aroundList[i].minValue;
						var avg = aroundList[i].avgValue==null?"":aroundList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			//中央
			if(centerList){
				var flag = false;
				for(var i=0;i<centerList.length;i++){
					if(centerList[i].layer==actualLayer){
						flag = true;
						var max = centerList[i].mValue==null?"":centerList[i].mValue;
						var min = centerList[i].minValue==null?"":centerList[i].minValue;
						var avg = centerList[i].avgValue==null?"":centerList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			//全仓
			if(AllList){
				var flag = false;
				for(var i=0;i<AllList.length;i++){
					if(AllList[i].layer==actualLayer){
						flag = true;
						var max = AllList[i].mValue==null?"":AllList[i].mValue;
						var min = AllList[i].minValue==null?"":AllList[i].minValue;
						var avg = AllList[i].avgValue==null?"":AllList[i].avgValue;
						html += "<td>" + max + "</td>";
						html += "<td>" + min + "</td>";
						html += "<td>" + avg + "</td>";
					}
				}
				if(!flag){
					html += "<td>-</td><td>-</td><td>-</td>";
				}
			}else{
				html += "<td>-</td><td>-</td><td>-</td>";
			}
			
			html += "</tr>";
		}*/
		
		var intempValue = content.intempValue;
		var inhumValue = content.inhumValue;
		var outTempValue = content.outTempValue;
		var outHumValue = content.outHumValue;
		var avgTempValue = content.avgTempValue;
		var allMax = content.allMax;
		var allMin = content.allMin;
		if(intempValue)
			intempValue +="℃";
		else
			intempValue ="-";
		
		if(inhumValue)
			inhumValue +="%";
		else
			inhumValue ="-";
		
		if(outTempValue)
			outTempValue +="℃";
		else
			outTempValue ="-";
		
		if(outHumValue)
			outHumValue +="%";
		else
			outHumValue ="-";
		
		if(avgTempValue)
			avgTempValue +="℃";
		else
			avgTempValue ="-";
		
		if(allMax)
			allMax +="℃";
		else
			allMax ="-";
		
		if(allMin)
			allMin +="℃";
		else
			allMin ="-";
		/*html += "<tr><td colspan='3'>仓温</td><td colspan='3'>" + intempValue + "</td>"
		+ "<td colspan='3'>仓湿</td><td colspan='3'>" + inhumValue + "</td>"
		+ "<td colspan='3'>外温</td><td colspan='3'>" + outTempValue + "</td>" + "<td colspan='3'>外湿</td><td colspan='3'>"
		+ outHumValue + "</td></tr><tr></tr>";*/
		html +="<tr>" + 
				"<td></td>" + 
				"<td colspan='3'>仓温</td>" + 
				"<td colspan='3'>"+intempValue+"</td>" + 
				"<td colspan='3'>仓湿</td>" + 
				"<td colspan='3'>"+inhumValue+"</td>" + 
				"<td colspan='9'>整仓</td>" + 
			"</tr>" + 
			"<tr>" + 
				"<td></td>" + 
				"<td colspan='3'>外温</td>" + 
				"<td colspan='3'>"+outTempValue+"</td>" + 
				"<td colspan='3'>外湿</td>" + 
				"<td colspan='3'>"+outHumValue+"</td>" + 
				"<td colspan='2'>最高</td>" + 
				"<td colspan='1'>"+allMax+"</td>" + 
				"<td colspan='2'>最低</td>" + 
				"<td colspan='1'>"+allMin+"</td>" + 
				"<td colspan='2'>平均</td>" + 
				"<td colspan='1'>"+avgTempValue+"</td>" + 
			"</tr>";
		$("#grainTempList").append($(html));
	}

	
	
	//粮温记录，每层最高温度点用红字，最低点用绿字。
	//温度异常点：与平均温度差值>设置差值（一般为8度），加亮黄背景色;
	$("#grainTempList").find("tr:not(:last)").each(function(){
		 var max = 0;
		 var min = 0; 
		 var avg = 0;
		 var total = 0.0; 
		 var count = 0;
		 $(this).children().each(function(i){
			 var valueStr = $(this).html();
			 if(valueStr.indexOf("℃") != -1){
				 var value = parseFloat(valueStr.replace("℃",""));
				 if(value){
					 if(count == 0){
						 max = value;
						 min = value;
					 }else{
						 if(value >= max){
							 max = value;
						 }
						 if(value <= min){
							 min = value;
						 }
					 }
					 total =accAdd(total, value);
					 count ++;
				 }
			 }
		 });
		 if(count > 0){
			 $(this).find("td:contains("+max+"℃)").css("color","#FF0000");
			 //$(this).find("td:contains("+min+"℃)").css("color","#00FF00");
			 avg = accDiv(total, count);
			 $(this).children().each(function(i){
				 
				 if($(this).text() == min+"℃"){
					 $(this).css("color","#00FF00");
				 }
				 
				 var valueStr = $(this).html();
				 if(valueStr.indexOf("℃") != -1){
					 var value = parseFloat(valueStr.replace("℃",""));
					 if(value && (value - avg >= temperature_diffferential_optioned || avg - value >= temperature_diffferential_optioned)){
						 $(this).css("background-color","#FFFF00");
					 }
				 }
			 });
		 }
	});
}

//float加法函数  
function accAdd(arg1, arg2) {  
    var r1, r2, m;  
    try {  
        r1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r1 = 0;  
    }  
    try {  
        r2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
        r2 = 0;  
    }  
    m = Math.pow(10, Math.max(r1, r2));  
    var result = (arg1 * m + arg2 * m) / m;
    return result;  
}   

//除法函数  
function accDiv(arg1, arg2) {  
    var t1 = 0, t2 = 0, r1, r2;  
    try {  
        t1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        t2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    with (Math) {  
        r1 = Number(arg1.toString().replace(".", ""));  
        r2 = Number(arg2.toString().replace(".", ""));  
        return (r1 / r2) * pow(10, t2 - t1);  
    }  
} 

