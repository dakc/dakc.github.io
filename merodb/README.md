[![Build Status](https://travis-ci.com/dakc/merodb.svg?branch=master)](https://travis-ci.com/dakc/merodb)
[![npm](https://img.shields.io/npm/v/merodb.svg)](https://www.npmjs.com/package/merodb) 
[![GitHub license](https://img.shields.io/github/license/dakc/merodb.svg?style=popout)](https://github.com/dakc/mero/blob/master/LICENSE) 
# How To Use
## 1. Npm
Install the library by using following command.
```
npm install --save-dev merodb
```

Create MeroDB Instance
```
const MeroDB = require("merodb");
let myDb = new MeroDB();
```

## 2. Browser
Load "merodb.min.js" file which is on dist folder.
[SAMPLE](example.html)
```
<script src="./dist/merodb.min.js"></script>
```
Create Instance after the dom contents are loaded.
```
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var myDb = new merodb();
    });
</script>
```

### 3. Create Collection
MeroDB can hold multiple collection. As like a "Table" in RDBMS first create COLLECTION.
The first parameter is name of collection.It should be of string type.
```
myDb.createCollection("continent");
```
"createCollection" will return false if failed, Otherwise returns true.
```
var isCreated = myDb.createCollection("continent");
if(isCreated === false){
    console.log("Failed to create collection");
}
```


### 4. Insert Data
The first parameteter is name of collection where data is to be inserted. It should be of string type.
Second parameter is the actual data which we want to save in the collection. It should be of object type.
```
var data1 = {id:1,place:"Asia",color:"red"};
var data2 = {id:3,place:"Europe",color:"green"};
myDb.insert("continent",data1);
myDb.insert("continent",data2);
```
However, first parameter can be ... if a collection is activated.
To activate a collection "use" method is executed.
```
myDb.use("continent");
var data1 = {id:5,place:"Africa",color:"blue"};
var data2 = {id:7,place:"America",color:"yellow"};
myDb.insert(data1);
myDb.insert(data2);
```
"use" & "insert" methods will return false if failed, Otherwise returns true.
if second parameter is passed as true while creating collection, 
it will automatically activate the given collection.
```
myDb.createCollection("continent", true);
myDb.insert({id:7,place:"Antartica",color:"pink"});
```

##### Create From Existing Object
Collections can be created from existing Objects.
```
var userData = [];
userData.push({ id: 1, name: "pk", salary: 10 });
userData.push({ id: 2, name: "ck", age: 20, salary: 20, sex: "M" });
userData.push({ id: 3, name: "dk", create: "2018-01-20", sex: "M", salary: 35 });
userData.push({ id: 4, name: "kk", salary: 25, sex: "M" });
userData.push({ id: 5, name: "kk", salary: 15 });

myDb.loadFromJsonObject("user", userData);
```

### 5. Find

| parameter             | numbers | usage                         | description                 |
| --------------------- | ------- | ----------------------------- |---------------------------- |
| object                |   1     | search condition              | returns all the document satisfiying this condition |
| object, array         |   2     | search condition, column list | similar to case 1 but only the columns listed will be returned |
| string, object, array |   3     | collection name, search condition, column list | name of collection can be explicitly applied |
```
var searchTableString = "user";
var searchConditionObject = { place: "Asia" };
var resultColumnArray = ["id"];

var searchResult = myDb.find(searchTableString, searchConditionObject);
var searchResult = myDb.find(searchTableString, searchConditionObject, resultColumnArray);
var searchResult = myDb.find(searchConditionObject);
var searchResult = myDb.find(searchConditionObject, resultColumnArray);
```
 ## Search condition
 | name | meaning | usage |
 |------|---------|-----|
 | $e | equals | { id: { $e: 200 } } |
 | $lt | less then | { id: { $lt: 200 } }
 | $lte | less then or equal | { id: { $lte: 200 } } |
 | $gt | greater then | { id: { $gt: 200 } } |
 | $gte | greater then or equal | { id: { $gte: 200 } }
 | $ne | not equal | { id: { $ne: 200 } } |

##### Uses-1
```
var searchResult = myDb.find("user",{ id: { $gte: 4 } });
```
##### Uses-2
```
var searchResult = myDb.find("user", {
            $or: [{ id: 1 }, { name: "kk" }],
            salary: 15
        });
```
##### Uses-3
```
var searchResult = myDb.find({
            $or: [
                { isbn: { $gte: 2000 } },
                { writer: { $ne: "df" } }
            ],
            name: { $ne: "df" },
            price:{$lt:5000}
        });
```

#### 6. Update
TODO
```

```


#### 7. Delete
TODO
```
var isDel = myDb.delete({ isbn: 2346 });
```


### Todos
 - Write MORE use cases for find
 - Write MORE use cases for update
 - Write MORE use cases for delete
 - 

License
----
[MIT](LICENSE)
