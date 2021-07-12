(function() {
    let currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (currentUser == undefined) {
        window.location = "login.html";
    }

})();

var editTodoData;

function addToDo() {
    let todoname = document.getElementById("todoname").value;
    let tododate = document.getElementById("tododate").value;
    let catagory = document.querySelectorAll("input[name=catagory]:checked");
    var catagoryVals = [];
    for (var i = 0; i < catagory.length; i++) {
        catagoryVals.push(catagory[i].value);
    }

    let ispublic;

    if (document.getElementById("pyes").checked) {
        ispublic = "yes";
    } else if (document.getElementById("pno").checked) {
        ispublic = "no";
    } else {
        ispublic = "";
    }

    let remdate;
    let isRemainder;

    if (document.getElementById("yesrem").checked) {
        isRemainder = "yes";
        remdate = document.getElementById("remrdate").value;
    } else if (document.getElementById("norem").checked) {
        isRemainder = "no";
        remdate = '-';
    } else {
        isRemainder = "";
        remdate = "";
    }

    var new_todo = {
        todoname: todoname,
        tododate: tododate,
        ispublic: ispublic,
        status: "pending",
        catagoryVals: catagoryVals,
        remainderdate: remdate
    };
    if (validateData(new_todo, isRemainder)) {
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
    if (remainder == "") {
        document.getElementById("remaindererror").style.display = "block";
        return false;
    }
    if (remainder == 'yes' && (todo.remainderdate == undefined || todo.remainderdate == "")) {
        document.getElementById("remdateerror").style.display = "block";
        return false;
    }
    var todaydate = new Date();
    var tdate = new Date(todo.tododate);
    var rdate = new Date(todo.remainderdate);
    todaydate.setHours(0, 0, 0, 0);
    tdate.setHours(0, 0, 0, 0);
    rdate.setHours(0, 0, 0, 0);

    if (tdate < todaydate) {
        document.getElementById("tododateerror").style.display = "block";
        document.getElementById("tododateerror").innerHTML = "ToDo date should be greater than or equal to todays date!!";
        return false;
    }

    if (rdate < todaydate || rdate > tdate) {
        document.getElementById("remdateerror").style.display = "block";
        document.getElementById("remdateerror").innerHTML = "Remainder date should be between todays date and ToDo date!!";
        return false;
    }
    return true;
}

function displaytodo() {
    displaytotosection();

    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(u => u.email == loggedInUser.email).todo;
    let displaydiv = document.getElementById("displayTodo");
    let rowshtml = '<h2>ToDo Items</h2><button class="button" style="float:right;margin:0px 10px 10px;" onclick="deletetodo()">Delete checked task</button><button class="button" onclick="sort()">Sort</button><table style="border:1px solid black; width:100%;"> <tr><th><input type="checkbox" id="checkall" name="checkall" value="checkall" onclick="checkall()"></th><th>ToDo Name</th><th>ToDo Date</th><th>Catagory</th><th>Status</th><th>Mark As done</th><th>Edit</th><th>Remainder Date</th></tr>';
    var remaindernames = [];
    if (todoList.length > 0) {
        for (var i = 0; i < todoList.length; i++) {
            rowshtml += `<tr>
            <td><input type="checkbox" name="todoCheckbox" id="todoCheckbox" value="${todoList[i].todoname}"></td>
            <td>${todoList[i].todoname}</td>
            <td>${todoList[i].tododate}</td>
            <td>${todoList[i].catagoryVals}</td>
            <td>${(todoList[i].status)!="pending"?"<text style='color:green;'><b>Completed</b></text>":"<text style='color:red;'><b>Pending</b></text>"}</td>
            <td><button type="button"  onclick="markasdone('${todoList[i].todoname}')">Mark as done</button></td>
            <td><button type="button"  onclick="showeditToDo('${todoList[i].todoname}')">Edit</button></td>
            <td>${todoList[i].remainderdate}</td>
              </tr>`;
            var remdate = new Date(todoList[i].remainderdate);
            var currdate = new Date();
            if ((remdate.toDateString() == currdate.toDateString()) && todoList[i].status == "pending") {
                remaindernames.push(todoList[i].todoname);
            }
        }
        rowshtml += "</table>";
        if (remaindernames.length > 0) {
            alert("Remainder!! Remainder for tasks \"" + remaindernames + "\"");
        }
    } else {
        rowshtml = '<h1 style="font-size:40px;">No ToDo\'s to display </h1>';
    }
    displaydiv.innerHTML = rowshtml;
}

function editToDo() {

    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(function(u) { return u.email == loggedInUser.email }).todo;

    var index;
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].todoname == editTodoData) {
            index = i;
            break;
        }
    }

    let catagory = document.querySelectorAll("input[name=ecatagory]:checked");
    var catagoryVals = [];
    for (var i = 0; i < catagory.length; i++) {
        catagoryVals.push(catagory[i].value);
    }
    let ispublic;
    if (document.getElementById("epyes").checked) {
        ispublic = "yes";
    } else if (document.getElementById("epno").checked) {
        ispublic = "no";
    } else {
        ispublic = "";
    }

    let status;
    if (document.getElementById("pending").checked) {
        status = "pending";
    } else if (document.getElementById("completed").checked) {
        status = "completed";
    } else {
        status = "";
    }

    let remdate;
    let isRemainder;
    if (document.getElementById("eyesrem").checked) {
        isRemainder = "yes";
        remdate = document.getElementById("eremrdate").value;
    } else if (document.getElementById("enorem").checked) {
        isRemainder = "no";
        remdate = '-';
    } else {
        isRemainder = "";
        remdate = "";
    }
    var data = {
        todoname: document.getElementById("etodoname").value,
        tododate: document.getElementById("etododate").value,
        catagoryVals: catagoryVals,
        ispublic: ispublic,
        status: status,
        remainderdate: remdate
    };
    if (validateEditData(data, isRemainder)) {
        todoList[index] = data;
        for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].email == loggedInUser.email) {
                userlist[i].todo = todoList;
                break;
            }
        }

        localStorage.setItem("users", JSON.stringify(userlist));
        alert("Successfull!!");
        window.location = "dashboard.html";
    }
}

function validateEditData(todo, remainder) {
    if (todo.todoname == undefined || todo.todoname == "") {
        document.getElementById("etodonameerror").style.display = "block";
        return false;
    }
    if (todo.tododate == undefined || todo.tododate == "") {
        document.getElementById("etododateerror").style.display = "block";
        return false;
    }
    if (todo.ispublic == undefined || todo.ispublic == "") {
        document.getElementById("epublicerror").style.display = "block";
        return false;
    }
    if (todo.catagoryVals == undefined || todo.catagoryVals == "") {
        document.getElementById("ecatagoryerror").style.display = "block";
        return false;
    }
    if (remainder == "") {
        document.getElementById("eremaindererror").style.display = "block";
        return false;
    }
    if (remainder == 'yes' && (todo.remainderdate == undefined || todo.remainderdate == "")) {
        document.getElementById("eremdateerror").style.display = "block";
        return false;
    }
    var todaydate = new Date();
    var tdate = new Date(todo.tododate);
    var rdate = new Date(todo.remainderdate);
    todaydate.setHours(0, 0, 0, 0);
    tdate.setHours(0, 0, 0, 0);
    rdate.setHours(0, 0, 0, 0);

    if (tdate < todaydate) {
        document.getElementById("etododateerror").style.display = "block";
        document.getElementById("etododateerror").innerHTML = "ToDo date should be greater than or equal to todays date!!";
        return false;
    }

    if (rdate < todaydate || rdate > tdate) {
        document.getElementById("eremdateerror").style.display = "block";
        document.getElementById("eremdateerror").innerHTML = "Remainder date should be between todays date and ToDo date!!";
        return false;
    }
    return true;
}


function deletetodo() {
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
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
        if (confirm("Do you want to delete?")) {
            userlist[index].todo = todoarray;
            localStorage.setItem("users", JSON.stringify(userlist));
            alert("Selected ToDo\'s deleted!!");
            displaytodo();
        }
    } else {
        alert("No ToD\'s selected");
    }

}

function checkall() {
    var checkedbox = document.getElementsByName("todoCheckbox");
    var allcheck = document.getElementById("checkall").checked;
    if (allcheck) {
        for (var i = 0; i < checkedbox.length; i++) {
            checkedbox[i].checked = true;
        }
    } else {
        for (var i = 0; i < checkedbox.length; i++) {
            checkedbox[i].checked = false;
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

function search() {
    displaytotosection();
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(u => u.email == loggedInUser.email).todo;

    var searchcatagory = document.getElementById("searchcat").value;
    var searchstatus = document.getElementById("searchstatus").value;

    if (searchcatagory == "" && searchstatus == "") {
        alert("Please select at least one option!!");
    }
    if (searchcatagory == "") {} else {
        todoList = todoList.filter(function(todo) { return todo.catagoryVals[0] == searchcatagory || todo.catagoryVals[1] == searchcatagory });
        displaysearchtodo(todoList);
    }

    if (searchstatus == "") {} else {
        todoList = todoList.filter(function(todo) { return todo.status == searchstatus });
        displaysearchtodo(todoList);
    }
}

function sort() {
    displaytotosection();
    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    var todoList = userlist.find(u => u.email == loggedInUser.email).todo;

    todoList.sort((a, b) => {
        let da = new Date(a.tododate),
            db = new Date(b.tododate);
        return da - db;
    });
    displaysearchtodo(todoList);
}

function displaysearchtodo(todoList) {
    let displaydiv = document.getElementById("displayTodo");
    let rowshtml = '<h2>ToDo Items</h2><button class="button" style="float:right;margin:0px 10px 10px;" onclick="deletetodo()">Delete checked task</button><button class="button" onclick="sort()">Sort</button><table style="border:1px solid black; width:100%;"> <tr><th><input type="checkbox" id="checkall" name="checkall" value="checkall" onclick="checkall()"></th><th>ToDo Name</th><th>ToDo Date</th><th>Catagory</th><th>Status</th><th>Mark As done</th><th>Edit</th><th>Remainder Date</th></tr>';
    if (todoList.length > 0) {
        for (var i = 0; i < todoList.length; i++) {
            rowshtml += `<tr>
            <td><input type="checkbox" name="todoCheckbox" value="${todoList[i].todoname}"></td>
            <td>${todoList[i].todoname}</td>
            <td>${todoList[i].tododate}</td>
            <td>${todoList[i].catagoryVals}</td>
            <td>${(todoList[i].status)!="pending"?"<text style='color:green;'><b>Completed</b></text>":"<text style='color:red;'><b>Pending</b></text>"}</td>
            <td><button type="button"  onclick="markasdone('${todoList[i].todoname}')">Mark as done</button></td>
            <td><button type="button"  onclick="showeditToDo('${todoList[i].todoname}')">Edit</button></td>
            <td>${todoList[i].remainderdate}</td>
            </tr>`;
        }
        rowshtml += "</table>";
    } else {
        rowshtml = '<h1 style="font-size:40px;">No ToDo\'s to display </h1>';
    }
    displaydiv.innerHTML = rowshtml;
}

function displaytotosection() {
    document.getElementById("displayTodo").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("addtodo").style.display = 'none';
    document.getElementById("regis_sec").style.display = 'none';
    document.getElementById("edittodo").style.display = 'none';

}

function displaydate() {
    removeerror('remaindererror')
    document.getElementById("remendrdate").style.display = 'block';
    removeerror('eremaindererror')
    document.getElementById("eremendrdate").style.display = 'block';
}

function removedate() {
    removeerror('remaindererror')
    document.getElementById("remendrdate").style.display = 'none';
    removeerror('eremaindererror')
    document.getElementById("eremendrdate").style.display = 'none';
}

function showaddtodo() {
    document.getElementById("addtodo").style.display = 'block';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
    document.getElementById("regis_sec").style.display = 'none';
    document.getElementById("edittodo").style.display = 'none';
}

function showeditToDo(a) {
    editTodoData = a;
    document.getElementById("edittodo").style.display = 'block';
    document.getElementById("addtodo").style.display = 'none';
    document.getElementById("profile").style.display = 'none';
    document.getElementById("displayTodo").style.display = "none";
    document.getElementById("regis_sec").style.display = 'none';

    var userlist = JSON.parse(localStorage.getItem("users"));
    var loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    var todoList = userlist.find(function(u) { return u.email == loggedInUser.email }).todo;

    var index;
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].todoname == editTodoData) {
            index = i;
            break;
        }
    }
    document.getElementById("etodoname").value = todoList[index].todoname;
    document.getElementById("etododate").value = todoList[index].tododate;
    if (todoList[i].ispublic == "yes") {
        document.getElementById("epyes").checked = true;
    } else {
        document.getElementById("epno").checked = true;
    }
    if (todoList[i].status == "pending") {
        document.getElementById("pending").checked = true;
    } else {
        document.getElementById("completed").checked = true;
    }
    if (todoList[i].catagoryVals[0] == "work") {
        document.getElementById("ework").checked = true;
    }
    if (todoList[i].catagoryVals[0] == "personal") {
        document.getElementById("epersonal").checked = true;
    }
    if (todoList[i].catagoryVals[1] == "work") {
        document.getElementById("ework").checked = true;
    }
    if (todoList[i].catagoryVals[1] == "personal") {
        document.getElementById("epersonal").checked = true;
    }
    if (todoList[i].remainderdate != "-") {
        document.getElementById("eyesrem").checked = true;
        document.getElementById("eremrdate").value = todoList[index].remainderdate;
    } else {
        document.getElementById("eremendrdate").style.display = "none";
        document.getElementById("enorem").checked = true;
    }
}

function removeerror(divid) {
    document.getElementById(divid).style.display = "none";
}