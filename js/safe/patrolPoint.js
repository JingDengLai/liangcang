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
	
	
	// 添加按钮
	$("#add").click(function() {
		$("#code").removeAttr("readonly"); 
		$("#code").removeAttr("unselectable"); 
		$("#code").css({"cursor": ""});
		$("#dataForm").reset();
		$("#addModalLabel").html("新增巡检点");
		$("#operation").val("add");
		$('#addModal').modal('show');
		// 添加leaflet地图
		setTimeout(function(){
			initMap();
		},500)
	});
	$('#addModal').on('hide.bs.modal', function() {
		$("#addModal form").each(function() {
			$(this).reset();
		});
	})
});

function initTable() {
    $('#table').bootstrapTable({
        url: '../js/safe/data1.json',
        method: 'get',
        columns: [ {
            title: '全选',
            field: '全选',
            checkbox: true
        }, {
            field: 'code',
            title: '编号'
        }, {
            field: 'name',
            title: '巡检点名称'
        }, {
            field: 'equip',
            title: '设备ID'
        },{
            field: 'desc',
            title: '说明'
        },
		// {
  //           field: 'operate',
  //           title: '操作',
  //           formatter: operateFormatter //自定义方法，添加操作按钮
  //       },
		],
		
    })
}

// function operateFormatter(value, row, index) {//赋予的参数
//     return [
//         '<button class="btn activ" id="openfile">编辑</button>',
//         '<button class="btn activ" id="openfile">删除</button>'
//     ].join('');
// }



