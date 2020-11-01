var taskIdCounter = 0

var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");

var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function (event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // validate that the form is filled out
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    // reset form
    formEl.reset()

    var isEdit = formEl.hasAttribute("data-task-id");
    // send it as an argument to createTaskEl
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        // package data as object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        createTaskEl(taskDataObj)
    }
};

var createTaskEl = function (taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl)
    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
}
var completeEditTask = function(taskName, taskType, taskId) {
    // find specific list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated");
    formEl.removeAttribute("data-task-Id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl)

    // create dropdown list 
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    // put options into the select
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl)

    return actionContainerEl;
}
var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    } else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    if (formEl.hasAttribute("data-task-id")) {
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task"
    }
}
var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    // update the input fields
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // change the button to save task
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}
var taskStatusChangeHandler = function(event) {
    var targetEl = event.target;
    
    if (targetEl.matches(".select-status")) {
        var taskId = targetEl.getAttribute("data-task-id")
        var statusValue = targetEl.value.toLowerCase();
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

        if (statusValue === "to do") {
            tasksToDoEl.appendChild(taskSelected)
        } else if (statusValue === "in progress") {
            tasksInProgressEl.appendChild(taskSelected)
        } else if (statusValue === "completed") {
            tasksCompletedEl.appendChild(taskSelected)
        }
    }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
