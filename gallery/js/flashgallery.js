/**
 *	flashgallery
 *
 *	@version 0.1.0
 */
(function($) {
	$.fn.altgallery = function(options)
	{
		options = $.extend({
			width: '550px',
			height: '400px'
		}, options);

		var
			element = this,
			gallery,
			galleryHTML,
			images = new Array(),
			thumbnails;

		function setThumbnailsClick() {
			thumbnails = gallery.children('div.altgallery-thumbnails');
			thumbnails.find('a').click(function() {
				openImage(this);
				return false;
			});
		}

		function init() {
			gallery = element;
			gallery.addClass('altgallery');

			var i = 0;
			element.find('a').each(function() {
				var img = $(this).find('img');
				var title;
				images[i] = {
					id:			i,
					source:		this.href,
					thumbnail:	img.attr('src'),
					alt:		img.attr('alt'),
					title:		(title = img.attr('title')) == undefined ? this.title : title
				};
				i++;
			});

			element.empty();

			element.css({
				position:	'relative',
				padding:	0,
				width:		options.width,
				height:		options.height,
				overflow:	'hidden',
				textAlign:	'center',
				border:		'1px solid #ddd'
			});

			element.append('<div class="altgallery-thumbnails" />');
			thumbnails = element.children('div.altgallery-thumbnails');
			thumbnails.css({
				height:		options.height,
				overflow:	'auto',
				textAlign:	'left'
			});

			for (i in images) {
				var image = images[i];
				thumbnails.append('<a id="altgallery-image-'+image.id+'" href="'+image.source+'"><img alt="" src="'+image.thumbnail+'" border="0" style="vertical-align:middle; margin:2%; width:20%;" /></a>');
			}
			thumbnails.wrapInner('<div style="margin:1% 0 1% 1%;" />');

			setThumbnailsClick();
		}

		function openImage(element) {
			var
				image_id = element.id.match(/(\d+)/)[1],
				image = images[image_id];

			galleryHTML = gallery.html();
			gallery
				.empty()
				.append('<a href="#"><img alt="" src="'+image.source+'" height="'+options.height+'" border="0" /></a>')
				.children('a').click(function() {
					gallery.html(galleryHTML);
					setThumbnailsClick();
					return false;
				});
		}

		init();
	};


	var gallery_id = 1;

	$.flashgallery = $.flashgallery || function(swf_url, config_url, options) {
		options = $.extend({
			width: '550px',
			height: '400px',
			background: '#fff'
		}, options);
		
		var element_id = 'flashgallery-' + gallery_id;
		
		document.write('<div id="'+ element_id +'"></div>');
		
		var
			element = document.getElementById(element_id),
			jElement = $(element);
			
		jElement.css({
			width: options.width,
			height: options.height,
			background: options.background,
			overflow: 'hidden'
		});
		
		var
			params = {
				allowScriptAccess: 'sameDomain',
				allowFullScreen: 'true',
				wmode: 'opaque',
				quality: 'high'
			},
			attributes = {};
			
		var m;
		if ( m = options.background.match(/(#[0-9a-f]+)/i) )
			params.bgcolor = m[1];
		else
			params.wmode = 'transparent';
		
		// TODO: swfobject.getFlashPlayerVersion(), swfobject.hasFlashPlayerVersion(versionStr)
		swfobject.embedSWF(swf_url, element_id, options.width, options.height, '10.1.102.64', null, { configPath: config_url }, params, attributes, function(e) {
			if (!e.success) {
				$.ajax({
					url: config_url,
					dataType: 'json',
					success: function(data) {
						if (data.gallery != undefined && data.gallery.items != undefined) {
							var items = data.gallery.items;
							var itemsHTML = '';
							for (var i in items) {
								var item = items[i];

								if (item.thumb == undefined)
									item.thumb = item.source;

								itemsHTML += '<li><a href="'+ item.source +'"><img src="'+ item.thumb +'" alt="'+ item.description +'" /></a></li>';
							}
							jElement.html('<ol>'+ itemsHTML +'</ol>');
							jElement.altgallery({ width: options.width, height: options.height });
						}
					}
				});
			}
		})
		
		gallery_id++;
	}

})(jQuery);
