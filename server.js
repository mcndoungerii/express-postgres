const {Client} = require('pg');

const express = require('express');
const app = express();

app.use(express.json());



const client = new Client({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "todo"
});


//READ
app.get('/v1/todos',async (req,res) => {
    const rows = await readTodos();
    res.setHeader('content-type','application/json');
    res.send(JSON.stringify(rows));
})

//CREATE
app.post('/v1/todo',async (req,res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await createTodo(reqJson.todoText);
        result.success = true;
    }
    catch(e) {
        console.log(`Something went wrong ${e}`);
        result.success =  false;

    }
    finally {
        res.setHeader('content-type','application/json');
        res.send(JSON.stringify(result));
    }
    
    
})

//DELETE CRUD
app.delete('/v1/todo', async (req,res) => {
    let result = {};
    try{    
        const reqJson = req.body;
        await deleteTodo(reqJson.id);
        result.success = true;
    }
    catch(e) {
        console.log(`Something wrong happened ${e}`);
        result.success = false;
    }
    finally{
        res.setHeader('content-type','application/json');
        res.send(JSON.stringify(result))
    }
})

app.listen(8080, () => console.log('Web Server is listening ..... on port 8080'));

start();

async function start() {
    await connect();
   
}

async function connect() {
    try {
        await client.connect();
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readTodos() {
    try {
    const results = await client.query("select id, text from todos");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createTodo(todoText){

    try {
        await client.query("insert into todos (text) values ($1)", [todoText]);
        return true
        }
        catch(e){
            return false;
        }
}



async function deleteTodo(id){

    try {
        await client.query("delete from todos where id = $1", [id]);
        return true
        }
        catch(e){
            return false;
        }
}
