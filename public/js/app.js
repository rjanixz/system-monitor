/* ------------------------------------------------------------------------------
*  # Main JS file
*  # The main js file is common for all demos
* ---------------------------------------------------------------------------- */

// CORE APP OBJECT
// ======================

var APP = function() {
    this.ASSETS_PATH = './assets/';
};

var APP = new APP();

// APP UI SETTINGS

APP.UI = {
	scrollTop: 0, // Minimal scrolling to show scrollTop button
};


// PAGE PRELOADING ANIMATION
$(window).on('load', function() {
	setTimeout(function() {
		$('.preloader-backdrop').fadeOut(200);
		$('body').addClass('has-animation');
	},0);
});



$(function () {

	// BACK TO TOP
	$(window).scroll(function() {
		if($(this).scrollTop() > APP.UI.scrollTop) $('.to-top').fadeIn();
        else $('.to-top').fadeOut();
	});
	$('.to-top').click(function(e) {
		$("html, body").animate({scrollTop:0},500);
	});

    // QUICK SIDEBAR TOGGLE ACTION
    $('.quick-sidebar-toggler').click(function(){
        $('.quick-sidebar').backdrop();
    });

    //  CHAT
    $('.chat-list [data-toggle="show-chat"]').click(function(){
        $(this).parents('.chat-panel').addClass('opened');
    });
    $('.messenger-return').click(function(){
        $(this).parents('.chat-panel').removeClass('opened');
    });

    // LOGS
    $('.log-tabs a').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        if($(this).attr('data-type') == 'all') {
            $('.logs-list li').show();
        } else {
            $('.logs-list li').hide().filter('[data-type="'+$(this).attr('data-type')+'"]').show();
        }
    });


    // TOGGLE THEME-CONFIG BOX
	
	$('.theme-config-toggle').on('click', function() {
		$(this).parents('.theme-config').backdrop();
	});

    // SEARCH BAR ACTION

    $('.js-search-toggler').click(function() {
        $('.search-top-bar').backdrop().find('.search-input').focus();
    });
    $('.input-search-close').click(function(){
        closeShined();
    });


    // Activate Tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Activate Popovers
    $('[data-toggle="popover"]').popover();

    // Activate slimscroll
    $('.scroller').each(function(){
        $(this).slimScroll({
            height: $(this).attr('data-height') || '100%',
            color: $(this).attr('data-color') || '#71808f',
            railOpacity: '0.9',
            size: '4px',
        });
    });

    $('.slimScrollBar').hide();


    // PANEL ACTIONS
    // ======================

    $('.ibox-collapse').click(function(){
    	var ibox = $(this).closest('div.ibox');
    	ibox.toggleClass('collapsed-mode').children('.ibox-body').slideToggle(200);
    });
    $('.ibox-remove').click(function(){
    	$(this).closest('div.ibox').remove();
    });
    $('.fullscreen-link').click(function(){
        if($('body').hasClass('fullscreen-mode')) {
            $('body').removeClass('fullscreen-mode');
            $(this).closest('div.ibox').removeClass('ibox-fullscreen');
            $(window).off('keydown',toggleFullscreen);
        } else {
            $('body').addClass('fullscreen-mode');
            $(this).closest('div.ibox').addClass('ibox-fullscreen');
            $(window).on('keydown', toggleFullscreen);
        }
    });
    function toggleFullscreen(e) {
        // pressing the ESC key - KEY_ESC = 27 
        if(e.which == 27) {
            $('body').removeClass('fullscreen-mode');
            $('.ibox-fullscreen').removeClass('ibox-fullscreen');
            $(window).off('keydown',toggleFullscreen);
        }
    }
    
    // Backdrop functional

    $.fn.backdrop = function() {
	    $(this).toggleClass('shined');
	    $('body').toggleClass('has-backdrop');
        return $(this);
	};

    $('.backdrop').click(closeShined);

    function closeShined() {
        $('body').removeClass('has-backdrop');
        $('.shined').removeClass('shined');
    }

    // Session timeout
    
    var idle_timer;
    (function(){
        $('#timeout-activate').click(function(){
            if(+$('#timeout-count').val()) {
                activate(+$('#timeout-count').val());
            }
        });

        $('#timeout-reset').click(function(){
            reset();
        });

        function reset(){
            $( document ).idleTimer("destroy");
            if(idle_timer) clearTimeout(idle_timer);
            $('#session-dialog').modal('hide');
            $('.timeout-toggler').removeClass('active');
            $('#timeout-reset-box').hide();
            $('#timeout-activate-box').show();
        }

        function activate(count){
            $('#session-dialog').modal('hide');
            $('#timeout-reset-box').show();
            $('#timeout-activate-box').hide();
            $( document ).idleTimer( count * 60000 );
            
            setTimeout(function(){
                $('.timeout-toggler').addClass('active');
            },(count-1) * 60000);

            $( document ).on( "idle.idleTimer", function(event, elem, obj){
                // function you want to fire when the user goes idle
                toastr.warning('Your session is about to expire. The page will redirect after 15 seconds with no activity.','Session Timeout Notification',{
                    "progressBar": true,
                    "timeOut": 5000,
                });
                idle_timer = setTimeout(timeOutHandler,5000);
            });

            $( document ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
                // function you want to fire when the user becomes active again
                clearTimeout(idle_timer);
                $( document ).idleTimer("reset");
                toastr.clear();
                toastr.success('You returned to the active mode.','You are back.');
            });

            function timeOutHandler() {
                reset();
                alert('Your session has expired. You can redirect this page or logout.');
            }
        }
    })();

    $('#timeout-form').validate({
        errorClass:"help-block",
        rules: {
            timeout_count: {required:true,digits:true},
        },
        highlight:function(e){$(e).closest(".form-group").addClass("has-error").closest('.timeout-modal').addClass("has-error");},
        unhighlight:function(e){$(e).closest(".form-group").removeClass("has-error").closest('.timeout-modal').removeClass("has-error");},
    });


    // Pre Copy to clipboard

    if($(".clipboard-copy").length>0) {
        new Clipboard('.clipboard-copy', {
            target: function (t) {
                return t.nextElementSibling;
            }
        }).on('success', function (e) {
            e.clearSelection();
            e.trigger.textContent = 'Copied';
            window.setTimeout(function () {
                e.trigger.textContent = 'Copy';
            }, 2000);
        });
    }

    // Print action

    $("[data-action='print']").click(function(){
        var target = $(this).attr('data-target');

        if($(target).length) {
            $(target).printMe({
                path: [
                  'assets/vendors/bootstrap/dist/css/bootstrap.min.css',
                  'assets/css/main.css'
                ]
            });
        }
    });

});


$(function(){

    // SIDEBAR ACTIVATE METISMENU
	$(".metismenu").metisMenu();
    

    // SIDEBAR TOGGLE ACTION
    $('.js-sidebar-toggler').click(function() {
        if( $('body').hasClass('drawer-sidebar') ) {
            $('.page-sidebar').backdrop();
        } else {
            $('.page-sidebar').toggleClass('opened');
        }
        $(this).toggleClass('active');
    });

    // LAYOUT STYLE
    $("[name='layout-style']").change(function(){
        if(+$(this).val()) $('body').addClass('boxed-layout');
        else $('body').removeClass('boxed-layout');
    });

    // drawer sidebar
    $('#_drawerSidebar').change(function(){
        $('.page-sidebar').removeClass('opened');
        if( $(this).is(':checked') ) {
            $('body').addClass('drawer-sidebar');
        } else {
            $('body').removeClass('drawer-sidebar');
        }
    });

    // THEMES COLOR CHANGE
    $('.color-skin-box input:radio').change(function() {
        var val = $(this).val();
        if(val != 'default') {
            if(! $('#theme-style').length ) {
                $('head').append( "<link href='assets/css/themes/"+val+".css' rel='stylesheet' id='theme-style' >" );
            } else $('#theme-style').attr('href', 'assets/css/themes/'+val+'.css');
        } else $('#theme-style').remove();
    });

});
