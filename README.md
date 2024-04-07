# zwitscher-api
Der Einfachheit geschuldet haben wir ein Docker Image für die Zwitscher API erstellt. Im folgenden Text wird die Installation und das Starten dieser API erklärt und Schritt für Schritt durchgegangen.

### 1. Docker installieren
Docker kann ganz einfach wie eine herkömmliche Anwendung heruntergeladen und installiert werden. Erstmal muss man die Docker Desktop Anwendung unter folgendem Link herunterladen und den Intruktionen des Installers folgen.
https://docs.docker.com/engine/install/

### 2. Docker Image pullen
Bevor das Docker Image und somit der Server ausgeführt werden kann, muss das Docker Image heruntergeladen werden. Das Image kann mit dem folgenden Befehl heruntergeladen werden.
```bash
docker pull thejonasliendl/zwitscher-api:latest
```

### 3. Docker Image ausführen
Im folgenden ist der Befehl zum Ausführen des Docker Images aufgeführt. Dieser kann ganz einfach in einer beliebigen Konsole ausgeführt werden. Den Namen der Instanz (momentan `inone`) kann durch einen beliebigen Namen ausgetauscht werden, oder ganz entfernt werden. Zum Entfernen muss auch die *Flag* `--name` entfernt werden.

Auch der Port auf dem der Server abrufbar ist kann verändert werden. Dazu kann die Zahl vor dem Doppelpunkt zu einem beliebigen Port verändert werden. Die Zahl hinter dem Doppelpunkt darf nicht verändert werden!
> ⛔️ Beachte bitte, dass das Ändern des Ports Auswirkungen auf die Verbindung zwischen Front- und Backend hat.
```bash
docker run --name inone -p 8080:8080 -d thejonasliendl/zwitscher-api
```
