TimePicki
=========

Timepicki - free Time picker jquery plugin, it is simple and clean timepicker so user can understand to set time for your project in input forms.

Reason to make : I have tried to search set timepicker for one of the form page, this type of timepicker only on boostrap framework as bootsstrap-timepicker, but if we use that plugin then also need to use bootstrap css and js, so that will conflict
our own code css and some time make js conflict issue, that why i make it simple, so you can use easily with jquery library 1.x and 2.x too, if you find any issue or need any additional features in this plugin , kindly reach me on my mail(I mentioned on bottom of the page)


How to use
==========

- 1)Include jquery plugin and TimePicki Plugin
- 2)call Timepicki function with input element selector

```html
<script src="js/jquery.js"></script>
<script src="js/timepicki.js"></script>
<script>
  $(document).ready(function(){
    $(".time_element").timepicki();
  });
</script>
```

- 3)put html code in body tag like below:
```html
<input type="text" name="timepicker" class="time_element"/>
```        

- 4)also put css fiel
```html
<link rel="stylesheet" type="text/css" href="css/timepicki.css">
```
features and options
====================
if you need to know about timepicki features and options to [Click here](http://senthilraj.github.io/TimePicki/)
## Demo

###[Click to see Demo](http://senthilraj.github.io/TimePicki/)


## Download

### Download [Timepicki zip archive](https://github.com/senthilraj/TimePicki/archive/master.zip)

## Time constraints

This modified version of TimePicki includes support for arbitrary time constraints. You can enable them like any other options of TimePicki. This feature is INDEPENDENT from the minimum and maximum hour option and is applied over it. These constraints have to be written in 24-hour format. Any change that violates these constraints is either increased/reduced to the constraint value or, in case of stepping the time up/down, not applied at all. To enable the any of those constraints, follow the example below.

```javascript
    $('#object-selector').timepicki({min_time_constraint: "9:00"});
    $('#object-selector').timepicki({max_time_constraint: "17:45"});
```

To disable any of the constraints, simply set it to null.

```javascript
    $('#object-selector').timepicki({min_time_constraint: null});
    $('#object-selector').timepicki({max_time_constraint: null});
```

### A word of warning

The changes make direct keyboard input really messed up when time constraints are enabled. However, the values entered will be validated and the output as well as the inputs after closing and opening TimePicki again will remain correct. Bear in mind that using the arrow controls is the preferred method of inputting time in this version.

Have fun!

Phitherek_ (phitherek@gmail.com) - author of the feature.

About me
========
 I am senthil and I am 23 years old designer and developer specialised in UserInterface. I am doing rich websites and creating Hybrid mobile apps, any doubts, need to make plugin or add addtional feature in this plugin feel free to catch me on Mail: senthil2rajan@gmail.com

Website: http://senthilraj.github.io/resume/

Add your Website
================

if you are using our plugin, we will add in here as plugin users with website link,
so kindly send me your website link to this MailId : senthil2rajan@gmail.com 

Thanks
