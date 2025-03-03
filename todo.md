# Guben feedback
## Admin panel
### Dashboard
- Projects for the dashboard tabs can be selected `what do they mean? do they want to add projects on the dashboard tabs now??`
- event category for the tabs on the dashboard (Automatic display of the next event from this category)  `what?? there are no events on the dashboard??`
- Uploading documents for download via the dashboard `???`

### Projekte
- Adding data sources for display
- Activating data sources for display & adjusting the tile logic (admin only) `what do they mean with 'tile logic' (kachellogik)?`

### Map layers
- Adding data sources for display & adjust styling `what styling do they want to change?`
- Activating data sources for display (admin only) `do they mean that anyone can add layers but the admin has to 'approve' it to be visible?`

### events
- Adding data sources for display
- Activating data sources for display & adjusting the tile structure (admin only) `what do they mean with 'tile structure' (kachelaufbaus)?`

### public view
- fix footer
  - Impressum: https://smart.guben.de/impressum
  - Datenschutz: https://smart.guben.de/datenschutz
  - Stadtlogo nach unten `in the footer?`
  - SC logo oben
  - 
### dashboard tabs
- is the selection of topics correct? duplication in culture and social tab

## backend
### Übersichtlichkeit herstellen

### Datensatze/Einzeleintrage -> `all of this is unclear, no idea what they want to display or where and how`
e.g. display of imported data from the
TMB interface, the Guben website interface, WFS links of the
geodata from the LK, BB ... ) with the option to create additional data sets
(file upload or link)

### collections
Assigning the data records to a category (e.g.
event categories) & option to create additional categories and assigning data records/individual entries to each (e.g. for projects)

### module
Assigning “collections” & “data sets” per module (dashboard, map, events, projects) `what do they mean here?`

### masterportal im strapi anzeigen `strapi is gone but this will be added to admin page then`
- WMS / WFS display & create links
- upload your own geodata
- Some GIS layers are not active

### Add more data in strapi `again, strapi gone but will be added to admin page`
- Integrate the citizen information system interface! `?? this is already visible on the event page`
- e.g. clubs complement projects `what does this even mean?`

### Creation of SC measure profiles (SC-Maßnahmensteckbriefen) for the projects -> `???`

## Frontend

### General
- Footer
- Texts: Display umlauts correctly & do styling
- Insert SC logo above `this is already there in the header?`
- Insert photos - create uniformity, e.g. for traffic indicators `what? which photos? insert them where? what is Verkehrs Kennzahlen?`
- display 3-4 tiles per category `in the events? in the projects? unclear`
- Service-Portal Button nach Oben zu den “Modulen” : ja `???`
- Adjust button colors (red)
- colored filters to be faster (e.g. highlighting events by category) - Intuitive use `do they mean the colors that we show when you select a category, also show it in the dropdown and on the cards?`
- false or simulated data should be marked `???`
- Display texts when the mouse hovers over the “modules” (map, events, projects, dashboard) `you mean the navigation items? this is already there`

### Events
- Filter by locations/km (Guben, +10km, 15km, 20-50km)
- Show location on tile `already there`
- Benutzerdefiniert (für Zeiten bspw. am xx.xx.xxxx) `???`
- Styling vom Datum anpassen “Startdatum” - “Enddatum” `adjust styling to what??`
- Insert events from the city (Bibo, city museum, etc.)
  - kasia will provide excel
  - Remove duplicate events (same name) -> `no, some events have the same name but on different dates, if there are any duplicate events, GUBEN should fix it, we just take their data`
- LINK: TMB Eintragen von Veranstaltungen (How-to) `???`
- Sortierung `what? need more options? want a default? need more info`

### Projects
- Above: Button to Consul & Industry Guide (including business hours / shopping hours?) `where do I find this data?`
- Sort projects below by category (ST, NM, KU, WE, GK or categories of the Guben website?)
  - Projects only from the city `we import whatever they give us, if they want a filter on the projects it will need to be more specific or they have to give only that data`
  - SV-App categories do not exist in this form `???`
  - Use TAGS? `???`
- Branchenführer als eigene Produktkachel - dort dann die Gewerbetreibende `???`

### Gesundheitskooperation einbinden? https://www.naemi-wilke-stift.de/krankenhaus/gesundheitskooperation/ `???`


# extra questions

- what do we do when an event only has german translations and the user is asking for english, do we not show these, do we show the german translation? -> `fallback to german`
