







//**************************************************************************************************************
// windows load finish 
jQuery(window).load(function () {
    alert('page is loaded');
    setTimeout(function () {
        alert('page is loaded and 1 minute has passed');
    }, 60000);
});



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
