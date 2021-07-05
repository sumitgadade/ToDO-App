window.addEventListener("DOMContentLoaded", function() {
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser == null) {
        window.location = "login.html";
    }
});

function showprofilecontaint() {
    var currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (currentUser) {
        document.getElementById("fname").value = currentUser.fname;
        document.getElementById("lname").value = currentUser.lname;
        document.getElementById("addr").value = currentUser.addr;
        document.getElementById("email").value = currentUser.email;
        if (currentUser.gender == "male") {
            document.getElementById("male").checked = true;
        } else if (currentUser.gender == "female") {
            document.getElementById("female").checked = true;
        } else {
            document.getElementById("other").checked = true;
        }
        document.getElementById("profileImage").src = currentUser.profileimage;
    } else {
        window.location = "login.html";
    }
}

function updateprofile() {
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var userlist = JSON.parse(localStorage.getItem("users"));
    var updateduser = userlist.find(function(user) { return user.email == loggedInUser.email });
    var updateduserindex = userlist.findIndex(function(user) { return user.email = loggedInUser.email });

    updateduser.fname = document.getElementById('ufname').value;
    updateduser.lname = document.getElementById('ulname').value;
    updateduser.addr = document.getElementById('uaddr').value;
    updateduser.profileimage = document.getElementById('uprofileimage').src;

    if (document.getElementById("umale").checked) {
        updateduser.gender = "male";
    } else if (document.getElementById("ufemale").checked) {
        updateduser.gender = "female";
    } else if (document.getElementById("uother").checked) {
        updateduser.gender = "other";
    } else {
        updateduser.gender = "";
    }
    if (validateUData(updateduser)) {
        for (keys in userlist[updateduserindex]) {
            userlist[updateduserindex] = updateduser;
        }
        localStorage.setItem("Users", JSON.stringify(userlist));
        sessionStorage.setItem("loggedInUser", JSON.stringify(userlist[updateduserindex]));
        alert("Profile updated");
        showprofile();
    }
}

function validateUData(data) {
    if (data.fname == undefined || data.fname == "") {
        document.getElementById("ufnameerror").style.display = "block"
        return false;
    }
    if (data.lname == undefined || data.lname == "") {
        document.getElementById("ulnameerror").style.display = "block"
        return false;
    }
    if (data.addr == undefined || data.addr == "") {
        document.getElementById("uaddrerror").style.display = "block"
        return false;
    }
    if (data.profileimage == undefined || data.profileimage == "") {
        document.getElementById("ufileerror").style.display = "block";
        return false;
    }
    if (data.profileimage != undefined || data.profileimage != "") {
        var imgFilter = /.(gif|jpe|jpeg|JPG|JPEG|PNG|png|webp|bmp)$/i;
        if (!imgFilter.test(document.getElementById("uprofileimage").value)) {
            document.getElementById("ufileerror").style.display = "block";
            document.getElementById("ufileerror").innerHTML = "Only Image file accepted!!";
            return false;
        }
    }

    return true;
}

function displayoldvalues() {
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    document.getElementById('ufname').value = loggedInUser.fname;
    document.getElementById('ulname').value = loggedInUser.lname;
    document.getElementById('uaddr').value = loggedInUser.addr;
    if (loggedInUser.gender == "male") {
        document.getElementById("umale").checked = true;
    } else if (loggedInUser.gender == "female") {
        document.getElementById("ufemale").checked = true;
    } else if (loggedInUser.gender == "other") {
        document.getElementById("uother").checked = true;
    }
}

function getImageData() {
    removeerror("ufileerror");
    var input = document.getElementById("uprofileimage");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("uprofileimage");
        profileImage.src = event.target.result;
    }
}

function disupdtprof() {

    document.getElementById("regis_sec").style.display = 'block';
    displayoldvalues();
    document.getElementById("addtodo").style.display = 'none';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
    document.getElementById("edittodo").style.display = 'none';
}

function showprofile() {
    document.getElementById("profile").style.display = "block";
    document.getElementById("addtodo").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
    document.getElementById("regis_sec").style.display = 'none';
    document.getElementById("edittodo").style.display = 'none';
    showprofilecontaint();
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location = "login.html";
}

function removeerror(divid) {
    document.getElementById(divid).style.display = "none";
}