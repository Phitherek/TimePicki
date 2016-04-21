/* 
 * Author: @senthil2rajan
 * plugin: timepicker
 * website: senthilraj.github.io/Timepicki
 */
(function($) {

	$.fn.timepicki = function(options) {

		var defaults = {
			format_output: function(tim, mini, meri) {
				if(settings.show_meridian){
					return tim + " : " + mini + " : " + meri;
				}else{
					return tim + " : " + mini;
				}
			},
			increase_direction: 'down',
			custom_classes: '',
			min_hour_value: 1,
			max_hour_value: 12,
			show_meridian: true,
			step_size_hours: '1',
			step_size_minutes: '1',
			overflow_minutes: false,
			disable_keyboard_mobile: false,
			reset: false,
			on_change: null,
			min_time_constraint: null,
			max_time_constraint: null
		};

		var settings = $.extend({}, defaults, options);

		return this.each(function() {

			var ele = $(this);
			var ele_hei = ele.outerHeight();
			ele_hei += 10;
			$(ele).wrap("<div class='time_pick'>");
			var ele_par = $(this).parents(".time_pick");

			// developer can specify which arrow makes the numbers go up or down
			var top_arrow_button = (settings.increase_direction === 'down') ?
				"<div class='prev action-prev'></div>" :
				"<div class='prev action-next'></div>";
			var bottom_arrow_button = (settings.increase_direction === 'down') ?
				"<div class='next action-next'></div>" :
				"<div class='next action-prev'></div>";

			var new_ele = $(
				"<div class='timepicker_wrap " + settings.custom_classes + "'>" +
					"<div class='arrow_top'></div>" +
					"<div class='time'>" +
						top_arrow_button +
						"<div class='ti_tx'><input type='text' class='timepicki-input'" + (settings.disable_keyboard_mobile ? "readonly" : "") + "></div>" +
						bottom_arrow_button +
					"</div>" +
					"<div class='mins'>" +
						top_arrow_button +
						"<div class='mi_tx'><input type='text' class='timepicki-input'" + (settings.disable_keyboard_mobile ? "readonly" : "") + "></div>" +
						bottom_arrow_button +
					"</div>");
			if(settings.show_meridian){
				new_ele.append(
					"<div class='meridian'>" +
						top_arrow_button +
						"<div class='mer_tx'><input type='text' class='timepicki-input' readonly></div>" +
						bottom_arrow_button +
					"</div>");
			}
			if(settings.reset){
				new_ele.append(
					"<div><a href='#' class='reset_time'>Reset</a></div>");
			}
			ele_par.append(new_ele);
			var ele_next = $(this).next(".timepicker_wrap");
			var ele_next_all_child = ele_next.find("div");
			var inputs = ele_par.find('input');
			
			$('.reset_time').on("click", function(event) {
				ele.val("");
				close_timepicki();
			});		
			$(".timepicki-input").keydown( function(keyevent){
					var len = $(this).val().length;

					// Allow: backspace, delete, tab, escape, enter and .
					if ($.inArray(keyevent.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
					     // Allow: Ctrl+A
					    (keyevent.keyCode == 65 && keyevent.ctrlKey === true) || 
					     // Allow: home, end, left, right
					    (keyevent.keyCode >= 35 && keyevent.keyCode <= 39)) {
						 // let it happen, don't do anything
						 return;
					}
					// Ensure that it is a number and stop the keypress
					if ((keyevent.shiftKey || (keyevent.keyCode < 48 || keyevent.keyCode > 57)) && 
					(keyevent.keyCode < 96 || keyevent.keyCode > 105) || len==2 ) {
					    keyevent.preventDefault();
					}

			});

			// open or close time picker when clicking
			$(document).on("click", function(event) {
				if (!$(event.target).is(ele_next) && ele_next.css("display")=="block" && !$(event.target).is($('.reset_time'))) {
					if (!$(event.target).is(ele)) {
						set_value(event, !is_element_in_timepicki($(event.target)));
					} else {
						var ele_lef =  0;
						
						ele_next.css({
							"top": ele_hei + "px",
							"left": ele_lef + "px"
						});
						open_timepicki();
					}
				}
			});

			// open the modal when the user focuses on the input
			ele.on('focus', open_timepicki);

			// select all text in input when user focuses on it
			inputs.on('focus', function() {
				var input = $(this);
				if (!input.is(ele)) {
					input.select();
				}
			});

			// allow user to increase and decrease numbers using arrow keys
			inputs.on('keydown', function(e) {
				var direction, input = $(this);

				// UP
				if (e.which === 38) {
					if (settings.increase_direction === 'down') {
						direction = 'prev';
					} else {
						direction = 'next';
					}
				// DOWN
				} else if (e.which === 40) {
					if (settings.increase_direction === 'down') {
						direction = 'next';
					} else {
						direction = 'prev';
					}
				}

				if (input.closest('.timepicker_wrap .time').length) {
					change_time(null, direction);
				} else if (input.closest('.timepicker_wrap .mins').length) {
					change_mins(null, direction);
				} else if (input.closest('.timepicker_wrap .meridian').length && settings.show_meridian) {
					change_meri(null, direction);
				}
			});

			// close the modal when the time picker loses keyboard focus
			inputs.on('blur', function() {
				setTimeout(function() {
					var focused_element = $(document.activeElement);
					if (focused_element.is(':input') && !is_element_in_timepicki(focused_element)) {
						set_value();
						close_timepicki();
					}
				}, 0);
			});

			function is_element_in_timepicki(jquery_element) {
				return $.contains(ele_par[0], jquery_element[0]) || ele_par.is(jquery_element);
			}

			// validate given value against time constraints, if any, and return the correct value
			function validate_against_time_constraints(value) {
				var correct_value = value;
				if(settings.min_time_constraint != null) {
					var split_value = correct_value.split(":");
					var split_constraint = settings.min_time_constraint.split(":");
					if((Number(split_value[0]) <= Number(split_constraint[0])) || ((Number(split_value[0]) == Number(split_constraint[0])) && Number(split_value[1]) <= Number(split_constraint[1]))) {
						correct_value = settings.min_time_constraint;
					}
				}
				if(settings.max_time_constraint != null) {
					var split_value = correct_value.split(":");
					var split_constraint = settings.max_time_constraint.split(":");
					if((Number(split_value[0]) >= Number(split_constraint[0])) || ((Number(split_value[0]) == Number(split_constraint[0])) && Number(split_value[1]) >= Number(split_constraint[1]))) {
						correct_value = settings.max_time_constraint;
					}
				}
				return correct_value;
			}

			function set_value(event, close) {
				// use input values to set the time
				var raw_val = null;
				var tim = ele_next.find(".ti_tx input").val();
				var mini = ele_next.find(".mi_tx input").val();
				var meri = "";
				if(settings.show_meridian){
					meri = ele_next.find(".mer_tx input").val();
				}

				// Validate value against time constraints

				raw_val = (settings.show_meridian && meri == 'PM') ? (Number(tim) + 12).toString() : Number(tim).toString();
				raw_val += ':';
				raw_val += mini;

				var correct_value = validate_against_time_constraints(raw_val).split(':');

				tim = correct_value[0];
				mini = correct_value[1];
				 if(settings.show_meridian) {
					 if((Number(tim) > 12) || ((Number(tim) == 12) && (Number(mini) > 0))) {
						 tim = (Number(tim) - 12).toString();
						 meri = 'PM';
					 } else {
						 meri = 'AM';
					 }
				 }

				if(tim < 10) {
					tim = "0" + tim;
				}

				if (tim.length !== 0 && mini.length !== 0 && (!settings.show_meridian || meri.length !== 0)) {
					// store the value so we can set the initial value
					// next time the picker is opened
					ele.attr('data-timepicki-tim', tim);
					ele.attr('data-timepicki-mini', mini);
					
					if(settings.show_meridian){
						ele.attr('data-timepicki-meri', meri);
						// set the formatted value
						ele.val(settings.format_output(tim, mini, meri));
					}else{
						ele.val(settings.format_output(tim, mini));
					}
				}

				//Call user on_change callback function if set
				if (settings.on_change !== null) {
					settings.on_change(ele[0]);
				}

				if (close) {
					close_timepicki();
				}
			}

			function open_timepicki() {
				set_date(settings.start_time);
				ele_next.fadeIn();
				// focus on the first input and select its contents
				var first_input = ele_next.find('input:visible').first();
				first_input.focus();
				// if the user presses shift+tab while on the first input,
				// they mean to exit the time picker and go to the previous field
				var first_input_exit_handler = function(e) {
					if (e.which === 9 && e.shiftKey) {
						first_input.off('keydown', first_input_exit_handler);
						var all_form_elements = $(':input:visible:not(.timepicki-input)');
						var index_of_timepicki_input = all_form_elements.index(ele);
						var previous_form_element = all_form_elements.get(index_of_timepicki_input-1);
						previous_form_element.focus();
					}
				};
				first_input.on('keydown', first_input_exit_handler);
			}

			function close_timepicki() {
				ele_next.fadeOut();
			}

			function set_date(start_time) {
				var d, ti, mi, mer, raw_val;

				// if a value was already picked we will remember that value
				if (ele.is('[data-timepicki-tim]')) {
					ti = Number(ele.attr('data-timepicki-tim'));
					mi = Number(ele.attr('data-timepicki-mini'));
					if(settings.show_meridian){
						mer = ele.attr('data-timepicki-meri');
					}
				// developer can specify a custom starting value
				} else if (typeof start_time === 'object') {
					ti = Number(start_time[0]);
					mi = Number(start_time[1]);
					if(settings.show_meridian){
						mer = start_time[2];
					}
				// default is we will use the current time
				} else {
					d = new Date();
					ti = d.getHours();
					mi = d.getMinutes();
					mer = "AM";
					if (12 < ti  && settings.show_meridian) {
						ti -= 12;
						mer = "PM";
					}
				}

				// Validate value against time constraints

				raw_val = (settings.show_meridian && mer == 'PM') ? (Number(ti) + 12).toString() : ti;
				raw_val += ':';
				raw_val += mi;

				var correct_value = validate_against_time_constraints(raw_val).split(':');

				ti = correct_value[0];
				mi = correct_value[1];
				if(settings.show_meridian) {
					if((Number(ti) > 12) || ((Number(ti) == 12) && (Number(mi) > 0))) {
						ti = (Number(ti) - 12).toString();
						mer = 'PM';
					} else {
						mer = 'AM';
					}
				}

				if (ti < 10) {
					ele_next.find(".ti_tx input").val("0" + ti);
				} else {
					ele_next.find(".ti_tx input").val(ti);
				}
				if (mi < 10) {
					ele_next.find(".mi_tx input").val("0" + mi);
				} else {
					ele_next.find(".mi_tx input").val(mi);
				}
				if(settings.show_meridian){
					ele_next.find(".mer_tx input").val(mer);
				}
			}

			function change_time(cur_ele, direction) {
				var cur_cli = "time";
				var cur_time = Number(ele_next.find("." + cur_cli + " .ti_tx input").val());
				var ele_st = Number(settings.min_hour_value);
				var ele_en = Number(settings.max_hour_value);
				var step_size = Number(settings.step_size_hours);
				var updated_time = cur_time;
				if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
					if (cur_time + step_size > ele_en) {
						updated_time = ele_st;
					} else {
						cur_time = cur_time + step_size;
						updated_time = cur_time;
					}
				} else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
					var minValue = Number(settings.min_hour_value);
					if (cur_time - step_size < minValue) {
						updated_time = ele_en;
					} else {
						cur_time = cur_time - step_size;
						updated_time = cur_time;
					}
				}
				// Check new time against constraints
				var cur_mins = Number(ele_next.find("." + cur_cli + " .mi_tx input").val());
				var cur_mer = ele_next.find("." + cur_cli + " .mer_tx input").val();

				var raw_val = null;

				raw_val = (settings.show_meridian && cur_mer == 'PM') ? (Number(updated_time) + 12).toString() : updated_time;
				raw_val += ':';
				raw_val += cur_mins;

				var correct_value = validate_against_time_constraints(raw_val).split(':');

				updated_time = correct_value[0];

				if(settings.show_meridian && updated_time > 12) {
					updated_time = (Number(updated_time)-12).toString()
				}

				if (updated_time < 10) {
					updated_time = "0" + updated_time;
				}

				ele_next.find("." + cur_cli + " .ti_tx input").val(updated_time);
			}

			function change_mins(cur_ele, direction) {
				var cur_cli = "mins";
				var cur_mins = Number(ele_next.find("." + cur_cli + " .mi_tx input").val());
				var ele_st = 0;
				var ele_en = 59;
				var step_size = Number(settings.step_size_minutes);
				var updated_mins = cur_mins;
				var overflow = null;
				if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
					if (cur_mins + step_size > ele_en) {
						updated_mins = '0';
						overflow = 'next';
					} else {
						cur_mins = cur_mins + step_size;
						updated_mins = cur_mins;
					}
				} else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
					if (cur_mins - step_size <= -1) {
						updated_mins = ele_en + 1 - step_size;
						overflow = 'prev';
					} else {
						cur_mins = cur_mins - step_size;
						updated_mins = cur_mins;
					}
				}
				// Check new time against constraints
				var cur_time = Number(ele_next.find("." + cur_cli + " .ti_tx input").val());
				var cur_mer = ele_next.find("." + cur_cli + " .mer_tx input").val();
				var updated_time = cur_time;
				if(overflow == 'next' && settings.overflow_minutes) {
					updated_time = updated_time + 1;
				} else if(overflow == 'prev' && settings.overflow_minutes) {
					updated_time = updated_time - 1;
				}

				var raw_val = null;

				raw_val = (settings.show_meridian && cur_mer == 'PM') ? (Number(updated_time) + 12).toString() : updated_time;
				raw_val += ':';
				raw_val += updated_mins;

				var correct_value = validate_against_time_constraints(raw_val).split(':');

				updated_mins = correct_value[1];
				if(correct_value[0] == updated_time) {
					if(overflow != null && settings.overflow_minutes) {
						change_time(null, overflow)
					}
				}
				if(updated_mins < 10) {
					updated_mins = "0" + updated_mins;
				}
				ele_next.find("." + cur_cli + " .mi_tx input").val(updated_mins);
			}

			function change_meri(cur_ele, direction) {
				var cur_cli = "meridian";
				var ele_st = 0;
				var ele_en = 1;
				var cur_mer = null;
				cur_mer = ele_next.find("." + cur_cli + " .mer_tx input").val();
				var updated_mer = cur_mer;
				if ((cur_ele && cur_ele.hasClass('action-next')) || direction === 'next') {
					if (cur_mer == "AM") {
						updated_mer = "PM";
					} else {
						updated_mer = "AM";
					}
				} else if ((cur_ele && cur_ele.hasClass('action-prev')) || direction === 'prev') {
					if (cur_mer == "AM") {
						updated_mer = "PM";
					} else {
						updated_mer = "AM";
					}
				}
				// Check new time against constraints
				var cur_time = Number(ele_next.find("." + cur_cli + " .ti_tx input").val());
				var cur_mins = Number(ele_next.find("." + cur_cli + " .mi_tx input").val());

				var raw_val = null;

				raw_val = (settings.show_meridian && updated_mer == 'PM') ? (Number(cur_time) + 12).toString() : cur_time;
				raw_val += ':';
				raw_val += cur_mins;

				var correct_value = validate_against_time_constraints(raw_val).split(':');
				if(correct_value[0] == cur_time) {
					updated_mer = cur_mer;
				}

				ele_next.find("." + cur_cli + " .mer_tx input").val(updated_mer);
			}

			// handle clicking on the arrow icons
			var cur_next = ele_next.find(".action-next");
			var cur_prev = ele_next.find(".action-prev");
			$(cur_prev).add(cur_next).on("click", function() {
				var cur_ele = $(this);
				if (cur_ele.parent().attr("class") == "time") {
					change_time(cur_ele);
				} else if (cur_ele.parent().attr("class") == "mins") {
					change_mins(cur_ele);
				} else {
					if(settings.show_meridian){
						change_meri(cur_ele);
					}
				}
			});

		});
	};

}(jQuery));
