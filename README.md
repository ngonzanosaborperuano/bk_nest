src

- common
  ——— decorators
  ——— dtos
  ——— filters
  ——— guards
  ——— interceptors
  ——— middleware
  ——— pipes
  — common.controller.ts
  — common.module.ts
  — common.service.ts

--prod
npm run build
npm run start

--dev
npm run start:dev

=====================================================================
PRUEBAS

--pruebas
npm run test

--reporte de covertura
npm run test:cov

--en tiempo real
npm run test:watch

--reporte en navegador
open coverage/lcov-report/index.html

=====================================================================
REDIS
--habilitar redis para guardar cache
redis-server

--entrar en redis
redis-cli

--ver keys
keys \*

====================
ssh
ssh -i ~/.ssh/gcp_key -L 5433:10.128.0.2:5432 niltongonzano@34.69.157.202

{
"email": "nigorora@gmail.com",
"password": "gdikoYtw8jT6JJzBAONXauxYql82"
}
