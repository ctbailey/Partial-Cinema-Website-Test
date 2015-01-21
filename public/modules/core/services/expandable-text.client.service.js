'use strict';

angular.module('core').factory('ExpandableText', ['$timeout',
	function($timeout) {
        function makeText() {
            var public_properties = {
                expandables: []
            };

            // Expandable text logic

            // Search functions
            function findExpandableIndex(content) {
                for(var i = 0; i < public_properties.expandables.length; i++) {
                    var expandable = public_properties.expandables[i];
                    if(content === expandable.content || content === expandable) {
                        return i;
                    }
                }
                return -1;
            }

            function findExpandable(content) {
                var index = findExpandableIndex(content);
                return public_properties.expandables[index];
            }

            // Primary functions
            function hasChildren(expandable) {
                return !(expandable.children === null || expandable.children === undefined || expandable.children.length === 0);
            }
            

            function onClick(expandable, waitTime) {
                function update() {
                    //animation hook
                    expandable.beforeUpdate = false;
                    
                    // replace expandable with its children
                    var exp_index = findExpandableIndex(expandable.content);
                    var splice_args = [exp_index, 1].concat(expandable.children);
                    public_properties.expandables.splice.apply(public_properties.expandables, splice_args);
                    
                    // animation hook
                    expandable.afterUpdate = true;
                }
                
                if(hasChildren(expandable)) {
                    // animation hooks
                    expandable.afterUpdate = false;
                    expandable.beforeUpdate = true;
                    
                    $timeout(update, waitTime);
                }
            }

            function expandable(content, children) {
                return {
                    'content': content,
                    'children': children
                };
            }

            // public_properties API
            public_properties.onClick = onClick;
            public_properties.expandable = expandable;
            public_properties.hasChildren = hasChildren;
            return public_properties;
        }
        
        return {
            makeText: makeText
        };
	}
]);