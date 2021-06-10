function saveContact() {

  console.log(document.getElementById("contact-name").value);
  console.log(document.getElementById("contact-email").value);
  console.log(document.getElementById("contact-message").value);

  var firstName = document.getElementById("contact-name").value;
  var email = document.getElementById("contact-email").value;
  var message = document.getElementById("contact-message").value;

  // var request = '{"firstName":' + firstName + ',"lastName":"Not provided","email":' + email + ',"phone":"Not provided","message":' + message + '}';


  if (!isEmpty(firstName) && !isEmpty(email) && validateEmail(email)) {

    document.getElementById("contact-submit").innerHTML = "Sending to QuatreLabs";
    document.getElementById("error").innerHTML = "";

    var json =
    {
      'firstName': firstName,
      'lastName': 'Not provided',
      'email': email,
      'phone': 'Not provided',
      'message': message
    };

    console.log(JSON.stringify(json));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contact-submit").innerHTML = "Thank You";
        document.getElementById("contact-submit").style.backgroundColor = "green";
        document.getElementById("contact-submit").style.fontWeight = "bold";
        document.getElementById("contact-submit").style.color="white";
        backTotext();
      }


      //window.location.href = "#contact-submit";
      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("contact-message").value = "";
      var frm = document.getElementById('contact-form');
      frm.reset();
    };

    xhttp.open("POST", "https://quatre-labs-api.herokuapp.com/api/website/save-contact", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(json));

  }
  else{
    document.getElementById("error").innerHTML = "Please enter your name and valid email address!"
    document.getElementById("error").style.fontSize = "10px";
  }
}


function sendNotification() {
  console.log(document.getElementById("email").value);
  var email = document.getElementById("email").value;

  if (!isEmpty(email) && validateEmail(email)) {
    document.getElementById("notify").innerHTML = "Subscribing..."

    var json =
    {
      'email': email
    };


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("notify").innerHTML = "Thankyou!";
        backTotext();
      }
      document.getElementById("email").value = "";

    };

    xhttp.open("POST", "https://quatre-labs-api.herokuapp.com/api/website/get-notified", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(json));

  }
  else{
    window.alert("Invalid/empty email can't be accepted!");
  }

}

function isEmpty(str) {
  return (!str || 0 === str.length);
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

//  Hidden

function toggleHidden(){
  var x = document.getElementById("hidden");
  x.style.display = "block";
  document.getElementById("contactus").style.display="none";
  document.getElementById("audio").play();
}

function closeDiv(){
  document.getElementById("hidden").style.display = "none";
  document.getElementById("contactus").style.display="block";
  document.getElementById("audio").play();
}

function callContact(){
  var mail = document.getElementById("email").value;
  document.getElementById("contact-email").value = mail;
  document.getElementById("hidden").style.display = "none";
  document.getElementById("contactus").style.display="block";
}


function backTotext(){
  setTimeout(()=> {
    document.getElementById("contact-submit").innerHTML = "Send Message";
    document.getElementById("notify").innerHTML = "Get Notified";
    document.getElementById("contact-submit").style.backgroundColor = "#307EFF";
    document.getElementById("contact-submit").style.color="white";
  }, 5000)
}

// Chat Window
var bot_url = "https://qlrasachatbotv1.herokuapp.com/webhooks/rest/webhook";
var aloha = false;

$(document).ready(function () {
  $(".chat_on").click(function () {
    $(".Layout").toggle();
    $(".chat_on").hide(300);
    if(aloha==false) {
      createmsg("Hello! My name is Quat.","bot");
      createmsg("How can I help you ?", "bot");
      aloha=true
    }
  });

  $(".chat_close_icon").click(function () {
    $(".Layout").hide();
    $(".chat_on").show(300);
  });

});

function chatClick() {

  if(document.getElementById("chat_message").value != ''){

  createmsg(document.getElementById("chat_message").value, "user");

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: document.getElementById("chat_message").value, sender: "client", })
  };
  fetch(bot_url, requestOptions)
        .then(response => response.json())
        .then(data => data.forEach((datamsg) => (
          createmsg(datamsg.text,"bot")
        )));

  document.getElementById("chat_message").value = "";

        }
}


// function createmsg(msg,user) {
//   if( msg !=''){
//     var inText = document.createElement("input");
//     inText.type = "text";
//     if(user=="bot") {
//       inText.style ="margin: 2px; padding:5px 12px; border-radius:15px; border-color:#307eff;";
//     } else {
//       inText.style ="margin: 2px; padding:5px 12px; border-radius:15px; border-color:orange;";
//     }
//     inText.classList.add("bot_message");
//     inText.value = msg;



//   var parent = document.getElementById("chat_message_list");
//   parent.appendChild(inText);
//   }
// }

function createmsg(msg, user) {
 

  if (msg != "") {
    var inText = document.createElement("div");

    console.log(msg);

    if (user == "bot") {
      inText.innerHTML = `<div style="color:black;display:flex;width:100%;justify-content: flex-start"><div  class="message_thread_bot">${msg}<div></div>`;
    }else
    {
      inText.innerHTML =` <div style="color:black;display:flex;width:100%;justify-content: flex-end"><div class="message_thread_user">${msg}<div></div>`; 
    }

    var parent = document.getElementById("chat_message_list");
    parent.appendChild(inText);
  }
}