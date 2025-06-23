const todosContainer = document.querySelector("#todos");
const inputField = document.querySelector("input");
const addBtn = document.querySelector("#add-btn");
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let ctr = Number.parseInt(localStorage.getItem("todoCount")) || 1;

render();

addBtn.addEventListener("click", () => {
    const todo = inputField.value;
    if (todo.trim() == "") {
        alert("Please Enter Your Todo!!!");
        return;
    }
    inputField.value = "";
    todos.push({
        id: ctr,
        title: todo,
        isDone: false,
    });
    ctr++;
    render();
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("todoCount", ctr);
});

inputField.addEventListener("keydown", (event) => {
    if(event.key == "Enter"){
        addBtn.click();
    }
})

function todoDivComponent(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoDiv");

    const [checkboxEl, spanEl, editEl, deleteEl] = todoComponent(todo);

    todoDiv.appendChild(checkboxEl);
    todoDiv.appendChild(spanEl);
    todoDiv.appendChild(editEl);
    todoDiv.appendChild(deleteEl);

    return todoDiv;
}

function todoComponent(todo) {
    const checkboxEl = document.createElement("input");
    checkboxEl.type = "checkbox";
    checkboxEl.classList.add("todo-checkbox");
    checkboxEl.dataset.todoId = todo.id;
    checkboxEl.checked = todo.isDone;
    checkboxEl.addEventListener("change", (event) => {
        const btn = event.target;
        const id = btn.dataset.todoId;
        const isChecked = btn.checked;
        const spanEl = btn.parentNode.children[1];
        spanEl.classList.toggle("isDone");
        todos.forEach((todo) => {
            if (todo.id == id) {
                todo.isDone = isChecked;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    const spanEl = document.createElement("span");
    spanEl.classList.add("todo-title");
    spanEl.textContent = todo.title;
    if (todo.isDone) {
        spanEl.classList.toggle("isDone");
    }

    const editEl = document.createElement("button");
    editEl.classList.add("edit-btn", "btn");
    editEl.textContent = "Edit";
    editEl.dataset.todoId = todo.id;
    editEl.addEventListener("click", (event) => {
        const btn = event.currentTarget;
        const id = btn.dataset.todoId;
        const todo = todos.find((todo) => todo.id == id);
        const todoDiv = btn.parentNode;
        todoDiv.innerHTML = "";
        // todoDiv.classList.remove("todoDiv");
        // todoDiv.classList.add("editDiv");
        todoDiv.className = "editDiv";
        const [inputEl, saveEl] = editComponent(todo);
        todoDiv.appendChild(inputEl);
        todoDiv.appendChild(saveEl);
    });

    const deleteEl = document.createElement("button");
    deleteEl.classList.add("delete-btn", "btn");
    deleteEl.textContent = "Delete";
    deleteEl.dataset.todoId = todo.id;
    deleteEl.addEventListener("click", (event) => {
        const btn = event.currentTarget;
        const id = btn.dataset.todoId;
        todos = todos.filter((todo) => todo.id != id);
        localStorage.setItem("todos", JSON.stringify(todos));
        btn.parentNode.remove();
    });

    return [checkboxEl, spanEl, editEl, deleteEl];
}

function render() {
    todosContainer.innerHTML = "";
    todos.forEach((todo) => {
        const div = todoDivComponent(todo);
        todosContainer.appendChild(div);
    });
}

function editComponent(todo) {
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.placeholder = "Enter Your Todo";
    inputEl.classList.add("todo-input");
    inputEl.id = "todoId-" + todo.id;
    inputEl.value = todo.title;

    const saveEl = document.createElement("button");
    saveEl.classList.add("save-btn", "btn");
    saveEl.dataset.todoId = todo.id;
    saveEl.textContent = "Save";
    saveEl.addEventListener("click", (event) => {
        const btn = event.currentTarget;
        const id = btn.dataset.todoId;
        const title = document.querySelector("#todoId-" + id).value;
        todos.forEach((todo) => {
            if (todo.id == id) {
                todo.title = title;
            }
        });

        localStorage.setItem("todos", JSON.stringify(todos));
        const newtodo = todos.find((todo) => todo.id == id);

        const todoDiv = btn.parentNode;
        todoDiv.innerHTML = "";
        // todoDiv.classList.add("todoDiv");
        // todoDiv.classList.remove("editDiv");
        todoDiv.className = "todoDiv";
        const [checkboxEl, spanEl, editEl, deleteEl] = todoComponent(newtodo);
        todoDiv.appendChild(checkboxEl);
        todoDiv.appendChild(spanEl);
        todoDiv.appendChild(editEl);
        todoDiv.appendChild(deleteEl);
    });

    return [inputEl, saveEl];
}
