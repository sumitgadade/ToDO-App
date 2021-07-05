(function() {
    let currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (currentUser != undefined) {
        window.location = "dashboard.html";
    }
})();

function registeruser() {

    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let addr = document.getElementById("addr").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let cpass = document.getElementById("cpassword").value;
    let profileImage = document.getElementById("profileimage").src;
    let gender;

    if (document.getElementById("male").checked) {
        gender = "male";
    } else if (document.getElementById("female").checked) {
        gender = "female";
    } else if (document.getElementById("other").checked) {
        gender = "other";
    } else {
        gender = "";
    }

    data = {
        fname: fname,
        lname: lname,
        gender: gender,
        addr: addr,
        email: email,
        password: password,
        cpass: cpass,
        profileimage: profileImage
    };

    var isvalidData = validateData(data);


    if (isvalidData) {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var userData = {
            fname: fname,
            lname: lname,
            gender: gender,
            addr: addr,
            email: email,
            password: password,
            profileimage: profileImage,
            todo: []
        };
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registered Successfully!!")
        window.location = "login.html";
    }
};

function getImageData() {
    var input = document.getElementById("profileimage");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("profileimage");
        profileImage.src = event.target.result;
    }
}

function isemailexist(email) {
    var flag = false;
    var userlist = JSON.parse(localStorage.getItem('users'));
    if (userlist) {
        for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].email === email) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}

function validateData(data) {

    if (data.fname == undefined || data.fname == "") {
        document.getElementById("fnameerror").style.display = "block";
        return false;
    }
    if (data.lname == undefined || data.lname == "") {
        document.getElementById("lnameerror").style.display = "block";
        return false;
    }
    if (data.gender == "") {
        document.getElementById("gendererror").style.display = "block";
        return false;
    }
    if (data.addr == undefined || data.addr == "") {
        document.getElementById("addrerror").style.display = "block";
        return false;
    }
    if (data.email == undefined || data.email == "") {
        document.getElementById("emailerror").style.display = "block";
        return false;
    }

    if (isemailexist(data.email)) {
        document.getElementById("emailerror").innerHTML = "Email is already exist";
        document.getElementById("emailerror").style.display = "block";
        return false;
    }

    if (data.email.indexOf('@', 0) < 0 || data.email.indexOf('.', 0) < 0) {
        document.getElementById("emailerror").innerHTML = "Email format not matched";
        document.getElementById("emailerror").style.display = "block";
        return false;
    }
    if (data.password == undefined || data.password == "") {
        document.getElementById("passworderror").style.display = "block";
        return false;
    }
    if (data.password != undefined || data.password != "") {
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if (!strongRegex.test(data.password)) {
            document.getElementById("passworderror").style.display = "block";
            document.getElementById("passworderror").innerHTML = "Password should contain 1 lowercase, 1 uppercase, 1 digit & length > 8";
            return false;
        }
    }
    if (data.cpass == undefined || data.cpass == "") {
        document.getElementById("cpassworderror").style.display = "block";
        return false;
    }
    if (data.password != data.cpass) {
        document.getElementById("cpassworderror").style.display = "block";
        document.getElementById("cpassworderror").innerHTML = "password and confirm password not match";
        return false;
    }
    if (data.profileimage == undefined || data.profileimage == "") {
        document.getElementById("profileimageerror").style.display = "block";
        return false;
    }
    if (data.profileimage != undefined || data.profileimage != "") {
        var imgFilter = /.(gif|jpe|jpeg|JPG|JPEG|PNG|png|webp|bmp)$/i;
        if (!imgFilter.test(document.getElementById("profileimage").value)) {
            document.getElementById("profileimageerror").style.display = "block";
            document.getElementById("profileimageerror").innerHTML = "Only Image file accepted!!";
            return false;
        }
    }
    return true;
};

function removeerror(divid) {
    document.getElementById(divid).style.display = "none";
}