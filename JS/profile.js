window.addEventListener("DOMContentLoaded", function() {
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser == null) {
        window.location = "login.html";
    }
});

function showprofilecontaint() {
    var currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    console.log(currentUser);
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
        console.log(currentUser.profileimage);
        document.getElementById("profileImage").src = currentUser.profileimage;
    } else {
        window.location = "login.html";
    }
}

function showprofile() {
    document.getElementById("profile").style.display = "block";
    document.getElementById("addtodo").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
    showprofilecontaint();
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location = "login.html";
}