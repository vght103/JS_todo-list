var todoModule = {
  start: function(){
    // 변수를 지정해서 실행하는곳
    this.newTodoInput = document.querySelector(".new-todo");
    this.todoList = document.querySelector(".todo-list");
    this.toggleAllInput = document.querySelector(".toggle-all");
    this.todoFooter = document.querySelector(".footer");
    this.todoFilters = document.querySelector(".filters");
    

    this.startAction();
  },

  startAction: function(){
    var self = this;
    // 인풋에 엔터 누르면 list 생성할 준비
    this.newTodoInput.addEventListener("keyup", function(e){
      self.createTodoAction(e);
    });

    this.toggleAllInput.addEventListener("click", function(e){
      self.todoAllCompleted(e);
      self.activeTodoCounting(e);
    })

  },

  createTodoAction: function(e){
    if(e.keyCode != 13){
      return;
    }

    var newTodoText = e.target.value;
    if(newTodoText == ""){
      return;
    }

    this.createTodo(newTodoText);
    this.showTodoFooter();
    this.activeTodoCounting();

    this.newTodoInput.value = "";
  },

  createTodo: function(text){
    var self = this;
    // 리스트 생성
    var todoListItem = document.createElement("li");
    todoListItem.classList = "todo-test";

    var viewDiv = document.createElement("div");
    viewDiv.classList = "view";

    // view 안에 체크박스 라벨 삭제버튼 생성
    var toggleChkBox = document.createElement("input");
    toggleChkBox.type = "checkbox";
    toggleChkBox.classList = "toggle";

    // 토글 체크시 todo completed
    toggleChkBox.addEventListener("change", function(e){
      self.todoCompleted(e);

      // 토글 전부 체크되면 toggle All input 작동
      self.todoAllCompletedAction(e);

      self.activeTodoCounting(e);
    });


    var label = document.createElement("label");
    label.innerText = text;

    // 라벨 더블클릭시 todo 변경 가능하게 하기
    label.addEventListener("dblclick", function(e){
      self.updateTodoAction(e);
    })




    var deleteBtn = document.createElement("button");
    deleteBtn.classList = "destroy";
    deleteBtn.addEventListener("click", function(){
      todoListItem.remove();
      self.activeTodoCounting();
    });

    var editInput = document.createElement("input");
    editInput.classList = "edit";

    // editInput을 엔터치면 새로운 내용으로 저장
    editInput.addEventListener("keyup", function(e){
      if(e.keyCode != 13){
        return;
      }

      self.updateTodo(e);
    });

    editInput.addEventListener("focusout", function(e){
      self.updateTodo(e);
    });


    this.todoList.appendChild(todoListItem);
    todoListItem.appendChild(viewDiv);
    todoListItem.appendChild(editInput);
    viewDiv.appendChild(toggleChkBox);
    viewDiv.appendChild(label);
    viewDiv.appendChild(deleteBtn);
  },

  todoCompleted: function(e){
    // 토글 체크시 li 클래스에 completed 생성
    // 리스트 잡기
    var currentListItem = e.target.parentElement.parentElement;
    var completeChkBox = e.target;

    completeChkBox.checked;
    currentListItem.classList.toggle("completed");
  },

  todoAllCompletedAction: function(e){
    // 토글 전부 체크되면 전체인풋 작동준비
    // 전체 토글이 되야하니 전체 리스트를 잡아야한다.
    var todoListItems = this.todoList.querySelectorAll("li");
    
    // 모두 체크되면 작동
    var allChecked = true;

    // 모든 리스트가 체크됐는지 확인위해 반복문
    for(var i = 0; i < todoListItems.length; i++){
      var currentListItem = todoListItems[i];
      var completeChkBox = currentListItem.querySelector("div > input");
      
      if(!completeChkBox.checked){
        allChecked = false;
      } 
    }
    this.toggleAllInput.checked = allChecked;
  },

  todoAllCompleted: function(e){
    // toggle all 버튼 클릭하면 리스트 전체 체크 됨
    var todoListItems = this.todoList.querySelectorAll("li");
    var allChecked = this.toggleAllInput.checked;

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

  updateTodoAction:function(e){
    // li 에 editInput 나오게 하기
    var currentListItem = e.target.parentElement.parentElement;
    currentListItem.classList.add("editing");

    var currentTodoText = e.target.innerText;
    var editInput = currentListItem.querySelector(".edit");
    editInput.value = currentTodoText;

    editInput.focus();
  },

  updateTodo: function(e){
    var currentListItem = e.target.parentElement;
    var label = currentListItem.querySelector("label");
    
    label.innerText = e.target.value;
    
    currentListItem.classList.remove("editing");
  },

  showTodoFooter: function(){
    var self = this;
    // active 되고있는 li 갯수세기
    this.todoFooter.style.display = "block";

    var footerTodoAllBtn = this.todoFilters.querySelector(".list-all");
    footerTodoAllBtn.addEventListener("click", function(e){
      self.showTodoAllList(e);
    });
    
    var footerTodoActiveBtn = this.todoFilters.querySelector(".list-active");
    footerTodoActiveBtn.addEventListener("click", function(e){
      self.showTodoActiveList(e);
    });
    
    var footerTodoAllBtn = this.todoFilters.querySelector(".list-completed");
    footerTodoAllBtn.addEventListener("click", function(e){
      self.showTodoCompletedList(e);
    });

    var clearCompletedTodo = this.todoFooter.querySelector(".clear-completed");
    clearCompletedTodo.addEventListener("click", function(e){
      self.clearAllcompletedTodo(e);
    })
  },  

  activeTodoCounting: function(e){
    // 토글 체크가 되거나 li 삭제시 active 카운트 개수 맞추기
    var todoListItems = this.todoList.querySelectorAll("li");
    var activeTodoCount = this.todoFooter.querySelector("span");
    var leftTodoList = todoListItems.length;

    for(var i = 0; i < todoListItems.length; i++){
      var currentListItem = todoListItems[i];
      
      var completeChkBox = currentListItem.querySelector("div > input");
      
      if(completeChkBox.checked){
        leftTodoList -= 1;
      }
    }

    if(todoListItems.length == 0){
      this.todoFooter.style.display = "none";
    }

    activeTodoCount.innerText = leftTodoList + " left items";
  },
  showTodoAllList: function(e){
    // completed 된거, 안된거 모든 리스트를 보여준다.
    var todoListItems = this.todoList.querySelectorAll("li");
    this.todoList.classList.remove("active");
    this.todoList.classList.remove("completed");
    this.selectedFiltersBtn(e);



  },

  showTodoActiveList: function(e){
    // 체크 안된 active 리스트만 보여준다.
    this.todoList.classList.add("active");
    this.todoList.classList.remove("completed");
    this.selectedFiltersBtn(e);

  },

  showTodoCompletedList: function(e){
    // 체크된 completed 리스트만 보여준다.
    this.todoList.classList.add("completed");
    this.todoList.classList.remove("active");
    this.selectedFiltersBtn(e);
  },  

  clearAllcompletedTodo:function(e){
    var todoListItems = this.todoList.querySelectorAll("li");

    for(var i = 0; i < todoListItems.length; i ++){
      var currentListItem = todoListItems[i];
      var completeChkBox = currentListItem.querySelector("div > input");
      
      if(completeChkBox.checked){
        currentListItem.remove();
      }
    }
  },

  selectedFiltersBtn: function(e){
    // footer 버튼들을 누를때 선택한 버튼에 selected 클래스 생성
    var filterAelements = this.todoFilters.querySelectorAll("li > a");
    
    // 클릭하면 세개의 a 태그 클래스를 모두 지우고, 클릭한것만 생성한다.
    for(var i = 0; i < filterAelements.length; i++){
      var currentElement = filterAelements[i];
      currentElement.classList.remove("selected");
    }
    // 반복문을 통해 모든 리스트를 돌면서 클래스를 지우고
    // e.target (클릭한 버튼) 만 클래스 추가
    e.target.classList.add("selected");
  }
  
}