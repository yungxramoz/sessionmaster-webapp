# WJ Projekt - Sandro Gerber

- [WJ Projekt - Sandro Gerber](#wj-projekt---sandro-gerber)
  - [Planung](#planung)
    - [Projektidee](#projektidee)
    - [Technologien / Libraries im Einsatz](#technologien--libraries-im-einsatz)
    - [Mockups](#mockups)
    - [Vorgensweise](#vorgensweise)
  - [Arbeitsjournal](#arbeitsjournal)
    - [Backend](#backend)
    - [Frontend](#frontend)
      - [Abweichung vom Mockup](#abweichung-vom-mockup)
      - [Projekt Architektur](#projekt-architektur)
      - [Atomic Design Concept](#atomic-design-concept)
      - [Extend Vuetify](#extend-vuetify)
  - [Fazit](#fazit)
    - [Was lief gut?](#was-lief-gut)
    - [Wo gibt es Verbesserungspotential?](#wo-gibt-es-verbesserungspotential)

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

Die Entwicklung der Brettspiel Sammlung im Frontend verlief fast reibungslos. Meistens musste ich noch kleinigkeiten im Backend anpassen.

- POST braucht als Body ein Objekt und kann nicht nur als `string` besetehen (.NET Core)
- DELETE der Parameter `boardGameId` musste direkt in die Route mitgegeben werden (einheitliche API Schnittstelle)

Die Funktionalität konnte ich am **04.05.2021** fertiggstellen. Zusätzlich wurden Cypress E2E Tests geschrieben, welche die Korrektheit des Features überprüfen. Follgende Tests wurden beschrieben und erfolgreich durchgeführt:

- Add board game to collection
  - shows initialy a message to add board games
  - adds board game
  - does not display already added board games in search
  - displays information that no board game was found
- Remove board game from collection
  - removes board game

Der Projektaufbau basiert auf einer n-Layer Architektur. Diese Funktionalität wurde in die bestehende Architektur implementiert ohne weitere Anpassungen vorzunehmen.

1. View Models der Collection Domain übernehmen
2. Collection API Service entwickeln
3. Collection Module dem Vuex Store hinzufügen
4. Collection Page erstellen
5. Vue Router Konfiguration anpassen

Damit Fehler global angezeigt werden können, baute ich zusätlich ein Store-Modul für Alerts (`alert-module`)

#### Abweichung vom Mockup

In der Umsetzung bemerkte ich, dass einige Brettspiele kein Bild haben. Dies ist beim hinzufügen von Spielen der Collection nicht wirklich geeignet, da die aussagekräftige Information fehlt. Deshalb erstetze ich das Grid durch eine Liste bestehend aus dem Bild und dem Namen des Brettspiels. Das ganze muss ja "Mobile-First" entworfen werden. Zusätzlich habe ich ein Dialog entwickelt, der die Details der Brettspiele anzeigt.

Geplant:

![Geplantes UI](/assets/wj_planned.png)

Anpassung bei der Realisierung:

![Umgesetztes UI](/assets/wj_implementation.png)

#### Projekt Architektur

Da Vuex die Daten nicht persistent abspeichert, muss neben dem Store ein `localStorage` eingesetzt werden. Da werden Daten abgelegt die auch nach einem Reload bestehen müssen, wie das JWT Access Token für die Authentifizierung.

![Architektur](/assets/wj_architektur.png)

#### Atomic Design Concept

Die Components werden nach dem Atomic Design System strukturiert. Die kleinste Ein-heit wird «Atoms» genannt (z.B. Textfelder, Labels, Buttons, etc.). Mehrere «Atoms» zu-sammen formen ein «Molecule» (z.B. SearchField, PasswordField). Mehrere «Molecules» zusammen bilden wiederum ein «Organism» (z.B. Toolbar). Diese Components werden dann in ein Template gepackt und schliesslich zusammengefasst zu einer Page.

![Atimic Design](/assets/wj_atomic.png)

#### Extend Vuetify

Die eingesetzte Library Vuetify bietet keine Möglichkeit, global default Properties einzusetzten. Deshalb werden die Komponenten durch vererbung abstrahiert, mit einem Prefix (Yr) versehen und dann Projektweit eingesetzt. Dies bietet die Möglichkeit durch eine Zeile den Style z.B. eines Textfields applikationsweit zu ändern. Diese Komponenten entsprechen im Atomic-Design einem Atom.

```ts
<script lang="ts">
import { VTextField } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrTextField extends VTextField {
  @Prop({ default: true }) public filled!: boolean | string
  @Prop({ default: 'secondary darken-1' }) public color!: string
}
</script>
```

## Fazit

### Was lief gut?

Die Arbeit konnte in der geplanten Zeit entwickelt werden. Das UI sieht sehr sauber aus und das State Management wurde schön gelöst. Durch Promises von der Komponente zum Store und dann bis zum Service, kann der State der Daten (Store) und des UIs (Komponente) sehr zuverlässig und sauber gelöst werden.

Die klare Definition der Software Architektur hat sehr gut unterstützt. Durch das Single Responsibility Prinzip, wusste ich immer in welchem File ich beim debuggen suchen und in welchen Files ich Anpassungen machen musste.

Die Abstrahierung der Vuetify Komponenten ist wohl die beste Idee des Projekts. So kann ich die ganzen Komponenten wie normale Vuetify Komponenten (so auch ihre Dokumentation nutzen) nutzen aber habe trotzdem die Möglichkeit sie global zu steuern.

### Wo gibt es Verbesserungspotential?

Die Page wurde zwar in Komponenten unterteilt, könnte aber noch weiter aufgesplittet. Das `template` der `Collection.vue` Komponente ist alleine schon 120 Zeilen lang. Eine Verbesserung wäre, die ganzen genutzten Dialoge in eigene Komponenten auszulagern. Das Details Dialog beim "Add" ist eigneltich das gleiche wie beim Remove.
