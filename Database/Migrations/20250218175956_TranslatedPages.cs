using Domain.Pages;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TranslatedPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          migrationBuilder.AddColumn<Dictionary<string, PageI18NData>>(
            name: "Translations",
            schema: "Guben",
            table: "Page",
            type: "jsonb",
            nullable: true);

          migrationBuilder.Sql(@"
            UPDATE ""Guben"".""Page""
            SET ""Translations"" = jsonb_build_object(
              'DE',
              jsonb_build_object(
                'Title', ""Title"",
                'Description', ""Description""
              )
            )
            WHERE ""Title"" IS NOT NULL OR ""Description"" IS NOT NULL;
          ");

          migrationBuilder.AlterColumn<Dictionary<string, PageI18NData>>(
            name: "Translations",
            schema: "Guben",
            table: "Page",
            type: "jsonb",
            nullable: false);

          migrationBuilder.DropColumn(
            name: "Description",
            schema: "Guben",
            table: "Page");

          migrationBuilder.DropColumn(
            name: "Title",
            schema: "Guben",
            table: "Page");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                schema: "Guben",
                table: "Page");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Guben",
                table: "Page",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Guben",
                table: "Page",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
