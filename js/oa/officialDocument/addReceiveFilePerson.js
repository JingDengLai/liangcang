(function($) {
	
	var modalHtml = '<div class="modal fade" id="addPersonModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
	'	<div class="modal-dialog">' + 
	'		<div class="modal-content">' + 
	'			<div class="modal-header">' + 
	'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	'				<h4 class="modal-title" id="addPerson-title">添加收件人</h4>' + 
	'			</div>' + 
	'			<div class="modal-body wicket_body">' + 
	'				<form id="updateform" class="updateform">' + 
	'					<div class="clearfix scroll-model">' + 
	'						<div id="person-tree"></div>' + 
	'					</div>' + 
	'					<div class="btn-footer">' + 
	'						<button id="addPersonSubmitButton" type="button" class="btn btn-primary btn_add btn-common" data-dismiss="modal">添加</button>' + 
	'						<button type="button" class="btn btn-default btn-common" data-dismiss="modal">取消</button>' + 
	'					</div>' + 
	'				</form>' + 
	'			</div>' + 
	'		</div>' + 
	'	</div>' + 
	'</div>';
	
	
	var obj;
	var originData;
	function init(options,callback) {
		obj = $(this);
		if($("#addPersonModal").length <= 0){
			$("body").append(modalHtml);
			$('#addPersonModal #addPersonSubmitButton').click(function() {
				setSelectName();
				signingDatePick();
			});
			
			$.ajax({
				url : '/common/staff/tree',
				type : 'GET'
			}).done(function(result) {
				
				var data = [];
				$.each(result, function(i,n){
					
					getTree(n,function(item){
						data.push(item);
					});
				});
				var options = {
						multiSelect : (options && options.multiSelect)?options.multiSelect:true,
						expandIcon : 'glyphicon glyphicon-chevron-right',
						collapseIcon : 'glyphicon glyphicon-chevron-down',
						data : data
				};
				if(options && options.title){
					$('#addPerson-title').html(options.title);
				}
				$('#person-tree').treeview(options);
				originData = data;
				
				var ids = $(obj).find('input[name="selected-staff"]').val();
				setSelectNode(ids);
			}).fail(function(err) {
			}).always(function(){
				if(callback){
					callback();
				}
			});
			
			$('#addPersonModal').on('shown.bs.modal', function () {
				
				var ids = $(obj).find('input[name="selected-staff"]').val();
				setSelectNode(ids);
				
			});
		}
	}
	
	function getTree(parent, callback){
		var item = {
			id : "p_" + parent.id,
			text : parent.name,
			selectable : false,
			nodes : []
		}
		
		if (parent.staff) {
			item.nodes = item.nodes.concat($.map(parent.staff,function(n){
				return {
					id : "s_" + n.id,
					text : n.name,
					selectable : true,
					icon : "glyphicon glyphicon-user"
				};
			}));
		}
		
		if (parent.children) {
			$.each(parent.children, function(i,n){
				getTree(n, function(itemChild){
					item.nodes = item.nodes.concat(itemChild)
				});
			});
		}
		if(callback){
			callback(item);
		}
	}
	
	function setSelectNode(ids){
		if(ids){
			var array = ids.split(",");
			$.each(array,function(i,n){
				$('#person-tree').treeview('selectNode', [ n, { silent: true ,multiSelect:true} ]);
			});
		}else{
			
		}
	}

	function setSelectName(){
		var selectNodes = $('#person-tree').treeview('getSelected');
		var names = selectNodes.map(function(item) {
			return item.text;
		});
		var ids = selectNodes.map(function(item) {
			if(item.id && item.id.indexOf('s_') == 0) {
				return item.id.substring(2,item.id.length);
			}else{
				return item.id;
			}
		});
		
		var operation = $("#operation").val();
		if("add1" == operation){
			var var1 = ids.join(",");
			$('#mainReceiver').val(var1);
			var var2 = names.join(",");
			$('#receiveFilePerson1').val(var2);
		}
		if("add2" == operation){
			var var1 = ids.join(",");
			$('#copyReceiver').val(var1);
			var var2 = names.join(",");
			$('#receiveFilePerson2').val(var2);
		}
		obj.find('input[name="selected-staff"]').val(ids);
		obj.find('.add-apply').hide();
		obj.find('.examine .leader').click(function() {
			$('#addPersonModal').modal("show");
		});
	}

	var methods = {
		setVal : function(ids) {
			var selectNodes = $('#person-tree').treeview('getSelected');
			if(selectNodes){
				$.each(selectNodes,function(i,n){
					$('#person-tree').treeview('unselectNode', [ n, { silent: true } ]);
				});
			}
			if(ids){
				$.each(ids,function(i,n){
					console.log(n);
					$('#person-tree').treeview('selectNode', [ "s_"+n, { silent: true } ]);
				});
			}
			
			setSelectName();
		},
		getVal : function() {
			var array = new Array();
			var ids = obj.find('input[name="selected-staff"]').val();
			if(ids.split(",")){
				array = ids.split(",");
			}
			return array
		}
	};

	$.fn.addPersonView = function() {
		var method = arguments[0];
		 
		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
			return method.apply(this, arguments);
		} else if( typeof(method) == 'object' || !method ) {
			return init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
			return this;
		}
	  };

})(jQuery);