var taskIdCounter = 0

var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");

var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskTypesArray = [
    "Chore",
    "Work", 
    "Errand", 
    "Fun"
]

var tasks = [];

var createTaskTypeoptions = function () {
    var taskTypeSelect = document.querySelector("select[name='task-type'")

    for (var i = 0; i < taskTypesArray.length; i++) {
        var taskTypeOption = document.createElement("option");
        taskTypeOption.setAttribute("value",taskTypesArray[i]);
        taskTypeOption.textContent = taskTypesArray[i];
        taskTypeSelect.appendChild(taskTypeOption);
    }

}

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
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj, 0)
    }
};

var createTaskEl = function (taskDataObj, statusIndex) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute and draggable to true
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true")

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

    switch(statusIndex) {
        case 0:
            tasksToDoEl.appendChild(listItemEl);
            break;
        case 1:
            tasksInProgressEl.appendChild(listItemEl);
            break;
        case 2:
            tasksCompletedEl.appendChild(listItemEl);
            break;
    }
    
    // Adding ID to task object
    taskDataObj.id = taskIdCounter
    tasks.push(taskDataObj)

    saveTasks();

    taskIdCounter++;
}
var completeEditTask = function(taskName, taskType, taskId) {
    // find specific list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values in DOM
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // set new values in Object
    // loop through each element of the array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    saveTasks();

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
        document.querySelector("#save-task").textContent = "Add Task";
        formEl.reset();
    }

    // delete value in Object array
    // loop through each element of the array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks.splice(i, 1)
        }
    }
    saveTasks();
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

        // change status of Object
        // loop through each element of the array
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].status = statusValue
            }
        }
        saveTasks();
    }
};
var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
}
var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
}
var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style")
    }
}
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain")
    
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    
    var draggableElement = document.querySelector("[data-task-id='" + id + "']")
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']")
    
    changeStatus(statusSelectEl, statusType);

    dropZoneEl.removeAttribute("style")
    dropZoneEl.appendChild(draggableElement)

    // change status of Object
    // loop through each element of the array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }

    saveTasks();
}
var changeStatus = function(statusSelectEl, statusType) {
    switch (statusType.toLowerCase()) {
        case "tasks-to-do":
        case "to do":
            statusSelectEl.selectedIndex = 0;
            break;
        case "tasks-in-progress":
        case "in progress":
            statusSelectEl.selectedIndex = 1;
            break;
        case "tasks-completed":
        case "completed":
            statusSelectEl.selectedIndex = 2;
            break;
    }
}
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
var loadTasks = function() {
    // retrieve from localStorage
    // convert to an object
    // populate lists
    savedTasks = localStorage.getItem("tasks")
    if (!savedTasks) {
        return false
    };
    
    savedTasks = JSON.parse(savedTasks);

    for (var i=0; i < savedTasks.length; i++) {
        savedTasks[i].id = taskIdCounter;
        // this switch will assign the loadedTaskListEl variable the necessary ul bucket on the page
        switch (savedTasks[i].status.toLowerCase()) {
            case "to do":
                createTaskEl(savedTasks[i], 0);
                break;
            case "in progress":
                createTaskEl(savedTasks[i], 1);
                break;
            case "completed":
                createTaskEl(savedTasks[i], 2);
                break;
            default:
                console.log("error!")
        }
        // Locate and change the status for the loaded tasks
        // this finds the task and then finds the select dropdown
        var loadedTaskEl = document.querySelector("[data-task-id='" + savedTasks[i].id + "']")
        var statusSelectEl = loadedTaskEl.querySelector("select[name='status-change']")
        // this changes the status
        changeStatus(statusSelectEl, savedTasks[i].status)
    }
}

loadTasks();
createTaskTypeoptions();
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler)
pageContentEl.addEventListener("drop", dropTaskHandler);