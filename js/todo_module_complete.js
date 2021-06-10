var todoModule = {
  start: function () {
    // 변수들을 start에 지정하고 차례대로 함수가 진행되게 한다.
    // this = todoModule 이다
    this.newTodoInput = document.querySelector(".new-todo");
    this.todoList = document.querySelector(".todo-list");
    this.todoAllChkInput = document.querySelector(".toggle-all");

    // footer
    this.todoFooter = document.querySelector(".footer"); 
    this.footerTodoCount = document.querySelector(".todo-count");
    this.footerTodoFilters = document.querySelector(".filters");

    this.startEvent();
  },

  startEvent: function () {
    var self = this;
    self.newTodoInput.addEventListener("keyup", function (e) {
      // input 창에 enter  누르면 list crate 시작
      self.createTodoAction(e);
      
    });

    self.todoAllChkInput.addEventListener("click", function (e) {
      self.todoAllCompeteInputAction(e);
      self.todoListCounting(e);
    });

    
  },

  createTodoAction: function (e) {
    var self = this;
    if (e.keyCode != 13) {
      return;
    }

    var newTodoText = this.newTodoInput.value;
    if (newTodoText == "") {
      return;
    }

    self.createTodo(newTodoText);
    self.showTodoFooter(e);
    self.todoListCounting(e);

    this.newTodoInput.value = "";
  },

  createTodo: function (text) {
    // li 생성하고 버튼 라벨 만든다
    var self = this;
    var todoListItem = document.createElement("li");
    var viewDiv = document.createElement("div");
    viewDiv.className = "view";

    var toggleChkBox = document.createElement("input");
    toggleChkBox.type = "checkbox";
    toggleChkBox.className = "toggle";
    toggleChkBox.addEventListener("click", function (e) {
      self.completeTodoAction(e);
      self.todoListCounting(e);
    });




    var label = document.createElement("label");
    label.innerText = text;
    label.addEventListener("dblclick", function(e){
      self.editInputStart(e);
    });

    var deleteBtn = document.createElement("button");
    deleteBtn.className = "destroy";
    deleteBtn.addEventListener("click", function () {
      todoListItem.remove();
      self.todoListCounting();
    })

    var editInput = document.createElement("input");
    editInput.className = "edit";
    editInput.addEventListener("keyup", function(e){
      if(e.keyCode != 13){
        return;
      }
      self.updateEditTodo(e);
    });

    editInput.addEventListener("focusout", function(e){
      self.updateEditTodo(e);
    });


    this.todoList.appendChild(todoListItem);
    todoListItem.appendChild(viewDiv);
    todoListItem.appendChild(editInput);
    viewDiv.appendChild(toggleChkBox);
    viewDiv.appendChild(label);
    viewDiv.appendChild(deleteBtn);

  },

  completeTodoAction: function (e) {
    // 체크박스 선택시 li 에 completed 클래스 생성;
    var self = this;
    var completeChkBox = e.target;
    var currentListItem = completeChkBox.parentElement.parentElement;
    currentListItem.classList.toggle("completed");

    self.completeAllTodoAction(e);

  },

  completeAllTodoAction: function (e) {
    // 체크박스가 모두 체크되면 전체 토글 input이 작동
    // 전체 리스트 확인이 필요

    var todoListItems = this.todoList.querySelectorAll("li");
    var allChecked = true;

    for (var i = 0; i < todoListItems.length; i++) {
      var currentListItem = todoListItems[i];
      var completeCheckBox = currentListItem.querySelector("div > input");
      if (!completeCheckBox.checked) {
        allChecked = false;
        break;
      }

    }
    this.todoAllChkInput.checked = allChecked;
  },

  todoAllCompeteInputAction: function (e) {
    var todoListItems = this.todoList.querySelectorAll("li");
    var allChecked = e.target.checked;

    for(var i = 0; i < todoListItems.length; i++){
      var currentListItem = todoListItems[i];
      var completeChkBox = currentListItem.querySelector("div > input");

      completeChkBox.checked = allChecked;

      if(allChecked){
        currentListItem.classList.add("completed");
      } else {
        currentListItem.classList.remove("completed");
      }
    }
    
  },

  editInputStart: function(e){
    var currentListItem = e.target.parentElement.parentElement;
    
    currentListItem.classList.add("editing");

    var currentTodoText = e.target.innerText;
    var editInput = currentListItem.querySelector("input.edit");
    editInput.value = currentTodoText;

    editInput.focus();
  },

  updateEditTodo: function(e){
    // if(e.keyCode != 13){
    //   return;
    // }
    var currentListItem = e.target.parentElement;
    var updateTodoText = e.target.value;
    var label = currentListItem.querySelector("div > label");

    label.innerText = updateTodoText;
    currentListItem.classList.remove("editing"); 
  },

  showTodoFooter: function(e){
    var self = this;
    this.todoFooter.style.display = "block";

    self.todoFiltersAction(e);
  },

  todoListCounting:function(e){
    var todoListItems = this.todoList.querySelectorAll("li");
    var leftTodoList = todoListItems.length;

    for(var i = 0; i < todoListItems.length; i++){
      var currentListItem = todoListItems[i];
      var completeChkBox = currentListItem.querySelector("div > input");
      if(completeChkBox.checked){
        leftTodoList -= 1;
      }
    }
    
    this.footerTodoCount.innerText = leftTodoList + " left items";

  },

  todoFiltersAction: function(e){
    // var aElements = this.footerTodoFilters.querySelectorAll("li > a");
    var todoList = this.todoList;
    var todoListItems = this.todoList.querySelectorAll("li");

    var todoAllBtn = this.footerTodoFilters.querySelector(".list-all");
    todoAllBtn.addEventListener("click", function(e){
      todoList.classList.remove("active");
      todoList.classList.remove("completed");
      
    });

    var todoActiveBtn = this.footerTodoFilters.querySelector(".list-active");
    todoActiveBtn.addEventListener("click", function(e){
      todoList.classList.add("active");
      todoList.classList.remove("completed");
    });

    var todoCompletedBtn = this.footerTodoFilters.querySelector(".list-completed");
    todoCompletedBtn.addEventListener("click", function(e){
      todoList.classList.add("completed");
      todoList.classList.remove("active");
    });


    var todoClearBtn = this.todoFooter.querySelector(".clear-completed");
    todoClearBtn.addEventListener("click", function(e){
      for(var i = 0; i < todoListItems.length; i++){
        var currentListItem = todoListItems[i];
        var completeChkBox = currentListItem.querySelector("div > input");
        
        // console.log(completeChkBox)
        if(completeChkBox.checked){
          completeChkBox.parentElement.parentElement.remove();
        }
      }
    })
  }
}
