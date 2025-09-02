namespace Jobs.EventImporter;

public static class CategoryMapping
{
    public static readonly Dictionary<string, (int Id, string Name)> Map = new()
    {
        { "Ausstellung", (100000, "Mobilität & Tourismus") },
        { "Exkursion / Wanderung", (100000, "Mobilität & Tourismus") },
        { "Führung / Besichtigung", (100000, "Mobilität & Tourismus") },
        { "Chor / Folklore / Volksmusik", (100000, "Mobilität & Tourismus") },
        { "Historische Stadtkerne", (100000, "Mobilität & Tourismus") },
        { "Workshop / Seminar", (100000, "Mobilität & Tourismus") },
        { "Fest / Brauchtum", (100000, "Mobilität & Tourismus") },
        { "Lesung / Vortrag", (100000, "Mobilität & Tourismus") },
        { "Theater / Tanz / Kabarett", (100000, "Mobilität & Tourismus") },
        { "Film", (100000, "Mobilität & Tourismus") },
        { "Lust auf NaTour", (100000, "Mobilität & Tourismus") },
        { "Rock / Pop / Jazz", (100000, "Mobilität & Tourismus") },
        { "Klassisches Konzert / Oper", (100000, "Mobilität & Tourismus") },
        { "Musical", (100000, "Mobilität & Tourismus") },
        { "Radtouren", (100000, "Mobilität & Tourismus") },
        { "Weihnachtsmarkt", (100000, "Mobilität & Tourismus") },
        { "Industriekultur", (100000, "Mobilität & Tourismus") },
        { "Silvester", (100000, "Mobilität & Tourismus") },
        
        { "Sport", (100001, "Sport & Gesundheit") },
        { "Wellness / Gesundheit", (100001, "Sport & Gesundheit") },
        
        { "Markt", (100002, "Stadtentwicklung & Teilhabe") },
        { "Essen und Trinken", (100002, "Stadtentwicklung & Teilhabe") },
        { "Großveranstaltung", (100002, "Stadtentwicklung & Teilhabe") },
        { "Schlösser, Parks und Gärten", (100002, "Stadtentwicklung & Teilhabe") },
        
        { "Rund ums Wasser", (100003, "Gefahrenabwehr & Umwelt") },
        { "Kinder und Jugendliche", (100004, "Kinder & Jugend") },
        { "Tagung / Messe", (100005, "Energie & Wirtschaft") }
    };
}