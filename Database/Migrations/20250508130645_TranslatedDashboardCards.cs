using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedDashboardCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "ImageAlt",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "Title",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                schema: "Guben",
                table: "InformationCard",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageAlt",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);
        }
    }
}
