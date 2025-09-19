using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class MoveDescriptionAndFullTextToI18N : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Guben",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "FullText",
                schema: "Guben",
                table: "Project");

            migrationBuilder.AddColumn<string>(
                name: "Translations",
                schema: "Guben",
                table: "Project",
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
                table: "Project");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Guben",
                table: "Project",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullText",
                schema: "Guben",
                table: "Project",
                type: "text",
                nullable: true);
        }
    }
}
