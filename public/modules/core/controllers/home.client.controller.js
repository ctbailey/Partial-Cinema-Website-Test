'use strict';


angular.module('core').controller('HomeController', ['$scope', '$timeout', 'Authentication', 'ExpandableText',
	function($scope, $timeout, Authentication, ExpandableText) {
        // This provides Authentication context.
		$scope.authentication = Authentication;
        
        var et = ExpandableText.makeText();
        et.expandables = [
            {
                'content': 'We\'re '
            },
            {
                'content': 'a',
                'children': [
                    {
                        'content': 'not '
                    },
                    {
                        'content': 'just '
                    },
                    {
                        'content': 'any'
                    }
                ]
            },
            {
                'content': ' '
            },
            {
                'content': 'band',
                'children': [
                    {
                        'content': 'collective',
                        'children': [
                            {
                                'content': 'creative collective '
                            }
                        ]
                    }, 
                    {
                        'content': ' of '
                    },
                    {
                        'content': 'musicians',
                        'children': [
                                {
                                    'content': ' musicians'
                                },
                                {
                                    'content': ' and'
                                },
                                {
                                    'content': ' artists'
                                }
                        ]
                    }
                ]
            },
            {
                'content': '.'
            }
        ];
        
        $scope.et = et;
        
        $scope.songs = [
            {
              'title': 'Peace of Mind',
              'url': '/songs/peace-of-mind',
              'lead': 'The sky is glowing, but I don\'t see the way',
              'imgSrc': 'modules/core/img/brand/double-planetoid.jpg'
            },
            {
              'title': 'Man',
              'url': '/songs/man',
              'lead': 'Show the way, \'cause I\'m all ears',
              'imgSrc': 'modules/core/img/brand/division.jpg'
            },
            {
              'title': 'Mama Bird',
              'url': '/songs/mama-bird',
              'lead': 'Gotta get out the nest, gonna fly',
              'imgSrc': 'modules/core/img/brand/fish-sphere.jpg'
            }
        ];
        
	}
]);