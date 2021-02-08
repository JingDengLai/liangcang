(function($) {
	
	var modalHtml = '<div class="modal fade" id="department-modal-id" tabindex="-1" role="dialog" data-backdrop="true" aria-hidden="true">' + 
	'	<div class="modal-dialog">' + 
	'		<div class="modal-content">' + 
	'			<div class="modal-header">' + 
	'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	'				<h4 class="modal-title"></h4>' + 
	'			</div>' + 
	'			<div class="modal-body wicket_body">' + 
	'				<form id="updateform" class="updateform">' + 
	'					<div class="clearfix scroll-model">' + 
	'						<div class="department-tree"></div>' + 
	'					</div>' + 
	'					<div class="btn-footer">' + 
	'						<button type="button" class="btn btn-primary btn_add btn-common" data-dismiss="modal"></button>' + 
	'						<button type="button" class="btn btn-default btn-common" data-dismiss="modal"></button>' + 
	'					</div>' + 
	'				</form>' + 
	'			</div>' + 
	'		</div>' + 
	'	</div>' + 
	'</div>';
	
	var count = 0;
	function init(dom, option) {
		
		if($(dom).data("modalId")){
			return;
		}else{
			var modalId = "department-modal-" + (++count);
			$("body").append(modalHtml.replace("department-modal-id", modalId));
			$(dom).data("modalId", modalId);
			$("#" + modalId).find(".modal-title").html(option.title);
			$("#" + modalId).find("button.btn-primary").html(option.saveBtnText);
			$("#" + modalId).find("button.btn-default").html(option.cancelBtnText);
			$("#" + modalId).find("button.btn-primary").click(function(){
				if(option.onSave){
					var selectNodes =  $('#' + $(dom).data("modalId") + ' .department-tree').treeview('getSelected');
					var selectData = selectNodes.map(function(item) {
						var id = item.id;
						var text = item.text;
						if(text && option.showManager && text.indexOf("&nbsp;") > -1){
							text = text.substring(0, text.indexOf("&nbsp;"));
						}
						return {id:id,name:text};
					});
					option.onSave(selectData);
				}
			});
			
			$.ajax({
				url : 'common/department/tree',
				type : 'GET'
			}).done(function(result) {
				
				var data = [];
				$.each(result, function(i, n) {
					getTree(option, n, function(item) {
						data.push(item);
					});
				});
				
				var options = {
						multiSelect : option.multiSelect,
						showCheckbox: option.multiSelect,
						expandIcon : 'glyphicon glyphicon-chevron-right',
						collapseIcon : 'glyphicon glyphicon-chevron-down',
						onNodeSelected: function(event, node) {
							$('#' + $(dom).data("modalId") + ' .department-tree').treeview('checkNode', [ node.id, { silent: true } ]);
						},
						onNodeUnselected: function(event, node) {
							$('#' + $(dom).data("modalId") + ' .department-tree').treeview('uncheckNode', [ node.id, { silent: true } ]);
						},
						onNodeChecked: function(event, node) {
							checkedNode(dom, node, true);
							$('#' + $(dom).data("modalId") + ' .department-tree').treeview('selectNode', [ node.id, { silent: true } ]);
				        },
				        onNodeUnchecked: function (event, node) {
				        	checkedNode(dom, node, false);
				        	$('#' + $(dom).data("modalId") + ' .department-tree').treeview('unselectNode', [ node.id, { silent: true } ]);
				        },
						data : data
				};
				
				$('#' + $(dom).data("modalId") + ' .department-tree').treeview(options);

			}).fail(function(err) {
			}).always(function() {
			});
		}
	}
	
	function checkedNode(dom, parent, checked){
		if(dom){
			while (parent.nodes) {
				$.each(parent.nodes, function(i,n){
					if(checked){
						$('#' + $(dom).data("modalId") + ' .department-tree').treeview('checkNode', [ n.id, { silent: true } ]);
						$('#' + $(dom).data("modalId") + ' .department-tree').treeview('selectNode', [ n.id, { silent: true } ]);
					}else{
						$('#' + $(dom).data("modalId") + ' .department-tree').treeview('uncheckNode', [ n.id, { silent: true } ]);
						$('#' + $(dom).data("modalId") + ' .department-tree').treeview('unselectNode', [ n.id, { silent: true } ]);
					}
					parent = n;
					checkedNode(dom, parent, checked)
				});
			}
		}
	}
	
	function getTree(option, parent, callback){
		var item = {
			id : parent.id,
			text : (option.showManager && parent.manager) ? (parent.name + "&nbsp;(" + parent.manager + ")") : parent.name,
			selectable : true
		}
		
		if (parent.children) {
			$.each(parent.children, function(i,n){
				getTree(option, n, function(itemChild){
					if(!item.nodes){
						item.nodes = [];
					}
					item.nodes = item.nodes.concat(itemChild);
				});
			});
		}
		if(callback){
			callback(item);
		}
	}
	
	var methods = {
		show : function() {
			var modalId = $(this).data("modalId");
			$("#" + modalId).modal("show");
		},
		setVal : function(ids) {
			var obj = $(this);
			var selectNodes = $('#' + obj.data("modalId") + ' .department-tree').treeview('getSelected');
			if(selectNodes){
				$.each(selectNodes,function(i,n){
					$('#' + obj.data("modalId") + ' .department-tree').treeview('unselectNode', [ n, { silent: true } ]);
					$('#' + obj.data("modalId") + ' .department-tree').treeview('uncheckNode', [ n, { silent: true } ]);
				});
			}
			
			if(ids){
				$.each(ids,function(i,n){
					$('#' + obj.data("modalId") + ' .department-tree').treeview('selectNode', [ n, { silent: true } ]);
					$('#' + obj.data("modalId") + ' .department-tree').treeview('checkNode', [ n, { silent: true } ]);
				});
			}
		}
	};

	$.fn.departmentTreeView = function() {
		var param = arguments[0];
		if(methods[param]) {
			method = methods[param];
			arguments = Array.prototype.slice.call(arguments, 1);
			return method.apply(this, arguments);
		} else if( typeof(param) == 'object' || !param ) {
			var defaults = {
				title: "选择部门",
				showManager: true,
				multiSelect: true,
				saveBtnText:"保存",
				cancelBtnText:"取消",
				onSave:function(data){
					console.log(data)
				}
			}
			return init(this, $.extend(defaults, param));
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
			return this;
		}
	  };

})(jQuery);