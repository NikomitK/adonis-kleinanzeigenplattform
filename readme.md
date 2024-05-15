# Nur kurz paar anmerkungen zum Code, die nicht wirkich als Kommentar passen:

## NODE_ENV=production
Ich hab in der .env datei diese Variable auf production gesetzt, dass man meine Fehlerseiten sehen kann, wenn man etwas falsch gemacht hat.

## Entrypoints
Laut der [Dokumentation](https://docs.adonisjs.com/guides/assets-bundling#including-entrypoints-in-edge-templates) ist es best practice, die css dateien in der js datei zu importieren, und dann nur die js datei in der edge datei zu importieren. Dadurch wird auch automatisch der SASS code compiled. Im development mode ist das sehr langsam, allerdings wird das beim Production build automatisch wieder aufgeteilt, und das css als eigene datei eingebunden, weshalb es wieder schnell ist. Für Abgabe werd ich das selbst aufteilen, damit das testen der website erträglicher wird.

## Exception handling
An manchen Stellen benutze ich HTTP Fehlermeldungen wie 403, 404, etc. Dies wird nicht über die Methoden "response.notFound()" etc. gemacht, sondern mit "throw new Exception", da sonst der Adonisjs exception handler nicht funktioniert und nirgends ersichtlich dokumentiert ist, wie man das richtig machen würde.