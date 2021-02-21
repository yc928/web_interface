//Allows the ID to stick to the left side
$(window).load(function ()
{
  $('.box').scroll(function ()
  {
    $(this).find('.inthesmallbox2').css('left', $(this).scrollLeft());
  });
});

function NewMotionList()
{
  //creates new 'div' in the page
  var div1=document.createElement('div');
  div1.className = "inthesmallbox2";
  var div2=document.createElement('div');
  div2.className = "inthesmallbox4";

  //first column
  var input=document.createElement('input');
  input.type='text';
  input.className='textbox';
  input.style.backgroundColor='darkred';
  input.value=-1;
  div1.appendChild(input);

  //loop to create the rest of the 41 columns starting with 'Name'
  for (var i = 1; i <= 41 ; i++) 
  {  
    //odd number columns
    if (i%2==1 && i!=1) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }  
    //even numbers columns
    if (i%2==0) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }
    //second column
    if(i==1)
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=-1;
      div2.appendChild(input);
    }   
  }   
  //appends it into the MotionTable <div> in MotionControlInterface.html
  document.getElementById('MotionTable').appendChild(div1);
  document.getElementById('MotionTable').appendChild(div2);
}

function NewRelativePosition()
{
  var num=document.getElementById('RelativePositionTable').getElementsByClassName('inthesmallbox2').length+1;
  
  //creates new 'div' in the page
  var div1=document.createElement('div');
  div1.className = "inthesmallbox2";
  var div2=document.createElement('div');
  div2.className = "inthesmallbox4";

  //first column    
  var input=document.createElement('input');
  input.type='text';
  input.className = 'textbox';
  input.style.backgroundColor='darkred';
  input.id = 'relativePosition'+num;
  input.value=-1;
  div1.appendChild(input);
      
  //loop to create the rest of the 41 columns starting with 'Name'
  for (var i = 1; i <= 41 ; i++) 
  {  
    //odd number columns
    if (i%2==1 && i!=1) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }  
    //even number columns
    if (i%2==0) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }
    //second column
    if(i==1)
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=-1;
      div2.appendChild(input);
    }
  }  
  //appends them into the RelativePositionTable <div> in MotionControlInterface.html
  document.getElementById('RelativePositionTable').appendChild(div1);
  document.getElementById('RelativePositionTable').appendChild(div2);

  //sets the relativePosition ID to be the same value as relativeSpeed ID
  $('#relativePosition'+num).change(function ()
  {
    $('#relativeSpeed'+num).val($(this).val());
  });
}

function NewRelativeSpeed()
{
  var num=document.getElementById('RelativeSpeedTable').getElementsByClassName('inthesmallbox2').length+1;

  //creates new 'div' in the page
  var div1=document.createElement('div');
  div1.className = "inthesmallbox2";
  var div2=document.createElement('div');
  div2.className = "inthesmallbox4";

  //first column    
  var input=document.createElement('input');
  input.type='text';
  input.id = 'relativeSpeed'+num;
  input.className = 'textbox';
  input.style.backgroundColor='darkred';
  input.value=-1;
  div1.appendChild(input);
  
  //loop to create the rest of the 41 columns starting with 'Name'
  for (var i = 1; i <= 41 ; i++) 
  {  
    //odd number columns
    if (i%2==1 && i!=1) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=10;
      div2.appendChild(input);
    }  
    //even number columns
    if (i%2==0) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=10;
      div2.appendChild(input);
    }
    //second column
    if(i==1)
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=-1;
      div2.appendChild(input);
    }
  }
  //appends them into RelativeSpeedTable <div> in MotionControlInterface.html
  document.getElementById('RelativeSpeedTable').appendChild(div1);
  document.getElementById('RelativeSpeedTable').appendChild(div2);

  //sets the relativeSpeed ID to be the same value as relativePosition ID
  $('#relativeSpeed'+num).change(function ()
  {
    $('#relativePosition'+num).val($(this).val());
  });
}

function NewAbsolutePosition()
{
  var num=document.getElementById('AbsolutePositionTable').getElementsByClassName('inthesmallbox2').length+1;  
  
  //creates new 'div' in the page
  var div1=document.createElement('div');
  div1.className = "inthesmallbox2";
  var div2=document.createElement('div');
  div2.className = "inthesmallbox4";

  //first column    
  var input=document.createElement('input');
  input.type='text';
  input.className='textbox';
  input.style.backgroundColor='darkred';
  input.id = 'absolutePosition'+num;
  input.value=-1;
  div1.appendChild(input);

  //loop to create the rest of the 41 columns starting with 'Name'
  for (var i = 1; i <= 41 ; i++) 
  {  
    //odd number columns
    if (i%2==1 && i!=1) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }  
    //even number columns
    if (i%2==0) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=0;
      div2.appendChild(input);
    }
    //second column
    if(i==1)
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=-1;
      div2.appendChild(input);
    }
  }
  //appends them into the AbsolutePositionTable <div> in the MotionControlInterface.html
  document.getElementById('AbsolutePositionTable').appendChild(div1);
  document.getElementById('AbsolutePositionTable').appendChild(div2);

  //sets the absolutePosition ID to be the same value as absoluteSpeed ID
  $('#absolutePosition'+num).change(function ()
  {
    $('#absoluteSpeed'+num).val($(this).val()); 
  });
}

function NewAbsoluteSpeed()
{
  var num=document.getElementById('AbsoluteSpeedTable').getElementsByClassName('inthesmallbox2').length+1; 
  
  //creates new 'div' in the page
  var div1=document.createElement('div');
  div1.className = "inthesmallbox2";
  var div2=document.createElement('div');
  div2.className = "inthesmallbox4";

  //first column    
  var input=document.createElement('input');
  input.type='text';
  input.className='textbox';
  input.style.backgroundColor='darkred';
  input.id = 'absoluteSpeed'+num;
  input.value=-1;
  div1.appendChild(input);

  //loop to create the rest of the 41 columns starting with 'Name'
  for (var i = 1; i <= 41 ; i++) 
  {  
    //odd number columns
    if (i%2==1 && i!=1) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=10;
      div2.appendChild(input);
    }  
    //even number columns
    if (i%2==0) 
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=10;
      div2.appendChild(input);
    }
    //second column
    if(i==1)
    {
      var input=document.createElement('input');
      input.type='text';
      input.className='textbox';
      input.value=-1;
      div2.appendChild(input);
    }
  }
  //appends them into AbsoluteSpeedTable <div> in the MotionControlInterface
  document.getElementById('AbsoluteSpeedTable').appendChild(div1);
  document.getElementById('AbsoluteSpeedTable').appendChild(div2);
  
  //sets the absoluteSpeed ID to be the same value as absolutePosition ID
  $('#absoluteSpeed'+num).change(function ()
  {
    $('#absolutePosition'+num).val($(this).val()); 
  });
}

function Add()
{
  if(document.getElementById("MotionList").style.display == "initial")
  {
    NewMotionList();
  }
  else if(document.getElementById("RelativePosition").style.display == "initial" || document.getElementById("RelativeSpeed").style.display ==  "initial")
  {
    NewRelativePosition();
    NewRelativeSpeed();
  }
  else if(document.getElementById("AbsolutePosition").style.display == "initial" || document.getElementById("AbsoluteSpeed").style.display ==  "initial")
  {
    NewAbsolutePosition();
    NewAbsoluteSpeed();
  }
  document.getElementById('label').innerHTML = "Add is successful !!";
}

function Delete()
{
  var num = document.getElementById("chose_delete").value;
  var flag = false;
  if(document.getElementById("MotionList").style.display == "initial")
  {
    for(var i = 0; i < document.getElementById('MotionTable').getElementsByTagName('div').length; i += 2)
    {
      if(document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
      {
        document.getElementById('MotionTable').removeChild(document.getElementById('MotionTable').getElementsByTagName('div')[i]);
        document.getElementById('MotionTable').removeChild(document.getElementById('MotionTable').getElementsByTagName('div')[i]);
        document.getElementById('label').innerHTML = "Delete is successful !!";
        flag = true;
        break;
      }
    }
  }
  else if(document.getElementById("RelativePosition").style.display == "initial" || document.getElementById("RelativeSpeed").style.display == "initial")
  {
    for(var i = 0;i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length;i += 2)
	  {
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
	    {
        document.getElementById('RelativePositionTable').removeChild(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i]);
        document.getElementById('RelativePositionTable').removeChild(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i]);
        document.getElementById('RelativeSpeedTable').removeChild(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i]);
        document.getElementById('RelativeSpeedTable').removeChild(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i]);
        document.getElementById('label').innerHTML = "Delete is successful !!";
        flag = true;
        break;
      }
    }
  }
  else if(document.getElementById("AbsolutePosition").style.display == "initial" || document.getElementById("AbsoluteSpeed").style.display ==  "initial")
  {
    for(var i = 0; i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length; i += 2)
	  {
      if(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
	    {
        document.getElementById('AbsolutePositionTable').removeChild(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i]);
        document.getElementById('AbsolutePositionTable').removeChild(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i]);
        document.getElementById('AbsoluteSpeedTable').removeChild(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i]);
        document.getElementById('AbsoluteSpeedTable').removeChild(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i]);
        document.getElementById('label').innerHTML = "Delete is successful !!";
        flag = true;
        break;
      }
    }
  }
  if(flag == false)
  {
	  document.getElementById('label').innerHTML = "Delete is fail !! No this ID!!";
  }
}

function Reverse()
{
  var num = document.getElementById("chose_reverse").value;
  var flag = false;
  var n = 0;
  if(document.getElementById("MotionList").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Reverse can only execute in RelativePosition!!";
  }
  else if(document.getElementById("RelativePosition").style.display == "initial")
  {
    for(var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i += 2)
	  {
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value==num){
        n = i;
        flag = true;
        break;
      }  
    }
    if(flag == true)
	  {
      for(var j = 1; j <= 21; j++)
	    {
        var value = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value);
        document.getElementById('RelativePositionTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value = value * (-1);
      }
      document.getElementById('label').innerHTML = "Reverse is successful !!";
    }
    else
	  {
      document.getElementById('label').innerHTML = "Reverse is fail !! No this ID !!";
    }
    
  }
  else if(document.getElementById("RelativeSpeed").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Reverse can only execute in RelativePosition!!"; 
  }
  else if(document.getElementById("AbsolutePosition").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Reverse can only execute in RelativePosition!!";
  }
  else if(document.getElementById("AbsoluteSpeed").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Reverse can only execute in RelativePosition!!";
  }
}

function Copy()
{
  var num = document.getElementById("chose_copy").value;
  var flag = false;
  var n = 0;
  if(document.getElementById("MotionList").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Copy can only execute in Relative!!";
  }
  else if(document.getElementById("RelativePosition").style.display == "initial" || document.getElementById("RelativeSpeed").style.display == "initial")
  {
    for(var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i += 2)
	  {
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
	    {
        n = i;
        flag = true;
        break;
      }  
    }
    if(flag == true)
	  {
      Add();
      var num = document.getElementById('RelativePositionTable').getElementsByTagName('div').length;
      for (var j = 1; j <= 21; j++)
	    {

        var x = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value);
        var y = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value);
        document.getElementById('RelativePositionTable').getElementsByTagName('div')[num-1].getElementsByClassName('textbox')[j].value = x;
        document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[num-1].getElementsByClassName('textbox')[j].value = y;
      }
      document.getElementById('label').innerHTML = "Copy is successful !!";
    }
    else
	  {
      document.getElementById('label').innerHTML = "Copy is fail !! No this ID !!";
    }
  }
  else if(document.getElementById("AbsolutePosition").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Copy can only execute in Relative!!";
  }
  else if(document.getElementById("AbsoluteSpeed").style.display == "initial")
  {
    document.getElementById('label').innerHTML = "Copy can only execute in Relative!!";
  }
}

function CheckSum()
{
  var ID = Number(document.getElementById('CheckSumID').value);
  var flag = false;
  if(flag == false)
  {
	  for (var i = 0 ; i < document.getElementById('MotionTable').getElementsByTagName('div').length; i += 2) 
  	{
      if (document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == ID) 
      {
        var Sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 1; j <= (20 * 2); j += 2) 
        {
          if (Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j].value)) 
          {
            for (var k = 0; k < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; k += 2) 
            {
			        Number(Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[k].getElementsByClassName('textbox')[0].value));
              if (Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j].value) == Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[k].getElementsByClassName('textbox')[0].value)) 
              {
                for (var l = 1; l <= 21; l++) 
                {
                  Sum[l-1] += (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[k+1].getElementsByClassName('textbox')[l].value));
				        }
			        }
			      }
		      }
		    }     
        for (var j = 1; j <= 21; j++) 
        {
            document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "";
            document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "M" + j + ": " + Sum[j-1];
        }
		    flag = true;
        break;
      }
    }
  }
  if(flag == false)
  {
    for (var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i += 2) 
    {
      if (document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == ID) 
      {
        for (var j = 1; j <= 21; j++) 
        {
          document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "";
          document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "M" + j + ": " + (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j].value));
        }
		    flag = true;
        break;
      }
    }
  }
  if(flag == false)
  {
    for (var i = 0; i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length; i += 2) 
    {
      if (document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == ID) 
      {
        for (var j = 1; j <= 21; j++) 
        {
          document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "";
          document.getElementById("CheckSumBox").getElementsByTagName("div")[j-1].innerHTML = "M" + j + ": " + (Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j].value));
        }
		    flag = true;
        break;
      }
    }
  }
  if(flag == true)
  {
    document.getElementById('label').innerHTML = "CheckSum is successful !!";
  }
  else
  {
    document.getElementById('label').innerHTML = "CheckSum is fail !! No this ID !!";
  }
}

function MotionList(mode)
{
  switch(Number(mode))
  {
    case 0:
      document.getElementById("MotionList").style.display = "initial";
      document.getElementById("RelativePosition").style.display = "none";
      document.getElementById("RelativeSpeed").style.display = "none";
      document.getElementById("AbsolutePosition").style.display = "none";
      document.getElementById("AbsoluteSpeed").style.display = "none";
      break;
    case 1:
      document.getElementById("MotionList").style.display = "none";
      document.getElementById("RelativePosition").style.display = "initial";
      document.getElementById("RelativeSpeed").style.display = "none";
      document.getElementById("AbsolutePosition").style.display = "none";
      document.getElementById("AbsoluteSpeed").style.display = "none";
      break;
    case 2:
      document.getElementById("MotionList").style.display = "none";
      document.getElementById("RelativePosition").style.display = "none";
      document.getElementById("RelativeSpeed").style.display = "initial";
      document.getElementById("AbsolutePosition").style.display = "none";
      document.getElementById("AbsoluteSpeed").style.display = "none";
      break;
    case 3:
      document.getElementById("MotionList").style.display = "none";
      document.getElementById("RelativePosition").style.display = "none";
      document.getElementById("RelativeSpeed").style.display = "none";
      document.getElementById("AbsolutePosition").style.display = "initial";
      document.getElementById("AbsoluteSpeed").style.display = "none";
      break;
    case 4:
      document.getElementById("MotionList").style.display = "none";
      document.getElementById("RelativePosition").style.display = "none";
      document.getElementById("RelativeSpeed").style.display = "none";
      document.getElementById("AbsolutePosition").style.display = "none";
      document.getElementById("AbsoluteSpeed").style.display = "initial";
      break;
    }
}
