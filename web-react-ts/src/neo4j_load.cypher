match () -[r]-> () delete r;
match (n) delete n;

load csv from 'file:///projects.csv' as line
merge (n:Project {id: line[0], name: line[1]});

load csv from 'file:///todos.csv' as line
merge (n:Todo {id: line[0], name: line[1]});

load csv from 'file:///todos.csv' as line
merge (n:Todo {id: line[0], name: line[1]});

load csv from 'file:///project_dependencies.csv' as line
match (a:Project {id: line[0]})
match (b:Todo {id: line[1]})
merge (a) -[dependency:DEPENDS_ON]-> (b);

load csv from 'file:///todo_dependencies.csv' as line
match (a:Todo {id: line[0]})
match (b:Todo {id: line[1]})
merge (a) -[dependency:DEPENDS_ON]-> (b);
