(function() {
    let currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (currentUser == undefined) {
        window.location = "login.html";
    }

})();

function addToDo() {
    let todoname = document.getElementById("todoname").value;
    let tododate = document.getElementById("tododate").value;
    let ispublic = document.querySelector("input[name=ispublic]:checked").value;
    let catagory = document.querySelectorAll("input[name=catagory]:checked");
    var catagoryVals = [];
    for (var i = 0; i < catagory.length; i++) {
        catagoryVals.push(catagory[i].value);
    }
    let remdate = '-';
    var isReminder = document.querySelector('input[name="remainder"]:checked').value;
    if (isReminder == 'yes') {
        remdate = document.getElementById("remrdate").value;
    }

    var new_todo = {
        todoname: todoname,
        tododate: tododate,
        ispublic: ispublic,
        status: "pending",
        catagoryVals: catagoryVals,
        remainderdate: remdate
    };
    if (validateData(new_todo, isReminder)) {
        var userlist = JSON.parse(localStorage.getItem("users"));
        var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
        var todo = userlist.find(u => u.email == loggedInUser.email).todo;
        if (todo == null) {
            todo = [];
        }
        todo.push(new_todo);
        for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].email == loggedInUser.email) {
                userlist[i].todo = todo;
                break;
            }
        }
        localStorage.setItem("users", JSON.stringify(userlist));
        alert("Successfull!!");
        window.location = "dashboard.html";
    }

}

function validateData(todo, remainder) {
    if (todo.todoname == undefined || todo.todoname == "") {
        document.getElementById("todonameerror").style.display = "block";
        return false;
    }
    if (todo.tododate == undefined || todo.tododate == "") {
        document.getElementById("tododateerror").style.display = "block";
        return false;
    }
    if (todo.ispublic == undefined || todo.ispublic == "") {
        document.getElementById("publicerror").style.display = "block";
        return false;
    }
    if (todo.catagoryVals == undefined || todo.catagoryVals == "") {
        document.getElementById("catagoryerror").style.display = "block";
        return false;
    }
    if (remainder == 'yes' && (todo.remainderdate == undefined || todo.remainderdate == "")) {
        document.getElementById("remdateerror").style.display = "block";
        return false;
    }
    return true;
}

function displaytodo() {

    document.getElementById("displayTodo").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("addtodo").style.display = 'none';

    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(u => u.email == loggedInUser.email).todo;
    let displaydiv = document.getElementById("displayTodo");
    let rowshtml = '<h2>ToDo Items</h2><table style="border:1px solid black; width:100%;"> <tr><th></th><th>ToDo Name</th><th>ToDo Date</th><th>Catagory</th><th>Status</th><th>Mark As done</th><th>Edit</th><th>Remainder Date</th></tr>';
    if (todoList.length > 0) {
        for (var i = 0; i < todoList.length; i++) {
            rowshtml += `<tr>
            <td><input type="checkbox" name="todoCheckbox" value="${todoList[i].todoname}"></td>
            <td>${todoList[i].todoname}</td>
            <td>${todoList[i].tododate}</td>
            <td>${todoList[i].catagoryVals}</td>
            <td>${(todoList[i].status)!="pending"?"<text style='color:green;'><b>Completed</b></text>":"<text style='color:red;'><b>Pending</b></text>"}</td>
            <td><button type="button"  onclick="markasdone('${todoList[i].todoname}')">Mark as done</button></td>
            <td><button type="button"  onclick="edit('${todoList[i].todoname}')">Edit</button></td>
            <td>${todoList[i].remainderdate}</td>
              </tr>`;

        }
        rowshtml += "</table>";
    } else {
        rowshtml = '<h1 style="font-size:40px;">No ToDo\'s to display </h1>';
    }
    displaydiv.innerHTML = rowshtml;
}

function edit(tname) {

    showaddtodo();
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(function(u) { return u.email = loggedInUser.email }).todo;
    var index = userlist.findIndex(function(u) { return u.email = loggedInUser.email });

    todoList = todoList.filter(function(todo) { return todo.todoname != tname });

    userlist[index].todo = todoList;
    localStorage.setItem("users", JSON.stringify(userlist));
}

function deletetodo() {
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (confirm("Do you want to delete?")) {
        if (userlist != undefined) {
            var todoList = userlist.find(function(u) { return u.email = loggedInUser.email }).todo;
            var index = userlist.findIndex(function(u) { return u.email = loggedInUser.email });
            var todoarray = [];
            todoarray = todoList;
        }
        var checkedbox = document.getElementsByName("todoCheckbox");
        var checkboxcount = 0;

        for (var i = 0; i < checkedbox.length; i++) {
            if (checkedbox[i].checked) {
                checkboxcount++;
                var itemname = checkedbox[i].value;
                todoarray = todoarray.filter(function(todo) { return todo.todoname != itemname });
            }
        }
        if (checkboxcount > 0) {
            userlist[index].todo = todoarray;
            localStorage.setItem("users", JSON.stringify(userlist));
            alert("Selected ToDo\'s deleted!!");
            displaytodo();
        } else {
            alert("No ToD\'s selected");
        }
    }
}

function markasdone(name) {
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(u => u.email == loggedInUser.email).todo;
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].todoname == name) {
            todoList[i].status = 'completed';
            break;
        }
    }
    localStorage.setItem("users", JSON.stringify(userlist));
    displaytodo();
}

function displaydate() {
    document.getElementById("remendrdate").style.display = 'block';
}

function removedate() {
    document.getElementById("remendrdate").style.display = 'none';
}

function showaddtodo() {
    document.getElementById("addtodo").style.display = 'block';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
}

function removeerror(divid) {
    document.getElementById(divid).style.display = "none";
}