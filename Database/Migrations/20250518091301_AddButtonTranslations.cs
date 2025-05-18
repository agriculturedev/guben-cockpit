using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddButtonTranslations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Button_Title",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.DropColumn(
                name: "Button_Url",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Button_Translations",
                schema: "Guben",
                table: "InformationCard",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Button_Translations",
                schema: "Guben",
                table: "InformationCard");

            migrationBuilder.AddColumn<string>(
                name: "Button_Title",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Button_Url",
                schema: "Guben",
                table: "InformationCard",
                type: "text",
                nullable: true);
        }
    }
}
