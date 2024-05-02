# Nur kurz paar anmerkungen zum Code, die nicht wirkich als Kommentar passen:

## Middleware
Die middleware dateien wurden vom Template vorgeneriert und ich benutze sie nicht, allerdings war ich nicht sicher, ob ich die einfach so löschen kann, weil die z.B. in kernel.ts importiert wird.

## Entrypoints
Laut der [Dokumentation](https://docs.adonisjs.com/guides/assets-bundling#including-entrypoints-in-edge-templates) ist es best practice, die css dateien in der js datei zu importieren, und dann nur die js datei in der edge datei zu importieren. Im development mode ist das sehr langsam, allerdings wird im production mode die css datei automatisch seperat eingebunden, soweit ich das verstanden hab.

## SCSS
Ergänzend zum vorherigen Punkt hab ich bootstrap in meine styles.scss datei importiert, und vite compiliert das dann automatisch bei der ausführung (bzw. bei einem prod build) zu css, ohne dass man selbst sass benutzen muss. Das wird [hier](https://getbootstrap.com/docs/5.3/getting-started/vite/#import-bootstrap) erklärt.