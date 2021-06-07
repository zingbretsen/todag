FROM neo4j:4.2-community

RUN echo "dbms.security.procedures.unrestricted=apoc.*" >> conf/neo4j.conf

RUN cd plugins/ && wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/4.2.0.4/apoc-4.2.0.4-all.jar
