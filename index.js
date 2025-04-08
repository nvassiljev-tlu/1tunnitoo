class Entry {
    constructor(title, description, date, priority = "Low") {
        this.title = title;
        this.description = description;
        this.date = this.formatDate(date);
        this.priority = priority;
        this.done = false;
    }

    formatDate(date) {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }

    getSortableDate() {
        const [day, month, year] = this.date.split(".");
        return new Date(`${year}-${month}-${day}`).getTime();
    }
}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.entries.forEach(entry => entry.date = new Entry("", "", entry.date).formatDate(entry.date));
        this.editIndex = null;
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addOrUpdateEntry()});
    }

    addOrUpdateEntry() {
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;
        const priorityValue = document.querySelector("#priority").value;
        const formattedDate = new Entry("", "", dateValue).formatDate(dateValue);

        if (this.editIndex !== null) {
            this.entries[this.editIndex].title = titleValue;
            this.entries[this.editIndex].description = descriptionValue;
            this.entries[this.editIndex].date = formattedDate;
            this.entries[this.editIndex].priority = priorityValue;
            this.editIndex = null;
        } else {
            this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));
        }
        
        this.save();
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#date").value = "";
        document.querySelector("#priority").value = "Low";
    }

    render() {
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";
    
        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
        this.entries.sort((a, b) => {
            return new Entry("", "", a.date).getSortableDate() - new Entry("", "", b.date).getSortableDate() || 
                   priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            doneButton.innerText = "✔️";
            deleteButton.innerText = "❌";
            editButton.innerText = "✏️";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
            });

            doneButton.addEventListener("click", () => {
                this.entries[entryIndex].done = !this.entries[entryIndex].done;
                this.save();
            });

            editButton.addEventListener("click", () => {
                document.querySelector("#title").value = this.entries[entryIndex].title;
                document.querySelector("#description").value = this.entries[entryIndex].description;
                document.querySelector("#date").value = this.entries[entryIndex].date.split(".").reverse().join("-");
                document.querySelector("#priority").value = this.entries[entryIndex].priority;
                this.editIndex = entryIndex;
            });

            div.className = "task";
            div.innerHTML = `<div>${entryValue.title}</div><div>${entryValue.description}</div><div>${entryValue.date}</div><div>Priority: ${entryValue.priority}</div>`;
            
            if (this.entries[entryIndex].done) {
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else {
                ul.appendChild(li);
            }

            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading);
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

const prioritySelector = document.createElement("select");
prioritySelector.id = "priority";
prioritySelector.innerHTML = `
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low" selected>Low</option>
`;
document.querySelector("#inputContainer").appendChild(prioritySelector);

const todo = new Todo();