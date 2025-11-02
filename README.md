## Jak to odpalić?

### Wymagania
- docker

### Opcja 1. Aplikacja lokalnie baza na dockerze
```bash
  docker-compose up postgres -d
  npm run start:dev
```

### Opcja 2. Wszystko w dockerze
```bash
   docker-compose up --build
```

## O tym projekcie
- Mógł zostać napisany w czystym js, ale jak się bawić to się bawić
- docker wykorzystany jest tu po to żeby przyokazji zrobić zadanie z części devopsowej

## O deployu
- Został zrobiony bardzo leniwie za pomocą platformy render i dockera. Troszeczkę późno dowiedziałem się, że mogę się zrekrutować w wasze szeregi xd 
- Aplikacje możecie znaleźć w tym miejscu: https://cocktail-api-sfey.onrender.com/api