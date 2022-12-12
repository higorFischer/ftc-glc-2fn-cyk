# Se não Tiver node.

[NodeJS](https://nodejs.org/en/download/)

# Para testar online, acesse o [link](https://pucflap.herokuapp.com/)

# Para instalar dependências

```
npm install
```

Ou

```
yarn
```

# Para rodar no terminal

```
npm run start file=<filename>
```

ou

```
yarn start file=<filename>
```

```
EX:
  npm run start file=files/in.txt
  OR
  yarn start file=files/in.txt
```

Para poder rodar no sistema, precisa existir um arquivo no seguinte formato:
S <- Initial
a,b,c <- Terminals
RULES
S:AB|BC
A:BA|a
B:CC|b
C:AB|a
RULES
WORDS
baaba
WORDS
TIMES
5
TIMES

Onde entre as RULES ficam as regras no formato:
<variable>:<rule>|<rule>

Entre as WORDS ficam as palavras a serem testadas
e entre os TIMES ficam a quantidade de vezes que se quer testar os items.
