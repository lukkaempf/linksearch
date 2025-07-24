# Link Manager App

Eine React-Anwendung zum Speichern, Verwalten und Durchsuchen von Lesezeichen/Links mit Ordnern und Tags. Nutzt Supabase mit PostgreSQL für erweiterte Fulltext-Suche.

## ✨ Features

- Link-Verwaltung: Erstellen, Bearbeiten und Löschen von Links.

- Ordner: Organisiere Links in benutzerdefinierten Ordnern oder unorganisiert.

- Fulltext-Suche: Suche über Titel, URL, Beschreibung und Labels mit PostgreSQL.

- Manuelle Labels oder automatische Labels via Webscraping der Seite, um die Fulltext-Suche zu füllen

## 🚀 Installation und Setup

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Supabase Account (kostenlos bei [supabase.com](https://supabase.com))

### Installation

1. **Repository klonen:**

   ```bash
   git clone https://github.com/lukkaempf/linksearch.git
   cd linksearch
   ```

2. **Dependencies installieren:**

   ```bash
   npm install
   ```

3. **Supabase-Projekt einrichten:**
   - Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
   - Erstelle ein neues Projekt
   - Gehe zu Settings > API und kopiere deine Credentials
   - Führe das SQL-Script `supabase-setup.sql` in deinem Supabase SQL Editor aus

4. **Umgebungsvariablen konfigurieren:**
   ```bash
   cp .env.example .env
   # Trage deine Supabase-Credentials in die .env-Datei ein
   ```

5. **Development-Server starten:**
   ```bash
   npm run dev
   ```
   Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

### Supabase-Datenbank Setup

Das Projekt verwendet eine spezielle JSONB-Struktur für optimale Fulltext-Suche:

1. **Tabellen:**
   - `links`: Speichert Link-Daten als JSONB mit zusätzlichem `search_content` Feld
   - `folders`: Speichert Ordner-Daten als JSONB

2. **Fulltext-Search Features:**
   - PostgreSQL GIN-Index für schnelle Textsuche
   - Deutsche Sprachunterstützung für Stemming
   - Ranking nach Relevanz

3. **SQL-Setup ausführen:**
   ```sql
   -- Führe den Inhalt von supabase-setup.sql in deinem Supabase SQL Editor aus
   ```

### Verfügbare Scripts

- `npm run dev` - Startet den Development-Server
- `npm run build` - Erstellt einen Produktions-Build
- `npm run preview` - Zeigt eine Vorschau des Produktions-Builds
- `npm run lint` - Führt ESLint-Checks durch

## 🔍 Fulltext-Suche

Die App nutzt PostgreSQL's erweiterte Fulltext-Suche-Features:

- **Einfache Suche**: Durchsucht alle relevanten Felder
- **Erweiterte Suche**: Nutzt PostgreSQL's `to_tsvector` und `plainto_tsquery`
- **Stemming**: Findet auch verwandte Wortformen (z.B. "entwickeln" findet auch "Entwicklung")
- **Ranking**: Sortiert Ergebnisse nach Relevanz

## 🛠 Technischer Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL)
- **Datenstruktur**: JSONB für flexible Datenspeicherung
- **Suche**: PostgreSQL Full-Text Search mit GIN-Indizes
