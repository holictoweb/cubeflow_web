// shell and cube core logic

/*
 * 2016-04-11 
 * core logic for cube flow
 * 
 * 
 * 
 * 
 */

var baseUrl = 'http://www.connshelldev.com:8000/';
//var baseUrl = 'http://www.cubeflow.net/';
var cube_selected = '';
var pre_con_selected = '';
var seleted_shell_html = '';


//################################################################################################################
/*var doAutoTest = function(){
	
	var search_type = "A";
	
	
	var search_keyword = $("#auto_test").val();
	
	//console.log(search_keyword);
	$.ajax({
		type: "POST",
	   	url:baseUrl+'intershell/zero/search/',
	   	data:{"search_type":search_type, "search_keyword":search_keyword},
	   	dataType: "JSON",
	   	success:function(data){
	       	$(".uk-autocomplete").source(data);
	       	},
	    error:function(){
	    	alert('autocomplete error');
	    }
	});
};*/
//################################################################################################################
// Common module 
var doClearModule = function(target_module){
	$('#' + target_module).remove();
	$('#' + target_module+'_css').remove();
	$('#' + target_module+'_script').remove();
};

var doHideModule = function(target_module){
	$('#' + target_module).css("visibility","hidden");
};

// ### do reload static (script)

var doStaticReload = function(module){
	var module_html= module + '_static.html';
	var module_script= '#'+ module + '_script';
	var module_css= '#' + module + '_css';

	$.ajax({
		type: "GET",
	  	url:baseUrl+'intershell/html/' + module_html,
	   	//dataType: "JSON",
	   	success:function(data){
			$(module_script).remove();
			$(module_css).remove();

	       	$("head").append(data);
	    },
	    error:function(){
	        alert('static file load error!! ');
	    }
	});
};

//################################################################################################################
// top control 
//################################################################################################################


//################################################################################################################
//Click Event 

// 3. connect 
var doConnectUser = function(e){
	var target_id = $(this).attr("value");
	
	var remove_target = $(this).parents("li");
	//alert(target_id);
	
	$.ajax({
		type: "POST",
	   	url:baseUrl+'intershell/zero/connect/U/',
	   	data:{"target_id":target_id},
	   	//dataType: "JSON",
	   	success:function(data){
	   			remove_target.remove();
	       		alert(data);
	       	},
	    error:function(){
	    	alert('connect user failed!');
	    }
	});
};

//################################################################################################################
// Search
// 1. search for flow and develope

var doSearch = function(event){
	var M_search_type = "T";
	var search_keyword = $("#search_keyword").val();
	
    if( !search_keyword ){//hash tag click
		search_keyword = $(this).attr("value");
	}

	if ( search_keyword ){
		$.ajax({
			type: "POST",
		   	url:baseUrl+'intershell/zero/search/',
		   	data:{"search_type":M_search_type, "search_keyword":search_keyword},
		   	success:function(data){
		   		$(".active").removeClass("active");
				$('#li_cube').addClass("active");
		       	$("#conContent").empty();
                doClearModule("M_Cube");
                doClearModule("M_Shell");
                
		       	$("#conContent").append(data);
                doStaticReload('M_Cube');
	      		doStaticReload('M_Shell');
                        
		       	//top control change
		       	$("#conContent").css("display","block");
                
                
                search_keyword = "<span class='hashtag uk-margin-right' style='cursor:pointer'>#" + search_keyword + "</span>";
                $(".search-history").append(search_keyword);    
                
		       	},
		    error:function(){
		    	alert('doSearch error!');
		    }
		});
	}
};

var doSearchTag = function(event){
    event.stopPropagation();

    //alert ( $(event.currentTarget).html() );
    $("#search_keyword").attr("value", $(event.currentTarget).html().replace("#", ""));
    
    doSearch();
};

var doSearchMode = function(){
    $(".search-history-div").toggle();  
    $(this).toggleClass("uk-icon-chevron-down uk-icon-chevron-up");
};

// 2. search for user
var doSearchUser = function(){
	var M_search_type = "U";
	var search_keyword = $("#search_keyword").val();
	
	if ( search_keyword.length > 0  )
	{
		$.ajax({
			type: "POST",
		   	url:baseUrl+'intershell/zero/search/',
		   	data:{"search_type":M_search_type, "search_keyword":search_keyword},
		   	//dataType: "JSON",
		   	success:function(data){
		       	$("#conContent").empty();
		       	$("#conContent").append(data);
		       	},
		    error:function(){
		    	alert('doSearchUser error!');
		    }
		});
	}
};


//################################################################################################################
//### RETRIEVE shell and Cube

var doRetrieveShell = function (event, M_shell_type){
	
	var selected = $(this);
	var cube_id = selected.attr("value");
	
	if ( selected.attr("value") != 'select' )
	{
		$.ajax({
	   		type: "POST",
	   		url:baseUrl+'intershell/zero/shell/' + M_shell_type,
	   		data:{"cube_id":cube_id},
	   		//dataType: "JSON",
	   		success:function(data){

	           	selected.empty();
	           	selected.append(data);
	           	
	           	selected.removeClass("shell-div");
				selected.addClass("shell-list-div");
                
	        },
	        error:function(){
	            alert('error');
	        }
	   	});
	}
	else
	{
		event.stopPropagation();
	}
};

var doRetrieveShellList = function (target, M_shell_type){
    // ##### DEFAULT Shell retrieve logic
	var cube_id = target.attr("value");
	
    var target_list = target.find(".target-list").attr("value");
    
    
    
	$.ajax({
		type: "POST",
	  	url:baseUrl+'intershell/zero/shell/'+ M_shell_type +'/',
	   	data:{"cube_id":cube_id},
	   	//dataType: "JSON",
	   	success:function(data){
	       	//target.empty();
	       	target.append(data);

            //hash tag 
            doHashDisplay(event, target);
            
            if ( target_list.length != 0 ){
                target_list = target_list.split("_");   
                //display SHELL LIST
                target.find(".shell-li").each(function(){
                    var shell_li = $(this).attr("value");                
                    shell_li = shell_li.split("_");

                    if ( target_list.indexOf( shell_li[1] ) != -1 ){
                        $(this).addClass('shell-visible');
                        $(this).css("display", "block");
                    }else{
                        $(this).addClass('shell-hidden');
                        $(this).css("display", "none");
                    };
                });
            }else{
                target.find(".shell-li").each(function(index){
                    if (index<2){
                        $(this).addClass('shell-visible');
                        $(this).css("display", "block");
                    }else{
                        
                        $(this).addClass('shell-hidden');
                        $(this).css("display", "none");
                    }
                });  
            }
	    },
	    error:function(){
	        //alert('shell list retrieve error');
	    }
	});
};

var doShellModeShow = function( event ){
    
    if ( $(this).hasClass("show-toggle") ) {
        $(this).removeClass("show-toggle");
        
        $(this).parents(".cube-li").find(".shell-li").each(function(){
            if($(this).hasClass("shell-hidden")){
               $(this).css("display", "block");         
            }
        });
        $(this).html("close shell")
        
    }else{
        $(this).addClass("show-toggle");
        
        $(this).parents(".cube-li").find(".shell-li").each(function(){
            if($(this).hasClass("shell-hidden")){
               $(this).css("display", "none");         
            }
        });
        $(this).html("show all")
    }
};

var doChangeShellMode = function(target_cube){
//	alert ( "doChangeShellMode" );
	var flow_shell_list = [];
	flow_shell_list = target_cube.find(".shell-li")
			.map(function(){
				return $(this).find(".shell");
				})
			.get();
	
	var flow_id_list;		
	flow_id_list = target_cube.find(".shell-content")
			.map(function(){
				return $(this).attr("id");
				})
			.get();
	
	var detach_target = $(".create-target-dup").detach();
	var shell_list_html;

	for (var i=0;i < flow_shell_list.length;i++){
		shell_list_html = '<li class="uk-nestable-item create-shell-list" value="'+ flow_id_list[i] +'"><div class="uk-nestable-panel">'+ flow_shell_list[i].html() + '</div></li>';
		detach_target.find("ul").append(shell_list_html);
	}
	detach_target.prepend( target_cube.find("#cube_data").clone().html()) ;
	
	detach_target.find(".cube-add-shell").remove();
	
	detach_target.css("display","block");
	$("#conContent").prepend( detach_target );
	
};



var doShellMode = function (M_shell_type){
	var target;
	$( ".shell-div" ).each(function( index ) {
		target = $(this);
		doRetrieveShellList(target, M_shell_type);
	});
};


var doRetrieveCube = function (){
    // by Flow list one cube select 
	console.log("what the doRetrieveCube.... ");
    
	var target = $(this);
	var total_id = $(this).attr("value");
	var target_total_id = total_id.split("_");
	
	//alert (target_total_id[0]);
	if( $(this).hasClass('selected-flow') == true ){
		$(this).removeClass("selected-flow");
		$(this).parents('li').find('#M_cube').remove();
		target.parents('li').find('.flow-cube-div').css("display","none");
	}
	else{		
		$.ajax({
			type: "POST",
		  	url:baseUrl+'intershell/zero/cube/H/' + target_total_id[0] + '/',
		   	
		   	//dataType: "JSON",
		   	success:function(data){
		      	//console.log (data);	
		      	target.addClass('selected-flow');
		      	target.parents('li').find('.flow-cube').append(data);
		      	target.parents('li').find('.flow-cube-div').css("display","block");
		    },
		    error:function(){
		        alert('M_FLOW - cube retrieve error');
		    }
		});
	}
};

var doRetrieveCubeUser = function(){
    alert("doRetrieveCubeUser");

    
	window.location.href = baseUrl + 'intershell/zero/cube/U/'+ $(this).attr("value");
};

var doRetrieveCubeList = function (target_user_id, target_div){
    //for Select Cube from My Cube
    //M_modal.html
	var scroll_seq = "";
    
	$.ajax({
		type: "POST",
		url:baseUrl+'intershell/zero/cube/M/0/',
	 	dataType: "html",
	 	success:function(html){
            target_div.append(html);
            //doStaticReload('M_cube');
        },
        error:function(){
           alert(' doRetrieveCubeList - Retrive error');
        }
	});
};

var doRetrieveCubeOne = function (tcube_id, target_div ){
    
	$.ajax({
		type: "GET",
	  	url:baseUrl+'intershell/zero/cube/O/' + tcube_id + '/',
	   	//dataType: "JSON",
	   	success:function(data){
	      	//console.log (data);	 
	      	target_div.append(data);
	      	doStaticReload('M_cube');
	      	doStaticReload('M_shell');
	    },
	    error:function(){
	        alert('retrieve created cube ERROR!!');
	    }
	});
};


// Each time the user scrolls
var doInfiniteScrollCube = function() {

	var win = $(window);
	if ($(document).height() - win.height() == win.scrollTop()) {
        //$('#loading').show();
        
        var scroll_seq = parseInt( $("#cube_scroll").attr("value") );
        scroll_seq = scroll_seq +1;
        
		$.ajax({
            type: "POST",
			url:baseUrl + 'intershell/zero/cube/T/0/',
			dataType: 'html',
			data:{"scroll_seq":scroll_seq},
			success: function(html) {
                //alert(html);
                $("#cube_scroll").attr("value", scroll_seq) ;
                var append_target = $(html).appendTo(".cube-list");  
                
                append_target.find(".shell-div").each(function(){
                    var target = $(this);
                    //alert(test.html());
                    //alert( test.attr("value") );
                    doRetrieveShellList(target, 'F');
                });
                
                append_target.find(".flower-box").each(function(){
                    target = $(this);
                    doRetrieveFlower(target, $(target).attr("value"));
                });
                
                append_target.find(".tag-box").each(function(){
                    target = $(this);
                    doRetrieveExtend(target, $(target).attr("value"));
                });
                

                //$('#loading').hide();
			}
		});
    }
};

var doNotiPage = function(){
	alert("test for noti ");
};


var doHashDisplay = function(event, target_div){
    
    //alert (target_div.html());
    target_div.find(".shell").each(function( index ) {
        var shell_text = $(this).text();
        
        if(!shell_text.match(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))#/g)) { //arabic support
			shell_text = shell_text.replace(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g,'<span class="hashtag" style="cursor:pointer">#$1</span>');
		}else{
			shell_text = shell_text.replace(/#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))#(([a-zA-Z0-9]+)|([\u0600-\u06FF]+))/g,'<span class="hashtag" style="cursor:pointer">#$1</span>');
		}
        $(this).empty();
        $(this).append(shell_text);
        $(this).on("click",".hashtag", doSearchTag );
    });

};


//################################################################################################################
// ### M_Create  Module 
// SHELL CREATE total function 
//################################################################################################################

var doCreateForm = function(event){// all action when create form load
    //display mode change
    
    //alert("doCreateForm");
    
	$("#M_create_type").attr("value", "C");

    $(".M-Nav").on("click", ".nav-li", doAddFlowNav);
    
	//loaded create form
	$("#M_create_div").css("display", "block");
    $("#btnCreate").css("display", "none");
    
	//make clear cube and shell
	doClearModule('M_shell');
	doClearModule('M_cube');
	doClearModule('M_Search');
	
	//prepare create-form module to conContent
	var M_create_form = $(".M-create-form-dup").detach();
	M_create_form.removeClass("M-create-form-dup");
	M_create_form.addClass("M-create-form");
    M_create_form.find("#cube_data_dup").append("<span class='cube-title cf-article-title cube-NC' id='create_cube_dup'>create cube</span>");

	$("#mainSearch").empty();
	$("#conContent").empty();
	$("#conContent").append( M_create_form );
	

	// CUBE display
	$("#create_cube_dup").css("display", "block");
	$("#cube_data_dup").css("display", "block");
    
    
	
    //SHELL for create duplicate
	var create_target_shell_temp = M_create_form.find(".create-target-shell-li-temp").clone();
	create_target_shell_temp.addClass("create-target-shell-li");
	create_target_shell_temp.removeClass("create-target-shell-li-temp");
	create_target_shell_temp.css("display","block");
	create_target_shell_temp.find(".cf-article-lead").addClass("create-shell-dup");
	$(".M-create-form").find(".M-create-shell-ul").append( create_target_shell_temp );
	
	//edit shell
	$(".M-create-form").on("click",".create-shell", doActiveCreateShell); 
    //add remove flow target
	//$(".M-create-form").on("click",".flow-shell-select", doAddFlowNav );

	//COMMON ACTION CREATE
	$(".hide-create").css("display", "none");
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
};


var doCreateForm_old_20161013 = function(event){// all action when create form load
    //해당 flow를 위한 create form의 변경 사항을 저장 하던 부분
	$("#M_create_type").attr("value", "C");

	//loaded create form
	$("#M_create_div").css("display", "block");
    $("#btnCreate").css("display", "none");
    
	//make clear cube and shell
	doClearModule('M_shell');
	doClearModule('M_cube');
	doClearModule('M_Search');
	
	//prepare create-form module to conContent
	var M_create_form = $(".M-create-form-dup").detach();
	M_create_form.removeClass("M-create-form-dup");
	M_create_form.addClass("M-create-form");
    M_create_form.find("#cube_data_dup").append("<span class='cube-title cf-article-title' value=''  id='create_cube_dup'>create cube</span>");

	$("#mainSearch").empty();
	$("#conContent").empty();
	$("#conContent").append( M_create_form );
	

	// CUBE display
	$("#create_cube_dup").css("display", "block");
	$("#cube_data_dup").css("display", "block");
    
    
	
    //SHELL for create duplicate
	var create_target_shell_temp = M_create_form.find(".create-target-shell-li-temp").clone();
	create_target_shell_temp.addClass("create-target-shell-li");
	create_target_shell_temp.removeClass("create-target-shell-li-temp");
	create_target_shell_temp.css("display","block");
	create_target_shell_temp.find(".cf-article-lead").addClass("create-shell-dup");
	$(".M-create-form").find(".M-create-shell-ul").append( create_target_shell_temp );
	
	//edit shell
	$(".M-create-form").on("click",".create-shell", doActiveCreateShell);
    //add remove flow target
	//$(".M-create-form").on("click",".flow-shell-select", doAddFlowNav );

	//COMMON ACTION CREATE
	$(".hide-create").css("display", "none");
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
};

var doCreateFormLiRemove = function(){
	var create_shell_li_count = $('.create-shell').length; // add create-shell-dup count	
	//alert ( create_shell_li_count );
	
	if( create_shell_li_count == 2 ){
		if ( $(this).siblings("span").hasClass("create-shell-dup") ){
			$('.create-shell').first().addClass("create-shell-dup");	
			$("#new_shell").val("");
			$(".highlighter").empty();
		} 
		$(this).siblings("span").empty();
	}
	else{
		$(this).parents("li").remove();	
		
		if ( $(this).siblings("span").hasClass("create-shell-dup") ){
			//$( "ul li:nth-child(2)" ) ref : https://api.jquery.com/nth-child-selector/
			$('.create-shell:eq(1)').first().addClass("create-shell-dup");	
			
			$("#new_shell").val("");
			$(".highlighter").empty();
			
			$(".highlighter").html( $(".create-shell-dup").html() );
			$("#new_shell").val( $(".create-shell-dup").text() );
		} 
	}
};


 var doAddShell = function(event){

 	//alert("doMCreateForm");
	$("#M_create_type").attr("value", "C");

	//loaded create form
	$("#M_create_div").css("display", "block");
    $("#btnCreate").css("display", "none");

 	$(this).parents(".sticky-cube").removeClass("uk-active");
 	$(this).parents(".sticky-cube").removeAttr("style");
	var target_cube_html = $(this).parents(".sticky-cube").clone().wrapAll("<div/>").parent().html();

 	var target_shell_li_html = $(this).parents(".cube-li").find(".shell-ul").html();

	//duplicate and add conContent the M-create-form
	var M_create_form = $(".M-create-form-dup").detach();
	M_create_form.removeClass("M-create-form-dup");
	M_create_form.addClass("M-create-form");

	$("#mainSearch").empty();
	$("#conContent").empty();
	$("#conContent").append( M_create_form  );

	M_create_form.find(".M-create-cube").append( target_cube_html );
    M_create_form.find(".M-create-cube").find(".cube-title").addClass("cube-MC");
	M_create_form.find(".M-create-shell-ul").append( target_shell_li_html );

	doMoreShell();

	$(".hide-addshell").css("display","none");
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
    
    $("input[name=radio_cube][value=MC]").attr("checked", true);
 }


var doChangeCreateMode = function(type){
	$("#M_create_type").attr("value", type);
	
	if( type == "A"){//addshell
		$(".cube-create-div").css("display", "none");
		//alert ( $("#M_create_type").attr("value") ) ;
	}else if (type =="C"){
		
	}
};

//shell create option 
var doCubeRadio = function() {
    var checked = $('input:radio[name="radio_cube"]:checked').val();
    if ( checked  == 'NC') {
        $(".new-cube-div").css("display", "block");
		$("#cube_data_dup").css("display", "block");
        $(".cube-data").css("display","none");
    }
    else if ( checked  == 'MC') {
        $(".new-cube-div").css("display", "none");
        $("#cube_data_dup").css("display", "none");
        $(".cube-data").css("display","block");
        
        var modal = UIkit.modal("#modal_MC");
        modal.show();
    }
};

var doShellRadio = function(){
    var checked =$('input:radio[name="radio_shell"]:checked').val();
    
	if (checked == 'NS') {
		$(".new-shell-div").toggle();
    }
    else if (checked == 'AC') {
        $(".new-shell-div").toggle();
        //alert ($("#M_cube").length );
        
        // target shell remove 
    }
};

var doTargetRadio = function(){
	console.log('target radio selected');
};

var doCubeCheck = function(event){
	var target_cube_li = $(this).parents(".cube-li")
	$(".M-create-cube").css("display", "block");
	$(".M-create-cube").empty();

    var target_cube_html = $(this).parents(".sticky-cube").clone().wrapAll("<div/>").parent().html();
    
    
    
    $(".M-create-cube").append( target_cube_html );
	doRetrieveShellList( target_cube_li.find(".shell-div") ,'F');

	$(".M-create-cube").find(".radio-cube-check").css("display", "none");
    $(".M-create-cube").find(".cube-title").addClass("cube-MC");
    
    //alert ($( "input:checked" ).val());
	//$(".hide-addshell").css("display","none");
};


var doActiveCreateShell = function(event){
	event.stopPropagation();
	
	var target_shell = $(this).clone(); 
	if ( $(this).find(".create-shell-dup") == false ){
		$(".create-shell-dup").removeClass("create-shell-dup");
		$(this).find(".create-shell").addClass("create-shell-dup");
		
		$("#new_shell").val("");
		$(".highlighter").empty();
		$(".highlighter").html(target_shell.html() );
		$("#new_shell").val(target_shell.text());
	}
};

var doCheckByte = function(val){  
    var maxlength = 10;  
    var len=val.value.length;  
    var temp=val.value;  
    var bytes=0;  

    for(var k=0;k<len;k++){  
        var onechar=temp.charAt(k);  
        if(escape(onechar).length>4){  
            bytes += 2;  
        }else if(onechar!='\r'){  
            bytes+=1;  
        }  
    } 
    return bytes;  
};

var doCancelCreate = function(){
    
    $("#M_create_div").css("display", "none");
    $("#btnCreate").css("display", "block");
    
    //change visiable not shown create mode
	$(".create-hide").css("display", "block");
	
	//change topcontrol heigt ( because sticky )
	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true));
};

var doMoreShell = function(){
	$("#new_shell").val("");
	$(".highlighter").empty();

	$(".M-create-form-shell-div").find(".uk-panel").removeClass("cf-panel-box-secondary-selected");
	$(".M-create-form-shell-div").find(".uk-panel").addClass("cf-panel-box-secondary");
	$(".M-create-form").find(".cf-article-lead").removeClass("create-shell-dup");

	var create_target_shell_temp = $(".M-create-form").find(".create-target-shell-li-temp").clone();
	create_target_shell_temp.addClass("create-target-shell-li");
	create_target_shell_temp.removeClass("create-target-shell-li-temp");
	create_target_shell_temp.css("display","block");
	create_target_shell_temp.find(".cf-article-lead").addClass("create-shell-dup");
	create_target_shell_temp.find(".uk-panel").addClass("cf-panel-box-secondary-selected");
	
	$(".M-create-form").find(".M-create-shell-ul").append(create_target_shell_temp);

	//edit shell
	$(".M-create-form").on("click",".create-shell", doActiveCreateShell);
    //add remove flow target
	//$(".M-create-form").on("click",".flow-shell-select", doAddFlowNav );
};


var doTotalCreate = function(e){ // create new shell
    var dataSet = {"dataset":"Total_create"};
    var M_create_type = $("#M_create_type").attr("value");
    
    var shell_con_list = []; 
    var item;
	
	var hashtags;
	var hash;
	
	var con_shell_list;
	var con_shell_list_JSON = [];
	
	var shell_index=0;
	var con_index=0;

    var checked = $('input:radio[name="radio_cube"]:checked').val();
    
	if ( checked == "NC" ) {// CUBE or   CUBE_ID
		$.extend(dataSet, {"cube": $("#new_cube").val() } );
        alert("NC");
        
	}else if (checked =="MC"){
		$.extend(dataSet, {"cube_id": $(".M-create-form").find(".cube-MC").attr("value") } );
        alert ("MC");
	}
	
    
	$(".M-create-form").find('li').each(function(){// SHELL LIST 
		//alert ( $(this).attr("value") );
		//alert ( $(this).html() );
        con_shell_list = $(this).attr("value").split("_"); 
		
		item = {};
	    item ["shell_id "] = con_shell_list[2] ;
		//hashtags = [];
		
		if( $(this).hasClass('flow-target-shell') ){//type FLOW LI
			item["create_type"] = "F" ;
			item["source_con_id"] = con_shell_list[1];
			item["con_seq"] = ''+ con_index;
			con_index++;
			con_shell_list_JSON.push(item);
            
            
		}else if( $(this).hasClass('create-target-shell-li') ){// CREATE LI
			item["create_type"] = "C" ;
			item["con_id"] = con_shell_list[1];
			var tmp_text = $(this).find(".create-shell").html().replace(/<br\s*\/?>/mg,"\n");
                
            //http://stackoverflow.com/questions/33722415/how-to-remove-html-tags-using-javascript-and-keep-newline
            //strip html 
            
            var tmp = document.createElement("DIV");
            tmp.innerHTML = tmp_text;
            tmp_text = tmp.textContent || tmp.innerText;
            item["shell"] = tmp_text;
            
			item["shell_seq"] = ''+shell_index;
			item["con_seq"] = ''+con_index;
			shell_index++;
			con_index++;
			con_shell_list_JSON.push(item);
            
		}else if ( $(this).hasClass('create-target-shell-li-temp') ){// temp LI
			//nothing
		}else{// EXIST CUBE change LI
			item["create_type"] = "E" ;
			item["con_id"] = con_shell_list[1];
			con_shell_list_JSON.push(item);
		}
	}); 
	
	$.extend(dataSet, {"con_shell_list" : con_shell_list_JSON }) ;
	
	//alert ( JSON.stringify( con_shell_list_JSON ) ) ;
	//alert ( JSON.stringify( dataSet ) ) ;

	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/createCRUD/',
   		data:JSON.stringify( dataSet ) ,
   		dataType: "JSON",
   		success:function(data){
 
           	UIkit.notify(data.status, {status:'success'});
           	$("#new_cube").val("");
           	$("#new_shell").val("");
           	//loaded create form
			$("#M_create_div").css("display", "none");
			$("#btnCreate").css("display", "block");

			var M_create_form_temp = $("#conContent").html();

			$("#conContent").empty();

			$(".create-target-dup-group").append( M_create_form_temp );
			$(".M-create-form").addClass("M-create-form-dup");
			$(".M-create-form").removeClass("M-create-form");
			$(".M-create-form-dup").find(".create-target-shell-li").remove();

           	doRetrieveCubeOne(data.cube_id, $("#conContent") );
            
           	doStaticReload('M_cube');
	      	doStaticReload('M_shell');

           	$("#conContent").css("display","block");
           	$("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true));
        },
        error:function(){
            alert('doTotalCreate - view CRUD failed - ajax error');
        }
   	});
   	
};

var doQuickCreate = function(){
	//develope after day
	var shell_con_list = [];
	shell_con_list = $(".quick-create")
				.map(function(){
				return $(this).attr("id");
				})
				.get();

	var con_list;
	var con_list_JSON="";
	for(var i=0 ; i < shell_con_list.length; i++){
		con_list = shell_con_list[i].split("_");
		if(i != 0){
			con_list_JSON = con_list_JSON + ',';
		}
		con_list_JSON = con_list_JSON + con_list[0];
	}
	
	var con_list_object ={
		con_list: con_list_JSON 
	};
	
	var modal_cube;
	if ( $("#modal_cube").val() == '' ){
		modal_cube = $("#modal_cube").attr("placeholder");
	}else{
		modal_cube = $("#modal_cube").val();
	}
	
	var dataSet = {"dataset":"Quick_create"};
	$.extend(dataSet, {"cube": modal_cube} );
	$.extend(true, dataSet,  con_list_object );
	
	//alert(JSON.stringify( dataSet ));
	
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/createCRUD/',
   		data:JSON.stringify( dataSet ),
   		dataType: "JSON",
   		success:function(data){
   			UIkit.notify(item.status, {status:'success'});
           	$.each(data, function(i, item) {
           		//alert( item.cube_id);
           	});
        },
        error:function(){
            alert('doQuickCreate - ajax error');
        }
   	});				 
	
};

//################################################################################################################
// SELECT SHELL CUBE
//################################################################################################################
var doSelectShell = function(event){
    
    //selected shell 
    var selected_total_id = $(this).attr("value");
    var meta_id = '#meta_'+selected_total_id;

    selected_total_id = '#'+selected_total_id;
    
    if( $(".M-Nav").find(selected_total_id).length >0  ){
        doRemoveNav(event);
    }else{
        doAddNav(event);
    }
    
    if( $(meta_id).length > 0 ){
        $(meta_id).remove();
    }else{
        doMetaShellArea(event);
    }

    if  ( $(this).hasClass("shell-selected") ){
        $(this).removeClass("shell-selected");
        $(this).find("#shell_action").css("visibility","hidden");
        $(this).css("background-color","");
        
    }else{
    	$(this).addClass("shell-selected");        
        $(this).find("#shell_action").css("visibility","visible");
        $(this).css("background-color","#e1e8ed");
    }
};

var doRetrieveSelectShell = function(event){
    //alert ("doRetrieveSelectShell");
    
    $("#M_Cube").find(".shell-li").each(function(){
        $(this).removeClass("shell-selected")
        $(this).find("#shell_action").css("visibility","hidden");
    });
    
    var nav_shell_list = [];
	nav_shell_list = $(".nav-ul").find(".nav-li")
			.map(function(){
				return $(this).attr("id");
				})
			.get();
    
    var target_shell_id;
    var target_div;
    for (var i=0;i < nav_shell_list.length;i++){
		target_shell_id = '#' + nav_shell_list[i];
        target_div = $("#conContent").find(target_shell_id);
        target_div.addClass("shell-selected");
        target_div.find("#shell_action").css("visibility","visible");
        target_div.css("background-color","#e1e8ed");
	}
};

var doMetaShellArea = function(event){
    //doCloseMetaShellArea();    
     
    var target_shell =  $(event.currentTarget);
    var target_cube = $(event.currentTarget).parents(".cube-li");
    
    var meta_id =  $(event.currentTarget).attr("value");
    var meta_total_id = meta_id.split("_");
    
    meta_id = 'meta_' + $(event.currentTarget).attr("value");
    
    var div_overlay = '<div class="overlay-div  uk-panel cf-panel-box cf-panel-box-secondary-selected" id="' + meta_id + '" ></div>';
    
    $("#conContent").append(div_overlay);
    meta_id = "#"+meta_id;
    
    $(meta_id).css("position", "absolute" );
    $(meta_id).offset({ top : target_shell.offset().top + target_shell.height() + 5 , left: target_cube.offset().left - 5  });
    $(meta_id).css("width", target_cube.width() );
    
    $.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/flow/S/'+ meta_total_id[0] + '/' + meta_total_id[2] + '/' ,
		data:{"scroll_seq":"0"},
		success:function(data){
			$(meta_id).append(data);
            //$(meta_id).css("display", "block");
            
		},
		error:function(){
			alert('## error shell MetaArea !!! ##');
		},
	});	
};

var doCloseMetaShellArea = function(){
    $(".overlay-div").remove();
};

var doMetaShellArea_20161027 = function(event){
    
    var this_offset =  $(event.currentTarget).parents(".cube-li").offset();   
    
    
    alert ( $(event.currentTarget).parents(".cube-li").height() );
    
    var meta_id =  $(event.currentTarget).attr("value");
    var meta_total_id = meta_id.split("_");
    meta_id = 'meta_' + $(event.currentTarget).attr("value");
    
    var div_overlay = '<div class="test-overlay absolute uk-panel cf-panel-box cf-panel-box-secondary" id="'+meta_id+'" ></div>';
    $("#conContent").append(div_overlay);
    meta_id = "#"+meta_id;
    
    
    var meta_width = 300;
    
    if ( this_offset.left > meta_width ){
        $(meta_id).offset({ top : this_offset.top, left:this_offset.left-meta_width - 25  });
        $(meta_id).css("width", meta_width );
    }else{
        $(meta_id).offset({ top : this_offset.top, left:30 });
        $(meta_id).css("width", this_offset.left - 56 );
    }
    
    $.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/flow/S/'+ meta_total_id[0] + '/' + meta_total_id[2] + '/' ,
		data:{"scroll_seq":"0"},
		success:function(data){
            //alert (data);
			$(meta_id).append(data);
		},
		error:function(){
			alert('## error shell MetaArea !!! ##');
		},
	});	
    
}
var doSelectCube = function(event){
    
	if( $(this).hasClass("cube-selected") ){
        $(this).find(".non-target-list").css("display", "none");
		$(this).removeClass("cube-selected");
	}else{
        $(this).find(".non-target-list").css("display", "block");
		$(this).addClass("cube-selected");
	}

	event.stopPropagation();
};

//####################################################################################################
//Navigation
//####################################################################################################

var doAddNav = function(event){
    var target_id = $(event.currentTarget).attr("id");
    var target_text = $(event.currentTarget).find(".shell-text").html();
	var target_scroll = $(event.currentTarget).attr("id");
	var show_text ="";
	var showChar = 40;
    var target_type = "" ;
    
    if ( $(event.currentTarget).hasClass("shell-li") ){
        target_type = "S";
    }else if( $(event.currentTarget).hasClass("hashtag") ) {
        target_type = "H";
    }
    
	if(target_text.length > showChar) {
        show_text = target_text.substr(0, showChar);

    }else{
        show_text = target_text;
    }
	var scroll_offset =  $("#M_TopControl").outerHeight(true) + 62;
    
    //### flow nav 
	var target_html =  "<li class='nav-li uk-nestable-item' id="+ target_id +" value = '" + target_type  +"'  ><span><a class='uk-icon-hover uk-icon-external-link modal-cube-link uk-margin-left' value='"+target_id+ "'></a><a class='uk-icon-hover uk-icon-close cf-M-nav-close'></a></span><span class='shell-tooltip' data-uk-tooltip=\"{pos:'bottom-left',delay:'1000', animation:''}\" title='"+ target_text +
		"' value='"+ target_text +	"' ><a href='#"+ target_scroll + "'  value='" + target_id + "' data-uk-smooth-scroll=\"{offset:"+  scroll_offset  +"}\">" + show_text + "</a></span></li>";
    
    $(".nav-ul").append(target_html);    
    
    $.session.set('nav_act_html', $("#nav_ul").html() );
};

var doRemoveNav = function(event){
	var target_id;
	var target_div;
    
	if( $(event.currentTarget).hasClass('cf-M-nav-close')  ){
		target_id = $(event.currentTarget).parents("li").attr("id");
		$(event.currentTarget).parents("li").remove();
		
        target_div = $("#M_Cube").find("#" + target_id + "");
        
        if ( target_div.find(".uk-icon-check-square") ){
            target_div.removeClass("shell-selected");
            $(this).find("#shell_action").css("visibility","hidden");
            target_div.css("background-color","");
        }
	}else{
		target_id = $(event.currentTarget).attr("id");
		$("#M_Nav").find("#"+target_id+"").remove();
	}
    
     $.session.set('nav_act_html', $("#nav_ul").html() );
};

var doAddFlowNav = function(event){
	//NAV to Create Form
	//M-create-form Flow

    event.stopPropagation();

    if( $(this).attr("value") == "S" ) {
    	var total_id_list = $(this).attr("id");

        var shell_text = $(this).find(".shell-tooltip").attr("value");
		var target_html = "<li class='flow-target-shell uk-nestable-item' value='" + total_id_list + "' ><span class='shell'>" + shell_text + "</span><a class='uk-icon-hover uk-icon-close'></a></li>" 
        $(".M-create-shell-ul").append( target_html );
    }
       
}

var doSaveNav = function(event){
    
    var dataSet = {};
    
    var nav_list;
	var nav_list_JSON = [];
    
    
    $(".nav-li").each(function(){
        //type shell 
        nav_list = $(this).attr("id").split("_"); 
        
        item = {};
        item["target_type "] = $(this).attr("value");
	    item["target_id "] = nav_list[1] ; //con_id target is shell 
        item["html"] = $(this).clone().wrapAll("<div/>").parent().html();
        
        nav_list_JSON.push(item);
    });

    if ( nav_list_JSON.length === 0  ){
        UIkit.notify("nothing to save!!", {status:'danger'}); 
        return;
    }
    
    if ( $(".new-nav").val().lenth == 0 ) {
        UIkit.notify("nav name is empty", {status:'danger'});
        return 
    }
    
    $.extend(dataSet, {"nav" : $(".new-nav").val() }) ;
    $.extend(dataSet, {"nav_list_JSON" : nav_list_JSON }) ;
    $.extend(dataSet, {"nav_id" : $(".selected-nav").attr("value") }) ;
    
    //alert ( JSON.stringify( dataSet ) ) ;
    
    $.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/nav/create/',
   		data:JSON.stringify( dataSet ),
   		dataType: "JSON",
   		success:function(data){
   			UIkit.notify(data.message, {status:'success'});
            $(".new-nav").val("");
            doEmptyNavAct();
            
            doRetrieveNav(event, 'retrieveH');
        },  
        error:function(){
            alert('doSaveNav - ajax error');
        }
   	});	
    
};

var doRetrieveNav = function(event, M_Nav_type){
    var target_user_id = $(this).attr("value"); // user clicked
    
    $.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/nav/' + M_Nav_type +'/',
   		data:{"user_id":target_user_id},
   		success:function(data){
           	if(M_Nav_type == "retrieveH"){
                $(".my-nav-ul-div").remove();
                $(".my-nav-div").append(data);
            }else if (M_Nav_type =="retrieveM"){
                $("#rsideControl").append(data);
            }
            doRetrieveSelectShell();
        },  
        error:function(){
            alert('doRetrieveNav - ajax error');
        }
   	});	
    
};


var doRetrieveMyNav = function(event){
    
};

var doRetrieveNavSession = function(event){
    if( $.session.get('nav_act_html') ){
		$("#nav_ul").empty();
		$("#nav_ul").append($.session.get('nav_act_html'));
        doRetrieveSelectShell();
	}
};

var doRetriveNavAct = function(event){
    //My Nav list CLICKED!!!
    doEmptyNavAct();
    
    $(".uk-icon-circle-o").addClass("uk-icon-circle-thin");
    $(".uk-icon-circle-o").removeClass("uk-icon-circle-o");
    
    var target_nav = $(this).siblings(".uk-icon-circle-thin");
    target_nav.removeClass("uk-icon-circle-thin");
    target_nav.addClass("uk-icon-circle-o");
    
    $(".selected-nav").removeClass("selected-nav");
    $(this).addClass("selected-nav");    
    
    $("#new_nav").attr( "value", $(this).text() );
    
    var append_html = $(this).siblings("div").text();
    
    var append_html2 = $.parseHTML(append_html);
    $(".nav-ul").append(append_html2);
    doRetrieveSelectShell();
};

var doEmptyNavAct = function(){
    
    var target_id;
    $(".selected-nav").removeClass("selected-nav");
    
    
    $(".nav-li").each(function(event){
            
        target_id = $(this).attr("id");
        
		$(this).remove();
		$("#new_nav").attr( "value", "");
        target_div = $("#M_Cube").find("#" + target_id+ "");
        target_div.removeClass("shell-selected");
        target_div.css("background-color","");
        
    });
    
    $.session.set('nav_act_html', $("#nav_ul").html() );
};


//####################################################################################################
// shell action

var doShellDetail = function(event){
    event.stopPropagation();
    
    var param_list = $(this).attr("value");
	var param = param_list.split("_");
    
    var target_shell = $(this).parents("li").find(".shell-text").text();
    
    $(".target-shell-div").empty();
    $(".target-shell-div").css("display", "block");
    $(".target-shell-div").append(target_shell);
    $(".target-sehll-div").attr("value", param_list);
    
    //stick height에 영향을 줄 수 잇는 부분 확인.
    // ##topcontrol ##cube-title
    $("#topControl").find(".uk-sticky-placeholder").css("height", $("#M_TopControl").outerHeight(true) );
};


var doShellDetailModal = function(event){
    event.stopPropagation();
    
    var shell_li =  $(this).parents(".shell-li").html();
    //alert ( shell_li );
    $("#modal_shell").find(".uk-modal-header").append( shell_li );
    $("#modal_shell").attr("value", $(this).attr("value") );
    
    var modal = UIkit.modal("#modal_shell");
    modal.show();
};

var doModalFlow = function(event){
    event.stopPropagation();
    //alert("doModalFlow");
    
    var shell_li =  $(this).parents(".shell-li").html();
    //alert ( shell_li );
    $("#modal_flow").find(".uk-modal-header").append( shell_li );
    
    var modal = UIkit.modal("#modal_flow");
    modal.show();
}




var doAddFlow_old_type_20161008 = function(event){
	event.stopPropagation();

	var target_id  = $(this).attr("value");

	//shell duplicate
	var target_shell = $(this).parents(".shell-content").find(".shell-dup").clone();
	var target_text = target_shell.find(".shell-text").html();

	var target_scroll = $(this).parents(".shell-content").attr("id");
	
	var showChar = 30;
	if(target_text.length > showChar) {
        var show_text = target_text.substr(0, showChar);
    	target_shell.find(".shell").html(show_text);
    }


	if ( $(this).parents(".shell-content").hasClass("selected-shell") == false ){
		$(this).parents(".shell-content").addClass("selected-shell");

		var scroll_offset =  $("#M_TopControl").outerHeight(true) + 62;
		//### flow nav 
		var target_html =  "<span class='quick-create' id='"+ target_id + "' data-uk-tooltip=\"{pos:'bottom-left'}\"  title='"+ target_text +"'><a href='#"+ target_scroll + "'  value='" +target_id + "' data-uk-smooth-scroll=\"{offset:"+  scroll_offset  + "}\">" + target_shell.html() + "</a><a class='uk-close'></a></span>";

        //alert(target_html);

		$(".flow-nav-target").after( target_html );	
		$(this).removeClass("uk-icon-check-square");
		$(this).addClass("uk-icon-check-square-o");
		
		//change shell mode 
		//M-create-form Flow
		var clone_target_shell = $(this).parents(".shell-li").clone();
		
		clone_target_shell.addClass("flow-target-shell uk-nestable-item"); 
		clone_target_shell.find(".shell-content").addClass("uk-nestable-panel");
		
		clone_target_shell.find(".flow-shell-act-div").remove();
		$(".M-create-form-dup").find(".M-create-shell-ul").append( clone_target_shell );
		$(".M-create-form-dup").find(".shell-content").removeClass("shell-content");
		
		var clone_target_shell_quick = $(this).parents(".shell-li").clone();
		$("#" + target_id ).append( clone_target_shell_quick.css("display","none") );
	}
	else {
		target_id = '#'+ target_id;
		$(this).parents(".shell-content").removeClass("selected-shell");
		
		$(".flow-nav-target").siblings(target_id).remove();
		$(this).removeClass("uk-icon-check-square-o");
		$(this).addClass("uk-icon-check-square");
		
		//dup shell remove 
		$(".M-create-form").find(target_id).remove();
		$(".M-create-form-dup").find(target_id).remove();		

	}
	
	if( $(".flow-nav").find(".quick-create").length ){
		$("#btnQuickCreateModal").css("display", "block");	
	}else{
		$("#btnQuickCreateModal").css("display", "none");
	}

	event.stopPropagation();
};


var doRemoveFlowTarget = function(event){
	event.stopPropagation();
	
	//alert (  $(this).parent("span").attr("id") );
	
	$(this).parent("span").remove();
	var target_shell = "#" + $(this).parent("span").attr("id");
	var target_shell = "#" + $(this).parent("span").attr("id");

	$(".M-create-form").find(target_shell).remove();	
	target_shell = $(".shell-ul").find( target_shell );
	
	var target_flow_add = target_shell.find(".uk-icon-check-square-o");
	target_flow_add.removeClass("uk-icon-check-square-o");
	target_flow_add.addClass("uk-icon-check-square");
	target_shell.removeClass("selected-shell");
	
	//creat button
	if( $(".flow-nav").find(".quick-create").length ){
		$("#btnQuickCreateModal").css("display", "block");	
	}else{
		$("#btnQuickCreateModal").css("display", "none");
	}
};

var doRemoveFlowTargetModal = function(event){
	
	var target_id = $(this).siblings("div").attr("value");
	target_id = "#"+target_id;
	$(this).parents("li").remove();
	$(".flow-nav").find(target_id).remove();
	
	var target_shell = $(".shell-ul").find( target_id );
	var target_flow = target_shell.find(".uk-icon-check-square-o");
	target_flow.removeClass("uk-icon-check-square-o");
	target_flow.addClass("uk-icon-check-square");
	target_shell.removeClass("selected-shell");
	
	//creat button
	if( $(".flow-nav").find(".quick-create").length ){
		$("#btnQuickCreateModal").css("display", "block");	
	}else{
		$("#btnQuickCreateModal").css("display", "none");
	}
};

var doQuickCreateModal = function(){
	var quick = [];
	quick = $(this).parent(".flow-nav").find('.quick-create').toArray();
	for (var i=0;i<quick.length;i++){
		//alert ( quick[i].innerHTML ) ;	
	}
	var modal = UIkit.modal("#modal_create");
	modal.show();
};

//#################################################################################################### 
// shell flow action
// FLOW Action

var doFlowShell = function(e){
	event.stopPropagation();
	
	param_list = $(this).parents("li").attr("value");
	param = param_list.split("_");
	//param cube_id con_id shell_id
	window.location.href = baseUrl + 'intershell/zero/create/F/0/' + param[2] + '/';
};

var doShellFlowMeta = function(event){
	
	event.stopPropagation();
	
	//alert ( $(this).attr("value"));
	var target = $(this);
	var param_list = target.parents("li.shell-li").attr("value");
	var param = param_list.split("_");
	
	if (target.hasClass("glyphicon-chevron-down") == true ){
		target.removeClass("glyphicon-chevron-down");
		target.addClass("glyphicon-chevron-up");
		
		$.ajax({
			type:"POST",
			url:baseUrl + 'intershell/zero/flow/S/'+ param[0]+'/'+ param[2] + '/',
			data:{"shell_id":$(this).attr("value")},
			success:function(data){
				target.parents('li.shell-li').find(".flow-sub-list").css("display", "block");
				target.parents('li.shell-li').find(".flow-sub-list").append(data);
			},
			error:function(){
				alert('## error retrive flow data!');
			},
		});
	}else{
		target.removeClass("glyphicon-chevron-up");
		target.addClass("glyphicon-chevron-down");
		target.parents('li.shell-li').find("#M_Flow").remove();
		target.parents('li.shell-li').find(".flow-sub-list").css("display", "none");
	}
	
	
};

var doRetrieveFlow = function(event){
	event.stopPropagation();
	window.location.href = baseUrl + 'intershell/zero/flow/S/0/' + $(this).attr("value");
};



//################################################################################################################
// SHELL META Action 


var doShellMeta = function(event){
    event.stopPropagation();
    //alert("doShellMeta");
    $(this).parents(".shell-li").find(".shell-meta-div").toggle();
    
    
    
};


//################################################################################################################
// CUBE Action 
var doCubeDetail = function(event){
	var cube_id = $(this).attr("value");
    $("#conContent").empty();
    
    doRetrieveCubeOne( cube_id, $("#conContent") );
};

var doModalCube = function(event){
    var cube_id = $(this).attr("value");
    $(".modal-cube").attr("value", cube_id);
    
    var modal = UIkit.modal(".modal-cube");
    modal.show();
}


var doCubeDetailModal = function(target){
	var Modal_cube_id = target.attr("value");
	doModalOpen( Modal_cube_id );	
};


var doRetrieveExtend = function(target, cube_id){
	//type : t  by cube
	//console.log (cube_id);


	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/extend/R/',
   		data:{"cube_id":cube_id},
   		success:function(data){
   			target.empty();
           	target.append(data);
        },
        error:function(){
            //alert('error retrive extend!');
        },
   	});
};

var doRetrieveFlower = function(target, cube_id){
	//type : U User
	//alert(cube_id);
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/flow/U/0/0/',
   		data:{"cube_id":cube_id},
   		success:function(data){
   			target.empty();
           	target.append(data);
        },
        error:function(){
            //alert('error retrive flower!');
        },
   	});
};


//################################################################################################################
// ### PROFILE  action

var doProfile = function(target, M_profile_type){
	var user_id = target.attr("value");
	
	$.ajax({
		type: "POST",
	  	url:baseUrl+'intershell/zero/profile/'+ M_profile_type +'/',
	   	data:{"cube_id":cube_id},
	   	//dataType: "JSON",
	   	success:function(data){

	       	target.empty();
	       	target.append(data);
	          
	       	target.removeClass("shell-div");
			target.addClass("shell-list-div");
	    },
	    error:function(){
	        alert('error');
	    }
	});
};

//################################################################################################################



