using Domain.Locations;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AddColumn<Dictionary<string, LocationI18NData>>(
            name: "Translations",
            schema: "Guben",
            table: "Location",
            type: "jsonb",
            nullable: true);

          migrationBuilder.Sql(@"
              UPDATE ""Guben"".""Location""
              SET ""Translations"" = jsonb_build_object(
                'de',
                jsonb_build_object(
                  'Name', ""Name""
                )
              )
            ");

          migrationBuilder.AlterColumn<Dictionary<string, LocationI18NData>>(
            name: "Translations",
            schema: "Guben",
            table: "Location",
            type: "jsonb",
            nullable: false);

          migrationBuilder.DropColumn(
              name: "Name",
              schema: "Guben",
              table: "Location");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "Location");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                schema: "Guben",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
