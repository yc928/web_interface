var ros = new ROSLIB.Ros();
ros.on('connection', function () {
  console.log('Connection made!');
  connectFlag = true;
  createTopics();
  resetfunction();
  document.getElementById('resetButton').disabled = false;
  document.getElementById('connected').style.display = 'inline';
});
ros.on('error', function (error) {
  console.log('Error connecting to websocket server: ', error);
  document.getElementById('SaveButton').disabled = true;
  document.getElementById('ReadButton').disabled = true;
  document.getElementById('SaveStandButton').disabled = true;
  document.getElementById('ReadStandButton').disabled = true;
  document.getElementById('SendButton').disabled = true;
  document.getElementById('executeButton').disabled = true;
  document.getElementById('standButton').disabled = true;
  document.getElementById('MultipleButton').disabled = true;
  document.getElementById('MergeButton').disabled = true;
  document.getElementById('AddButton').disabled = true;
  document.getElementById('DeleteButton').disabled = true;
  document.getElementById('ReverseButton').disabled = true;
  document.getElementById('CopyButton').disabled = true;
  document.getElementById('CheckSumButton').disabled = true;
  document.getElementById('resetButton').disabled = true;
  document.getElementById('connected').style.display = 'none';
});
ros.on('close', function () {
  console.log('Connection to websocket server closed.');
  document.getElementById('SaveButton').disabled = true;
  document.getElementById('ReadButton').disabled = true;
  document.getElementById('SaveStandButton').disabled = true;
  document.getElementById('ReadStandButton').disabled = true;
  document.getElementById('SendButton').disabled = true;
  document.getElementById('executeButton').disabled = true;
  document.getElementById('standButton').disabled = true;
  document.getElementById('MultipleButton').disabled = true;
  document.getElementById('MergeButton').disabled = true;
  document.getElementById('AddButton').disabled = true;
  document.getElementById('DeleteButton').disabled = true;
  document.getElementById('ReverseButton').disabled = true;
  document.getElementById('CopyButton').disabled = true;
  document.getElementById('CheckSumButton').disabled = true;
  document.getElementById('resetButton').disabled = true;
  document.getElementById('connected').style.display = 'none';
});

// interface -> 對應到Send button, 就是把sector存檔
// var interface = new ROSLIB.Topic({
//   ros: ros,
//   name: '/package/InterfaceSend2Sector',
//   messageType: 'tku_msgs/InterfaceSend2Sector'
// });
// var SendPackage = new ROSLIB.Message({
//   Package: 0,
//   sectorname: ""
// });
var interface = new ROSLIB.Topic({
  ros: ros,
  name: '/package/InterfaceSend2Sector',
  messageType: 'tku_msgs/MotorAction'
});
var SectorInfoPackage = new ROSLIB.Message({
  sectorname: "",
  action_mode: 0,
  action_list: [],
  delay_list: []
});

var MotorActionPackage = new ROSLIB.Message({
  motor_speed: [],
  motor_angle: []
});

// 傳送sector
var SectorPackage = new ROSLIB.Topic({
  ros: ros,
  name: '/package/Sector',
  messageType: 'std_msgs/Int16'
});
var SendSectorPackage = new ROSLIB.Message({
  data : 0
});
// interface -> 對應到Save button, 就是把Motion串存檔
var InterfaceSaveMotionData = new ROSLIB.Topic({
  ros: ros,
  name: '/package/InterfaceSaveMotion',
  messageType: 'tku_msgs/SaveMotion'
});
var SaveMotionData = new ROSLIB.Message({
    name: "",
    motionstate: 0,
    id: 0,
    savestate: 0,
    saveflag: false,
    motionlist: [0],
    motordata: [0]
});

//-----
var SendPackageCallBack = null;
var ExecuteCallBack = null;

var connectFlag = false;
var myAddress = "172.17.121.10";

var executeSubscribeFlag = false;
var standSubscribeFlag = false;

var doSendFlag = false;
var doExecuteFlag = false;
var doStandFlag = false;

var FirstSend = true;

function createTopics()
{
  if(SendPackageCallBack != null)
  {
    SendPackageCallBack.unsubscribe();
  }
  SendPackageCallBack = new ROSLIB.Topic({
    ros: ros,
    name: '/package/motioncallback',
    messageType: 'std_msgs/Bool'
  });
  SendPackageCallBack.subscribe(function(msg)
  {
    sleep(200);//wait for motionpackage 1000/60 = 166
    console.log("SendPackageCallBack");
    if(msg.data == true)
    {
      CheckSector(Number(document.getElementById('Sector').value));
    }
    else if(msg.data == false)
    {
      document.getElementById('label').innerHTML = "Send sector is fail !! Please try again !!";
    }
  });

  if(ExecuteCallBack != null)
  {
    ExecuteCallBack.unsubscribe();
  }
  ExecuteCallBack = new ROSLIB.Topic({
    ros: ros,
    name: '/package/executecallback',
    messageType: 'std_msgs/Bool'
  });
  ExecuteCallBack.subscribe(function (msg)
  {
    if(msg.data == true)
    {
      if(executeSubscribeFlag == true)
      {
        document.getElementById('label').innerHTML = "Execute is finish !!";
        document.getElementById('stand_label').innerHTML = "not standing";
        document.getElementById('SaveButton').disabled = false;
        document.getElementById('ReadButton').disabled = false;
        document.getElementById('SaveStandButton').disabled = false;
        document.getElementById('ReadStandButton').disabled = false;
        document.getElementById('SendButton').disabled = false;
        document.getElementById('executeButton').disabled = false;
        document.getElementById('standButton').disabled = false;
        document.getElementById('MultipleButton').disabled = false;
        document.getElementById('MergeButton').disabled = false;
        document.getElementById('AddButton').disabled = false;
        document.getElementById('DeleteButton').disabled = false;
        document.getElementById('ReverseButton').disabled = false;
        document.getElementById('CopyButton').disabled = false;
        document.getElementById('CheckSumButton').disabled = false;
        executeSubscribeFlag = false;
      }
      else if(standSubscribeFlag == true)
      {
        document.getElementById('stand_label').innerHTML = "is standing";
        document.getElementById('standButton').disabled = false;
        standSubscribeFlag = false;
      }
    }
    else
    {
      if(executeSubscribeFlag == true)
      {
        document.getElementById('label').innerHTML = "Execute is fail !! Please try again !!";
        executeSubscribeFlag = false;
      }
      else if(standSubscribeFlag == true)
      {
        document.getElementById('label').innerHTML = "Stand is fail !! Please try again !!";
        standSubscribeFlag = false;
      }
    }
  });
}

function enterAddress() 
{
  if(connectFlag)
  {
    ros.close();
    connectFlag = false;
  }
  myAddress = document.getElementById("addressSelect").value;
  console.log("Connecting address is", myAddress);
  ros.connect("ws://" + myAddress + ":9090");
}

function sleep(ms)
{
  var starttime = new Date().getTime();
  do{

  }while((new Date().getTime() - starttime) < ms)
}

function CheckSector(sectordata)
{
  var LoadParameterClient = new ROSLIB.Service({
    ros : ros,
    name : '/package/InterfaceCheckSector',
    serviceType: 'tku_msgs/CheckSector'
  });
  var parameter_request = new ROSLIB.ServiceRequest({
    data : sectordata
  });
  LoadParameterClient.callService(parameter_request , function(srv)
  {
    console.log("CheckSector")
    executeSubscribeFlag = false;
    standSubscribeFlag = false;
    if(srv.checkflag == true)
    {
      if(doSendFlag == true)
      {
        document.getElementById('label').innerHTML = "Send sector is successful !!";
        document.getElementById('SaveButton').disabled = false;
        document.getElementById('ReadButton').disabled = false;
        document.getElementById('SaveStandButton').disabled = false;
        document.getElementById('ReadStandButton').disabled = false;
        document.getElementById('executeButton').disabled = false;
        document.getElementById('standButton').disabled = false;
        document.getElementById('MultipleButton').disabled = false;
        document.getElementById('MergeButton').disabled = false;
        document.getElementById('AddButton').disabled = false;
        document.getElementById('DeleteButton').disabled = false;
        document.getElementById('ReverseButton').disabled = false;
        document.getElementById('CopyButton').disabled = false;
        document.getElementById('CheckSumButton').disabled = false;
        doSendFlag = false;
      }
      else if(doExecuteFlag == true)
      {
        SendSectorPackage.data = sectordata;
        SectorPackage.publish(SendSectorPackage);

        doExecuteFlag = false;
        executeSubscribeFlag = true;
      }
      else if(doStandFlag == true)
      {
        SendSectorPackage.data = sectordata;
        SectorPackage.publish(SendSectorPackage);
        
        doStandFlag = false;
        standSubscribeFlag = true;
      }
    }
    else
    {
      if(doSendFlag == true)
      {
        document.getElementById('label').innerHTML = "Sector is not correct !! Please try again !!";
        doSendFlag = false;
      }
      else if(doExecuteFlag == true)
      {
        document.getElementById('label').innerHTML = "Sector is not correct !! Please check your sector file !!";
        document.getElementById('SaveButton').disabled = false;
        document.getElementById('ReadButton').disabled = false;
        document.getElementById('SaveStandButton').disabled = false;
        document.getElementById('ReadStandButton').disabled = false;
        document.getElementById('SendButton').disabled = false;
        document.getElementById('executeButton').disabled = false;
        document.getElementById('standButton').disabled = false;
        document.getElementById('MultipleButton').disabled = false;
        document.getElementById('MergeButton').disabled = false;
        document.getElementById('AddButton').disabled = false;
        document.getElementById('DeleteButton').disabled = false;
        document.getElementById('ReverseButton').disabled = false;
        document.getElementById('CopyButton').disabled = false;
        document.getElementById('CheckSumButton').disabled = false;
        doExecuteFlag = false;
      }
      else if(doStandFlag == true)
      {
        document.getElementById('label').innerHTML = "Sector is not correct !! Please check your sector file !!";
        document.getElementById('standButton').disabled = false;
        doStandFlag = false;
      }
    }
  });
}

function Save()
{
  SaveMotionData.savestate = 0;
  SaveMotionData.name = document.getElementById('filename').value;
  for(var i = 0;i < document.getElementById('MotionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 0;
    SaveMotionData.id = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 40; j++)
    {
      SaveMotionData.motionlist[j] = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }

  for(var i = 0;i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 1;
    SaveMotionData.id = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }

    InterfaceSaveMotionData.publish(SaveMotionData);
    SaveMotionData.motionstate = 2;
    SaveMotionData.id = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }
  
  for(var i = 0;i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 3;
    SaveMotionData.id = Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
    SaveMotionData.motionstate = 4;
    SaveMotionData.id = Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }
  SaveMotionData.saveflag = true;
  InterfaceSaveMotionData.publish(SaveMotionData);
  SaveMotionData.saveflag = false;
  document.getElementById('label').innerHTML = "Save file is successful !!";
}

function Read()
{
  console.log("In read func");
  var LoadParameterClient = new ROSLIB.Service({
    ros : ros,
    name : '/package/InterfaceReadSaveMotion',
    serviceType: 'tku_msgs/ReadMotion'
  });
  var parameter_request = new ROSLIB.ServiceRequest({
    name : document.getElementById('filename').value,
    readstate : 0
  });
  LoadParameterClient.callService(parameter_request , function(MotionData)
  {
    console.log(parameter_request.name);
    var motionlistcnt = 0;
    var relativepositioncnt = 0;
    var relativespeedcnt = 0;
    var absolutepositioncnt = 0;
    var absolutespeedcnt = 0;
    for(var i = 0; i < MotionData.vectorcnt; i++)
    {
      switch(MotionData.motionstate[i])
      {
        case 0:
          NewMotionList();
          document.getElementById('MotionTable').getElementsByTagName('div')[motionlistcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 40; j++)
          {
            document.getElementById('MotionTable').getElementsByTagName('div')[motionlistcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.motionlist[motionlistcnt*40+j];
            
          }
          motionlistcnt++;
          break;
        case 1:
          NewRelativePosition();
          document.getElementById('RelativePositionTable').getElementsByTagName('div')[relativepositioncnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('RelativePositionTable').getElementsByTagName('div')[relativepositioncnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.relativedata[relativepositioncnt*21+relativespeedcnt*21+j];
          }
          relativepositioncnt++;
          break;
        case 2:
          NewRelativeSpeed();
          document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[relativespeedcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[relativespeedcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.relativedata[relativepositioncnt*21+relativespeedcnt*21+j];
          }
          relativespeedcnt++;
          break;
        case 3:
          NewAbsolutePosition();
          document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[absolutepositioncnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[absolutepositioncnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.absolutedata[absolutepositioncnt*21+absolutespeedcnt*21+j];
          }
          absolutepositioncnt++;
          break;
        case 4:
          NewAbsoluteSpeed();
          document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[absolutespeedcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[absolutespeedcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.absolutedata[absolutepositioncnt*21+absolutespeedcnt*21+j];
          }
          absolutespeedcnt++;
          break;
      }
    }
	  document.getElementById('label').innerHTML = "Read file is successful !!";
  });
}

function SaveStand()
{
  SaveMotionData.savestate = 1;
  SaveMotionData.name = document.getElementById('filename').value;
  for(var i = 0;i < document.getElementById('MotionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 0;
    SaveMotionData.id = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 40; j++)
    {
      SaveMotionData.motionlist[j] = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }
  
  for(var i = 0;i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 1;
    SaveMotionData.id = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
    SaveMotionData.motionstate = 2;
    SaveMotionData.id = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }
  
  for(var i = 0;i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length;i+=2)
  {
    SaveMotionData.motionstate = 3;
    SaveMotionData.id = Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
    SaveMotionData.motionstate = 4;
    SaveMotionData.id = Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value);
    for(var j = 0; j < 21; j++)
    {
      SaveMotionData.motordata[j] = Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j+1].value);
    }
    InterfaceSaveMotionData.publish(SaveMotionData);
  }
  SaveMotionData.saveflag = true;
  InterfaceSaveMotionData.publish(SaveMotionData);
  SaveMotionData.saveflag = false;
  document.getElementById('label').innerHTML = "SaveStand file is successful !!";
}

function ReadStand()
{
  var LoadParameterClient = new ROSLIB.Service({
    ros : ros,
    name : '/package/InterfaceReadSaveMotion',
    serviceType: 'tku_msgs/ReadMotion'
  });
  var parameter_request = new ROSLIB.ServiceRequest({
    name : document.getElementById('filename').value,
    readstate : 1
  });
  LoadParameterClient.callService(parameter_request , function(MotionData){
    var motionlistcnt = 0;
    var relativepositioncnt = 0;
    var relativespeedcnt = 0;
    var absolutepositioncnt = 0;
    var absolutespeedcnt = 0;
    for(var i = 0; i < MotionData.VectorCnt; i++)
    {
      console.log(MotionData.motionstate[i]);
      switch(MotionData.motionstate[i])
      {
        case 0:
          NewMotionList();
          console.log(MotionData.id[i]);
          document.getElementById('MotionTable').getElementsByTagName('div')[motionlistcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 40; j++)
          {
            document.getElementById('MotionTable').getElementsByTagName('div')[motionlistcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.motionlist[motionlistcnt*40+j];
          }
          motionlistcnt++;
          break;
        case 1:
          NewRelativePosition();
          
          console.log(MotionData.id[i]);
          document.getElementById('RelativePositionTable').getElementsByTagName('div')[relativepositioncnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('RelativePositionTable').getElementsByTagName('div')[relativepositioncnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.relativedata[relativepositioncnt*21+relativespeedcnt*21+j];
          }
          relativepositioncnt++;
          break;
        case 2:
          NewRelativeSpeed();
          
          console.log(MotionData.id[i]);
          document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[relativespeedcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[relativespeedcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.relativedata[relativepositioncnt*21+relativespeedcnt*21+j];
          }
          relativespeedcnt++;
          break;
        case 3:
          NewAbsolutePosition();
          console.log(MotionData.id[i]);
          document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[absolutepositioncnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[absolutepositioncnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.absolutedata[absolutepositioncnt*21+absolutespeedcnt*21+j];
          }
          absolutepositioncnt++;
          break;
        case 4:
          NewAbsoluteSpeed();
          console.log(MotionData.id[i]);
          document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[absolutespeedcnt*2].getElementsByClassName('textbox')[0].value = MotionData.id[i];
          for(var j = 0; j < 21; j++)
          {
            document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[absolutespeedcnt*2+1].getElementsByClassName('textbox')[j+1].value = MotionData.absolutedata[absolutepositioncnt*21+absolutespeedcnt*21+j];
          }
          absolutespeedcnt++;
          break;
      }
    }
	  document.getElementById('label').innerHTML = "ReadStand file is successful !!";
  });
}

function Send()
{
  var ID = Number(document.getElementById('SendID').value);
  var Sector = Number(document.getElementById('Sector').value);
  var count = 0;
  SectorInfoPackage.sectorname = document.getElementById('Sector').value;
  SectorInfoPackage.action_list.length = 0;
  SectorInfoPackage.delay_list.length = 0;
  MotorActionPackage.motor_speed.length = 0;
  MotorActionPackage.motor_angle.length = 0;

  if (document.getElementById('Locked29').checked && Sector == 29)
  {
    alert("Sector 29 is Locked. Please try again. ");
  }
  else if (Sector < 1)
  {
    alert("Sector is not find. Please try again. ");
  }
  else
  {
    for (var i = 0; i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length; i++) 
    {
      var _id = document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value;
      if (ID == _id) 
      {
        SectorInfoPackage.action_mode = 242;
        for (var j = 0; j < 21; j++) 
        {
          var _speed = Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value);
          var _angle = Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value);
          MotorActionPackage.motor_speed[j] = _speed;
          MotorActionPackage.motor_angle[j] = _angle;
        }
        SectorInfoPackage.action_list[0] = MotorActionPackage;
        SectorInfoPackage.delay_list[0] = 0;
		    console.log("242 publish start");
		    console.log(SectorInfoPackage.action_list.length);
        interface.publish(SectorInfoPackage);
		    console.log("242 publish end");
        break;
      }
    }

    for (var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i++) 
    {
      var _id = document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value;
      if (ID == _id) 
      {
        SectorInfoPackage.action_mode = 243;
        for (var j = 0; j < 21; j++) 
        {
          var _speed = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value);
          var _angle = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value);
          MotorActionPackage.motor_speed[j] = _speed;
          MotorActionPackage.motor_angle[j] = _angle;
        }
        SectorInfoPackage.action_list[0] = MotorActionPackage;
        SectorInfoPackage.delay_list[0] = 0;
		    console.log("243 publish start");
		    console.log(SectorInfoPackage.action_list.length);
        interface.publish(SectorInfoPackage);
		    console.log("243 publish end");
        break;
      }   
    }

    for (var i = 0; i < document.getElementById('MotionTable').getElementsByTagName('div').length; i++) 
    {
      var _id = document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value;      
      if (ID == _id) 
      {
        SectorInfoPackage.action_mode = 243;
        for (var j = 1; j <= 20; j++) 
        {
          var _action_id = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j*2 - 1].value);
          var _delay = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j * 2].value);
          console.log("_delay", _delay);
          if (_action_id) 
          {
            for (var l = 0; l < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; l++) 
            {
              var _relative_action_id = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l].getElementsByClassName('textbox')[0].value);
              if (_action_id == _relative_action_id) 
              {
                var _MotorActionPackage = new ROSLIB.Message({
                  motor_speed: [],
                  motor_angle: []
                });
                for (var k = 0; k < 21; k++) 
                {
                  var _speed = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value);
                  var _angle = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value);
                  _MotorActionPackage.motor_speed[k] = _speed;
                  _MotorActionPackage.motor_angle[k] = _angle;
                }
                console.log("j-1", j-1);
                SectorInfoPackage.action_list[j-1] = _MotorActionPackage;
                SectorInfoPackage.delay_list[j-1] = _delay;
                break;
              }
            }
          }
        }
        if(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[1].value != 0)
        {
          console.log("244 publish start");
          console.log(SectorInfoPackage);
          interface.publish(SectorInfoPackage);
          console.log("244 publish end");
          break;
        }
        else
        {
          document.getElementById('label').innerHTML = "A1 or MotionList should not be empty";
        }
      }
    }
  }
  /*doSendFlag = true;
  document.getElementById('label').innerHTML = "";
  document.getElementById('SaveButton').disabled = true;
  document.getElementById('ReadButton').disabled = true;
  document.getElementById('SaveStandButton').disabled = true;
  document.getElementById('ReadStandButton').disabled = true;
  document.getElementById('executeButton').disabled = true;
  document.getElementById('standButton').disabled = true;
  document.getElementById('MultipleButton').disabled = true;
  document.getElementById('MergeButton').disabled = true;
  document.getElementById('AddButton').disabled = true;
  document.getElementById('DeleteButton').disabled = true;
  document.getElementById('ReverseButton').disabled = true;
  document.getElementById('CopyButton').disabled = true;
  document.getElementById('CheckSumButton').disabled = true;
  var MotionList = [];
  var ID = Number(document.getElementById('SendID').value);
  var Sector = Number(document.getElementById('Sector').value);
  var count = 0;
  var checksum = 0;
  var checksum_Lhand = 0;
  var checksum_Rhand = 0;
  var checksum_Lfoot = 0;
  var checksum_Rfoot = 0;
  SendPackage.sectorname = document.getElementById('Sector').value;
  MotionList[count++] = 83;
  MotionList[count++] = 84;
  if (document.getElementById('Locked29').checked && Sector == 29)
  {
    alert("Sector 29 is Locked. Please try again. ");
  }
  else if (Sector < 1)
  {
    alert("Sector is not find. Please try again. ");
  }
  else
  {
    for (var i = 0; i < document.getElementById('AbsolutePositionTable').getElementsByTagName('div').length; i++) 
    {
      if (ID == document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value) 
      {
        MotionList[count++] = 242;
        for (var j = 0; j < 21; j++) 
        {
          MotionList[count] = (Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) & 0xff;
          checksum += MotionList[count];
          count++;
          MotionList[count] = (((Number(document.getElementById('AbsoluteSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) >> 8) & 0xff);
          checksum += MotionList[count];
          count++;
          MotionList[count] = (Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) & 0xff;
          checksum += MotionList[count];
          count++;
          MotionList[count] = (((Number(document.getElementById('AbsolutePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) >> 8) & 0xff);
          checksum += MotionList[count];
          count++;
          if(j < 4)
          {
            checksum_Lhand = checksum;
          }
          else if(j < 8)
          {
            checksum_Rhand = checksum - checksum_Lhand;
          }
          else if(j < 15)
          {
            checksum_Lfoot = checksum - checksum_Lhand - checksum_Rhand;
          }
          else
          {
            checksum_Rfoot = checksum - checksum_Lhand - checksum_Rhand - checksum_Lfoot;
          }
        }
        MotionList[count++] = checksum_Lhand & 0xff;
        MotionList[count++] = checksum_Rhand & 0xff;
        MotionList[count++] = checksum_Lfoot & 0xff;
        MotionList[count++] = checksum_Rfoot & 0xff;
        MotionList[count++] = count - 7;
        MotionList[count++] = 78;
        MotionList[count] = 69;
		    console.log("242 publish start");
		    console.log(MotionList.length);
        for (var a = 0; a < MotionList.length; a++) 
        {
          SendPackage.Package = MotionList[a];
          interface.publish(SendPackage);
          console.log(SendPackage.Package);
          sleep(2);
        }
		    console.log("242 publish end");
        break;
      }
    }

    for (var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i++) 
    {
      if (ID == document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value) 
      {
        MotionList[count++] = 243;
        for (var j = 0; j < 21; j++) 
        {
          MotionList[count] = (Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) & 0xff;
          checksum += MotionList[count];
          count++;
          MotionList[count] = (((Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) >> 8) & 0xff);
          checksum += MotionList[count];
          count++;
          if (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value) >= 0) 
          {
            MotionList[count] = (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) & 0xff;
            checksum += MotionList[count];
            count++;
            MotionList[count] = (((Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) >> 8) & 0xff);
            checksum += MotionList[count];
            count++;
          }
          else if (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value) < 0) 
          {
            var x = ~(Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j + 1].value)) + 1;
            MotionList[count] = x & 0xff;
            checksum += MotionList[count];
            count++;
            MotionList[count] = ((x >> 8) & 0xff) | 0x80;
            checksum += MotionList[count];
            count++;
          }
          if (j < 4) 
          {
            checksum_Lhand = checksum;
          }
          else if (j < 8) 
          {
            checksum_Rhand = checksum - checksum_Lhand;
          }
          else if (j < 15) 
          {
            checksum_Lfoot = checksum - checksum_Lhand - checksum_Rhand;

          }
          else 
          {
            checksum_Rfoot = checksum - checksum_Lhand - checksum_Rhand - checksum_Lfoot;
          }
        }
        MotionList[count++] = checksum_Lhand & 0xff;
        MotionList[count++] = checksum_Rhand & 0xff;
        MotionList[count++] = checksum_Lfoot & 0xff;
        MotionList[count++] = checksum_Rfoot & 0xff;
        MotionList[count++] = count - 7;
        MotionList[count++] = 78;
        MotionList[count] = 69;
		    console.log("243 publish start");
		    console.log(MotionList.length);
        for (var a = 0; a < MotionList.length; a++) 
        {
          SendPackage.Package = MotionList[a];
          interface.publish(SendPackage);
          console.log(SendPackage.Package);
          sleep(2);
        }
		    console.log("243 publish end");
        break;
      }   
    }

    for (var i = 0; i < document.getElementById('MotionTable').getElementsByTagName('div').length; i++) 
    {
      var _id = document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value;
      var _name = document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[0].value;
      console.log(_id);
      console.log(_name);
      
      if (ID == document.getElementById('MotionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value) 
      {
        MotionList[count++] = 244;
        for (var j = 1; j <= 20; j++) 
        {
          if (Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j*2 - 1].value)) 
          {
            for (var l = 0; l < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; l++) 
            {
              if (Number(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[j*2 -1].value) == Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l].getElementsByClassName('textbox')[0].value)) 
              {
                for (var k = 0; k < 21; k++) 
                {
                  MotionList[count++] = (Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value)) & 0xff;
                  MotionList[count++] = (((Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value)) >> 8) & 0xff);
                  if (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value) >= 0) 
                  {
                    MotionList[count++] = (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value)) & 0xff;
                    MotionList[count++] = (((Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value)) >> 8) & 0xff);
                  }
                  else if (Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value) < 0) 
                  {
                    var x = ~(Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[l + 1].getElementsByClassName('textbox')[k + 1].value)) + 1;
                    MotionList[count++] = x & 0xff;
                    MotionList[count++] = ((x >> 8) & 0xff) | 0x80;
                  }
                }
                MotionList[count++] = 68;
                MotionList[count++] = 89;
                MotionList[count++] = Number(document.getElementById('MotionTable').getElementsByTagName('div')[i + 1].getElementsByClassName('textbox')[j * 2].value);
                break;
              }
            }
          }
        }
        if(document.getElementById('MotionTable').getElementsByTagName('div')[i+1].getElementsByClassName('textbox')[1].value != 0)
        {
          MotionList[count++] = 69; //finish big motion
          MotionList[count++] = 78; //finish big motion
          MotionList[count++] = count - 3;
          MotionList[count++] = 78;
          MotionList[count] = 69;
          console.log("244 publish start");
          console.log(MotionList.length);
          for (var a = 0; a < MotionList.length; a++) 
          {
            SendPackage.Package = MotionList[a];
            interface.publish(SendPackage);
            console.log(SendPackage.Package);
            sleep(2);
          }
          console.log("244 publish end");
          break;
        }
        else
        {
          document.getElementById('label').innerHTML = "A1 or MotionList should not be empty";
        }
      }
    }
  }
  MotionList.length = 0;*/
}

function Locked()
{
  if (!document.getElementById('Locked29').checked)
  {
    document.getElementById('label').innerHTML = "Sector 29 is Unlocked";
  }
  else if (document.getElementById('Locked29').checked)
  {
    document.getElementById('label').innerHTML = "Sector 29 is Locked";
  }
}

function execute()
{
  console.log("execute");
  document.getElementById('label').innerHTML = "";
  document.getElementById('SaveButton').disabled = true;
  document.getElementById('ReadButton').disabled = true;
  document.getElementById('SaveStandButton').disabled = true;
  document.getElementById('ReadStandButton').disabled = true;
  document.getElementById('SendButton').disabled = true;
  document.getElementById('executeButton').disabled = true;
  document.getElementById('standButton').disabled = true;
  document.getElementById('MultipleButton').disabled = true;
  document.getElementById('MergeButton').disabled = true;
  document.getElementById('AddButton').disabled = true;
  document.getElementById('DeleteButton').disabled = true;
  document.getElementById('ReverseButton').disabled = true;
  document.getElementById('CopyButton').disabled = true;
  document.getElementById('CheckSumButton').disabled = true;

  var ExecuteSectorClient = new ROSLIB.Service({
    ros : ros,
    name : '/package/ExecuteSector',
    serviceType: 'tku_msgs/ExecuteSector'
  });
  console.log("execute 1");
  var sector_request = new ROSLIB.ServiceRequest({
    sector : Number(document.getElementById('Sector').value)
  });
  console.log("execute 2");
  ExecuteSectorClient.callService(sector_request , function(srv)
  {
    console.log("execute sector", sector_request.sector);
    if(srv.done == true)
    {
      document.getElementById('label').innerHTML = "Send sector is successful !!";
      document.getElementById('SaveButton').disabled = false;
      document.getElementById('ReadButton').disabled = false;
      document.getElementById('SaveStandButton').disabled = false;
      document.getElementById('ReadStandButton').disabled = false;
      document.getElementById('SendButton').disabled = false;
      document.getElementById('executeButton').disabled = false;
      document.getElementById('standButton').disabled = false;
      document.getElementById('MultipleButton').disabled = false;
      document.getElementById('MergeButton').disabled = false;
      document.getElementById('AddButton').disabled = false;
      document.getElementById('DeleteButton').disabled = false;
      document.getElementById('ReverseButton').disabled = false;
      document.getElementById('CopyButton').disabled = false;
      document.getElementById('CheckSumButton').disabled = false;

    }

  });
}

function stand()
{
  doStandFlag = true;
  document.getElementById('label').innerHTML = "";
  document.getElementById('standButton').disabled = true;

  CheckSector(29);
}

function resetfunction()
{
  document.getElementById('label').innerHTML = "";
  document.getElementById('SaveButton').disabled = false;
  document.getElementById('ReadButton').disabled = false;
  document.getElementById('SaveStandButton').disabled = false;
  document.getElementById('ReadStandButton').disabled = false;
  document.getElementById('SendButton').disabled = false;
  document.getElementById('executeButton').disabled = false;
  document.getElementById('standButton').disabled = false;
  document.getElementById('MultipleButton').disabled = false;
  document.getElementById('MergeButton').disabled = false;
  document.getElementById('AddButton').disabled = false;
  document.getElementById('DeleteButton').disabled = false;
  document.getElementById('ReverseButton').disabled = false;
  document.getElementById('CopyButton').disabled = false;
  document.getElementById('CheckSumButton').disabled = false;
}

function Multiple()
{
  var num=document.getElementById("chose_multiple").value;
  var times=document.getElementById("times").value;
  var n=0;
  var numflag=false;
  if(document.getElementById("MotionList").style.display == "initial")
  {
   
  }
  else if(document.getElementById("RelativePosition").style.display == "initial")
  {
    for(var i = 0; i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length; i += 2)
	  {
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
	    {
        n = i;
        numflag = true;
        break;
      }  
    }
    if(numflag == true)
	  {
      for (var j = 1; j <= 21; j++)
	    {
        var value = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value);
        document.getElementById('RelativePositionTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value = value * times;
      }
      document.getElementById('label').innerHTML = "Multiple is successful !!";
    }
    else
	  {
      document.getElementById('label').innerHTML = "Multiple is fail !! No this ID !!";
    }
  
  } 
  else if(document.getElementById("RelativeSpeed").style.display == "initial")
  {
    for(var i = 0; i<document.getElementById('RelativeSpeedTable').getElementsByTagName('div').length; i += 2)
	  {
      if(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num)
	    {
        n = i;
        numflag = true;
        break;
      }  
    }
    if(numflag==true)
	  {
      for (var j = 1; j <= 21; j++)
	    {
        var value = Number(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value);
        document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n+1].getElementsByClassName('textbox')[j].value = value * times;
      }
      document.getElementById('label').innerHTML = "Multiple is successful !!";
    }
    else
	  {
      document.getElementById('label').innerHTML = "Multiple is fail !! No this ID !!";
    }
  }  
  else if(document.getElementById("AbsolutePosition").style.display == "initial")
  {

  }
  else if(document.getElementById("AbsoluteSpeed").style.display ==  "initial")
  {

  }
}

function Merge(){
  var num1 = document.getElementById("Merge1").value;
  var num2 = document.getElementById("Merge2").value;
  var num1flag=false;
  var num2flag=false;
  var n1=0;
  var n2=0;
  if(document.getElementById("MotionList").style.display == "initial")
  {
   
  }
  else if(document.getElementById("RelativePosition").style.display == "initial" || document.getElementById("RelativeSpeed").style.display ==  "initial")
  {
    for(var i = 0;i < document.getElementById('RelativePositionTable').getElementsByTagName('div').length && num1 != num2; i += 2)
	  {
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num1)
	    {
        n1 = i;
        num1flag = true;
      }
      if(document.getElementById('RelativePositionTable').getElementsByTagName('div')[i].getElementsByClassName('textbox')[0].value == num2)
	    {
        n2 = i;
        num2flag = true;
      }
      if(num1flag == true && num2flag == true)
      {
      break;
      }
    }
    if(num1flag == true && num2flag == true)
	  {
      for(var j = 1; j <= 21; j++)
	    {
        var value = Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value);
        document.getElementById('RelativePositionTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value = value + Number(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n1+1].getElementsByClassName('textbox')[j].value);
        if(value != 0 && document.getElementById('RelativePositionTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value == 0)
        {
          document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value = 0;
        }
        else if(value == 0 && document.getElementById('RelativePositionTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value != 0 && document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value == 0)
        {
          document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n2+1].getElementsByClassName('textbox')[j].value = 20;
        }
      }
      document.getElementById('RelativePositionTable').removeChild(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n1]);
      document.getElementById('RelativePositionTable').removeChild(document.getElementById('RelativePositionTable').getElementsByTagName('div')[n1]);
      document.getElementById('RelativeSpeedTable').removeChild(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n1]);
      document.getElementById('RelativeSpeedTable').removeChild(document.getElementById('RelativeSpeedTable').getElementsByTagName('div')[n1]);
      document.getElementById('label').innerHTML = "Merge is successful !!";
    }
    else
	  {
      if(num1 == num2)
      {
        document.getElementById('label').innerHTML = "ID1 can't be the same as ID2 !!";
      }
      else if(num1flag == false && num2flag == true)
      {
        document.getElementById('label').innerHTML = "Merge is fail !! No ID1 !!";
      }
      else if(num1flag == true && num2flag == false)
      {
        document.getElementById('label').innerHTML = "Merge is fail !! No ID2 !!";
      }
      else if(num1flag == false && num2flag == false)
      {
        document.getElementById('label').innerHTML = "Merge is fail !! No both ID !!";
      }
    }
  }  
  else if(document.getElementById("AbsolutePosition").style.display == "initial" || document.getElementById("AbsoluteSpeed").style.display ==  "initial")
  {
    
  }
}
