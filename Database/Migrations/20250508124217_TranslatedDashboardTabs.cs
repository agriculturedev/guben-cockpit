using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedDashboardTabs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Translations",
                schema: "Guben",
                table: "DashboardTab",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(@"
            UPDATE ""Guben"".""DashboardTab""
            SET ""Translations"" = jsonb_build_object(
              'de',
              jsonb_build_object(
                'Title', ""Title""
              )
            )
          ");

            migrationBuilder.DropColumn(
              name: "Title",
              schema: "Guben",
              table: "DashboardTab");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "DashboardTab");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Guben",
                table: "DashboardTab",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
