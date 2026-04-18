-- Seed inicial de alunos (idempotente)
INSERT INTO "alunos" ("numero", "nomeGuerra", "nomeCompleto", "anoFormatura", "curso")
VALUES
  (23048, 'Mineiro', 'Luiz Fernando Mineiro', 27, 'Computacao'),
  (23002, 'Alisson', 'Alisson Santana', 27, 'Computacao'),
  (23053, 'Nivaldo', 'Nivaldo Pereira', 27, 'Computacao'),
  (24042, 'Oliveira', 'Lohana de Oliveira', 28, 'Computacao')
ON CONFLICT ("numero") DO UPDATE
SET
  "nomeGuerra" = EXCLUDED."nomeGuerra",
  "nomeCompleto" = EXCLUDED."nomeCompleto",
  "anoFormatura" = EXCLUDED."anoFormatura",
  "curso" = EXCLUDED."curso";
