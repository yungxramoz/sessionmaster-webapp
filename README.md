- [WJ Projekt - Sandro Gerber](#wj-projekt---sandro-gerber)
  - [Planung](#planung)
    - [Projektidee](#projektidee)
    - [Technologien / Libraries im Einsatz](#technologien--libraries-im-einsatz)
    - [Mockups](#mockups)
    - [Vorgensweise](#vorgensweise)
  - [Arbeitsjournal](#arbeitsjournal)
    - [Backend](#backend)
    - [Frontend](#frontend)
      - [Projekt Architektur](#projekt-architektur)
      - [Atomic Design Concept](#atomic-design-concept)
      - [Extend Vuetify](#extend-vuetify)
  - [Fazit](#fazit)

---

# WJ Projekt - Sandro Gerber

## Planung

### Projektidee

Zum Startpunkt dieser Projektarbeit ist die Authentifizierung bereits implementiert.

In diesem Projekt soll der blau markierte Teil für registirerte Benutzer implementiert werden.

1. Brettspiele laden
2. Brettspiele der Sammlung hinzufügen
3. Brettspiele von der Sammlung entfernen

### Technologien / Libraries im Einsatz

- Vue 2
- TypeScript 4
- Vuex 3
- Vue Router
- Vuetify
- Vue Class based components:
  - vue-class-component
  - vue-class-decorator
- axios

### Mockups

![Mockup](/assets/wj_mockup.png)

### Vorgensweise

Die Funktion ist Bestandteil meiner Diplomarbeit. Da ich die gleichen Technologien einsetzte wie in diesem Modul verlangt wird, macht es durchaus Sinn, hier weiter zu arbeiten. Die Planung für diese Funktionalität schneidet sich gerade mit dem Abgabe Termin.

![Projektplan](/assets/wj_projektplan.png)

| Tätigkeit                | Erleidgt bis |
| ------------------------ | -----------: |
| _API erweitern_          | _30.04.2021_ |
| Frontend umsetzen        |   05.05.2021 |
| Präsentation vorbereiten |   07.05.2021 |

## Arbeitsjournal

### Backend

Um die Funktion Nutzen zu können, muss jedoch zuerst die API entwickelt werden. Die API ist auf einem privaten GitHub Repository. Um die API dennoch einfach nutzen zu können, habe ich diese auf Azure deployed. Die URL wurde in diesem Projekt im .env.production definiert und funktioniert im Production-Build.

Um das Projekt im Production Build starten zu können, muss `serve` installiert werden.

```
yarn global add serve
```

```
yarn build
serve dist
```

### Frontend

#### Projekt Architektur

#### Atomic Design Concept

#### Extend Vuetify

## Fazit
