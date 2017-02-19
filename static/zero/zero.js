//var baseUrl = 'http://127.0.0.1:8000/';
var baseUrl = 'http://www.connshelldev.com:8000/';

var target_id = '';

var cube_selected = '';
var pre_con_selected = '';

var modal_mode = '';

var user_id = '1';


//**************************************************************************************************************
//### COMMON FUNCTION
//session 
var doSession = function(psession_type, data){
	//alert(psession_type);
	//alert (data);
	
	if(psession_type='cube')
		$.session.set('cube_id', data);
	else if (psession_type='shell')	
		$.session.set('shell_id', data);
	
	console.log(data);
	console.log(psession_type);
	
	//session setting
	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/session',
		data:{target:data, session_type:psession_type},
		success:function(data){
			console.log('##server session setting success');
			return true;
		},
		error:function(){
			console.log('##server session setting error!!!!');
			return false;
		}
	});
};	

//**************************************************************************************************************

var doCheckLogin = function(){
	alert('test');
};

var doLogin = function(){

};

var doAppend = function(){
	alert('doAppend called');
};

var doAddcon = function(){
    //$(".shell_content").off("click");
    //alert("icon click");
    //$(".shell_content").bind("click", doAppendArea);
};


//**************************************************************************************************************
//#### shell Area Click event
var doShellModal = function(){
	console.log('modal open evnet');
};

//**************************************************************************************************************
//#### shell Area function
var doAppendMeta = function(event){
	
	console.log('content test');
	var new_target_id = $(this).find('#shell_id').attr("value") + '_' + $(this).find('#cube_id').attr("value");

	//alert ('old id : ' + target_id +  ',  new id : '+ new_target_id);	
	
	if(target_id != new_target_id)
	{
		var connect = '#connect_'+ new_target_id;
		var old_connect = '#connect_'+ target_id;
		$(connect).toggle();
		$(old_connect).toggle();
	} 
	else 
	{
		target_id = new_target_id;
		var connect = '#connect_'+ target_id;
		$(connect).toggle();
	}
	
	
	if( $('#Ncube_shell').length == 0 ) 
	{

		$(connect).append('<span class="addAction" id="Ncube_shell">create shell with new cube</span> / <span class="addAction" id="Ecube_shell">create shell with exist cube</span>');
		
		$(connect).find('#Ncube_shell').bind("click", doModalNcubeCreate);
		$(connect).find('#Ecube_shell').bind("click", doModalEcubeCreate);
		
		//추가 액션에 대한 정의 제거 필요
		$(connect).append('<span class="glyphicon glyphicon-align-left" aria-hidden="true" id="shell_act_1" value =' + target_id + '></span>');	
		$(connect).append('<span class="glyphicon glyphicon-plus" id="shell_act_2"></span>');
		
		$(connect).find('#shell_act_1').bind("click", doModalOpen);
		$(connect).find('#shell_act_2').bind("click", doAddCon);
		
		target_id = new_target_id;
	}
	else
	{
		$('#Ncube_shell').remove();
		$('#Ecube_shell').remove();

		$('#shell_act_1').remove();
		$('#shell_act_2').remove();
			
		if(target_id != new_target_id)
		{
		
			$(connect).append('<span class="addAction" id="Ncube_shell">create shell with new cube</span> / <span class="addAction" id="Ecube_shell">create shell with exist cube</span>');
		
			$(connect).find('#Ncube_shell').bind("click", doModalNcubeCreate);
			$(connect).find('#Ecube_shell').bind("click", doModalEcubeCreate);
			
			$(connect).append('<span class="glyphicon glyphicon-align-left" aria-hidden="true" id="shell_act_1" value =' + target_id + '></span>');
			$(connect).append('<span class="glyphicon glyphicon-plus" id="shell_act_2"></span>');
			
			$(connect).find('#shell_act_1').bind("click", doModalOpen);
			$(connect).find('#shell_act_2').bind("click", doAddCon);
			
			target_id = new_target_id;
		}
		else
		{
			target_id = 0;	
		}
	}
	
	//session setting
	var pshell_id = $(this).find("#shell_id").attr("value");
	$.session.set('shell_id', pshell_id );
	
	$.ajax({
		type:"POST",
		url:baseUrl + 'intershell/zero/session',
		data:{target:pshell_id, session_type:'shell'},
		success:function(data){
			console.log('##server session setting success');			
		},
		error:function(){
			console.log('##server session setting error!!!!');
		}
	});
	
	
};

var doModalNcubeCreate = function(event){
	modal_mode = 'SC2';
	
	window.location.href = baseUrl + 'intershell/zero/create/';
	
	//$('#shell_create_modal').modal('show');
};

var doModalEcubeCreate = function(event){
	modal_mode = 'SC1';
	$('#shell_create_modal').modal('show');
};


//###############################################################################################################################################

var doTargetShell = function(e){
	$(".select").removeClass("select");
	$(e.currentTarget).addClass("select");
	
	var test = $(".select").attr("value");
	var target_id_group = test.split("_");
	//pre_con_selected = $(".select").attr("value");
	
	var ppcube_id = target_id_group[0];
	var ppcon_id = target_id_group[1];
	
	$("#target_shell_location").remove();
	
	var target_guide = $("#target_shell_clone").clone();
	$(target_guide).attr("id", "target_shell_location");
	console.log(target_guide);
	
	$(e.currentTarget).after(target_guide);
	
	//alert (ppcube_id);
	//alert (ppcon_id);
	
	cube_selected = ppcube_id;
	pre_con_selected = ppcon_id;
	
	console.log('cube_selected :');
	console.log(cube_selected);
	console.log('pre_con_selected :');
	console.log(pre_con_selected);
	
	
};

var doCubeList = function(e){
	user_id = 6;
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/cubelist/',
   		data:{puser_id:user_id},
   		//dataType: "JSON",
   		success:function(data){
           	//alert('success');
           	//$(e.currentTarget).find('#shell_create_modal_body').append(data);
           	$("#existCube").append(data);  
           	$("li .cube-list").bind('click', doAppendShell );
        },
        error:function(){
            alert('error Modal open to retrieve cube');
        }
   	});
};

var doCubeShellList = function(e){
	//alert($(this).attr("value")  );
	//$(this).append("<ul><li>test list</li></ul>");
	
	var cube_id = $(this).attr("value");
	
	//console.log( "###" + $("#shell_selected").attr("value") ) ;
	//console.log("###" + $(e.currentTarget).attr("value"));
	
	if( $(e.currentTarget).next('#cube_shell_list').length ==0 )
	{
		
		$.ajax({
	   		type: "POST",
	   		url:baseUrl+'intershell/zero/shell/',
	   		data:{cube_id:cube_id},
	   		//dataType: "JSON",
	   		success:function(data){
	           	console.log('### doShellCube : success');
	           	
	           	$(e.currentTarget).after('<ul class="cube-shell" id="cube_shell_list"></ul>');
				$(e.currentTarget).next("#cube_shell_list").append('<hr>');

							
				$.each(data, function(i, item) {
			    	console.log(item.shell);
			    	$(e.currentTarget).next("#cube_shell_list").append('<li id="' + item.shell_id + '" class= "ui-state-default" value="'+ item.cube_id + '_'+ item.con_id   +'">'+ item.shell + '</li>');
			    	$(e.currentTarget).next("#cube_shell_list").find("#" + item.shell_id).bind("click", doTargetShell);
			  	});
			  	$(e.currentTarget).next("#cube_shell_list").append('<hr>');
			  	
			  	cube_selected =  $(e.currentTarget).attr("value");
	        },
	        error:function(){
	            console.log('### doCubeShellList : error');
	        }
	   		
	   }); 
	}
	else
	{
		$(e.currentTarget).next("#cube_shell_list").remove();
	}
};



//**************************************************************************************************************
//modal action

var doModalOpenEvent = function(e){
	var target_id_group = target_id.split("_");	
	alert('doModalOpenEvent--bbb20160702');
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/cubeL/',
   		data:{user_id:user_id},
   		//dataType: "JSON",
   		success:function(data){
           	//alert('success');
           	$(e.currentTarget).find('#shell_create_modal_body').append(data);
           	//$(".modal-cube-list").bind('click', doModalCubeShell );

           	
        },
        error:function(){
            alert('error Modal open to retrieve cube');
        }
	   		
   	});
		

   	//$("#cube_test").bind('click', doModalCube );
   	
   	//$(".modal_cube_list").bind('click', doModalCube);
   	
   	//$("#modal_body").bind('click', doModalCube );
   	
   	//populate the textbox
   	//$(e.currentTarget).find('#shell_modal_text').val('new test');
   	//$(e.currentTarget).find('#modal_body').append('<p> this is html append</p>');
   	
};

var doModalCubeShell = function(e){
	//alert($(this).attr("value")  );
	//$(this).append("<ul><li>test list</li></ul>");
	
	var cube_id = $(this).attr("value");
	
	console.log(target_id);
	
	//console.log( "###" + $("#shell_selected").attr("value") ) ;
	//console.log("###" + $(e.currentTarget).attr("value"));
	
	if( $(e.currentTarget).next('#cube_shell_list').length ==0 )
	{
		$.ajax({
	   		type: "POST",
	   		url:baseUrl+'intershell/zero/shell/',
	   		data:{cube_id:cube_id},
	   		//dataType: "JSON",
	   		success:function(data){
	           	console.log('### doModalCube : success');
	           	
	           	$(e.currentTarget).after('<ul class="cube-shell" id="cube_shell_list"></ul>');
				
				$.each(data, function(i, item) {
			    	console.log(item.shell);
			    	$(e.currentTarget).next("#cube_shell_list").append('<li id="' + item.shell_id + '" value="'+ item.con_id   +'">'+ item.shell + '</li>');
			    	$(e.currentTarget).next("#cube_shell_list").find("#" + item.shell_id).bind("click", doSelectShell);
			  	});
			  	
			  	cube_selected =  $(e.currentTarget).attr("value") ;
			  
	        },
	        error:function(){
	            console.log('### doModalCube : error');
	        }
	   		
	   	});
	}
	else
	{
		$(e.currentTarget).next("#cube_shell_list").remove();
	}
	
};

var doSelectShell = function(e){
	$(".select").removeClass("select");
	$(e.currentTarget).addClass("select");
	
	pre_con_selected = $(".select").attr("value");
	
	console.log( pre_con_selected );
};

var doModalSave = function(){
	var cube_id = 1; 
	console.log('domodal save');
	var target_id_group = target_id.split("_");
	pre_con_id = pre_con_selected;
	target_shell_id = target_id_group[0];
	
	console.log('cube_id : '+ cube_selected + ', source_shell_id : ' + target_shell_id + ', user_id : ' + user_id + ', pre_con_id : ' + pre_con_id  );
	
	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/addcon/',
   		data:{cube_id:cube_selected, source_shell_id: target_shell_id, user_id:user_id, pre_con_id:pre_con_id },
   		dataType: "JSON",
   		success:function(data){
           	//alert('success');
			
           	//target_id reset
			//target_id='';
        },
        error:function(){
            alert('error');
        }
   	});
   	
};

var doModalCloseEvent = function(e){
	$(e.currentTarget).find('#sub_single_cube').remove();
};


//**************************************************************************************************************
// META data function 

//var hoverHTMLUser;

var doHovercardUserIn = function(){
	console.log('hover test');
		    	
	var user_id=3; //$(this).attr("value");
	 	
	alert (user_id);
		    	
	$.ajax({
		type: "POST",
		url:baseUrl+'intershell/zero/hoveruser/',
   		data:{user_id:user_id},
   		//dataType: "JSON",
   		success:function(data){
			//hoverHTMLUser = data;
			   			
           	console.log (data);
			           	
        },
        error:function(){ 
            alert('error');
        }
    });
};

var doHovercardUserOut = function(){
	alert('hover out');

};





//**************************************************************************************************************


//###삭제 예정
var doAddShell = function(){
    var shell_con_text = $("#shell_con_active").val();
    
   	$.ajax({
   		type: "POST",
   		url:baseUrl+'intershell/zero/con/',
   		data:{con_shell:shell_con_text, target_id: target_id},
   		dataType: "JSON",
   		success:function(data){
           	//alert('success');
           	doAppendShell();
           	
           	//target_id reset
			target_id='';
           	//$("#ajax_data").css('color', 'red');  
        },
        error:function(){
            alert('error');
        }
   	});
   	
 };
 
var doAppendShell = function(){
	//add shell to list
};

var doAddCon = function(){
	alert('add connection modal ');
};







