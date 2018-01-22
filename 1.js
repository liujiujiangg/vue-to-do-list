var setLocal = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get(key){
        return JSON.parse(localStorage.getItem(key));
    }
}
var list = setLocal.get("todoList") || [];
var filterChecked = {
    all(list){
        return list
    },
    finish(list){
        return list.filter(function(item){
            return item.checked
        })
    },
    unfinish(list){
        return list.filter(function(item){
            return !item.checked
        })
    }
}
var vm = new Vue({
    el : ".main",
    watch:{
        list:{
            deep:true,
            handler:function(){
                setLocal.save("todoList",this.list)
            }
        }
    },
    data : {
        list : list,
        inputValue : "",
        editingTodo : "",
        beforeEditing:"",
        visibility:"all"
    },
    computed:{
        filterList(){
            return this.list.filter(function(item){return !item.checked}).length
        },
        filterCheck(){
            return filterChecked[this.visibility] ? filterChecked[this.visibility](this.list) : this.list;
        }
    },
    methods: {
        addTodo(event){
            this.list.push({
                title : this.inputValue,
                checked :false
            })
            this.inputValue = ""
        },
        deleteTodo(todo){
            var index = this.list.indexOf(todo);
            this.list.splice(index, 1);
        },
        editTodo(todo){
            this.editingTodo = todo;
            this.beforeEditing = todo.title;
        },
        editedTodo(){
            this.editingTodo = ""
        },
        cancelEdit(todo){
            todo.title = this.beforeEditing;
            this.beforeEditing = "";
            this.editingTodo = "";
        }
    },
    directives:{
        focus:{
            update(el,binding){
                if(binding.value){
                    el.focus();
                }
            }
        }
    }
})
function hashchange(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash
}
hashchange()
window.addEventListener("hashchange",hashchange)