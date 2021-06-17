(function(){
  var todoModule = {
    start: function(){
      // 변수를 지정해서 실행하는곳
      this.newTodoInput = document.querySelector(".new-todo");
      this.todoList = document.querySelector(".todo-list");
      this.toggleAllInput = document.querySelector(".toggle-all");

      

      this.todoFooter = document.querySelector(".footer");
      this.todoFilters = document.querySelector(".filters");
  
      // localstorage 불러오기
      var todosData = localStorage.getItem("todosData");
      
      this.todosArray = JSON.parse(todosData) || [];
      
      
      this.startAction();
      this.drawTodos();
    },
  
    drawTodos: function(){
      var self = this;    
      this.todosArray.forEach(function(todo){
        self.createTodo(todo);
      })
      this.activeTodoCounting();
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
  
    createTodoAction: function(e){
      if(e.keyCode != 13){
        return;
      }
  
      
  
      var newTodoText = e.target.value;
      if(newTodoText == ""){
        return;
      }
  
      var newTodoObj = {
        id: (new Date().getTime()).toString(),
        text: newTodoText, 
        completed: false,
      }

      this.todosArray.push(newTodoObj);

      this.createTodo(newTodoObj);
      this.saveTodos();
  
      this.activeTodoCounting();
  
      this.newTodoInput.value = "";
    },
  
    saveTodos: function(){
      localStorage.setItem("todosData", JSON.stringify(this.todosArray));
    },
  
    createTodo: function(newTodoObj){
      var self = this;
      // 리스트 생성
      
      var todoListItem = document.createElement("li");
      todoListItem.dataset.todoId = newTodoObj.id;

      todoListItem.classList = newTodoObj.completed ? "completed" : "";
  // 삼항 연산자
  
      var viewDiv = document.createElement("div");
      viewDiv.classList = "view";
  
      // view 안에 체크박스 라벨 삭제버튼 생성
      var toggleChkBox = document.createElement("input");
      toggleChkBox.type = "checkbox";
      toggleChkBox.classList = "toggle";
      toggleChkBox.checked = newTodoObj.completed;
      

      
      // 토글 체크시 todo completed
      toggleChkBox.addEventListener("change", function(e){
        self.todoCompleted(e);
  
        // 토글 전부 체크되면 toggle All input 작동
        self.todoAllCompletedAction(e);
  
        self.activeTodoCounting(e);
  
        newTodoObj.completed = !newTodoObj.completed;
      
        self.saveTodos();
      });
  
  
      var label = document.createElement("label");
      label.innerText = newTodoObj.text;
  
      // 라벨 더블클릭시 todo 변경 가능하게 하기
      label.addEventListener("dblclick", function(e){
        self.updateTodoAction(e);
      })
  
      var deleteBtn = document.createElement("button");
      deleteBtn.classList = "destroy";
      deleteBtn.addEventListener("click", function(e){
        //todoListItem.
        var liElement = e.target.parentElement.parentElement;
        self.removeTodo(liElement)
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

    removeTodo: function(element){
      var todoId = element.dataset.todoId;

      //1. remove todo in todosArray
      var todoIndex = this.todosArray.findIndex(todo => todo.id == todoId);
      this.todosArray.splice(todoIndex, 1);

      //2. remove todo li Element
      element.remove();

      this.saveTodos();
      this.activeTodoCounting();
    },
  
    todoCompleted: function(e){
      // 토글 체크시 li 클래스에 completed 생성
      // 리스트 잡기
      var currentListItem = e.target.parentElement.parentElement;
      var completeChkBox = e.target;
  
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
      var self = this;
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
        self.todosArray[i].completed = allChecked;
        console.log(self.todosArray[i].completed );
      }
      self.saveTodos();
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
      
      label.innerText = e.target.value; //newTodoObj.text
      
      //1. todosArray에서 선택한 todoObj를 찿는다.(index)
      var todoId = currentListItem.dataset.todoId;
      var findIndex = this.todosArray.findIndex(function(todo){
        return todo.id == todoId;
      });

      console.log(this.todosArray);

      if(findIndex > -1){
        //var currentTodoItem = this.todosArray[findIndex];
        this.todosArray[findIndex].text = e.target.value;
        this.saveTodos();
      }
  
      
      currentListItem.classList.remove("editing");
    },
  
    showTodoFooter: function(){
      var self = this;
      // active 되고있는 li 갯수세기
      this.todoFooter.style.display = "block";
  
      
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
  
      this.todoFooter.style.display = todoListItems.length == 0 ? "none" : "block";
  
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
          // var todoId = currentListItem.dataset.todoId;
          // var todoIndex = this.todosArray.findIndex(todo => todo.id == todoId);
          // console.log(this.todosArray)
          // this.todosArray.splice(todoIndex, 1);
          // currentListItem.remove();
          this.removeTodo(currentListItem);
        }
      }
      this.saveTodos();
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
  // window. - 외부에서 함수 접근 가능
  window.todoStart = function(){
    todoModule.start();
  }
})();