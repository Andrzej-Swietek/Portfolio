(function($) {"use strict";

	$(document).ready(function() {

		var templateOptions = Joomla.getOptions('j51_template');

		// Add parent-hover class to hovered parent items
		$('.hornav li').hover(function () {
			$(this).addClass('parent-hover');
			}, function () {
			$(this).removeClass('parent-hover');
		});

		// Smoothscroll
		$('.menu a').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
					scrollTop: target.offset().top + parseInt(templateOptions.scrolltoOffset)
					}, 800);
					return false;
				}
			}
		});

		// Bootstrap stuff
		$(document).ready(function()
		{

			// Turn radios into btn-group
			$('.radio.btn-group label').addClass('btn');
			$(".btn-group label:not(.active)").click(function()
			{
				var label = $(this);
				var input = $('#' + label.attr('for'));

				if (!input.prop('checked')) {
					label.closest('.btn-group').find("label").removeClass('active btn-success btn-danger btn-primary');
					if (input.val() == '') {
						label.addClass('active btn-primary');
					} else if (input.val() == 0) {
						label.addClass('active btn-danger');
					} else {
						label.addClass('active btn-success');
					}
					input.prop('checked', true);
				}
			});
			$(".btn-group input[checked=checked]").each(function()
			{
				if ($(this).val() == '') {
					$("label[for=" + $(this).attr('id') + "]").addClass('active btn-primary');
				} else if ($(this).val() == 0) {
					$("label[for=" + $(this).attr('id') + "]").addClass('active btn-danger');
				} else {
					$("label[for=" + $(this).attr('id') + "]").addClass('active btn-success');
				}
			});
		})

	});
})(jQuery);

document.addEventListener('sticky-change', e => {
  const header = e.detail.target;  // header became sticky or stopped sticking.
  const sticking = e.detail.stuck; // true when header is sticky.
  header.classList.toggle('shadow', sticking); // add drop shadow when sticking.

  document.querySelector('.who-is-sticking').textContent = header.textContent;
});

function goBack() {
    window.history.back()
};
