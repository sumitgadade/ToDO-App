function registeruser() {

    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let addr = document.getElementById("addr").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let cpass = document.getElementById("cpassword").value;
    let profileImage = document.getElementById("profileimage").files[0];

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
    if (data.gender == undefined || data.gender == "") {
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
    return true;
};

function removeerror(divid) {
    document.getElementById(divid).style.display = "none";
}