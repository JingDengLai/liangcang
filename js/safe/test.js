$(function () {
    initTable();
	// 查询按钮事件
	$('#submit_search').click(function() {
		var name = $.trim($('#searchform #name').val());
		$('#searchform #name').val(name);
		$('#table').bootstrapTable('refresh', {url : 'basic/variety/varieties'});
	});
	// 重置按钮
	$("#submit_reset").click(function() {
		$("#searchform").reset();
	});
	
	
	$("#add").click(function() {
		$('#openModal').modal('show');
		openModel(1,1)
	});
	
});




function openModel(id, ledType) {
    $("#ledId").val(id);
    var showContent = "";
    if (ledType == 1) {
        showContent = "称重LED屏显示设置";
    } else {
        showContent = "扦样LED屏显示设置";
    }
    $("#addModalLabel").html(showContent);
    $("#operation").val("add");
    $('#openModal').modal('show');

    var ledSetTable = $("#ledSetTable").empty();
    // 车牌号，总重量，毛重，皮重，水分扣重，杂质扣重，其他扣重，合计扣重，结算数量，出入仓件数
    // 车牌号，一卡通号，姓名，样品标签，备注扦样人
	
    ledSetTable.append(''
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox" name="optionName" value="车牌号"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">车牌号&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="总重量"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">总重量&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="毛重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">毛重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="皮重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">皮重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="水分扣重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">水分扣重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox" name="optionName" value="杂质扣重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">杂质扣重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox" name="optionName" value="其他扣重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">其他扣重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="合计扣重"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">合计扣重&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="结算数量"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">结算数量&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="出入仓件数"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">出入仓件数&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="一卡通号"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">一卡通号&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="姓名"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">姓名&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="样品标签"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">样品标签&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td width="20px">'
        + '<input type="checkbox"  name="optionName" value="备注扦样人"/> '
        + '</td>'
        + '<td style="list-style-type:none;cursor:pointer;">备注扦样人&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveUp\')">上移</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        + '<a href="javascript:void(0);" style="list-style-type:none;cursor:pointer;" onclick="moveUpAndDown(this,\'moveDown\')">下移</a>'
        + '</td>'
        + '</tr>'
        + '');
		
		
		let data = ['车牌号','皮重','出入仓件数'];
		
		$('input[name=optionName]').each(function(){
			if($.inArray($(this).val(), data) != -1){
				$(this).prop("checked", true);
			}
		})
		
}


//行上下移动
function moveUpAndDown(t, oper) {
    var data_tr = $(t).parent().parent(); //获取到触发的tr
    if (oper == "moveUp") {    //向上移动
        if ($(data_tr).prev().html() == null) { //获取tr的前一个相同等级的元素是否为空
            alert("已经是最顶部了!");
            return;
        } else {
            $(data_tr).insertBefore($(data_tr).prev()); //将本身插入到目标tr的前面
        }
    } else {
        if ($(data_tr).next().html() == null) {
            alert("已经是最低部了!");
            return;
        }
        else {
            $(data_tr).insertAfter($(data_tr).next()); //将本身插入到目标tr的后面
        }
    }
}





function initTable() {
    $('#table').bootstrapTable({
        // url: '../js/safe/data1.json',
        // method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '编号'
        }, {
            field: 'date',
            title: '日期'
        }, {
            field: 'name',
            title: '计划名称'
        },{
            field: 'desc',
            title: '完成情况'
        }],
		data: [{
		    code: 1,
		    date: 'Item 1',
		    name: '$1',
			desc: 'ss'
		}, {
		    code: 2,
		    date: 'Item 2',
		    name: '$2',
		    desc: 'ss2'
		}]
    })
}