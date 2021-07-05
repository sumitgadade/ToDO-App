(function() {
    let currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (currentUser != undefined) {
        window.location = "dashboard.html";
    }
})();

function loginUser() {
    let loginid = document.getElementById("loginid").value;
    let password = document.getElementById("password").value;


    credentials = {
        loginid: loginid,
        password: password
    };
    if (isValidCredentials(credentials)) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(getLoggedInUser(credentials)));
        window.location = "dashboard.html";
    }
}

function isValidCredentials(data) {
    var userlist = JSON.parse(localStorage.getItem("users"));
    var isUserExist = false;
    if (data.email == "" || data.password == "") {
        alert("Enter credientials");
        return false;
    } else if (userlist == null) {
        alert("Credentials not matched");
        return false;
    } else {
        console.log(data);

        for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].email == data.loginid && userlist[i].password == data.password) {
                isUserExist = true;
                console.log(userlist[i]);
                break;
            }
        }
        if (!isUserExist) {
            alert("Invalid Username Password!!");
        }
    }
    return isUserExist;
}

function getLoggedInUser(data) {
    var u;
    var userlist = JSON.parse(localStorage.getItem('users'));
    for (var i = 0; i < userlist.length; i++) {
        if (userlist[i].email === data.loginid && userlist[i].password === data.password) {
            u = userlist[i];
            break;
        }
    }
    return u;
}