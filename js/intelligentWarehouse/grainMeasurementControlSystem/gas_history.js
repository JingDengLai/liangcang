var boxHeight, videoHeight, videoWidth, $table = $('#table');

$(function() {
	initTable();
	 $(".content-wrapper").mCustomScrollbar();
});

//查询按钮事件
$("#submit_search").click(function(){
	$("#table").bootstrapTable("refresh");
});
// 重置按钮
$("#submit_reset").click(function() { 
	$("#searchform")[0].reset();
});

//列表查询
function initTable(){
	$("#table").bootstrapTable({
		url: "gas/history/gasHistoryPages",
		method : 'get', // 请求方式（*）
		columns: [{
			title: "库区",
			field: "groupName"
		},{
			title: "监测时间",
			field: "monitorTime"
		},{
			title: "仓间号",
			field: "warehouseCode"
		},{
			title: "类型",
			field: "gasType",
			formatter:  function (value, row, index) {
				var type = row.gasType;
				if(type==1){  
			        return "PH3(ppm)";  
			    }else if(type==2){  
			        return "O2(%)";  
			    }else if(type==3){
			    	return "CO2(ppm)";
			    }
            }
		} ,{
			title: "1区",
			field: "value_1"
		},{
			title: "2区",
			field: "value_2"
		},{
			title: "3区",
			field: "value_3"
		},{
			title: "4区",
			field: "value_4"
		},{
			title: "5区",
			field: "value_5"
		},{
			title: "6区",
			field: "value_6"
		},{
			title: "7区",
			field: "value_7"
		},{
			title: "8区",
			field: "value_8"
		},{
			title: "9区",
			field: "value_9"
		},{
			title: "10区",
			field: "value_10"
		},{
			title: "11区",
			field: "value_11"
		},{
			title: "12区",
			field: "value_12"
		},{
			title: "13区",
			field: "value_13"
		},{
			title: "14区",
			field: "value_14"
		},{
			title: "15区",
			field: "value_15"
		},{
			title: "平均值",
			field: "avg_value",
			formatter:  function (value, row, index) {
				 if (row != null) {
                     return parseFloat(value).toFixed(2);
                 }
            }
		}],
		onLoadSuccess: function(data){  //加载成功时执行
			if(data.total>0){
				mergeTable("monitorTime");
				mergeTable("groupName");
				mergeTable("warehouseCode");
			}
          }
	});
}

function mergeTable(field){
    $table=$("#table");
    var obj=getObjFromTable($table,field);

     for(var item in obj){  
        $("#table").bootstrapTable('mergeCells',{
        index:obj[item].index,
        field:field,
        colspan:1,
        rowspan:obj[item].row,
        });
      }
}

function getObjFromTable($table,field){
    var obj=[];
    var maxV=$table.find("th").length;

    var columnIndex=0;
    var filedVar;
    for(columnIndex=0;columnIndex<maxV;columnIndex++){
        filedVar=$table.find("th").eq(columnIndex).attr("data-field");
        if(filedVar==field) break;

    }
    var $trs=$table.find("tbody > tr");
    var $tr;
    var index=0;
    var content="";
    var row=1;
    for (var i = 0; i <$trs.length;i++)
    {   
        $tr=$trs.eq(i);
        var contentItem=$tr.find("td").eq(columnIndex).html();
        //exist
        if(contentItem.length>0 && content==contentItem ){
            row++;
        }else{
            //save
            if(row>1){
                obj.push({"index":index,"row":row});
            }
            index=i;
            content=contentItem;
            row=1;
        }
    }
    if(row>1)obj.push({"index":index,"row":row});
    return obj; 
}

