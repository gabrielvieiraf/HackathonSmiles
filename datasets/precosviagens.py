import random
import pandas as pd

# Definindo max de colunas e linhas
pd.set_option("display.html.table_schema", True)
pd.set_option("display.max_colwidth", 10000)
pd.set_option("display.max_rows", 10000)
pd.set_option("display.max_columns", 10000)

# Criando listas
aux = list()
lista = list()

for n in range(4):
    aux.append(random.randrange(950, 1050))

aux.sort()

for i in range(100):
    if random.randrange(1, 61) == 1:
        lista.append(random.randrange(2000, 2501))

    elif random.randrange(1, 16) == 1:
        lista.append(aux[0])
    elif random.randrange(1, 7) == 1:
        lista.append(aux[1])
    elif random.randrange(1, 6) != 1:
        lista.append(aux[2])
    else:
        lista.append(aux[3])

df = pd.DataFrame(lista)
print(df)
