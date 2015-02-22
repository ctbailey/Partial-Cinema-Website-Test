'use strict';


angular.module('core').controller('HomeController', ['$scope', '$timeout', 'Authentication', 'ExpandableText',
	function($scope, $timeout, Authentication, ExpandableText) {
        // This provides Authentication context.
		$scope.authentication = Authentication;
        
      var canvas = document.getElementById('landscape-canvas');
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentNode.offsetHeight;
      var ctx = canvas.getContext('2d');
      
      function drawLine(points, strokeStyle) {
        ctx.beginPath();
        
        // takes a normalized point and translates it to actual pixels
        function toPixelCoordinates(point) {
          var x = point[0] * canvas.width; // point[0] is between 0 and 1, represents normalized coordinates
          var y = point[1] * canvas.height;
          return [x,y];
        }
        
        var first_point = toPixelCoordinates(points[0]);
        ctx.moveTo(first_point[0], first_point[1]);
        
        points.forEach(function(point) {
          var p = toPixelCoordinates(point);
          ctx.lineTo(p[0], p[1]);
        });
        ctx.stroke();
      }
      
      function randomWaveform(offset) { 
        function randomWalk(starting_value, variance) {
          var previous_value = starting_value;

          function clip(n, lo, hi) {
            return Math.min(Math.max(n, lo), hi);
          }

          function next() {
            var random = (Math.random() * 2) - 1; // -1 to 1
            var variation = random * variance;
            var unclipped_value = previous_value + variation;
            var value = clip(unclipped_value, 0, 1);
            previous_value = value;
            return value;
          }

          var public_interface = {};
          public_interface.next = next;

          return public_interface;
        }
        
        var rw = randomWalk(0.5, 0.03);
        var num_points = 1000;
        var samples = [];
        
        for(var x = 0; x < num_points; x++) {
          var normalized_height = rw.next();
          var normalized_x = x / num_points;
          var point = [normalized_x, normalized_height];
          samples.push(point);
        }
        
        var waveform = {};
        waveform.offset = offset; // normalized
        waveform.samples = samples;
        waveform.frame = 0;
        if(Math.random() > 0.5) {
          waveform.rgb = '142, 214, 255';
        } else {
          //waveform.rgb = '230, 230, 250';
          waveform.rgb = '142, 214, 255';
        }
        return waveform;
      }
      
      function scrollWaveforms(waveforms, scrollspeed) {
        // outer function exists so inner function
        // always has access to scrollspeed and waveforms,
        // since you can't do something like
        // setTimeout(scroll(waveforms, scrollspeed), 50)
        
        var scaling_factor = 1 / waveforms.length;
        
        function replace_waveform_at(i) {
          waveforms[i] = randomWaveform(1);
        }
        
        function scroll() {
          // update waveform offset
          for(var i = 0; i < waveforms.length; i++) {
            var w = waveforms[i];
            w.offset += scrollspeed;
            if(w.offset < -scaling_factor) {
              replace_waveform_at(i);
            }
          }
          
          drawWaveforms(waveforms, scaling_factor);
          setTimeout(scroll, 50);
        }
      
        scroll();
      }
      
      function drawWaveform(waveform, scaling_factor, distance) {
        function transformToGlobalCoordinates(sample) {
          var x = sample[0];
          var y = (sample[1] * scaling_factor) + waveform.offset;
          return [x,y];
        }
        
        // takes a normalized point and translates it to actual pixels
        function toPixelCoordinates(point) {
          var x = point[0] * canvas.width; // point[0] is between 0 and 1, represents normalized coordinates
          var y = point[1] * canvas.height;
          return [x,y];
        }
        
        function complexLine(points) {
          points.forEach(function(point) {
            var p = toPixelCoordinates(point);
            ctx.lineTo(p[0], p[1]);
          });
        }
      /*
        var imageObj = new Image();
        
        imageObj.onload = function() {
          
          var startPixel = [139,187,235,283][waveform.frame];
          ctx.drawImage(imageObj, 
                        startPixel, 0, 44, 44, 
                        20, waveform.offset * canvas.height, 48, 44);
          
          waveform.frame = (waveform.frame + 1) % 4;
        };
        imageObj.src = 'modules/core/img/chicken/chickenx4.png';
        */
        var samples = waveform.samples.map(transformToGlobalCoordinates);
        
        ctx.beginPath();
        ctx.moveTo(0,canvas.height);
        complexLine(samples);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        var base_alpha = 0.1;
        var alpha = base_alpha;
        if(waveform.offset < 0) {
          alpha = (base_alpha / scaling_factor) * waveform.offset + base_alpha; // decrease alpha linearly to 0 once offset is less than 0
        }
        ctx.fillStyle = 'rgba(' + waveform.rgb + ',' + alpha + ')';
        ctx.fill();
      }
      
      function drawWaveforms(waveforms, scaling_factor) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < waveforms.length; i++) {
          var w = waveforms[i];
          drawWaveform(w, scaling_factor, i);
        }
        //ctx.strokeStyle = transparency_gradient;
      }
      
      var ws = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map(function(num) { return randomWaveform(num); });
      //var ws = randomWaveform(0.3);
      scrollWaveforms(ws, -0.0005);
        
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